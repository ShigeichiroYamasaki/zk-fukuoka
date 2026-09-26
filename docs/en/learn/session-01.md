---
outline: [2, 3]
prev:
  text: Session index
  link: /en/learn/sessions
next:
  text: Session 2 · Zero-knowledge and the generalization of witnesses
  link: /en/learn/session-02
---

# Session 1: What is a proof? — Background and formalization of interactive proofs

::: info Lecture manuscript
An English translation of the supplied Japanese manuscript for Session 1.
:::

[Session index](./sessions) · [Topic index](./topics) · [Session 1 in the syllabus](./#session-1)

## Context and learning objectives

This lecture is the starting point for a 15-session course on zk-SNARKs and zk-STARKs. Today's three objectives are:

1. Make explicit the implicit assumptions behind the classical concept of a proof—the NP verifier paradigm—and question them.
2. Understand how removing those assumptions leads to interactive proofs, independently motivated by two different contexts: complexity theory and cryptography.
3. Take the first steps toward a mathematical definition of interactive proofs: completeness, soundness, and the distinction between proofs and arguments.

The definition of zero-knowledge itself comes in the next session, Session 2. Today we establish the preceding foundation: why interaction is needed.

---

## 1. The classical proof paradigm and its limitations

### 1.1 The NP verifier paradigm

A language $L \in \mathrm{NP}$ is one for which there exists a polynomial-time verification algorithm $V$ satisfying

$$x \in L \iff \exists w,\ |w| \le \mathrm{poly}(|x|),\ V(x, w) = 1$$

Here, $w$ is called a witness. In this framework, a proof consists of presenting the witness $w$ itself and having the verifier check it using a deterministic polynomial-time algorithm: a single exchange.

**Let us identify two assumptions implicit in this paradigm:**

- **Assumption A (full disclosure):** The prover reveals the entire witness $w$ to the verifier.
- **Assumption B (non-interaction and one-way communication):** Verification is completed in a single reading, with no questions from the verifier to the prover.

At first, both assumptions may seem obvious. Yet questioning each one is where the story of this course begins.

### 1.2 Asking the questions

- Questioning Assumption A: “Can we convince someone that $x \in L$ without revealing the entire witness?” This foreshadows **zero-knowledge**, which we discuss next time.
- Questioning Assumption B: “If the verifier and prover exchange messages repeatedly rather than relying on a single reading, does the power of proofs—the class of languages that can be verified—change?” This is today's topic.

These questions appear independent, but later converge on the same mathematical framework: interactive proof systems. Today we first trace the question behind Assumption B through two different origins.

---

## 2. Motivation for interactive proofs (1): Complexity theory

### 2.1 Arthur–Merlin games

In 1985, Babai proposed an interactive game in which the verifier can use randomness. The setting is a conversation between Merlin, an all-powerful but untrustworthy prover, and Arthur, a computationally limited verifier who can use randomness.

A natural first intuition is that allowing interaction might not expand the power of proofs—the class of verifiable languages—much beyond NP. After all, showing an entire witness at once and exchanging it through several rounds of interaction may not seem fundamentally different.

### 2.2 IP = PSPACE (presenting the result)

That expectation was dramatically overturned. Work by Lund–Fortnow–Karloff–Nisan, followed by Shamir (1992), established

$$\mathrm{IP} = \mathrm{PSPACE}$$

IP is the class of languages decidable through interactive proofs with a polynomial-time verifier; PSPACE is the class decidable using polynomial space. PSPACE contains NP ($\mathrm{NP} \subseteq \mathrm{PSPACE}$) and is believed to be strictly larger—a far broader class.

**The meaning of this result deserves emphasis:** Allowing interaction and randomness expands the power of proofs from NP to an astonishing extent. It is a remarkable result in complexity theory, demonstrating the strength of the dynamic paradigm of questioning through interaction compared with the static paradigm of writing out a complete proof.

*(We will discuss the sumcheck protocol, a technique used in the proof, after assembling the polynomial tools in Act II. Today we focus only on the result and its significance.)*

### 2.3 Summary of this motivation

In complexity theory, interactive proofs were discovered as a tool for expanding verification power. Secrecy and trustworthiness are not the particular focus here; the question is how far interaction can increase the power to decide languages.

---

## 3. Motivation for interactive proofs (2): Cryptography

### 3.1 The Goldwasser–Micali–Rackoff problem setting (1985)

In the same year, 1985, a second origin of interactive proofs emerged from an entirely different motivation. GMR posed a question along these lines:

> How can you convince someone that you know a secret without revealing it?

This concern differs entirely from the complexity-theoretic aim of expanding the power of proofs. Here, the characters of prover and verifier are assigned **adversarial roles**:

- The prover may be dishonest: they might pretend to know a secret they do not actually know.
- The verifier may be curious: they might try to extract secret information from the proof process.

Classical proof theory does not have this kind of adversarial perspective. A mathematical proof is judged correct or incorrect regardless of who reads it; the intentions of the prover or verifier are not the issue. GMR brought a cryptographic way of thinking to this setting.

### 3.2 Building intuition with examples

**Example 1: Password authentication.** Rather than merely sending a password hash to a server, we want to prove knowledge of the password itself without revealing it.

**Example 2: Graph isomorphism.** Suppose the prover knows an isomorphism $\pi$ between two graphs $G_1, G_2$. How can the prover convince the verifier that $G_1 \cong G_2$ without revealing $\pi$?

*(We will construct the concrete interactive protocol for graph isomorphism in detail next time, alongside the formal definition of zero-knowledge. Today it serves only as motivation: questions like this called for the framework of interactive proofs.)*

### 3.3 Summary of this motivation

In cryptography, interactive proofs were motivated as a tool for proving knowledge while protecting secret information. Adversarial participants take center stage; the origin is quite different from the complexity-theoretic motivation.

---

## 4. The convergence of the two motivations

It is noteworthy that in the same year, 1985, the separate fields of complexity theory and cryptography independently called for the same mathematical object: interactive proofs.

- Complexity theory: “How far can interaction increase verification power?”
- Cryptography: “How can we prove something without revealing a secret?”

These two questions lead to a common formal framework: the **interactive proof system**. From here on, we develop this shared framework and construct interactive proofs that meet the cryptographic requirement of zero-knowledge.

---

## 5. A formal definition of interactive proof systems

With these motivations in place, we now define interactive proof systems mathematically.

### 5.1 Completeness and soundness

An interactive proof system $(P, V)$ for a language $L$ is an interactive protocol between a prover $P$ with unrestricted computational power and a probabilistic polynomial-time verifier $V$, satisfying the following properties:

**Completeness:** If $x \in L$, the verifier $V$ accepts with overwhelming probability when interacting with the honest prover $P$.

$$x \in L \implies \Pr[\langle P, V \rangle(x) = 1] \ge 1 - \mathrm{negl}(|x|)$$

**Soundness:** If $x \notin L$, the verifier $V$ rejects with overwhelming probability regardless of which dishonest prover $P^*$ it interacts with.

$$x \notin L \implies \forall P^*,\ \Pr[\langle P^*, V \rangle(x) = 1] \le \mathrm{negl}(|x|)$$

The universal quantification over every prover in the soundness definition is a major difference from classical NP verification, described as accepting whenever the witness is correct. Here, the possibility of a dishonest prover is addressed directly.

### 5.2 Proof vs argument

Two different strengths of this notion arise depending on how we restrict the computational power of $P^*$ in the soundness definition:

- **Interactive proof:** No restriction is placed on the computational power of $P^*$. Soundness in this setting is called **statistical soundness**. The class IP is defined in this sense.
- **Interactive argument:** $P^*$ is restricted to polynomial-time algorithms. Soundness in this setting is called **computational soundness**.

This distinction may appear minor, but it becomes crucial later in the course. **Many zk-SNARKs and zk-STARKs are, strictly speaking, arguments rather than proofs.** Their soundness may therefore not be guaranteed against an adversarial prover with unlimited computational power. Keep this in mind now as something we must check when reading each protocol in Act III.

---

## Summary and next session

Today we:

- Made explicit two implicit assumptions in the NP verifier paradigm: full disclosure and non-interaction.
- Saw how interactive proofs were motivated independently by complexity theory (IP = PSPACE) and cryptography (GMR).
- Introduced formal definitions of completeness and soundness and the distinction between proofs and arguments.

In Session 2, we directly address the question behind Assumption A—full disclosure—which we deliberately left unexplored today. We introduce the formal definition of zero-knowledge through the simulator paradigm, then examine the qualitative significance of extending witnesses from simple algebraic objects, such as discrete logarithms, to general computations.

---

## References and further reading

- Goldwasser, Micali, Rackoff, “[The Knowledge Complexity of Interactive Proof Systems](https://epubs.siam.org/doi/10.1137/0218012),” 1985 (1989 SIAM Journal on Computing version). — SIAM, 1989 version
- Babai, “[Trading Group Theory for Randomness](https://doi.org/10.1145/22145.22192),” STOC 1985. — ACM publication page
- Shamir, “[IP = PSPACE](https://weizmann.esploro.exlibrisgroup.com/esploro/outputs/journalArticle/IP--PSPACE/993265992703596),” Journal of the ACM, 1992. — bibliography and abstract at the author’s institution
- Goldreich, *[Foundations of Cryptography, Volume 1: Basic Tools](https://www.wisdom.weizmann.ac.il/~oded/foc-vol1.html)*, Chapter 4 (a textbook introduction to interactive proofs). — author’s book information, contents, and errata

## Suggested classroom questions

- Before beginning the discussion, ask students to predict whether it seems possible or impossible to convince someone that $x \in L$ without revealing the entire witness.
- After presenting IP = PSPACE, ask questions such as “What if we allow infinitely many rounds of interaction?” or “Does fixing the number of rounds change the class?” These provide useful preparation for the discussion of efficiency—round complexity and succinctness—in Act II.
