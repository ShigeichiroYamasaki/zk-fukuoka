---
outline: [2, 3]
---

<script setup>
import TermDiagram from "../../../.vitepress/theme/TermDiagram.vue";
</script>

# Polynomial-time reductions, NP-completeness and Cook–Levin

[Session 4](../session-04) · [Term guide](./) · [Prerequisites](../foundations)

Updated: September 29, 2026


<TermDiagram kind="reductions" en />

## A reduction translates problems

A polynomial-time many-one reduction maps an input $u$ of problem A to an input $f(u)$ of problem B, preserving YES and NO answers. A solver for B can then solve A after this translation. The translation must not assume it already knows A's answer.

## Translate one gate

For the Boolean gate $c=a\land b$, use field constraints

$$c=ab,\quad a(a-1)=0,\quad b(b-1)=0.$$

Add $c=1$ if acceptance requires output one. The assignment $(1,1,1)$ satisfies both representations. Conversely, a satisfying assignment has bit inputs and obeys AND. A constant number of constraints per gate controls the growth in representation size.

## NP-hard and NP-complete

A problem is NP-hard if every NP decision problem reduces to it in polynomial time. It is NP-complete if it is also in NP. This does not establish impossibility of efficient algorithms: P versus NP remains unresolved, and particular small inputs may be easy.

## Cook–Levin and CircuitSAT

The standard Cook–Levin statement establishes SAT's NP-completeness; CircuitSAT is NP-complete too. Session 4 uses the circuit perspective.

For ZK, fix public input $u$ and construct a circuit evaluating the checker $R(u,w)$, leaving $w$ as unknown circuit input. Track the correspondence between valid witnesses, intermediate values and satisfying assignments. A decision reduction preserving YES/NO alone should not be mistaken for a complete explanation of this witness correspondence.

## Check your understanding

If A reduces to B, does a fast solver for A automatically solve B?

::: details Answer
No. The immediate implication runs the other way: use a B solver after translating A's input.
:::

## Read next

[Polynomial time, circuit size and depth, P and NC](./complexity)

## Further reading

[Cook, The Complexity of Theorem-Proving Procedures](https://www.cs.utoronto.ca/~sacook/homepage/1971.pdf) — external material in English.
