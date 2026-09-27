---
outline: [2, 3]
prev:
  text: Session 12 · PLONK
  link: /en/learn/session-12
next:
  text: Session 14 · An integrated perspective
  link: /en/learn/session-14
---

# Session 13: STARK

[Sessions](./sessions) · [Topics](./topics) · [Session 13 in the syllabus](./#session-13) · [Exercises](../exercises/)

## Context and learning objectives

Groth16 and KZG-based PLONK both use pairings and trusted setup. Groth16 is a direct QAP-and-pairing construction; unlike PLONK, it does not incorporate KZG as a component. STARK (Scalable Transparent ARgument of Knowledge; Ben-Sasson et al., 2018), our subject today, starts from the goal of **eliminating trusted setup itself** and makes extensive use of the coding-theoretic tools developed in Sessions 5 and 6: Reed–Solomon codes and FRI.

The three learning objectives are:

1. Understand a representative AIR/FRI-based STARK construction pursuing transparency.
2. Understand the overall STARK construction using the three-stage map from Session 10.
3. Evaluate tradeoffs between transparency and other properties: proof size, verification cost, and post-quantum security.

---

## 1. Transparency as a design goal

### 1.1 Concerns about trusted setup

As discussed in Sessions 11 and 12, Groth16 and KZG-based PLONK depend on trusted setup, including secret trapdoors used during SRS generation. If those secrets leak, soundness can fail. Multi-party generation, mentioned in Session 11, reduces this risk, but cannot provide complete, directly verifiable assurance that nobody knows the secret.

### 1.2 Defining transparency

**Transparency** means that setup does not require generating, retaining, or destroying a secret trapdoor. Parameters follow public procedures, and any required setup randomness can be public. Not every parameter needs to be random.

We study representative STARKs combining AIR, FRI, and Merkle trees. Merkle trees bind evaluation tables, while FRI tests proximity to low-degree polynomials. This avoids KZG-style secret trapdoors, but transparency alone does not uniquely require AIR or FRI. Nor does hash collision resistance alone explain security of the complete proof system; Section 4.2 addresses the additional requirements.

---

## 2. Revisiting AIR arithmetization

### 2.1 Why AIR is chosen

As we learned in Session 4, AIR (Algebraic Intermediate Representation) starts from a computation’s execution trace. Its use in STARKs is motivated less by transparency itself than by its **compatibility with FRI**. AIR encodes a table of execution steps as polynomials in evaluation form, naturally matching the Reed–Solomon codes and FRI studied in Sessions 5 and 6.

### 2.2 Revisiting and extending transition and boundary constraints

Transition constraints relate designated computation steps; boundary constraints specify public conditions such as initial values and outputs. Requiring a constraint polynomial to vanish at its applicable points is expressed as divisibility by those points' vanishing polynomial.

The resulting quotients have specified degree bounds and are combined with random coefficients into a composition polynomial. Those coefficients must be selected after the trace is committed. Bounding the chance that invalid constraints accidentally cancel connects to Session 3's probabilistic polynomial checks. In addition to low degree, consistency of the composition with the original trace must be checked.

---

## 3. The overall STARK construction

### 3.1 Outline of the steps

A representative non-interactive AIR/FRI construction follows this flow. Details vary by system, but commitments must precede the challenges that depend on them:

1. Execute the computation and generate its trace, with public initial/output conditions in the boundary constraints.
2. Interpolate each trace column, extend it to a larger evaluation domain, and commit to the evaluation tables with Merkle trees.
3. Derive constraint-combination coefficients through Fiat–Shamir from the transcript and commitments so far.
4. Construct the composition polynomial using quotients by the transition/boundary vanishing polynomials, then commit to its evaluation table.
5. In each FRI stage, commit to a table before deriving the folding challenge, progressively reducing the degree bound.
6. Derive query points and open the required trace, composition, and FRI evaluations with Merkle authentication paths.
7. Verify the authentication paths, the relation between trace and composition, and FRI's folding and terminal conditions.

**FRI alone does not establish correctness of the computation.** Low-degree proximity, constraint divisibility, consistency between tables, and binding to public inputs must be checked together. See the [STARK paper](https://eprint.iacr.org/2018/046).

For zero knowledge, random masking compatible with degree bounds and constraints must also prevent the opened trace evaluations and other messages from leaking witness information. Transparency and FRI do not automatically provide zero knowledge.

### 3.2 Verification cost and proof size

A proof contains queried values and Merkle authentication paths as well as FRI round information. Neither proof size nor verification cost can therefore be inferred as simply proportional to the number of FRI rounds.

With fixed security and coding parameters, representative constructions target polylogarithmic proof size and verification cost in trace length. Concrete costs depend on query counts, hash lengths, folding choices, aggregation, and compression. Public-input reading and processing must also be accounted for. Size comparisons in kilobytes need specified circuits, inputs, implementations, and security parameters.

---

## 4. Tradeoffs with transparency

### 4.1 Proof size and verification cost

For fixed groups and security parameters, Groth16 and original KZG-based PLONK have proofs containing constant numbers of group elements and related values, independent of circuit size. Public-input processing remains necessary: total verification is not constant in the number of public inputs.

The FRI-based STARKs studied here avoid trusted setup while incurring communication and verification costs for evaluations and authentication paths. **Compare setup, proof size, and verification cost for specified constructions and conditions.** This is not an impossibility theorem saying that transparent proofs must be larger, and Groth16 should not be classified as a KZG-based construction.

### 4.2 Post-quantum security

Shor's algorithm efficiently solves elliptic-curve discrete logarithms on a sufficiently large fault-tolerant quantum computer. Groth16 and KZG-based PLONK require this problem to remain hard and are not secure against such an adversary. Hash-based STARKs avoid that algebraic prerequisite, making them promising constructions for post-quantum security.

However, collision resistance for Merkle binding is distinct from security of the complete non-interactive proof system. The latter also needs soundness-error analysis for FRI and other components, together with Fiat–Shamir security. Quantum adversaries require analysis in an appropriate quantum random-oracle model, suitable hash lengths and parameters, and verification of the applicable theorem's conditions. **Using hashes does not automatically establish post-quantum security.**

The research on [Fiat–Shamir in the quantum random-oracle model](https://arxiv.org/abs/1902.07556) illustrates this distinction. Its theorem must not be applied to arbitrary multi-round STARKs without checking its conditions.

### 4.3 Prover computation cost

For fixed trace width, constraint degree, and security parameters, STARK designs often achieve quasi-linear prover complexity in trace length $n$, roughly $O(n \log n)$, through AIR arithmetization and FFT-like polynomial operations (NTTs). The multiplicative-group structure discussed in [Session 3](./session-03) becomes practically important here. Constraint evaluation, hashing, memory use, and hardware also affect wall-clock time. This does not establish universal superiority over R1CS/QAP or other systems; compare the same computation and security conditions.

---

## 5. Revisiting the map from Session 10

- **IOP design:** Express AIR constraints through quotient polynomials; combine randomized aggregation and FRI proximity testing with checks of consistency with the trace.
- **Implementation:** Merkle trees commit to oracle evaluation tables and authenticate queried values. FRI supplies low-degree proximity testing, a different role from Merkle binding.
- **Non-interactivity:** Apply Fiat–Shamir to the commitments and transcript, with an explicit security model (Session 9).

This shares the overall “IOP design → implementation → non-interactivity” structure of PLONK. The fundamental difference is the **implementation-stage choice: pairings and KZG versus hashes and FRI**. This choice strongly affects transparency, proof size, and post-quantum security; arithmetization, parameters, and implementation also influence performance and security.

---

## Summary and next session

Today we learned:

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
