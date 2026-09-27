---
outline: [2, 3]
prev:
  text: Session 3 · Finite fields, polynomials, and probabilistic checking
  link: /en/learn/session-03
next:
  text: Session 5 · Error-correcting codes and information theory
  link: /en/learn/session-05
---

<script setup>
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
</script>

# Session 4: Arithmetization techniques and complexity theory

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 27, 2026

[Session index](./sessions) · [Topic index](./topics) · [Session 4 in the syllabus](./#session-4) · [Exercises](../exercises/)

## Context and learning objectives

Last time, we learned to test polynomial identities at random points. What must we prepare to apply that test to a program’s execution? Today we study **arithmetization: translating general computation into polynomial constraints**. Compare R1CS, QAP, and AIR by asking what we will verify after the translation.

Our three objectives are:

1. Learn to view general computation, or NP relations, as constraint satisfaction problems.
2. Understand three representative arithmetization techniques: R1CS, QAP, and AIR.
3. Understand the complexity-theoretic justification for this translation through the Cook–Levin theorem and its relationship to circuit complexity classes such as NC and P.

This session turns the shift identified in Session 2—from using a group homomorphism to translating computation itself into polynomials—into concrete techniques.

---

## 1. What is arithmetization? — Revisiting the motivation

Programs include branches, loops, and comparisons. Schnorr’s verification equation from Session 2 need not apply directly to such descriptions. First identify which values must satisfy which conditions for the computation to be correct.

Arithmetization expresses the computation from input to output as constraints that include intermediate values. The translation must make satisfying assignments correspond to valid executions. **The goal is not merely to write equations, but to check execution correctness through their satisfaction.** Conditions such as degree and value ranges must survive the translation.

The three techniques we study today—R1CS, QAP, and AIR—are different implementations of the same translation: computation → polynomial constraints.

---

## 2. Complexity-theoretic background: the Cook–Levin theorem

### 2.1 Why this theorem underpins arithmetization

Can the same approach handle general NP problems, rather than just one program? The background is the Cook–Levin theorem establishing NP-completeness of SAT. Here we reason using the corresponding NP-completeness of CircuitSAT.

> **Cook–Levin theorem:** CircuitSAT, the problem of determining whether a Boolean circuit is satisfiable, is NP-complete.

This means that **any NP relation can be transformed into a Boolean circuit satisfiability problem by a polynomial-time reduction**. In other words, the claim “I know an input x such that running this program produces y” can, without losing generality, be reduced to “I know an input satisfying this circuit.”

The theorem justifies concentrating the design of arithmetization techniques on one task: translating circuits, or comparable computation models, into polynomial constraints. There is no need to create a separate proof system for each individual program.

### 2.2 Connections to circuit complexity classes

Circuit size and depth correspond to complexity classes. In particular:

- **NC (Nick's Class):** computations performed by uniform polynomial-size circuit families of polylogarithmic depth, closely associated with parallel computation.
- **P:** computations performed in polynomial time; equivalently, polynomial-size circuit families with suitable uniformity and no depth restriction.

A complexity class does not directly determine an implementation speed ranking. Separate parts that parallelize readily from parts waiting for preceding state, then ask whether wiring or a sequence of states is the more useful representation.

Also check uniformity of circuit families. NC normally permits polylogarithmic depth, and correspondence with P uses uniform families. Polynomial-size circuits without uniformity define P/poly. For implementation choices, inspect a computation’s actual depth, width, and repetition pattern rather than relying only on a class name. AIR arranges states over time; R1CS arranges constraints between variables. Which representation is convenient depends on the computation.

---

## 3. R1CS: Rank-1 Constraint System

### 3.1 Definition

First collect the intermediate values as variables. Let $\mathbf{z}=(1,x_1,\dots,x_n,w_1,\dots,w_m)$ include the constant one, public inputs, and witness. R1CS imposes the following condition using three matrices $(A,B,C)$.

$$(A \mathbf{z}) \circ (B \mathbf{z}) = (C \mathbf{z}).$$

Read this equation row by row. Since $\circ$ is entrywise multiplication, each row requires that the product of two linear combinations equal a third. Choosing the matrices specifies how the variables are combined for checking.

### 3.2 Why “rank-1”? A concrete example

For $z_3=z_1\cdot z_2$, select $z_1$ and $z_2$ in the two input linear combinations and $z_3$ in the result. The quadratic part comes from an outer product of two coefficient vectors, explaining “Rank-1.” Addition and constant multiplication can be absorbed into linear combinations, but equalities for separately stored values and output conditions still need constraints where required.

Also check the **circuit correspondence**. Multiplication gates fit this constraint form, while addition uses linear combinations. Boolean circuits represented over a field also need values constrained to zero or one. Translating input, intermediate, and output conditions as well as gate equations preserves the correspondence with circuit satisfiability.

### 3.3 A worked exercise

Use the relation “I know $x$ satisfying $x^3+x+5=35$.” Rather than only substituting $x=3$, name intermediate values such as its square and cube, and write down which relationships must be checked. Include the final output condition of 35 to work through the full translation from computation to constraints.

<StudyDiagram id="04-1" :en="true" />

---

## 4. QAP: Quadratic Arithmetic Program

### 4.1 From R1CS to QAP

R1CS represents constraints as matrix rows. Now assign distinct evaluation points to the rows and represent each column by a polynomial. Moving to QAP means reading the same constraints as polynomial evaluations. This is where Session 3’s Lagrange interpolation is needed.

Specifically, use Lagrange interpolation from Session 3 to turn each column of the R1CS matrices $A, B, C$ into polynomials $A_i(X), B_i(X), C_i(X)$. Then express simultaneous satisfaction of all R1CS constraints through polynomial divisibility:

$$\left(\sum_i z_i A_i(X)\right) \left(\sum_i z_i B_i(X)\right) - \left(\sum_i z_i C_i(X)\right) = H(X) \cdot Z(X).$$

Here, $Z(X)$ is the polynomial whose roots are the constraint evaluation points.

### 4.2 Why this transformation matters

The computation to be checked has not changed; the form of the check has. Vanishing at every constraint point becomes divisibility by a vanishing polynomial. With degree bounds, including on the quotient, and fixed polynomials, one can test this relation at a random point. Combining conditions into one equation is a step toward a proof system, not the entire security argument.

<StudyDiagram id="04-2" :en="true" />

---

## 5. AIR: Algebraic Intermediate Representation

### 5.1 A different starting point from R1CS/QAP

The same computation can also be recorded as states over time. For a loop, arrange the values before and after each iteration in a table. AIR starts from this **execution trace**. Instead of following gate wiring, check that one state transitions correctly to the next.

### 5.2 Transition and boundary constraints

AIR imposes two types of constraints:

- **Transition constraints:** polynomial relations that must hold between consecutive trace rows—for example, that the next value is the square of the previous value.
- **Boundary constraints:** required values at particular rows, such as the initial or final state.

Separate the roles of the two constraints. Correct transitions do not establish the intended computation if the starting or ending state is wrong. Interpolating columns turns both relations between adjacent times and values at specified times into polynomial conditions. Session 3’s interpolation again connects tables to polynomials.

<StudyDiagram id="04-3" :en="true" />

### 5.3 Understanding AIR through comparison with R1CS/QAP

R1CS/QAP and AIR pursue the same goal but choose different units of computation. The former emphasizes variables and gates; the latter emphasizes states and transitions. In Act III, compare Groth16’s QAP, PLONK’s own gate and copy constraints, and representative AIR-based STARKs. Do not classify PLONK itself as an R1CS/QAP construction.

---

## Recap and next session

Today we expressed the same computation through different constraints. Review what the translation preserved and what became easier to check.

- How the Cook–Levin theorem reduces any NP relation to circuit satisfiability, justifying arithmetization without loss of generality.
- R1CS: representing circuit gates as linear-algebraic constraints.
- QAP: combining R1CS constraints into a single polynomial divisibility condition, putting the Schwartz–Zippel lemma to work.
- AIR: arithmetizing execution traces through transition and boundary constraints, with a natural fit for sequential computation.

In Session 5, we examine how to treat these polynomial representations as codes and make them robust to errors. We introduce Reed–Solomon error-correcting codes and information-theoretic perspectives, including the Shannon and Hamming bounds.

---

## References and further reading

- Cook, “[The Complexity of Theorem-Proving Procedures](https://www.cs.utoronto.ca/~sacook/homepage/1971.pdf),” STOC 1971 — author-hosted PDF.
- Gennaro, Gentry, Parno, Raykova, “[Quadratic Span Programs and Succinct NIZKs without PCPs](https://eprint.iacr.org/2012/215),” EUROCRYPT 2013 (the original QAP paper) — public IACR ePrint version, 2012/215; [PDF](https://eprint.iacr.org/2012/215.pdf).
- Ben-Sasson et al., “[Scalable, transparent, and post-quantum secure computational integrity](https://eprint.iacr.org/2018/046),” 2018 (a systematic formulation of AIR) — IACR ePrint; [PDF](https://eprint.iacr.org/2018/046.pdf).

## Suggested classroom questions

- Have students introduce intermediate variables and perform the R1CS conversion in Section 3.3 themselves to gain practical experience with arithmetization.
- Ask why multiplication needs constraints while addition does not, to develop their understanding of linear combinations and nonlinearity.
- After presenting AIR transition constraints, ask why AIR feels more natural even though the same computation could be expressed in R1CS. Use this to explore the difference in design philosophy.
