# frozen_string_literal: true

# Coefficient arrays are in ascending order: [a0, a1, ...] means
# a0 + a1*X + ... . All operations are over F_p.
module StarkAnatomyRuby
  module Polynomial
    module_function

    def add(a, b, p)
      Array.new([a.length, b.length].max) { |i| ((a[i] || 0) + (b[i] || 0)) % p }.then { |x| trim_with(x, p) }
    end

    def sub(a, b, p)
      Array.new([a.length, b.length].max) { |i| ((a[i] || 0) - (b[i] || 0)) % p }.then { |x| trim_with(x, p) }
    end

    def mul(a, b, p)
      return [0] if a.empty? || b.empty?

      result = Array.new(a.length + b.length - 1, 0)
      a.each_with_index do |x, i|
        b.each_with_index { |y, j| result[i + j] = (result[i + j] + x * y) % p }
      end
      trim_with(result, p)
    end

    def scale(poly, scalar, p) = trim_with(poly.map { |x| x * scalar % p }, p)

    def evaluate(poly, x, p)
      poly.reverse.reduce(0) { |acc, coefficient| (acc * x + coefficient) % p }
    end

    # Lagrange interpolation. The x values must be distinct in F_p.
    def interpolate(xs, ys, p)
      raise ArgumentError, 'x/y lengths differ' unless xs.length == ys.length
      raise ArgumentError, 'duplicate interpolation points' unless xs.map { |x| x % p }.uniq.length == xs.length

      xs.each_index.reduce([0]) do |sum, i|
        basis = [1]
        denominator = 1
        xs.each_index do |j|
          next if i == j

          basis = mul(basis, [(-xs[j]) % p, 1], p)
          denominator = denominator * (xs[i] - xs[j]) % p
        end
        coefficient = ys[i] * StarkAnatomyRuby::Field.inv(denominator, p) % p
        add(sum, scale(basis, coefficient, p), p)
      end
    end

    def trim_with(poly, p)
      result = poly.map { |x| x % p }
      result.pop while result.length > 1 && result[-1].zero?
      result
    end
  end
end
