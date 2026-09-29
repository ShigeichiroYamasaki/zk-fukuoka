---
outline: [2, 3]
---

<script setup>
import TermDiagram from "../../../.vitepress/theme/TermDiagram.vue";
</script>

# Interpolation, vanishing polynomials and divisibility

[Session 4](../session-04) · [Term guide](./) · [Prerequisites](../foundations)

Updated: September 29, 2026


<TermDiagram kind="polynomials" en />

For the underlying algebra, start with [polynomial ring basics in Session 3](../session-03#_3-1-definitions-and-basic-operations), then read [roots, vanishing polynomials, and QAP divisibility](../session-03#qap-polynomial-prerequisites).

## Read a table as a polynomial

QAP assigns distinct field points to constraint rows and interpolates each column. Specifying values at $m$ distinct points determines a unique polynomial of degree less than $m$.

Over $\mathbb F_{101}$, values 3 and 5 at points 1 and 2 give $P(X)=2X+1$. Interpolation exactly fits the specified values; it is not a statistical guess.

## Vanishing and divisibility

For $D=\{1,2\}$, the vanishing polynomial is

$$Z_D(X)=(X-1)(X-2)=X^2-3X+2.$$

A polynomial vanishing at both distinct points is divisible by $Z_D$, by the factor theorem. For example, $F(X)=3X^2-9X+6=3Z_D(X)$ has quotient 3. But $G=F+1$ equals one at both points and is not divisible. All operations are over the field.

## Connection to QAP

Interpolate the R1CS columns as $A_i,B_i,C_i$ and combine them using assignment values $z_i$:

$$F(X)=\left(\sum_i z_iA_i(X)\right)\left(\sum_i z_iB_i(X)\right)-\sum_i z_iC_i(X).$$

Vanishing at each constraint point means that row's equation holds. Combine these requirements as $F=HZ_D$. The indeterminate $X$ encodes row positions; it is distinct from the original private input $x$.

## Conditions for checking one point

Checking $F(r)=H(r)Z_D(r)$ at random $r$ does not provide certainty. A fixed nonzero difference polynomial admits a degree-dependent probabilistic bound. If the prover can choose polynomials freely after seeing the challenge, this argument fails. Degree bounds and prior fixation are responsibilities of the surrounding proof system.

## Check your understanding

Must two polynomials agreeing at 1 and 2 be identical?

::: details Answer
Yes if both have degree below two. Without that bound, $P$ and $P+Z_D$ agree there but differ as polynomials.
:::

## Read next

[Execution traces, states, transitions and boundaries](./execution-traces)

## Further reading

[Gennaro et al., Quadratic Span Programs and Succinct NIZKs without PCPs](https://eprint.iacr.org/2012/215) — external material in English.
