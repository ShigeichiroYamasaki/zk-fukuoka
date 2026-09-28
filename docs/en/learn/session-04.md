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
import ArithmetizationOverview from "../../.vitepress/theme/ArithmetizationOverview.vue";
</script>

# Session 4: Arithmetization techniques and complexity theory

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 28, 2026

[Session index](./sessions) · [Topic index](./topics) · [Session 4 in the syllabus](./#session-4) · [Exercises](../exercises/)

::: tip Prerequisite terms
New to NP relations, circuits or constraints? Open the [Session 4 term guide](./terms/). Each of its eight explanations includes a worked example and a self-check. Links in the lecture also lead directly to the relevant page.
:::

[Worked example: balanced deposits and withdrawals → R1CS, QAP and AIR](./balance-arithmetization) — matrices, interpolated polynomials, traces and a runnable Python example.

## Context and learning objectives

Last time, we learned to test polynomial identities at random points. What must we prepare to apply that test to a program’s execution? Today we study **arithmetization: translating general computation into polynomial constraints**. Compare R1CS, QAP, and AIR by asking what we will verify after the translation.

Our three objectives are:

1. Learn to view general computation, or [NP relations](./terms/np-relations), as [constraint satisfaction problems](./terms/constraints).
2. Understand three representative arithmetization techniques: R1CS, QAP, and AIR.
3. Understand the complexity-theoretic justification for this translation through the Cook–Levin theorem and its relationship to circuit complexity classes such as NC and P.

This session turns the shift identified in Session 2—from using a group homomorphism to translating computation itself into polynomials—into concrete techniques.

---

## 1. What is arithmetization? — Revisiting the motivation

Programs include branches, loops, and comparisons. Schnorr’s verification equation from Session 2 need not apply directly to such descriptions. First identify which values must satisfy which conditions for the computation to be correct.

Arithmetization expresses the computation from input to output as constraints that include intermediate values. The translation must make satisfying assignments correspond to valid executions. **The goal is not merely to write equations, but to check execution correctness through their satisfaction.** Conditions such as degree and value ranges must survive the translation.

The three techniques we study today—R1CS, QAP, and AIR—are different implementations of the same translation: computation → polynomial constraints.

The diagram first expresses the existence of a valid private input and execution, for fixed public input and output, as circuit satisfiability. It then translates the circuit conditions into finite-field constraints. Distinguish this Boolean-circuit reduction from arithmetization, and checking an assignment from finding one.

<ArithmetizationOverview :en="true" />

---

## 2. Complexity-theoretic background: the Cook–Levin theorem

### 2.1 Why this theorem underpins arithmetization

Can the same approach handle general NP problems, rather than just one program? The background is the Cook–Levin theorem establishing NP-completeness of SAT. Here we reason using the corresponding NP-completeness of CircuitSAT.

> **Circuit formulation corresponding to Cook–Levin:** [CircuitSAT](./terms/reductions), the problem of determining whether a [Boolean circuit](./terms/circuits) is satisfiable, is NP-complete.

NP-completeness concerns decision-problem reductions. To prove knowledge of a witness, also check how witnesses correspond. Expanding the polynomial-time verifier for an NP relation $R(x,w)$ into a circuit and fixing public input $x$ gives $C_x(w)=1$ exactly when $R(x,w)=1$. Introducing variables for intermediate values gives a satisfying assignment for the accepting computation. This explicit correspondence supports the translation into constraints.

The theorem justifies concentrating the design of arithmetization techniques on one task: translating circuits, or comparable computation models, into polynomial constraints. There is no need to create a separate proof system for each individual program.

### 2.2 Connections to circuit complexity classes

[Circuit size and depth](./terms/complexity) correspond to complexity classes. In particular:

- **NC (Nick's Class):** computations performed by uniform polynomial-size circuit families of polylogarithmic depth, closely associated with parallel computation.
- **P:** computations performed in polynomial time; equivalently, polynomial-size circuit families with suitable uniformity and no depth restriction.

A complexity class does not directly determine an implementation speed ranking. Separate parts that parallelize readily from parts waiting for preceding state, then ask whether wiring or a sequence of states is the more useful representation.

Also check uniformity of circuit families. NC normally permits polylogarithmic depth, and correspondence with P uses uniform families. Polynomial-size circuits without uniformity define P/poly. For implementation choices, inspect a computation’s actual depth, width, and repetition pattern rather than relying only on a class name. AIR arranges states over time; R1CS arranges constraints between variables. Which representation is convenient depends on the computation.

---

## 3. R1CS: Rank-1 Constraint System

### 3.1 Definition

First collect the intermediate values as variables. Let $\mathbf{z}=(1,x_1,\dots,x_n,w_1,\dots,w_m)$ include the constant one, [public inputs and witness](./terms/np-relations). R1CS imposes the following condition using three matrices $(A,B,C)$.

$$(A \mathbf{z}) \circ (B \mathbf{z}) = (C \mathbf{z}).$$

Read this equation row by row. Since $\circ$ is entrywise multiplication, each row requires that the product of two [linear combinations](./terms/linear-algebra) equal a third. Choosing the matrices specifies how the variables are combined for checking.

**Specify the field and dimensions.** Let $K=\mathbb F_p$, let $N=1+n+m$ be the number of coordinates, and let $M$ be the number of constraints. The assignment $\mathbf z\in K^N$ is a column vector and $A,B,C\in K^{M\times N}$. All three matrix products therefore have $M$ entries. More precisely, the ordering above is written $(1,x_1,\dots,x_n,w_1,\dots,w_m)^T$.

Write the rows as $a_i^T,b_i^T,c_i^T$, with coefficient column vectors in $K^N$. Define the dot product by

$$\langle a_i,\mathbf z\rangle=a_i^T\mathbf z=\sum_{j=0}^{N-1}a_{ij}z_j.$$

Each constraint is

$$\langle a_i,\mathbf z\rangle\langle b_i,\mathbf z\rangle-\langle c_i,\mathbf z\rangle=0\qquad(1\le i\le M).$$

This dot product is a sum of products over a finite field, not a measure of real-vector lengths or angles. Fixing $z_0=1$ lets us represent affine expressions such as $5+x+s$ by $(5,1,0,1,0)\mathbf z$. The constant coordinate must not be freely chosen.

Each matrix multiplication is linear, but multiplying the resulting entries makes **R1CS a system of polynomial equations of degree at most two, not a system of linear equations**. Its solution set need not be a vector subspace, and Gaussian elimination alone does not generally solve it.

### 3.2 Why “rank-1”? A concrete example

For $z_3=z_1\cdot z_2$, select $z_1$ and $z_2$ in the two input linear combinations and $z_3$ in the result. The quadratic part comes from an outer product of two coefficient vectors, explaining “Rank-1.” Addition and constant multiplication can be absorbed into linear combinations, but equalities for separately stored values and output conditions still need constraints where required.

Also check the **circuit correspondence**. Multiplication gates fit this constraint form, while addition uses linear combinations. Boolean circuits represented over a field also need values constrained to zero or one. Translating input, intermediate, and output conditions as well as gate equations preserves the correspondence with circuit satisfiability.

To see the outer-product explanation algebraically, write

$$(a_i^T\mathbf z)(b_i^T\mathbf z)=\mathbf z^TQ_i\mathbf z,\qquad Q_i=a_i b_i^T.$$

Column $j$ of $Q_i$ is $b_{ij}a_i$, a multiple of one vector. Thus $\operatorname{rank}Q_i\le1$, with equality when both vectors are nonzero. **Rank-1 refers to this factorized left-hand side of each constraint, not to the ranks of the entire matrices $A,B,C$.** The matrix $Q_i$ need not be symmetric. If the right-hand side is also absorbed into a quadratic form using the constant coordinate, that whole coefficient matrix need not have rank one.

A linear equality $u+v=t$ fits as $(u+v)\cdot1=t$. A Boolean coordinate can be constrained by $b(b-1)=0$: since a field has no zero divisors, this is equivalent to $b\in\{0,1\}$.

### 3.3 A worked exercise

Use the relation “I know $x$ satisfying $x^3+x+5=35$.” Rather than only substituting $x=3$, name intermediate values such as its square and cube, and write down which relationships must be checked. Include the final output condition of 35 to work through the full translation from computation to constraints.


Work over $K=\mathbb F_{101}$ and set $t=x^2$, $s=tx$, and $y=s+x+5$. Take $y=35$ as the public input and $(x,t,s)$ as the witness. For readability, reorder the coordinates as $\mathbf z=(1,x,t,s,y)^T$. Coordinate order is a convention, but the proof system must fix which coordinates are public.

$$
A=\begin{pmatrix}0&1&0&0&0\\0&0&1&0&0\\5&1&0&1&0\end{pmatrix},\quad
B=\begin{pmatrix}0&1&0&0&0\\0&1&0&0&0\\1&0&0&0&0\end{pmatrix},\quad
C=\begin{pmatrix}0&0&1&0&0\\0&0&0&1&0\\0&0&0&0&1\end{pmatrix}.
$$

The three rows correspond to constraints and the five columns to coordinates. Multiplication gives

$$A\mathbf z=\begin{pmatrix}x\\t\\5+x+s\end{pmatrix},\quad
B\mathbf z=\begin{pmatrix}x\\x\\1\end{pmatrix},\quad
C\mathbf z=\begin{pmatrix}t\\s\\y\end{pmatrix}.$$

The rows encode $x\cdot x=t$, $t\cdot x=s$, and $(5+x+s)\cdot1=y$. For $\mathbf z=(1,3,9,27,35)^T$,

$$\begin{pmatrix}3\\9\\35\end{pmatrix}\circ\begin{pmatrix}3\\3\\1\end{pmatrix}
=\begin{pmatrix}9\\27\\35\end{pmatrix}=C\mathbf z.$$

Changing only $t$ to 8 produces the residual

$$\mathbf r(\mathbf z)=(A\mathbf z)\circ(B\mathbf z)-C\mathbf z
=\begin{pmatrix}1\\-3\\0\end{pmatrix}
=\begin{pmatrix}1\\98\\0\end{pmatrix}\ne\mathbf0.$$

This identifies which relationships fail when an intermediate value is changed.

Here $y=35$ is fixed as the statement's public input. If $y$ were freely chosen, these three rows would not enforce output 35. A design hardcoding that output can add $(y-35)\cdot1=0$. These equations are over a finite field; integer applications such as balances additionally need range and wraparound analysis, as in the [deposit/withdrawal example](./balance-arithmetization).

<span id="figure-04-1"></span>
<span id="caption-04-1"></span>

<div class="captioned-table" id="table-04-3" role="group" aria-labelledby="table-caption-04-3">

<p class="table-caption" id="table-caption-04-3"><strong>Table 04-3：Split x³+x+5=35 into constraints on intermediate values</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. Square | u = x × x → u = 9 |
| 2. Cube | v = u × x → v = 27 |
| 3. Constrain the output | (v + x + 5) × 1 = 35 |

</div>

Worked example with x=3. Addition and the output condition must also hold. Each relation is written as a product of linear combinations in R1CS.

[Follow the deposit/withdrawal example: R1CS](./balance-arithmetization#r1cs)

### 3.4 Checking cost and the bridge to QAP {#r1cs-linear-algebra}

Given the matrices and an assignment, compute three matrix products and $M$ products and differences to check whether the residual is zero. Dense matrices require $O(MN)$ field operations. Circuit matrices are often sparse because each gate references few variables. If the three matrices contain $s_0$ nonzero entries in total, sparse checking takes $O(s_0+M)$ field operations. This is assignment-checking cost, not witness-search cost or SNARK verification cost.

QAP preserves the correspondence **rows are constraints, columns are variables**. Assign distinct points $r_i$ to rows and interpolate each column so that $A_j(r_i)=A_{ij}$. Then

$$\mathcal A(X)=\sum_j z_jA_j(X)\quad\Longrightarrow\quad
\mathcal A(r_i)=\sum_j A_{ij}z_j=(A\mathbf z)_i.$$

Polynomial evaluations reproduce the entries of the matrix product. Doing the same for $B,C$ turns zero residuals into vanishing of $\mathcal A\mathcal B-\mathcal C$ at every constraint point. This is the bridge from linear-algebra notation to divisibility in a polynomial ring.


---

## 4. QAP: Quadratic Arithmetic Program

### 4.1 From R1CS to QAP

::: tip Prerequisites for QAP
Review division with remainder, the factor theorem, vanishing polynomials, and quotient degree bounds in [Session 3, Section 3.4](./session-03#qap-polynomial-prerequisites). Start at Section 3.1 for the distinction between a field and a polynomial ring.
:::

R1CS represents constraints as matrix rows. Now assign distinct evaluation points to the rows and represent each column by a polynomial. Moving to QAP means reading the same constraints as polynomial evaluations. This is where Session 3’s [Lagrange interpolation](./terms/polynomials) is needed.

Specifically, use Lagrange interpolation from Session 3 to turn each column of the R1CS matrices $A, B, C$ into polynomials $A_i(X), B_i(X), C_i(X)$. Then express simultaneous satisfaction of all R1CS constraints through [polynomial divisibility](./terms/polynomials):

$$\left(\sum_i z_i A_i(X)\right) \left(\sum_i z_i B_i(X)\right) - \left(\sum_i z_i C_i(X)\right) = H(X) \cdot Z(X).$$

Here, $Z(X)$ is the polynomial whose roots are the constraint evaluation points.

### 4.2 Why this transformation matters

The computation to be checked has not changed; the form of the check has. Vanishing at every constraint point becomes divisibility by a vanishing polynomial. With degree bounds, including on the quotient, and fixed polynomials, one can test this relation at a random point. Combining conditions into one equation is a step toward a proof system, not the entire security argument.

<span id="figure-04-2"></span>
<span id="caption-04-2"></span>

<div class="captioned-table" id="table-04-4" role="group" aria-labelledby="table-caption-04-4">

<p class="table-caption" id="table-caption-04-4"><strong>Table 04-4：R1CS to QAP: row checks become divisibility</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. R1CS rows | For each row j: A(z)ⱼ B(z)ⱼ = C(z)ⱼ |
| 2. Assign evaluation points | Interpolate columns at distinct points rⱼ |
| 3. One polynomial relation | A(X)B(X) − C(X) = H(X)Z(X)<br>Z(X) = ∏ⱼ(X − rⱼ) |

</div>

Divisibility alone is not a cryptographic proof. Degree bounds and guarantees tying evaluations to fixed polynomials are also needed.

[Follow the deposit/withdrawal example: QAP](./balance-arithmetization#qap)

### 4.3 Computing interpolation and divisibility {#qap-worked-math}

Keep the matrices from Section 3, work over $K=\mathbb F_{101}$, and assign the three constraints points $r_1=1,r_2=2,r_3=3$. All identities below are in $K[X]$. The Lagrange basis is

$$L_1(X)=\frac{(X-2)(X-3)}2,\quad L_2(X)=-(X-1)(X-3),\quad L_3(X)=\frac{(X-1)(X-2)}2.$$

Here $L_i(r_k)$ equals 1 for $i=k$ and 0 otherwise, and $1/2$ is the field element 51. Interpolate each column as

$$A_j(X)=\sum_{i=1}^3 A_{ij}L_i(X),$$

and likewise for $B,C$. Column 0 of $A$ is $(0,0,5)^T$, so $A_0=5L_3$; column 1 is $(1,0,1)^T$, so $A_1=L_1+L_3$. **Column interpolation uses circuit coefficients; the witness-dependent linear combination comes afterward.**

For the valid assignment $\mathbf z=(1,3,9,27,35)^T$, the matrix products are $(3,9,35)^T$, $(3,3,1)^T$, and $(9,27,35)^T$. Thus

$$\begin{aligned}
\mathcal A(X)&=\sum_{j=0}^4z_jA_j(X)=3L_1+9L_2+35L_3=10X^2+77X+17,\\
\mathcal B(X)&=3L_1+3L_2+L_3=100X^2+3X+1,\\
\mathcal C(X)&=9L_1+27L_2+35L_3=96X^2+33X+82.
\end{aligned}$$

With vanishing polynomial

$$Z(X)=(X-1)(X-2)(X-3)=X^3+95X^2+11X+95,$$

multiplication and division give

$$\mathcal A(X)\mathcal B(X)-\mathcal C(X)=(91X+95)Z(X).$$

The quotient is $H(X)=91X+95$, with zero remainder. This expresses simultaneous satisfaction of all three rows.

Why is this equivalent? Write $P=\mathcal A\mathcal B-\mathcal C$. Its value $P(r_i)$ equals the residual of R1CS row $i$. If every residual vanishes, the factor theorem gives $(X-r_i)\mid P$. Distinct points make these factors relatively prime, so their product $Z$ divides $P$. Conversely, divisibility implies zero residual at every constraint point.

For the invalid assignment $(1,3,8,27,35)^T$, we instead obtain $P(1)=1$ and $P(2)=98$. No polynomial $H$ can satisfy the identity. Writing a rational function $P/Z$ is not the same as polynomial divisibility.

### 4.4 Degree bounds and probabilistic checking {#qap-degree-bounds}

For $M\ge2$ constraints, all interpolated columns and $\mathcal A,\mathcal B,\mathcal C$ have degree at most $M-1$. Therefore $\deg P\le2M-2$ and $\deg Z=M$. A nonzero quotient has degree at most $M-2$. The zero polynomial is also permitted. Our $M=3$ example accordingly has a linear quotient.

For an incorrect candidate $H$ respecting this degree bound,

$$E(X)=\mathcal A(X)\mathcal B(X)-\mathcal C(X)-H(X)Z(X)$$

is a nonzero polynomial of degree at most $2M-2$. Fix the polynomials before choosing uniform $r$ from a finite nonempty $S\subseteq K$. Then the chance of a false match $E(r)=0$ is at most $\min(1,(2M-2)/|S|)$. In our example, $S=\mathbb F_{101}$ gives the upper bound $4/101$.

This explains identity testing, not full SNARK security. The construction must also bind evaluations to fixed polynomials derived from the same assignment, enforce public inputs, and guarantee degree bounds. Groth16 incorporates the random-evaluation idea through a secret evaluation point, an SRS, and pairings.


---

## 5. AIR: Algebraic Intermediate Representation

### 5.1 A different starting point from R1CS/QAP

The same computation can also be recorded as states over time. For a loop, arrange the values before and after each iteration in a table. AIR starts from this **[execution trace](./terms/execution-traces)**. Instead of following gate wiring, check that one state transitions correctly to the next.

### 5.2 Transition and boundary constraints

AIR imposes two types of constraints:

- **Transition constraints:** polynomial relations that must hold between consecutive trace rows—for example, that the next value is the square of the previous value.
- **Boundary constraints:** required values at particular rows, such as the initial or final state.

Separate the roles of the two constraints. Correct transitions do not establish the intended computation if the starting or ending state is wrong. Interpolating columns turns both relations between adjacent times and values at specified times into polynomial conditions. Session 3’s interpolation again connects tables to polynomials.

<span id="figure-04-3"></span>
<span id="caption-04-3"></span>

<div class="captioned-table" id="table-04-1" role="group" aria-labelledby="table-caption-04-1">

<p class="table-caption" id="table-caption-04-1"><strong>Table 04-1：AIR: rows track time and constraints check transitions</strong></p>

| Time t | State sₜ | Relation to check |
| --- | --- | --- |
| 0 | 3 | Initial boundary: s₀=3 |
| 1 | 9 | 9 ≡ 3² mod 17 |
| 2 | 13 | 13 ≡ 9² mod 17 |
| 3 | 16 | 16 ≡ 13² mod 17 / final boundary: s₃=16 |

</div>

Example trace over F₁₇ with sₜ₊₁=sₜ² and s₀=3. Transition constraints link adjacent rows; boundary constraints apply to specified rows.

[Follow the deposit/withdrawal example: AIR](./balance-arithmetization#air)

### 5.3 Understanding AIR through comparison with R1CS/QAP

R1CS/QAP and AIR pursue the same goal but choose different units of computation. The former emphasizes variables and gates; the latter emphasizes states and transitions. In Act III, compare Groth16’s QAP, PLONK’s own gate and copy constraints, and representative AIR-based STARKs. Do not classify PLONK itself as an R1CS/QAP construction.

### 5.4 A worked trace-to-polynomial example {#air-worked-math}

Over $K=\mathbb F_{17}$, start at 3 and square three times. The rule $u_{i+1}=u_i^2$ produces $3\to9\to13\to16$. Take initial value 3 and final value 16 as public conditions.

<div class="captioned-table" id="table-04-2" role="group" aria-labelledby="table-caption-04-2">

<p class="table-caption" id="table-caption-04-2"><strong>Table 04-2：Trace and evaluation points for three successive squarings</strong></p>

| Time $i$ | Point $\omega^i$ | State $u_i$ | Next-state relation |
|---:|---:|---:|---|
| 0 | 1 | 3 | $3^2=9$ |
| 1 | 4 | 9 | $9^2=13\pmod{17}$ |
| 2 | 16 | 13 | $13^2=16\pmod{17}$ |
| 3 | 13 | 16 | No transition constraint on the final row |

</div>

The element $\omega=4$ has order four, so $D=\{1,4,16,13\}$ is a multiplicative subgroup. Advancing time corresponds to replacing the evaluation point $X$ by $\omega X$. Interpolating the state column gives

$$T(X)=16X^3+2X^2+13X+6,$$

with $T(1)=3$, $T(4)=9$, $T(16)=13$, and $T(13)=16$. The variable represents evaluation points assigned to times, not time itself.

Define the transition numerator

$$N_{\mathrm{tr}}(X)=T(4X)-T(X)^2.$$

It must vanish at the first three points, $1,4,16$. Their vanishing polynomial is

$$Z_{\mathrm{tr}}(X)=(X-1)(X-4)(X-16)=X^3+13X^2+16X+4.$$

A valid trace satisfies $Z_{\mathrm{tr}}\mid N_{\mathrm{tr}}$. Here direct computation gives

$$N_{\mathrm{tr}}(X)=(16X^3+4X+1)Z_{\mathrm{tr}}(X),$$

so the transition quotient is $Q_{\mathrm{tr}}=16X^3+4X+1$.

**Excluding the final row is essential.** Since $4\cdot13=1\pmod{17}$, enforcing the same constraint there would impose a wraparound transition back to the initial state, which the program never requested. Indeed, $N_{\mathrm{tr}}(13)=3-16^2=2\ne0$. This is why we use only the constrained points, rather than dividing by the full-domain vanishing polynomial $X^4-1$.

### 5.5 Boundary conditions, degree bounds, and FRI {#air-quotients}

The factor theorem also expresses the boundary conditions as polynomial quotients:

$$Q_{\mathrm{in}}(X)=\frac{T(X)-3}{X-1}=16X^2+X+14,\qquad
Q_{\mathrm{out}}(X)=\frac{T(X)-16}{X-13}=16X^2+6X+6.$$

Each numerator vanishes at its boundary point. Transition constraints alone would allow executions starting from other values, so boundary conditions are needed as well.

For a length-$n$ trace with $n\ge2$, interpolate $T$ with degree below $n$. For squaring transitions on the first $n-1$ rows, $\deg N_{\mathrm{tr}}\le2(n-1)$ and $\deg Z_{\mathrm{tr}}=n-1$. Valid transition quotients have degree at most $n-1$, while single-point boundary quotients have degree at most $n-2$. Our $n=4$ example gives bounds 3 and 2.

For multiple columns, interpolate each as $T_j$ and substitute $T_j(X)$ and $T_j(\omega X)$ into multivariate transition constraints. Addition or conditional transitions have different equations; quotient degree bounds must be calculated from their constraint degrees.

STARK constructions combine such quotients using random coefficients. In this example,

$$Q_{\mathrm{comp}}=\rho_{\mathrm{tr}}Q_{\mathrm{tr}}+\rho_{\mathrm{in}}Q_{\mathrm{in}}+\rho_{\mathrm{out}}Q_{\mathrm{out}}$$

has degree at most three. Merely supplying a low-degree table does not establish that it was derived from the original trace. Fix trace commitments before choosing coefficients, check trace-to-quotient consistency at evaluation points, and combine these checks with degree/proximity tests. This connects to FRI in Session 6 and STARK in Session 13.

When evaluating quotients by division, use a domain avoiding the denominator's roots; do not compute $0/0$ at constraint points. Also, every table on $n$ distinct points has an interpolant of degree below $n$. **Testing degree only on the original trace domain is therefore insufficient.** Low-degree extension to a larger domain and consistency with constraints are essential.

Keep the costs separate. For fixed trace width and a constant number of field operations per row, checking all rows directly costs $O(n)$ field operations. Straightforward interpolation costs $O(n^2)$ per column; suitable multiplicative subgroups and fast transforms allow $O(n\log n)$. These are trace-processing costs, not FRI query counts or total STARK verification costs. This small example includes no mechanism for hiding secret values.


---

## Recap and next session

Today we expressed the same computation through different constraints. Review what the translation preserved and what became easier to check.

- How, against the background of Cook–Levin, circuitizing the NP-relation verifier preserves the correspondence between witnesses and satisfying assignments.
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
- Ask when addition can be absorbed into a linear combination and when a separately stored value needs an equality constraint, to develop their understanding of linear combinations and nonlinearity.
- After presenting AIR transition constraints, ask why AIR feels more natural even though the same computation could be expressed in R1CS. Use this to explore the difference in design philosophy.
