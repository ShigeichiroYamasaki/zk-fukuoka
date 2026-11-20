# frozen_string_literal: true

# Small prime-field helpers for the STARK/FRI teaching example.
module StarkAnatomyRuby
  module Field
    module_function

    def add(a, b, p) = (a + b) % p
    def sub(a, b, p) = (a - b) % p
    def mul(a, b, p) = (a * b) % p

    def pow(a, exponent, p)
      raise ArgumentError, 'negative exponent' if exponent.negative?

      a.pow(exponent, p)
    end

    def inv(a, p)
      raise ZeroDivisionError, 'zero has no multiplicative inverse' if a % p == 0

      # Fermat's little theorem; p must be prime.
      a.pow(p - 2, p)
    end

    def div(a, b, p) = mul(a, inv(b, p), p)
  end
end
