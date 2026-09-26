---
outline: [2, 3]
prev:
  text: Session 4 · Arithmetization techniques and complexity theory
  link: /en/learn/session-04
next:
  text: Session 6 · Low-degree testing and soundness amplification
  link: /en/learn/session-06
---

# Session 5: Error-correcting codes and the information-theoretic perspective

::: info Lecture manuscript
This page is an English translation of the supplied Session 5 lecture manuscript.
:::

[Sessions](./sessions) · [Topics](./topics) · [Session 5 in the syllabus](./#session-5) · [Exercises](../exercises/)

## Position in the course and learning objectives

In the previous session, we learned how arithmetization translates computations into polynomials or their evaluation representations. Today we shift our perspective and ask: **How reliably can we handle information encoded as polynomials?** Coding theory and information theory provide a language for this question.

There are three learning objectives:

1. Understand Reed–Solomon codes as a natural encoding based on polynomial evaluation representations.
2. Understand how to evaluate error-correcting codes through information-theoretic perspectives, including Shannon and Hamming bounds.
3. Become familiar with list decoding and preview its connection to later quantitative soundness analysis.

Today's material provides the foundation for low-degree testing and FRI in Session 6. It also introduces a somewhat different but important perspective within Act II: measuring the robustness of proofs in the language of information theory.

---

## 1. Why do we need coding theory? — Motivation

### 1.1 Why arithmetization alone is not enough

We have learned how to express computations as polynomial constraints using R1CS, QAP, and AIR. But when a verifier actually checks a polynomial, the question remains: how much can the information supplied by the prover be trusted? In particular, how can we detect a dishonest prover who supplies a manipulated function that is not low-degree in place of the expected low-degree polynomial?

To prepare to answer this question, we introduce the concept of a **code**, particularly Reed–Solomon codes.

### 1.2 The fundamental question of coding theory

Coding theory originally studies how accurately an original message can be recovered when noise enters a communication channel. In proof systems, we can reinterpret this as asking how robustly we can detect or recover the intended correct polynomial from possibly corrupted data supplied by a prover.

---

## 2. Reed–Solomon codes

### 2.1 Definition

Consider the encoding that maps every polynomial of degree less than $d$, from $\{f \in \mathbb{F}[X] : \deg f < d\}$, to its vector of values on an evaluation set $D = \{x_1, \dots, x_n\} \subseteq \mathbb{F}$, with $n > d$:

$$f \mapsto (f(x_1), f(x_2), \dots, f(x_n))$$

This is a Reed–Solomon code (RS code). Each codeword is precisely the evaluation representation of a polynomial of degree less than $d$. The correspondence between coefficient and evaluation representations provided by Lagrange interpolation in Session 3 therefore becomes the theoretical basis for encoding and decoding.

### 2.2 Minimum distance

A fundamental measure of a code's performance is its **minimum distance**. For an RS code, it is

$$\delta = n - d + 1$$

This follows from the fact established in Session 3: a nonzero polynomial of degree at most $d-1$ has at most $d-1$ roots. Equivalently, two distinct codewords can agree at no more than $d-1$ evaluation points. A larger minimum distance allows more errors to be corrected.

### 2.3 Error-correcting capability

A basic principle of coding theory is that a code of minimum distance $\delta$ can uniquely correct up to $\lfloor (\delta - 1)/2 \rfloor$ errors. RS codes are also **MDS (Maximum Distance Separable) codes**: for given parameters $n$ and $d$, their minimum distance attains the theoretical limit known as the Singleton bound.

---

## 3. The information-theoretic perspective: Shannon and Hamming bounds

### 3.1 Two different error models

Coding theory has two broad approaches, depending on how errors are modeled.

**The Shannon model (probabilistic errors):** Assume a probabilistic communication channel in which each symbol independently incurs a random error with a certain probability. The Shannon limit gives the maximum rate at which information can be transmitted reliably under these probabilistic errors.

**The Hamming model (worst-case errors):** Make no probabilistic assumption about error locations or values, and consider how much corruption can occur in the worst case. The Hamming bound, or sphere-packing bound, limits what codes can achieve against such errors.

### 3.2 Why this distinction matters for proof systems

In a proof system, errors—that is, a prover's dishonest behavior—are not random natural phenomena. They are caused by **an adversary deliberately seeking the worst case**. Consequently, code properties based on the **Hamming worst-case model**, such as minimum distance and error-correcting capability, are central to soundness analysis, rather than a Shannon-style model of probabilistic errors. This distinction is consistent with the cryptographic goal of guaranteeing security against the worst adversary, rather than only on average.

---

## 4. List decoding: An advanced perspective

### 4.1 The limit of unique decoding

Unique decoding based on minimum distance loses its guarantee beyond the threshold $(\delta-1)/2$. Even with more errors, however, it may still be possible to output a list of candidate codewords. This is the idea of **list decoding**.

### 4.2 Why this concept matters: A preview

RS codes are known to admit efficient list decoding within the range associated with the Johnson bound, for example through the Guruswami–Sudan algorithm. This provides a foundation for understanding how low-degree testing and FRI can tolerate some corruption while still providing quantitative soundness guarantees. In particular, bounds on FRI's soundness error connect to coding-theoretic parameters governing list decoding.

*We will not cover specific list-decoding algorithms today. The goal is to recognize the possibility of robust information recovery beyond unique decoding, and to understand that this idea supports later soundness analysis.*

---

## 5. Exercises: Minimum distance and parameter design

Work through the following examples during the lecture:

- Given concrete values of $n$ and $d$, calculate minimum distance and error-correcting capability.
- Discuss how choosing smaller or larger evaluation sets $D$ within the finite field changes the trade-off between the code rate $d/n$ and error-correcting capability.
- Ask why making $n$ too large worsens efficiency, particularly the prover's computational cost, as preparation for the design choices in FRI.

---

## Summary and next session

Today we learned:

- Reed–Solomon codes encode degree-bounded polynomials through their evaluation representations. The correspondence established by Lagrange interpolation in Session 3 directly underpins this construction.
- Minimum distance determines error-correcting capability, and RS codes are MDS codes that attain the Singleton bound.
- Shannon's probabilistic model and Hamming's worst-case model address different kinds of errors; the latter perspective is central to soundness analysis in proof systems.
- List decoding provides an advanced perspective that supports the soundness analysis of FRI in the next session.

In Session 6, we will study FRI as a concrete technique for low-degree testing. Using today's coding-theoretic tools, we will examine how to efficiently check whether a function supplied by a prover is close to a low-degree polynomial. We will also introduce general principles of soundness amplification and cryptographic proof techniques such as rewinding and the forking lemma.

---

## References and further reading

- MacWilliams and Sloane, [*The Theory of Error-Correcting Codes*](https://neilsloane.com/doc/ms77.html) — a standard coding-theory textbook; author's book information and errata.
- Guruswami and Sudan, [“Improved Decoding of Reed-Solomon and Algebraic-Geometric Codes,” 1999](https://www.cs.cmu.edu/~venkatg/pubs/papers.html) — foundations of RS list decoding; the author's publication list links the full version in PostScript format. [Public PDF of the conference version](https://people.csail.mit.edu/madhu/papers/1998/gs.pdf).
- Shannon, [“A Mathematical Theory of Communication,” 1948](https://www.cs.yale.edu/homes/yry/readings/general/shannon1948.pdf) — the original paper underlying the Shannon limit; public PDF hosted by Yale University.

## Suggested discussion questions

- Before Section 3.2, ask whether random errors and errors deliberately introduced by an adversary require the same countermeasures. This helps motivate the Hamming model.
- Have students derive $\delta = n-d+1$ from the fact that a nonzero polynomial has no more roots than its degree, strengthening the connection to Session 3.
- Introduce list decoding as a relaxation: even if we cannot identify a unique answer, can we narrow the candidates down? Use this to prepare the question of why FRI can still guarantee soundness.
