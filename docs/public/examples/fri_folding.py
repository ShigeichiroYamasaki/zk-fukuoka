"""FRI arithmetic lesson over F_17; not a cryptographic proof implementation."""
P = 17
DOMAIN = [1, 2, 4, 8, 16, 15, 13, 9]


def evaluate(coefficients, x):
    return sum(a * pow(x, i, P) for i, a in enumerate(coefficients)) % P


def table(coefficients):
    return {x: evaluate(coefficients, x) for x in DOMAIN}


def fold(values, alpha, verbose=False):
    result = {}
    for x, u in values.items():
        y = x * x % P
        if y in result:
            continue
        v = values[-x % P]
        even = (u + v) * pow(2, -1, P) % P
        odd = (u - v) * pow(2 * x % P, -1, P) % P
        result[y] = (even + alpha * odd) % P
        if verbose:
            print(x, -x % P, y, u, v, result[y])
    return result


def main():
    original = table([3, 2, 5, 1])
    print('x -x x^2 value(x) value(-x) folded_value')
    first = fold(original, 3, True)
    assert first == {1: 0, 4: 7, 16: 1, 13: 11}
    second = fold(first, 5, True)
    assert second == {1: 15, 16: 15}
    assert all(v == evaluate([9, 8], x) for x, v in first.items())
    bad_final = fold(fold(table([3, 2, 5, 1, 1]), 3), 5)
    assert bad_final == {1: 16, 16: 14}
    print('Invalid degree-4 input, final table:', bad_final)
    # f(X) + (X-3)X^4: the extra term vanishes only for alpha = 3.
    tailored = table([3, 2, 5, 1, -3, 1])
    cancelling = [a for a in range(P) if fold(tailored, a) == fold(original, a)]
    assert cancelling == [3]
    print('Challenges cancelling the tailored invalid addition:', cancelling)
    print('All arithmetic checks passed. No Merkle authentication or security claim.')


if __name__ == '__main__':
    main()
