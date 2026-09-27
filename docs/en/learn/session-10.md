---
outline: [2, 3]
prev:
  text: Session 9 · The Fiat–Shamir transform and the merits and limits of ROM
  link: /en/learn/session-09
next:
  text: Session 11 · Groth16 (syllabus)
  link: /en/learn/#session-11
---

# Session 10: The PCP theorem and the IOP framework — A complexity-theoretic synthesis

::: info Lecture manuscript
This page is an English translation of the supplied Session 10 lecture manuscript.
:::

[Sessions](./sessions) · [Topics](./topics) · [Session 10 in the syllabus](./#session-10) · [Exercises](../exercises/)

## Position in the course and learning objectives

Today concludes Act II, our toolkit-building stage. We bring together the complexity-theoretic background introduced so far—IP = PSPACE in Session 1 and Cook–Levin in Session 4—through the PCP theorem, then introduce Interactive Oracle Proofs (IOPs) as a unifying framework. This framework maps how techniques such as arithmetization, FRI, and commitments combine in concrete protocols.

There are three learning objectives:

1. Understand the statement and historical significance of the PCP theorem without studying its proof.
2. Understand its independent importance in complexity theory through its connection to hardness of approximation.
3. Understand the IOP framework and organize the techniques learned so far within it.

---

## 1. The PCP theorem: Statement and significance

### 1.1 What is a PCP?

A Probabilistically Checkable Proof is a specially encoded proof whose correctness can be checked with high probability by **randomly reading only a tiny part** of it.

### 1.2 Statement of the PCP theorem

> **PCP theorem** (Arora–Safra 1992; Arora–Lund–Motwani–Sudan–Szegedy 1992): $\mathrm{NP} = \mathrm{PCP}[O(\log n), O(1)]$.

For every NP language, there is a polynomial-size proof format allowing a verifier to decide correctly with high probability by reading only a **constant number** of proof locations and using only logarithmically many random bits.

### 1.3 What makes this surprising?

When introducing the NP verifier paradigm in Session 1, we considered the premise that the verifier reads the **entire** witness $w$. The PCP theorem shows that a suitable encoding allows verification with high probability **without reading most of the proof**. This supports the idea that a proof need not be read in full, from a different perspective than the disclosure question raised in Session 1. It is a landmark result in complexity theory.

*The proof of the PCP theorem is highly technical and is outside this course. We focus on the result and its significance.*

---

## 2. Connections to hardness of approximation

### 2.1 Why does the PCP theorem connect to approximation algorithms?

The PCP theorem, developed in the theory of proof systems, also became a tool for revealing **limits of approximation algorithms**.

Intuitively, constructions used in the theorem can be turned into reductions showing that distinguishing optimization instances with different optimum values—for example, instances of MAX-3SAT—is NP-hard. This yields **hardness-of-approximation** results: unless P = NP, polynomial-time algorithms cannot guarantee approximation beyond certain ratios.

### 2.2 What this connection tells us

The PCP theorem is not merely a tool for SNARKs and STARKs. It has **independent significance within complexity theory**. The same mathematical result illuminates both practical proof-system design and theoretical limits of approximation algorithms, illustrating the interdisciplinary character of this field.

*We will not study specific thresholds, such as exact approximation bounds for MAX-3SAT. The goal is to understand the PCP theorem's deep connections to other areas of complexity theory.*

---

## 3. A unified view through Interactive Oracle Proofs

### 3.1 Definition of an IOP

An IOP combines PCPs with interactive proofs (IPs). The prover and verifier interact over multiple rounds, but the verifier has **oracle access to each prover message, querying only selected locations rather than reading the entire message**.

A useful comparison is:

- PCP: Oracle access to a single proof.
- IP: Multiple rounds of interaction, with messages read in full.
- IOP: Multiple rounds of interaction, with oracle access to prover messages.

### 3.2 Revisiting earlier techniques in the language of IOPs

The IOP framework organizes the tools from Act II as follows:

- **Arithmetization (Session 4):** Preprocessing that translates computation into polynomial relations suitable for an IOP.
- **FRI (Session 6):** A special form of IOP called an Interactive Oracle Proof of Proximity (IOPP), used to test proximity to low-degree polynomials.
- **Polynomial commitments (Session 8):** Cryptographic mechanisms, using Merkle trees or pairings, that implement access to committed data and turn abstract oracle-based frameworks into realizable protocols.
- **Fiat–Shamir (Session 9):** The final transformation that turns suitable multi-round protocols into non-interactive proofs.

This gives the three-stage design pattern: **design an IOP → implement it with polynomial commitments → apply Fiat–Shamir for non-interactivity**. This map helps organize our study of concrete protocols in Act III by asking where each construction introduces its particular ideas.

### 3.3 Restating the SNARK/STARK comparison

The KZG/FRI comparison from Session 8 can also be organized through this framework. The manuscript groups Groth16/PLONK on the pairing-based side, using relations obtained from QAP/PLONKish arithmetization, and STARKs on the FRI-based side, using relations obtained from AIR. **Arithmetization and commitment choices are, in principle, separate design decisions**, and different combinations lead to a broad range of protocols. This perspective helps with both Act III and future research directions.

---

## Summary and next session

Today we learned:

- The PCP theorem allows NP proofs to be encoded so that randomized verification reads only a tiny part of the proof.
- Its connection to hardness of approximation gives it independent importance beyond proof systems.
- IOPs combine PCPs and interactive proofs and organize arithmetization, FRI, commitments, and Fiat–Shamir through the stages of design, implementation, and non-interactive compilation.

This completes Act II. Session 11 begins Act III, integration, with Groth16. We will examine how pairings and QAPs achieve succinctness and why trusted setup is needed, using today's design map as a guide.

---

## References and further reading

- Arora and Safra, [“Probabilistic Checking of Proofs: A New Characterization of NP,” JACM 1998](https://www.cs.umd.edu/~gasarch/TOPICS/pcp/AS.pdf) — public PDF hosted by the University of Maryland.
- Arora, Lund, Motwani, Sudan, and Szegedy, [“Proof Verification and the Hardness of Approximation Problems,” JACM 1998](https://people.csail.mit.edu/madhu/papers/1992/almss-journ.pdf) — author-hosted journal-version manuscript PDF.
- Ben-Sasson, Chiesa, and Spooner, [“Interactive Oracle Proofs,” TCC 2016](https://eprint.iacr.org/2016/116) — the IOP framework; public IACR ePrint version with PDF.
- Håstad, [“Some Optimal Inapproximability Results,” JACM 2001](https://people.kth.se/~johanh/optimalinap.pdf) — representative optimal hardness-of-approximation results; author-hosted PDF.

## Suggested discussion questions

- Before stating the PCP theorem, ask whether changing the way a proof is written could reduce how much a verifier must read.
- Have students tabulate PCP, IP, and IOP and explain the differences in the verifier's access in their own words.
- When discussing the independence of arithmetization and commitments in Section 3.3, ask whether other combinations, such as AIR with KZG, are possible, highlighting the breadth of the design space.
