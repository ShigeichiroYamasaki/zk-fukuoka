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

::: info Lecture manuscript
This is an English translation of the supplied Session 13 manuscript. Editorial notes clarify construction, complexity, and security assumptions. The multiplicative-group reference has been corrected to Session 3.
:::

[Sessions](./sessions) · [Topics](./topics) · [Session 13 in the syllabus](./#session-13) · [Exercises](../exercises/)

## Context and learning objectives

The manuscript describes the Groth16 and PLONK protocols studied so far as pairing- and KZG-based protocols requiring trusted setup. STARK (Scalable Transparent ARgument of Knowledge; Ben-Sasson et al., 2018), our subject today, starts from the goal of **eliminating trusted setup itself** and makes extensive use of the coding-theoretic tools developed in Sessions 5 and 6: Reed–Solomon codes and FRI.

The three learning objectives are:

1. Understand why eliminating trusted setup (transparency) motivates the choice of AIR and FRI.
2. Understand the overall STARK construction using the three-stage map from Session 10.
3. Evaluate tradeoffs between transparency and other properties: proof size, verification cost, and post-quantum security.

::: info Editorial note: which constructions are being compared?
Groth16 is a direct pairing-based construction, not a protocol that incorporates KZG commitments as a component. Here, PLONK refers to the original KZG-based construction. Transparency alone does not uniquely require AIR and FRI; this lecture covers representative AIR/FRI-based STARKs. See [Session 11](./session-11) and [Session 12](./session-12).
:::

---

## 1. Transparency as a design goal

### 1.1 Concerns about trusted setup

As discussed in Sessions 11 and 12, Groth16 and PLONK depend on trusted setup, including secret trapdoors used during SRS generation. If those secrets leak, soundness can fail. Multi-party generation, mentioned in Session 11, reduces this risk, but cannot provide complete, directly verifiable assurance that nobody knows the secret.

### 1.2 Defining transparency

**Transparency** means that setup requires no secret information. Parameters are derived only from public randomness, such as publicly verifiable values generated using known hash functions.

STARK makes transparency a design goal from the outset. It avoids pairing-based KZG commitments, which require the secret trapdoor $\tau$ from Session 8, and instead adopts **FRI-based commitments described as relying only on hash-function collision resistance**, also introduced in Session 8.

---

## 2. Revisiting AIR arithmetization

### 2.1 Why AIR is chosen

As we learned in Session 4, AIR (Algebraic Intermediate Representation) starts from a computation’s execution trace. Its use in STARKs is motivated less by transparency itself than by its **compatibility with FRI**. AIR encodes a table of execution steps as polynomials in evaluation form, naturally matching the Reed–Solomon codes and FRI studied in Sessions 5 and 6.

### 2.2 Revisiting and extending transition and boundary constraints

Beyond the transition and boundary constraints introduced in Session 4, STARK implementations often combine multiple constraints into one polynomial using a random linear combination. This applies the intuition behind the Schwartz–Zippel lemma from Session 3: probabilistically checking many conditions through one randomly weighted combination. The recurring idea of gathering many constraints into one polynomial condition appears again here.

---

## 3. The overall STARK construction

### 3.1 Outline of the steps

At a high level, STARK proof generation involves:

1. Execute the computation and generate its trace.
2. Interpolate each trace column over an evaluation set to obtain a polynomial, using Lagrange interpolation from Session 3.
3. Construct transition and boundary constraints from these trace polynomials, using AIR from Session 4.
4. Combine constraints with random coefficients to construct a single composition polynomial.
5. Use FRI from Session 6 to test whether the composition polynomial has low degree.
6. Authenticate evaluation values through Merkle-tree commitments from Session 8.
7. Apply Fiat–Shamir from Session 9, deriving the random coefficients and query points deterministically from hashes to make the protocol non-interactive.

::: info Editorial note: connecting constraints with low-degree testing
This list organizes components rather than specifying the message order. The trace is extended to a larger evaluation domain and committed before challenges are derived. Constraints vanishing on designated points are expressed through divisibility by vanishing polynomials; quotient-based composition and consistency with the trace must also be checked. FRI’s low-degree proximity test alone does not establish computation correctness. See the [STARK paper](https://eprint.iacr.org/2018/046).
:::

### 3.2 Verification cost and proof size

The manuscript describes STARK proof size as proportional to the number of FRI rounds, logarithmic in the original degree, and therefore larger than Groth16’s constant-size proof. It gives tens to hundreds of kilobytes as a practical rule of thumb. It also describes verification as logarithmic and relatively more expensive than Groth16’s constant-time verification. We return to the scope of these comparisons below.

---

## 4. Tradeoffs with transparency

### 4.1 Proof size and verification cost

Recall the comparison in Session 8. The manuscript groups Groth16 and PLONK as KZG-based systems providing constant-size proofs and constant-time verification at the cost of trusted setup. It contrasts them with FRI-based STARKs, which avoid trusted setup but have logarithmic proof size and verification cost. The intended lesson is that **transparency trades away part of the ideal of constant-size succinctness** in these representative designs.

::: info Editorial note: conditions for complexity comparisons
Sections 3.2 and 4.1 are schematic. STARK proofs include Merkle authentication paths; their size and verification cost depend on query counts, security parameters, and construction choices. Generally, think in terms of polylogarithmic costs rather than inferring simple logarithmic scaling from FRI rounds alone. The size range in the manuscript is illustrative, not a guarantee for all implementations. Groth16 and KZG-based PLONK also incur public-input processing costs, so total verification is not constant in the number of public inputs. This comparison of representative constructions is not an impossibility theorem about transparency.
:::

### 4.2 Post-quantum security

As anticipated in Session 8, **post-quantum security** is another important benefit of STARKs. The elliptic-curve discrete-logarithm assumptions underlying Groth16 and KZG-based PLONK are vulnerable to Shor’s efficient quantum algorithm. The manuscript contrasts this with STARKs’ reliance on hash-function collision resistance, noting that appropriately designed hashes are believed to remain robust against known quantum attacks.

::: info Editorial note: security requires more than collision resistance
Distinguish collision resistance for Merkle binding from security of the entire non-interactive proof system. The latter also requires soundness analysis for FRI and other components, and reasoning about Fiat–Shamir in the random-oracle model. Against quantum adversaries, the quantum random-oracle model and suitable hash lengths and parameters require consideration. Using a hash does not automatically establish post-quantum security. See the research on [Fiat–Shamir security in the quantum random-oracle model](https://arxiv.org/abs/1902.07556).
:::

### 4.3 Prover computation cost

STARK designs often achieve quasi-linear prover complexity, roughly $O(n \log n)$, through AIR arithmetization and FFT-like polynomial operations (NTTs). The multiplicative-group structure discussed in [Session 3](./session-03) becomes practically important here. Such designs can have advantages for large computations compared with R1CS/QAP-based constructions.

---

## 5. Revisiting the map from Session 10

- **IOP design:** AIR arithmetization from Session 4, with transition and boundary constraints aggregated using random linear combinations.
- **Implementation:** FRI-based commitments from Session 8—combining Merkle trees with FRI from Session 6—enable verification of polynomial relations while preserving transparency.
- **Non-interactivity:** Apply Fiat–Shamir from Session 9.

This shares the overall “IOP design → implementation → non-interactivity” structure of PLONK. The fundamental difference is the **implementation-stage choice: pairings and KZG versus hashes and FRI**. This distinction underlies the transparency, proof-size, and post-quantum-security tradeoffs discussed across these three sessions.

---

## Summary and next session

Today we learned:

- Transparency motivates FRI-based commitments instead of KZG in the construction studied here.
- AIR is well suited to FRI, using transition and boundary constraints.
- Seven broad steps organize the STARK construction and connect it to the tools from earlier sessions.
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
