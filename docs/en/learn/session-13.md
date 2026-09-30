---
outline: [2, 3]
prev:
  text: Session 12 · PLONK
  link: /en/learn/session-12
next:
  text: Session 14 · An integrated perspective
  link: /en/learn/session-14
---

<script setup>
</script>

# Session 13: STARK

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 27, 2026<br>
Last updated: September 27, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 13 in the syllabus](./#session-13) · [Session 13 exercises](../exercises/session-13)

## Context and learning objectives

Groth16 and KZG-based PLONK relied on properly handling setup secrets. Today we consider a construction that does not create such a secret. Our example is an AIR–FRI–Merkle-tree STARK. For the same goal as the previous sessions, ask what changing the tools gains and which costs it adds. Keep Groth16’s direct QAP-and-pairing construction distinct from KZG-based PLONK.

The three learning objectives are:

1. Understand a representative AIR/FRI-based STARK construction pursuing transparency.
2. Understand the overall STARK construction using the three-stage map from Session 10.
3. Evaluate tradeoffs between transparency and other properties: proof size, verification cost, and post-quantum security.

---

## 1. Transparency as a design goal

### 1.1 Concerns about trusted setup

Trusted setup retains public information while requiring secret erasure. MPC distributes trust, but honesty and erasure conditions remain. Can we construct a proof system without taking on that operational requirement? Transparency is the design goal answering this question.

### 1.2 Defining transparency

**Transparency** removes the need to generate, retain, or erase a secret setup trapdoor. Parameters follow public procedures, with public generation of any needed randomness. The point is removing dependence on a secret, not making every parameter random.

We study representative STARKs combining AIR, FRI, and Merkle trees. Merkle trees bind evaluation tables, while FRI tests proximity to low-degree polynomials. This avoids KZG-style secret trapdoors, but transparency alone does not uniquely require AIR or FRI. Nor does hash collision resistance alone explain security of the complete proof system; Section 4.2 addresses the additional requirements.

<span id="figure-13-1"></span>
<span id="caption-13-1"></span>

<div class="captioned-table" id="table-13-2" role="group" aria-labelledby="table-caption-13-2">

<p class="table-caption" id="table-caption-13-2"><strong>Table 13-2：Transparency and the guarantees of each component</strong></p>

| Item | Explanation |
| --- | --- |
| Merkle tree | Tie opened values to a previously fixed table. |
| FRI | Test proximity to evaluations of a low-degree polynomial. |

</div>

Combine these with constraint and consistency checks without a secret setup

Representative AIR/FRI-based STARK. Transparency alone does not uniquely require AIR or FRI.

---

## 2. Revisiting AIR arithmetization

### 2.1 Why AIR is chosen

AIR in Session 4 began with a table of states over time. Represent its columns as polynomials and extend their evaluation domain, and we obtain objects suited to Session 5’s Reed–Solomon codes and Session 6’s FRI. This connection motivates AIR; transparency alone does not make it the only choice.

### 2.2 Revisiting and extending transition and boundary constraints

Transition constraints check that steps progress correctly; boundary constraints bind specified inputs and outputs. Both require constraint polynomials to vanish at their applicable points. Rewrite this as divisibility by the vanishing polynomial of those points. As with QAP in Session 4, we translate conditions into a form convenient for checking.

The resulting quotients have specified degree bounds and are combined with random coefficients into a composition polynomial. Those coefficients must be selected after the trace is committed. Bounding the chance that invalid constraints accidentally cancel connects to Session 3's probabilistic polynomial checks. In addition to low degree, consistency of the composition with the original trace must be checked.

---

## 3. The overall STARK construction

### 3.1 Outline of the steps

Connect the tools into a proving procedure. Pay particular attention to which table is fixed before each challenge is derived. The following is a representative non-interactive AIR–FRI construction; distinguish scheme-specific details.

1. Execute the computation and generate its trace, with public initial/output conditions in the boundary constraints.
2. Interpolate each trace column, extend it to a larger evaluation domain, and commit to the evaluation tables with Merkle trees.
3. Derive constraint-combination coefficients through Fiat–Shamir from the transcript and commitments so far.
4. Construct the composition polynomial using quotients by the transition/boundary vanishing polynomials, then commit to its evaluation table.
5. In each FRI stage, commit to a table before deriving the folding challenge, progressively reducing the degree bound.
6. Derive query points and open the required trace, composition, and FRI evaluations with Merkle authentication paths.
7. Verify the authentication paths, the relation between trace and composition, and FRI's folding and terminal conditions.

**FRI alone does not establish correctness of the computation.** Low-degree proximity, constraint divisibility, consistency between tables, and binding to public inputs must be checked together. See the [STARK paper](https://eprint.iacr.org/2018/046).

For zero knowledge, random masking compatible with degree bounds and constraints must also prevent the opened trace evaluations and other messages from leaking witness information. Transparency and FRI do not automatically provide zero knowledge.

<span id="figure-13-2"></span>
<span id="caption-13-2"></span>

<div class="captioned-table" id="table-13-3" role="group" aria-labelledby="table-caption-13-3">

<p class="table-caption" id="table-caption-13-3"><strong>Table 13-3：STARK: commit before deriving challenges</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. Execute and encode | Trace → interpolation → low-degree extension → Merkle commitment |
| 2. Combine constraints | Derive coefficients from the transcript; construct and commit quotient/composition polynomials |
| 3. Construct FRI | Derive each folding challenge after committing its table |
| 4. Verify jointly | Check constraint relations, table consistency, FRI and Merkle paths |

</div>

Non-interactive construction outline. Choose queries only after the required commitments are fixed. Zero-knowledge additionally requires masking or other suitable measures.

### 3.2 Verification cost and proof size

Does fewer FRI stages mean proportionally smaller proofs? Besides values opened at each stage, the prover sends Merkle paths authenticating their membership in committed tables. Folding depth alone therefore does not determine proof size or verification cost.

With fixed security and coding parameters, representative constructions target polylogarithmic proof size and verification cost in trace length. Concrete costs depend on query counts, hash lengths, folding choices, aggregation, and compression. Public-input reading and processing must also be accounted for. Size comparisons in kilobytes need specified circuits, inputs, implementations, and security parameters.

### 3.3 A simple model for constructing an estimate

There is no single answer to “How many kilobytes is a STARK proof?” without specifying the implementation and security conditions. The following deliberately simplified teaching model helps identify which terms affect communication and verifier work. Let $n$ be trace length, $b$ the evaluation-domain blowup, $q$ the number of queries, $H$ the Merkle digest width in bytes, $B$ and $E$ the base- and extension-field element widths, $w$ the trace width, and $c$ the number of composition columns. Set $N=nb$ and let $T$ be the terminal-table size. Binary folding takes $r=\log_2(N/T)$ rounds.

The estimated payload adds queried field elements, independently counted Merkle authentication paths, the terminal table, and roots:

$$S \approx q(2wB+cE+2rE)+qH\left(3\log_2N+\sum_{j=1}^{r}(\log_2N-j)\right)+TE+(3+r)H.$$

The second term is the number of Merkle sibling digests across the tables, multiplied by digest width. This model does not compress shared path segments and omits protocol-specific openings, metadata, zero-knowledge masking, and path-compression optimizations. It is therefore not a predictor for a particular implementation, nor does it derive a security-sound query count. For FRI communication analysis and the distinction from protocol-specific optimizations, see [concrete security analysis of non-interactive FRI](https://eprint.iacr.org/2024/1161).

For an example, set $b=8,w=8,c=1,B=8,E=16,H=32,T=256,q=30$. KiB means 1024 bytes. Merkle digest counts and folding checks below are **operation counts, not verifier time**; elapsed time depends on the CPU, hash implementation, parallelization, and other factors.

<div class="captioned-table" id="table-13-4" role="group" aria-labelledby="table-caption-13-4">

<p class="table-caption" id="table-caption-13-4"><strong>Table 13-4: Example from a simplified STARK payload and verifier-work model</strong></p>

| Trace length $n$ | FRI rounds $r$ | Proof payload (KiB) | Authentication digests | Fold checks |
| ---: | ---: | ---: | ---: | ---: |
| $2^{10}$ | 5 | 96.6 | 2,670 | 150 |
| $2^{14}$ | 9 | 166.1 | 4,770 | 270 |
| $2^{16}$ | 11 | 206.5 | 6,000 | 330 |
| $2^{18}$ | 13 | 250.6 | 7,350 | 390 |
| $2^{24}$ | 19 | 405.5 | 12,120 | 570 |

</div>

The [model CSV](/data/stark-cost/model.csv) contains additional query counts. The assumptions, formula, and code are in the [model notes](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/docs/public/data/stark-cost/README.md) and [accounting script](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/scripts/stark-cost-model.py).

<figure id="figure-13-4" aria-labelledby="caption-13-4">
<figcaption id="caption-13-4"><strong>Figure 13-4: Trace length, query count, and proof payload in a simplified model</strong></figcaption>
<img src="/figures/stark-size-model.svg" alt="Simplified model of proof payload versus trace length, with separate lines for query counts; these are not measurements.">
</figure>

<figure id="figure-13-5" aria-labelledby="caption-13-5">
<figcaption id="caption-13-5"><strong>Figure 13-5: Merkle authentication digests and FRI fold checks for 30 queries</strong></figcaption>
<img src="/figures/stark-verifier-model.svg" alt="For 30 queries, the model's Merkle authentication digest counts and FRI fold checks versus trace length; these are work counts, not time.">
</figure>

### 3.4 Example of a published implementation benchmark

Separately from the model, consider a benchmark published in Winterfell's README. It reports historical Lamport+ signature-verification results for a 22-column trace, source-labeled 123-bit security, on an Intel Core i9-9980KH at 2.4 GHz with 32 GB RAM and eight cores. ZK Fukuoka did not rerun these measurements. The README does not fully document the measurement date, all parameters, or timing boundaries, so treat these as historical reference values for a specific workload, not a current ranking or an estimate for arbitrary circuits.

<div class="captioned-table" id="table-13-5" role="group" aria-labelledby="table-caption-13-5">

<p class="table-caption" id="table-caption-13-5"><strong>Table 13-5: Historical Lamport+ verification benchmark published by Winterfell</strong></p>

| Signatures | Proof size (KB, as reported) | Verification time (ms) |
| ---: | ---: | ---: |
| 64 | 110 | 4.4 |
| 128 | 121 | 4.4 |
| 256 | 132 | 4.5 |
| 512 | 139 | 4.9 |
| 1,024 | 152 | 5.9 |

</div>

<figure id="figure-13-6" aria-labelledby="caption-13-6">
<figcaption id="caption-13-6"><strong>Figure 13-6: Historical Winterfell Lamport+ verification example</strong></figcaption>
<img src="/figures/stark-winterfell-published.svg" alt="Published historical Winterfell Lamport+ example: signature count, proof size, and verification time.">
</figure>

Source: [Winterfell README Performance section at a pinned GitHub commit](https://github.com/facebook/winterfell/blob/2f78ee9bf667a561bdfcdfa68668d0f9b18b8315/README.md#performance). The [CSV](/data/stark-cost/winterfell-lamport.csv) preserves the data. KB is retained as reported and not converted to KiB. This benchmark does not empirically validate the model assumptions; it illustrates how proof size and verifier time can be reported together for a specified computation, implementation, and environment.

---

## 4. Tradeoffs with transparency

### 4.1 Proof size and verification cost

Align the fixed parameters before comparing systems. With groups and security parameters fixed, Groth16 and original KZG-based PLONK use constantly many proof elements even as the circuit grows. Public-input processing remains. Do not equate a constant-size proof with constant-time verification for every input size.

The FRI-based STARKs studied here avoid trusted setup while incurring communication and verification costs for evaluations and authentication paths. **Compare setup, proof size, and verification cost for specified constructions and conditions.** This is not an impossibility theorem saying that transparent proofs must be larger, and Groth16 should not be classified as a KZG-based construction.

<span id="figure-13-3"></span>
<span id="caption-13-3"></span>

<div class="captioned-table" id="table-13-1" role="group" aria-labelledby="table-caption-13-1">

<p class="table-caption" id="table-caption-13-1"><strong>Table 13-1：Compare proof sizes using consistent accounting</strong></p>

| Construction | Main proof components | Design conditions |
| --- | --- | --- |
| Groth16 | Three group elements | Circuit-specific setup |
| KZG-based PLONK | Constant number of group elements, evaluations, etc. | Universal SRS and Fiat–Shamir |
| FRI-based STARK | Evaluations, FRI and Merkle authentication paths | Transparent setup; count total communication |

</div>

Schematic comparison, not measurements or a speed ranking. Fix security parameters and account separately for public-input processing.

### 4.2 Post-quantum security

Long-term security also requires revisiting the adversary’s computational model. Against large-scale quantum computers running Shor’s algorithm, elliptic-curve discrete logarithms cannot be assumed hard. This affects Groth16 and KZG-based PLONK. Hash-based STARKs matter because they can avoid that algebraic assumption.

However, collision resistance for Merkle binding is distinct from security of the complete non-interactive proof system. The latter also needs soundness-error analysis for FRI and other components, together with Fiat–Shamir security. Quantum adversaries require analysis in an appropriate quantum random-oracle model, suitable hash lengths and parameters, and verification of the applicable theorem's conditions. **Using hashes does not automatically establish post-quantum security.**

The research on [Fiat–Shamir in the quantum random-oracle model](https://arxiv.org/abs/1902.07556) illustrates this distinction. Its theorem must not be applied to arbitrary multi-round STARKs without checking its conditions.

### 4.3 Prover computation cost

For fixed trace width, constraint degree, and security parameters, STARK designs often achieve quasi-linear prover complexity in trace length $n$, roughly $O(n \log n)$, through AIR arithmetization and FFT-like polynomial operations (NTTs). The multiplicative-group structure discussed in [Session 3](./session-03) becomes practically important here. Constraint evaluation, hashing, memory use, and hardware also affect wall-clock time. This does not establish universal superiority over R1CS/QAP or other systems; compare the same computation and security conditions.

---

## 5. Revisiting the map from Session 10

- **IOP design:** Express AIR constraints through quotient polynomials; combine randomized aggregation and FRI proximity testing with checks of consistency with the trace.
- **Implementation:** Merkle trees commit to oracle evaluation tables and authenticate queried values. FRI supplies low-degree proximity testing, a different role from Merkle binding.
- **Non-interactivity:** Apply Fiat–Shamir to the commitments and transcript, with an explicit security model (Session 9).

PLONK and STARKs can be compared through implementing an IOP and removing interaction. Identical stage names do not imply identical operations: KZG evaluation openings divide the work differently from Merkle authentication plus FRI proximity testing. Include arithmetization and parameters when tracing how choices affect transparency, proof size, and security.

---

## Summary and next session

Today we read a representative STARK from the goal of avoiding setup secrets. Review each tool’s role and the remaining security conditions.

- AIR, FRI, and Merkle trees provide a representative transparent construction.
- AIR is well suited to FRI, using transition and boundary constraints.
- Commitments precede their dependent challenges; constraints, low-degree proximity, and consistency between tables must be verified together.
- Designs involve tradeoffs across transparency, proof size, verification cost, post-quantum security, and prover computation.

Next time (Session 14), we integrate Act III. We compare how Groth16, PLONK, and STARK satisfy the completeness, soundness, and zero-knowledge properties introduced in Act I, and identify where the cryptographic assumptions and complexity-theoretic results from Act II enter each construction.

---

## References and further reading

- Ben-Sasson, Bentov, Horesh, Riabzev, [“Scalable, transparent, and post-quantum secure computational integrity,”](https://eprint.iacr.org/2018/046) IACR ePrint 2018/046 (foundations of STARKs; public PDF available).
- StarkWare, [official directory for the “STARK Math” blog series](https://starkware.co/stark/) (follow the entries under “STARK Blog Posts”) / [“STARK Math – A Very Short Primer”](https://starkware.co/stark-math-a-very-short-primer/) (a short introductory overview).
- Shor, [“Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer,”](https://arxiv.org/abs/quant-ph/9508027) SIAM Journal on Computing, 1997 (background for the post-quantum discussion; the link provides the public preprint and PDF).

## Suggested classroom questions

- Recall KZG’s structure from Session 8 and discuss what restrictions arise when building a protocol without any trusted setup, motivating the choice of FRI.
- Revisit the Session 8 comparison table and ask students to summarize what STARKs gain and give up.
- Ask why elliptic-curve assumptions are vulnerable to quantum computers while suitable hashes are currently believed to resist them. Briefly introduce the period-finding intuition behind Shor’s algorithm.

---

## Session 13 exercise

Check the lecture concepts with calculations and concrete examples in the [Session 13 exercise](../exercises/session-13).
