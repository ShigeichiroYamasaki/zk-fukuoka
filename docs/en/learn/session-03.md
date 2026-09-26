---
outline: [2, 3]
prev:
  text: Session 2 · Zero-knowledge and the generalization of witnesses
  link: /en/learn/session-02
next:
  text: Session 4 · Arithmetization techniques and complexity theory
  link: /en/learn/session-04
---

# Session 3: Algebra of finite fields and polynomials; probabilistic checking

::: info Lecture manuscript
An English translation of the supplied Japanese manuscript for Session 3.
:::

[Session index](./sessions) · [Topic index](./topics) · [Session 3 in the syllabus](./#session-3) · [Supplement · Introductory finite-field exercise](./foundations)

## Context and learning objectives

The previous session completed Act I, purpose and motivation. Today we begin Act II: assembling the tools. Whenever we introduce a mathematical tool in Act II, we will explicitly identify which problem from Act I it helps solve.

Today's three objectives are:

1. Establish the algebraic foundations of finite fields and polynomial rings, which will provide a common language for all subsequent lectures.
2. Understand the Schwartz–Zippel lemma as a tool that guarantees efficient probabilistic testing of polynomial identities.
3. Understand that this lemma is a **complexity-theoretic** tool directly connected to polynomial identity testing, a core technique in PCPs and IOPs, rather than merely an isolated result in algebra.

In terms of the two-axis matrix introduced in the previous session, today we begin preparing the tools for arithmetization that support the expressiveness axis.

---

## 1. Why polynomials? — Revisiting the motivation

As we saw in Session 2, handling general computation—arbitrary NP relations—requires moving beyond methods that rely on group homomorphisms, such as Schnorr's protocol. Instead, we need to translate computation into algebraic objects. The objects chosen for this translation are **polynomials**.

Why polynomials? To anticipate today's material: **polynomials can represent large amounts of information with a short description and allow the correctness of that information to be checked probabilistically with few queries**. The mathematical guarantee behind this useful property is today's central topic, the Schwartz–Zippel lemma.

We will study concrete arithmetization techniques—how to turn computation into polynomial constraints—in Session 4. Today we prepare by developing the algebra of polynomials and the testing capabilities it provides.

---

## 2. Basics of finite fields

### 2.1 What is a finite field?

For a prime $p$, $\mathbb{F}_p = \mathbb{Z}/p\mathbb{Z}$ is a field. In addition to addition, subtraction, and multiplication, every nonzero element has a multiplicative inverse. In cryptography and proof systems, we generally work with finite fields $\mathbb{F}_q$ of order $p$, a prime, or $p^k$, a prime power.

**Why use finite fields?** Arithmetic over the real numbers $\mathbb{R}$ cannot be performed exactly on computers because of rounding errors. Finite fields avoid this problem and can be handled exactly on computers while retaining the field axioms, especially the existence of multiplicative inverses.

### 2.2 A brief mention of extension fields

We can construct an extension field $\mathbb{F}_{p^k}$ using an irreducible polynomial over $\mathbb{F}_p$. STARK implementations often use such extension fields—for example, extensions of $\mathbb{F}_{2^{64}}$—for efficient arithmetic. We will not pursue the details today, but revisit them as needed in the sessions on FRI and AIR.

### 2.3 The structure of the multiplicative group

$\mathbb{F}_p^*$, the multiplicative group of nonzero elements, is cyclic of order $p-1$. The existence of primitive roots, or generators, and the subgroup structure of $\mathbb{F}_p^*$, especially subgroups of power-of-two order, will matter when we study the number-theoretic transform (NTT), which makes arithmetization more efficient. For today, it is enough to remember that this group is cyclic.

---

## 3. Basics of polynomial rings

### 3.1 Definitions and basic operations

Let $\mathbb{F}_p[X]$ be the ring of univariate polynomials over a finite field. Review degree, polynomial addition and multiplication, and polynomial division:

$$f(X) = q(X) g(X) + r(X), \qquad \deg r < \deg g.$$

### 3.2 The basic theorem on the number of roots

The following fundamental fact holds for polynomials over a field:

> **Theorem:** If $f(X) \in \mathbb{F}_p[X]$ is not identically zero and has degree $d$, then $f$ has at most $d$ roots.

This follows from the integral-domain property of a field: it has no zero divisors. It is also precisely the univariate version of the Schwartz–Zippel lemma. Emphasize this theorem as a bridge to the multivariate result in the next section.

### 3.3 Lagrange interpolation

Given $d+1$ distinct points $(x_0, y_0), \dots, (x_d, y_d)$, there is a unique polynomial of degree at most $d$ passing through all of them:

$$f(X) = \sum_{i=0}^{d} y_i \prod_{j \ne i} \frac{X - x_j}{x_i - x_j}.$$

**Why this matters:** A polynomial has two equivalent representations: its coefficients and its values at evaluation points, or evaluation representation. Moving freely between these representations underpins the efficiency of later arithmetization techniques and commitment schemes. Today we establish this fact; efficient conversion using the NTT will be covered later.

---

## 4. The Schwartz–Zippel lemma

### 4.1 Motivation: how can we check polynomial identities?

Suppose we want to determine whether two polynomials $f(X), g(X)$ are identically equal. We could compare all their coefficients. But when the degree is large—for example, when a polynomial encodes an entire execution trace—the number of coefficients can be enormous, making this inefficient.

**Question:** Can we determine identity with high probability by evaluating at just one random point, without inspecting the entire polynomial?

### 4.2 Statement of the lemma: the multivariate version

> **Schwartz–Zippel lemma:** Let $f(X_1, \dots, X_n) \in \mathbb{F}[X_1, \dots, X_n]$ be a polynomial that is not identically zero, with total degree $d$. If the values of the variables are chosen independently at random from a finite set $S \subseteq \mathbb{F}$, then
> $$\Pr[f(r_1, \dots, r_n) = 0] \le \frac{d}{|S|}.$$

For one variable, $n=1$, this is exactly the fact from Section 3.2 that a polynomial has at most $d$ roots. The multivariate version extends it inductively. Sketch the proof in class by induction on $n$.

### 4.3 What the lemma tells us

To test whether two polynomials $f, g$ are equal, consider their difference $h = f - g$ and check whether $h(r) = 0$ at a random point $r$. If $h$ is not identically zero—that is, $f \ne g$—the lemma bounds the probability of mistakenly finding $h(r)=0$ by $d / |S|$. Taking $|S|$ sufficiently large makes this error probability arbitrarily small.

**Instead of comparing entire polynomials, we can therefore test identity with high probability using the lightweight operation of evaluation at a single point.**

### 4.4 The complexity-theoretic significance

The importance of this lemma goes beyond algebra. It gives a **representative example of a probabilistic polynomial-time decision algorithm, a BPP algorithm**, and has a historically important place in randomized complexity theory through polynomial identity testing (PIT).

For this course, its crucial role is as **the theoretical foundation for polynomial identity testing, a core technique in PCPs and IOPs**. In many SNARK and STARK protocols, the prover claims that a polynomial relation holds. Rather than checking the entire relation, the verifier checks evaluations at random points, or random linear combinations. The Schwartz–Zippel lemma provides the mathematical justification for this idea of checking at a random point without examining the whole object.

*(We will study concrete applications in the later sessions of Act II on FRI and PCPs/IOPs. Today we first establish why this technique supports soundness.)*

---

## 5. Exercises: concrete examples of identity testing

Use examples such as the following in class to practice applying the lemma:

- Test whether two polynomials are equal using only evaluation at a random point. Choose expressions whose equality could be checked by expansion, but for which expansion is tedious.
- Calculate how the error probability changes as $|S|$ varies.
- Briefly discuss why one might deliberately sample from a small subset $S$ instead of the entire finite field, including considerations of field characteristic and implementation efficiency.

---

## Recap and next session

Today we studied:

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
