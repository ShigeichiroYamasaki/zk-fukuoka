---
outline: [2, 3]
---

# Basic operation manuals

Updated: October 14, 2026

Follow the Act III exercises (Sessions 11–15): generate and verify a proof, compare setup requirements, inspect execution traces, compare results, and explore advanced constructions.

[Exercises](./) · [Implementations and tools](./tools) · [Prerequisites](../learn/foundations)

Official documentation reference check: October 12, 2026. This page provides a reading order and exercise guide to official manuals. Use commands from the documentation matching your chosen version. Checking a reference does not mean that version was tested locally.

[Applied course: build an ERC-20 transfer ZK rollup](../rollup/) - six development stages and runnable starter models.

[Applied course: private-input ZKML inference](../zkml/) — [Runnable code and manual](../zkml/02-proof).

[JPKI wallet tips](../tipping/) and [ZK attribute proofs for data minimization](../data-minimization/) are currently design and threat-analysis exercises. No runnable JPKI integration, credential issuance, anonymous credential or ZK attribute-proof code is provided.

## Run the tools in Docker {#docker}

The repository's [`compose.yaml`](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/compose.yaml) provides separate containers for Ruby 3.4, Node.js 24, and optional Foundry / Anvil. Exercise files remain in your local checkout, and the Anvil port is bound to this computer only. Docker Desktop or Docker Engine with Compose v2 is required.

Run these commands from the repository root. On macOS / Linux, match the container UID and GID so files created by a container remain editable on the host. Omit the first line on Windows.

```sh
export LOCAL_UID="$(id -u)" LOCAL_GID="$(id -g)"
docker compose pull ruby node
docker compose run --rm ruby ruby docs/public/examples/rollup/ledger_model.rb --test
docker compose run --rm node npm --prefix docs/public/examples/zkml install
docker compose run --rm node npm --prefix docs/public/examples/zkml run demo
```

ZKML's `node_modules` are stored in a named Docker volume. Run standalone Circom commands in the Node.js container, for example `npx --yes circom2@0.2.22 --version`. To use Foundry / Anvil, start `docker compose --profile evm run --rm --service-ports foundry` in another terminal. The local RPC endpoint is `http://127.0.0.1:8545`. Check Forge with `docker compose --profile evm run --rm --entrypoint forge foundry --version`. Follow each applied-course guide for the actual contract exercise.

Stop Anvil with `Ctrl+C` in its terminal. Ruby and Node.js use major / minor tags that follow patch updates; Foundry is pinned to `v1.8.5`. To reproduce an experiment, record `docker compose images` and `docker compose config`, and pin image digests if needed. Anvil is for local exercises; this configuration does not connect to a testnet or production environment.

### Test the Ruby examples {#ruby-tests}

[`test/ruby/test_examples.rb`](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/test/ruby/test_examples.rb) uses standard-library Minitest to check the distributed arithmetic examples, ledger model, training script and STARK cost model. From the repository root, run either command:

```sh
ruby test/ruby/test_examples.rb
docker compose run --rm ruby ruby test/ruby/test_examples.rb
```

These tests check program behavior; they do not prove zero knowledge or cryptographic security.

## Tools for applied courses {#applied}

Check what code is provided and what remains an implementation task. **You do not need to install every tool.** Start with synthetic data and local environments; do not use real personal data, real assets or real JPKI credentials.

