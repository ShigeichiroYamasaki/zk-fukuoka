---
outline: [2, 3]
prev:
  text: Session 14 · An integrated perspective
  link: /en/learn/session-14
next: false
---

<script setup>

</script>

# Session 15 (final): Directions for further development

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 27, 2026<br>
Last updated: September 29, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 15 in the syllabus](./#session-15) · [Exercises](../exercises/)

## Context and learning objectives

We have set goals, assembled tools, and read concrete proof systems. In this final session, consider the remaining problems. How can proofs of long computations be linked? How can prover work be reduced? Use the expressiveness–efficiency framework from Sessions 2 and 14 to identify the questions that new techniques address.

The three learning objectives are:

1. Understand the new capabilities enabled by recursive SNARKs, and why they extend the efficiency axis.
2. Understand which practical problems of recursive proofs are addressed by folding schemes such as Nova.
3. Understand how GKR/sumcheck-based approaches relate to the IOP framework from Session 10 and which metrics they may improve, subject to the assumptions of each construction.

---

## 1. Recursive proofs (recursive SNARKs)

### 1.1 The idea: verifying a proof inside a proof

Verifying a proof is itself a computation. Could we arithmetize the verification algorithm $V$ and prove that execution correct inside another proof? This motivates recursion: apply Session 4’s translation from programs to constraints to verification itself.

### 1.2 Why this is powerful

At each state transition, prove the new computation together with the accumulated proof. This handles the **finite history completed so far**. Even a proof whose size is independent of step count can depend on security parameters and public-state size. It establishes the completed prefix of an ongoing computation, not completion of an infinite computation.

Sessions 11–13 studied proofs of individual computations. Recursion composes them by treating verification as another computation.

### 1.3 Technical requirements: making verification amenable to recursion

A verifier that is fast on an ordinary machine may still be expensive inside an outer circuit. We must represent $V$’s group operations or pairings over the outer proof system’s field. Assess recursion-friendly verification including the cost of emulating arithmetic over a different field.

One useful tool is an **elliptic-curve cycle**. In a two-curve cycle, one curve's base field matches the other's scalar field, and vice versa. This helps represent group operations in circuits, including recursion without pairings. A cycle is not defined merely as a pair that makes pairing operations efficient, and not every recursive construction requires one. See the [Nova paper](https://eprint.iacr.org/2021/370).

<span id="figure-15-1"></span>
<span id="caption-15-1"></span>

<div class="captioned-table" id="table-15-3" role="group" aria-labelledby="table-caption-15-3">

<p class="table-caption" id="table-caption-15-3"><strong>Table 15-3：Recursion: include verification of the previous proof in the next computation</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. Previous result | State sᵢ and proof πᵢ of its history |
| 2. Next statement to prove | Verify πᵢ and correctly execute sᵢ → sᵢ₊₁ |
| 3. New result | Pass state sᵢ₊₁ and proof πᵢ₊₁ to the next step |

</div>

Schematic for a finite history up to each step. Bind the public state and step linkage correctly. Verifier-circuit efficiency also depends on group and field choices.

---

## 2. Folding schemes (Nova and related work)

### 2.1 Practical challenges of recursive proofs

Fully verifying the preceding proof at every step repeatedly proves a verifier circuit. That repetition creates overhead. Pairings can add cost in schemes using them, but the problem is broader. Can we carry correctness of accumulated computation forward through a smaller update?

Folding schemes such as Nova (Kothapalli, Setty, Tzialla) reduce this repeated overhead. Nova appeared on [ePrint in 2021](https://eprint.iacr.org/2021/370) and at CRYPTO 2022.

### 2.2 The idea: folding the relations to be verified

Nova **combines relaxed R1CS instances and updates their corresponding witness**. Instead of repeatedly verifying a large proof, it checks the folding relation. Combining this with the linkage between steps yields incrementally verifiable computation, or IVC. Identify what is updated instead of being fully verified again.

Folding alone does not produce a complete succinct zero-knowledge proof. Distinguish folding that aggregates relations, IVC that enforces the correct sequence of steps, and compression that proves the accumulated relation succinctly. Final proof size, verification cost, and zero knowledge depend on the combined construction.

FRI from Session 6 also uses folding, but reduces polynomial degree for proximity testing; Nova aggregates constraint-satisfaction instances. The incremental-processing analogy does not make them the same protocol or give them the same soundness proof.

<span id="figure-15-2"></span>
<span id="caption-15-2"></span>

<div class="captioned-table" id="table-15-4" role="group" aria-labelledby="table-caption-15-4">

<p class="table-caption" id="table-caption-15-4"><strong>Table 15-4：Separate the roles of folding, IVC and compression</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. Folding | Combine two relaxed-R1CS instances and update their witnesses |
| 2. IVC | Ensure the linkage of steps and the accumulated relation |
| 3. Compression | Turn the accumulated relation into a succinct proof for presentation |

</div>

Conceptual view motivated by Nova. Folding alone is not a succinct zero-knowledge proof. Its objects and security arguments differ from FRI degree reduction.

### 2.3 Where this approach helps

Do not measure folding’s benefit from a single fold alone. Include step computation, commitments, and final compression in the total work of proving accumulated computation. Compression frequency and implementation affect the improvement.

---

## 3. GKR/sumcheck-based directions

### 3.1 Revisiting the sumcheck protocol

Return to sumcheck, previewed in Session 1. For a sum with many terms, consider checking it without the verifier adding every term. The object is the following sum of a multivariate polynomial $g(X_1,\dots,X_n)$.

$$\sum_{x_1, \dots, x_n \in \{0,1\}} g(x_1, \dots, x_n)$$

interactively, fixing one variable at a time, without the verifier evaluating every summand. Each variable needs a degree bound, and the verifier checks degrees and sum consistency round by round. The final random-point evaluation of $g$ must also be verified, either directly or through another appropriate mechanism; without that check, the claimed sum is not established. Sumcheck is also central to IP = PSPACE from Session 1.

<span id="figure-15-3"></span>
<span id="caption-15-3"></span>

<div class="captioned-table" id="table-15-5" role="group" aria-labelledby="table-caption-15-5">

<p class="table-caption" id="table-caption-15-5"><strong>Table 15-5：Sumcheck: reduce a sum claim to checking one evaluation</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. Initial claim | T = ∑\_&#123;b₁,…,bₙ∈&#123;0,1&#125;&#125; g(b₁,…,bₙ) |
| 2. Check a univariate polynomial | p₁(0)+p₁(1)=T → reduce to p₁(r₁) at random r₁ |
| 3. Fix one variable per round | Repeat the check for the remaining sum |
| 4. Check the final evaluation | Compute g(r₁,…,rₙ) independently or check it with an appropriate mechanism |

</div>

Check degree bounds and sum consistency each round, choosing the challenge after the message. The final evaluation check is essential. GKR uses such reductions between layers.

### 3.2 The GKR protocol

GKR verifies claims about circuit outputs by reducing them to claims about preceding layers, using sumcheck for the reduction. Unlike directly checking R1CS or AIR constraints, it exploits layered circuit structure. Understand the 2008 Goldwasser–Kalai–Rothblum protocol through this connection between its goal and tool.

### 3.3 Read GKR/sumcheck as one direction for cost optimization

Where does the time go when proving a large circuit? GKR- and sumcheck-based systems can exploit layered structure and multilinear representations to distribute work between prover and verifier. A central benefit of the original GKR protocol is efficient verification relative to circuit depth; this does not mean that GKR generally minimizes prover cost. Prover improvements depend on the circuit, representation, commitments, and implementation. For machine-learning inference, ask which parallel structure is used and which work falls to the prover or verifier. See the [GKR paper overview](https://www.microsoft.com/en-us/research/publication/delegating-computation-interactive-proofs-muggles/), which distinguishes verifier efficiency from polynomial-time prover work.

This establishes no universal ranking over KZG-based systems. Sumcheck and KZG are not components at the same level: a sumcheck-based proof system may also use polynomial commitments. Compare complete systems with aligned circuit structures, commitments, memory budgets, and security parameters. See [Thaler's textbook](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html).

### 3.4 Position within the IOP framework

Original GKR is interactive. Building a non-interactive cryptographic argument requires choosing what to commit to and which challenges to derive with Fiat–Shamir. These are added construction choices, not mandatory parts of GKR’s definition. Check security conditions for the combined protocol.

Session 10's “IOP design → implementation → non-interactivity” map helps compare such constructions. Distinguish GKR itself from the non-interactive proof system built around it.

---

## 4. A research map: expanding the two-axis matrix

Session 14 showed why efficiency cannot be reduced to one number. Read this session’s techniques the same way. Do they improve proof size, verification cost, or prover cost? Add composability? Leave setup or long-term security conditions unchanged? The following table maps techniques to these questions.

<div class="captioned-table" id="table-15-1" role="group" aria-labelledby="table-caption-15-1">

<p class="table-caption" id="table-caption-15-1"><strong>Table 15-1：Primary improvements targeted by emerging techniques</strong></p>

| Technique | Main dimension improved |
| --- | --- |
| Recursive proofs | Proof composability: adding a new capability |
| Folding schemes | Prover cost, particularly for sequential computation |
| GKR/sumcheck | Verification or prover-cost optimization using circuit layers and parallel structure, depending on the construction |

</div>

Use the table as a set of questions for evaluating new schemes. Lower prover cost might come with greater communication or memory demands. Read improvements together with remaining conditions, including succinct verification and composability. The table does not say the entire field has moved to a single goal.

### 4.1 An application perspective: Ethereum zkEVMs {#ethereum-zkevm}

**A zkEVM proves correct EVM execution.** ZK rollups execute L2 transactions and verify their validity on Ethereum L1. **L1 zkEVM research**, in contrast, targets Ethereum's own block execution, aiming eventually to replace validators' re-execution burden with proof verification. These are distinct applications. Correct execution and cheaper verification are the goals here; the name zkEVM does not by itself imply transaction privacy. See Ethereum's [L1 zkEVM overview](https://ethereum.org/roadmap/zkevm/) and [ZK-rollup overview](https://ethereum.org/developers/docs/scaling/zk-rollups/).

### 4.2 Recent directions: interoperability and security alongside speed

**Information checked on September 29, 2026.** This is a snapshot of research and proposals based on primary sources. Roadmap objectives, EIP proposals, and mainnet activation are different stages. EIP status may change, so check the official page when using this material.

- **A common zkVM foundation:** Proving EVM execution programs inside general-purpose zkVMs requires compatible guest interfaces. The February 16, 2026 zkVM Standards v0 release defines RV64IM + Zicclsm and C interfaces for precompiles and IO. Guests still need recompilation and relinking; this is not universal binary portability. [EF standards announcement](https://zkevm.ethereum.foundation/blog/zkevm-standards-v0-release)
- **Evaluating security alongside speed:** Average proving time is insufficient; difficult blocks matter too. EF's May 2026 rollout article discusses worst-case proving, while a separate article examines the scope and assumptions of formal verification. Benchmarks and a “formally verified” label cannot establish security of the entire stack. [Rollout and worst-case challenges](https://zkevm.ethereum.foundation/blog/eip-8025-optional-execution-proofs-hegota), [formal-verification scope](https://zkevm.ethereum.foundation/blog/sp1-fv)
- **A staged path from optional proofs:** EF's September 7, 2026 priorities describe movement toward eventual mandatory execution proofs. Ordering relative to post-quantum milestones remains under discussion; this is not a confirmed activation date. [EF Protocol: Current and Emerging Priorities](https://blog.ethereum.org/2026/09/07/protocol-priorities)

### 4.3 EIP-8025: Optional Execution Proofs {#eip-8025}

[EIP-8025](https://eips.ethereum.org/EIPS/eip-8025) is **Draft** on the official page checked on September 29, 2026. It proposes opt-in execution-proof distribution and verification over the consensus-layer P2P network. **Current specifications retain payload re-execution: proofs are supplementary checks.** Mandatory proofs and removing re-execution belong to a later EIP. This proposal adds no proving rewards. See its [Consensus Layer section](https://eips.ethereum.org/EIPS/eip-8025#consensus-layer).

EF's May 14, 2026 article proposes inclusion in Hegotá; a proposal does not establish mainnet activation. [Hegotá proposal article](https://zkevm.ethereum.foundation/blog/eip-8025-optional-execution-proofs-hegota)

<span id="figure-15-4"></span>
<span id="caption-15-4"></span>

<div class="captioned-table" id="table-15-6" role="group" aria-labelledby="table-caption-15-6">

<p class="table-caption" id="table-caption-15-6"><strong>Table 15-6：Ethereum: distinguish L2 proofs from L1 execution proofs</strong></p>

| Item | Explanation |
| --- | --- |
| L2 ZK rollup | L2 computation → validity proof → verification on Ethereum L1 |
| L1 execution proof | Targets Ethereum block execution itself. EIP-8025 proposes distribution and verification of optional proofs. |

</div>

The “zk” name alone does not imply transaction privacy

Visual summary of the lecture’s September 29, 2026 snapshot. The Draft EIP-8025 proposal uses proofs as optional supplementary checks while re-execution continues. This is not a claim of mainnet activation.

### 4.4 Connecting the application to the course's research map

Return from the Ethereum example to the course’s questions. The following table connects application decisions to the tools studied. It does not claim that EIP-8025 selects a particular folding scheme or GKR construction.

<div class="captioned-table" id="table-15-2" role="group" aria-labelledby="table-caption-15-2">

<p class="table-caption" id="table-caption-15-2"><strong>Table 15-2：Mapping Ethereum ZK EVM applications to course topics and evaluation criteria</strong></p>

| Application question | Course connection | Evaluation dimensions |
| --- | --- | --- |
| Does the proof capture every required EVM execution rule? | Arithmetization (Session 4) and general computation | Expressiveness, compatibility, implementation correctness |
| Can proofs arrive within the required time? | GKR/sumcheck, parallelization, prover cost | Average and worst-case latency, memory and hardware cost |
| Can proofs of computation segments be combined efficiently? | Recursion and aggregation; folding where appropriate to the construction | Proof size, proving cost, bandwidth |
| Can validation become cheaper through a safe transition? | Soundness (Sessions 1 and 14) and staged protocol adoption | Verification cost, security, operational reliability |

</div>

Discussion prompts: “If a proof is small but slow to generate, how do L2 batching and L1 block validation differ?” and “What measurements and security evidence are needed before supplementary proofs become mandatory?” These questions connect theoretical efficiency to operational requirements.

---

## Summary: the course as a whole

Review the path from our initial questions. Starting with the goals let us connect each mathematical tool and protocol to the role it needed to serve.

- **Act I:** Starting from the limitations of classical proof paradigms, we defined interaction and zero knowledge as goals arising from both complexity theory and cryptography. We then understood why generalizing witnesses requires a qualitative shift: arithmetization.
- **Act II:** We developed the tools needed for those goals—polynomials, coding theory, elliptic curves, pairings, commitments, and PCPs/IOPs—with their cryptographic and complexity-theoretic significance, rather than as a disconnected list of mathematical topics.
- **Act III:** We read Groth16, PLONK, and STARK through the way they combine Act II's tools, compared their design choices using Act I's axes, and finally considered where ongoing research is extending those axes.

When reading a new proof system, first ask what it aims to achieve. Which computation does it translate into which representation, and what does it ask the verifier to check? Which assumptions and resources does it require? This order helps connect unfamiliar schemes to known tools. The skill to carry forward is **explaining design choices by moving between goals, tools, and tradeoffs**.

---

## References and further reading

- Bitansky, Canetti, Chiesa, Tromer, [“Recursive Composition and Bootstrapping for SNARKs and Proof-Carrying Data,”](https://eprint.iacr.org/2012/095) STOC 2013. Foundations of recursive proofs; public PDF available.
- Kothapalli, Setty, Tzialla, [“Nova: Recursive Zero-Knowledge Arguments from Folding Schemes,”](https://eprint.iacr.org/2021/370) CRYPTO 2022. Original paper; public PDF available.
- Goldwasser, Kalai, Rothblum, [“Delegating Computation: Interactive Proofs for Muggles,”](https://www.microsoft.com/en-us/research/publication/delegating-computation-interactive-proofs-muggles/) STOC 2008. Original GKR paper; [public PDF](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/12/2008-DelegatingComputation.pdf).
- Thaler, [*Proofs, Arguments, and Zero-Knowledge*](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html). A comprehensive textbook emphasizing sumcheck, with a [free PDF](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf). Recommended for reviewing and extending this course.
