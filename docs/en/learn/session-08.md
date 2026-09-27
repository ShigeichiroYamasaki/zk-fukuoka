---
outline: [2, 3]
prev:
  text: Session 7 · Elliptic curves and pairings
  link: /en/learn/session-07
next:
  text: Session 9 · The Fiat–Shamir transform and the merits and limits of ROM
  link: /en/learn/session-09
---

<script setup>
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
</script>

# Session 8: Polynomial commitments and cryptographic commitment theory

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 28, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 8 in the syllabus](./#session-8) · [Exercises](../exercises/)

## Position in the course and learning objectives

To test a polynomial at a random point, we want it fixed before revealing that point. When we later ask for a value, how do we establish that it belongs to the polynomial originally fixed? Polynomial commitments address this goal. Compare pairing-based KZG from Session 7 and FRI-based constructions from Session 6 as two ways to answer the same question.

There are three learning objectives:

1. Understand the general security definitions for commitment schemes: binding and hiding.
2. Understand the KZG construction and how its security relates to pairings and the q-SDH assumption.
3. Understand the construction of FRI-based commitments and how their security relates to low-degree testing from Session 6.

---

## 1. General principles of cryptographic commitment schemes

### 1.1 Motivation: The face-down card analogy

Imagine placing one card face down. We want its value $v$ hidden until it is revealed, and we must not be able to replace it after seeing the other party’s reaction. **Hiding a value and preventing later changes are distinct requirements.** A commitment scheme aims to realize both through computational procedures.

### 1.2 Formal components

Separate the example into fixing a value and later checking its opening. Including randomness, the algorithms can be written as follows:

- $\mathrm{Commit}(v, r) \to c$: Generate a commitment $c$ from a value $v$ and randomness $r$.
- $\mathrm{Open}(c, v, r)$: Verify that commitment $c$ corresponds to value $v$ and randomness $r$.

### 1.3 Binding

**Binding** prevents valid openings of the same $c$ to different values. Consider two openings $(v_1,r_1)$ and $(v_2,r_2)$ that both verify with $v_1\ne v_2$. We require this to be impossible for the specified adversary or to have only negligible success probability.

### 1.4 Hiding

**Hiding** asks whether a party seeing $c$ can distinguish which value was committed. Binding alone does not establish this property. The definition also distinguishes statistical hiding from hiding against a computationally bounded adversary.

### 1.5 Extending to polynomial commitments

A polynomial commitment extends this framework to the case where the value $v$ is a polynomial $f(X)$, and adds the following functionality:

$$\mathrm{Eval}(c, x, y, \pi) \to \{0, 1\}$$

This equation describes checking the claim $f(x)=y$ about a committed polynomial using a proof $\pi$. The goal is to authenticate a needed evaluation without resending the entire polynomial. It helps implement Session 3’s requirement to fix the arithmetization polynomials before selecting the test point.

<StudyDiagram id="08-1" :en="true" />

---

## 2. KZG (Kate) commitments

### 2.1 Setup

KZG publishes group elements corresponding to powers of a secret evaluation point $\tau$, without publishing the point itself. The portion of the trusted-setup SRS used to commit to a polynomial has the following form.

$$\{g, g^\tau, g^{\tau^2}, \dots, g^{\tau^d}\}$$

The value $\tau$ is destroyed after setup, or generated through a multiparty process so that no individual participant knows it.

### 2.2 Commitment

For a polynomial $f(X) = \sum_i a_i X^i$ of degree at most $d$, compute the commitment as

$$C = g^{f(\tau)} = \prod_i (g^{\tau^i})^{a_i}$$

This formula does not require learning $\tau$. The coefficients $a_i$ and public elements $g^{\tau^i}$ suffice to compute the right-hand side. Building the needed group element without knowing the exponent value is the reason for preparing the SRS.

### 2.3 Opening and verification: The role of pairings

To prove that $f(x) = y$, the prover uses the fact that $f(X) - y$ is divisible by $(X-x)$, an application of the basic relationship between roots and polynomials from Sessions 3 and 5. Compute the quotient polynomial $q(X) = (f(X) - y)/(X-x)$ and send its commitment $\pi = g^{q(\tau)}$ as the proof.

The verifier checks the following pairing equation:

$$e(C \cdot g_1^{-y}, g_2) = e(\pi, g_2^{\tau} \cdot g_2^{-x})$$

Write the preceding generator $g$ as $g_1\in G_1$ and include $g_2,g_2^\tau\in G_2$ in the verifier parameters. Reading the equation in the exponent gives $f(\tau)-y=q(\tau)(\tau-x)$. Session 7’s pairing handles this product relation without exposing the secret point.

<StudyDiagram id="08-2" :en="true" />

### 2.4 Security foundations

The binding property to check here concerns evaluation: opening one commitment at the same point to different values. KZG analyzes it under an SDH-type assumption corresponding to the degree bound. Knowledge extraction and hiding require separate treatment. The basic commitment shown so far is deterministic and is not inherently hiding; zero-knowledge requires appropriate randomization.

---

## 3. FRI-based polynomial commitments

### 3.1 A different approach: No trusted setup

Can we achieve the goal without generating a setup secret? FRI-based constructions fix a value table using hashes and test its relationship to low-degree polynomials. Merkle trees and proximity testing take the place of pairings and a secret evaluation point.

### 3.2 Construction outline

The prover commits to the evaluation representation of a polynomial $f$ using a Merkle tree: evaluation values are organized into a hash tree, and its root is sent as the commitment. To open a value, the prover supplies the Merkle path for the requested evaluation point, proving that the value belongs to the committed table.

A Merkle path establishes membership of a value in the fixed table. FRI separately tests proximity to a low-degree polynomial. Opening a polynomial at an arbitrary point also needs a mechanism, such as a quotient-polynomial check, connecting that claim to the table. Distinguish table membership, low-degree proximity, and correctness of the claimed evaluation.

<StudyDiagram id="08-3" :en="true" />

### 3.3 Security foundations

Hash collision resistance prevents changing the committed table; FRI soundness rejects tables far from low degree. The combined evaluation protocol must be analyzed as a whole. Non-interactive versions also introduce Fiat–Shamir and an oracle model. Assessing quantum resistance requires examining the transformed protocol, not merely the hash choice.

---

## 4. Comparing KZG and FRI-based commitments

| | KZG commitments | FRI-based commitments |
|---|---|---|
| Underlying tool | Pairings (Session 7) | Low-degree testing / FRI (Session 6) |
| Trusted setup | Required to generate the SRS | Not required; transparent |
| Evaluation correctness | Evaluation binding under a degree-appropriate SDH assumption | Table binding + FRI soundness + consistency with the evaluation claim |
| Evaluation-proof size | Constant number of group elements for a fixed group | Count queried values and Merkle paths; polylogarithmic in representative constructions |

Compare what is fixed, what is checked, and which assumptions are used. Folding depth is distinct from total proof size including authentication paths and queries. Non-interactivity and knowledge extraction require additional security conditions beyond evaluation binding. Act III compares KZG-based PLONK with representative FRI-based STARKs. Groth16 uses pairings but does not incorporate KZG as a component; preserve that distinction when reading the constructions.

---

## Summary and next session

Today we fixed polynomials before checking their values. Review the following while distinguishing binding, hiding, and correct evaluation.

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
