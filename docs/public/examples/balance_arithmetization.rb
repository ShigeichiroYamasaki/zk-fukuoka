#!/usr/bin/env ruby
# Session 4: public amounts -> R1CS/QAP and AIR over F_101.
# Standard library only; an arithmetic teaching example, not a prover.
require 'optparse'

P = 101

def trim(a)
  a = a.map { |v| v % P }
  a = [0] if a.empty?
  a.pop while a.length > 1 && a[-1] == 0
  a
end

def padd(a, b)
  trim(Array.new([a.length, b.length].max) { |i| (a[i] || 0) + (b[i] || 0) })
end

def pscale(a, c)
  trim(a.map { |v| v * c })
end

def psub(a, b)
  padd(a, pscale(b, -1))
end

def pmul(a, b)
  c = Array.new(a.length + b.length - 1, 0)
  a.each_with_index { |x, i| b.each_with_index { |y, j| c[i + j] += x * y } }
  trim(c)
end

def pinv(a)
  a.pow(P - 2, P)
end

def pdivmod(a, b)
  a = trim(a.dup); b = trim(b)
  raise ZeroDivisionError, 'zero polynomial' if b == [0]
  q = Array.new([1, a.length - b.length + 1].max, 0)
  until a == [0] || a.length < b.length
    k = a.length - b.length
    c = a[-1] * pinv(b[-1]) % P
    q[k] = c
    a = psub(a, [0] * k + pscale(b, c))
  end
  [trim(q), a]
end

def peval(a, x)
  a.reverse.reduce(0) { |v, c| (v * x + c) % P }
end

def pinterp(xs, ys)
  raise ArgumentError, 'need equally sized data and distinct field points' unless xs.length == ys.length && xs.map { |x| x % P }.uniq.length == xs.length
  xs.each_index.reduce([0]) do |result, i|
    basis = [1]; denom = 1
    xs.each_index do |j|
      next if i == j
      basis = pmul(basis, [-xs[j], 1])
      denom = denom * (xs[i] - xs[j]) % P
    end
    padd(result, pscale(basis, ys[i] * pinv(denom)))
  end
end

def pshift_one(a)
  result = [0]; power = [1]
  a.each do |coefficient|
    result = padd(result, pscale(power, coefficient))
    power = pmul(power, [1, 1])
  end
  result
end

def valid_inputs?(xs)
  xs.length == 4 && xs.all? { |x| x.is_a?(Integer) && x.between?(0, 7) }
end

def program?(xs)
  valid_inputs?(xs) && xs[0, 2].sum == xs[2, 2].sum
end

A = [[0, 1, 1, 0, 0, 0, 0], [0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 0, 0, 1, -1]]
B = Array.new(3) { [1, 0, 0, 0, 0, 0, 0] }
C = [[0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0]]
AP = A.transpose.map { |col| pinterp([1, 2, 3], col) }
BP = B.transpose.map { |col| pinterp([1, 2, 3], col) }
CP = C.transpose.map { |col| pinterp([1, 2, 3], col) }
Z = pmul(pmul([-1, 1], [-2, 1]), [-3, 1])
ZT = pmul([-1, 1], [-2, 1])

def assignment(xs)
  [1, *xs, xs[0, 2].sum % P, xs[2, 2].sum % P]
end

def matvec(m, z)
  m.map { |row| row.zip(z).sum { |x, y| x * y } % P }
end

def r1cs_rows(z)
  matvec(A, z).zip(matvec(B, z), matvec(C, z)).map { |a, b, c| (a * b - c) % P }
end

def bound_assignment?(xs, z)
  z.length == 7 && z[0] == 1 && z[1, 4] == xs
end

def r1cs_accept?(xs, z)
  valid_inputs?(xs) && bound_assignment?(xs, z) && r1cs_rows(z) == [0, 0, 0]
end

def combine(polys, z)
  polys.zip(z).reduce([0]) { |sum, (poly, weight)| padd(sum, pscale(poly, weight)) }
