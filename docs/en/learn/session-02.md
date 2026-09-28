---
outline: [2, 3]
prev:
  text: Session 1 · What is a proof?
  link: /en/learn/session-01
next:
  text: Session 3 · Finite fields, polynomials, and probabilistic checking
  link: /en/learn/session-03
---

<script setup>
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
import SchnorrOverview from "../../.vitepress/theme/SchnorrOverview.vue";
</script>

# Session 2: Zero-knowledge and the generalization of witnesses

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 28, 2026

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

Timing and power side channels are not automatically covered by the abstract zero-knowledge definition: its guarantee concerns the verifier view included in the model.

## 2. Defining zero-knowledge through the simulator paradigm

### 2.1 The central idea

What should we compare the information obtained by the verifier against? We use information that can be generated without the witness. The simulator paradigm expresses this idea as follows:

> Everything a verifier obtains from an interaction is something it could **simulate on its own, without knowing the witness**.

In other words, if an algorithm that generates a transcript—a simulator $S$—can output a distribution indistinguishable from a real interaction without access to the witness $w$, then the interaction is considered to give the verifier essentially no new information.

#### 2.1.1 Before the definition: relation $R$ and statement $x$

Before formalizing zero-knowledge, let us identify what is public and what we want to keep private. In Session 1, a verifier received a public input $x$ and a witness $w$. Relation $R$ specifies **which pairs of these values satisfy the required condition**.

| Symbol | Meaning |
| --- | --- |
| $x$ | The public input shared by prover and verifier |
| $w$ | A witness satisfying the condition for input $x$ |
| $R$ | The set of pairs $(x,w)$ satisfying that condition |
| $(x,w)\in R$ | The statement that $w$ is a valid witness for $x$ |
| $L$ | The set of inputs $x$ with at least one valid witness |

A relation here is a **binary relation**, specifying a condition on pairs of objects. Encoding inputs and witnesses as finite binary strings gives $R\subseteq\{0,1\}^*\times\{0,1\}^*$. Distinguish membership $(x,w)\in R$ from the procedure that checks it. We also sometimes write the result of this check as $R(x,w)=1$ for membership and $R(x,w)=0$ otherwise.

For the NP relations used in this course, membership in $R$ is decidable in deterministic polynomial time, and valid witnesses satisfy $|w|\le p(|x|)$ for some polynomial $p$. The associated language is

$$L=L_R:=\{x\mid \exists w,\ (x,w)\in R\}.$$

Thus **$R$ specifies whether a particular pair satisfies the condition, whereas $L$ collects the inputs for which a suitable partner $w$ exists**. Under these conditions, $L\in\mathrm{NP}$.

Return to the composite-number example from Session 1. Omitting the encoding of integers, define

$$R_{\mathrm{comp}}=\{(n,d)\mid n,d\text{ are integers},\ 1<d<n,\ d\mid n\}.$$

Here $d\mid n$ means that $d$ divides $n$ exactly. The pairs $(91,7)$ and $(91,13)$ belong to this relation, but $(91,8)$ does not. The corresponding language $L_{R_{\mathrm{comp}}}$ consists of encodings of composite numbers: 91 belongs, whereas the prime 97 does not. This small example illustrates the notation, not the difficulty of discovering a secret.

“Statement $x$” is shorthand for **the statement “$x\in L$” about public input $x$: there exists a witness $w$ such that $(x,w)\in R$**. Section 3 distinguishes the truth of this statement from the responding prover's knowledge of such a witness.

In the next definition, $R$ and $L$ are fixed as part of the scheme and commonly known. The real prover uses a valid witness $w$, whereas the simulator receives public input $x$ without $w$. Keep that distinction in mind when reading the formula. See also [Sets, membership and languages](./terms/sets-and-languages) and [NP relations in more detail](./terms/np-relations).

### 2.2 A formal definition

Consider an interactive proof system $(P,V)$ with the relation $R$ and language $L$ introduced above. For every efficient verifier $V^*$, we require an efficient simulator $S$ that reproduces the verifier's information without the witness. Let us define the random variables to make clear which distributions are compared.

