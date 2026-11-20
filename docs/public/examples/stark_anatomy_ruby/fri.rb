# frozen_string_literal: true

require 'json'
require 'digest'
require_relative 'field'
require_relative 'merkle'
require_relative 'polynomial'

# Educational FRI prover/verifier over a multiplicative subgroup coset.
# The proof demonstrates low-degree proximity only; it does not prove AIR.
module StarkAnatomyRuby
  class FRI
    attr_reader :p, :offset, :omega, :expansion_factor, :queries, :domain_size

    def initialize(p:, offset:, omega:, domain_size:, expansion_factor:, queries:)
      raise ArgumentError, 'domain size must be a power of two' unless domain_size.positive? && (domain_size & (domain_size - 1)).zero?
      raise ArgumentError, 'expansion factor must be a power of two >= 2' unless expansion_factor >= 2 && (expansion_factor & (expansion_factor - 1)).zero?
      raise ArgumentError, 'expansion factor exceeds domain size' if expansion_factor > domain_size
      raise ArgumentError, 'query count must be positive' unless queries.positive?

      @p = p
      @offset = offset % p
      @omega = omega % p
      @domain_size = domain_size
      @expansion_factor = expansion_factor
      @queries = queries
      raise ArgumentError, 'FRI parameters produce no folding round' if round_count < 1
      raise ArgumentError, 'query count exceeds final codeword size' if queries > final_domain_size
      raise ArgumentError, 'omega is not a root of unity of the requested order' unless pow(@omega, domain_size) == 1 && pow(@omega, domain_size / 2) != 1
      raise ArgumentError, 'offset must be nonzero' if @offset.zero?
    end

    def prove(codeword)
      raise ArgumentError, 'codeword length differs from FRI domain' unless codeword.length == domain_size
      raise ArgumentError, 'query count exceeds final domain' if queries > final_domain_size

      codewords = [codeword.map { |value| value % p }]
      roots = []
      alphas = []
      transcript = { 'roots' => [] }
      current_omega = omega
      current_offset = offset

      while alphas.length < round_count - 1
        # Fix this round's table before deriving the challenge from the transcript.
        roots << Merkle.root(codewords.last)
        transcript['roots'] << roots.last
        alpha = challenge(transcript)
        alphas << alpha
        codewords << fold(codewords.last, alpha, current_offset, current_omega)
        current_omega = current_omega * current_omega % p
        current_offset = current_offset * current_offset % p
      end

      roots << Merkle.root(codewords.last)
      transcript['roots'] << roots.last
      transcript['final'] = codewords.last
      top_indices = sample_indices(transcript, domain_size / 2, final_domain_size, queries)
      openings = codewords.each_cons(2).each_with_index.map do |(current, following), round|
        round_indices = top_indices.map { |index| index % (current.length / 2) }
        round_indices.map do |index|
          left_index = index
          right_index = index + current.length / 2
          {
            'index' => index,
            'left' => current[left_index],
            'right' => current[right_index],
            'folded' => following[index],
            'left_path' => Merkle.open(current, left_index),
            'right_path' => Merkle.open(current, right_index),
            'folded_path' => Merkle.open(following, index)
          }
        end
      end

      JSON.generate('roots' => roots, 'final_codeword' => codewords.last, 'openings' => openings)
    end

    def verify(proof)
      data = JSON.parse(proof)
      roots = data.fetch('roots')
      final_codeword = data.fetch('final_codeword').map { |value| Integer(value) }
      expected_rounds = round_count
      return false unless roots.length == expected_rounds && data.fetch('openings').length == expected_rounds - 1
      return false unless final_codeword.length == domain_size >> (expected_rounds - 1)
      return false unless Merkle.root(final_codeword) == roots.last

      transcript = { 'roots' => [] }
      alphas = []
      expected_rounds.times do |round|
        transcript['roots'] << roots.fetch(round)
        alphas << challenge(transcript) if round < expected_rounds - 1
      end
      transcript['final'] = final_codeword
      top_indices = sample_indices(transcript, domain_size / 2, final_domain_size, queries)

      # Interpolate the last table and check the degree bound.
      last_size = final_codeword.length
      last_omega = pow(omega, 1 << (expected_rounds - 1))
      last_offset = pow(offset, 1 << (expected_rounds - 1))
      last_xs = Array.new(last_size) { |i| last_offset * pow(last_omega, i) % p }
      last_poly = Polynomial.interpolate(last_xs, final_codeword, p)
      degree_bound = (last_size / expansion_factor) - 1
      return false if last_poly.length - 1 > degree_bound

      data.fetch('openings').each_with_index do |round_openings, round|
        current_size = domain_size >> round
        current_offset = pow(offset, 1 << round)
        current_omega = pow(omega, 1 << round)
        round_indices = top_indices.map { |index| index % (current_size / 2) }
        return false unless round_openings.length == queries

        round_openings.zip(round_indices).each do |opening, index|
          return false unless opening.fetch('index') == index
          left = Integer(opening.fetch('left'))
          right = Integer(opening.fetch('right'))
          folded_value = Integer(opening.fetch('folded'))
          return false unless [left, right, folded_value].all? { |value| value.between?(0, p - 1) }
          return false unless Merkle.verify(roots.fetch(round), index, left, opening.fetch('left_path'))
          return false unless Merkle.verify(roots.fetch(round), index + current_size / 2, right, opening.fetch('right_path'))
          return false unless Merkle.verify(roots.fetch(round + 1), index, folded_value, opening.fetch('folded_path'))

          x = current_offset * pow(current_omega, index) % p
          expected = fold_pair(left, right, alphas.fetch(round), x)
          return false unless expected == folded_value
        end
      end
      true
    rescue ArgumentError, KeyError, JSON::ParserError, TypeError, ZeroDivisionError
      false
    end

    private

    def round_count
      size = domain_size
      rounds = 0
      while fold_again?(size)
        rounds += 1
        size /= 2
      end
      rounds
    end

    def final_domain_size = domain_size >> (round_count - 1)

    def fold_again?(size) = size > expansion_factor && 4 * queries < size

    def pow(base, exponent) = Field.pow(base, exponent, p)

    def challenge(transcript)
      Digest::SHA256.hexdigest("zk-fukuoka:fri-challenge:v1:#{JSON.generate(transcript)}").to_i(16) % p
    end

    def sample_indices(transcript, size, reduced_size, count)
      seed = Digest::SHA256.hexdigest("zk-fukuoka:fri-query:v1:#{JSON.generate(transcript)}")
      selected = []
      counter = 0
      while selected.length < count
        candidate = Digest::SHA256.hexdigest("#{seed}:#{counter}").to_i(16) % size
        selected << candidate unless selected.any? { |index| index % reduced_size == candidate % reduced_size }
        counter += 1
      end
      selected
    end

    def fold(codeword, alpha, current_offset, current_omega)
      half = codeword.length / 2
      Array.new(half) do |i|
        x = current_offset * pow(current_omega, i) % p
        fold_pair(codeword[i], codeword[i + half], alpha, x)
      end
    end

    def fold_pair(left, right, alpha, x)
      # For f(X)=f_even(X^2)+X*f_odd(X^2), the values at x and -x
      # recover both parts; this linear combination is f_even+alpha*f_odd.
      half = Field.inv(2, p)
      alpha_over_x = alpha * Field.inv(x, p) % p
      half * ((1 + alpha_over_x) * left + (1 - alpha_over_x) * right) % p
    end
  end
end
