---
outline: [2, 3]
---

# ZK Fukuoka Zero-Knowledge Proofs Syllabus

* 2026/09/07
* Shigeichiro Yamasaki
* Last updated: 2026/09/29

::: info Draft syllabus
A proposed three-act, 15-session curriculum. Dates, instructors, and venues are to be determined. This is an English translation of the Japanese proposal.
:::

[Session index](./sessions) · [Topic index](./topics)

---

[Applied course: build an ERC-20 transfer ZK rollup](../rollup/) - six development stages and runnable starter models.

[Applied course: private-input ZKML inference](../zkml/) — [Runnable code and manual](../zkml/02-proof).


## Design principles

Rather than building upward from tools (mathematical foundations), this curriculum follows three acts that **establish goals and motivations first, then assemble the tools**.

- **Act I (Goals and motivations):** Define why the technology is needed and what we want to achieve.
- **Act II (Tools):** Develop the language of mathematics, information theory, and cryptography needed to address the challenges introduced in Act I.
- **Act III (Integration):** Read actual protocols (Groth16 / PLONK / STARK) as answers to the challenges of Act I, including their origins and directions for further development.

By linking Act I with Act III, the curriculum maintains a sense of purpose throughout the technical learning in Act II.

---

## Act I: Goals and motivations (why this technology is needed) — Sessions 1–2 {#act-1}

### Session 1: What is a proof? — Background and formalization of interactive proofs {#session-1}

[Read the Session 1 lecture manuscript →](./session-01)

- Limits of the NP verifier paradigm: distinguish access to a witness from interaction and privacy. The definition does not require reading every bit or making only one pass.
- Complexity-theoretic motivation: present Arthur–Merlin games and the IP = PSPACE theorem as results.
- Cryptographic motivation: the problem setting of Goldwasser–Micali–Rackoff (1985), with password authentication and graph isomorphism as concrete examples.
- Emphasize how these two motivations converge on the same framework of interactive proof systems.
- Formalize completeness and soundness; distinguish proofs from arguments.

### Session 2: Zero-knowledge and the generalization of witnesses {#session-2}

[Read the Session 2 lecture manuscript →](./session-02)

- Define zero-knowledge formally through the simulator paradigm and introduce the hierarchy of indistinguishability notions.
- Introduce knowledge soundness and extractors.
- Examine the qualitative difference between simple witnesses (algebraic relations such as discrete logarithms) and general NP relations (arbitrary computations).
- Confirm how Schnorr-type protocols rely directly on the homomorphic structure of groups → general computations need not come with the algebraic structure used by Schnorr → motivate the need for arithmetization.
- Map expressiveness (generality of witnesses) against efficiency (interaction and succinctness), and discuss why succinctness is a goal for delegated computation.

| Relation | Interactive examples | Non-interactive examples | Reading succinctness |
| --- | --- | --- | --- |
| Algebraic relations | Schnorr, Chaum–Pedersen | Fiat–Shamir applied to suitable Sigma protocols | These relations admit short proofs; Fiat–Shamir itself is not proof compression |
| General NP relations | Interactive ZK constructions for general NP | Groth16 / PLONK / STARK | Assess proof size and verification cost relative to computation size separately from non-interactivity |

---

## Act II: Tools (the language needed to realize the goals) — Sessions 3–10 {#act-2}

Each session makes explicit both the cryptographic perspective (connections to security definitions and hardness assumptions) and the complexity-theoretic perspective (connections to complexity classes and the power of proofs), alongside the mathematical tools.

### Session 3: Algebra of finite fields and polynomials; probabilistic checking {#session-3}

[Read the Session 3 lecture manuscript →](./session-03)

- Distinguish finite and extension fields from polynomial rings $K[X]$. Construct extension fields from irreducible polynomials and study division, remainders, roots, and Lagrange interpolation.
- Represent polynomials by coefficient vectors and evaluation tables; connect even/odd decomposition to FRI folding.
- **Probability and complexity:** Use concrete examples to compute Schwartz–Zippel error bounds as the sampling set changes. Relate one-sided error in PIT to soundness checks in PCPs and IOPs.

### Session 4: Arithmetization techniques and complexity theory {#session-4}

[Read the Session 4 lecture manuscript →](./session-04)

- Use Cook–Levin and circuit complexity (NC, P, and uniformity) as background for translating computations with public inputs, witnesses, and intermediate values into constraints.
- Derive R1CS as linear maps plus quadratic constraints over a finite field; study matrix dimensions, sparsity, Booleanity, and range constraints.
- Compare R1CS-to-QAP interpolation and divisibility by a vanishing polynomial with AIR execution traces, transition constraints, and boundary constraints.
- Trace a balance-of-deposits-and-withdrawals example through R1CS/QAP and AIR, including integer range constraints and wraparound modulo the field.

### Session 5: Error-correcting codes and the information-theoretic perspective {#session-5}

[Read the Session 5 lecture manuscript →](./session-05)

- Define Reed–Solomon codes as polynomial evaluation maps; derive rate, minimum distance, the Singleton bound, error correction, and erasure recovery.
- **Information-theoretic perspective:** Compute the capacity of a q-ary symmetric channel using entropy and compare it with the Hamming sphere-packing bound for worst-case errors.
- Work through a small-field Berlekamp–Welch decoding example, then distinguish unique-decoding and list-decoding guarantees.

### Session 6: Low-degree testing and soundness amplification {#session-6}

[Read the Session 6 lecture manuscript →](./session-06)

