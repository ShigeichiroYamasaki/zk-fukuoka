---
outline: [2, 3]
prev:
  text: Session 10 · The PCP theorem and the IOP framework
  link: /en/learn/session-10
next:
  text: Session 12 · PLONK
  link: /en/learn/session-12
---

# Session 11: Groth16

::: info Lecture manuscript
This page is an English translation of the supplied Session 11 lecture manuscript. Editorial notes based on the original paper clarify verification cost and the security model.
:::

[Sessions](./sessions) · [Topics](./topics) · [Session 11 in the syllabus](./#session-11) · [Exercises](../exercises/)

## Context and learning objectives

Today we begin Act III (Integration). We study Groth16 (Groth, 2016) as our first concrete protocol, bringing together the tools developed in Act II: arithmetization, pairings, polynomial commitments, and Fiat–Shamir.

The three learning objectives are:

1. Understand how Groth16 combines the QAP from Session 4 with the pairings from Session 7 to achieve succinctness.
2. Understand why trusted setup is necessary in Groth16 as a consequence of its construction.
3. Revisit Groth16 using the three-stage map from Session 10: “IOP design → implementation → non-interactivity.”

---

## 1. Revisiting the starting point: the QAP equation

Recall the QAP from Session 4. Satisfaction of every R1CS constraint was expressed as polynomial divisibility:

$$A(X) \cdot B(X) - C(X) = H(X) \cdot Z(X)$$

Here, polynomials such as $A(X) = \sum_i z_i A_i(X)$ incorporate the witness $z$, and $Z(X)$ is the known polynomial whose roots are the constraint points. The prover wants to demonstrate knowledge of a correct $H(X)$ (and $z$, the witness), while the verifier wants to check this equation without learning $z$.

**This equation is the starting point for the entire protocol.** The tools from Act II are brought together to verify this single equation succinctly and in zero knowledge.

---

## 2. Why pairings are needed: checking multiplication

### 2.1 A naive approach and its difficulties

If the prover simply sent $A(\tau), B(\tau), C(\tau), H(\tau)$ as numbers at some evaluation point $\tau$, the verifier could directly check $A(\tau)B(\tau) - C(\tau) = H(\tau)Z(\tau)$. However, revealing these evaluations would fail to provide the zero knowledge required in Session 2. Moreover, under the assumption that the verifier knows $\tau$, the prover could choose polynomials tailored to $\tau$, undermining soundness.

### 2.2 Applying the idea behind KZG commitments

The idea behind the KZG commitment from Session 8 now becomes useful. Embed the secret $\tau$ in an SRS and handle polynomial evaluations only as group elements, such as $g^{A(\tau)}$ and $g^{B(\tau)}$. The relation the verifier wants to check then corresponds to

$$g^{A(\tau)B(\tau)} \overset{?}{=} g^{C(\tau) + H(\tau)Z(\tau)}$$

However, **multiplication** of the exponents, $A(\tau) \cdot B(\tau)$, cannot be computed from $g^{A(\tau)}$ and $g^{B(\tau)}$ alone (by the discrete-logarithm hardness intuition).

### 2.3 The pairing-based solution

The pairing from Session 7 plays the decisive role. Given $g^{A(\tau)} \in G_1$ and $h^{B(\tau)} \in G_2$, we have

$$e(g^{A(\tau)}, h^{B(\tau)}) = e(g, h)^{A(\tau) B(\tau)}$$

This lets us check a **product** in the exponent without revealing $\tau$. It is exactly the “multiplicative verification capability” emphasized in Session 7, and it captures the central idea behind Groth16.

---

## 3. An outline of Groth16

### 3.1 Trusted setup

The secret trapdoor $(\tau, \alpha, \beta, \gamma, \delta)$ is used to generate the SRS. These values must be destroyed after setup, or generated through a multi-party computation so that no individual learns them. The extra randomness beyond $\tau$ serves both zero knowledge (through random blinding terms) and soundness, discussed below (preventing a malicious prover from reusing proofs across different circuits). We will not derive the role of every term here. The key idea is that multiple trapdoor values address the requirements of both soundness and zero knowledge.

### 3.2 Proof generation

Using linear combinations of the group elements in the SRS, the prover computes three commitment-like group elements $(A, B, C) \in G_1 \times G_2 \times G_1$. These incorporate quantities corresponding to $A(\tau)$ and $B(\tau)$ from Section 2.2, together with random blinding terms for zero knowledge.

### 3.3 Verification

The verifier computes $\mathrm{IC}$ (Input Commitment) from the part of the SRS corresponding to the public inputs, and checks the pairing equation

$$e(A, B) = e(\alpha, \beta) \cdot e(\mathrm{IC}, \gamma) \cdot e(C, \delta)$$

This single equation checks the QAP divisibility relation from Section 2.1 succinctly and in zero knowledge. The proof consists of only three group elements, $(A, B, C)$, so its size is **constant**, independent of the witness size or circuit complexity. Verification takes only a few pairings and is therefore also described as constant time in the supplied manuscript.

::: info Editorial note: the scope of the verification-cost claim
The number of proof elements and pairing operations is constant. Computing $\mathrm{IC}$ requires group operations proportional to the number of public inputs, so total verification time is not independent of that number. In the displayed verification equation, $\alpha,\beta,\gamma,\delta$ abbreviate the corresponding encoded group elements in the verification key, not the secret scalars themselves. See the construction and efficiency discussion in the [original paper](https://iacr.org/archive/eurocrypt2016/96650272/96650272.pdf).
:::

*The exact linear combinations and the detailed roles of $\alpha, \beta, \gamma, \delta$ are left to the original paper or supplementary lecture material. Our priority here is to understand the structure: verifying the QAP through one pairing equation.*

---

## 4. Why trusted setup is necessary

### 4.1 Revisiting the necessity

As discussed for KZG in Session 8, the $\tau$ embedded in the SRS must remain unknown to the prover, the verifier, and everyone else. If $\tau$ leaks, someone who knows it can undermine soundness and generate false proofs. This brings back the problem from Section 2.1: a prover who knows $\tau$ can choose polynomials to fit that point.

### 4.2 The restriction of circuit-specific setup

Another important feature of Groth16 is that the SRS depends on the **circuit structure itself**, expressed as an R1CS/QAP. Whenever the computation to be proved changes, a new trusted setup is needed. This is a significant practical restriction and one motivation for the universal setup pursued by PLONK, which we study next.

### 4.3 The security basis: reductions to assumptions

The supplied manuscript describes Groth16 soundness as guaranteed by reductions to pairing-based hardness assumptions such as q-SDH, introduced in Session 7. It presents the setup-based security proof as showing, under these assumptions, that an adversary who does not know $\tau$ cannot construct a false proof.

::: info Editorial note: the security model in the original paper
The preceding description needs correction. The original Groth16 paper proves knowledge soundness in the **generic bilinear group model**; it should not be described simply as a reduction to q-SDH. Distinguish the security basis of KZG from Session 8 from that of Groth16. The [original paper](https://iacr.org/archive/eurocrypt2016/96650272/96650272.pdf) analyzes adversaries in a model that restricts how they manipulate group elements.
:::

---

## 5. Revisiting the map from Session 10

Let us place Groth16 on the three-stage map “IOP design → implementation → non-interactivity” from Session 10:

- **IOP design:** QAP arithmetization (Session 4) specifies the polynomial relation to be verified: a single divisibility equation.
- **Implementation:** The KZG-like idea and pairings (Sessions 7 and 8) implement verification of this relation without disclosing the secret evaluation point $\tau$.
- **Non-interactivity:** Groth16 is designed to be non-interactive from the outset using an SRS and trusted setup. It does not pass through the Fiat–Shamir transform, an important distinction from other protocols.

This last feature—obtaining non-interactivity directly through setup rather than Fiat–Shamir—will matter when comparing Groth16 with PLONK next time and STARK the following session.

---

## Summary and next session

Today we learned:

- The QAP divisibility equation is the starting point of Groth16.
- The multiplicative verification capability of pairings is central to succinct, zero-knowledge verification of the QAP.
- Groth16 consists of trusted setup, proof generation, and verification through a single pairing equation.
- Keeping $\tau$ secret underpins soundness, and circuit-specific setup creates a practical restriction.
- Groth16 can be revisited using the three-stage map from Session 10.

Next time (Session 12), we study PLONK: the motivation for universal setup to address Groth16’s circuit-specific setup, the introduction of the permutation argument, and the significance of custom gates.

---

## References and further reading

- Groth, [“On the Size of Pairing-based Non-interactive Arguments,”](https://eprint.iacr.org/2016/260) EUROCRYPT 2016 (the original paper; public PDF available).
- Gabizon, [“From AIRs to RAPs - how PLONK-style arithmetization works,”](https://hackmd.io/@aztec-network/plonk-arithmetiization-air) technical blog post (an introduction to comparing arithmetization in Groth16 and PLONK; title follows the published article).
- Bowe, Gabizon, Miers, [“Scalable Multi-party Computation for zk-SNARK Parameters in the Random Beacon Model,”](https://eprint.iacr.org/2017/1050) 2017 (multi-party generation of trusted-setup parameters; public PDF available).

## Suggested classroom questions

- Before presenting the difficulties in Section 2.1, ask students what could go wrong if $A(\tau)$ and $B(\tau)$ were simply sent as numbers. This helps motivate the need for pairings.
- Display $e(A,B) = e(\alpha,\beta) \cdot e(\mathrm{IC},\gamma) \cdot e(C,\delta)$ and ask students to identify which terms correspond to which parts of the QAP.
- Ask why trusted setup must be repeated for each circuit, encouraging students to anticipate the motivation for universal setup in the next session.
