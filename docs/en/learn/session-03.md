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

---

## 4. The Schwartz–Zippel lemma

### 4.1 Motivation: how can we check polynomial identities?

Suppose we want to check whether $f(X)$ and $g(X)$ are the same polynomial. Comparing all coefficients works, but can itself burden the verifier for a polynomial encoding a large computation. The goal is to establish equality, not to read coefficients. Can we reduce the number of evaluation points we inspect?

**Question:** Can we determine identity with high probability by evaluating at just one random point, without inspecting the entire polynomial?

### 4.2 Statement of the lemma: the multivariate version

> **Schwartz–Zippel lemma:** Let $f(X_1, \dots, X_n) \in \mathbb{F}[X_1, \dots, X_n]$ be a polynomial that is not identically zero, with total degree $d$. If the values of the variables are chosen independently at random from a finite set $S \subseteq \mathbb{F}$, then
> $$\Pr[f(r_1, \dots, r_n) = 0] \le \frac{d}{|S|}.$$

For one variable, $n=1$, this is exactly the fact from Section 3.2 that a polynomial has at most $d$ roots. The multivariate version extends it inductively. Sketch the proof in class by induction on $n$.

### 4.3 What the lemma tells us

To compare two polynomials, take $h=f-g$. If they differ, $h$ is nonzero, so accidental zero evaluation has probability at most $d/|S|$. Sample coordinates independently and uniformly from $S$. The sampling set must be large enough relative to degree; if the current field is too small, consider extension fields or repetition.

What becomes small here is the number of points checked. Computing an evaluation is not automatically cheap. The argument also fails if polynomials can be chosen after seeing the test point. A proof system must fix them first and authenticate the required evaluations.

Compare $f(X)=X^2+1$ with $g(X)=4X-2$. Their difference is $h(X)=(X-1)(X-3)$. Intersections with the horizontal axis are precisely the test points that miss this difference. Fix the polynomials before sampling.

<PolynomialVisual kind="testing" :en="true" />

<StudyDiagram id="03-3" :en="true" />

### 4.4 The complexity-theoretic significance

As an algorithm, this test always recognizes an identically zero polynomial and may err only on a nonzero one. Given an efficiently evaluable representation and a suitable sampling space, PIT admits a one-sided-error randomized algorithm. It is also in BPP; identifying the direction of error clarifies the connection to soundness.

For this course, its crucial role is as **the theoretical foundation for polynomial identity testing, a core technique in PCPs and IOPs**. In many SNARK and STARK protocols, the prover claims that a polynomial relation holds. Rather than checking the entire relation, the verifier checks evaluations at random points, or random linear combinations. The Schwartz–Zippel lemma provides the mathematical justification for this idea of checking at a random point without examining the whole object.

*(We will study concrete applications in the later sessions of Act II on FRI and PCPs/IOPs. Today we first establish why this technique supports soundness.)*

---

## 5. Exercises: concrete examples of identity testing

Use the lemma to design a test. Once the polynomial degree and sampling set are chosen, what error bound follows? Work through the following examples to connect the formula to that decision.

- Test whether two polynomials are equal using only evaluation at a random point. Choose expressions whose equality could be checked by expansion, but for which expansion is tedious.
- Calculate how the error probability changes as $|S|$ varies.
- Briefly discuss why one might deliberately sample from a small subset $S$ instead of the entire finite field, including considerations of field characteristic and implementation efficiency.

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

## Suggested classroom questions

- Before presenting the lemma, ask whether checking just one point instead of comparing entire polynomials could really be sufficient, and whether this seems intuitively doubtful.
- First establish the univariate fact that there are at most $d$ roots, then ask students to predict what might happen in multiple variables. This helps make the statement of the lemma intuitive.
- Include an exercise asking what happens if $|S|$ is too small, with students constructing concrete counterexamples. This makes the meaning of the lemma's assumptions tangible.
