---
outline: [2, 3]
prev:
  text: Session 4 · Arithmetization techniques and complexity theory
  link: /en/learn/session-04
next:
  text: Session 6 · Low-degree testing and soundness amplification
  link: /en/learn/session-06
---

<script setup>
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
</script>

# Session 5: Error-correcting codes and the information-theoretic perspective

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 27, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 5 in the syllabus](./#session-5) · [Exercises](../exercises/)

## Position in the course and learning objectives

Last time, we translated computation into polynomial constraints. Today, consider what to check when receiving a table of polynomial values. Can we identify the original information if some entries differ? How different is a table obtained from a low-degree polynomial from one that is not? Coding theory gives us tools for these questions.

There are three learning objectives:

1. Understand Reed–Solomon codes as a natural encoding based on polynomial evaluation representations.
2. Understand how to evaluate error-correcting codes through information-theoretic perspectives, including Shannon and Hamming bounds.
3. Become familiar with list decoding and preview its connection to later quantitative soundness analysis.

Today's material provides the foundation for low-degree testing and FRI in Session 6. It also introduces a somewhat different but important perspective within Act II: measuring the robustness of proofs in the language of information theory.

---

## 1. Why do we need coding theory? — Motivation

### 1.1 Why arithmetization alone is not enough

Arithmetization specifies conditions satisfied by a correct computation. But a table submitted by the prover need not be the kind of object to which those conditions safely apply. Instead of a low-degree polynomial, the prover might select convenient values independently at each point. First define valid tables and how to measure deviation from them.

To prepare to answer this question, we introduce the concept of a **code**, particularly Reed–Solomon codes.

### 1.2 The fundamental question of coding theory

Communication adds redundancy so that the original message can be recovered after corruption. In a proof system, keeping valid data objects sufficiently separated can likewise help detect invalid data. Channel noise and deliberate prover misconduct have different causes, however; we will distinguish their error models.

---

## 2. Reed–Solomon codes

### 2.1 Definition

Consider the encoding that maps every polynomial of degree less than $d$, from $\{f \in \mathbb{F}[X] : \deg f < d\}$, to its vector of values on an evaluation set $D = \{x_1, \dots, x_n\} \subseteq \mathbb{F}$, with $n > d$:

$$f \mapsto (f(x_1), f(x_2), \dots, f(x_n))$$

This mapping is a Reed–Solomon code. After fixing the polynomial, we evaluate it at more points than are needed to determine it. The extra values are not unrelated data; they come from the same polynomial. That relationship supplies redundancy. Read Session 3’s interpolation now as a representation that protects information.

### 2.2 Minimum distance

If two messages produce almost identical tables, a few errors may make them indistinguishable. Measure the minimum number of positions at which distinct codewords differ: the **minimum distance**. For the Reed–Solomon code with the preceding degree bound, it is:

$$\delta = n - d + 1$$

This follows from the fact established in Session 3: a nonzero polynomial of degree at most $d-1$ has at most $d-1$ roots. Equivalently, two distinct codewords can agree at no more than $d-1$ evaluation points. A larger minimum distance allows more errors to be corrected.

### 2.3 Error-correcting capability

For minimum distance $\delta$, changing at most $\lfloor(\delta-1)/2\rfloor$ positions around each codeword gives disjoint neighborhoods. This is why unique correction is possible. Reed–Solomon codes attain the Singleton bound for length $n$ and dimension $d$, making them MDS codes. Notice how distance determines the number of correctable errors.

<StudyDiagram id="05-1" :en="true" />

---

## 3. The information-theoretic perspective: Shannon and Hamming bounds

### 3.1 Two different error models

Before asking how many errors can be corrected, decide how errors arise. Modeling natural noise probabilistically and allowing an adversary to choose positions and values deliberately require different guarantees.

The **Shannon model** specifies a probabilistic channel; independent symbol errors are one example. Channel capacity bounds rates achievable with asymptotically vanishing decoding error. Do not read reliable transmission as necessarily having zero error at finite blocklength.

**The Hamming model (worst-case errors):** Make no probabilistic assumption about error locations or values, and consider how much corruption can occur in the worst case. The Hamming bound, or sphere-packing bound, limits what codes can achieve against such errors.

### 3.2 Why this distinction matters for proof systems

A verifier cannot assume that a prover’s errors are independent random noise. The prover may choose positions and values that are likely to pass inspection. We therefore need worst-case properties, such as distance from codewords. Randomizing the verifier’s queries is different from assuming the errors themselves are random.

<StudyDiagram id="05-2" :en="true" />

---

## 4. List decoding: An advanced perspective

### 4.1 The limit of unique decoding

Beyond $(\delta-1)/2$ errors, the original codeword may not be uniquely determined. What if we relax the requirement of choosing exactly one? Instead, produce a short list of codewords within a specified distance. This is list decoding.

### 4.2 Why this concept matters: A preview

For Reed–Solomon codes, algorithms such as Guruswami–Sudan support list decoding in a range related to the Johnson bound. FRI analysis also needs to bound how many low-degree polynomials can be nearby. This does not mean the verifier performs list decoding on every execution; properties of candidate counts and distance inform the soundness-error analysis.

*We will not cover specific list-decoding algorithms today. The goal is to recognize the possibility of robust information recovery beyond unique decoding, and to understand that this idea supports later soundness analysis.*

<StudyDiagram id="05-3" :en="true" />

---

## 5. Exercises: Minimum distance and parameter design

Use the formulas to investigate what changes when evaluation points are added. Besides error tolerance, the amount of data and evaluation work changes. In the following examples, consider the guarantee together with the work needed to obtain it.

- Given concrete values of $n$ and $d$, calculate minimum distance and error-correcting capability.
- Discuss how choosing smaller or larger evaluation sets $D$ within the finite field changes the trade-off between the code rate $d/n$ and error-correcting capability.
- Ask why making $n$ too large worsens efficiency, particularly the prover's computational cost, as preparation for the design choices in FRI.

---

## Summary and next session

Today we reread polynomial evaluation tables as codes. Check how distance between tables helps distinguish errors.

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
