---
outline: [2, 3]
prev:
  text: Session 14 · An integrated perspective
  link: /en/learn/session-14
next: false
---

# Session 15 (final): Directions for further development

::: info Lecture manuscript
This is an English translation of the supplied Session 15 manuscript, with reference links and editorial notes on recursion, folding, and performance comparisons.
:::

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

This enables aggregation of several proofs into one and continual compression of an indefinitely continuing computation, such as a blockchain's sequence of state transitions, into a proof of fixed size. Whereas Sessions 11–13 described proofs of individual computations, recursion makes those proofs composable. It is a **technique for combining protocols at a higher level**.

### 1.3 Technical requirements: making verification amenable to recursion

The verification algorithm $V$ must be easy to express in the outer proof system's arithmetization. Pairing operations from Session 7 can be particularly expensive to arithmetize inside another proof system. This motivates advanced algebraic constructions beyond Act II, such as **pairs of elliptic curves forming a cycle**, described in the manuscript as curve pairs designed to express pairing operations on one curve efficiently as R1CS on another.

*We do not derive curve cycles here. The structural lesson is that making a verifier easier to represent in another proof system motivates new algebraic tools.*

::: info Note: recursion and curve cycles
An “indefinitely continuing computation” means proving the **finite history completed so far** at each step. Even when proof size is independent of the number of steps, it can depend on security parameters and the size of public state.

A curve cycle matches the base field of one curve to the scalar field of the other. Such cycles also support recursion without pairings; they are not defined solely as pairs that make pairing operations efficient. Nor does every recursive construction require a curve cycle. See the [Nova paper](https://eprint.iacr.org/2021/370).
:::

---

## 2. Folding schemes (Nova and related work)

### 2.1 Practical challenges of recursive proofs

Naive recursion, which performs complete verification inside each proof, can repeatedly incur expensive operations such as pairings and substantially increase prover cost. Folding schemes, exemplified by Nova (Kothapalli, Setty, Tzialla, 2021), address this challenge.

### 2.2 The idea: folding instead of full verification

The central idea is to **fold two computation instances into one new instance instead of fully verifying them**. Folding is much lighter than full proof generation and verification. Computation steps are folded incrementally, and a complete proof is generated for the accumulated final instance.

An intuitive analogy is FRI's **recursive folding structure** from Session 6, which halves polynomial degree. FRI reduces polynomial degree, whereas folding schemes aggregate the instances to be proved. These are different objects, but both use incremental operations to avoid repeatedly performing all the expensive work.

### 2.3 Where this approach helps

Folding schemes target the prover-cost axis in Session 14's comparison, especially for sequential computations such as repeated blockchain state transitions. They are particularly useful for proving cumulative computation.

::: info Note: folding versus the final proof
Nova folds relaxed R1CS instances and witnesses. Folding alone is not a complete succinct zero-knowledge proof: distinguish the IVC construction from final compression. The comparison with FRI is an intuition, not a claim that they use the same protocol or soundness proof. The manuscript's 2021 date is the [ePrint publication year](https://eprint.iacr.org/2021/370); the reference's 2022 date is the CRYPTO publication year.
:::

---

## 3. GKR/sumcheck-based directions

### 3.1 Revisiting the sumcheck protocol

We now return to sumcheck, previewed in Session 1. For a multivariate polynomial $g(X_1, \dots, X_n)$, sumcheck verifies a claimed value of

$$\sum_{x_1, \dots, x_n \in \{0,1\}} g(x_1, \dots, x_n)$$

interactively, fixing one variable at a time, without the verifier evaluating every summand. It is also central to the proof techniques behind IP = PSPACE from Session 1.

### 3.2 The GKR protocol

GKR (Goldwasser–Kalai–Rothblum, 2008) applies sumcheck layer by layer to construct an interactive proof of a circuit computation. It provides an arithmetization and verification approach different from the R1CS/AIR approaches in Session 4.

### 3.3 Why these approaches are receiving renewed attention

The manuscript emphasizes **theoretical improvements in prover cost compared with other methods, particularly FFT-heavy KZG-based approaches**, as a reason for renewed interest. Applications to large computations where proving is the bottleneck, including proofs of machine-learning inference, are actively studied.

### 3.4 Position within the IOP framework

Returning to Session 10's framework, GKR/sumcheck-based approaches can also be viewed through “IOP design (layer-by-layer sumcheck) → implementation (polynomial commitments) → non-interactivity (Fiat–Shamir).” The tools already learned can therefore serve as a map for understanding new research directions.

::: info Note: sumcheck assumptions and the scope of comparisons
Sumcheck requires bounds on the degree in each variable and a way to verify the polynomial's final random-point evaluation. Original GKR is an interactive proof and does not inherently include polynomial commitments or Fiat–Shamir. Read Section 3.4 as a guide to constructing a non-interactive cryptographic argument.

Section 3.3 and the next section organize research around prover cost. They do not establish that every GKR/sumcheck system outperforms every KZG system. Comparisons need aligned circuit structures, commitments, memory budgets, and security parameters. See [Thaler's textbook](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html).
:::

---

## 4. A research map: expanding the two-axis matrix

Let us expand the matrix from Sessions 2 and 14 one final time. Act III has shown that efficiency is not a single quantity: it includes **proof size, verification cost, prover cost, setup flexibility, and long-term security**. Research can be understood as improving particular dimensions, especially prover cost, within this multidimensional space.

| Technique | Main dimension improved |
| --- | --- |
| Recursive proofs | Proof composability: adding a new capability |
| Folding schemes | Prover cost, particularly for sequential computation |
| GKR/sumcheck | Prover cost, particularly for large parallel computations |

This organization highlights a broader trend: **while early SNARK/STARK research emphasized minimizing verifier cost through succinctness, increasing attention is being directed toward minimizing prover cost**.

### 4.1 An application perspective: Ethereum zkEVMs {#ethereum-zkevm}

**A zkEVM proves correct EVM execution.** ZK rollups execute L2 transactions and verify their validity on Ethereum L1. **L1 zkEVM research**, in contrast, targets Ethereum's own block execution, aiming eventually to replace validators' re-execution burden with proof verification. These are distinct applications. Correct execution and cheaper verification are the goals here; the name zkEVM does not by itself imply transaction privacy. See Ethereum's [L1 zkEVM overview](https://ethereum.org/roadmap/zkevm/) and [ZK-rollup overview](https://ethereum.org/developers/docs/scaling/zk-rollups/).

### 4.2 Recent directions: interoperability and security alongside speed

::: info Information checked on September 27, 2026
This is a snapshot of research and proposals based on primary sources. Roadmap objectives, EIP proposals, and mainnet activation are different stages.
:::

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
