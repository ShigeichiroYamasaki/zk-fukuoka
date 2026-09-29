---
outline: [2, 3]
---

<script setup>
import TermDiagram from "../../../.vitepress/theme/TermDiagram.vue";
</script>

# Constraints, assignments and satisfiability

[Session 4](../session-04) · [Term guide](./) · [Prerequisites](../foundations)

Updated: September 29, 2026


<TermDiagram kind="constraints" en />

## Instructions versus conditions

As an assignment, $t=x^2$ tells a program to compute $t$. As a constraint, it checks whether supplied values of $x,t$ satisfy a condition. Computing a value and constraining its relationship to other values are distinct.

An assignment supplies values for all variables. A constraint system is satisfiable if some assignment satisfies every constraint simultaneously.

## Complete the example

Over $\mathbb F_{101}$, fix public output $y=35$:

$$x\cdot x=t,\qquad t\cdot x=s,\qquad (s+x+5)\cdot1=y.$$

The assignment $(3,9,27)$ satisfies all three. If the last condition is removed, $(2,4,8)$ satisfies the remaining conditions but yields 15, not 35. Missing constraints admit unintended assignments.

## Bits and integer ranges

Over a field, $b(b-1)=0$ forces $b$ to be zero or one. AND can be written $c=ab$ and NOT as $c=1-a$, provided the required bit restrictions hold.

A $k$-bit integer can be represented by $x=\sum_{i=0}^{k-1}2^i b_i$ and bit constraints. Check the field size, for example $2^k<p$, to avoid ambiguous integer encodings. Integer arithmetic claims may also require output bounds and overflow handling. In $\mathbb F_7$, $6+3=2$; this is field arithmetic, not an integer sum of nine.

## What the translation must preserve

A correct execution must produce a satisfying assignment, and a satisfying assignment must imply a correct execution. Losing the second direction permits an invalid witness to pass. R1CS is one representation of constraints, not by itself a secrecy or succinctness guarantee.

## Check your understanding

Why can addition be represented by $(a+b)\cdot1=c$ in R1CS?

::: details Answer
Each of $a+b$, 1 and $c$ is a linear combination of the variable vector. Addition can sometimes be absorbed into another expression; a separate output variable still needs its consistency enforced.
:::

## Read next

[Polynomial-time reductions, NP-completeness and Cook–Levin](./reductions)

## Further reading

[Circom documentation source: Constraint Generation](https://github.com/iden3/circom/blob/master/mkdocs/docs/circom-language/constraint-generation.md) — external material in English.
