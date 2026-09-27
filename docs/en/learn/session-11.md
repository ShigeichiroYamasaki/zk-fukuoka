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

[Sessions](./sessions) · [Topics](./topics) · [Session 11 in the syllabus](./#session-11) · [Exercises](../exercises/)

## Context and learning objectives

Today we begin Act III (Integration). Groth16 (Groth, 2016) combines arithmetization and pairings from Act II. It is a direct QAP-and-pairing construction: it neither incorporates KZG as a component nor uses Fiat–Shamir to obtain non-interactivity.

The three learning objectives are:

1. Understand how Groth16 combines the QAP from Session 4 with the pairings from Session 7 to achieve succinctness.
2. Understand why trusted setup is necessary in Groth16 as a consequence of its construction.
3. Compare Groth16 with the map from Session 10 and understand its direct non-interactive construction in the common reference string (CRS) model.

---

## 1. Revisiting the starting point: the QAP equation

Recall the QAP from Session 4. Satisfaction of every R1CS constraint was expressed as polynomial divisibility:

$$A(X) \cdot B(X) - C(X) = H(X) \cdot Z(X)$$

Here, polynomials such as $A(X) = \sum_i z_i A_i(X)$ incorporate an assignment vector $z$ containing the constant 1, public inputs, and the private witness. $Z(X)$ is the known polynomial whose roots are the constraint points. The prover demonstrates knowledge of a witness consistent with the public inputs and of the quotient polynomial $H(X)$. The verifier checks the relation without learning the private witness.

**This equation is the starting point for the entire protocol.** The tools from Act II are brought together to verify this single equation succinctly and in zero knowledge.

---

## 2. Why pairings are needed: checking multiplication

### 2.1 A naive approach and its difficulties

If the prover simply sent $A(\tau), B(\tau), C(\tau), H(\tau)$ as numbers at some evaluation point $\tau$, the verifier could directly check $A(\tau)B(\tau) - C(\tau) = H(\tau)Z(\tau)$. Simply revealing evaluations does not guarantee that no witness information leaks. Also, if the prover can choose polynomials after learning the test point $\tau$, it can arrange for an invalid polynomial identity to hold at that point. Checking the evaluation equation alone does not establish knowledge of an assignment consistent with the specified QAP and public inputs.

### 2.2 Encoding polynomial evaluations as group elements

An intuition shared with KZG from Session 8 is to encode evaluations at a secret point as group elements. Groth16 does not, however, incorporate KZG opening proofs. Embed the secret $\tau$ in an SRS and handle polynomial evaluations only as group elements, such as $g^{A(\tau)}$ and $g^{B(\tau)}$. The relation the verifier wants to check then corresponds to

$$g^{A(\tau)B(\tau)} \overset{?}{=} g^{C(\tau) + H(\tau)Z(\tau)}$$

However, **multiplication** of the exponents, $A(\tau) \cdot B(\tau)$, is not directly implemented by ordinary group operations on $g^{A(\tau)}$ and $g^{B(\tau)}$: multiplying group elements adds their exponents, while exponentiating by a known scalar multiplies the exponent by that scalar.

### 2.3 The pairing-based solution

The pairing from Session 7 plays the decisive role. Given $g^{A(\tau)} \in G_1$ and $h^{B(\tau)} \in G_2$, we have

$$e(g^{A(\tau)}, h^{B(\tau)}) = e(g, h)^{A(\tau) B(\tau)}$$

This represents a **product** of exponents in the target group $G_T$, providing the multiplicative verification capability from Session 7. It is not a complete proof system on its own: the key structure must enforce consistency with the QAP and public inputs, and randomization is needed for zero knowledge.

---

## 3. An outline of Groth16

### 3.1 Trusted setup

The secret trapdoor $(\tau, \alpha, \beta, \gamma, \delta)$ is used to generate circuit-specific proving and verification keys. The published structured reference string (SRS) contains prescribed combinations encoded as group elements, not these scalars themselves. Setup secrets must be securely destroyed. Appropriate MPC ceremonies rely on participant honesty and secret erasure to prevent reconstruction of the required trapdoor information.

The trapdoor components help enforce consistency of the QAP assignment and bind public inputs to the private witness. Zero knowledge additionally uses fresh prover randomness $r,s$ for each proof. Setup secrets and per-proof randomness have different roles.

### 3.2 Proof generation

The prover computes the QAP quotient from its assignment and combines proving-key elements to generate $\pi=(\pi_A,\pi_B,\pi_C)\in G_1\times G_2\times G_1$. Fresh randomness $r,s$ blinds the proof. The QAP polynomials $A(X),B(X),C(X)$ and proof elements $\pi_A,\pi_B,\pi_C$ are different objects. The original construction has perfect zero knowledge.

### 3.3 Verification

Write $[a]_1=g^a\in G_1$ and $[a]_2=h^a\in G_2$ to distinguish secret scalars from public group elements. For public inputs $x_1,\dots,x_\ell$ and verification-key elements $K_0,\dots,K_\ell\in G_1$, compute

$$\mathrm{IC}=K_0\prod_{i=1}^{\ell}K_i^{x_i}$$

and check

$$e(\pi_A,\pi_B)=e([\alpha]_1,[\beta]_2)\cdot e(\mathrm{IC},[\gamma]_2)\cdot e(\pi_C,[\delta]_2)$$

The encoded elements $[\alpha]_1,[\beta]_2,[\gamma]_2,[\delta]_2$ belong to the verification key; the verifier need not know their secret scalars. The equation verifies a proof for the QAP encoded in the keys and the specified public inputs.

The proof has **three group elements**, independent of circuit size and witness length. The pairing count is also constant: precomputing $e([\alpha]_1,[\beta]_2)$ leaves three pairings at verification time. However, computing $\mathrm{IC}$ requires group operations proportional to $\ell$. **Total verification time is therefore not constant with respect to the number of public inputs.** For fixed groups and security parameters, it consists of public-input processing plus a constant number of pairings. See the [original construction and efficiency analysis](https://iacr.org/archive/eurocrypt2016/96650272/96650272.pdf).

---

## 4. Why trusted setup is necessary

### 4.1 Revisiting the necessity

Groth16's soundness requires correctly generated reference parameters and setup secrets unavailable to adversaries. Recovering trapdoor information can allow a verifier-accepted proof without a valid witness. Secret management therefore concerns the entire setup, not only $\tau$. The intuition in Section 2.1—fitting values to a known evaluation point—helps motivate this concern but is not a complete security argument.

### 4.2 The restriction of circuit-specific setup

Another important feature of Groth16 is that the SRS depends on the **circuit structure itself**, expressed as an R1CS/QAP. A changed circuit requires corresponding proving and verification keys. Some setup procedures share a preparatory phase across circuits, but a circuit-specific phase remains. This is a significant practical restriction and one motivation for the universal setup pursued by PLONK, which we study next.

### 4.3 The security basis: the generic bilinear group model

The original Groth16 paper proves knowledge soundness in the **generic bilinear group model**. This model restricts how adversaries manipulate group elements to the permitted group operations, pairings, and related model interfaces.

Groth16 should therefore not be described simply as a reduction to q-SDH; its security basis differs from that of KZG in Session 8. The paper also establishes completeness and perfect zero knowledge, while the knowledge-soundness result carries the model conditions just described. Consult the [original paper](https://iacr.org/archive/eurocrypt2016/96650272/96650272.pdf) to distinguish each property and its premises.

---

## 5. Revisiting the map from Session 10

Session 10's “IOP design → implementation → non-interactivity” map helps explain many modern proof systems, but it is not Groth16's literal construction recipe. We can instead compare common design questions and the differences in their answers:

- **What is proved?** QAP arithmetization (Session 4) expresses circuit constraints as polynomial divisibility. Arithmetization alone is not an IOP.
- **Which tools verify it?** Circuit-specific keys and pairings (Session 7) verify a QAP proof bound to public inputs. Secret-point encodings share an intuition with KZG, but this is not a construction using KZG as a component.
- **Which model provides non-interactivity?** Groth16 is directly non-interactive in the CRS model, with reference parameters supplied by setup. It does not use Fiat–Shamir.

These distinctions help compare arithmetization, verification tools, and the source of non-interactivity with PLONK and STARK in the following sessions.

---

## Summary and next session

Today we learned:

- The QAP divisibility equation is the starting point of Groth16.
- The multiplicative verification capability of pairings is central to succinct, zero-knowledge verification of the QAP.
- Groth16 consists of trusted setup, proof generation, and verification through a single pairing equation.
- Setup secret management and circuit-specific keys are required; the original knowledge-soundness analysis uses the generic bilinear group model.
- Proof-element and pairing counts are constant, but public-input processing still has a cost.
- Comparison with Session 10 highlights Groth16’s direct non-interactive construction without Fiat–Shamir.

Next time (Session 12), we study PLONK: the motivation for universal setup to address Groth16’s circuit-specific setup, the introduction of the permutation argument, and the significance of custom gates.

---

## References and further reading

- Groth, [“On the Size of Pairing-based Non-interactive Arguments,”](https://eprint.iacr.org/2016/260) EUROCRYPT 2016 (the original paper; public PDF available).
- Gabizon, [“From AIRs to RAPs - how PLONK-style arithmetization works,”](https://hackmd.io/@aztec-network/plonk-arithmetiization-air) technical blog post (an introduction to comparing arithmetization in Groth16 and PLONK; title follows the published article).
- Bowe, Gabizon, Miers, [“Scalable Multi-party Computation for zk-SNARK Parameters in the Random Beacon Model,”](https://eprint.iacr.org/2017/1050) 2017 (multi-party generation of trusted-setup parameters; public PDF available).

## Suggested classroom questions

- Before presenting the difficulties in Section 2.1, ask students what could go wrong if $A(\tau)$ and $B(\tau)$ were simply sent as numbers. This helps motivate the need for pairings.
- Display $e(\pi_A,\pi_B) = e([\alpha]_1,[\beta]_2) \cdot e(\mathrm{IC},[\gamma]_2) \cdot e(\pi_C,[\delta]_2)$ and ask where the public inputs enter and which multiplication relation the pairing checks.
- Ask why circuit-specific key generation is needed, encouraging students to anticipate the motivation for universal setup in the next session.
