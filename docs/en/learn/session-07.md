---
outline: [2, 3]
prev:
  text: Session 6 · Low-degree testing and soundness amplification
  link: /en/learn/session-06
next:
  text: Session 8 · Polynomial commitments and cryptographic commitment theory
  link: /en/learn/session-08
---

<script setup>
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
</script>

# Session 7: Elliptic curves and pairings

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 28, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 7 in the syllabus](./#session-7) · [Exercises](../exercises/)

## Position in the course and learning objectives

So far, we have studied polynomial evaluations and how to check a table’s proximity to low-degree polynomials. Today we add another tool. How can we check multiplication relations while handling values as group elements? This question motivates elliptic curves and pairings, preparing us to read Groth16 in Act III.

There are three learning objectives:

1. Understand the definition and basic structure of elliptic curve groups.
2. Understand bilinear pairings and the new cryptographic capabilities they provide.
3. Understand the types and relationships of hardness assumptions, including discrete logarithms and q-SDH, and the basic structure of security arguments based on reductions.

Session 2 used algebraic properties to establish Schnorr special soundness and honest-verifier simulation. Hardness of recovering the secret exponent from the public key relies on discrete logarithms. Distinguish these roles. Pairings extend the available algebraic tools toward succinct systems such as Groth16.

---

## 1. Elliptic curve groups

### 1.1 Definition

First specify the objects on which we will compute. For a prime $p>3$, consider the following equation over the finite field $\mathbb{F}_p$.

$$y^2 = x^3 + ax + b \quad (4a^3 + 27b^2 \ne 0)$$

where $(x, y) \in \mathbb{F}_p \times \mathbb{F}_p$, together with a point at infinity $O$. The discriminant condition $4a^3+27b^2 \ne 0$ ensures that the curve has no singularities.

### 1.2 Group structure

A set of points alone is not yet a cryptographic tool. Defining addition of points gives a finite abelian group with the point at infinity $O$ as identity. Lines intersecting the curve provide a geometric interpretation of that addition. Rather than deriving every formula here, establish that we can add points and multiply them by integer scalars.

<StudyDiagram id="07-1" :en="true" />

### 1.3 Why use elliptic curves?

The discrete-log problem can also be defined in $\mathbb{F}_p^*$ from Session 3. One reason to choose elliptic curves is that appropriate curves allow shorter keys at a comparable security level. This is not a guarantee for every curve; assess the chosen group, known attacks, and required security together.

---

## 2. Bilinear pairings

### 2.1 Definition

Given group addition and scalar multiplication, what extra operation lets us check a relation involving the product of two hidden scalars? Consider the following map from two groups into a target group.

$$e: G_1 \times G_2 \to G_T$$

where $G_1, G_2, G_T$ are cyclic groups of order $q$, satisfying:

- **Bilinearity:** $e(aP, bQ) = e(P, Q)^{ab}$ for all $a, b \in \mathbb{Z}_q$, $P \in G_1$, and $Q \in G_2$.
- **Non-degeneracy:** $e(P, Q) \ne 1$ when $P$ and $Q$ are generators.
- **Efficient computability:** $e$ can be computed in polynomial time.

Here $G_1,G_2$ are suitable subgroups of elliptic-curve groups, while $G_T$ is a subgroup of an extension field’s multiplicative group. Constructions such as Weil and Tate pairings realize this map. Today, focus on the verification equations enabled by the three properties above rather than the algorithms computing the map.

### 2.2 Pairing-friendly curves

Making pairings easy to compute is not enough; some choices undermine security. We need to balance efficient pairing computation with hardness of discrete logarithms. Examples of curves designed for this purpose include:

- **BN254:** A Barreto–Naehrig curve that has long been widely used in many systems.
- **BLS12-381:** A curve widely adopted for its higher security level.

Selecting parameters such as the embedding degree requires number-theoretic analysis. For now, the key point is that carefully designed curves balance security and efficiency and are used in practice.

### 2.3 The new capability provided by pairings

Read bilinearity as a verification tool. Given $aP$ and $bQ$, the pairing produces $e(P,Q)^{ab}$: the product appears in an exponent without recovering $a$ or $b$. Symmetric notation writes this as $e(g^a,g^b)=e(g,g)^{ab}$, but actual constructions may require distinct generators in $G_1$ and $G_2$. Keep those types clear.

This is a **multiplicative verification capability** unavailable from ordinary discrete-log group operations alone, which provide additive structure in the exponents. Many SNARKs, including Groth16, use this property to verify polynomial multiplication relations in QAPs from Session 4. This connection will be crucial when studying Groth16 in Act III.

<StudyDiagram id="07-2" :en="true" />

---

## 3. A types and relationships of cryptographic hardness assumptions {#_3-a-hierarchy-of-cryptographic-hardness-assumptions}

### 3.1 Why are assumptions needed?

More available operations do not by themselves give a secure scheme. Specify which problem the adversary is assumed unable to solve. For each assumption, ask what the adversary receives and what it is challenged to compute, rather than memorizing its name.

### 3.2 The discrete logarithm (DL) assumption

The DL assumption says that an adversary given a generator $g$ of a group $G$ and $g^x$ cannot efficiently recover $x$. Notice the asymmetry between computing an exponentiation and reversing it. Schnorr in Session 2 checked knowledge of such a secret exponent.

### 3.3 Moving to stronger assumptions

DL alone may not suffice to prove a scheme’s required properties. Some constructions use hardness problems with richer input or assumptions about knowledge behind an output. The following examples distinguish computational hardness from knowledge assumptions involving extractors.

- **The q-SDH (q-Strong Diffie–Hellman) assumption:** Given $g, g^x, g^{x^2}, \dots, g^{x^q}$, it is hard to find a pair of the form $(c, g^{1/(x+c)})$ with $x+c\ne0$. Here q bounds the supplied powers; it is separate from the group order denoted q in Section 2. Exponents and c are taken modulo the prime group order. It is used in analyses such as KZG evaluation binding. Original Groth16 knowledge soundness is analyzed separately in the generic bilinear group model.
- **The Knowledge-of-Exponent Assumption (KEA):** An adversary given $g$ and $g^x$ that outputs a pair $(g^a, (g^x)^a)$ is assumed to know the exponent $a$. Unlike standard computational hardness assumptions, this is an assumption about knowledge.

### 3.4 What the distinction between standard and non-standard assumptions means

Labels such as “standard” and “non-standard” do not order all security guarantees on one scale. Assess the history of analysis, information given to the adversary, and whether an extractor’s existence is assumed. q-SDH and KEA are different kinds of assumptions. Groth16’s original knowledge-soundness analysis in Session 11 uses the generic bilinear group model; distinguish it from q-SDH-based evaluation binding for KZG.

---

## 4. Security proofs by reduction

### 4.1 The basic idea

Suppose an adversary can break the scheme. Can we use it to solve another problem? Such a construction makes the connection between an attack and an assumed hardness problem explicit. A reduction has the following basic form:

> If an efficient adversary $\mathcal{A}$ can break a protocol $\Pi$, then we can use $\mathcal{A}$ to construct an efficient algorithm $\mathcal{B}$ that solves a supposedly hard computational problem $P$, such as discrete logarithms.

If this construction is possible, then assuming $P$ is hard implies that breaking $\Pi$ is also hard. This is the basic form of a **reduction proof**.

<StudyDiagram id="07-3" :en="true" />

### 4.2 Why this form matters

A reduction establishes that an attack is difficult if the assumed problem is difficult. It does not prove the assumption itself. Rewinding and the forking lemma from Session 6 can help construct the algorithm establishing that relationship. Check the allowed access and how success probability and running time change.

This perspective explains why an assumption such as q-SDH might be introduced: it enables a security proof for a construction by reducing an attack on that construction to the assumed-hard problem.

---

## Summary and next session

Today we studied a tool for checking multiplication and the premises for using it securely. Distinguish available computations from security guarantees.

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
