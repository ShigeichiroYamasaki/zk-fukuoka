---
outline: [2, 3]
prev:
  text: Session 11 · Groth16
  link: /en/learn/session-11
next:
  text: Session 13 · STARK
  link: /en/learn/session-13
---

<script setup>
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
</script>

# Session 12: PLONK

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 27, 2026<br>
Last updated: October 7, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 12 in the syllabus](./#session-12) · [Session 12 exercises](../exercises/session-12)

## Context and learning objectives

Groth16 used circuit-specific keys and setup to obtain small proofs. When handling many circuits, how much of that preparation can be shared? Today we read PLONK as an answer. Circuit-specific information does not disappear; trace where it is placed instead.

The three learning objectives are:

1. Understand the motivation for universal setup (trusted setup independent of a particular circuit) and the arithmetization techniques that enable it.
2. Understand why the permutation argument, a method for verifying copy constraints, was introduced.
3. Understand how custom gates contribute to the expressiveness and efficiency of arithmetization.

---

## Mathematical prerequisites for reading PLONK

Before following the equations, review the tools in this order. This session combines them into checks for gate and wiring constraints.

<div class="captioned-table" id="table-12-prerequisites" role="group" aria-labelledby="table-caption-12-prerequisites">

<p class="table-caption" id="table-caption-12-prerequisites"><strong>Table 12-0: Mathematical prerequisites for PLONK</strong></p>

| Review | What to revisit | Role in PLONK |
| --- | --- | --- |
| [Session 1](./session-01#_5-a-formal-definition-of-interactive-proof-systems) | Completeness, soundness and probabilistic acceptance | Accept valid proofs and reject false constraint systems |
| [Session 3](./session-03#_2-basics-of-finite-fields) | Finite fields, interpolation, roots and vanishing polynomials, Schwartz–Zippel | Interpolate row values and bound random-check error |
| [Session 4](./session-04#_3-r1cs-rank-1-constraint-system) | Linear combinations, matrix form of R1CS and QAP | Represent constraints and understand how shared variables express wiring |
| [Session 7](./session-07#pairing-math) | Scalar field and pairings | Algebraic tool for verifying KZG evaluation openings |
| [Session 8](./session-08#_2-kzg-kate-commitments) | KZG commitments, openings and binding | Fix polynomials before opening selected evaluations |
| [Session 9](./session-09#_2-the-fiat–shamir-transform) | Fiat–Shamir, transcripts and ROM | Derive non-interactive challenges from the interactive protocol |

</div>

The route is: review the mathematical prerequisites; motivate reusable setup; check gate constraints row by row; enforce copy constraints while preserving positions; and consider custom gates for efficiency. Checking each gate equation and checking that values are wired to the right places are separate tasks.

In particular, copy constraints cannot be checked merely by observing that two value multisets match: the circuit's intended position mapping must be fixed and checked. Section 3 follows the position labels, permutation, random β and γ challenges, and grand product in sequence.

When an implementation proves integer additions, balances or ranges, distinguish field equality from integer equality. Field values may agree only modulo the field modulus, so constrain value ranges or bit decompositions and check that intermediate arithmetic does not wrap around the modulus. The [deposit/withdrawal R1CS example](../exercises/session-04#private) fixes amount ranges and makes the condition that the sum is below the modulus explicit.

---

## 1. The motivation for universal setup

### 1.1 Revisiting Groth16’s restriction

Groth16’s keys correspond to the circuit being proved. Changing an application’s circuit therefore requires preparing corresponding keys. A circuit-specific stage remains even where preparation can partly be shared. For frequent circuit updates, assess that preparation work alongside proof size.

### 1.2 Desired properties: universal and updatable

Separate two requirements: reuse one SRS across circuits, and avoid relying on a single setup participant. PLONK expresses them through the following properties.

- **Universal:** A single SRS can be reused for **any circuit** within a predetermined size bound.
- **Updatable:** Multiple participants can update the SRS sequentially. Provided updates are correctly verified and at least one honest participant securely erases their secret, the setup trapdoor remains unrecoverable. This extends the multi-party generation idea from Session 11 in a more flexible form.

PLONK separates a circuit-independent polynomial-commitment SRS from circuit-specific preprocessing. We focus on the original KZG-based construction and relate its arithmetization to later PLONKish extensions. A universal SRS still requires per-circuit preprocessing and proving/verification keys, but that preprocessing needs no new trusted ceremony involving fresh secrets.

---

## 2. PLONKish arithmetization

### 2.1 How the approach differs from QAPs

QAP in Session 4 expresses constraints through polynomial divisibility. QAP itself does not force a circuit-specific SRS; Groth16 chooses to encode circuit polynomials into its SRS. Separating the representation from how keys encode it helps locate PLONK’s change.

PLONK arranges gates in rows and uses **selector polynomials** to specify each row’s operation. Selectors and the wiring permutation are circuit-derived preprocessing data, bound into the verification key through commitments. The prover cannot choose them opportunistically. Separating a universal SRS from circuit-specific preprocessing does not remove the need to fix the circuit being verified.

### 2.2 The basic constraint

Let $\omega$ be a primitive $n$th root of unity in the field, and let $H=\{1,\omega,\dots,\omega^{n-1}\}$ be the gate evaluation domain. The polynomials $a,b,c$ interpolate left-input, right-input, and output columns. The polynomials $q_L,q_R,q_O,q_M,q_C$ are fixed selectors. Including a public-input polynomial $\mathrm{PI}(X)$, define

$$F(X)=q_L(X)a(X)+q_R(X)b(X)+q_O(X)c(X)+q_M(X)a(X)b(X)+q_C(X)+\mathrm{PI}(X)$$

The gate condition is **$F(x)=0$ for every $x\in H$**, not that $F(X)$ is identically zero at every field point.

At a row with zero public-input term, selector values $(q_L,q_R,q_O,q_M,q_C)=(0,0,-1,1,0)$ enforce $ab-c=0$, while $(1,1,-1,0,0)$ enforce $a+b-c=0$. These specify selector values at that row.

With the vanishing polynomial $Z_H(X)=\prod_{x\in H}(X-x)=X^n-1$, the condition becomes

$$F(X)=Z_H(X)T_{\mathrm{gate}}(X)$$

for a quotient polynomial $T_{\mathrm{gate}}(X)$. The full protocol combines this with copy constraints and checks polynomial relations using degree bounds and commitments. **Separating fixed circuit preprocessing from each proof's witness** lets a universal SRS support proofs of a specified circuit. See the [PLONK paper](https://eprint.iacr.org/2019/953).

<StudyDiagram id="12-1" en />

<div class="captioned-table" id="table-12-1" role="group" aria-labelledby="table-caption-12-1">

<p class="table-caption" id="table-caption-12-1"><strong>Table 12-1：Selectors choose the operation on the same columns</strong></p>

| Gate | q\_L | q\_R | q\_O | q\_M | q\_C | Row relation |
| --- | --- | --- | --- | --- | --- | --- |
| Addition | 1 | 1 | −1 | 0 | 0 | a+b−c=0 |
| Multiplication | 0 | 0 | −1 | 1 | 0 | ab−c=0 |

</div>

Basic-gate examples with the public-input term set to zero. The relation holds on gate rows, not necessarily at every field point. Public inputs and copy constraints must also be incorporated.

---

## 3. The permutation argument: copy constraints

### 3.1 Why it is needed: consistent wiring

Correct gate computations do not by themselves establish a correct circuit: a gate’s output might differ from the value used by another gate as input. R1CS shares variables $z_i$ to express this connection. In PLONK’s columns $a,b,c$, equality across positions must be checked. That is why copy constraints are needed.

### 3.2 The idea behind the permutation argument

Can wiring be checked merely by comparing multisets before and after reordering values? Any reordering preserves the multiset. The required property is **equality at the positions specified by the circuit**. We therefore combine values with position information.

PLONK assigns distinct labels to positions and fixes a circuit-dependent permutation $\sigma$ whose cycles connect positions that must share a value. Let $v_j$ be the value at position $j$ and $\mathrm{id}_j$ its label. After committing to the values, random challenges $\beta,\gamma$ are chosen to check

$$\prod_j\bigl(v_j+\beta\,\mathrm{id}_j+\gamma\bigr)=\prod_j\bigl(v_j+\beta\,\mathrm{id}_{\sigma(j)}+\gamma\bigr)$$

The left side encodes values with their original positions; the right side pairs the same values with permuted position labels. Correct copies satisfy the relation. For incorrect copies, polynomial-degree bounds control the probability of accidental equality under random challenges, connecting to Session 3's probabilistic polynomial checks.

PLONK uses a grand-product polynomial to handle the many factors, enforcing adjacent-row updates and boundary conditions. Checking only the final product would not suffice: the accumulation updates must also be constrained. See the [original permutation argument](https://eprint.iacr.org/2019/953) for the construction.

<StudyDiagram id="12-2" en />

<div class="captioned-table" id="table-12-2" role="group" aria-labelledby="table-caption-12-2">

<p class="table-caption" id="table-caption-12-2"><strong>Table 12-2：Copy constraints must bind specific positions</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. Specify positions that must agree | p₁ = a₁, p₂ = b₃, p₃ = c₅ |
| 2. Fix a permutation cycle | p₁ → p₂ → p₃ → p₁ |
| 3. Compare products binding values to positions | Check products of vⱼ + β·idⱼ + γ and vⱼ + β·idσ(j) + γ |

</div>

Example with three positions assigned to one variable. Values alone form the same multiset after any permutation; position labels and a circuit-fixed permutation are essential.

### 3.3 The broader significance of copy constraints

This check concerns the correspondence between values in separate locations. Similar questions arise beyond circuit wiring whenever a value must be used consistently in several places. Understand permutation arguments through the consistency they establish, not only as a PLONK term.

### 3.4 Budgeting the total error probability

A proof may use several checks: gate constraints, copy constraints, and quotient-polynomial evaluations, for example. Let $E_i$ be the event that check $i$ falsely accepts, and let its applicable bound be $\epsilon_i$. The union bound gives

$$\Pr\left[\bigcup_i E_i\right]\le\sum_i\epsilon_i$$

This bound does not require independence. For example, if each of four checks is bounded by $10^{-6}$, the total is at most $4\times10^{-6}$. Each individual bound still has to satisfy its own assumptions. With Fiat–Shamir, in particular, verify that the analysis applies to challenges derived after the prior commitments are fixed.

Repeating one check to obtain $\epsilon^k$ is a different argument. Fresh challenges and conditional false-acceptance bounds after prior results are needed; do not multiply probabilities without establishing the conditions. See [Session 6 on soundness amplification](./session-06#_3-general-principles-of-soundness-amplification).

---

## 4. The significance of custom gates

### 4.1 Motivation: making common patterns more efficient

Expressibility with basic gates does not guarantee implementation efficiency. Repeated elliptic-curve operations or hash rounds repeat the same small operation patterns. Could a frequent pattern be expressed directly as one constraint?

**Custom gates** directly define common complex operation patterns using dedicated selector polynomials and constraints. For example, an application-specific gate can combine several multiplications and additions in a single gate.

### 4.2 Expressiveness and efficiency

The aim is not only to express a computation, but to reduce the rows and operations needed to do so. A relation already expressible with basic gates may admit a representation requiring less prover work. Add this practical question of representation efficiency to Session 2’s expressiveness axis.

Custom gates should be understood as PLONKish extensions. Fewer rows need not mean lower cost if constraint degree, column count, or opened evaluations increase. Adding gate types does not automatically enlarge the SRS; the required degree bound and commitment scheme also matter.

---

## 5. Revisiting the map from Session 10

Review where circuit-specific information is fixed, which relations are checked, and how interaction is removed. Session 10’s three stages organize these choices as follows.

- **Polynomial IOP design:** Gate constraints, public inputs, and copy constraints for fixed selectors and wiring are checked using degree-bounded polynomial relations and random challenges.
- **Implementation:** KZG commitments (Session 8) enable efficient verification of these relations at evaluation points. The shared tool with Groth16 is pairings; Groth16 does not itself incorporate KZG. PLONKish derivatives can use FRI or other commitments, but changes require revisiting the protocol and security analysis. Distinguish their setup and performance properties from original PLONK.
- **Non-interactivity:** The Fiat–Shamir transform (Session 9) makes the protocol non-interactive. Unlike Groth16, PLONK is first designed as an interactive IOP and then made non-interactive, following the Session 10 map more directly.

Universal, updatable SRS with a fixed capacity

<StudyDiagram id="12-3" en />

<div class="captioned-table" id="table-12-3" role="group" aria-labelledby="table-caption-12-3">

<p class="table-caption" id="table-caption-12-3"><strong>Table 12-3：Shared SRS versus circuit-specific information</strong></p>

| Item | Explanation |
| --- | --- |
| Circuit A | Preprocess selectors and wiring<br>Corresponding proving and verification keys |
| Circuit B | Preprocess different selectors and wiring<br>Corresponding proving and verification keys |

</div>

Sharing the SRS does not remove binding to the circuit

Universality is bounded, for example by degree. KZG-based PLONK uses both trusted setup and Fiat–Shamir. Custom-gate efficiency also depends on degree and column count.

---

## Summary and next session

Today we read PLONK as reducing preparation for circuit changes. Review which parts can be shared and which remain fixed per circuit.

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

---

## Session 12 exercise

Check the lecture concepts with calculations and concrete examples in the [Session 12 exercise](../exercises/session-12).
