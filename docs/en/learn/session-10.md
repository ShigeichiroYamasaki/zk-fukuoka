---
outline: [2, 3]
prev:
  text: Session 9 · The Fiat–Shamir transform and the merits and limits of ROM
  link: /en/learn/session-09
next:
  text: Session 11 · Groth16
  link: /en/learn/session-11
---

<script setup>
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
</script>

# Session 10: The PCP theorem and the IOP framework — A complexity-theoretic synthesis

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 27, 2026<br>
Last updated: October 7, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 10 in the syllabus](./#session-10) · [Session 10 exercises](../exercises/session-10)

## Position in the course and learning objectives

At the end of Act II, let us connect the tools: represent computation through arithmetization, inspect a few values, and authenticate them with commitments. Can we describe such designs independently of a particular scheme? PCPs and IOPs provide a map for reading the protocols in Act III.

There are three learning objectives:

1. Understand the formulation and historical significance of the PCP theorem without studying its proof.
2. Understand its independent importance in complexity theory through its connection to hardness of approximation.
3. Understand the IOP framework and organize the techniques learned so far within it.


::: tip Prerequisites and route through this session
Review NP, propositions and witnesses ([Session 1](./session-01)), randomized checking ([Session 1](./session-01)), and polynomial identity testing ([Session 3](./session-03)). Read the randomness and query bounds in PCP notation as resource counts for a probabilistic verifier; review the [probability tutorial](./probability-tutorial) if needed.

First use the PCP theorem to understand how a long proof can be checked with few queries, then see its connection to hardness of approximation, and distinguish the access models of PCP, IP and IOP. Finally use IOP as a map for reading the protocols in Act III.
:::
---

::: tip How to read the mathematics in this session
In the PCP notation, $n$ is the input length, $O(\log n)$ is the number of random bits, and $O(1)$ is the number of queries to the proof. Random string $r$ selects the queried positions; reading the proof is counted as oracle queries at those positions. Completeness concerns acceptance when the proposition is true, while soundness bounds acceptance when it is false. IOP extends this query-access model across multiple rounds. Recall probabilistic verification from Session 1 and polynomial identity testing from Session 3.
:::

## 1. The PCP theorem: Statement and significance

### 1.1 What is a PCP?

Can a long proof be checked without reading it all? Simply sampling a few arbitrary locations might miss deliberately placed errors. A PCP jointly designs the proof representation and checking procedure so that few queries can detect false propositions.

### 1.2 Statement of the PCP theorem

> **PCP theorem** (Arora–Safra 1992; Arora–Lund–Motwani–Sudan–Szegedy 1992): $\mathrm{NP} = \mathrm{PCP}[O(\log n), O(1)]$.

The two quantities specify the verifier’s random bits and proof-bit queries. Every NP language admits polynomial-length proofs checkable with logarithmically many random bits and constantly many queries, satisfying completeness and constant soundness error. Reducing that error further incurs additional checking costs.

**Notation varies across sources.** On this page, the first argument of $\mathrm{PCP}[r(n),q(n)]$ counts random bits, and the second counts queries to the proof. Some sources omit the $O(\cdot)$ notation, or count queried proof symbols rather than bits when the proof alphabet is not binary. Sources that expose completeness and soundness parameters may write, for example, $\mathrm{PCP}_{c,s}[r,q]$; check the subscript order in each source. The theorem above is the standard form with completeness when propositions are true and constant soundness error when they are false, while $O(\log n)$ and $O(1)$ are asymptotic bounds. When reading a paper, check which quantities its symbols denote.

### 1.3 What makes this surprising?

Session 1’s definition of NP did not require every witness bit to be read. The PCP theorem gives a more specific guarantee: every NP language admits a proof representation checkable with few queries. Reading less and revealing no secret are different properties, so zero-knowledge does not follow automatically.

*The proof of the PCP theorem is highly technical and is outside this course. We focus on the result and its significance.*

---

## 2. Connections to hardness of approximation

### 2.1 Why does the PCP theorem connect to approximation algorithms?

How can checking a few proof locations relate to optimization? Read the verifier’s acceptance conditions as constraints to satisfy. A construction separating true propositions that satisfy many conditions from false propositions that leave a fixed fraction unsatisfied gives a tool for proving approximation limits.

Intuitively, constructions used in the theorem can be turned into reductions showing that distinguishing optimization instances with different optimum values—for example, instances of MAX-3SAT—is NP-hard. This yields **hardness-of-approximation** results: unless P = NP, polynomial-time algorithms cannot guarantee approximation beyond certain ratios.

Represent a PCP verifier’s local tests as constraints

<StudyDiagram id="10-2" en />

<div class="captioned-table" id="table-10-2" role="group" aria-labelledby="table-caption-10-2">

<p class="table-caption" id="table-caption-10-2"><strong>Table 10-2：From PCPs to a gap optimization problem</strong></p>

| Item | Explanation |
| --- | --- |
| YES case | A true instance has a proof satisfying many tests. |
| NO case | For a false instance, every proof fails a nontrivial fraction of tests. |

</div>

Difficulty distinguishing the optimum-value gap → limits on approximation

Conceptual connection to hardness of approximation. Concrete gaps and approximation ratios depend on the reduction and theorem; impossibility conclusions are conditional on assumptions such as P≠NP.

### 2.2 What this connection tells us

The same theorem serves two different questions: efficient proof checking and limits of algorithms. Treating PCPs only as components for SNARKs and STARKs obscures that relationship. The constraint structure helps explain both what can be done efficiently and where hardness begins.

*We will not study specific thresholds, such as exact approximation bounds for MAX-3SAT. The goal is to understand the PCP theorem's deep connections to other areas of complexity theory.*

---

## 3. A unified view through Interactive Oracle Proofs

### 3.1 Definition of an IOP

Session 1 allowed interaction; PCPs allowed reading only part of a proof. What happens when we combine them? In an IOP, the prover fixes a long message each round and the verifier queries selected positions. Here, an oracle describes access to that fixed message.

A useful comparison is:

- PCP: Oracle access to a single proof.
- IP: Multiple rounds of interaction, with messages read in full.
- IOP: Multiple rounds of interaction, with oracle access to prover messages.

<StudyDiagram id="10-1" en />

<div class="captioned-table" id="table-10-1" role="group" aria-labelledby="table-caption-10-1">

<p class="table-caption" id="table-caption-10-1"><strong>Table 10-1：PCP, IP and IOP: separate access from interaction</strong></p>

| Framework | Prover supplies | Verifier access |
| --- | --- | --- |
| PCP | One proof string | Read selected positions |
| IP | Messages across rounds | Receive ordinary messages |
| IOP | Oracles across rounds | Query selected positions in each oracle |

</div>

Few queries and zero-knowledge are different properties. An oracle represents a theoretical access model to fixed data.

### 3.2 Revisiting earlier techniques in the language of IOPs

For each tool, identify what it represents, what it fixes, and what it checks. Techniques using polynomials can still serve different roles.

- **Arithmetization (Session 4):** Preprocessing that translates computation into polynomial relations suitable for an IOP.
- **FRI (Session 6):** A special form of IOP called an Interactive Oracle Proof of Proximity (IOPP), used to test proximity to low-degree polynomials.
- **Polynomial commitments (Session 8):** Cryptographic mechanisms, using Merkle trees or pairings, that implement access to committed data and turn abstract oracle-based frameworks into realizable protocols.
- **Fiat–Shamir (Session 9):** The final transformation that turns suitable multi-round protocols into non-interactive proofs.

One approach designs a polynomial IOP, implements the required access using commitments, and applies Fiat–Shamir. This does not allow arbitrary IOPs and commitments to be combined without checking access types and security conditions. Groth16 in Session 11 is instead constructed directly in the CRS model. Use the map while respecting its scope.

<StudyDiagram id="10-3" en />

<div class="captioned-table" id="table-10-3" role="group" aria-labelledby="table-caption-10-3">

<p class="table-caption" id="table-caption-10-3"><strong>Table 10-3：From abstract checks to a non-interactive cryptographic protocol</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. Arithmetization | Translate computations into constraints and polynomial relations |
| 2. Design IOP checks | Check degrees, relations and consistency |
| 3. Commit to the data | Authenticate openings of tables or polynomials |
| 4. Apply Fiat–Shamir | Derive challenges from the transcript |

</div>

A representative public-coin IOP / polynomial-IOP construction. Each stage needs security conditions. Groth16 does not follow this exact compilation path (Session 11).

### 3.3 Restating the SNARK/STARK comparison

Original PLONK checks polynomial relations through KZG; representative STARKs combine AIR with FRI-based constructions. Groth16 is a direct QAP-and-pairing construction, not one incorporating KZG openings. Separating arithmetization and commitment choices is useful, but recombining them requires revisiting degrees, evaluation domains, verification procedures, and security.

---

## Summary and next session

Today we connected the tools through checking with few queries. Use the following map when reading individual systems in Act III.

- The PCP theorem allows NP proofs to be encoded so that randomized verification reads only a tiny part of the proof.
- Its connection to hardness of approximation gives it independent importance beyond proof systems.
- IOPs combine PCPs and interactive proofs and organize arithmetization, FRI, commitments, and Fiat–Shamir through the stages of design, implementation, and non-interactive compilation.

This completes Act II. Session 11 begins Act III, integration, with Groth16. We will examine how pairings and QAPs achieve succinctness and why trusted setup is needed, comparing it with today's design map while treating it as a direct CRS-model construction without Fiat–Shamir.

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

---

## Session 10 exercise

Check the lecture concepts with calculations and concrete examples in the [Session 10 exercise](../exercises/session-10).
