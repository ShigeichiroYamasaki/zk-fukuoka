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

[Sessions](./sessions) · [Topics](./topics) · [Session 12 in the syllabus](./#session-12) · [Exercises](../exercises/)

## Context and learning objectives

Groth16, studied last time, offers excellent proof size and verification cost, but has a major practical limitation: circuit-specific trusted setup is required. Today we study PLONK (Gabizon, Williamson, Ciobotaru, 2019), designed to overcome this restriction.

The three learning objectives are:

1. Understand the motivation for universal setup (trusted setup independent of a particular circuit) and the arithmetization techniques that enable it.
2. Understand why the permutation argument, a method for verifying copy constraints, was introduced.
3. Understand how custom gates contribute to the expressiveness and efficiency of arithmetization.

---

## 1. The motivation for universal setup

### 1.1 Revisiting Groth16’s restriction

As we saw last time, Groth16’s SRS is generated according to the QAP structure—the circuit itself. A changed circuit requires corresponding proving and verification keys. Even procedures with a shared preparatory phase retain a circuit-specific setup phase. This creates a significant operational burden for practitioners supporting many different applications and circuits.

### 1.2 Desired properties: universal and updatable

PLONK aims for trusted setup with two properties:

- **Universal:** A single SRS can be reused for **any circuit** within a predetermined size bound.
- **Updatable:** Multiple participants can update the SRS sequentially. Provided updates are correctly verified and at least one honest participant securely erases their secret, the setup trapdoor remains unrecoverable. This extends the multi-party generation idea from Session 11 in a more flexible form.

PLONK separates a circuit-independent polynomial-commitment SRS from circuit-specific preprocessing. We focus on the original KZG-based construction and relate its arithmetization to later PLONKish extensions. A universal SRS still requires per-circuit preprocessing and proving/verification keys, but that preprocessing needs no new trusted ceremony involving fresh secrets.

---

## 2. PLONKish arithmetization

### 2.1 How the approach differs from QAPs

QAPs (Session 4) express R1CS constraints as polynomial divisibility. Groth16 encodes the circuit-specific polynomials defining its QAP in the reference parameters. This circuit dependence is a choice in Groth16's construction, not a requirement imposed by QAP representation itself.

PLONK arranges computation in gate rows and uses **selector polynomials** to specify each row's operation. Selectors and the wiring permutation are fixed preprocessing data derived from the circuit; their commitments are bound to the verification key. They cannot be freely changed by the prover for each proof. The important separation is between a universal SRS and this circuit-specific preprocessing.

### 2.2 The basic constraint

Let $\omega$ be a primitive $n$th root of unity in the field, and let $H=\{1,\omega,\dots,\omega^{n-1}\}$ be the gate evaluation domain. The polynomials $a,b,c$ interpolate left-input, right-input, and output columns. The polynomials $q_L,q_R,q_O,q_M,q_C$ are fixed selectors. Including a public-input polynomial $\mathrm{PI}(X)$, define

$$F(X)=q_L(X)a(X)+q_R(X)b(X)+q_O(X)c(X)+q_M(X)a(X)b(X)+q_C(X)+\mathrm{PI}(X)$$

The gate condition is **$F(x)=0$ for every $x\in H$**, not that $F(X)$ is identically zero at every field point.

At a row with zero public-input term, selector values $(q_L,q_R,q_O,q_M,q_C)=(0,0,-1,1,0)$ enforce $ab-c=0$, while $(1,1,-1,0,0)$ enforce $a+b-c=0$. These specify selector values at that row.

With the vanishing polynomial $Z_H(X)=\prod_{x\in H}(X-x)=X^n-1$, the condition becomes

$$F(X)=Z_H(X)T_{\mathrm{gate}}(X)$$

for a quotient polynomial $T_{\mathrm{gate}}(X)$. The full protocol combines this with copy constraints and checks polynomial relations using degree bounds and commitments. **Separating fixed circuit preprocessing from each proof's witness** lets a universal SRS support proofs of a specified circuit. See the [PLONK paper](https://eprint.iacr.org/2019/953).

---

## 3. The permutation argument: copy constraints

### 3.1 Why it is needed: consistent wiring

The gate constraints in Section 2.2 alone do not guarantee **wiring consistency**: that one gate’s output is correctly used as another gate’s input. R1CS naturally expresses this consistency by sharing variables $z_i$. In a PLONKish representation, the separate gate entries in columns $a, b, c$ require an additional guarantee that values are copied correctly wherever needed.

### 3.2 The idea behind the permutation argument

Copy constraints require **equal values at circuit-designated positions**. Merely permuting values always preserves their multiset, so that equality alone cannot establish correct wiring.

PLONK assigns distinct labels to positions and fixes a circuit-dependent permutation $\sigma$ whose cycles connect positions that must share a value. Let $v_j$ be the value at position $j$ and $\mathrm{id}_j$ its label. After committing to the values, random challenges $\beta,\gamma$ are chosen to check

$$\prod_j\bigl(v_j+\beta\,\mathrm{id}_j+\gamma\bigr)=\prod_j\bigl(v_j+\beta\,\mathrm{id}_{\sigma(j)}+\gamma\bigr)$$

The left side encodes values with their original positions; the right side pairs the same values with permuted position labels. Correct copies satisfy the relation. For incorrect copies, polynomial-degree bounds control the probability of accidental equality under random challenges, connecting to Session 3's probabilistic polynomial checks.

PLONK uses a grand-product polynomial to handle the many factors, enforcing adjacent-row updates and boundary conditions. Checking only the final product would not suffice: the accumulation updates must also be constrained. See the [original permutation argument](https://eprint.iacr.org/2019/953) for the construction.

### 3.3 The broader significance of copy constraints

The permutation argument is not exclusive to PLONK. It solves a general problem: efficiently verifying, using polynomials, that values appearing at different locations are equal. Many later protocols reuse this technique.

---

## 4. The significance of custom gates

### 4.1 Motivation: making common patterns more efficient

Using only the basic addition and multiplication gates from Section 2.2, complex operations—such as elliptic-curve point operations or the internal operations of a particular hash function—can require many gates, increasing proving cost.

**Custom gates** directly define common complex operation patterns using dedicated selector polynomials and constraints. For example, an application-specific gate can combine several multiplications and additions in a single gate.

### 4.2 Expressiveness and efficiency

Custom gates extend the **expressiveness** axis introduced in Session 2 beyond the theoretical question of whether NP relations can be represented, toward the practical question of **how efficiently they can be represented**. Basic gates already suffice to represent NP relations expressed as finite circuits. Custom gates matter as a practical design choice that can substantially affect the prover’s actual computation cost.

Custom gates should be understood as PLONKish extensions. Fewer rows need not mean lower cost if constraint degree, column count, or opened evaluations increase. Adding gate types does not automatically enlarge the SRS; the required degree bound and commitment scheme also matter.

---

## 5. Revisiting the map from Session 10

Once again, organize PLONK into the three stages “IOP design → implementation → non-interactivity”:

- **Polynomial IOP design:** Gate constraints, public inputs, and copy constraints for fixed selectors and wiring are checked using degree-bounded polynomial relations and random challenges.
- **Implementation:** KZG commitments (Session 8) enable efficient verification of these relations at evaluation points. The shared tool with Groth16 is pairings; Groth16 does not itself incorporate KZG. PLONKish derivatives can use FRI or other commitments, but changes require revisiting the protocol and security analysis. Distinguish their setup and performance properties from original PLONK.
- **Non-interactivity:** The Fiat–Shamir transform (Session 9) makes the protocol non-interactive. Unlike Groth16, PLONK is first designed as an interactive IOP and then made non-interactive, following the Session 10 map more directly.

---

## Summary and next session

Today we learned:

- The motivation for universal and updatable setup: overcoming Groth16’s circuit-specific trusted setup.
- PLONKish arithmetization separates fixed selector/wiring preprocessing from the universal SRS and expresses domain constraints through vanishing-polynomial divisibility.
- The permutation argument combines values with position labels and uses a grand product to check the fixed wiring’s copy constraints.
- Custom gates extend the expressiveness discussion to the practical question of efficient representation.
- Groth16 is directly non-interactive in the CRS model, whereas KZG-based PLONK uses both universal trusted setup and Fiat–Shamir.

Next time (Session 13), we study STARK. We will examine how a construction pursuing transparency combines [FRI from Session 6](./session-06) and [AIR from Session 4](./session-04), and discuss tradeoffs between transparency, proof size, and verification cost.

---

## References and further reading

- Gabizon, Williamson, Ciobotaru, [“PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge,”](https://eprint.iacr.org/2019/953) 2019 (the original paper; public PDF available).
- Bünz, Fisch, Szepieniec, [“Transparent SNARKs from DARK Compilers,”](https://eprint.iacr.org/2019/1229) EUROCRYPT 2020 (further reading on transparent setup and polynomial IOPs; the linked revision includes a corrected security proof, with a public PDF).
- Gabizon, [“From AIRs to RAPs - how PLONK-style arithmetization works,”](https://hackmd.io/@aztec-network/plonk-arithmetiization-air) technical blog post (comparing PLONKish arithmetization with AIR; title follows the published article).

## Suggested classroom questions

- Before Section 2.1, ask where circuit-specific information could be moved if it must be removed from the SRS. This motivates selector polynomials.
- Before introducing the permutation argument, invite students to discuss how to express consistent wiring—the same value used in several places—in polynomial language. Use this discussion to bridge to multiset equality.
- Ask what disadvantages might arise from adding too many custom gates, including tradeoffs in constraint degree, column count, proving cost, and verification cost, to develop a sense of design balance.
