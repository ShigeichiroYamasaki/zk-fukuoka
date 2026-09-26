---
outline: [2, 3]
prev:
  text: Session 6 · Low-degree testing and soundness amplification
  link: /en/learn/session-06
next:
  text: Session 8 · Polynomial commitments and cryptographic commitment theory
  link: /en/learn/session-08
---

# Session 7: Elliptic curves and pairings

::: info Lecture manuscript
This page is an English translation of the supplied Session 7 lecture manuscript.
:::

[Sessions](./sessions) · [Topics](./topics) · [Session 7 in the syllabus](./#session-7) · [Exercises](../exercises/)

## Position in the course and learning objectives

Sessions 3–6 developed one family of tools: polynomials and coding theory. Today we begin another family, **elliptic curves and pairings**, which underpins SNARK protocols, particularly Groth16 in Act III.

There are three learning objectives:

1. Understand the definition and basic structure of elliptic curve groups.
2. Understand bilinear pairings and the new cryptographic capabilities they provide.
3. Understand the hierarchy of hardness assumptions, including discrete logarithms and q-SDH, and the basic structure of security arguments based on reductions.

The Schnorr protocol in Session 2 relied on the hardness of discrete logarithms. Pairings extend this algebraic toolkit and provide a foundation for succinct proofs such as Groth16.

---

## 1. Elliptic curve groups

### 1.1 Definition

An elliptic curve over a finite field $\mathbb{F}_p$, with $p > 3$, is defined by the points satisfying

$$y^2 = x^3 + ax + b \quad (4a^3 + 27b^2 \ne 0)$$

where $(x, y) \in \mathbb{F}_p \times \mathbb{F}_p$, together with a point at infinity $O$. The discriminant condition $4a^3+27b^2 \ne 0$ ensures that the curve has no singularities.

### 1.2 Group structure

An addition operation can be defined using intersections of lines with the curve. The resulting structure is an abelian group with identity $O$. We will state the addition rule, based on the third intersection of a line with the curve, without deriving it in detail. The important fact is that **elliptic curve points over finite fields provide cryptographically useful finite abelian groups**.

### 1.3 Why use elliptic curves?

The discrete logarithm problem can also be defined in the multiplicative group $\mathbb{F}_p^*$ introduced in Session 3. For elliptic curve groups, however, the best known attacks are less efficient, allowing substantially shorter keys at the same security level. This implementation advantage is a major reason for their widespread adoption.

---

## 2. Bilinear pairings

### 2.1 Definition

A bilinear pairing is a map

$$e: G_1 \times G_2 \to G_T$$

where $G_1, G_2, G_T$ are cyclic groups of order $q$, satisfying:

- **Bilinearity:** $e(aP, bQ) = e(P, Q)^{ab}$ for all $a, b \in \mathbb{Z}_q$, $P \in G_1$, and $Q \in G_2$.
- **Non-degeneracy:** $e(P, Q) \ne 1$ when $P$ and $Q$ are generators.
- **Efficient computability:** $e$ can be computed in polynomial time.

The groups $G_1$ and $G_2$ are suitable subgroups of elliptic curve point groups, while $G_T$ lies in the multiplicative group of an extension field. Constructions use pairings such as the Weil and Tate pairings. We will treat them as black boxes satisfying these properties rather than study their construction.

### 2.2 Pairing-friendly curves

Not every elliptic curve is suitable for pairings. Curves designed to support efficiently computable pairings are called **pairing-friendly curves**. Common examples include:

- **BN254:** A Barreto–Naehrig curve that has long been widely used in many systems.
- **BLS12-381:** A curve widely adopted for its higher security level.

Selecting parameters such as the embedding degree requires number-theoretic analysis. For now, the key point is that carefully designed curves balance security and efficiency and are used in practice.

### 2.3 The new capability provided by pairings

Bilinearity makes it possible to **verify multiplicative relations between exponents through a pairing**. In multiplicative notation, the relation $e(g^a, g^b) = e(g, g)^{ab}$ illustrates how a relation involving $a \times b$ can be checked without revealing $a$ or $b$ themselves.

This is a **multiplicative verification capability** unavailable from ordinary discrete-log group operations alone, which provide additive structure in the exponents. Many SNARKs, including Groth16, use this property to verify polynomial multiplication relations in QAPs from Session 4. This connection will be crucial when studying Groth16 in Act III.

---

## 3. A hierarchy of cryptographic hardness assumptions

### 3.1 Why are assumptions needed?

To use pairings securely, we must identify which computational problems a cryptographic construction relies on being hard. This section organizes representative assumptions into a hierarchy.

### 3.2 The discrete logarithm (DL) assumption

Given a generator $g$ of a group $G$ and an element $g^x$, finding $x$ is assumed to be computationally hard. This is a fundamental assumption underlying the security of Schnorr in Session 2.

### 3.3 Moving to stronger assumptions

For many pairing-based constructions, security cannot be established from the DL assumption alone, and stronger, non-standard assumptions are often used. Examples include:

- **The q-SDH (q-Strong Diffie–Hellman) assumption:** Given $g, g^x, g^{x^2}, \dots, g^{x^q}$, it is hard to find a pair of the form $(c, g^{1/(x+c)})$. The supplied manuscript associates this assumption with the security foundations of SNARK constructions including Groth16.
- **The Knowledge-of-Exponent Assumption (KEA):** An adversary given $g$ and $g^x$ that outputs a pair $(g^a, (g^x)^a)$ is assumed to know the exponent $a$. Unlike standard computational hardness assumptions, this is an assumption about knowledge.

### 3.4 What the distinction between standard and non-standard assumptions means

Standard assumptions such as DL have earned broad confidence through many years of research. Non-standard assumptions such as q-SDH and KEA were introduced for particular constructions and are presented here as stronger assumptions warranting closer scrutiny. The manuscript emphasizes that reliance on non-standard assumptions gives a relatively weaker basis for confidence in security. Keep the strength of the underlying assumptions in mind when discussing Groth16 in Act III.

---

## 4. Security proofs by reduction

### 4.1 The basic idea

Many cryptographic security proofs have this structure:

> If an efficient adversary $\mathcal{A}$ can break a protocol $\Pi$, then we can use $\mathcal{A}$ to construct an efficient algorithm $\mathcal{B}$ that solves a supposedly hard computational problem $P$, such as discrete logarithms.

If this construction is possible, then assuming $P$ is hard implies that breaking $\Pi$ is also hard. This is the basic form of a **reduction proof**.

### 4.2 Why this form matters

A reduction establishes security relative to a more fundamental and widely trusted assumption, rather than proving security absolutely. Rewinding and the forking lemma from Session 6 are technical tools for constructing such reductions: by running and rewinding the adversary $\mathcal{A}$, we build an algorithm $\mathcal{B}$ that solves the hard problem.

This perspective explains why an assumption such as q-SDH might be introduced: it enables a security proof for a construction by reducing an attack on that construction to the assumed-hard problem.

---

## Summary and next session

Today we learned:

- The definition of elliptic curve groups and their role as cryptographically useful finite abelian groups.
- The definition of bilinear pairings and their multiplicative verification capability.
- The practical role of pairing-friendly curves such as BN254 and BLS12-381.
- The progression from discrete logarithms to q-SDH and KEA, and the distinction between standard and non-standard assumptions.
- Reductions as a way to establish cryptographic security relative to assumptions.

In Session 8, we will study polynomial commitments: committing to a polynomial and later revealing its value at a chosen point in a verifiable way. We will examine both KZG commitments, which use today's pairings, and FRI-based commitments, which use FRI from Session 6, alongside the cryptographic definitions of binding and hiding.

---

## References and further reading

- Silverman, [*The Arithmetic of Elliptic Curves*](https://link.springer.com/book/10.1007/978-0-387-09494-6) — a standard textbook on elliptic curves; publisher's page for the second edition.
- Boneh and Franklin, [“Identity-Based Encryption from the Weil Pairing,” CRYPTO 2001](https://www.iacr.org/archive/crypto2001/21390212.pdf) — a classic starting point for cryptographic applications of pairings; public conference-version PDF. [Author's publication page and 2003 full version](https://crypto.stanford.edu/~dabo/pubs/abstracts/bfibe.html).
- Barreto and Naehrig, [“Pairing-Friendly Elliptic Curves of Prime Order,” SAC 2005](https://eprint.iacr.org/2005/133) — public IACR ePrint version with PDF; the conference proceedings were published in 2006.
- Katz and Lindell, [*Introduction to Modern Cryptography*](https://www.cs.umd.edu/~jkatz/imc.html) — textbook treatment of reduction-based security; author's book page, contents, and errata. The supplied manuscript specifies Chapter 11; check the contents of the edition you are using.

## Suggested discussion questions

- Present $e(aP, bQ) = e(P,Q)^{ab}$ and let students explore what it enables before discussing Section 2.3, highlighting the nontrivial new capability.
- Ask why some protocols cannot be proved secure using standard assumptions alone, and discuss the motivation for introducing non-standard assumptions.
- Have students explain the reduction structure in their own words: if an adversary existed, we could use it to solve another problem. Encourage them to notice the resemblance to proof by contradiction.
