---
outline: [2, 3]
prev:
  text: Session 8 · Polynomial commitments and cryptographic commitment theory
  link: /en/learn/session-08
next:
  text: Session 10 · The PCP theorem and the IOP framework
  link: /en/learn/session-10
---

<script setup>
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
</script>

# Session 9: The Fiat–Shamir transform and the merits and limits of ROM

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 28, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 9 in the syllabus](./#session-9) · [Exercises](../exercises/)

## Position in the course and learning objectives

We have seen procedures in which the verifier supplies random questions during an exchange. But repeated interaction becomes a burden if a proof should be created once and checked later by others. Today we ask how to replace those questions, distinguishing the Fiat–Shamir procedure from the model used to prove its security. Note that a KZG evaluation opening itself is non-interactive once the point is specified.

There are three learning objectives:

1. Understand how the Fiat–Shamir transform turns interactive protocols into non-interactive ones.
2. Understand the idea of security proofs in the Random Oracle Model (ROM).
3. Recognize the heuristic nature of using ROM for concrete implementations, learn about theoretical counterexamples, and critically evaluate the model's significance and limitations.

---

## 1. Why is non-interactivity necessary?

### 1.1 Practical requirements

Consider placing a proof on a blockchain. It is easier for each participant to inspect a published proof than to conduct a separate exchange with the prover. The prover need not remain available to respond later. This operational goal motivates non-interactivity.

### 1.2 A common structure in earlier protocols

Schnorr uses commitment, challenge, and response. FRI also fixes tables before random challenges, but the complete protocol is a multi-round IOP rather than simply a three-message Σ-protocol. The common feature is issuing random challenges after preceding messages in a public-coin exchange.

---

## 2. The Fiat–Shamir transform

### 2.1 The basic idea

Could a reproducible rule replace the verifier’s fresh random choice? Fiat–Shamir hashes information already fixed in the exchange to obtain a challenge that anyone can recompute. The idea is:

> Replace the verifier's random challenge with a value that the prover computes by hashing the transcript so far.

For a Σ-protocol-style protocol, instead of receiving challenge $c$ from the verifier, the prover computes

$$c = H(\text{commitment}, x)$$

The prover is not the only party computing this hash. The verifier recomputes the challenge from the same input and checks the response. Actual constructions unambiguously encode the statement, public parameters, preceding messages, protocol identifiers, and other required context. Choosing what enters the hash is part of the protocol.

### 2.2 Security intuition

The prover can choose commitments and inspect their hashes, so it is inaccurate to say it cannot search for favorable values. We need to bound the probability of producing an invalid proof even after an efficient adversary makes repeated attempts. One-wayness alone does not give this conclusion. ROM makes queries and success probabilities explicit for analysis.

<StudyDiagram id="09-1" :en="true" />

---

## 3. The Random Oracle Model (ROM)

### 3.1 Definition of the model

To model how responses to inputs are determined, treat the hash as an ideal random function: the Random Oracle Model. “Random” does not mean that repeated queries to the same input receive different answers. The model has all three properties below.

- A query on a previously unseen input receives a uniformly random output.
- Repeated queries on the same input always receive the same output, ensuring consistency.
- All algorithms, including attackers, access $H$ only through queries and cannot inspect its internal representation.

<StudyDiagram id="09-2" :en="true" />

### 3.2 The structure of a security proof in ROM

For constructions such as Schnorr satisfying the required conditions, Session 6’s forking lemma can be used. Fork an adversary’s execution, change an oracle response, and obtain accepting transcripts for different challenges from which a witness can be extracted. This proof does not apply identically to every public-coin protocol; check the source protocol’s properties and the target security guarantee.

---

## 4. The limits of ROM

### 4.1 Instantiating ROM remains a heuristic

After proving security in ROM, ask exactly what was proved. The theorem concerns a scheme using an ideal random oracle. An implementation uses a concrete function such as SHA-256. The same guarantee does not automatically survive that substitution. Distinguish the theorem inside the model from the judgment of applying that model to an implementation.

### 4.2 Theoretical counterexamples

Canetti, Goldreich, and Halevi show that this distinction has mathematical consequences. There are artificial constructions secure in ROM but insecure under concrete hash instantiations, discussed in their 2004 JACM paper. This is not a blanket attack on practical schemes; it rules out a general implication from ROM security to implementation security.

<StudyDiagram id="09-3" :en="true" />

### 4.3 Why ROM is still widely used

Does the counterexample make ROM analysis useless? There is value in analyzing a scheme, including adversarial queries, under explicit idealized conditions. But security claims must stay within what was proved. Consider the practical reasons below while retaining that distinction.

- Counterexamples such as CGH are deliberately constructed to exhibit pathological behavior; they do not themselves provide concrete attacks on practical protocols such as Fiat–Shamir-based Schnorr signatures.
- A ROM proof establishes the specified security property within the idealized model; it does not certify an implementation or rule out every kind of attack.
- The cost of avoiding ROM depends on the functionality and setup assumptions. Groth16, for example, is non-interactive in the CRS model without Fiat–Shamir.

### 4.4 How to use this critical perspective

When reading a scheme, trace where it uses a random oracle and what that assumption establishes. Instead of stopping at “there is a security proof,” distinguish the model, assumptions, and implementation. We will use this reading method for PLONK and STARKs.

---

## Summary and next session

Today we studied a transformation removing interaction and the model used to analyze it. Review the procedure, model, and implementation separately.

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
