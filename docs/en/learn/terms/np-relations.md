---
outline: [2, 3]
---

<script setup>
import TermDiagram from "../../../.vitepress/theme/TermDiagram.vue";
</script>

# NP relations, public inputs and witnesses

[Session 4](../session-04) · [Term guide](./) · [Prerequisites](../foundations)

Updated: September 29, 2026


<TermDiagram kind="np" en />

## Begin with the claim

Consider “I know $x$ such that $x^3+x+5=35$.” The value 35 is public; the prover holds $x$. Write the public input as $u$ and the witness as $w$ to avoid overloading $x$. A relation $R$ specifies which pairs are valid. Over a fixed field, let $R(u,w)=1$ mean $w^3+w+5=u$. In $\mathbb F_{101}$, $(35,3)$ is a valid pair.

## Read the definition

An NP relation is deterministically checkable in polynomial time, with valid witnesses bounded in bit length by a polynomial in $|u|$. Its associated language is

$$L_R=\{u\mid \exists w:\ R(u,w)=1\}.$$

The relation specifies valid pairs; the language specifies public inputs having some valid witness. See [complexity](./complexity) for the resource bound. The small fixed-field example illustrates the definition; it need not be a hard problem.

| Task | What it means here |
| --- | --- |
| Search | Find $w$ from $u$ |
| Check | Substitute a supplied pair into the equation |
| Prove in zero knowledge | Use a protocol to establish the claim without directly sending $w$ |

Being in NP does not mean being hard. Defining an NP relation does not itself supply zero knowledge or knowledge soundness.

## Connection to Session 4

A circuit breaks the checker into operations. Constraints enforce consistency of their inputs and outputs. Intermediate values may become part of the implementation's witness. Public versus private values are chosen as part of the relation; variables are not automatically private.

Field equations wrap modulo the field characteristic. An integer claim can therefore require additional range and overflow constraints: see [constraints](./constraints).

## Check your understanding

For public input 35, candidate witness 3 and intermediate value $t=9$, is checking only $t=9$ enough?

::: details Answer
No. Enforce $t=w^2$ and $tw+w+5=35$. Both the intermediate computation and its connection to the public output matter.
:::

## Read next

[Circuits, gates and wires](./circuits)

## Further reading

[Thaler, Proofs, Arguments, and Zero-Knowledge](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf) — external material in English.
