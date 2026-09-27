# Session 4: A guide to prerequisite terms

Use these explanations alongside Session 4. Each page develops a term through a definition, a worked example, its role in arithmetization and a self-check with an answer. You can read in order or open only the terms you need.

[Session 4](../session-04) · [Topic index](../topics) · [Prerequisites](../foundations)

## Suggested route

Public claim and witness → circuit → constraints → reason the translation is general → cost → matrix representation → polynomials → execution traces.

The shared arithmetic example uses $x^3+x+5=35$ over $\mathbb F_{101}$. Integer claims require attention to ranges; the trace page uses a separate repeated-squaring example.

| Term | Question it answers |
| --- | --- |
| [NP relations, public inputs and witnesses](./np-relations) | What is public, and what does the prover hold? |
| [Circuits, gates and wires](./circuits) | How do operations and wires represent a program? |
| [Constraints, assignments and satisfiability](./constraints) | How do satisfying assignments represent correct executions? |
| [Polynomial-time reductions, NP-completeness and Cook–Levin](./reductions) | Why can general NP verification be expressed by circuits? |
| [Polynomial time, circuit size and depth, P and NC](./complexity) | How do input size, work and dependency depth differ? |
| [Linear combinations, dot products, matrices and rank one](./linear-algebra) | What do the R1CS matrices select and multiply? |
| [Interpolation, vanishing polynomials and divisibility](./polynomials) | How do many constraints become one divisibility condition? |
| [Execution traces, states, transitions and boundaries](./execution-traces) | How is correctness expressed over time? |