| Applied course | What currently runs in the course | Main tools | Not implemented / notes |
| --- | --- | --- | --- |
| [ERC-20 ZK rollup](../rollup/) | Ruby balance-ledger model and introductory Circom transfer-arithmetic circuit | Ruby, Circom / circomlib / snarkjs, Solidity / Foundry (Forge and Anvil), OpenZeppelin Contracts | Ruby is the default for off-chain reference models. A complete E2E connecting signatures, Merkle trees, batch proofs and L1 contracts is a student implementation task. |
| [Private-input ZKML inference](../zkml/) | Train the small integer classifier in Ruby; run proof, verification and tamper-rejection with Circom / snarkjs | Ruby, Node.js LTS / npm, `circom2` 0.2.22 (Circom 2.2.2), `snarkjs` 0.7.5 | Ruby is the default for off-chain learning scripts. Proving tool versions are pinned in the provided `package.json`. EZKL / ONNX is an extension option and is not run by the provided code. |
| [JPKI wallet tips](../tipping/) | Design data flows, public disclosures, threats and institutional assumptions | Synthetic data, spreadsheet or Markdown, threat-analysis table. Future prototype candidates: Circom / snarkjs and Foundry / Anvil | No implementation code, credential format, signature scheme or revocation scheme is provided or selected. Do not use real JPKI, My Number data or real assets. |
| [Data minimization](../data-minimization/) | Compare stored fields and breach exposure for conventional and minimized designs using synthetic users | Spreadsheet or Ruby standard library (`csv`) | Ruby is the default for helper scripts. ZK attribute-proof circuit, credential signature format and issuance / revocation system are not provided or selected. This is currently a design exercise. |

### Rollup: from reference model to a local L1 {#rollup-tools}

