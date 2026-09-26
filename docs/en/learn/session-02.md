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

::: info Lecture manuscript
An English translation of the supplied Japanese manuscript for Session 2.
:::

[Session index](./sessions) · [Topic index](./topics) · [Session 2 in the syllabus](./#session-2)

## Context and learning objectives

The previous session addressed the background of interactive proofs: questioning Assumption B, non-interaction. Today we directly tackle the remaining question: **Assumption A, full disclosure**. Our three objectives are:

1. Formally define zero-knowledge through the simulator paradigm and understand the hierarchy of indistinguishability.
2. Introduce knowledge soundness and extractors as concepts that capture whether a prover really knows a witness.
3. Understand the **qualitative** significance of extending witnesses from simple algebraic objects, such as discrete logarithms, to general computations, and organize this development along the two axes that run through Act II: expressiveness and efficiency.

Today completes Act I, purpose and motivation. In the next session, we begin Act II: assembling the tools.

---

## 1. Introduction: making “prove without revealing a secret” precise

The previous session introduced GMR's problem: proving that you know a secret without revealing it. But what, exactly, does “not revealing a secret” mean?

One might initially think it is enough not to send the witness $w$ to the verifier. That is insufficient, however: the **process** of interaction can itself leak partial information about the witness. Examples include the timing of the prover's responses, statistical biases in those responses, and information accumulated across multiple proofs.

How can we formalize “nothing leaks”? GMR's answer was the **simulator paradigm**.

---

## 2. Defining zero-knowledge through the simulator paradigm

### 2.1 The central idea

The central idea of the definition can be expressed as follows:

> Everything a verifier obtains from an interaction is something it could **simulate on its own, without knowing the witness**.

In other words, if an algorithm that generates a transcript—a simulator $S$—can output a distribution indistinguishable from a real interaction without access to the witness $w$, then the interaction is considered to give the verifier essentially no new information.

### 2.2 A formal definition

An interactive proof system $(P, V)$ is **zero-knowledge** for a language $L$ (with relation $R$) if, for every potentially malicious verifier $V^*$, there exists a simulator $S$ such that

$$\{\langle P(w), V^*\rangle(x)\}_{x \in L} \approx \{S(x)\}_{x \in L}.$$

Here, $\approx$ denotes indistinguishability. Depending on how strong a requirement it imposes, we obtain three levels:

- **Perfect zero-knowledge:** the two distributions are identical.
- **Statistical zero-knowledge:** their statistical distance is negligible.
- **Computational zero-knowledge:** computationally bounded distinguishers cannot distinguish the distributions.

Many practical zk-SNARKs and zk-STARKs aim for computational zero-knowledge. Notice how this hierarchy complements the distinction between proofs and arguments introduced in the previous session. That distinction concerns restrictions on the prover's computational power; this one concerns restrictions on the verifier's or distinguisher's computational power.

### 2.3 Checking the intuition

At first, it may seem strange that a simulator can “fabricate” an interaction without a witness. A useful teaching example is a proof of equality of discrete logarithms, such as the Chaum–Pedersen protocol. Briefly sketch how a simulator fabricates an interaction by changing the order of construction—choosing the response first and then arranging the challenge. We will study the precise construction after developing the algebraic tools in Act II; sharing the intuition now makes that later discussion easier to follow.

---

## 3. Knowledge soundness and extractors

### 3.1 Why soundness alone is insufficient

The soundness defined in the previous session only guarantees that a statement is not accepted when $x \notin L$. Many cryptographic applications require more: a guarantee that the prover actually **knows** a witness $w$. In an authentication protocol, for example, we want to establish not merely that $x \in L$, but that the prover we are interacting with really possesses the secret.

### 3.2 The concept of an extractor

**Knowledge soundness** formalizes this requirement. Intuitively:

> If a prover $P^*$ can convince the verifier with high probability, an **extractor** $E$ with access to the inputs and outputs of $P^*$ can efficiently obtain an actual witness $w$ by observing—and, if necessary, rewinding—$P^*$.

This definition makes “the prover is accepted” and “the prover knows a witness” mathematically equivalent claims. The key point is that the existence of an extractor provides an operational definition of the prover's “knowledge.”

*(Specific extraction techniques, especially rewinding and the forking lemma, will be discussed in Session 6 of Act II alongside soundness amplification.)*

---

## 4. Generalizing witnesses: from algebraic relations to general computation

This is the second half of today's lecture and the closing topic of Act I as a whole.

### 4.1 Simple witnesses: proofs built on structure

Consider the Schnorr identification protocol. The prover knows a discrete logarithm $w$ (an element of the group $\mathbb{Z}_p^*$) and wants to convince the verifier that $y = g^w$. The protocol has the following outline:

1. Prover: choose a random $r$ and send the commitment $t = g^r$.
2. Verifier: send a challenge $c$.
3. Prover: send the response $s = r + cw$.
4. Verifier: check that $g^s = t \cdot y^c$.

The essential point is that the verification equation $g^s = t \cdot y^c$ follows **directly** from the **group homomorphism property** $g^{r + cw} = g^r \cdot (g^w)^c$. Knowledge extraction also relies on this structure. Given responses $s_1, s_2$ to two different challenges $c_1 \ne c_2$, we can recover $w$ directly using simple linear algebra:

$$w = \frac{s_1 - s_2}{c_1 - c_2}.$$

This is called special soundness.

**The algebraic structure of the relation becomes the structure of the protocol itself.** As the mathematical object changes—discrete logarithms, quadratic residues, and so on—we can design a tailored protocol for each case.

### 4.2 General witnesses: when that structure is absent

What if the relation is “I know an input $x$ such that executing this program produces $y$”? This is a general NP relation and can be reduced to Circuit-SAT through the Cook–Levin theorem. A computation consists of non-algebraic operations such as branches, loops, and comparisons. It does not inherently provide a structure like the group homomorphism used by Schnorr's protocol.

The qualitative shift is worth making explicit:

> A shift from “use the group homomorphism” to “**translate the computation itself into the language of polynomials**.”

This translation mechanism is **arithmetization**, a central topic of Act II that we will study in Session 4 through R1CS/QAP and AIR. For now, emphasize that this translation is a **means, not an end**. The goal remains to satisfy completeness, soundness, and zero-knowledge for arbitrary computations.

### 4.3 How efficiency requirements change

A simple witness such as a discrete logarithm has a fixed length, so proof size and verification cost proportional to the witness need not cause a major problem. The situation changes when computations may have arbitrary complexity. If verification cost scales directly with the computation itself, we lose the very reason for using SNARKs and STARKs: shifting work from the verifier to the prover.

Once we handle general computation, **succinctness**—proof size and verification time that are nearly independent of witness complexity—therefore becomes an **essential requirement**, rather than an optional property. The PCP theorem and IOP framework, previously introduced only through their results, now become necessary tools rather than merely topics of theoretical interest. We will study them technically in Session 10 of Act II.

### 4.4 The increasing difficulty of knowledge extraction

Another technical difficulty caused by the loss of structure is the growing complexity of extractors. For simple algebraic relations, two transcripts allowed us to recover $w$ directly through linear algebra. For general relations, however, $w$ is an assignment satisfying an entire circuit. Extraction requires more sophisticated techniques, such as traversing a tree of transcripts, as in generalized special soundness used in PLONK. This increase in technical difficulty itself illustrates the qualitative difference between the simple and general cases.

---

## 5. Organizing the landscape in a two-axis matrix

We can organize the discussion along two independent axes: **expressiveness, or the generality of witnesses**, and **efficiency, including removal of interaction and succinctness**.

| | Interactive, non-succinct | Non-interactive, succinct |
| --- | --- | --- |
| **Algebraic relations (simple witnesses)** | Schnorr, Chaum–Pedersen | Σ-protocol + Fiat–Shamir (succinctness is not yet obtained) |
| **General NP relations (arbitrary computation)** | GMR-style general ZK (theoretical constructions) | Groth16 / PLONK / STARK |

The message of this table is that **zk-SNARKs and zk-STARKs result from simultaneously advancing along two independent axes—expressiveness and efficiency—rather than simply making an existing protocol more efficient**. In Act II, we will assemble the tools supporting both axes in parallel.

---

## Recap and next session

Today we studied:

- The formal definition of zero-knowledge through the simulator paradigm and the three levels of indistinguishability: perfect, statistical, and computational.
- Knowledge soundness and extractors as an operational definition of a prover really knowing a witness.
- The qualitative difference between simple algebraic witnesses and witnesses for general computation: moving from proofs based on existing structure to translation through arithmetization.
- The two-axis matrix of expressiveness and efficiency as a way to locate the protocols we will study.

This completes Act I, purpose and motivation. In Session 3, we begin Act II by developing the algebraic tools of finite fields and polynomial rings. Through the Schwartz–Zippel lemma, an important result in complexity theory, we will examine why polynomial representations provide a structure that supports efficient probabilistic verification.

---

## References and further reading

- Goldwasser, Micali, Rackoff, “The Knowledge Complexity of Interactive Proof Systems,” 1989.
- Schnorr, “Efficient Signature Generation by Smart Cards,” *Journal of Cryptology*, 1991.
- Goldreich, *Foundations of Cryptography, Volume 1*, Chapter 4 (a textbook treatment of the definition of zero-knowledge).
- Cook, “The Complexity of Theorem-Proving Procedures,” STOC 1971 (the Cook–Levin theorem, providing background for arithmetization in subsequent sessions).

## Suggested classroom questions

- When introducing the claim that a simulator can fabricate an interaction without a witness, first ask students whether this seems contradictory. This highlights the nontrivial nature of the simulator paradigm.
- Write Schnorr's verification equation on the board and ask students to identify where the group structure is used. This makes the discussion in Section 4.1 more concrete.
- Before presenting the two-axis matrix, invite students to suggest why Schnorr's protocol cannot be directly extended to general computation, then compare their predictions with the explanation.
