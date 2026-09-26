---
outline: [2, 3]
prev:
  text: Session 7 · Elliptic curves and pairings
  link: /en/learn/session-07
next:
  text: Session 9 · The Fiat–Shamir transform and the merits and limits of ROM (syllabus)
  link: /en/learn/#session-9
---

# Session 8: Polynomial commitments and cryptographic commitment theory

::: info Lecture manuscript
This page is an English translation of the supplied Session 8 lecture manuscript.
:::

[Sessions](./sessions) · [Topics](./topics) · [Session 8 in the syllabus](./#session-8) · [Exercises](../exercises/)

## Position in the course and learning objectives

The previous session introduced pairings as an algebraic tool, while Session 6 introduced FRI as a coding-theoretic tool. Today these two strands meet in **polynomial commitments**, a central component of proof systems. We will study KZG, based on pairings, and FRI-based commitments as concrete examples within the general framework of **cryptographic commitment schemes**.

There are three learning objectives:

1. Understand the general security definitions for commitment schemes: binding and hiding.
2. Understand the KZG construction and how its security relates to pairings and the q-SDH assumption.
3. Understand the construction of FRI-based commitments and how their security relates to low-degree testing from Session 6.

---

## 1. General principles of cryptographic commitment schemes

### 1.1 Motivation: The face-down card analogy

A commitment can be compared to placing a card face down. By placing a value $v$ face down, we want two properties simultaneously: the other party cannot learn $v$ without seeing the card (hiding), and we cannot later replace it with a different card (binding).

### 1.2 Formal components

A commitment scheme generally has two algorithms:

- $\mathrm{Commit}(v, r) \to c$: Generate a commitment $c$ from a value $v$ and randomness $r$.
- $\mathrm{Open}(c, v, r)$: Verify that commitment $c$ corresponds to value $v$ and randomness $r$.

### 1.3 Binding

**Binding** means that a committed value cannot later be replaced with a different one. Formally, an adversary must not be able to open the same commitment $c$ using both $(v_1, r_1)$ and $(v_2, r_2)$ where $v_1 \ne v_2$.

### 1.4 Hiding

**Hiding** means that the commitment $c$ alone reveals no information about $v$, in a statistical or computational sense.

### 1.5 Extending to polynomial commitments

A polynomial commitment extends this framework to the case where the value $v$ is a polynomial $f(X)$, and adds the following functionality:

$$\mathrm{Eval}(c, x, y, \pi) \to \{0, 1\}$$

For the committed polynomial $f$, a short proof $\pi$ allows a verifier to check that $f(x) = y$ without revealing the entire polynomial. This additional functionality is central to the role of commitments in SNARKs and STARKs: a prover first commits to polynomials obtained through arithmetization in Session 4, then efficiently opens their values at random evaluation points requested by the verifier.

---

## 2. KZG (Kate) commitments

### 2.1 Setup

A trusted setup generates a structured reference string (SRS) for a secret value $\tau$ that must not remain known:

$$\{g, g^\tau, g^{\tau^2}, \dots, g^{\tau^d}\}$$

The value $\tau$ is destroyed after setup, or generated through a multiparty process so that no individual participant knows it.

### 2.2 Commitment

For a polynomial $f(X) = \sum_i a_i X^i$ of degree at most $d$, compute the commitment as

$$C = g^{f(\tau)} = \prod_i (g^{\tau^i})^{a_i}$$

It can be computed by combining the SRS elements $g^{\tau^i}$ with the coefficients, without knowing $\tau$ itself.

### 2.3 Opening and verification: The role of pairings

To prove that $f(x) = y$, the prover uses the fact that $f(X) - y$ is divisible by $(X-x)$, an application of the basic relationship between roots and polynomials from Sessions 3 and 5. Compute the quotient polynomial $q(X) = (f(X) - y)/(X-x)$ and send its commitment $\pi = g^{q(\tau)}$ as the proof.

The verifier checks the following pairing equation:

$$e(C \cdot g^{-y}, g) = e(\pi, g^{\tau} \cdot g^{-x})$$

By bilinearity, this checks the relation $f(\tau) - y = q(\tau) \cdot (\tau - x)$ without revealing $\tau$. **The multiplicative verification capability emphasized in the previous session now plays a concrete role.**

### 2.4 Security foundations

KZG's binding property is proved by reduction to the q-SDH assumption introduced in the previous session. The reduction argument from Session 7 takes the following form: an adversary able to produce different polynomials with the same commitment would yield an algorithm for solving the q-SDH problem.

---

## 3. FRI-based polynomial commitments

### 3.1 A different approach: No trusted setup

KZG requires trusted setup to generate a secret $\tau$ that must not remain known. FRI-based commitments instead apply low-degree testing from Session 6 to obtain a **transparent construction requiring no trusted setup**.

### 3.2 Construction outline

The prover commits to the evaluation representation of a polynomial $f$ using a Merkle tree: evaluation values are organized into a hash tree, and its root is sent as the commitment. To open a value, the prover supplies the Merkle path for the requested evaluation point, proving that the value belongs to the committed table.

FRI provides the low-degree guarantee. It checks that the committed table is close to the evaluation representation of a low-degree polynomial, while Merkle paths verify openings at particular points. The construction combines these two techniques.

### 3.3 Security foundations

Binding in FRI-based commitments relies on the collision resistance of the hash function used in the Merkle tree and on FRI's soundness. Unlike KZG, it relies on general hash-function properties rather than algebraic assumptions associated with pairings. This is also one reason STARKs claim post-quantum security: quantum algorithms can efficiently solve elliptic curve discrete logarithms, whereas suitably designed hash functions are expected to retain collision resistance at appropriate security parameters.

---

## 4. Comparing KZG and FRI-based commitments

| | KZG commitments | FRI-based commitments |
|---|---|---|
| Underlying tool | Pairings (Session 7) | Low-degree testing / FRI (Session 6) |
| Trusted setup | Required to generate the SRS | Not required; transparent |
| Security foundation | Reduction to q-SDH | Hash collision resistance + FRI soundness |
| Proof size | Constant | Logarithmic; depends on the FRI stages |

This comparison captures a central design distinction when contrasting Groth16/PLONK on the pairing/KZG side with STARKs on the FRI side in Act III. Whether trusted setup is required is more than an implementation detail: it reflects the nature of the cryptographic assumptions underlying the protocols.

---

## Summary and next session

Today we learned:

- The general security definitions for commitments: binding prevents changing the committed value, while hiding protects its secrecy.
- Polynomial commitments extend ordinary commitments with efficient openings of evaluations at specific points.
- KZG uses pairings and the q-SDH assumption and requires trusted setup.
- FRI-based commitments use FRI and hash collision resistance, without trusted setup.
- Comparing the two approaches highlights differences in the cryptographic assumptions underlying SNARK and STARK protocols.

In Session 9, we will study the Fiat–Shamir transform: how to turn the interactive protocols developed so far into practical non-interactive proofs. We will also discuss the Random Oracle Model used in security proofs and its theoretical limitations.

---

## References and further reading

- Kate, Zaverucha, and Goldberg, [“Constant-Size Commitments to Polynomials and Their Applications,” ASIACRYPT 2010](https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf) — the original KZG paper; public PDF hosted by IACR.
- Ben-Sasson et al., [“Scalable, transparent, and post-quantum secure computational integrity,” 2018](https://eprint.iacr.org/2018/046) — context for FRI-based commitments; public IACR ePrint version with PDF.
- Goldreich, [*Foundations of Cryptography, Volume 1*, Section 4.4](https://www.wisdom.weizmann.ac.il/~oded/foc-vol1.html) — general commitment theory, particularly Section 4.4.1; author's book page, table of contents, and errata.

## Suggested discussion questions

- When introducing commitments, ask how binding and hiding can coexist despite seeming contradictory.
- Before presenting KZG's verification equation, ask what is needed to check $f(\tau) = q(\tau)(\tau-x) + y$ without revealing $\tau$, helping students motivate pairings themselves.
- Compare Sections 2.4 and 3.3 and ask students to explain why STARKs can claim post-quantum security, reinforcing the comparison table.
