---
outline: [2, 3]
prev:
  text: Session 8 · Polynomial commitments and cryptographic commitment theory
  link: /en/learn/session-08
next:
  text: Session 10 · The PCP theorem and the IOP framework (syllabus)
  link: /en/learn/#session-10
---

# Session 9: The Fiat–Shamir transform and the merits and limits of ROM

::: info Lecture manuscript
This page is an English translation of the supplied Session 9 lecture manuscript.
:::

[Sessions](./sessions) · [Topics](./topics) · [Session 9 in the syllabus](./#session-9) · [Exercises](../exercises/)

## Position in the course and learning objectives

The protocols discussed so far, including Schnorr, FRI, and KZG openings, have been described through **interactive** exchanges between a prover and verifier. In practice, SNARKs and STARKs are used **non-interactively**: a prover generates a proof that a verifier can check later without interacting with the prover. Today we study the Fiat–Shamir transform, its theoretical security foundations, and its limitations.

There are three learning objectives:

1. Understand how the Fiat–Shamir transform turns interactive protocols into non-interactive ones.
2. Understand the idea of security proofs in the Random Oracle Model (ROM).
3. Recognize the heuristic nature of using ROM for concrete implementations, learn about theoretical counterexamples, and critically evaluate the model's significance and limitations.

---

## 1. Why is non-interactivity necessary?

### 1.1 Practical requirements

Interactive protocols require the prover and verifier to be online together, and each round trip takes time. Applications such as blockchain verification benefit from a proof generated once and verifiable by anyone even after the prover goes offline. This motivates non-interactivity in practice.

### 1.2 A common structure in earlier protocols

Recall the pattern in Schnorr from Session 2 and FRI from Session 6: the prover sends a commitment, the verifier sends a random challenge, and the prover sends a response. The manuscript describes this as a **Σ-protocol-style** structure. The shared feature is that the verifier's messages essentially supply random values.

---

## 2. The Fiat–Shamir transform

### 2.1 The basic idea

The central idea of Fiat–Shamir (1986) is:

> Replace the verifier's random challenge with a value that the prover computes by hashing the transcript so far.

For a Σ-protocol-style protocol, instead of receiving challenge $c$ from the verifier, the prover computes

$$c = H(\text{commitment}, x)$$

where $H$ is a cryptographic hash function. This removes the interactive round trip: the prover can generate and send a commitment–response pair in one go.

### 2.2 Security intuition

The intuition is that the prover cannot freely choose a favorable challenge $c$ for its commitment. Since $c$ is determined by hashing the commitment, the prover cannot simply arrange an invalid commitment together with a desired challenge by inverting the hash. This is intended to preserve, in a non-interactive form, the soundness provided by the verifier's random challenge in the interactive protocol.

---

## 3. The Random Oracle Model (ROM)

### 3.1 Definition of the model

ROM provides a setting for rigorous security arguments based on this intuition. It idealizes $H$ as a truly random function:

- A query on a previously unseen input receives a uniformly random output.
- Repeated queries on the same input always receive the same output, ensuring consistency.
- All algorithms, including attackers, access $H$ only through queries and cannot inspect its internal representation.

### 3.2 The structure of a security proof in ROM

For suitable protocols, security after Fiat–Shamir can be proved using the forking lemma from Session 6. By forking an adversary while changing a response to a random-oracle query, a reduction mimics rewinding in the interactive setting and obtains responses to two distinct challenges. This allows knowledge-extraction arguments from interactive protocols to be carried over to the non-interactive setting.

---

## 4. The limits of ROM

### 4.1 Instantiating ROM remains a heuristic

A crucial distinction is that **a security proof in ROM is not a proof about a concrete hash function such as SHA-256**. ROM is a mathematical model that assumes an idealized hash function. An implementation replaces this ideal object with a concrete hash function, and the ROM proof alone does not guarantee that this replacement is secure.

### 4.2 Theoretical counterexamples

Canetti, Goldreich, and Halevi's 2004 result, commonly called the CGH result, gives artificial constructions that are provably secure in ROM but become insecure under any concrete implementation of the random oracle $H$. This demonstrates that a ROM proof is not a universal guarantee of real-world security.

### 4.3 Why ROM is still widely used

Despite these counterexamples, ROM remains widely accepted in practice because:

- Counterexamples such as CGH are deliberately constructed to exhibit pathological behavior; they do not themselves provide concrete attacks on practical protocols such as Fiat–Shamir-based Schnorr signatures.
- A ROM proof provides strong evidence against structural flaws in a protocol within the model.
- Constructions with security proofs in the standard model are often much less efficient, or are not yet known for the desired functionality.

### 4.4 How to use this critical perspective

The goal is to evaluate technology while recognizing that ROM is useful but imperfect. When examining the security of zk-SNARKs and zk-STARKs, identifying which parts rely on ROM is an essential part of evaluating and implementing these systems.

---

## Summary and next session

Today we learned:

- Fiat–Shamir replaces interactive challenges with hash outputs to obtain non-interactivity.
- ROM supports security proofs using an idealized hash function, with the forking lemma from Session 6 providing a concrete proof technique.
- CGH counterexamples show why a ROM proof cannot universally guarantee security after concrete instantiation.
- ROM remains useful in practice, but its role requires critical evaluation.

Session 10 concludes Act II with the PCP theorem and the IOP framework. We will bring together the complexity-theoretic background introduced so far, including IP = PSPACE and Cook–Levin, and discuss connections to hardness of approximation. This completes the toolkit needed to study concrete protocols in Act III.

---

## References and further reading

- Fiat and Shamir, [“How to Prove Yourself: Practical Solutions to Identification and Signature Problems,” CRYPTO 1986](https://link.springer.com/chapter/10.1007/3-540-47721-7_12) — the original paper; publisher's page. The proceedings were published in 1987.
- Bellare and Rogaway, [“Random Oracles are Practical: A Paradigm for Designing Efficient Protocols,” CCS 1993](https://web.cs.ucdavis.edu/~rogaway/papers/ro-abstract.html) — the ROM methodology; author's publication page with links to the paper.
- Canetti, Goldreich, and Halevi, [“The Random Oracle Methodology, Revisited,” JACM 2004](https://eprint.iacr.org/1998/011) — counterexamples demonstrating limitations of ROM; public IACR ePrint version with PDF, initially released in 1998.
- Pointcheval and Stern, [“Security Arguments for Digital Signatures and Blind Signatures,” Journal of Cryptology, 2000](https://link.springer.com/article/10.1007/s001450010003) — a developed formulation of the forking lemma; publisher's page. Revisit [Session 6](./session-06).

## Suggested discussion questions

- Before introducing Fiat–Shamir, ask how randomness might be obtained without an online verifier, helping motivate the use of hashing.
- When presenting CGH, discuss the difference between a mathematical proof and security in a concrete implementation.
- Have students debate the trade-off between pursuing security proofs without ROM and prioritizing practical efficiency.
