---
outline: [2, 3]
---

# ZK Fukuoka Zero-Knowledge Proofs Syllabus

* 2026/09/07
* Shigeichiro Yamasaki

::: info Draft syllabus
A proposed three-act, 15-session curriculum. Dates, instructors, and venues are to be determined. This is an English translation of the Japanese proposal.
:::

[Session index](./sessions) · [Topic index](./topics)

---

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

- Limits of the NP verifier paradigm: question the implicit assumptions of revealing the entire witness and reading it only once.
- Complexity-theoretic motivation: present Arthur–Merlin games and the IP = PSPACE theorem as results.
- Cryptographic motivation: the problem setting of Goldwasser–Micali–Rackoff (1985), with password authentication and graph isomorphism as concrete examples.
- Emphasize how these two motivations converge on the same framework of interactive proof systems.
- Formalize completeness and soundness; distinguish proofs from arguments.

### Session 2: Zero-knowledge and the generalization of witnesses {#session-2}
- Define zero-knowledge formally through the simulator paradigm and introduce the hierarchy of indistinguishability notions.
- Introduce knowledge soundness and extractors.
- Examine the qualitative difference between simple witnesses (algebraic relations such as discrete logarithms) and general NP relations (arbitrary computations).
- Confirm how Schnorr-type protocols rely directly on the homomorphic structure of groups → general computations lack directly usable algebraic structure → motivate the need for arithmetization.
- Map expressiveness (generality of witnesses) against efficiency (interaction and succinctness), and discuss why succinctness becomes an essential requirement.

| | Interactive, non-succinct | Non-interactive, succinct |
| --- | --- | --- |
| **Algebraic relations (simple witnesses)** | Schnorr, Chaum–Pedersen | Σ-protocol + Fiat–Shamir (succinctness is not yet achieved) |
| **General NP relations (arbitrary computations)** | GMR-style general ZK (theoretical constructions) | Groth16 / PLONK / STARK |

---

## Act II: Tools (the language needed to realize the goals) — Sessions 3–10 {#act-2}

Each session makes explicit both the cryptographic perspective (connections to security definitions and hardness assumptions) and the complexity-theoretic perspective (connections to complexity classes and the power of proofs), alongside the mathematical tools.

### Session 3: Algebra of finite fields and polynomials; probabilistic checking {#session-3}
- Finite fields $\mathbb{F}_p$, extension fields, polynomial rings $\mathbb{F}_p[X]$, and Lagrange interpolation.
- **Complexity-theoretic perspective:** The Schwartz–Zippel lemma — why polynomial representations provide structure that can be checked efficiently with randomness. Connect polynomial identity testing to core techniques in PCPs and IOPs.

### Session 4: Arithmetization techniques and complexity theory {#session-4}
- R1CS (Rank-1 Constraint System), QAP (Quadratic Arithmetic Program), and AIR (Algebraic Intermediate Representation).
- **Complexity-theoretic perspective:** Reduction to Circuit-SAT via the Cook–Levin theorem and relationships with circuit complexity classes (NC, P). The theoretical basis for translating general computations into polynomial constraints.

### Session 5: Error-correcting codes and the information-theoretic perspective {#session-5}
- Reed–Solomon codes, minimum distance, and error-correction capability.
- **Information-theoretic perspective:** Contrast Shannon and Hamming bounds; introduce list decoding.
- Preview how code parameters affect later quantitative soundness analysis.

### Session 6: Low-degree testing and soundness amplification {#session-6}
- The recursive folding structure of FRI (Fast Reed–Solomon IOP of Proximity).
- **Cryptographic perspective:** General principles of soundness amplification and proof techniques such as rewinding and the forking lemma. How to bound soundness error quantitatively.

### Session 7: Elliptic curves and pairings {#session-7}
- Define elliptic curve groups, bilinear pairings $e: G_1 \times G_2 \to G_T$, and pairing-friendly curves (BN254, BLS12-381).
- **Cryptographic perspective:** The hierarchy of hardness assumptions such as discrete logarithm and q-SDH; the idea of reductions. What the distinction between standard and non-standard assumptions means.

### Session 8: Polynomial commitments and the theory of cryptographic commitments {#session-8}
- KZG (Kate) commitments and FRI-based commitments.
- **Cryptographic perspective:** Formal definitions of binding and hiding, and their relationship to security proofs for KZG and FRI-based constructions.

### Session 9: The Fiat–Shamir transform and the strengths and weaknesses of the ROM {#session-9}
- Transforming interactive protocols into non-interactive ones.
- **Cryptographic perspective:** Security proofs in the Random Oracle Model and their limitations, including critiques of the ROM heuristic and the existence of counterexamples.

### Session 10: The PCP theorem and the IOP framework — a complexity-theoretic synthesis {#session-10}
- State the PCP theorem and its significance (use the result without following its proof).
- Develop a unified understanding through IOPs (Interactive Oracle Proofs).
- **Complexity-theoretic perspective:** Connect to hardness-of-approximation research and explain why the PCP theorem is independently important in complexity theory.

---

## Act III: Integration — origins and future directions — Sessions 11–15 {#act-3}

### Session 11: Groth16 {#session-11}
- How combining pairings and QAPs achieves succinctness.
- Why trusted setup became necessary.

### Session 12: PLONK {#session-12}
- The motivation for universal setup.
- The origins of the permutation argument and the significance of custom gates.

### Session 13: STARK {#session-13}
- How the design goal of eliminating trusted setup motivates FRI and AIR.
- Trade-offs associated with transparency.

### Session 14: An integrated perspective — moving between Acts I–III {#session-14}
- Compare how Groth16, PLONK, and STARK each meet the completeness, soundness, and zero-knowledge definitions introduced in Act I.
- Map where the cryptographic assumptions and complexity-theoretic results from Act II enter each protocol.

### Session 15: Directions for further development {#session-15}
- Recursive proofs (recursive SNARKs) and folding schemes (such as Nova).
- New directions based on GKR and sumcheck.
- Organize current research along the two axes from Act I: expressiveness and efficiency.

---

## Supplementary materials

[An introductory finite-field exercise](./foundations) — a short supplement related to Session 3. The Session 1 manuscript is available; materials for Sessions 2–15 will be developed later.