**Separate what is fixed from what is sampled.** Fix a valid pair $(x,w)\in R$, the verifier algorithm $V^*$, and auxiliary input $z$ that the verifier possesses before the interaction. Use an empty string for $z$ when no auxiliary input is considered. We do not sample and average over $x$ or $w$ here.

In a real interaction, independently sample the prover's random tape $r_P$ and the verifier's random tape $r_V$ according to their procedures. Once inputs and random tapes are fixed, the interaction is determined. Resampling the tapes makes the **verifier's complete record** a random variable:

$$X_{x,w,z}:=\operatorname{View}_{V^*}\bigl[P(x,w;r_P)\leftrightarrow V^*(x,z;r_V)\bigr].$$

Arguments after the semicolon specify an algorithm's random tape. The verifier's view can be encoded as

$$X_{x,w,z}=(x,z,r_V,m_1,\ldots,m_k),$$

where $m_1,\ldots,m_k$ are the messages it receives. Its outgoing messages and final decision can be reconstructed from this record and its algorithm. **The comparison concerns the whole view, not just a one-bit accept/reject decision.** The prover's random tape $r_P$ and witness $w$ are not themselves supplied as components of the view.

The simulator uses its own random tape $r_S$ to output a record in the same format. Its output is another random variable:

$$Y_{x,z}:=S(x,z;r_S).$$

The simulator receives $x,z$ but not $w$. It may depend on $V^*$, but we cannot choose a different simulator for each witness. One simulator must satisfy the condition for all valid pairs $(x,w)$ and admissible auxiliary inputs $z$. Depending on the definition, simulation runs in polynomial or expected polynomial time.

**A distribution assigns a probability to each possible record.** For a particular record $t$, we compare

$$\Pr[X_{x,w,z}=t]\quad\text{and}\quad\Pr[Y_{x,z}=t].$$

The probability on the left comes from the real interaction's randomness $r_P,r_V$; the probability on the right comes from the simulator's randomness $r_S$. We do not require two executions to produce the same record. We compare **the probabilities with which records are produced**.

Below, abbreviate the variables as $X,Y$. We compare families of distributions as input length $n=|x|$ grows, with auxiliary-input length polynomially bounded in $n$. A nonnegative function $\mathrm{negl}(n)$ eventually becomes smaller than every inverse polynomial. Concrete cryptographic schemes may instead explicitly use a security parameter separate from input length.

- **Perfect zero-knowledge:** for every record $t$, $\Pr[X=t]=\Pr[Y=t]$. The two random variables have identical distributions.
- **Statistical zero-knowledge:** the statistical distance between the distributions is negligible. For discrete records, this distance is defined by

$$\Delta(X,Y):=\frac12\sum_t\left|\Pr[X=t]-\Pr[Y=t]\right|\le\mathrm{negl}(n).$$

  Equivalently, for every set of records $A$, the difference $|\Pr[X\in A]-\Pr[Y\in A]|$ is bounded by the same limit. Even a computationally unbounded distinguisher can gain negligible advantage from the difference.

- **Computational zero-knowledge:** for every probabilistic polynomial-time distinguisher $D$, the following difference is negligible:

$$\left|\Pr[D(x,z,X)=1]-\Pr[D(x,z,Y)=1]\right|\le\mathrm{negl}(n).$$

  The algorithm $D$ receives public and auxiliary inputs together with one record from either generation process, and returns 1 to indicate “I think this is a real interaction.” The probabilities include both record-generation randomness and $D$'s own randomness. The distributions need not be statistically close; rather, every efficient $D$ has negligible distinguishing advantage. For each $D$, the bound must hold across all valid inputs, witnesses, and admissible auxiliary inputs.

**A small example clarifies what comparing distributions means.** These are hypothetical two-bit records, not a zero-knowledge protocol.

| Record $t$ | Probability for real record $X$ | Probability for a candidate simulator's record $Y$ |
| --- | --- | --- |
| $00$ | $1/4$ | $1/2$ |
| $01$ | $1/4$ | $0$ |
| $10$ | $1/4$ | $0$ |
| $11$ | $1/4$ | $1/2$ |

