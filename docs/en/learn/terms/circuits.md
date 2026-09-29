---
outline: [2, 3]
---

<script setup>
import TermDiagram from "../../../.vitepress/theme/TermDiagram.vue";
</script>

# Circuits, gates and wires

[Session 4](../session-04) · [Term guide](./) · [Prerequisites](../foundations)

Updated: September 29, 2026


<TermDiagram kind="circuit" en />

## A mathematical circuit

A circuit here is a directed acyclic graph describing dependencies in a computation, not necessarily a physical electronic device. A gate performs a small operation; a wire carries its value to another operation. Boolean circuits use bits and operations such as AND, OR and NOT. Arithmetic circuits use elements of a specified field and operations such as addition and multiplication.

## Split a computation into gates

| Step | Operation | At $x=3$ |
| --- | --- | --- |
| 1 | $t=x\cdot x$ | 9 |
| 2 | $s=t\cdot x$ | 27 |
| 3 | $v=s+x$ | 30 |
| 4 | $y=v+5$ | 35 |

A wire from $x$ to several gates still carries the same value. The output $t$ of one gate is the input of the next. Losing that sharing changes the computation.

## Programs versus circuits

A program specifies execution steps. A single circuit fixes input count and operation layout. A bounded loop can be unrolled into repeated operations; an arbitrary unbounded computation does not automatically yield a small fixed circuit.

A branch can be expressed as $y=bu+(1-b)v$: it chooses $u$ when $b=1$ and $v$ when $b=0$. Enforce that $b$ is a bit. An arbitrary field element does not implement a two-way choice.

## Evaluation versus satisfiability

Evaluation computes an output from supplied inputs. CircuitSAT asks whether some input makes a Boolean circuit output one. Arithmetic variants ask whether some input meets specified equations or output requirements. Finding an input and checking a given input are different tasks.

## Check your understanding

If $t=10$ is recorded for $x=3$ and all later operations use 10 consistently, is the execution valid?

::: details Answer
No: the first equation $t=x\cdot x$ fails. Translate each gate into [constraints](./constraints) so that inconsistent intermediate values can be detected.
:::

## Read next

[Constraints, assignments and satisfiability](./constraints)

## Further reading

[Thaler, Chapter 6: Front Ends](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf) — external material in English.
