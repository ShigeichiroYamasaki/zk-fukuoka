---
outline: [2, 3]
---

# Execution traces, states, transitions and boundaries

[Session 4](../session-04) · [Term guide](./) · [Prerequisites](../foundations)

Updated: September 27, 2026

## Record the intermediate states

A state is a tuple of values needed for the next step. An execution trace lists states in time order. In AIR it is a structured table of values needed for checking, not just an informal application log.

Over $\mathbb F_{101}$, start with $a_0=2$ and repeat $a_{i+1}=a_i^2$ three times:

| Time | State |
| --- | --- |
| 0 | 2 |
| 1 | 4 |
| 2 | 16 |
| 3 | 54 |

Here $256\equiv54\pmod{101}$. More elaborate traces may also record instruction positions and several registers.

## Two kinds of constraints

Transition constraints require $a_{i+1}-a_i^2=0$ for $i=0,1,2$. There is no next row after the last, so do not apply that transition unconditionally there. Boundary constraints require $a_0=2$ and $a_3=54$.

Transitions alone permit a different starting state. Boundaries alone permit incorrect intermediate states. Both are needed for the specified execution.

## From table to polynomial

Choose distinct points $d_i$ and interpolate $T(d_i)=a_i$. On a multiplicative domain $d_i=g^i$, $T(gX)$ refers to the next row, and $T(gX)-T(X)^2$ must vanish at the transition points.

Specify the domain, excluded final row and degree bounds. In this field $g=10$ has order four, giving points $1,10,100,91$, but the example does not require a wraparound transition to the initial row. A trace alone is not a STARK: commitments and low-degree proximity testing also matter.

## Check your understanding

What fails for the altered trace $2,4,17,54$?

::: details Answer
The boundaries still pass. The transition from time one to two fails because $17-4^2=1$. The following transition fails too: $54-17^2$ is nonzero modulo 101.
:::

## Read next

[Return to Session 4](../session-04)

## Further reading

[Ben-Sasson et al., Scalable, transparent, and post-quantum secure computational integrity](https://eprint.iacr.org/2018/046) — external material in English.