end

def qap(z)
  a, b, c = [AP, BP, CP].map { |ps| combine(ps, z) }
  h, rem = pdivmod(psub(pmul(a, b), c), Z)
  [a, b, c, h, rem]
end

def qap_accept?(xs, z)
  valid_inputs?(xs) && bound_assignment?(xs, z) && qap(z)[-1] == [0]
end

def trace_for(xs)
  d0, d1, w0, w1 = xs
  [[d0, w0, 0, 0], [d1, w1, d0 % P, w0 % P], [0, 0, (d0 + d1) % P, (w0 + w1) % P]]
end

def air_accept?(xs, trace)
  return false unless valid_inputs?(xs) && trace.length == 3 && trace.all? { |row| row.length == 4 }
  return false unless [trace[0][0], trace[1][0], trace[0][1], trace[1][1]] == xs
  return false unless trace[2][0, 2] == [0, 0] && trace[0][2, 2] == [0, 0]
  2.times.all? do |i|
    d, w, s, t = trace[i]
    (trace[i + 1][2] - s - d) % P == 0 && (trace[i + 1][3] - t - w) % P == 0
  end && (trace[2][2] - trace[2][3]) % P == 0
end

def air_polynomials(trace)
  d, w, s, t = trace.transpose.map { |col| pinterp([1, 2, 3], col) }
  residuals = [psub(psub(pshift_one(s), s), d), psub(psub(pshift_one(t), t), w)]
  [ [d, w, s, t], residuals, residuals.map { |r| pdivmod(r, ZT) } ]
end

def self_test
  (0..7).to_a.repeated_permutation(4) do |xs|
    z = assignment(xs); expected = program?(xs)
    raise 'R1CS check failed' unless r1cs_accept?(xs, z) == expected
    raise 'QAP check failed' unless qap_accept?(xs, z) == expected
    raise 'AIR check failed' unless air_accept?(xs, trace_for(xs)) == expected
    raise 'AIR quotient check failed' unless air_polynomials(trace_for(xs))[2].all? { |(_, rem)| rem == [0] }
  end
  bad = assignment([4, 3, 2, 6]); bad[-1] = 7
  raise 'tampering test failed' if r1cs_accept?([4, 3, 2, 6], bad) || qap_accept?([4, 3, 2, 6], bad)
  bad_trace = trace_for([4, 3, 2, 5]); bad_trace[1][3] = 3
  raise 'AIR tampering test failed' if air_accept?([4, 3, 2, 5], bad_trace)
  wrap = [4, 3, 60, 48]
  raise 'range/wraparound test failed' if r1cs_accept?(wrap, assignment(wrap)) || qap_accept?(wrap, assignment(wrap)) || air_accept?(wrap, trace_for(wrap))
  puts 'self-test: 4096 inputs, tampering, binding and wraparound checks passed'
end

args = ARGV.dup
if args.delete('--self-test')
  self_test
end
raise 'provide exactly four amounts: d0 d1 w0 w1' unless args.empty? || args.length == 4
values = args.empty? ? [4, 3, 2, 5] : args.map { |v| Integer(v) }
z = assignment(values); trace = trace_for(values)
puts "public amounts: #{values.inspect}"
puts "input range: #{valid_inputs?(values)} program: #{program?(values)}"
puts "R1CS z: #{z.inspect} residuals: #{r1cs_rows(z).inspect}"
puts "QAP (A, B, C, H, remainder): #{qap(z).inspect}"
puts "AIR rows [D, W, S, T]: #{trace.inspect}"
polys, residuals, quotients = air_polynomials(trace)
puts "AIR polynomials [D, W, S, T]: #{polys.inspect}"
puts "AIR transition residuals: #{residuals.inspect}"
puts "AIR transition (quotient, remainder): #{quotients.inspect}"
puts "accepted (R1CS, QAP, AIR): #{r1cs_accept?(values, z)}, #{qap_accept?(values, z)}, #{air_accept?(values, trace)}"
