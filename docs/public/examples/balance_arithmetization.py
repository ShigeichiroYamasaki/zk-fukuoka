"""Session 4: public amounts -> R1CS/QAP and AIR, over F_101.

Python 3.8+, standard library only. This is an arithmetic demonstration,
not a SNARK/STARK prover. Coefficients are constant-first, reduced modulo 101.
Run: python3 balance_arithmetization.py [d0 d1 w0 w1] [--self-test]
"""
import argparse
from itertools import product

P = 101


def trim(a):
    a = [v % P for v in a] or [0]
    while len(a) > 1 and a[-1] == 0:
        a.pop()
    return a


def add(a, b):
    return trim([(a[i] if i < len(a) else 0) +
                 (b[i] if i < len(b) else 0)
                 for i in range(max(len(a), len(b)))])


def scale(a, c):
    return trim([v * c for v in a])


def sub(a, b):
    return add(a, scale(b, -1))


def mul(a, b):
    c = [0] * (len(a) + len(b) - 1)
    for i, x in enumerate(a):
        for j, y in enumerate(b):
            c[i + j] += x * y
    return trim(c)


def evaluate(a, x):
    result = 0
    for c in reversed(a):
        result = (result * x + c) % P
    return result


def divide(a, b):
    a, b = trim(a), trim(b)
    if b == [0]:
        raise ZeroDivisionError("zero polynomial")
    q = [0] * max(1, len(a) - len(b) + 1)
    while a != [0] and len(a) >= len(b):
        k = len(a) - len(b)
        c = a[-1] * pow(b[-1], -1, P) % P
        q[k] = c
        a = sub(a, [0] * k + scale(b, c))
    return trim(q), a


def interpolate(xs, ys):
    if len(xs) != len(ys) or len({x % P for x in xs}) != len(xs):
        raise ValueError("need equally sized data and distinct field points")
    result = [0]
    for i, xi in enumerate(xs):
        basis, denominator = [1], 1
        for j, xj in enumerate(xs):
            if i != j:
                basis = mul(basis, [-xj, 1])
                denominator = denominator * (xi - xj) % P
        result = add(result, scale(basis, ys[i] * pow(denominator, -1, P)))
    return result


def shift_one(a):
    result, power = [0], [1]
    for coefficient in a:
        result = add(result, scale(power, coefficient))
        power = mul(power, [1, 1])
    return result


def valid_inputs(amounts):
    return len(amounts) == 4 and all(type(a) is int and 0 <= a <= 7 for a in amounts)


def program(amounts):
    return valid_inputs(amounts) and sum(amounts[:2]) == sum(amounts[2:])


# z = (1, d0, d1, w0, w1, sD, sW).
A = [[0, 1, 1, 0, 0, 0, 0],
     [0, 0, 0, 1, 1, 0, 0],
     [0, 0, 0, 0, 0, 1, -1]]
B = [[1, 0, 0, 0, 0, 0, 0] for _ in range(3)]
C = [[0, 0, 0, 0, 0, 1, 0],
     [0, 0, 0, 0, 0, 0, 1],
     [0, 0, 0, 0, 0, 0, 0]]


def assignment(amounts):
    return [1, *amounts, sum(amounts[:2]) % P, sum(amounts[2:]) % P]


def matrix_vector(matrix, z):
    return [sum(a * b for a, b in zip(row, z)) % P for row in matrix]


def r1cs_rows(z):
    return [(a * b - c) % P for a, b, c in
            zip(matrix_vector(A, z), matrix_vector(B, z), matrix_vector(C, z))]


def bound_assignment(amounts, z):
    # Public input binding is checked, rather than trusting values in z.
    return len(z) == 7 and z[0] == 1 and z[1:5] == list(amounts)


def r1cs_accept(amounts, z):
    return valid_inputs(amounts) and bound_assignment(amounts, z) and r1cs_rows(z) == [0, 0, 0]


# Interpolate every matrix column; combine with the assignment afterward.
def columns(matrix):
    return [interpolate([1, 2, 3], list(column)) for column in zip(*matrix)]


AP, BP, CP = columns(A), columns(B), columns(C)
Z = mul(mul([-1, 1], [-2, 1]), [-3, 1])
Z_TRANSITION = mul([-1, 1], [-2, 1])


def combine(polynomials, z):
    result = [0]
    for poly, weight in zip(polynomials, z):
        result = add(result, scale(poly, weight))
    return result


def qap(z):
    a, b, c = [combine(ps, z) for ps in (AP, BP, CP)]
    f = sub(mul(a, b), c)
    h, remainder = divide(f, Z)
    return a, b, c, h, remainder


