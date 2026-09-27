---
outline: [2, 3]
---

# Exercises

Explore lecture concepts through calculations and implementation. Find exercise materials, available tools, and basic operation manuals here.

## Start here

1. Work through the [introductory finite-field exercise](../learn/foundations): addition, multiplication, and inverses modulo 7.
2. Choose a calculation or development environment from the [tool directory](./tools).
3. Use the [basic operation manuals](./manuals) to learn how to start, enter input, and run your work.

## Exercise materials

| Material | What you will practice | Related lecture |
| --- | --- | --- |
| [Introductory finite-field exercise](../learn/foundations) | Addition, multiplication, inverses, and identifying public inputs and witnesses. Includes calculation answers | [Session 3](../learn/session-03) |

New exercise materials will be added here as they become available.

## Groth16 implementations and operation manuals {#groth16}

These external examples accompany [Session 11: Groth16](../learn/session-11). Each implementation is paired with its official instructions. We suggest starting with the **Circom + snarkjs circuit example** to follow the complete path from writing a circuit to generating and verifying a proof.

| Implementation | Example and learning objective | Environment and level | Operation manuals and examples |
| --- | --- | --- | --- |
| [Circom](https://github.com/iden3/circom) + [snarkjs](https://github.com/iden3/snarkjs) | Work with a circuit containing multiplication; identify the R1CS, witness, setup outputs, proof, and verification result | Local Circom compiler and Node.js; introductory | [Official snarkjs walkthrough](https://github.com/iden3/snarkjs#readme) (circuit writing, compilation, witness calculation, Groth16 setup, proving, and verification) / [Circom installation and basic operations](./manuals#circuits) |
| [ZoKrates](https://github.com/ZoKrates/ZoKrates) | The Hello World example proves the relation between a private square root and a public square; follow the workflow from a short program | Local CLI or Docker; introductory | [Installation through proof verification](https://zokrates.github.io/gettingstarted.html) / [CLI reference](https://zokrates.github.io/toolbox/cli.html) / [Select Groth16 (G16)](https://zokrates.github.io/toolbox/proving_schemes.html) |
| [gnark](https://github.com/Consensys-Incorporated/gnark) | Write circuits and witnesses in Go; trace `groth16.Setup`, `Prove`, and `Verify` | Local Go environment; for Go programmers | [Installation](https://docs.gnark.consensys.io/HowTo/get_started) / [Write a circuit](https://docs.gnark.consensys.io/HowTo/write/circuit_api) / [Proof generation and verification examples](https://docs.gnark.consensys.io/HowTo/prove) |
| [bellman](https://github.com/zkcrypto/bellman) | Prove knowledge of a SHA-256d preimage; examine constraints, gadgets, and the Groth16 API | Local Rust/Cargo environment; advanced | [Official circuit, proving, and verification example (0.14.0)](https://docs.rs/bellman/0.14.0/bellman/#example-circuit) / [Groth16 API (0.14.0)](https://docs.rs/bellman/0.14.0/bellman/groth16/) |

### Suggested exercise workflow

1. Choose one implementation and run its linked example unchanged. Select Groth16 and record the versions and commands used.
2. Identify the public inputs, private witness, proving key, verification key, and proof.
3. Generate and verify a proof with correct inputs. Then change the public inputs without changing the proof and confirm that verification fails.
4. Relate changes to the circuit constraints to the need for recompilation and setup for that circuit, as discussed in Session 11.

Official documentation checked on **September 27, 2026**. Most external manuals are in English. The Circom documentation site was unreachable during this check, so the table points primarily to the accessible official snarkjs README. We checked the documented examples and Groth16 support; we have not tested every tool locally. The bellman example and API links both target version 0.14.0. Treat locally generated exercise setup parameters as learning materials.

## Tools and manuals

| Directory | What you can find |
| --- | --- |
| [Available tools](./tools) | Browser-based calculation, finite fields and polynomials, circuit writing, proof generation and verification |
| [Basic operation manuals](./manuals) | Installation and basic operations, circuit creation, witness calculation, and editing materials with Git |

[Syllabus](../learn/) · [Session index](../learn/sessions) · [Topic index](../learn/topics)