- Formalize low-degree testing as proximity to a Reed–Solomon code. Use examples to see why interpolation or a Merkle commitment alone does not establish low degree.
- Trace FRI’s even/odd decomposition, finite-field folds, consistency checks between layers, and final degree test. Distinguish query counts, proof communication, and authentication paths.
- **Cryptographic perspective:** Study conditions for soundness amplification, the union bound, rewinding, and the forking lemma; do not multiply error probabilities without checking independence.

### Session 7: Elliptic curves and pairings {#session-7}

[Read the Session 7 lecture manuscript →](./session-07)

- Study elliptic-curve groups and bilinear pairings $e:G_1\times G_2\to G_T$, then connect the pairing’s product-checking capability to Groth16.
- **Cryptographic perspective:** Distinguish the problem statements and models for discrete logarithm, q-SDH, and KEA; understand what a reduction proves and what remains an assumption.
- Distinguish curves, group elements, and scalars, using BN254 and BLS12-381 as implementation examples.

### Session 8: Polynomial commitments and the theory of cryptographic commitments {#session-8}

[Read the Session 8 lecture manuscript →](./session-08)

- Define binding and hiding separately and introduce opening a polynomial evaluation.
- Work through KZG’s SRS, quotient polynomial, and pairing verification with a small-field example; confirm that the basic construction does not automatically provide hiding or zero knowledge.
- Separate the roles of Merkle-tree binding to a table, FRI low-degree proximity, and evaluation opening in FRI-based commitments; compare their assumptions and communication.

### Session 9: The Fiat–Shamir transform and the strengths and weaknesses of the ROM {#session-9}

[Read the Session 9 lecture manuscript →](./session-09)

- Derive Fiat–Shamir challenges from a transcript hash; study hash inputs, challenge derivation, and message order.
- **Cryptographic perspective:** Examine ROM proofs, query-driven search, and the CGH counterexample; explain why interactive IP soundness does not automatically carry over to a non-interactive protocol.
- Distinguish public-coin and private-coin IPs, and why IP = PSPACE does not imply arbitrary short non-interactive proofs.

### Session 10: The PCP theorem and the IOP framework — a complexity-theoretic synthesis {#session-10}

[Read the Session 10 lecture manuscript →](./session-10)

- Read the PCP theorem with its random-bit, query, completeness, and soundness parameters; note that notation varies across sources.
- Compare the proof-access models of PCP, IP, and IOP; position FRI as an IOPP and polynomial commitments as an implementation of oracle access.
- **Complexity-theoretic perspective:** Survey the gap reductions from local PCP tests to hardness of approximation, and organize arithmetization, IOPs, commitments, and Fiat–Shamir by role and scope.

---

## Act III: Integration — origins and future directions — Sessions 11–15 {#act-3}

### Session 11: Groth16 {#session-11}

[Read the Session 11 lecture manuscript →](./session-11)

- Follow the QAP divisibility relation through Groth16 proof generation and verification; understand how pairings check multiplicative relations.
- Distinguish circuit-specific trusted setup, proof-time randomness, and public-input processing. The proof has three group elements, while public-input processing still has cost.
- Separate completeness and perfect zero knowledge from knowledge soundness, analyzed in the original paper’s generic bilinear group model; do not attribute it only to q-SDH.

### Session 12: PLONK {#session-12}

[Read the Session 12 lecture manuscript →](./session-12)

- Contrast Groth16’s circuit-specific keys with a universal, updatable SRS and circuit-specific preprocessing.
- Introduce PLONKish selector polynomials and gate constraints, then study copy constraints, the permutation/grand-product check, and its random challenges.
- Evaluate custom gates across expressiveness, constraint degree, columns, and openings. Distinguish the original KZG-based PLONK from variants.

### Session 13: STARK {#session-13}

[Read the Session 13 lecture manuscript →](./session-13)

- Read an AIR/FRI/Merkle/Fiat–Shamir construction as a sequence: transition and boundary constraints, composition polynomial, low-degree proximity, authenticated openings, and non-interactivity.
- **Security and cost:** Separate proximity, table consistency, binding to public inputs, and any masking; study a model for estimating proof size and verifier work.
- Distinguish transparency, setup assumptions, and quantum-security assumptions. Hash-based construction alone does not automatically provide zero knowledge or post-quantum security.

### Session 14: An integrated perspective — moving between Acts I–III {#session-14}

[Read the Session 14 lecture manuscript →](./session-14)

- Treat completeness, soundness, knowledge soundness, and zero knowledge as separate guarantees; compare the construction and assumptions needed by each system.
- Compare arithmetization, commitments, non-interactivity, setup, and public-input costs; identify the conditions behind proof-size and verification-cost claims.
- Connect hardness assumptions to their security models, and explain design choices without reducing them to a single security ranking.

### Session 15: Directions for further development {#session-15}

[Read the Session 15 lecture manuscript →](./session-15)
- Study recursive proof composition and curve cycles; distinguish Nova’s relaxed-R1CS folding, IVC, and compression.
- Study sumcheck and GKR’s layer-by-layer reductions; assess verifier and prover cost benefits under construction-specific conditions.
- **Applications and research directions:** Distinguish Ethereum L2 ZK rollups from L1 execution proofs and locate EIP-8025’s optional execution proofs. Date any cited status snapshot.
- Organize research across expressiveness, proof size, verification cost, prover cost, setup, and security.

---

## Supplementary materials

[Prerequisites and supplementary resources](./foundations) — preparation targets, a self-check, finite-field exercises and a reading guide for beginners. All 15 lecture manuscripts are available.
