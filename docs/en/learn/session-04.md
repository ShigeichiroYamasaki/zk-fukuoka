---
outline: [2, 3]
prev:
  text: Session 3 · Finite fields, polynomials, and probabilistic checking
  link: /en/learn/session-03
next:
  text: Session 5 · Error-correcting codes and information theory (syllabus)
  link: /en/learn/#session-5
---

# Session 4: Arithmetization techniques and complexity theory

::: info Lecture manuscript
An English translation of the supplied Japanese manuscript for Session 4.
:::

[Session index](./sessions) · [Topic index](./topics) · [Session 4 in the syllabus](./#session-4) · [Exercises](../exercises/)

## Context and learning objectives

In the previous session, the Schwartz–Zippel lemma helped us understand how polynomials can represent large amounts of information with short descriptions and support efficient probabilistic checking. Today we study **arithmetization**: techniques for **translating general computation itself** into the language of polynomials.

Our three objectives are:

1. Learn to view general computation, or NP relations, as constraint satisfaction problems.
2. Understand three representative arithmetization techniques: R1CS, QAP, and AIR.
3. Understand the complexity-theoretic justification for this translation through the Cook–Levin theorem and its relationship to circuit complexity classes such as NC and P.

This session turns the shift identified in Session 2—from using a group homomorphism to translating computation itself into polynomials—into concrete techniques.

---

## 1. What is arithmetization? — Revisiting the motivation

As we saw in Session 2, general NP relations do not inherently provide a structure corresponding to the group homomorphism used in Schnorr's protocol. Computation consists of branches, loops, and comparisons, which cannot be treated algebraically as they stand.

Arithmetization **transforms a claim that a computation produces a particular output on a particular input into a system of constraints on polynomials, or on their evaluations**. Once this translation is available, we can apply tools from the previous session, including probabilistic checking through the Schwartz–Zippel lemma.

The three techniques we study today—R1CS, QAP, and AIR—are different implementations of the same translation: computation → polynomial constraints.

---

## 2. Complexity-theoretic background: the Cook–Levin theorem

### 2.1 Why this theorem underpins arithmetization

The Cook–Levin theorem from complexity theory, dating to 1971, provides the justification for arithmetization:

> **Cook–Levin theorem:** CircuitSAT, the problem of determining whether a Boolean circuit is satisfiable, is NP-complete.

This means that **any NP relation can be transformed into a Boolean circuit satisfiability problem by a polynomial-time reduction**. In other words, the claim “I know an input x such that running this program produces y” can, without losing generality, be reduced to “I know an input satisfying this circuit.”

The theorem justifies concentrating the design of arithmetization techniques on one task: translating circuits, or comparable computation models, into polynomial constraints. There is no need to create a separate proof system for each individual program.

### 2.2 Connections to circuit complexity classes

Circuit size and depth correspond to complexity classes. In particular:

- **NC (Nick's Class):** computations performed by polynomial-size circuits of logarithmic depth, closely associated with parallel computation.
- **P:** computations performed in polynomial time; in circuit terms, polynomial-size circuits without a depth restriction.

When discussing the efficiency of a proof system, especially the prover's computation cost, whether the computation belongs to NC or P has practical significance. For example, AIR-based arithmetization in STARKs uses execution traces, making it natural for deep sequential computations across P, while circuit-based R1CS can directly represent arbitrary circuit structures. We will revisit this difference when comparing the design philosophies of STARKs and SNARKs.

*(We will not explore the detailed NC/P hierarchy here. The goal is to build the intuition that the appropriate translation technique depends on the computation model being arithmetized.)*

---

## 3. R1CS: Rank-1 Constraint System

### 3.1 Definition

An R1CS represents computation using a variable vector $\mathbf{z} = (1, x_1, \dots, x_n, w_1, \dots, w_m)$, combining public inputs and witnesses, and a triple of matrices $(A, B, C)$ with constraints

$$(A \mathbf{z}) \circ (B \mathbf{z}) = (C \mathbf{z}).$$

Each row corresponds to one constraint, and $\circ$ denotes the elementwise product.

### 3.2 Why “rank-1”? A concrete example

Each constraint states that the product of two linear combinations equals another linear combination. For example, a multiplication gate $z_3 = z_1 \cdot z_2$ corresponds directly to one row of an R1CS. Addition and multiplication by constants can be absorbed into the linear combinations, so constraints are essentially needed only for multiplication.

**Connection to circuits:** Any Boolean or arithmetic circuit can be translated gate by gate into R1CS constraints. The Cook–Levin theorem reduces any NP relation to a circuit, giving the chain of reductions from any NP relation to R1CS.

### 3.3 A worked exercise

On the board, work through the classic example of converting “I know an $x$ satisfying $x^3 + x + 5 = 35$” into an R1CS, with $x=3$. Introduce intermediate variables and construct constraints for the multiplication gates to make the translation concrete.

---

## 4. QAP: Quadratic Arithmetic Program

### 4.1 From R1CS to QAP

R1CS is a linear-algebraic representation using matrices and vectors. A QAP translates it into the language of **polynomials**, encoding each R1CS row, or constraint, as values at a particular evaluation point.

Specifically, use Lagrange interpolation from Session 3 to turn each column of the R1CS matrices $A, B, C$ into polynomials $A_i(X), B_i(X), C_i(X)$. Then express simultaneous satisfaction of all R1CS constraints through polynomial divisibility:

$$\left(\sum_i z_i A_i(X)\right) \left(\sum_i z_i B_i(X)\right) - \left(\sum_i z_i C_i(X)\right) = H(X) \cdot Z(X).$$

Here, $Z(X)$ is the polynomial whose roots are the constraint evaluation points.

### 4.2 Why this transformation matters

In R1CS, we had to check **many** conditions, one for each row. A QAP combines them into **one** condition: divisibility of a polynomial. This puts the claim into a form that can be checked with high probability by evaluation at a random point using the Schwartz–Zippel lemma. This is the first concrete application of the tools developed in Session 3.

---

## 5. AIR: Algebraic Intermediate Representation

### 5.1 A different starting point from R1CS/QAP

R1CS/QAP directly represents circuit structure, while AIR starts from a **computation's execution trace**. For a sequential computation, such as a loop repeating the same operation, arrange the state at each step in a table called a trace table.

### 5.2 Transition and boundary constraints

AIR imposes two types of constraints:

- **Transition constraints:** polynomial relations that must hold between consecutive trace rows—for example, that the next value is the square of the previous value.
- **Boundary constraints:** required values at particular rows, such as the initial or final state.

Interpolate each trace column to represent the trace as polynomials, again using Lagrange interpolation from Session 3. Transition constraints then become polynomial relations between adjacent evaluation points.

### 5.3 Understanding AIR through comparison with R1CS/QAP

Both approaches serve the same purpose of arithmetization, but R1CS/QAP uses individual circuit gates as its units, while AIR uses state transitions over time steps. In Act III, we will contrast these ideas in STARKs, based on AIR, and Groth16/PLONK, based on R1CS/QAP, with PLONK using its own custom-gate approach.

---

## Recap and next session

Today we studied:

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
