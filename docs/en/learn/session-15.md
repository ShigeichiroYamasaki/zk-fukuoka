---
outline: [2, 3]
prev:
  text: Session 14 · An integrated perspective
  link: /en/learn/session-14
next: false
---

# Session 15 (final): Directions for further development

[Sessions](./sessions) · [Topics](./topics) · [Session 15 in the syllabus](./#session-15) · [Exercises](../exercises/)

## Context and learning objectives

Across Acts I–III, we have studied the purposes, tools, and concrete protocols of zk-SNARKs and zk-STARKs. This final session looks at ongoing research. Rather than presenting an unordered collection of new topics, we organize them around **the expressiveness × efficiency axes introduced in Session 2 and revisited in Session 14, asking where research is making progress**.

The three learning objectives are:

1. Understand the new capabilities enabled by recursive SNARKs, and why they extend the efficiency axis.
2. Understand which practical problems of recursive proofs are addressed by folding schemes such as Nova.
3. Understand how GKR/sumcheck-based approaches relate to the IOP framework from Session 10 and open a new optimization axis: prover cost.

---

## 1. Recursive proofs (recursive SNARKs)

### 1.1 The idea: verifying a proof inside a proof

The protocols studied so far prove that a computation was performed correctly. Recursive proofs go a step further: **another SNARK or STARK proves that a proof was verified correctly**. The verification algorithm $V$ itself becomes the computation to be arithmetized, as in Session 4, and its correct execution is wrapped in a new proof.

### 1.2 Why this is powerful

Recursion enables aggregation and incremental proofs of the **finite computation history completed so far**, such as a sequence of state transitions. Some constructions keep proof size independent of the number of steps, but dependencies on security parameters and public-state size remain. This does not mean proving that an infinite computation has completed.

Sessions 11–13 studied proofs of individual computations. Recursion composes them by treating verification as another computation.

### 1.3 Technical requirements: making verification amenable to recursion

The verification algorithm $V$ must be efficiently represented in the outer proof system. Pairings can be expensive to arithmetize, and differing fields for group operations and outer-circuit arithmetic can also add cost.

One useful tool is an **elliptic-curve cycle**. In a two-curve cycle, one curve's base field matches the other's scalar field, and vice versa. This helps represent group operations in circuits, including recursion without pairings. A cycle is not defined merely as a pair that makes pairing operations efficient, and not every recursive construction requires one. See the [Nova paper](https://eprint.iacr.org/2021/370).

---

## 2. Folding schemes (Nova and related work)

### 2.1 Practical challenges of recursive proofs

Naive recursion embeds verification of the previous proof into a circuit at each step, potentially imposing substantial prover work. Pairing-based verifiers incur pairing costs, but not every recursive scheme uses pairings.

Folding schemes such as Nova (Kothapalli, Setty, Tzialla) reduce this repeated overhead. Nova appeared on [ePrint in 2021](https://eprint.iacr.org/2021/370) and at CRYPTO 2022.

### 2.2 The idea: folding the relations to be verified

Nova **combines relaxed R1CS instances into one and updates the corresponding witness**. Its IVC (incrementally verifiable computation) construction uses lightweight folding verification instead of repeatedly embedding an expensive SNARK verifier to accumulate computation history.

Folding alone does not produce a complete succinct zero-knowledge proof. Distinguish folding that aggregates relations, IVC that enforces the correct sequence of steps, and compression that proves the accumulated relation succinctly. Final proof size, verification cost, and zero knowledge depend on the combined construction.

FRI from Session 6 also uses folding, but reduces polynomial degree for proximity testing; Nova aggregates constraint-satisfaction instances. The incremental-processing analogy does not make them the same protocol or give them the same soundness proof.

### 2.3 Where this approach helps

Folding schemes target cumulative proving costs for sequential computations such as repeated state transitions. Benefits depend on the step computation, commitments, compression frequency, and implementation. Evaluate folding overhead together with the final proof-generation cost.

---

## 3. GKR/sumcheck-based directions

### 3.1 Revisiting the sumcheck protocol

We now return to sumcheck, previewed in Session 1. For a multivariate polynomial $g(X_1, \dots, X_n)$, sumcheck verifies a claimed value of

$$\sum_{x_1, \dots, x_n \in \{0,1\}} g(x_1, \dots, x_n)$$

interactively, fixing one variable at a time, without the verifier evaluating every summand. Each variable needs a degree bound, and the verifier checks degrees and sum consistency round by round. The final random-point evaluation of $g$ must also be verified, either directly or through another appropriate mechanism; without that check, the claimed sum is not established. Sumcheck is also central to IP = PSPACE from Session 1.

### 3.2 The GKR protocol

GKR (Goldwasser–Kalai–Rothblum, 2008) applies sumcheck layer by layer to construct an interactive proof of a circuit computation. It provides an arithmetization and verification approach different from the R1CS/AIR approaches in Session 4.

### 3.3 Why these approaches are receiving renewed attention

GKR/sumcheck-based techniques exploit layered circuits and multilinear representations to reduce prover work. Large circuits and machine-learning inference provide examples for asking which computation structure a prover can exploit.

This establishes no universal ranking over KZG-based systems. Sumcheck and KZG are not components at the same level: a sumcheck-based proof system may also use polynomial commitments. Compare complete systems with aligned circuit structures, commitments, memory budgets, and security parameters. See [Thaler's textbook](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html).

### 3.4 Position within the IOP framework

Original GKR is an interactive proof, without polynomial commitments or Fiat–Shamir as mandatory components. To build a non-interactive cryptographic argument, one can consider authenticating required polynomial evaluations through commitments and deriving challenges with Fiat–Shamir. The security conditions for the components and transformation must then be checked.

Session 10's “IOP design → implementation → non-interactivity” map helps compare such constructions. Distinguish GKR itself from the non-interactive proof system built around it.

---

## 4. A research map: expanding the two-axis matrix

Let us expand the matrix from Sessions 2 and 14 one final time. Act III has shown that efficiency is not a single quantity: it includes **proof size, verification cost, prover cost, setup flexibility, and long-term security**. The techniques in this session target dimensions such as composability and prover cost. Security and setup assumptions are also design requirements to check alongside performance.

| Technique | Main dimension improved |
| --- | --- |
| Recursive proofs | Proof composability: adding a new capability |
| Folding schemes | Prover cost, particularly for sequential computation |
| GKR/sumcheck | Prover cost, particularly for large parallel computations |

This table highlights **directions that improve prover cost and composability alongside succinct verification**. Use it to identify improvements and remaining conditions or costs, rather than treating the entire field as moving toward a single objective.

### 4.1 An application perspective: Ethereum zkEVMs {#ethereum-zkevm}

**A zkEVM proves correct EVM execution.** ZK rollups execute L2 transactions and verify their validity on Ethereum L1. **L1 zkEVM research**, in contrast, targets Ethereum's own block execution, aiming eventually to replace validators' re-execution burden with proof verification. These are distinct applications. Correct execution and cheaper verification are the goals here; the name zkEVM does not by itself imply transaction privacy. See Ethereum's [L1 zkEVM overview](https://ethereum.org/roadmap/zkevm/) and [ZK-rollup overview](https://ethereum.org/developers/docs/scaling/zk-rollups/).

### 4.2 Recent directions: interoperability and security alongside speed

**Information checked on September 27, 2026.** This is a snapshot of research and proposals based on primary sources. Roadmap objectives, EIP proposals, and mainnet activation are different stages.

- **A common zkVM foundation:** Proving EVM execution programs inside general-purpose zkVMs requires compatible guest interfaces. The February 16, 2026 zkVM Standards v0 release defines RV64IM + Zicclsm and C interfaces for precompiles and IO. Guests still need recompilation and relinking; this is not universal binary portability. [EF standards announcement](https://zkevm.ethereum.foundation/blog/zkevm-standards-v0-release)
- **Evaluating security alongside speed:** Average proving time is insufficient; difficult blocks matter too. EF's May 2026 rollout article discusses worst-case proving, while a separate article examines the scope and assumptions of formal verification. Benchmarks and a “formally verified” label cannot establish security of the entire stack. [Rollout and worst-case challenges](https://zkevm.ethereum.foundation/blog/eip-8025-optional-execution-proofs-hegota), [formal-verification scope](https://zkevm.ethereum.foundation/blog/sp1-fv)
- **A staged path from optional proofs:** EF's September 7, 2026 priorities describe movement toward eventual mandatory execution proofs. Ordering relative to post-quantum milestones remains under discussion; this is not a confirmed activation date. [EF Protocol: Current and Emerging Priorities](https://blog.ethereum.org/2026/09/07/protocol-priorities)

### 4.3 EIP-8025: Optional Execution Proofs {#eip-8025}

[EIP-8025](https://eips.ethereum.org/EIPS/eip-8025) is **Draft** at the review date. It proposes opt-in execution-proof distribution and verification over the consensus-layer P2P network. **Current specifications retain payload re-execution: proofs are supplementary checks.** Mandatory proofs and removing re-execution belong to a later EIP. This proposal adds no proving rewards. See its [Consensus Layer section](https://eips.ethereum.org/EIPS/eip-8025#consensus-layer).

EF's May 14, 2026 article proposes inclusion in Hegotá; a proposal does not establish mainnet activation. [Hegotá proposal article](https://zkevm.ethereum.foundation/blog/eip-8025-optional-execution-proofs-hegota)

### 4.4 Connecting the application to the course's research map

This table is a course-oriented interpretation of these developments. It does not claim that EIP-8025 selects a particular folding scheme or GKR construction.

| Application question | Course connection | Evaluation dimensions |
| --- | --- | --- |
| Does the proof capture every required EVM execution rule? | Arithmetization (Session 4) and general computation | Expressiveness, compatibility, implementation correctness |
| Can proofs arrive within the required time? | GKR/sumcheck, parallelization, prover cost | Average and worst-case latency, memory and hardware cost |
| Can proofs of computation segments be combined efficiently? | Recursion and aggregation; folding where appropriate to the construction | Proof size, proving cost, bandwidth |
| Can validation become cheaper through a safe transition? | Soundness (Sessions 1 and 14) and staged protocol adoption | Verification cost, security, operational reliability |

Discussion prompts: “If a proof is small but slow to generate, how do L2 batching and L1 block validation differ?” and “What measurements and security evidence are needed before supplementary proofs become mandatory?” These questions connect theoretical efficiency to operational requirements.

---

## Summary: the course as a whole

Across the 15 sessions, we followed this path:

- **Act I:** Starting from the limitations of classical proof paradigms, we defined interaction and zero knowledge as goals arising from both complexity theory and cryptography. We then understood why generalizing witnesses requires a qualitative shift: arithmetization.
- **Act II:** We developed the tools needed for those goals—polynomials, coding theory, elliptic curves, pairings, commitments, and PCPs/IOPs—with their cryptographic and complexity-theoretic significance, rather than as a disconnected list of mathematical topics.
- **Act III:** We read Groth16, PLONK, and STARK through the way they combine Act II's tools, compared their design choices using Act I's axes, and finally considered where ongoing research is extending those axes.

The lasting goal is not memorization of every protocol detail. It is **the habit of asking why a technology takes its particular form, using a consistent framework of goals, tools, and trade-offs**. This field continues to develop rapidly. The two-axis map helps us independently identify what a new technique is trying to improve.

---

## References and further reading

- Bitansky, Canetti, Chiesa, Tromer, [“Recursive Composition and Bootstrapping for SNARKs and Proof-Carrying Data,”](https://eprint.iacr.org/2012/095) STOC 2013. Foundations of recursive proofs; public PDF available.
- Kothapalli, Setty, Tzialla, [“Nova: Recursive Zero-Knowledge Arguments from Folding Schemes,”](https://eprint.iacr.org/2021/370) CRYPTO 2022. Original paper; public PDF available.
- Goldwasser, Kalai, Rothblum, [“Delegating Computation: Interactive Proofs for Muggles,”](https://www.microsoft.com/en-us/research/publication/delegating-computation-interactive-proofs-muggles/) STOC 2008. Original GKR paper; [public PDF](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/12/2008-DelegatingComputation.pdf).
- Thaler, [*Proofs, Arguments, and Zero-Knowledge*](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html). A comprehensive textbook emphasizing sumcheck, with a [free PDF](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf). Recommended for reviewing and extending this course.
