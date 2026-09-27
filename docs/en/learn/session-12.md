---
outline: [2, 3]
prev:
  text: Session 11 · Groth16
  link: /en/learn/session-11
next:
  text: Session 13 · STARK
  link: /en/learn/session-13
---

# Session 12: PLONK

::: info Lecture manuscript
This page is an English translation of the supplied Session 12 manuscript. Editorial notes clarify selectors and copy constraints. The AIR reference in the next-session preview has been corrected to Session 4.
:::

[Sessions](./sessions) · [Topics](./topics) · [Session 12 in the syllabus](./#session-12) · [Exercises](../exercises/)

## Context and learning objectives

Groth16, studied last time, offers excellent proof size and verification cost, but has a major practical limitation: trusted setup must be repeated for each circuit. Today we study PLONK (Gabizon, Williamson, Ciobotaru, 2019), designed to overcome this restriction.

The three learning objectives are:

1. Understand the motivation for universal setup (trusted setup independent of a particular circuit) and the arithmetization techniques that enable it.
2. Understand why the permutation argument, a method for verifying copy constraints, was introduced.
3. Understand how custom gates contribute to the expressiveness and efficiency of arithmetization.

---

## 1. The motivation for universal setup

### 1.1 Revisiting Groth16’s restriction

As we saw last time, Groth16’s SRS is generated according to the QAP structure—the circuit itself. When the circuit changes, trusted setup must be performed again. This creates a significant operational burden for practitioners supporting many different applications and circuits.

### 1.2 Desired properties: universal and updatable

PLONK aims for trusted setup with two properties:

- **Universal:** A single SRS can be reused for **any circuit** within a predetermined size bound.
- **Updatable:** Multiple participants can update the SRS sequentially, with security preserved if at least one participant is honest. This extends the multi-party generation idea from Session 11 in a more flexible form.

To achieve this goal, PLONK uses an arithmetization approach different from QAPs: PLONKish arithmetization.

---

## 2. PLONKish arithmetization

### 2.1 How the approach differs from QAPs

In the QAP-based construction from Session 4, when R1CS constraints are combined into one polynomial divisibility relation, the circuit-specific structure—which variables occur in which constraints—is embedded at SRS generation time. This is the underlying reason that Groth16’s SRS is circuit-specific.

PLONK represents computation as a sequence of gates and introduces **selector polynomials that choose gate types**, such as addition and multiplication. Circuit-specific information is moved out of the SRS and into these selector polynomials, described in the manuscript as public information prepared by the prover during proof generation. This makes it possible for the SRS itself to be universal and independent of the circuit.

### 2.2 The basic constraint

PLONK’s basic gate constraint takes the form

$$q_L(X) a(X) + q_R(X) b(X) + q_O(X) c(X) + q_M(X) a(X)b(X) + q_C(X) = 0$$

Here, $a, b, c$ are polynomials (traces) representing the left input, right input, and output of each gate. The circuit-specific selector polynomials are $q_L, q_R, q_O, q_M, q_C$. For example, setting $q_M = 1$ and the other selectors appropriately gives a multiplication gate, while $q_L=q_R=1, q_O=-1$, with the other terms set appropriately, gives an addition gate.

Separating the circuit-specific information—**which computation to perform**—from the SRS and into selector data is central to enabling universal setup.

::: info Editorial note: fixed selectors and the evaluation domain
Selectors and the wiring permutation are preprocessing data determined by the circuit, not freely chosen by the prover for each proof. Their commitments are bound to the verification key. The displayed equation must hold at the gate evaluation-domain points, not identically for every $X$. The constraints, including the public-input term, are expressed as divisibility by the domain’s vanishing polynomial. Embedding circuit information in an SRS is a choice in Groth16’s construction, not a necessity imposed by the QAP representation alone. See the [PLONK paper](https://eprint.iacr.org/2019/953).
:::

---

## 3. The permutation argument: copy constraints

### 3.1 Why it is needed: consistent wiring

The gate constraints in Section 2.2 alone do not guarantee **wiring consistency**: that one gate’s output is correctly used as another gate’s input. R1CS naturally expresses this consistency by sharing variables $z_i$. In a PLONKish representation, the separate gate entries in columns $a, b, c$ require an additional guarantee that values are copied correctly wherever needed.

### 3.2 The idea behind the permutation argument

The permutation argument verifies the constraint that the same value occurs at all designated locations. Its basic idea is to express **multiset equality** between an arrangement and a permuted arrangement using polynomials.

Applying the polynomial properties from Session 3, we can probabilistically test equality between polynomials whose roots encode collections of values, using the intuition of the Schwartz–Zippel lemma. A typical construction accumulates products in a polynomial and checks appropriate values at specified points.

*Deriving the precise polynomial construction is technically involved. Here we focus on the core idea: translate wiring consistency into multiset equality and verify it algebraically.*

::: info Editorial note: encode positions as well as values
Simply rearranging values always preserves their multiset, so that alone cannot check copy constraints. PLONK combines values with position labels and compares products using the circuit’s prescribed permutation and random challenges. This tests equality of values at the designated positions. See the [permutation argument in the original paper](https://eprint.iacr.org/2019/953).
:::

### 3.3 The broader significance of copy constraints

The permutation argument is not exclusive to PLONK. It solves a general problem: efficiently verifying, using polynomials, that values appearing at different locations are equal. Many later protocols reuse this technique.

---

## 4. The significance of custom gates

### 4.1 Motivation: making common patterns more efficient

Using only the basic addition and multiplication gates from Section 2.2, complex operations—such as elliptic-curve point operations or the internal operations of a particular hash function—can require many gates, increasing proving cost.

**Custom gates** directly define common complex operation patterns using dedicated selector polynomials and constraints. For example, an application-specific gate can combine several multiplications and additions in a single gate.

### 4.2 Expressiveness and efficiency

Custom gates extend the **expressiveness** axis introduced in Session 2 beyond the theoretical question of whether NP relations can be represented, toward the practical question of **how efficiently they can be represented**. Basic gates already suffice in principle: the Cook–Levin perspective lets computations be represented using combinations of basic gates. Custom gates matter as a practical design choice that can substantially affect the prover’s actual computation cost.

---

## 5. Revisiting the map from Session 10

Once again, organize PLONK into the three stages “IOP design → implementation → non-interactivity”:

- **IOP design:** PLONKish arithmetization—selector-based gate constraints together with the permutation argument—defines the polynomial relations to verify.
- **Implementation:** KZG commitments (Session 8) enable efficient verification of these relations at evaluation points. This uses the same broad family of pairing-based tools encountered with Groth16. PLONK-derived designs can also use FRI-based commitments, illustrating the point from Session 10 that arithmetization and commitment choices are separate design decisions.
- **Non-interactivity:** The Fiat–Shamir transform (Session 9) makes the protocol non-interactive. Unlike Groth16, PLONK is first designed as an interactive IOP and then made non-interactive, following the Session 10 map more directly.

---

## Summary and next session

Today we learned:

- The motivation for universal and updatable setup: overcoming Groth16’s circuit-specific trusted setup.
- PLONKish arithmetization separates circuit-specific information from the SRS through selector polynomials.
- The permutation argument verifies wiring consistency algebraically through multiset equality.
- Custom gates extend the expressiveness discussion to the practical question of efficient representation.
- Comparing PLONK and Groth16 highlights separate choices of arithmetization and commitments, and different routes to non-interactivity: trusted setup versus Fiat–Shamir.

Next time (Session 13), we study STARK. We will examine how the goal of eliminating trusted setup leads to the use of [FRI from Session 6](./session-06) and [AIR from Session 4](./session-04), and discuss tradeoffs between transparency, proof size, and verification cost.

---

## References and further reading

- Gabizon, Williamson, Ciobotaru, [“PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge,”](https://eprint.iacr.org/2019/953) 2019 (the original paper; public PDF available).
- Bünz, Fisch, Szepieniec, [“Transparent SNARKs from DARK Compilers,”](https://eprint.iacr.org/2019/1229) EUROCRYPT 2020 (further reading on transparent setup and polynomial IOPs; the linked revision includes a corrected security proof, with a public PDF).
- Gabizon, [“From AIRs to RAPs - how PLONK-style arithmetization works,”](https://hackmd.io/@aztec-network/plonk-arithmetiization-air) technical blog post (comparing PLONKish arithmetization with AIR; title follows the published article).

## Suggested classroom questions

- Before Section 2.1, ask where circuit-specific information could be moved if it must be removed from the SRS. This motivates selector polynomials.
- Before introducing the permutation argument, invite students to discuss how to express consistent wiring—the same value used in several places—in polynomial language. Use this discussion to bridge to multiset equality.
- Ask what disadvantages might arise from adding too many custom gates, including tradeoffs in SRS size and verification complexity, to develop a sense of design balance.
