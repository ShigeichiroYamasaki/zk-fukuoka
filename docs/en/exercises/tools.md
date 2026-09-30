---
outline: [2, 3]
---

# Available tools

Choose implementations and computation environments for Act III (Sessions 11–15) according to your objective and experience. Then follow the matching [operation manual](./manuals#route).

[Exercises](./) · [Basic operation manuals](./manuals) · [Prerequisites](../learn/foundations)

[Applied course: build an ERC-20 transfer ZK rollup](../rollup/) - six development stages and runnable starter models.

[Applied course: private-input ZKML inference](../zkml/) — [Runnable code and manual](../zkml/02-proof).


## Choose tools for Act III {#choose}

| Session and objective | Starting option | Why choose it? | Instructions |
| --- | --- | --- | --- |
| [11: Groth16](../learn/session-11) | Circom + snarkjs | Complete a circuit-to-proof workflow | [Groth16](./manuals#groth16) |
| [12: PLONK](../learn/session-12) | Same Circom circuit + snarkjs | Compare setup and artifacts for the same computation | [PLONK](./manuals#plonk) |
| [13: STARK](../learn/session-13) | Anatomy of a STARK / Winterfell / Miden VM | Read Python internals / write AIR in Rust / prove VM execution | [STARK](./manuals#stark) |
| [14: Comparison](../learn/session-14) | Selected implementations + spreadsheet or Python + Git | Record conditions and compare results | [Comparison](./manuals#comparison) |
| [15: Extensions](../learn/session-15) | Nova; SageMath / Python | Explore recursion/folding and small sumcheck calculations | [Advanced exercises](./manuals#advanced) |

You do not need every tool. Beginners can complete Sessions 11–12 with Circom + snarkjs, then choose a STARK implementation at the desired level. Go programmers may start with gnark; Rust programmers may prefer library examples.

## Circuits and zero-knowledge proofs

### Session 11: Groth16 tools {#groth16}

| Implementation | Exercise role | Environment and audience | Manuals |
| --- | --- | --- | --- |
| [Circom](https://github.com/iden3/circom) + [snarkjs](https://github.com/iden3/snarkjs) | Compile constraints and witness-generation code with Circom; set up, prove and verify with snarkjs | Local Circom + Node.js; introductory route | [Preparation](./manuals#circuits) → [Groth16](./manuals#groth16), [README](https://github.com/iden3/snarkjs#readme) |
| [ZoKrates](https://github.com/ZoKrates/ZoKrates) | Compile a short program, compute its witness and prove it | CLI or Docker; learn through a dedicated language | [Getting Started](https://zokrates.github.io/gettingstarted.html), [select G16](https://zokrates.github.io/toolbox/proving_schemes.html) |
| [gnark](https://github.com/Consensys-Incorporated/gnark) | Connect Go circuit definitions with Groth16 Setup, Prove and Verify | Go development environment | [Installation](https://docs.gnark.consensys.io/HowTo/get_started), [proving and verification](https://docs.gnark.consensys.io/HowTo/prove) |
| [bellman](https://github.com/zkcrypto/bellman) | Read constraints, gadgets and Groth16 APIs | Rust/Cargo; advanced | [Example and API, 0.14.0](https://docs.rs/bellman/0.14.0/bellman/#example-circuit) |

Circom is a circuit compiler; it does not complete proving and verification on its own. These exercises pair it with snarkjs. See the [implementation examples](./#groth16).

### Session 12: PLONK tools {#plonk}

| Implementation | Exercise role | Environment and audience | Manuals |
| --- | --- | --- | --- |
| [Circom + snarkjs](https://github.com/iden3/snarkjs) | Prove Session 11's circuit with PLONK; inspect universal SRS and circuit preprocessing | Circom + Node.js; continuation route | [PLONK instructions](./manuals#plonk), [setup](https://github.com/iden3/snarkjs#15-setup) |
| [gnark](https://github.com/Consensys-Incorporated/gnark) | Follow SCS compilation and PLONK APIs in Go | Go; compare APIs with Groth16 | [Proving guide, PlonK tab](https://docs.gnark.consensys.io/HowTo/prove) |
| [Dusk PLONK](https://github.com/dusk-network/plonk) | Write circuits and gates; inspect compilation, proving and verification | Rust/Cargo; advanced | [Usage](https://github.com/dusk-network/plonk#usage), [API](https://docs.rs/dusk-plonk/latest/dusk_plonk/) |

Circuit formats and APIs differ across PLONK implementations. Distinguish a Circom R1CS input route from directly working with gates and copy constraints. Browse the [implementation examples](./#plonk).

### Session 13: STARK tools {#stark}

| Implementation | Exercise role | Environment and audience | Manuals |
| --- | --- | --- | --- |
| [Anatomy of a STARK](https://github.com/aszepieniec/stark-anatomy) | Read educational code building from fields, polynomials and FRI | Python; step-by-step study | [Author's tutorial](https://aszepieniec.github.io/stark-anatomy/), [code and tests](https://github.com/aszepieniec/stark-anatomy/tree/master/code) |
| [Winterfell](https://github.com/facebook/winterfell) | Implement traces, transition constraints and boundary assertions | Rust/Cargo; write AIR directly | [Usage](https://github.com/facebook/winterfell#usage), [API](https://docs.rs/winterfell/latest/winterfell/) |
| [Miden VM](https://github.com/0xMiden/miden-vm) | Execute Miden Assembly and generate/verify execution proofs | Rust/Cargo and VM CLI | [CLI and examples](https://github.com/0xMiden/miden-vm/blob/next/miden-vm/README.md) |

The [STARK manual](./manuals#stark) guides normal execution, changed-public-output tests and trace-length experiments. Winterfell's README explicitly says it does not provide perfect zero knowledge. Distinguish transparency, computational integrity and zero knowledge.

## Session 14: Comparison and recording tools {#comparison}

| Tool | Purpose | Instructions |
| --- | --- | --- |
| Selected proof implementation and logs | Record proof size, proving/verification time and acceptance/rejection | [Conditions and recording fields](./manuals#comparison) |
| [Python](https://www.python.org/) or your usual spreadsheet | Store measurements in CSV or similar and aggregate repeated runs under matching conditions | [Programming resources](https://docs.python.org/3/tutorial/) |
| [Git](https://git-scm.com/) | Record code, settings, versions and reproduction steps | [Save and share results](./manuals#git) |

Record serialization formats and security settings. Distinguish JSON from binary sizes and setup from proving time. Measurements of different computations or conditions do not establish a ranking of proof systems.

## Session 15: Advanced exercise tools {#advanced}

| Tool or resource | Exercise role | Environment and audience | Instructions |
| --- | --- | --- | --- |
| [Nova](https://github.com/microsoft/Nova) | Follow recursive computation proofs and folding in examples | Rust/Cargo; after basic exercises | [Tests and examples](https://github.com/microsoft/Nova#tests-and-examples), [advanced exercises](./manuals#advanced) |
| SageMath / Python | Calculate small multivariate polynomial sums and compare with sumcheck | Browser or local; calculation support | [Math environments](#math), [Session 15](../learn/session-15) |

Computing a sum in SageMath or Python is not a GKR or zero-knowledge proof implementation. When reading Nova, distinguish folding, recursive state continuity and compression. Follow the [advanced reading guide](./manuals#advanced) for zkEVM/EIP-8025 applications.

## Mathematical computation

<span id="math"></span>

Use these to revisit Act II or check small calculations in Session 15.

| Tool | Purpose | Access | Instructions |
| --- | --- | --- | --- |
| [SageMathCell](https://sagecell.sagemath.org/) | Try finite-field, polynomial and matrix calculations | Browser; no local installation | [SageMath basics](./manuals#math) |
| [SageMath](https://www.sagemath.org/) | Save computations and investigate fields, polynomials and linear algebra | Local installation or an online environment | [Tutorial](https://doc.sagemath.org/html/en/tutorial/), [installation](https://doc.sagemath.org/html/en/installation/) |

Start by comparing results with the [modulo-7 calculations](../learn/finite-fields-tutorial).

## Match versions and materials {#versions}

Official documentation checked on September 27, 2026. These are exercise candidates; not every tool has been tested locally. External technical manuals are primarily in English.

Record a release or commit and match examples with API documentation. The bellman link targets 0.14.0; the Miden link targets the development branch `next`. Switch `latest` API pages to your installed version. Follow [common preparation](./manuals#circuits) and start with small public samples.
