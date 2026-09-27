---
outline: [2, 3]
---

# Exercises

Explore lecture concepts through calculations and implementation. Find exercise materials, available tools, and basic operation manuals here.

[Before Act III: work through R1CS/QAP and AIR with a small balance program](../learn/balance-arithmetization#run) — Python arithmetic exercise for Session 4.

## Start here

1. Work through the [introductory finite-field exercise](../learn/foundations): addition, multiplication, and inverses modulo 7.
2. Choose a calculation or development environment from the [tool directory](./tools).
3. Use the [basic operation manuals](./manuals) to learn how to start, enter input, and run your work.

## Exercise materials

| Material | What you will practice | Related lecture |
| --- | --- | --- |
| [Introductory finite-field exercise](../learn/foundations) | Addition, multiplication, inverses, and identifying public inputs and witnesses. Includes calculation answers | [Session 3](../learn/session-03) |

New exercise materials will be added here as they become available.

For Sessions 11–15, follow the [Act III operation guide](./manuals#route) from proving and verification to comparison and advanced exercises.

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

## PLONK implementations and operation manuals {#plonk}

These implementations and official instructions accompany [Session 12: PLONK](../learn/session-12). Start with **Circom + snarkjs** to prove the same circuit used in the Groth16 exercise and compare setup and outputs. Choose gnark for a Go API workflow or Dusk PLONK to study circuit construction in Rust.

| Implementation | Example and learning objective | Environment and level | Operation manuals and examples |
| --- | --- | --- | --- |
| [Circom](https://github.com/iden3/circom) + [snarkjs](https://github.com/iden3/snarkjs) | Prove the README’s circuit containing multiplication using PLONK; compare with Groth16 starting from the same R1CS | Local Circom compiler and Node.js; introductory | [Installation and walkthrough](https://github.com/iden3/snarkjs#readme) / [Setup](https://github.com/iden3/snarkjs#15-setup) / [Proving](https://github.com/iden3/snarkjs#23-create-the-proof) / [Verification](https://github.com/iden3/snarkjs#24-verify-the-proof). Select the **PLONK** commands in each section |
| [gnark](https://github.com/Consensys-Incorporated/gnark) | Compile a Go circuit as SCS and trace `plonk.Setup`, `Prove`, and `Verify`; compare compilation with R1CS for Groth16 | Local Go environment; for Go programmers | [Installation](https://docs.gnark.consensys.io/HowTo/get_started) / [Write a circuit](https://docs.gnark.consensys.io/HowTo/write/circuit_api) / [Prove and verify](https://docs.gnark.consensys.io/HowTo/prove) (select the **PlonK** tab) |
| [Dusk PLONK (dusk-plonk)](https://github.com/dusk-network/plonk) | Read the official Rust circuit example through constraint construction, compilation, proving, and verification; this implementation uses BLS12-381, KZG, and custom gates | Local Rust/Cargo environment; advanced | [Usage guide](https://github.com/dusk-network/plonk#usage) / [Official circuit.rs example](https://github.com/dusk-network/plonk/blob/master/examples/circuit.rs) / [API manual](https://docs.rs/dusk-plonk/latest/dusk_plonk/) |

### Suggested PLONK exercise workflow

1. Choose an implementation and run its official example. Record the release or commit, dependencies, and commands. Match the example and API documentation versions.
2. Identify public inputs and the witness, then generate and verify a proof. Keep the proof fixed, change the public inputs, and confirm verification fails.
3. Change the circuit and regenerate its keys. Distinguish reuse of a universal SRS within its capacity and compatibility limits from the circuit-specific preprocessing that still remains.
4. For a Groth16 comparison, use the same computation and inputs and record proof size and proving time. Include implementation, curve, and version, and limit conclusions to those experimental conditions.

**Reading the setup workflow:** snarkjs PLONK uses Powers of Tau and generates circuit-specific keys with `plonk setup`. It skips the Groth16 phase-two contribution procedure; this does not mean that every setup operation disappears. The `unsafekzg.NewSRS` call in gnark’s official example is for development and testing. Treat it as a local exercise SRS.

Official documentation checked on **September 27, 2026**. Manuals are primarily in English. We confirmed the documented examples and PLONK support; we have not tested every implementation locally.

## STARK implementations and operation manuals {#stark}

These external examples accompany [Session 13: STARK](../learn/session-13). Choose **Anatomy of a STARK to follow the construction in Python, Winterfell to write AIR constraints, or Miden VM to prove program execution**. Each implementation is paired with instructions and examples from its author or development team.

| Implementation | Example and learning objective | Environment and level | Operation manuals and examples |
| --- | --- | --- | --- |
| [Anatomy of a STARK](https://github.com/aszepieniec/stark-anatomy) | An educational Python implementation proving a Rescue-Prime computation; build up finite fields, polynomials, FRI, and STARKs | Local Python; for learning the construction while revisiting Sessions 3–6 | [Author’s tutorial](https://aszepieniec.github.io/stark-anatomy/) / [Part 5: Putting the proof system together](https://aszepieniec.github.io/stark-anatomy/rescue-prime) / [Python code and tests](https://github.com/aszepieniec/stark-anatomy/tree/master/code). The README’s Jekyll instructions serve the explanation website, not the Python exercise |
| [Winterfell](https://github.com/facebook/winterfell) | Repeatedly cube a value and add 42; connect the execution trace, transition constraints, boundary assertions, proving, and verification | Local Rust/Cargo; for Rust programmers | [Official usage tutorial](https://github.com/facebook/winterfell#usage) / [Example implementations](https://github.com/facebook/winterfell/tree/main/examples) / [API manual](https://docs.rs/winterfell/latest/winterfell/) |
| [Miden VM](https://github.com/0xMiden/miden-vm) | Addition and Fibonacci examples in Miden Assembly; execute a program, generate its execution proof, and verify it | Local Rust/Cargo and the Miden VM CLI; for VM-based exercises | [Official crate README and examples](https://github.com/0xMiden/miden-vm/blob/next/miden-vm/README.md) / [CLI operations](https://github.com/0xMiden/miden-vm/blob/next/miden-vm/README.md#cli-interface) / [Fibonacci exercise](https://github.com/0xMiden/miden-vm/blob/next/miden-vm/README.md#fibonacci-example). These links target the development branch `next`; match your release and documentation versions |

### Suggested STARK exercise workflow

1. Choose an implementation and record its version or commit. Follow the matching instructions and start with small inputs and short execution traces.
2. Locate public inputs and outputs, execution traces, transition constraints, and boundary constraints in the code. With a VM, distinguish your instruction sequence from the trace generated by the VM.
3. Verify a proof of correct execution. Keep the proof fixed, change a public output or other public claim, and confirm verification fails.
4. Vary trace length and record proof size, proving time, and verification time. Include security parameters and hash functions, and compare under matching conditions.

**A distinction to keep in mind:** proving computation correctness and hiding witness information are separate properties. Winterfell’s README explicitly states that it does not provide perfect zero knowledge. Check each implementation’s properties and use sample inputs that may be public for these exercises.

Documentation checked on **September 27, 2026**. External instructions are mainly in English. We checked the documented implementations and workflows; we have not tested every implementation locally.

## Tools and manuals

| Directory | What you can find |
| --- | --- |
| [Available tools](./tools) | Choose tools by Act III session, programming language and learning objective |
| [Basic operation manuals](./manuals) | Act III: Groth16, PLONK and STARK workflows, comparison and advanced exercises |

[Syllabus](../learn/) · [Session index](../learn/sessions) · [Topic index](../learn/topics)
