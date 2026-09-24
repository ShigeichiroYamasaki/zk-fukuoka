# Syllabus

Move from explaining zero-knowledge proofs to building a small prototype. This syllabus is the entry point for our learning materials.

::: info Draft curriculum · v0.1
The community is in formation. Dates, instructors, venues, and tools are undecided. We will refine this proposal with learner feedback. Only the introductory lesson for Step 01 is currently available.
:::

## Who this is for

- Students, engineers, and researchers curious about zero-knowledge proofs.
- Basic programming knowledge (variables, functions, tests) is assumed; cryptography expertise is not.
- Prepare a development environment and learn basic Git operations. Revisit mathematics as needed.

## How we learn

Each session follows a cycle: read ahead, discuss, experiment, and share discoveries. Duration and session count will be agreed with participants. No certification scheme has been established.

## 01 · Foundations {#foundations}

**Outcome:** Distinguish public information from secrets and explain arithmetic in a finite field.

- Modular arithmetic, primes, finite fields, and polynomials.
- Hashes and commitments; hiding and binding.
- Exercise: compute sums, products, and inverses with a small prime.
- Deliverable: worked examples and a short note on what to hide and what to prove.

[Read the introductory lesson →](./foundations)

## 02 · Understand proofs {#proofs}

**Outcome:** Explain completeness, soundness, and zero-knowledge in your own words.

- Provers and verifiers; statements and witnesses.
- Interactive proofs and an introduction to making them non-interactive.
- Exercise: identify what a verifier learns and what should remain hidden.
- Deliverable: a protocol diagram and a list of assumptions.

Materials are planned.

## 03 · Build a circuit {#circuits}

**Outcome:** Express a claim as constraints and test valid and invalid inputs.

- Public and private inputs, circuits, and missing constraints.
- Proof generation, verification, setup, and trust assumptions.
- Exercise: use a selected educational tool to write and test a small circuit.
- Deliverable: a circuit, reproduction instructions, and positive and negative tests.

Materials and tool selection are planned. Tool choices will be documented in ADRs.

## 04 · Make & share {#project}

**Outcome:** Build a narrow prototype and communicate its capabilities and limitations.

- Example ideas: range proofs or set membership proofs.
- Exercise: design and build in small teams, then review each other's work.
- Deliverable: code, README, a note on threats and limitations, and a demo.
- Reflection: reproducibility, sound constraints, possible information leakage, and clear explanations.

Materials are planned. Educational prototypes do not carry production security guarantees.

## Feedback

Questions, reproduction problems, and small improvements are welcome. See [how to contribute](../contribute).
