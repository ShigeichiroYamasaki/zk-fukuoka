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
</script>

# Session 5: Error-correcting codes and the information-theoretic perspective

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 29, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 5 in the syllabus](./#session-5) · [Session 5 exercises](../exercises/session-05)

## Position in the course and learning objectives

Last time, we translated computation into polynomial constraints. Today, consider what to check when receiving a table of polynomial values. Can we identify the original information if some entries differ? How different is a table obtained from a low-degree polynomial from one that is not? Coding theory gives us tools for these questions.

There are three learning objectives:

1. Understand Reed–Solomon codes as a natural encoding based on polynomial evaluation representations.
2. Understand how to evaluate error-correcting codes through information-theoretic perspectives, including Shannon and Hamming bounds.
3. Become familiar with list decoding and preview its connection to later quantitative soundness analysis.

Today's material provides the foundation for low-degree testing and FRI in Session 6. It also introduces a somewhat different but important perspective within Act II: measuring the robustness of proofs in the language of information theory.

---

::: tip Probability prerequisites
Session 5 uses the basics of random variables, events and independence. A channel model describes symbol changes as random events with specified probabilities. By contrast, error correction measured by Hamming distance counts worst-case error positions without assuming a probability distribution. Before comparing Shannon capacity with the Hamming bound, review the distinction between these models in Section 3 and the entropy-based reading of capacity in Section 3.4.
:::

## 1. Why do we need coding theory? — Motivation

### 1.1 Why arithmetization alone is not enough

Arithmetization specifies conditions satisfied by a correct computation. But a table submitted by the prover need not be the kind of object to which those conditions safely apply. Instead of a low-degree polynomial, the prover might select convenient values independently at each point. First define valid tables and how to measure deviation from them.

To prepare to answer this question, we introduce the concept of a **code**, particularly Reed–Solomon codes.

### 1.2 The fundamental question of coding theory

Communication adds redundancy so that the original message can be recovered after corruption. In a proof system, keeping valid data objects sufficiently separated can likewise help detect invalid data. Channel noise and deliberate prover misconduct have different causes, however; we will distinguish their error models.

---

## 2. Reed–Solomon codes

::: tip Mathematical prerequisites
Construct coefficient and evaluation fields in [Session 3: finite fields from irreducible polynomials](./session-03#extension-field-coding). For division, remainders, and roots, review [polynomial ring basics](./session-03#_3-1-definitions-and-basic-operations).
:::

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

<span id="figure-05-1"></span>
<span id="caption-05-1"></span>

<div class="captioned-table" id="table-05-1" role="group" aria-labelledby="table-caption-05-1">

<p class="table-caption" id="table-caption-05-1"><strong>Table 05-1：See RS distance in five evaluations</strong></p>

| Evaluation x | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| f(x)=2x+1 | 1 | 3 | 5 | 0 | 2 |
| g(x)=1 | 1 | 1 | 1 | 1 | 1 |
| Match? | ✓ | × | × | × | × |

</div>

RS code over F₇ of degree &lt;2, evaluated at 0–4. With n=5 and d=2, minimum distance is 4 and one error is uniquely correctable. The two displayed codewords differ in four positions.

### 2.4 Parameters and distances in equations {#rs-parameters}

Let $K=\mathbb F_q$ and $1\le d<n\le q$. Here $d$ is the **number of coefficients, or code dimension**, not the actual degree. Read a message $(a_0,\ldots,a_{d-1})\in K^d$ as $f(X)=\sum_{i=0}^{d-1}a_iX^i$ and evaluate at $n$ ordered, distinct points:

$$\mathcal C=\operatorname{RS}_{K,D,d}=\{(f(x_1),\ldots,f(x_n)):\deg f<d\}\subseteq K^n.$$

Evaluation is linear and, by the root bound with $n\ge d$, injective. Thus $|\mathcal C|=q^d$. The **rate** is $R=\log_q|\mathcal C|/n=d/n$, with $n-d$ redundant symbols. Message and codeword information amounts are $d\log_2q$ and $n\log_2q$ bits respectively; fixed-length implementations may require rounding or other encoding overhead.

For words $u,v\in K^n$, define **Hamming distance** and **relative distance**:

$$d_H(u,v)=|\{i:u_i\ne v_i\}|,\qquad \Delta(u,v)=d_H(u,v)/n.$$

A changed symbol counts as one regardless of how many of its bits change. Our $\delta=n-d+1$ counts positions; relative minimum distance is $\delta/n$.

Distinct $f,g$ differ by a nonzero polynomial of degree at most $d-1$, so they agree at at most $d-1$ evaluation points. Distance is at least $n-d+1$. Equality is attained by comparing zero with $h(X)=\prod_{j=1}^{d-1}(X-x_j)$, whose roots are exactly those $d-1$ domain points. For $d=1$, use the empty product 1. This proves the exact distance, not just a lower bound.

For the Singleton bound, delete any $\delta-1$ coordinates. Distinct codewords remain distinct, leaving length $n-\delta+1$. Hence $q^d\le q^{n-\delta+1}$ and $\delta\le n-d+1$. RS attains this upper bound and is therefore MDS.

### 2.5 Errors, erasures, and uniqueness

If a received word $r$ is within $t$ errors of two codewords $c,c'$, the triangle inequality gives $d_H(c,c')\le2t$. Thus $2t<\delta$ ensures at most one candidate, yielding $t\le\lfloor(\delta-1)/2\rfloor$.

An **erasure** has a known missing location, unlike an error whose location and value are unknown. Any $d$ surviving RS evaluations allow interpolation, so $n-d$ erasures are recoverable. With $t$ errors and $e$ erasures, the unique-decoding guarantee is

$$2t+e<\delta\quad\Longleftrightarrow\quad 2t+e\le n-d.$$

Uniqueness is a mathematical property; finding the answer efficiently is a separate algorithmic question. Section 5 gives a concrete decoding calculation.


---

## 3. The information-theoretic perspective: Shannon and Hamming bounds

### 3.1 Two different error models

Before asking how many errors can be corrected, decide how errors arise. Modeling natural noise probabilistically and allowing an adversary to choose positions and values deliberately require different guarantees.

The **Shannon model** specifies a probabilistic channel; independent symbol errors are one example. Channel capacity bounds rates achievable with asymptotically vanishing decoding error. Do not read reliable transmission as necessarily having zero error at finite blocklength.

**The Hamming model (worst-case errors):** Make no probabilistic assumption about error locations or values, and consider how much corruption can occur in the worst case. The Hamming bound, or sphere-packing bound, limits what codes can achieve against such errors.

### 3.2 Why this distinction matters for proof systems

A verifier cannot assume that a prover’s errors are independent random noise. The prover may choose positions and values that are likely to pass inspection. We therefore need worst-case properties, such as distance from codewords. Randomizing the verifier’s queries is different from assuming the errors themselves are random.

<span id="figure-05-2"></span>
<span id="caption-05-2"></span>

<div class="captioned-table" id="table-05-2" role="group" aria-labelledby="table-caption-05-2">

<p class="table-caption" id="table-caption-05-2"><strong>Table 05-2：Separate noise models from adversarial models</strong></p>

| Item | Explanation |
| --- | --- |
| Shannon perspective | Specify a probabilistic channel. Study rate and decoding failure probability. |
| Hamming perspective | Allow worst-case error locations and values. Study distance and error correction. |

</div>

Verifier randomness randomizes checks on adversarial data; it does not assume cheating behaves like natural random noise.

### 3.3 Deriving the Hamming bound from ball volume

The number of words obtained by changing at most $t$ symbols of a length-$n$ word is

$$V_q(n,t)=\sum_{i=0}^{t}\binom ni(q-1)^i.$$

Choose $i$ positions and one of $q-1$ different values at each. If $2t<\delta$, the balls around codewords are disjoint and must fit within $q^n$ words:

$$|\mathcal C|V_q(n,t)\le q^n,\qquad R\le1-\frac1n\log_q V_q(n,t).$$

This is a necessary bound, not an achievability guarantee. For a $[7,3,5]_7$ RS code, $t=2$ gives $V_7(7,2)=1+7\cdot6+21\cdot36=799$ and $7^3\cdot799=274057\le7^7=823543$. Attaining Singleton does not imply attaining Hamming with equality.

### 3.4 Reading Shannon capacity through entropy

Specify the channel: a memoryless **$q$-ary symmetric channel** preserves its input with probability $1-\eta$ and otherwise selects uniformly from the other $q-1$ symbols. For $0\le\eta\le1-1/q$, capacity in $q$-ary symbols per channel use is

$$C_q=1-h_q(\eta),\qquad h_q(\eta)=\eta\log_q(q-1)-\eta\log_q\eta-(1-\eta)\log_q(1-\eta),$$

with $0\log0=0$. In bits it is $(1-h_q(\eta))\log_2q$: intuitively, one symbol's information minus uncertainty introduced by noise.

For the binary symmetric channel, $h_2(\eta)=-\eta\log_2\eta-(1-\eta)\log_2(1-\eta)$. At $\eta=0.1$, capacity is approximately 0.531 bits per use. Below capacity, codes exist with decoding error tending to zero as blocklength grows. This does not promise zero error at finite length, automatic capacity achievement by RS, or an efficient decoder.

Entropy also appears in Hamming: for fixed $q$ and $t/n\to\tau$ with $0<\tau<1-1/q$, $\frac1n\log_qV_q(n,t)\to h_q(\tau)$. But Hamming bounds correction of **every error pattern of weight at most $t$**, whereas Shannon measures error under a **specified probabilistic channel**. Similar formulas describe different guarantees.


---

## 4. List decoding: An advanced perspective

### 4.1 The limit of unique decoding

Beyond $(\delta-1)/2$ errors, the original codeword may not be uniquely determined. What if we relax the requirement of choosing exactly one? Instead, produce a short list of codewords within a specified distance. This is list decoding.

### 4.2 Why this concept matters: A preview

For Reed–Solomon codes, algorithms such as Guruswami–Sudan support list decoding in a range related to the Johnson bound. FRI analysis also needs to bound how many low-degree polynomials can be nearby. This does not mean the verifier performs list decoding on every execution; properties of candidate counts and distance inform the soundness-error analysis.

*We will not cover specific list-decoding algorithms today. The goal is to recognize the possibility of robust information recovery beyond unique decoding, and to understand that this idea supports later soundness analysis.*

Received word, possibly corrupted

<span id="figure-05-3"></span>
<span id="caption-05-3"></span>

<div class="captioned-table" id="table-05-3" role="group" aria-labelledby="table-caption-05-3">

<p class="table-caption" id="table-caption-05-3"><strong>Table 05-3：Unique versus list decoding: what must be returned?</strong></p>

| Item | Explanation |
| --- | --- |
| Unique decoding | Within the guaranteed radius, identify one codeword. |
| List decoding | Return a bounded list of codewords within a specified radius. |

</div>

Conceptual comparison. Allowing a list does not correct arbitrary corruption: radius and list-size conditions are required. FRI verification does not run a decoder at every query.

### 4.3 Candidate lists and the Johnson radius

Define the radius-$t$ list for a received word $r$ by

$$\mathcal L_t(r)=\{f\in K[X]:\deg f<d,\ d_H(\operatorname{ev}_D(f),r)\le t\}.$$

Within the unique-decoding radius it has at most one candidate. Beyond that, we need both inclusion of the transmitted candidate and control of list size.

A Johnson-type radius for RS is $J=n-\sqrt{n(d-1)}$. Guruswami–Sudan decoding handles a range strictly inside this radius. Boundary and runtime details depend on parameters, so use $t<J$ here and retain a gap from the boundary in asymptotic bounds. Its relative version is $1-\sqrt{(d-1)/n}$, approaching $1-\sqrt R$ for fixed rate $R=d/n$ as $n$ grows.

For $n=7,d=3$, unique decoding guarantees two errors, while $J=7-\sqrt{14}\approx3.258$ includes a list-decoding radius of three errors. Coding information alone need not identify which candidate was sent. Nor can this radius be substituted directly for FRI soundness error: folding and query analysis are additional requirements.


---

## 5. Exercises: Minimum distance and parameter design

Use the formulas to investigate what changes when evaluation points are added. Besides error tolerance, the amount of data and evaluation work changes. In the following examples, consider the guarantee together with the work needed to obtain it.

- Given concrete values of $n$ and $d$, calculate minimum distance and error-correcting capability.
- Discuss how choosing smaller or larger evaluation sets $D$ within the finite field changes the trade-off between the code rate $d/n$ and error-correcting capability.
- Ask why making $n$ too large worsens efficiency, particularly the prover's computational cost, as preparation for the design choices in FRI.

### 5.1 Recovering a polynomial from two corrupted symbols

Take $K=\mathbb F_7$, $D=(0,1,2,3,4,5,6)$, and $d=3$. Message $(1,2,1)$ represents $f(X)=1+2X+X^2$, whose codeword is

$$c=(1,4,2,2,4,1,0).$$

Rate is $3/7$, minimum distance is 5, and we can uniquely correct two errors or recover four erasures. Suppose values at points 1 and 4 are corrupted, producing $r=(1,5,2,2,6,1,0)$. Their locations are unknown to the receiver.

The Berlekamp–Welch approach solves simultaneously for an error-locator polynomial $E$ and $Q=Ef$. Assume at most two errors, set $E=X^2+e_1X+e_0$, and require $\deg Q\le4$. At all evaluation points impose

$$Q(x_i)=r_iE(x_i).$$

The two unknown coefficients of $E$ and five of $Q$ give seven unknowns in seven **linear equations**, since $r_i$ are known. For this example the solution is

$$E=(X-1)(X-4)=X^2+2X+4,\qquad Q=X^4+4X^3+2X^2+3X+4.$$

At corrupted points both $E$ and $Q$ vanish; elsewhere $r_i=f(x_i)$. Dividing $Q$ by $E$ leaves zero remainder and recovers $f=X^2+2X+1$. Finally re-evaluate and check disagreement with the received word in at most two positions. This uses both field division on coefficients and polynomial division with remainder.

### 5.2 Complexity and the distinction from FRI testing

Straightforward Horner evaluation at every point encodes in $O(nd)$ field operations. Solving the generalized decoding equations by ordinary elimination gives an upper bound of $O(n^3)$ field operations when $d+2t\le n$; this is not an optimal decoding complexity bound. Field-operation bit costs are additional. FFT/NTT acceleration requires suitable evaluation-domain structure.

FRI aims to test proximity to a low-degree code using few queries, rather than read the entire table and decode the message. Define $\Delta(r,\mathcal C)=\min_{c\in\mathcal C}d_H(r,c)/n$. For a particular fixed codeword $c$ differing in $\rho n$ positions, $s$ independent uniform position tests all agree with probability $(1-\rho)^s$. But **the nearest codeword is unknown, so this comparison is not automatically available**. The additional machinery is the subject of the next session.


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

- Venkatesan Guruswami, [Introduction to Coding Theory — course notes](https://www.cs.cmu.edu/~venkatg/teaching/codingtheory/) — distance, bounds, and RS decoding.
- [RS list decoding lecture notes](https://www.cs.cmu.edu/~venkatg/teaching/au18-coding-theory/lec-scribes/RS-list-decoding.pdf) — Johnson radius and list decoding.

## Suggested discussion questions

- Before Section 3.2, ask whether random errors and errors deliberately introduced by an adversary require the same countermeasures. This helps motivate the Hamming model.
- Have students derive $\delta = n-d+1$ from the fact that a nonzero polynomial has no more roots than its degree, strengthening the connection to Session 3.
- Introduce list decoding as a relaxation: even if we cannot identify a unique answer, can we narrow the candidates down? Use this to prepare the question of why FRI can still guarantee soundness.

---

## Session 5 exercise

Check the lecture concepts with calculations and concrete examples in the [Session 5 exercise](../exercises/session-05).
