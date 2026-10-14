#!/usr/bin/env ruby
# FRI arithmetic lesson over F_17; not a cryptographic proof implementation.
P = 17
# The eight nonzero elements form a multiplicative subgroup of F_17.
# Folding pairs x with -x, then stores the result at y = x^2.
DOMAIN = [1, 2, 4, 8, 16, 15, 13, 9].freeze

# Fermat's little theorem gives a^-1 = a^(p-2) for nonzero a in F_p.
def inverse(a)
  a.pow(P - 2, P)
end

def evaluate(coefficients, x)
  # Coefficients are in ascending order; powers are computed modulo 17.
  coefficients.each_with_index.sum { |a, i| a * x.pow(i, P) } % P
end

def table(coefficients)
  DOMAIN.to_h { |x| [x, evaluate(coefficients, x)] }
end

def fold(values, alpha, verbose: false)
  result = {}
  values.each do |x, u|
    # Write f(X) = f_even(X^2) + X*f_odd(X^2). Values at x and -x
    # isolate the even and odd parts; alpha combines them into half-degree f'.
    y = x * x % P
    next if result.key?(y)
    v = values.fetch(-x % P)
    even = (u + v) * inverse(2) % P
    odd = (u - v) * inverse(2 * x % P) % P
    result[y] = (even + alpha * odd) % P
    puts [x, -x % P, y, u, v, result[y]].join(' ') if verbose
  end
  result
end

# This four-degree example is folded twice. The equalities below are exact
# arithmetic checks for this toy domain, not Merkle authentication or a FRI proof.
original = table([3, 2, 5, 1])
puts 'x -x x^2 value(x) value(-x) folded_value'
first = fold(original, 3, verbose: true)
raise 'first fold mismatch' unless first == { 1 => 0, 4 => 7, 16 => 1, 13 => 11 }
second = fold(first, 5, verbose: true)
raise 'second fold mismatch' unless second == { 1 => 15, 16 => 15 }
raise 'interpolation check failed' unless first.all? { |x, y| y == evaluate([9, 8], x) }

bad_final = fold(fold(table([3, 2, 5, 1, 1]), 3), 5)
raise 'invalid-degree example mismatch' unless bad_final == { 1 => 16, 16 => 14 }
puts "Invalid degree-4 input, final table: #{bad_final.inspect}"

# f(X) + (X-3)X^4: the extra term vanishes only when alpha = 3.
tailored = table([3, 2, 5, 1, -3, 1])
cancelling = (0...P).select { |alpha| fold(tailored, alpha) == fold(original, alpha) }
raise 'challenge cancellation check failed' unless cancelling == [3]
puts "Challenges cancelling the tailored invalid addition: #{cancelling.inspect}"
puts 'All arithmetic checks passed. No Merkle authentication or security claim.'
