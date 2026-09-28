---
outline: [2, 3]
prev:
  text: Session 10 · The PCP theorem and the IOP framework
  link: /en/learn/session-10
next:
  text: Session 12 · PLONK
  link: /en/learn/session-12
---

<script setup>
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
</script>

# Session 11: Groth16

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 27, 2026<br>
Last updated: September 27, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 11 in the syllabus](./#session-11) · [Exercises](../exercises/)

## Context and learning objectives

We now begin Act III by reading familiar tools inside actual proof systems. Groth16 checks QAP relations using pairings. Ask what becomes short and which assumptions make that possible. In comparing it with last session’s map, remember that it neither uses KZG as a component nor applies Fiat–Shamir for non-interactivity.

The three learning objectives are:

1. Understand how Groth16 combines the QAP from Session 4 with the pairings from Session 7 to achieve succinctness.
2. Understand why trusted setup is necessary in Groth16 as a consequence of its construction.
3. Compare Groth16 with the map from Session 10 and understand its direct non-interactive construction in the common reference string (CRS) model.

---

## 1. Revisiting the starting point: the QAP equation

First return to the relation we want to prove. Session 4 expressed satisfaction of every R1CS row through the following divisibility condition. While reading Groth16, keep asking which operations serve to check this relation.

$$A(X) \cdot B(X) - C(X) = H(X) \cdot Z(X)$$

Here, polynomials such as $A(X) = \sum_i z_i A_i(X)$ incorporate an assignment vector $z$ containing the constant 1, public inputs, and the private witness. $Z(X)$ is the known polynomial whose roots are the constraint points. The prover demonstrates knowledge of a witness consistent with the public inputs and of the quotient polynomial $H(X)$. The verifier checks the relation without learning the private witness.

**Fixing the relation first explains why the tools are chosen.** We want to check it without handing over the witness and keep the proof short as the circuit grows. Next ask what is missing if we simply send evaluation values.

---

## 2. Why pairings are needed: checking multiplication

### 2.1 A naive approach and its difficulties

Given $A(\tau),B(\tau),C(\tau),H(\tau)$ at a point $\tau$, checking $A(\tau)B(\tau)-C(\tau)=H(\tau)Z(\tau)$ is straightforward. But might those values reveal witness information? Could a prover knowing the test point select values satisfying the equation only there? Matching evaluations and knowing an assignment consistent with the specified QAP and public input require separate guarantees.

### 2.2 Encoding polynomial evaluations as group elements

An intuition shared with KZG from Session 8 is to encode evaluations at a secret point as group elements. Groth16 does not, however, incorporate KZG opening proofs. Embed the secret $\tau$ in an SRS and handle polynomial evaluations only as group elements, such as $g^{A(\tau)}$ and $g^{B(\tau)}$. The relation the verifier wants to check then corresponds to

$$g^{A(\tau)B(\tau)} \overset{?}{=} g^{C(\tau) + H(\tau)Z(\tau)}$$

However, **multiplication** of the exponents, $A(\tau) \cdot B(\tau)$, is not directly implemented by ordinary group operations on $g^{A(\tau)}$ and $g^{B(\tau)}$: multiplying group elements adds their exponents, while exponentiating by a known scalar multiplies the exponent by that scalar.

### 2.3 The pairing-based solution

Now apply Session 7’s tool. On inputs $g^{A(\tau)}\in G_1$ and $h^{B(\tau)}\in G_2$, the pairing yields the following value. Read the equation to see how the target group represents a product without recovering its factors.

$$e(g^{A(\tau)}, h^{B(\tau)}) = e(g, h)^{A(\tau) B(\tau)}$$

This represents a **product** of exponents in the target group $G_T$, providing the multiplicative verification capability from Session 7. It is not a complete proof system on its own: the key structure must enforce consistency with the QAP and public inputs, and randomization is needed for zero knowledge.

<StudyDiagram id="11-1" :en="true" />

---

## 3. An outline of Groth16

### 3.1 Trusted setup

Prepare the keys the prover and verifier will later use. Secret scalars $(\tau,\alpha,\beta,\gamma,\delta)$ determine circuit-specific group elements to publish. Distinguish the public SRS from the secrets used to generate it. Those secrets must be erased securely. Even with MPC, check which honesty and erasure conditions prevent their reconstruction.

The trapdoor components help enforce consistency of the QAP assignment and bind public inputs to the private witness. Zero knowledge additionally uses fresh prover randomness $r,s$ for each proof. Setup secrets and per-proof randomness have different roles.

### 3.2 Proof generation

The prover computes the quotient polynomial from a satisfying assignment and combines proving-key group elements. The result is a three-element proof $\pi=(\pi_A,\pi_B,\pi_C)\in G_1\times G_2\times G_1$. Distinguish the QAP polynomials $A(X),B(X),C(X)$ from these proof elements. Fresh per-proof randomness $r,s$ provides blinding. The original paper establishes perfect zero-knowledge for this construction.

### 3.3 Verification

Write $[a]_1=g^a\in G_1$ and $[a]_2=h^a\in G_2$ to distinguish secret scalars from public group elements. For public inputs $x_1,\dots,x_\ell$ and verification-key elements $K_0,\dots,K_\ell\in G_1$, compute

$$\mathrm{IC}=K_0\prod_{i=1}^{\ell}K_i^{x_i}$$

and check

$$e(\pi_A,\pi_B)=e([\alpha]_1,[\beta]_2)\cdot e(\mathrm{IC},[\gamma]_2)\cdot e(\pi_C,[\delta]_2)$$

The elements $[\alpha]_1,[\beta]_2,[\gamma]_2,[\delta]_2$ in this equation are public verification-key group elements, not revealed secret scalars. Checking the public-input-dependent IC alongside the three proof elements binds the proof to the intended public input.

The proof has **three group elements**, independent of circuit size and witness length. The pairing count is also constant: precomputing $e([\alpha]_1,[\beta]_2)$ leaves three pairings at verification time. However, computing $\mathrm{IC}$ requires group operations proportional to $\ell$. **Total verification time is therefore not constant with respect to the number of public inputs.** For fixed groups and security parameters, it consists of public-input processing plus a constant number of pairings. See the [original construction and efficiency analysis](https://iacr.org/archive/eurocrypt2016/96650272/96650272.pdf).

<StudyDiagram id="11-2" :en="true" number="11-1" />

---

## 4. Why trusted setup is necessary

### 4.1 Revisiting the necessity

The construction depends on allowing use of public group elements while keeping their generating secrets unavailable. Recovering the trapdoor risks satisfying the verification equation without a valid witness. Do not focus only on hiding $\tau$; examine secret handling across the entire setup. Section 2.1’s test-point example introduces the reason for this requirement.

### 4.2 The restriction of circuit-specific setup

What must change when the circuit changes? Groth16’s keys contain information about its QAP, so a new circuit requires corresponding proving and verification keys. Shared preparation stages can exist, but a circuit-specific stage remains. Reducing that operational burden motivates the universal SRS studied with PLONK next time.

<StudyDiagram id="11-3" :en="true" />

### 4.3 The security basis: the generic bilinear group model

Finally, ask under which conditions knowledge soundness is proved. The original paper uses the **generic bilinear group model**, restricting how the adversary handles group elements to the operations permitted by that model. Distinguish the theorem in that model from assumptions about concrete group implementations.

Groth16 should therefore not be described simply as a reduction to q-SDH; its security basis differs from that of KZG in Session 8. The paper also establishes completeness and perfect zero knowledge, while the knowledge-soundness result carries the model conditions just described. Consult the [original paper](https://iacr.org/archive/eurocrypt2016/96650272/96650272.pdf) to distinguish each property and its premises.

---

## 5. Revisiting the map from Session 10

Return to Session 10’s map and identify where Groth16 agrees and differs. Rather than forcing it into “IOP design → implementation → non-interactivity,” use the questions behind those stages to read its direct CRS construction.

- **What is proved?** QAP arithmetization (Session 4) expresses circuit constraints as polynomial divisibility. Arithmetization alone is not an IOP.
- **Which tools verify it?** Circuit-specific keys and pairings (Session 7) verify a QAP proof bound to public inputs. Secret-point encodings share an intuition with KZG, but this is not a construction using KZG as a component.
- **Which model provides non-interactivity?** Groth16 is directly non-interactive in the CRS model, with reference parameters supplied by setup. It does not use Fiat–Shamir.

These distinctions help compare arithmetization, verification tools, and the source of non-interactivity with PLONK and STARK in the following sessions.

---

## Summary and next session

Today we read Groth16 from the goal of checking QAP relations with short proofs. Review both succinctness and the premises supporting it.

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
