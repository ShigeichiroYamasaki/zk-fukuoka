---
outline: [2, 3]
---

# Basic operation manuals

Follow the Act III exercises (Sessions 11–15): generate and verify a proof, compare setup requirements, inspect execution traces, compare results, and explore advanced constructions.

[Exercises](./) · [Implementations and tools](./tools) · [Prerequisites](../learn/foundations)

Documentation checked: September 27, 2026. This page provides a reading order and exercise guide to official manuals. Use commands from the documentation matching your chosen version. Not every implementation has been tested locally.

[Applied course: build an ERC-20 transfer ZK rollup](../rollup/) - six development stages and runnable starter models.

[Applied course: private-input ZKML inference](../zkml/) — [Runnable code and manual](../zkml/02-proof).


## Act III exercise route {#route}

| Session | Activity | Instructions | Completion target |
| --- | --- | --- | --- |
| [11: Groth16](../learn/session-11) | Prove a circuit and verify it | [Groth16](#groth16) | Distinguish circuit, witness, keys and proof |
| [12: PLONK](../learn/session-12) | Prove the same computation differently | [PLONK](#plonk) | Distinguish universal SRS from circuit preprocessing |
| [13: STARK](../learn/session-13) | Inspect traces and constraints | [STARK](#stark) | Connect transition and boundary constraints to verification |
| [14: Integration](../learn/session-14) | Record comparable experiments | [Comparison](#comparison) | Separate measurements from theoretical properties |
| [15: Further directions](../learn/session-15) | Explore recursion, folding and sumcheck | [Advanced exercises](#advanced) | Explain what is combined and which costs are reduced |

Start Sessions 11–12 with **Circom + snarkjs** to reuse a circuit. For Session 13, choose Anatomy of a STARK to study Python code, Winterfell to write AIR in Rust, or Miden VM to prove program execution. Installing every implementation is unnecessary.

## Common preparation and circuit creation {#circuits}

### Prepare a workspace

Create an exercise directory and record the implementation release or commit and language/compiler versions. Match examples and API documentation to that version. Start with small, public sample inputs.

| Environment | Installation and operation manuals | First check |
| --- | --- | --- |
| Circom + snarkjs | [snarkjs README](https://github.com/iden3/snarkjs#readme), [Circom installation](https://docs.circom.io/getting-started/installation/) | Node.js, Circom and snarkjs run; help is available |
| Go | [gnark getting started](https://docs.gnark.consensys.io/HowTo/get_started) | Example and dependency versions match |
| Rust | [Rust installation](https://doc.rust-lang.org/book/ch01-01-installation.html) and the selected implementation README | Record Rust/Cargo versions and feature flags |
| Python | [Python tutorial](https://docs.python.org/3/tutorial/), [Anatomy code](https://github.com/aszepieniec/stark-anatomy/tree/master/code) | Check the Python version and required dependencies |

### Prepare shared Circom inputs

| Step | Official instructions | Outputs to identify |
| --- | --- | --- |
| 1 | [Write a circuit](https://docs.circom.io/getting-started/writing-circuits/) | `.circom`; public values and witness values |
| 2 | [Compile](https://docs.circom.io/getting-started/compiling-circuits/) | `.r1cs` and witness-generation Wasm |
| 3 | [Compute the witness](https://docs.circom.io/getting-started/computing-the-witness/) | Input JSON and `.wtns`; an assignment satisfying the constraints |

If the Circom site is unavailable, use the corresponding circuit, compilation and witness sections of the [snarkjs README](https://github.com/iden3/snarkjs#readme).

## Generate and verify proofs {#proofs}

Choose a protocol below. Save the matching **proof, public inputs and verification key or parameters**. Record both normal verification and verification after changing public inputs.

### Session 11: Groth16 {#groth16}

Use Circom + snarkjs, or apply the same checkpoints to [ZoKrates, gnark or bellman](./#groth16).

| Step | Operation | Official manual | Check |
| --- | --- | --- | --- |
| 1 | Prepare circuit and witness | [Preparation](#circuits) | Public inputs versus witness |
| 2 | Prepare Powers of Tau and circuit-specific setup | [Walkthrough](https://github.com/iden3/snarkjs#readme), [Circom proving tutorial](https://docs.circom.io/getting-started/proving-circuits/) | `.ptau` versus `.zkey`; follow contribution and verification steps |
| 3 | Export verification key and generate proof | [Key export](https://github.com/iden3/snarkjs#22-export-the-verification-key), [proving](https://github.com/iden3/snarkjs#23-create-the-proof) | Key, proof and public-input JSON |
| 4 | Verify; change a copy of the public inputs and verify again | [Groth16 verification](https://github.com/iden3/snarkjs#24-verify-the-proof) | Original accepted; altered claim rejected |

Explain which artifacts need regeneration after changing constraints. Relate circuit-specific setup to Session 11. Locally generated exercise parameters are for learning.

### Session 12: PLONK {#plonk}

Reuse the computation and inputs. Keep PLONK outputs separate from Groth16 outputs.

| Step | Operation | Official manual | Check |
| --- | --- | --- | --- |
| 1 | Select compatible Powers of Tau parameters | [README](https://github.com/iden3/snarkjs#readme) | Capacity and curve compatibility |
| 2 | Generate circuit keys with `plonk setup` | [PLONK setup](https://github.com/iden3/snarkjs#15-setup) | Universal SRS still requires circuit preprocessing |
| 3 | Export key, prove and verify | [Key export](https://github.com/iden3/snarkjs#22-export-the-verification-key), [proving](https://github.com/iden3/snarkjs#23-create-the-proof), [verification](https://github.com/iden3/snarkjs#24-verify-the-proof) | Select PLONK commands |
| 4 | Alter public inputs; regenerate keys after circuit changes | Repeat the matching instructions | Rejection, SRS reuse and preprocessing |

Do not apply Groth16 phase-two contribution steps to PLONK. [gnark and Dusk PLONK](./#plonk) provide Go/Rust alternatives. Distinguish a Circom R1CS input route from directly writing PLONKish gates and copy constraints.

In the exercise log, record how challenges are mapped into the field, the per-check false-acceptance bounds and total error bound, and range constraints on public values and witnesses. Check the protocol specification for bias-free challenge conversion; a failed test alone does not prove soundness. For circuits representing integers, verify range constraints that prevent wraparound modulo the field size.

### Session 13: STARK {#stark}

Choose one implementation and start with a small official example.

| Approach | Implementation and manuals | Inspect |
| --- | --- | --- |
| Follow Python code | [Anatomy of a STARK](https://aszepieniec.github.io/stark-anatomy/), [Part 5](https://aszepieniec.github.io/stark-anatomy/rescue-prime), [code and tests](https://github.com/aszepieniec/stark-anatomy/tree/master/code) | Rescue-Prime, traces, constraints, proving and verification. Jekyll instructions serve the website, not the Python exercise |
| Write AIR in Rust | [Winterfell usage](https://github.com/facebook/winterfell#usage), [examples](https://github.com/facebook/winterfell/tree/main/examples), [API](https://docs.rs/winterfell/latest/winterfell/) | Trace construction, transitions, boundary assertions, proving and verification |
| Prove VM execution | [Miden VM CLI and examples](https://github.com/0xMiden/miden-vm/blob/next/miden-vm/README.md) | Instructions, inputs, outputs and execution proof. Match `next` documentation to your release |

1. Run an official example and save successful verification results.
2. Identify public inputs/outputs, trace and constraints. With a VM, distinguish the user program from the VM's internal AIR.
3. Keep the proof fixed and change a copy of a public output or other verified input; confirm rejection.
4. Vary trace length while keeping implementation and security settings fixed; record proof size and timings.

Explain the separate roles of Merkle commitments, FRI proximity testing and AIR constraints. Also distinguish transparency from zero knowledge. Winterfell's README states that it does not provide perfect zero knowledge; compare implementation guarantees with Session 13's theory.

## Session 14: Compare and interpret results {#comparison}

Connect experiments to [Session 14](../learn/session-14). If you cannot implement the same computation, compare structures and artifacts rather than treating timings as a ranking.

| Record | Include |
| --- | --- |
| Environment | Implementation/commit, OS, CPU, RAM, language version, build configuration |
| Computation | Circuit/program, number of public inputs, constraint count or trace length |
| Security settings | Curve, field, hash, SRS origin and FRI parameters as applicable |
| Verification | Acceptance/rejection, modified public values and logs |
| Proof size | Bytes and serialization format; distinguish JSON from binary |
| Timing | Separate setup, witness/trace generation, proving and verification; record repetitions and aggregation method |
| Theory | Completeness, soundness, zero knowledge, assumptions and setup differences |

A successful or failed test is not a mathematical proof of completeness or soundness. Not displaying a secret does not establish zero knowledge. Separate observations from guarantees stated in papers and implementation documentation.

## Session 15: Advanced exercises {#advanced}

Choose an extension after finishing the basic exercises.

| Topic | Procedure and references | Deliverable |
| --- | --- | --- |
| Recursion and folding | Follow [Nova's Tests and examples](https://github.com/microsoft/Nova#tests-and-examples); run the version-matched `minroot` example and vary steps | Distinguish state continuity, folding and final proving/verification. Account for compression separately when included |
| Sumcheck and GKR | Read [Session 15](../learn/session-15) and [Thaler's textbook](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html); calculate a small bivariate polynomial sum by hand or in Python | Compare exhaustive evaluation with reducing one variable at a time. Distinguish this exercise from a complete proof implementation |
| Ethereum applications | Follow the primary zkEVM/EIP-8025 references in [Session 15](../learn/session-15) | Identify the computation, verifier, performance requirements, proposal status and access date |

## Save and share results {#git}

Record the example URL/version, commands, public sample inputs, results and interpretation in a workspace README. Use separate protocol directories and names that identify matching keys, proofs and public inputs. Large generated artifacts and witnesses can remain outside Git, with regeneration instructions recorded instead.

- [Pro Git](https://git-scm.com/book/en/v2): inspect with `status` and `diff`, then record with `commit`.
- [ZK Fukuoka editing guide (Japanese)](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/CONTRIBUTING.md): local editing and previews.

## Review mathematical operations {#math}

Enter `GF(7)(3)^(-1)` in [SageMathCell](https://sagecell.sagemath.org/) and press **Evaluate**. Compare the result, `5`, with the [finite-field exercise](../learn/foundations#finite-field).

[SageMath tutorial](https://doc.sagemath.org/html/en/tutorial/) · [Installation](https://doc.sagemath.org/html/en/installation/) · [Prerequisites and supplementary resources](../learn/foundations)
