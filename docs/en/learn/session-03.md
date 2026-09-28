---
outline: [2, 3]
prev:
  text: Session 2 · Zero-knowledge and the generalization of witnesses
  link: /en/learn/session-02
next:
  text: Session 4 · Arithmetization techniques and complexity theory
  link: /en/learn/session-04
---

<script setup>
import CaptionedTable from "../../.vitepress/theme/CaptionedTable.vue";
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
import PolynomialVisual from "../../.vitepress/theme/PolynomialVisual.vue";
</script>

# Session 3: Algebra of finite fields and polynomials; probabilistic checking

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 28, 2026

[Session index](./sessions) · [Topic index](./topics) · [Session 3 in the syllabus](./#session-3) · [Supplement · Introductory finite-field exercise](./foundations)

## Context and learning objectives

Last time, we saw why general computations need translation into a form that can be checked. We now assemble the tools, starting with finite fields and polynomials. As we introduce each definition, ask which property helps reduce the burden of verification.

Today's three objectives are:

1. Establish the algebraic foundations of finite fields and polynomial rings, which will provide a common language for all subsequent lectures.
2. Understand the Schwartz–Zippel lemma as a tool that guarantees efficient probabilistic testing of polynomial identities.
3. Understand that this lemma is a **complexity-theoretic** tool directly connected to polynomial identity testing, a core technique in PCPs and IOPs, rather than merely an isolated result in algebra.

In terms of the two-axis matrix introduced in the previous session, today we begin preparing the tools for arithmetization that support the expressiveness axis.

---

## 1. Why polynomials? — Revisiting the motivation

Why translate computation into polynomials? In Session 2, Schnorr used the group structure of its relation to obtain a verification equation. We cannot simply reuse that equation for arbitrary computation. Instead, we represent computation in a common algebraic language and use checking methods for that language.

The property to notice is that **distinct low-degree polynomials cannot agree at too many points**. This suggests comparing values at random points instead of comparing every coefficient. Merely writing data as a polynomial does not compress it; it gives the data a structure useful for verification.

We will study concrete arithmetization techniques—how to turn computation into polynomial constraints—in Session 4. Today we prepare by developing the algebra of polynomials and the testing capabilities it provides.

---

## 2. Basics of finite fields

### 2.1 What is a finite field?

For a prime $p$, $\mathbb{F}_p = \mathbb{Z}/p\mathbb{Z}$ is a field. In addition to addition, subtraction, and multiplication, every nonzero element has a multiplicative inverse. In cryptography and proof systems, we generally work with finite fields $\mathbb{F}_q$ of order $p$, a prime, or $p^k$, a prime power.

**Why use a finite field?** Ordinary floating-point arithmetic introduces rounding errors, while proof constraints require exact equalities. Finite fields support exact arithmetic on finite representations. The useful property is not merely having finitely many elements, but being able to divide by every nonzero element.

### 2.2 A brief mention of extension fields

An irreducible polynomial over $\mathbb{F}_p$ defines an extension field $\mathbb{F}_{p^k}$. Extensions are useful when balancing the size of a sampling space with efficient machine arithmetic. Distinguish extensions of prime fields from extensions in characteristic two. We defer the construction; for now, learn to ask which field an FRI or AIR construction uses.

### 2.3 The structure of the multiplicative group

The nonzero elements $\mathbb{F}_p^*$ form a cyclic group of order $p-1$. Powers of a generator give structured evaluation points. A desired power-of-two subgroup requires its order to divide $p-1$. This condition matters when using NTTs to accelerate evaluation and interpolation.

<StudyDiagram id="03-1" :en="true" />

---

## 3. Basics of polynomial rings

### 3.1 Definitions and basic operations

$\mathbb{F}_p[X]$ is the ring of univariate polynomials with finite-field coefficients. Distinguish arithmetic on coefficients from arithmetic on expressions involving $X$. Besides addition and multiplication, division by a nonzero polynomial $g(X)$ yields $f(X)=q(X)g(X)+r(X)$ with $\deg r<\deg g$. QAP will use a zero remainder to express satisfaction of constraints.

$$f(X) = q(X) g(X) + r(X), \qquad \deg r < \deg g.$$

#### The coefficient field and the polynomial ring

Write $K$ for the coefficient field, either a prime field $\mathbb F_p$ or an extension $\mathbb F_{p^k}$. The ring $K[X]$ consists of finite expressions

$$f(X)=a_0+a_1X+\cdots+a_dX^d,\qquad a_i\in K.$$

Here $X$ is an **indeterminate**, not yet assigned a value and not the private input itself. Equality means equality of every coefficient. Add matching coefficients; multiply by distributing and collecting terms of equal degree. For example, in $\mathbb F_7[X]$,

$$(X+3)(X+5)=X^2+8X+15=X^2+X+1.$$

Reduce coefficients modulo 7, not powers of $X$. The highest nonzero coefficient determines the degree; a nonzero constant has degree zero. Treat the zero polynomial separately, or use the convention $\deg0=-\infty$.

A **ring** supports addition, subtraction, and multiplication without requiring every nonzero element to have an inverse. Nonzero constants from $K$ remain invertible in $K[X]$, but $1/X$ is not a polynomial. For nonzero polynomials,

$$\deg(fg)=\deg f+\deg g.$$

Thus a positive-degree polynomial cannot multiply another polynomial to give 1. Products of nonzero polynomials are also nonzero: the ring has **no zero divisors**.

#### Distinguishing an extension field built from polynomials

Section 2.2 constructs an extension using a degree-$k$ irreducible polynomial $m(T)$:

$$K=\mathbb F_p[T]/(m(T)).$$

This quotient identifies expressions with the same remainder modulo $m(T)$; representatives have degree less than $k$. Irreducibility makes the quotient a field, so every nonzero element is invertible. In $\mathbb F_2[T]/(T^2+T+1)$, write $\alpha=[T]$. Then $\alpha^2=\alpha+1$ and $\alpha(\alpha+1)=1$.

Polynomials to be tested belong to **$K[X]$ with a separate indeterminate $X$**. For $\alpha X^2+X+1$, use $\alpha^2=\alpha+1$ in coefficient arithmetic, but never replace $X^2$ with $X+1$. Reducing modulo $m(T)$ to construct coefficients and handling polynomials in $X$ serve different purposes.

#### Division with remainder does not require a polynomial inverse

For $g\ne0$, there are unique $q,r\in K[X]$ with

$$f=qg+r,\qquad r=0\ \text{or}\ \deg r<\deg g.$$

Cancel the leading term by dividing leading coefficients in the field and subtracting the resulting multiple of $g$. Each step lowers the remaining degree, so the procedure terminates. The field property supplies **coefficient division**, not an inverse of $g$ in the polynomial ring.

Exactly when the remainder is zero, write $g\mid f$: there exists a polynomial $q$ with $f=qg$. For example, in $\mathbb F_7[X]$,

$$X^2+1=(X-1)(X+1)+2.$$

The quotient is $X+1$ and the remainder is 2, so divisibility fails. This differs from merely writing the fraction $(X^2+1)/(X-1)$.

### 3.2 The basic theorem on the number of roots

The following fundamental fact holds for polynomials over a field:

> **Theorem:** If $f(X) \in \mathbb{F}_p[X]$ is not identically zero and has degree $d$, then $f$ has at most $d$ roots.

Read this theorem from the perspective of checking. For a nonzero polynomial, the number of locations where a random evaluation might be zero is bounded by its degree. The absence of zero divisors in a field supports this bound. Next, we extend the idea to several variables.

### 3.3 Lagrange interpolation

Given $d+1$ distinct points $(x_0, y_0), \dots, (x_d, y_d)$, there is a unique polynomial of degree at most $d$ passing through all of them:

$$f(X) = \sum_{i=0}^{d} y_i \prod_{j \ne i} \frac{X - x_j}{x_i - x_j}.$$

In this formula, each product is one at its designated point and zero at the other specified points. Weighting and adding these products gives the required values. **Given a degree bound and sufficiently many distinct points, coefficients and evaluation values specify the same polynomial.** Arithmetization will turn tables into polynomials; commitments will allow their values to be checked. Notice why both representations are useful.

First view the construction as a curve over the reals. Interpolate $(0,1),(1,2),(2,5)$ with degree at most two. With $\ell_0=(X-1)(X-2)/2$, $\ell_1=-X(X-2)$ and $\ell_2=X(X-1)/2$,

$$f(X)=1\ell_0(X)+2\ell_1(X)+5\ell_2(X)=X^2+1.$$

At each prescribed point exactly one basis is one. Toggle the weighted bases to compare the terms with their sum. Without the degree restriction, other polynomials can pass through the same three points.

<PolynomialVisual kind="interpolation" :en="true" />

Now read the same $X^2+1$ over $\mathbb{F}_7$: for example, $f(3)=10\equiv3\pmod7$. Coordinates no longer describe the real curve.

<StudyDiagram id="03-2" :en="true" />

### 3.4 Roots, vanishing polynomials, and QAP divisibility {#qap-polynomial-prerequisites}

**Translate roots into divisibility** to connect to QAP. Division of $f$ by $X-a$ leaves a constant remainder $r$. Substituting $X=a$ gives $r=f(a)$, hence the factor theorem:

$$f(a)=0\quad\Longleftrightarrow\quad (X-a)\mid f(X).$$

For distinct $a_1,\ldots,a_m$, the factors $X-a_j$ are pairwise coprime: no nonconstant factor is shared. Vanishing at every point is therefore equivalent to divisibility by their product:

$$D=\{a_1,\ldots,a_m\},\qquad Z_D(X)=\prod_{j=1}^{m}(X-a_j)$$

$$\forall a\in D:\ F(a)=0\quad\Longleftrightarrow\quad Z_D\mid F\quad\Longleftrightarrow\quad \exists H\in K[X]:F=HZ_D.$$

Call $Z_D$ the **vanishing polynomial**. Distinctness matters: listing point 1 twice does not make $F(1)=0$ imply $(X-1)^2\mid F$. A domain of $m$ distinct points also requires at least $m$ elements in the coefficient field.

For $K=\mathbb F_7$ and $D=\{1,2\}$,

$$Z_D=(X-1)(X-2)=X^2+4X+2$$

$$F=X^3+6=(X+3)(X^2+4X+2)=(X+3)Z_D.$$

Thus $F(1)=F(2)=0$, the quotient is $H=X+3$, and the remainder is zero. In contrast, $G=F+1=X^3$ satisfies $G=(X+3)Z_D+1$: its remainder is 1 and $G(1)=G(2)=1$. Satisfying conditions at every point and having zero remainder express the same information.

In Session 4, constraint row $j$ corresponds to $a_j$, and $A,B,C$ incorporate the assignment. With $F=AB-C$, row conditions $A(a_j)B(a_j)=C(a_j)$ are exactly $F(a_j)=0$. Their combined form is $AB-C=HZ_D$. **The requirement is the existence of a polynomial $H$.** If rational functions in $K(X)$ were allowed, one could always write $H=F/Z_D$ for nonzero $Z_D$, which does not distinguish satisfying assignments.

Two distinctions matter. First, $F\equiv0\pmod{Z_D}$ means zero remainder, not that $F$ is the zero polynomial; $F=X^3+6$ above is nonzero. For $m\ge2$, $Z_D$ factors into linear terms and $K[X]/(Z_D)$ is not a field. This quotient serves a different purpose from constructing a coefficient field using an irreducible polynomial. Second, control degrees. With ordinary interpolation, $\deg A,\deg B,\deg C<m$ and $m\ge2$. A nonzero $F$ has degree at most $2m-2$, so if divisible, its quotient satisfies $\deg H\le m-2$. When $F=0$, take $H=0$. These bounds apply to this interpolation form; modifications such as blinding require revised bounds.

A later random-point test checks whether $F-HZ_D$ is zero for fixed, degree-bounded $F,H$. It must not allow the quotient value to be chosen after seeing the point. Reuse this correspondence in [Session 4's QAP construction](./session-04#_4-1-from-r1cs-to-qap) and the [interpolation and divisibility guide](./terms/polynomials).


---

## 4. The Schwartz–Zippel lemma

### 4.1 Motivation: how can we check polynomial identities?

Suppose we want to check whether $f(X)$ and $g(X)$ are the same polynomial. Comparing all coefficients works, but can itself burden the verifier for a polynomial encoding a large computation. The goal is to establish equality, not to read coefficients. Can we reduce the number of evaluation points we inspect?

**Question:** Can we determine identity with high probability by evaluating at just one random point, without inspecting the entire polynomial?

### 4.2 Statement of the lemma: the multivariate version

> **Schwartz–Zippel lemma:** Let $f(X_1, \dots, X_n) \in \mathbb{F}[X_1, \dots, X_n]$ be a polynomial that is not identically zero, with total degree $d$. If the values of the variables are chosen independently and uniformly from a nonempty finite set $S \subseteq \mathbb{F}$, then
> $$\Pr[f(r_1, \dots, r_n) = 0] \le \frac{d}{|S|}.$$

For one variable, $n=1$, this is exactly the fact from Section 3.2 that a polynomial has at most $d$ roots. The multivariate version extends it inductively. Sketch the proof in class by induction on $n$.

### 4.3 What the lemma tells us

To compare two polynomials, take $h=f-g$. If they differ, $h$ is nonzero, so accidental zero evaluation has probability at most $d/|S|$. Sample coordinates independently and uniformly from $S$. The sampling set must be large enough relative to degree; if the current field is too small, consider an extension field. Independent repetition also helps when the one-test miss probability is below 1.

What becomes small here is the number of points checked. Computing an evaluation is not automatically cheap. The argument also fails if polynomials can be chosen after seeing the test point. A proof system must fix them first and authenticate the required evaluations.

Compare $f(X)=X^2+1$ with $g(X)=4X-2$. Their difference is $h(X)=(X-1)(X-3)$. Intersections with the horizontal axis are precisely the test points that miss this difference. Fix the polynomials before sampling.

<PolynomialVisual kind="testing" :en="true" />

<StudyDiagram id="03-3" :en="true" />

### 4.4 The complexity-theoretic significance

As an algorithm, this test always recognizes an identically zero polynomial and may err only on a nonzero one. Given an efficiently evaluable representation and a suitable sampling space, PIT admits a one-sided-error randomized algorithm. It is also in BPP; identifying the direction of error clarifies the connection to soundness.

For this course, its crucial role is as **the theoretical foundation for polynomial identity testing, a core technique in PCPs and IOPs**. In many SNARK and STARK protocols, the prover claims that a polynomial relation holds. Rather than checking the entire relation, the verifier checks evaluations at random points, or random linear combinations. The Schwartz–Zippel lemma provides the mathematical justification for this idea of checking at a random point without examining the whole object.

*(We will study concrete applications in the later sessions of Act II on FRI and PCPs/IOPs. Today we first establish why this technique supports soundness.)*

---

## 5. Understanding the sampling set S and its error probability {#_5-exercises-concrete-examples-of-identity-testing}

Before turning to exercises, work through what changes when we vary the sampling set $S$. The coefficient field $\mathbb{F}$ and the set $S$ of candidate test points have different roles.

### 5.1 S is the set of candidate test points

$S$ is a nonempty finite subset of $\mathbb{F}$. It may be the whole field or just some elements; it need not itself be a field or subgroup. For one variable, choose uniform $r\in S$. For multiple variables, choose each coordinate independently and uniformly from $S$. Fix both $S$ and the polynomial before sampling.

For example, in $\mathbb{F}_{101}$ we may choose $S=\{0,1,\ldots,9\}$. Polynomial arithmetic remains **modulo 101**, not modulo 10. The field contains only 101 distinct elements: listing integers from 0 through 201 does not create 202 distinct test points, because values repeat modulo 101.

### 5.2 How does a larger set change the bound?

Compare Section 4's $f(X)=X^2+1$ and $g(X)=4X-2$, now over $\mathbb{F}_{101}$. Their difference is

$$h(X)=f(X)-g(X)=(X-1)(X-3).$$

It has degree 2 and exactly two roots, 1 and 3. The test incorrectly reports equality precisely when $r$ hits a root. Its **actual error probability** is therefore

$$\Pr[h(r)=0]=\frac{|S\cap\{1,3\}|}{|S|}.$$

Without knowing the roots, a degree bound $d$ gives the **error upper bound**

$$\Pr[h(r)=0]\le\min\left(1,\frac{d}{|S|}\right).$$

A probability cannot exceed 1. When $d/|S|\ge1$, the lemma supplies no useful small-error guarantee.

<CaptionedTable number="03-3" caption="Sampling sets and error probabilities for a quadratic polynomial" :en="true">

| Sampling set $S\subseteq\mathbb{F}_{101}$ | $\lvert S\rvert$ | Roots in $S$ | Actual error probability | Degree-2 upper bound |
| --- | --- | --- | --- | --- |
| $\{1,3\}$ | 2 | 2 | $1$ (100%) | $1$ |
| $\{0,1,2,3\}$ | 4 | 2 | $1/2$ (50%) | $1/2$ |
| $\{4,5,6,7\}$ | 4 | 0 | $0$ | $1/2$ |
| $\{0,1,\ldots,9\}$ | 10 | 2 | $1/5$ (20%) | $1/5$ |
| $\{0,1,\ldots,99\}$ | 100 | 2 | $1/50$ (2%) | $1/50$ |
| $\mathbb{F}_{101}$ | 101 | 2 | $2/101$ (about 1.98%) | $2/101$ |

</CaptionedTable>

Even two sets of size 4 can have different actual probabilities. **$d/|S|$ is not always the actual error probability.** With degree fixed, enlarging the set lowers the upper bound, but switching to an arbitrary different set need not monotonically lower the actual probability. A proof system cannot rely on knowing and avoiding the roots of a dishonest polynomial, so it uses a bound independent of their locations.

### 5.3 Required set size and repeated tests

To guarantee one-test error at most $\varepsilon$, it suffices that

$$|S|\ge\frac{d}{\varepsilon}.$$

For $d=2$ and a target of 1%, this requires at least 200 distinct candidates. The field $\mathbb{F}_{101}$ cannot supply them.

An alternative is to **test the same fixed polynomial at fresh independent points**. Report inequality if any evaluation is nonzero; report equality only if every evaluation is zero. If one-test error is bounded by $\rho<1$, the probability of missing the difference in all $k$ tests is at most $\rho^k$.

For $S=\{0,1,\ldots,15\}\subset\mathbb{F}_{101}$ and $d=2$, the bound is $1/8$ for one test, $1/64$ (about 1.56%) for two, $1/512$ (about 0.195%) for three, and $2^{-42}$ for fourteen. Re-evaluating the same point does not help. The polynomial must not be changed between tests. This argument concerns testing a fixed polynomial; Session 6 separately examines conditions for repetition of interactive proofs more generally.

### 5.4 Repetition cannot always compensate for a small field

With $S=\{1,3\}$ in Table 03-3, every test misses the difference, however often it is repeated. Sampling the entire field need not fix the problem either. The formal polynomial

$$u(X)=X^{101}-X$$

over $\mathbb{F}_{101}$ is nonzero, yet $u(a)=0$ for every element of that field. Its degree is 101 and the set size is 101, giving the uninformative bound 1. **Equality of formal polynomials differs from equality of their values on a finite set.**

One solution is to embed the coefficients naturally into an extension field of the same characteristic and use more candidate points. The field $\mathbb{F}_{101^2}$ has 10201 elements. Testing $u$ over that field gives upper bound $101/10201=1/101$; for the earlier quadratic the bound is $2/10201$. The polynomial remains fixed before sampling. Extension-field arithmetic has implementation and computational costs, so choose the sampling space together with the number of repetitions.

### 5.5 Why use a subset rather than the whole field?

The lemma does not require $S$ to be closed under addition or multiplication. Subject to the required error bound, choose a set that is easy to sample uniformly or compatible with other checks. For instance, a set of $2^b$ distinct elements in a sufficiently large prime field admits a one-to-one correspondence with uniform $b$-bit strings. But shrinking the set worsens $d/|S|$, so sampling convenience alone is insufficient justification.

A domain chosen for fast polynomial evaluation need not be the same set used to sample soundness challenges. For example, let $Z_D(X)=\prod_{a\in D}(X-a)$ vanish on a constraint domain $D$. Even if two polynomials differ by a nonzero multiple $Z_D(X)H(X)$, sampling only inside $D$ cannot detect that difference. Keep these roles separate when reading the QAP identities in Session 4.

First choose a degree bound $d$ and acceptable error $\varepsilon$, then select the field, sampling set, and number of independent tests. Finally check that the polynomial is fixed before sampling, sampling is uniform, and evaluations are authentic. With these points understood, vary the sets in Table 03-3 and calculate both the bound and the actual probability as an exercise.

### 5.6 Measuring complexity: query count is not running time

Let $h=f-g$ have $n$ variables and total degree at most $d\ge1$. Write $m=|S|>d$ and let $k$ be the number of independent tests. Each test samples $n$ coordinates and evaluates $h$ once; it does not enumerate the $m^n$ points of $S^n$.

In the **field-operation model**, count each field addition or multiplication as one operation. If one evaluation costs $C_{\mathrm{eval}}$ operations, $k$ tests cost $O(kC_{\mathrm{eval}})$ field operations. The representation matters:

- **A univariate coefficient list:** Horner's rule, $a_0+X(a_1+X(\cdots+Xa_d))$, evaluates a degree-$d$ polynomial in $O(d)$ field operations, giving $O(kd)$ for the tests. Direct coefficient comparison also takes $O(d)$ operations when the lists are already available; random testing is not automatically faster.
- **An arithmetic circuit:** With $L$ addition, subtraction, and multiplication gates, evaluating every gate once costs $O(L)$ field operations, or $O(kL)$ for $k$ points. The benefit is avoiding expansion of a compact multivariate expression into a potentially enormous list of monomials.
- **Oracle access to values:** There are $k$ queries. This does not include the cost of computing the values or authenticating values supplied by a prover. Polynomial commitments introduce additional costs that must be counted separately.

For **bit complexity**, an element of $\mathbb{F}_q$ requires $\Theta(\log_2 q)$ bits. If $A(q)$ bounds the bit cost of a field operation, evaluation costs $O(kC_{\mathrm{eval}}A(q))$, plus sampling and point-generation costs. Enlarging the field can increase this cost even if the operation count is unchanged. For example, represent $\mathbb{F}_{p^t}$ modulo a fixed irreducible polynomial. Ordinary coefficient multiplication and reduction use $O(t^2)$ base-field operations per extension-field multiplication. This count excludes constructing the field or finding its defining irreducible polynomial.

### 5.7 Trading randomness against error

Assume the elements of $S$ can be generated efficiently. If $m=2^b$, sampling one coordinate uniformly uses exactly $b$ independent random bits, so $k$ tests in $n$ variables use $knb$ bits. For general $m$, generate a $\lceil\log_2 m\rceil$-bit integer and reject it if it is at least $m$. This uses an expected $O(\log m)$ bits per coordinate. Simply reducing a random integer modulo $m$ can introduce bias. If $S$ is supplied as an explicit list, reading and storing that list also has a cost.

For target error $2^{-\lambda}$ and $m>d$, it suffices that

$$\left(\frac{d}{m}\right)^k\le 2^{-\lambda},\qquad k\ge\left\lceil\frac{\lambda}{\log_2(m/d)}\right\rceil.$$

Choose the smallest power-of-two set size with $m\ge2d$. Then $k=\lambda$ tests suffice, using $O(\lambda L)$ field operations for circuit evaluation and $O(\lambda n\log(d+1))$ random bits. Alternatively, one test suffices with $m\ge d2^\lambda$. If points are generated from indices, there is no need to store or enumerate this enormous set: randomness costs only $O(n(\log(d+1)+\lambda))$ bits. However, the field must contain enough distinct elements, and evaluation must take place in that field.

For the quadratic example in Section 5.3, compare two ways to reach error at most $2^{-40}$:

- Use 16 points in $\mathbb{F}_{101}$. Fourteen evaluations give the bound $2^{-42}$ and use $14\times4=56$ random bits in one variable.
- Use $2^{41}$ points for a single evaluation. The bound is $2/2^{41}=2^{-40}$ and sampling uses 41 random bits. This set cannot fit in $\mathbb{F}_{101}$. Since $101^7>2^{41}$, for example, an injective mapping from indices into $\mathbb{F}_{101^7}$ supplies enough points, at the cost of extension-field arithmetic and element generation.

The first approach evaluates repeatedly in a small field; the second evaluates once in a larger field. Saving 15 random bits does not by itself make the second faster. Compare evaluation count, bit cost per field operation, and field preparation together. These are error bounds for this test alone, not security guarantees for an entire proof system.

### 5.8 Locating the algorithm in complexity theory

For the decision problem “Is $h$ identically zero?”, a Yes instance is always accepted. Only a No instance can be accepted incorrectly, with probability bounded by, say, $1/2$. A **randomized polynomial-time decision algorithm** with this error direction defines **coRP**, a class contained in BPP. Reversing the question to “Is $h$ nonzero?” gives the RP direction. This classification assumes that field arithmetic, sampling, and the required field representation or construction can all be handled in polynomial time in the input length. For example, a sufficiently large field and an efficiently generated power-of-two sampling set avoid the variable running time of rejection sampling.

Polynomial time is measured against the **input description length**, not just the polynomial's degree. A circuit with $L$ binary multiplication gates can reach degree $2^L$ through repeated squaring. But the point representation needed for $m\ge2d$ uses only $O(\log d)$ bits, which is $O(L)$ when $d\le2^L$. Evaluating the circuit directly over a suitable finite field avoids reading the expanded coefficient list. Conversely, a small query count alone does not imply polynomial running time for a black box without an efficient evaluation procedure.

Schwartz–Zippel bounds the error. A complexity claim must also specify **the input representation, operations, randomness, and number of repetitions**. See Anup Rao's lecture notes in the references for arithmetic-circuit PIT.

---

## Recap and next session

Today we studied fields and polynomials as tools for later checks. Review which property enabled which operation through the following points.

- The basics of finite fields $\mathbb{F}_p$ and polynomial rings $\mathbb{F}_p[X]$, and the correspondence between coefficient and evaluation representations through Lagrange interpolation.
- The Schwartz–Zippel lemma: polynomial identities can be tested probabilistically at one random point without inspecting the entire polynomial.
- The lemma's role as the theoretical basis of polynomial identity testing, widely used in PCPs and IOPs.

In Session 4, we begin concrete arithmetization techniques: R1CS, QAP, and AIR, which translate general computation into polynomial constraints. We will also connect them to circuit complexity through the Cook–Levin theorem and examine why this translation is theoretically justified from a complexity-theoretic perspective.

---

## References and further reading

- Schwartz, “[Fast Probabilistic Algorithms for Verification of Polynomial Identities](https://www.sigmod.org/publications/dblp/db/journals/jacm/Schwartz80.html),” JACM, 1980. — bibliography and publisher link hosted by ACM SIGMOD
- Zippel, “[Probabilistic Algorithms for Sparse Polynomials](https://link.springer.com/chapter/10.1007/3-540-09519-5_73),” EUROSAM, 1979. — Springer publication page
- Motwani, Raghavan, *[Randomized Algorithms](https://www.cambridge.org/core/books/randomized-algorithms/6A3E5CD760B0DDBA3794A100EE2843E8)*, Chapter 7 (the algorithmic context of polynomial identity testing). — publisher’s book information

- Anup Rao, "[Lecture 15: Error reduction, Schwartz-Zippel, Polynomial identity testing](https://homes.cs.washington.edu/~anuprao/pubs/cse431sp24/lecture15.pdf)," CSE 431, 2024 — lecture notes on arithmetic-circuit PIT and randomized complexity.

- [SageMath: Quotients of Univariate Polynomial Rings](https://doc.sagemath.org/html/en/reference/polynomial_rings/sage/rings/polynomial/polynomial_quotient_ring.html) — polynomial rings and quotient constructions.

## Suggested classroom questions

- Before presenting the lemma, ask whether checking just one point instead of comparing entire polynomials could really be sufficient, and whether this seems intuitively doubtful.
- First establish the univariate fact that there are at most $d$ roots, then ask students to predict what might happen in multiple variables. This helps make the statement of the lemma intuitive.
- Include an exercise asking what happens if $|S|$ is too small, with students constructing concrete counterexamples. This makes the meaning of the lemma's assumptions tangible.