Each individual bit is equally likely to be 0 or 1 under either distribution. However, a distinguisher returning 1 when the bits agree has $\Pr[D(X)=1]=1/2$ and $\Pr[D(Y)=1]=1$, giving advantage $1/2$. Identical marginal distributions do not imply an identical **joint distribution of the complete record**. If this gap persists as input length grows, even computational indistinguishability fails. This is why zero-knowledge compares the entire view.

The objects being compared are therefore **the distributions of the real-view random variable $X$ and simulator-output random variable $Y$, for the same fixed public input**. Restricting a dishonest prover for soundness is a different axis from restricting distinguishers for zero-knowledge. Being an argument does not force computational zero-knowledge: original Groth16, studied in Session 11, establishes perfect zero-knowledge.

<StudyDiagram id="02-1" :en="true" />

An **honest verifier** is a verifier that follows the prescribed protocol, not a judgment about someone’s character. It samples challenges from the specified distribution and applies the specified acceptance rule. We still allow it to record and analyze the messages and its own randomness. **Honest-verifier zero-knowledge (HVZK)** means that this verifier’s view can be simulated without the witness. This differs from zero-knowledge against verifiers that deviate from the protocol, for example by choosing challenges differently.

**Graph isomorphism example.** Let the public graphs be $G_0,G_1$ and the secret isomorphism be $\pi:G_0\to G_1$. The prover samples a random vertex permutation $\rho$, sends $H=\rho(G_0)$, receives a uniform bit $b$, and returns an isomorphism $G_b\to H$: $\rho$ for $b=0$, or $\rho\circ\pi^{-1}$ for $b=1$. Answers to both challenges for the same $H$ yield an isomorphism between the public graphs by composition.

An honest-verifier simulator can choose $b$ and a random isomorphism $G_b\to H$ first. Malicious-verifier security requires a separate argument involving rewinding. Generating a record and answering a live verifier are different tasks.

### 2.3 Checking the intuition

The next explanation previews the **Schnorr identification protocol**, developed in Section 4.1. It demonstrates knowledge of a secret exponent corresponding to a public value without handing over that exponent. It has three stages: the prover sends an initial message (commitment), the verifier sends a random challenge, and the prover responds. An honest verifier in this Schnorr-type protocol samples its challenge uniformly from the specified set after receiving the commitment, then checks the response using the prescribed equation.

<SchnorrOverview :en="true" />

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
2. Verifier: sample a uniform challenge $c\in\mathbb{Z}_q$ and send it.
3. Prover: send the response $s = r + cw$.
4. Verifier: check that $g^s = t \cdot y^c$.

The verification equation $g^s=t\cdot y^c$ follows from the homomorphism $g^{r+cw}=g^r\cdot(g^w)^c$. Distinguish why that identity holds from knowing the secret. For extraction, take accepting responses $s_1,s_2$ to different challenges $c_1\ne c_2$ with **the same initial commitment**. Subtracting cancels the common randomness and gives:

$$w = \frac{s_1 - s_2}{c_1 - c_2}.$$

Read division as multiplication by an inverse in $\mathbb{Z}_q$. The challenge difference is nonzero, so the exponent $w$ can be recovered. Extraction from distinct accepting responses sharing the first message is called special soundness.

**The algebraic structure of the relation becomes the structure of the protocol itself.** As the mathematical object changes—discrete logarithms, quadratic residues, and so on—we can design a tailored protocol for each case.

<StudyDiagram id="02-2" :en="true" />

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

| Relation | Interactive examples | Non-interactive examples | Reading succinctness |
| --- | --- | --- | --- |
| Algebraic relations | Schnorr, Chaum–Pedersen | Fiat–Shamir applied to suitable Sigma protocols | These relations admit short proofs; Fiat–Shamir itself is not proof compression |
| General NP relations | Interactive ZK constructions for general NP | Groth16 / PLONK / STARK | Assess proof size and verification cost relative to computation size separately from non-interactivity |

The message of this table is that **zk-SNARKs and zk-STARKs result from simultaneously advancing along two independent axes—expressiveness and efficiency—rather than simply making an existing protocol more efficient**. In Act II, we will assemble the tools supporting both axes in parallel.

<StudyDiagram id="02-3" :en="true" />

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
