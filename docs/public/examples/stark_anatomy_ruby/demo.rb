# frozen_string_literal: true

# Teaching demo: an AIR-style trace check followed by a FRI low-degree proof.
# This deliberately is not a complete or zero-knowledge STARK construction.
require 'json'
require_relative 'field'
require_relative 'polynomial'
require_relative 'fri'

p = 17
omega = 3 # order 16 in F_17
offset = 2
trace = [3, 9, 13, 16]
raise 'boundary check failed' unless trace.first == 3 && trace.last == 16
raise 'transition check failed' unless trace.each_cons(2).all? { |a, b| b == a * a % p }

trace_domain = Array.new(trace.length) { |i| omega.pow(i, p) }
trace_polynomial = StarkAnatomyRuby::Polynomial.interpolate(trace_domain, trace, p)
fri_domain = Array.new(16) { |i| offset * omega.pow(i, p) % p }
codeword = fri_domain.map { |x| StarkAnatomyRuby::Polynomial.evaluate(trace_polynomial, x, p) }

fri = StarkAnatomyRuby::FRI.new(
  p: p, offset: offset, omega: omega, domain_size: 16,
  expansion_factor: 4, queries: 1
)
proof = fri.prove(codeword)
raise 'FRI verification failed' unless fri.verify(proof)

tampered = JSON.parse(proof)
tampered.fetch('openings').first.first['left'] = (tampered.fetch('openings').first.first.fetch('left') + 1) % p
raise 'tampered proof was accepted' if fri.verify(JSON.generate(tampered))

puts "Trace: #{trace.join(' -> ')}"
puts "Interpolated trace polynomial coefficients (low to high): #{trace_polynomial.inspect}"
puts "FRI domain values: #{codeword.inspect}"
puts "FRI proof bytes: #{proof.bytesize}"
puts 'FRI verifier accepted the low-degree table.'
puts 'FRI verifier rejected a modified query value.'
puts 'Scope: this demo does not prove AIR constraints inside the FRI proof and is not a secure STARK or a zero-knowledge proof.'
