---
outline: [2, 3]
prev:
  text: Session 1 · What is a proof?
  link: /en/learn/session-01
next:
  text: Session 3 · Finite fields, polynomials, and probabilistic checking
  link: /en/learn/session-03
---

# Session 2: Zero-knowledge and the generalization of witnesses

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 27, 2026

[Session index](./sessions) · [Topic index](./topics) · [Session 2 in the syllabus](./#session-2)

## Context and learning objectives

Last time, we asked what changes when a verifier can ask questions. Today we question the other assumption: must we hand over the witness to have a claim checked? If we do not, how can we establish that no extra information is conveyed? Today’s three objectives are:

1. Formally define zero-knowledge through the simulator paradigm and understand the hierarchy of indistinguishability.
2. Introduce knowledge soundness and extractors as concepts that capture whether a prover really knows a witness.
3. Understand the **qualitative** significance of extending witnesses from simple algebraic objects, such as discrete logarithms, to general computations, and organize this development along the two axes that run through Act II: expressiveness and efficiency.

Today completes Act I, purpose and motivation. In the next session, we begin Act II: assembling the tools.

---

## 1. Introduction: making “prove without revealing a secret” precise

First, consider what “not revealing a secret” means. Last time, we stated a goal: establish knowledge without handing over the secret. Stating that goal does not yet let us decide whether a procedure achieves it.

One might initially think it is enough not to send the witness $w$ to the verifier. That is insufficient, however: the **process** of interaction can itself leak partial information about the witness. Examples include the timing of the prover's responses, statistical biases in those responses, and information accumulated across multiple proofs.

How can we formalize “nothing leaks”? GMR's answer was the **simulator paradigm**.

---

## 2. Defining zero-knowledge through the simulator paradigm

### 2.1 The central idea

What should we compare the information obtained by the verifier against? We use information that can be generated without the witness. The simulator paradigm expresses this idea as follows:

> Everything a verifier obtains from an interaction is something it could **simulate on its own, without knowing the witness**.

In other words, if an algorithm that generates a transcript—a simulator $S$—can output a distribution indistinguishable from a real interaction without access to the witness $w$, then the interaction is considered to give the verifier essentially no new information.

### 2.2 A formal definition

Consider an interactive proof system $(P,V)$ for language $L$ and relation $R$. For every efficient verifier $V^*$, we require an efficient simulator $S$ that reproduces its view without the witness. The following is shorthand for this condition; $S$ may depend on the verifier. The left-hand side denotes the verifier’s view, including its randomness and received messages. A full definition also specifies security parameters and auxiliary inputs.

$$\{\langle P(w), V^*\rangle(x)\}_{x \in L} \approx \{S(x)\}_{x \in L}.$$

Here, $\approx$ denotes indistinguishability. Depending on how strong a requirement it imposes, we obtain three levels:

- **Perfect zero-knowledge:** the two distributions are identical.
- **Statistical zero-knowledge:** their statistical distance is negligible.
- **Computational zero-knowledge:** computationally bounded distinguishers cannot distinguish the distributions.

The comparison here is between distributions of the real view and simulator output. Restricting a dishonest prover for soundness is a different axis from restricting distinguishers for zero-knowledge. Being an argument does not force computational zero-knowledge: original Groth16, studied in Session 11, establishes perfect zero-knowledge.

### 2.3 Checking the intuition

If a transcript can be generated without the witness, could a dishonest prover do the same? Distinguish an output record from a live interaction with a verifier. For example, a Schnorr-type honest-verifier simulator can first choose a challenge and response, then derive a commitment satisfying the verification equation. A real prover commits before receiving the verifier’s challenge. The order differs. This intuition alone does not establish zero-knowledge against arbitrary malicious verifiers.

---

## 3. Knowledge soundness and extractors

### 3.1 Why soundness alone is insufficient

Soundness requires that false claims are unlikely to be accepted. But is a claim being true the same as this prover knowing a witness? In authentication, it is not enough that someone with the secret exists. We want the party responding now to possess it. Knowledge soundness addresses this distinction.

### 3.2 The concept of an extractor

**Knowledge soundness** formalizes this requirement. Intuitively:

> If a prover $P^*$ can convince the verifier with high probability, an **extractor** $E$ with access to the inputs and outputs of $P^*$ can efficiently obtain an actual witness $w$ by observing—and, if necessary, rewinding—$P^*$.

Here, “knowing” does not describe the prover’s mental state. It is an operational condition: an extractor with the specified access can recover a witness. The definition must specify success probability, knowledge error, and extractor running time; one accepted execution is not unconditionally equivalent to knowledge.

*(Specific extraction techniques, especially rewinding and the forking lemma, will be discussed in Session 6 of Act II alongside soundness amplification.)*

---

## 4. Generalizing witnesses: from algebraic relations to general computation

This is the second half of today's lecture and the closing topic of Act I as a whole.

### 4.1 Simple witnesses: proofs built on structure

Use Schnorr identification to make the distinction concrete. Let $g$ generate a cyclic group of prime order $q$, and let the prover know the exponent $w\in\mathbb{Z}_q$ satisfying $y=g^w$. Even when the group is a subgroup of a finite field’s multiplicative group, distinguish group elements from exponents. The following exponent arithmetic is modulo $q$. The protocol proceeds as follows:

1. Prover: choose a random $r$ and send the commitment $t = g^r$.
2. Verifier: send a challenge $c$.
3. Prover: send the response $s = r + cw$.
4. Verifier: check that $g^s = t \cdot y^c$.

The verification equation $g^s=t\cdot y^c$ follows from the homomorphism $g^{r+cw}=g^r\cdot(g^w)^c$. Distinguish why that identity holds from knowing the secret. For extraction, take accepting responses $s_1,s_2$ to different challenges $c_1\ne c_2$ with **the same initial commitment**. Subtracting cancels the common randomness and gives:

$$w = \frac{s_1 - s_2}{c_1 - c_2}.$$

Read division as multiplication by an inverse in $\mathbb{Z}_q$. The challenge difference is nonzero, so the exponent $w$ can be recovered. Extraction from distinct accepting responses sharing the first message is called special soundness.

**The algebraic structure of the relation becomes the structure of the protocol itself.** As the mathematical object changes—discrete logarithms, quadratic residues, and so on—we can design a tailored protocol for each case.

### 4.2 General witnesses: when that structure is absent

Now extend the relation to a general program. Consider an NP relation, with bounded computation time and witness length, expressing knowledge of an input producing a specified output. A computation containing branches and comparisons need not come with a group relation to which Schnorr’s verification equation directly applies. We therefore need to translate the computation into a form we can check.

The qualitative shift is worth making explicit:

> A shift from “use the group homomorphism” to “**translate the computation itself into the language of polynomials**.”

This translation mechanism is **arithmetization**, a central topic of Act II that we will study in Session 4 through R1CS/QAP and AIR. For now, emphasize that this translation is a **means, not an end**. The goal remains to satisfy completeness, soundness, and zero-knowledge for arbitrary computations.

### 4.3 How efficiency requirements change

Generalizing computation also raises the question of how much work the verifier performs. In the discrete-log example, the exponent is small once security parameters are fixed. A program’s execution record grows with the computation. Checking the whole record may establish correctness, but does it achieve the goal of delegating computation to reduce verification work?

For that goal, we require **succinctness**: proof size and verification time should be small relative to the original computation or witness. Costs such as reading public inputs remain. General zero-knowledge proofs need not be succinct; distinguish succinctness as a design goal of the SNARKs and STARKs studied here. Session 10 introduces PCPs and IOPs as frameworks for pursuing it.

### 4.4 The increasing difficulty of knowledge extraction

Changing the witness representation also changes extraction. In Schnorr, two accepting transcripts with the same first commitment and different challenges yield the exponent. For a general computation, the target is an assignment satisfying circuit constraints. Required transcripts and access depend on the scheme; extraction may use several response stages or knowledge properties of commitments. Do not assume that two transcripts always suffice in the same way.

---

## 5. Organizing the landscape in a two-axis matrix

Separate the questions into **what can be expressed** and **how much interaction and computation is needed**. The following table is a map of the course’s tools. Non-interactivity and succinctness are distinct properties: Fiat–Shamir alone does not make a proof of general computation succinct.

| | Interactive, non-succinct | Non-interactive, succinct |
| --- | --- | --- |
| **Algebraic relations (simple witnesses)** | Schnorr, Chaum–Pedersen | Σ-protocol + Fiat–Shamir (succinctness is not yet obtained) |
| **General NP relations (arbitrary computation)** | GMR-style general ZK (theoretical constructions) | Groth16 / PLONK / STARK |

The message of this table is that **zk-SNARKs and zk-STARKs result from simultaneously advancing along two independent axes—expressiveness and efficiency—rather than simply making an existing protocol more efficient**. In Act II, we will assemble the tools supporting both axes in parallel.

---

## Recap and next session

Today we separated hiding information, knowing a witness, and expressing general computation. Check whether you can explain the following points in your own words.

- The formal definition of zero-knowledge through the simulator paradigm and the three levels of indistinguishability: perfect, statistical, and computational.
- Knowledge soundness and extractors as an operational definition of a prover really knowing a witness.
- The qualitative difference between simple algebraic witnesses and witnesses for general computation: moving from proofs based on existing structure to translation through arithmetization.
- The two-axis matrix of expressiveness and efficiency as a way to locate the protocols we will study.

This completes Act I, purpose and motivation. In Session 3, we begin Act II by developing the algebraic tools of finite fields and polynomial rings. Through the Schwartz–Zippel lemma, an important result in complexity theory, we will examine why polynomial representations provide a structure that supports efficient probabilistic verification.

---

## References and further reading

- Goldwasser, Micali, Rackoff, “[The Knowledge Complexity of Interactive Proof Systems](https://epubs.siam.org/doi/10.1137/0218012),” 1989. — SIAM, 1989 version
- Schnorr, “[Efficient Signature Generation by Smart Cards](https://link.springer.com/article/10.1007/BF00196725),” *Journal of Cryptology*, 1991. — Springer publication page / [Public manuscript PDF (German National Library)](https://d-nb.info/1156214580/34)
- Goldreich, *[Foundations of Cryptography, Volume 1](https://www.wisdom.weizmann.ac.il/~oded/foc-vol1.html)*, Chapter 4 (a textbook treatment of the definition of zero-knowledge). — author’s book information, contents, and errata
- Cook, “[The Complexity of Theorem-Proving Procedures](https://www.cs.utoronto.ca/~sacook/homepage/1971.pdf),” STOC 1971 (the Cook–Levin theorem, providing background for arithmetization in subsequent sessions). — author-hosted PDF

## Suggested classroom questions

- When introducing the claim that a simulator can fabricate an interaction without a witness, first ask students whether this seems contradictory. This highlights the nontrivial nature of the simulator paradigm.
- Write Schnorr's verification equation on the board and ask students to identify where the group structure is used. This makes the discussion in Section 4.1 more concrete.
- Before presenting the two-axis matrix, invite students to suggest why Schnorr's protocol cannot be directly extended to general computation, then compare their predictions with the explanation.
