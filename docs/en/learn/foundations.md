# 01 · Foundations

## Start here

Zero-knowledge proofs establish that a statement is true without revealing information beyond its truth. What remains private depends on the protocol and its public inputs. This serves a different purpose from encrypting data.

## Calculate in a finite field

In the finite field modulo the prime 7, values are represented by 0 through 6.

```text
5 + 4 = 2  (mod 7)
3 × 5 = 1  (mod 7)
```

The second equation shows that the multiplicative inverse of 3 is 5. Zero has no multiplicative inverse. This is an introduction to finite fields, not a zero-knowledge proof itself.

## A small exercise

1. Calculate `6 + 6` and `4 × 5` modulo 7.
2. Find the multiplicative inverse of 2 modulo 7.
3. For a claim involving a secret x and a public y, separately describe the public inputs, private inputs, and relation to prove.

::: details Answers to the calculations
`6 + 6 = 5` and `4 × 5 = 6`. The inverse of 2 is 4, since `2 × 4 = 1 mod 7`.
:::

## Think ahead

How could someone check a computation without receiving its secret input? The next step explores statements and witnesses, and the roles of prover and verifier.

[Back to the syllabus](./)