1. Save `ledger_model.rb` from the [ledger model exercise](../rollup/01-ledger#run), then run `ruby ledger_model.rb` and `ruby ledger_model.rb --test`. Begin with conservation of balances and failure-case tests. No external gems are required.
2. Use the [`transfer_core.circom` circuit](../rollup/03-circuit#core) to compile, generate a witness and inspect the R1CS. This introductory circuit does not include signatures or Merkle paths. Consult [Circom installation](https://docs.circom.io/getting-started/installation/) and [circomlib circuits](https://github.com/iden3/circomlib); record Node/npm and Circom versions.
3. For L1, use `forge` and `anvil` from the [official Foundry installation guide](https://getfoundry.sh/introduction/installation/). Use `forge build` to compile and `forge test` for state-transition tests; connect only to the local Anvil chain. See [creating a Foundry project](https://getfoundry.sh/projects/creating-a-new-project/) and [OpenZeppelin ERC-20 / SafeERC20](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20). Testnet transactions are unnecessary for the core exercise.
4. To independently reconstruct state after operator failure, implement `operator/replay.ts` from [Stage 6](../rollup/06-availability). The course does not choose a TypeScript runtime or Ethereum JSON-RPC client; select and pin one as a team, and document where the client is used.

### ZKML: reproduce the provided code {#zkml-tools}

1. Save `train.rb`, `classifier.circom`, `package.json` and `run.cjs` from [the proof walkthrough](../zkml/02-proof) into a new directory.
2. With Ruby and Node.js LTS / npm, run `ruby train.rb`, `npm install` and `npm run demo` in that order. Respect the versions in `package.json` and record the generated `package-lock.json`.
3. Confirm normal proof verification and rejection after changing the public classification result. Use [standalone verification instructions](../zkml/02-proof#what-the-verifier-receives) for the verifier-only workflow.
4. To try a larger neural network, separately investigate a model framework that exports ONNX and the [official EZKL documentation](https://docs.ezkl.xyz/). This is a separate route from the provided Circom exercise; validate quantized output differences, supported operations and tool versions.

### Tips and data minimization: distinguish design work from implementation {#privacy-tools}

- For tips, follow the [design exercise](../tipping/) using only fictional identity-check results and credentials. Map what the issuer, user device, verifier and payment provider retain. No code currently performs real JPKI integration or anonymous credential issuance.
- If adding a local prototype later, limit it to a fake issuer key, fictional credentials and a test token on local Anvil. Decide how credential signatures, revocation and nullifiers work before implementing a proof circuit with Circom / snarkjs. Installing libraries alone does not establish credential validity or privacy.
- For data minimization, follow the [breach-exposure exercise](../data-minimization/) with ten fictional records. Use a spreadsheet or Ruby's standard `csv` library. Do not enter real names, birth dates or identity documents.
- If implementing credential signatures or revocation, document the selected scheme, version and threat model before presenting it as a confirmed tool in this manual.


## Act III exercise route {#route}

| Session | Activity | Instructions | Completion target |
| --- | --- | --- | --- |
| [11: Groth16](../learn/session-11) | Prove a circuit and verify it | [Groth16](#groth16) | Distinguish circuit, witness, keys and proof |
| [12: PLONK](../learn/session-12) | Prove the same computation differently | [PLONK](#plonk) | Distinguish universal SRS from circuit preprocessing |
| [13: STARK](../learn/session-13) | Inspect traces and constraints | [STARK](#stark) | Connect transition and boundary constraints to verification |
| [14: Integration](../learn/session-14) | Record comparable experiments | [Comparison](#comparison) | Separate measurements from theoretical properties |
| [15: Further directions](../learn/session-15) | Explore recursion, folding and sumcheck | [Advanced exercises](#advanced) | Explain what is combined and which costs are reduced |

Ruby is the default for off-chain ledger, training and aggregation models in the applied courses. Circom is used for proof circuits, Solidity for L1 contracts, and Node.js where required by proving tools. Start Sessions 11–12 with **Circom + snarkjs** to reuse a circuit. Anatomy of a STARK is an external Python resource; Winterfell is an external Rust implementation for writing AIR; Miden VM is an external VM exercise. Installing every implementation is unnecessary.

## Common preparation and circuit creation {#circuits}

### Prepare a workspace

Create an exercise directory and record the implementation release or commit and language/compiler versions. Match examples and API documentation to that version. Start with small, public sample inputs.

| Environment | Installation and operation manuals | First check |
| --- | --- | --- |
| Circom + snarkjs | [snarkjs README](https://github.com/iden3/snarkjs#readme), [Circom installation](https://docs.circom.io/getting-started/installation/) | Node.js, Circom and snarkjs run; help is available |
| Go | [gnark getting started](https://docs.gnark.consensys.io/HowTo/get_started) | Example and dependency versions match |
| Rust | [Rust installation](https://doc.rust-lang.org/book/ch01-01-installation.html) and the selected implementation README | Record Rust/Cargo versions and feature flags |
| Ruby | [Installing Ruby](https://www.ruby-lang.org/en/documentation/installation/), [Ruby in Twenty Minutes](https://www.ruby-lang.org/en/documentation/quickstart/), [Ruby reference](https://docs.ruby-lang.org/en/) | Use a maintained stable release, not a preview. The provided Ruby code uses standard libraries only |
| External Python resource | [Anatomy code](https://github.com/aszepieniec/stark-anatomy/tree/master/code) | This language choice belongs to the external resource, not the site's applied-course default |

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
| Read an external Python implementation | [Anatomy of a STARK](https://aszepieniec.github.io/stark-anatomy/), [Part 5](https://aszepieniec.github.io/stark-anatomy/rescue-prime), [code and tests](https://github.com/aszepieniec/stark-anatomy/tree/master/code) | Rescue-Prime, traces, constraints, proving and verification. This external resource uses Python. Jekyll instructions serve its website, not the code exercise |
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
| Sumcheck and GKR | Read [Session 15](../learn/session-15) and [Thaler's textbook](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html); calculate a small bivariate polynomial sum by hand or in Ruby | Compare exhaustive evaluation with reducing one variable at a time. Distinguish this exercise from a complete proof implementation |
| Ethereum applications | Follow the primary zkEVM/EIP-8025 references in [Session 15](../learn/session-15) | Identify the computation, verifier, performance requirements, proposal status and access date |

## Save and share results {#git}

Record the example URL/version, commands, public sample inputs, results and interpretation in a workspace README. Use separate protocol directories and names that identify matching keys, proofs and public inputs. Large generated artifacts and witnesses can remain outside Git, with regeneration instructions recorded instead.

- [Pro Git](https://git-scm.com/book/en/v2): inspect with `status` and `diff`, then record with `commit`.
- [ZK Fukuoka editing guide (Japanese)](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/CONTRIBUTING.md): local editing and previews.

## Review mathematical operations {#math}

Enter `GF(7)(3)^(-1)` in [SageMathCell](https://sagecell.sagemath.org/) and press **Evaluate**. Compare the result, `5`, with the [finite-field tutorial](../learn/finite-fields-tutorial).

[SageMath tutorial](https://doc.sagemath.org/html/en/tutorial/) · [Installation](https://doc.sagemath.org/html/en/installation/) · [Prerequisites and supplementary resources](../learn/foundations)