def qap_accept(amounts, z):
    return valid_inputs(amounts) and bound_assignment(amounts, z) and qap(z)[-1] == [0]


def trace_for(amounts):
    d0, d1, w0, w1 = amounts
    # Columns: D, W, S, T; row i records totals BEFORE entry i is processed.
    return [[d0, w0, 0, 0],
            [d1, w1, d0 % P, w0 % P],
            [0, 0, (d0 + d1) % P, (w0 + w1) % P]]


def air_accept(amounts, trace):
    if not valid_inputs(amounts) or len(trace) != 3 or any(len(row) != 4 for row in trace):
        return False
    if [trace[0][0], trace[1][0], trace[0][1], trace[1][1]] != list(amounts):
        return False
    if trace[2][:2] != [0, 0] or trace[0][2:] != [0, 0]:
        return False
    for i in range(2):
        d, w, s, t = trace[i]
        if (trace[i + 1][2] - s - d) % P or (trace[i + 1][3] - t - w) % P:
            return False
    return (trace[2][2] - trace[2][3]) % P == 0


def air_polynomials(trace):
    d, w, s, t = [interpolate([1, 2, 3], list(col)) for col in zip(*trace)]
    residuals = [sub(sub(shift_one(s), s), d), sub(sub(shift_one(t), t), w)]
    quotients = [divide(r, Z_TRANSITION) for r in residuals]
    return (d, w, s, t), residuals, quotients


def self_test():
    # Exhaust the declared domain: 8^4 public-input tuples.
    for values in product(range(8), repeat=4):
        z = assignment(values)
        expected = program(values)
        assert r1cs_accept(values, z) == expected
        assert qap_accept(values, z) == expected
        assert air_accept(values, trace_for(values)) == expected
        polys, _, qs = air_polynomials(trace_for(values))
        assert all(rem == [0] for _, rem in qs)
        assert (evaluate(polys[2], 3) == evaluate(polys[3], 3)) == expected
    good = [4, 3, 2, 5]
    forged = assignment([4, 3, 2, 6]); forged[-1] = 7
    assert not r1cs_accept([4, 3, 2, 6], forged)
    assert not qap_accept([4, 3, 2, 6], forged)
    corrupted = trace_for(good); corrupted[1][3] = 3
    assert not air_accept(good, corrupted)
    # Public input binding catches replacing the claimed withdrawal schedule.
    swapped = trace_for([4, 3, 5, 2])
    assert not air_accept(good, swapped)
    assert not r1cs_accept(good, assignment([4, 3, 5, 2]))
    assert not qap_accept(good, assignment([4, 3, 5, 2]))
    wrap = [4, 3, 60, 48]  # 7 != 108 as integers, but 7 == 108 mod 101.
    assert r1cs_rows(assignment(wrap)) == [0, 0, 0]
    assert not program(wrap) and not r1cs_accept(wrap, assignment(wrap))
    assert not qap_accept(wrap, assignment(wrap)) and not air_accept(wrap, trace_for(wrap))
    polys, residuals, quotients = air_polynomials(trace_for(good))
    assert polys == ([3, 2, 100], [92, 15, 97], [96, 56, 50], [1, 48, 52])
    assert residuals == [[2, 98, 1], [8, 89, 4]]
    assert quotients == [([1], [0]), ([4], [0])]
    assert qap(assignment(good)) == ([0, 61, 47], [1], [0, 61, 47], [0], [0])
    assert qap(assignment([4, 3, 2, 6]))[-1] == [100, 52, 50]
    print("self-test: 4096 inputs, tampering, binding and wraparound checks passed")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("amounts", type=int, nargs="*", help="d0 d1 w0 w1")
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.amounts and len(args.amounts) != 4:
        parser.error("provide exactly four amounts")
    if args.self_test:
        self_test()
    values = args.amounts or [4, 3, 2, 5]
    z = assignment(values)
    print("public amounts:", values)
    print("input range:", valid_inputs(values), "program:", program(values))
    print("R1CS z:", z, "residuals:", r1cs_rows(z))
    print("QAP (A, B, C, H, remainder):", qap(z))
    trace = trace_for(values)
    print("AIR rows [D, W, S, T]:", trace)
    polys, residuals, quotients = air_polynomials(trace)
    print("AIR polynomials [D, W, S, T]:", polys)
    print("AIR transition residuals:", residuals)
    print("AIR transition (quotient, remainder):", quotients)
    print("accepted (R1CS, QAP, AIR):", r1cs_accept(values, z), qap_accept(values, z), air_accept(values, trace))


if __name__ == "__main__":
    main()
