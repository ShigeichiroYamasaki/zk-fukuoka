# Coding theory: foundations for learning ZK

Author: Shigeichiro Yamasaki  
Created: September 29, 2026  
Last updated: September 30, 2026

Coding theory studies how to encode information with redundancy so that errors can be detected and corrected. Zero-knowledge proofs use code distance and low-degree testing not only to handle accidental channel noise, but also to detect data deliberately crafted by a dishonest prover. This tutorial covers the foundations needed for Session 5’s Reed–Solomon codes and Session 6’s low-degree testing and FRI.

This tutorial connects coding theory to the finite-field and polynomial tutorial. The key prerequisites are using field elements as symbols, working with degree in the polynomial ring $\mathbb F_q[X]$, arranging evaluations at distinct points into a vector, and using the fact that a nonzero polynomial has at most its degree many roots. For field constructions and polynomial-ring background, see [Finite fields and polynomials](./finite-fields-tutorial).

The explanations and examples are original to this site. For systematic study, see G. A. Jones and J. M. Jones, [Information and Coding Theory](https://link.springer.com/book/10.1007/978-1-4471-0361-5). The Japanese edition, [『情報理論と符号理論』](https://ndlsearch.ndl.go.jp/books/R100000002-I000008349030), is catalogued by the National Diet Library. This page does not reproduce or adapt the book; it explains concepts needed for this course through original examples.

## 1. The basics of encoding

Let $\Sigma$ be a set of symbols called an **alphabet**. A **code** is a subset $C\subseteq\Sigma^n$ of the length-$n$ strings, selected for encoding or checking. An element of $C$ is a **codeword**. Reed–Solomon codes use the finite field $\mathbb F_q$ as their alphabet, so one symbol is one field element. Here $q=p^m$ for a prime $p$ and integer $m\ge1$; $\mathbb F_q$ is a field with $q$ elements. When $m=1$ it is the prime field $\mathbb F_p$; when $m>1$ it is an extension field, whose elements may be represented by polynomial residue classes. Hamming distance counts one extension-field element as one symbol, not as the several bits in its internal representation.

For example, over the binary alphabet $\Sigma=\{0,1\}$, let $C=\{000,111\}$. Encode the information bit $0$ as $000$ and $1$ as $111$. One bit of information is represented by three bits, introducing redundancy. If the received word is $101$, it differs from codeword $111$ in only one position, so under this code’s rule we can infer that $111$ was sent.

This example illustrates why codewords can be distinguished when only a few errors occur. Distance quantifies how well separated they are.

## 2. Hamming distance and minimum distance

The **Hamming distance** $d_H(x,y)$ between equal-length strings $x,y\in\Sigma^n$ is the number of positions in which they differ. In the example above, $d_H(101,111)=1$ and the distance between the codewords is $d_H(000,111)=3$.

The **minimum distance** of a code $C$ is

$$
d_{\min}=\min_{c,c'\in C,\ c\ne c'}d_H(c,c').
$$

A larger minimum distance gives greater separation between distinct codewords.

- Up to $d_{\min}-1$ errors can always be detected.
- Up to $t=\left\lfloor(d_{\min}-1)/2\right\rfloor$ errors can be uniquely corrected.

For unique correction, suppose a received word were within distance $t$ of two different codewords. Those codewords would then be at distance at most $2t$, contradicting the minimum-distance condition. Thus the radius-$t$ error neighborhoods around codewords do not overlap.

## 3. Reed–Solomon codes: encoding by polynomial evaluation

Choose $n$ distinct evaluation points $a_1,\ldots,a_n$ from a finite field $\mathbb F_q$. Map a polynomial $f\in\mathbb F_q[X]$ of degree less than $k$ to

$$
\operatorname{Enc}(f)=(f(a_1),\ldots,f(a_n)).
$$

This is a Reed–Solomon (RS) code. Here $\mathbb F_q[X]$ is the polynomial ring with coefficients in $\mathbb F_q$, and $f(a_i)$ is obtained by evaluating at a field element using field arithmetic. The polynomial ring itself is generally not a field (for example, $X$ has no polynomial inverse), but encoding uses the field elements obtained by evaluation. A codeword is a vector of evaluation values of a low-degree polynomial. Assume $1\le k\le n\le q$, so $n$ distinct evaluation points exist and the evaluation map is injective on degree-<$k$ polynomials. With maximum degree $k-1$, its minimum distance is

$$
d_{\min}=n-k+1
$$

To derive this, take distinct degree-<$k$ polynomials $f,g$. Their difference $h=f-g$ is a nonzero polynomial of degree less than $k$ in $\mathbb F_q[X]$. A nonzero polynomial has at most its degree many roots, so $h$ vanishes at at most $k-1$ evaluation points. Thus the codewords $\operatorname{Enc}(f)$ and $\operatorname{Enc}(g)$ agree in at most $k-1$ positions and differ in at least $n-(k-1)=n-k+1$. This lower bound is attained by $h(X)=\prod_{j=1}^{k-1}(X-a_j)$, with the empty product defined as 1 when $k=1$. Hence the minimum-distance formula follows.

This encoding is also a linear map over $\mathbb F_q$: evaluating a sum or scalar multiple of polynomials gives the corresponding sum or scalar multiple of evaluation vectors. When $k\le n$, distinct degree-<$k$ polynomials cannot give the same vector, since their difference would have at least $n\ge k$ roots. Therefore the code has dimension $k$ and contains $q^k$ codewords.

### A small example

Over $\mathbb F_7$, take evaluation points $0,1,2,3,4$ and polynomials of degree less than $2$. The codeword for $f(X)=2X+1$ is

$$
(f(0),f(1),f(2),f(3),f(4))=(1,3,5,0,2)\quad(\bmod 7).
$$

Here $n=5$ and $k=2$, so the minimum distance is $5-2+1=4$ and the code uniquely corrects $\lfloor(4-1)/2\rfloor=1$ error. All component operations take place in $\mathbb F_7$, not over the real numbers.

For example, the constant polynomial $g(X)=1$ has codeword $(1,1,1,1,1)$, at Hamming distance 4 from the codeword for $f$. Their difference $f-g=2X$ vanishes only at evaluation point 0, so the vectors agree in exactly one of five coordinates. This illustrates the root bound behind the distance $5-2+1=4$.

## 4. Dimension, rate, and distance

The source polynomial is determined by $k$ coefficients, so the RS code has $q^k$ codewords. It carries $k$ degrees of freedom in a length-$n$ word; its **rate in $\mathbb F_q$ symbols** is $R=k/n$. In bits, it carries $k\log_2q$ bits in a word of $n\log_2q$ bits, giving the same ratio. The relative minimum distance $\delta=d_{\min}/n$ measures how far apart different codewords are.

An RS code has $d_{\min}=n-k+1$ and attains the Singleton bound $d_{\min}\le n-k+1$; it is therefore a maximum-distance separable (MDS) code. Increasing the rate to carry more information per symbol reduces the relative distance and therefore reduces the error-correction margin. Allocating a limited word length between information and error tolerance is a basic coding tradeoff.

## 5. Channel errors and adversarial errors

Communication coding may model symbols as changing randomly through a noisy channel. Shannon’s coding theorem studies the information rates that can be transmitted with low error probability under a probabilistic channel model. The **Hamming bound** (sphere-packing bound), by contrast, says that if a length-$n$ code over an alphabet of size $q$ has minimum distance $d_{\min}$ and uniquely corrects $t=\lfloor(d_{\min}-1)/2\rfloor$ errors, then disjoint Hamming balls imply

$$
|C|\sum_{j=0}^{t}\binom{n}{j}(q-1)^j\le q^n.
$$

Shannon’s limit concerns asymptotic transmission over a probabilistic channel; the Hamming bound is a combinatorial constraint for worst-case error locations. They answer different questions. In cryptographic soundness, a malicious prover can choose invalid data, so average tolerance to noise is not enough. We must distinguish worst-case guarantees based on distance from the soundness error of a verifier’s randomized test.

“Worst-case error” and “probabilistic test error” are different notions. The first measures how many positions of data were changed; the second measures the probability that the verifier’s random choices miss dishonest data. FRI soundness combines code proximity with a probabilistic analysis of its tests.

## 6. Unique decoding and list decoding

Unique decoding recovers a single codeword when the received word lies in a region where there is exactly one nearby codeword. The general minimum-distance guarantee allows up to $\lfloor(d_{\min}-1)/2\rfloor$ errors.

Given a received word $y\in\mathbb F_q^n$ and radius $\rho n$, **list decoding** asks for the set

$$
L(y,\rho)=\{c\in C:d_H(c,y)\le\rho n\}.
$$

Narrowing the possibilities to a small list can be useful even when there is no unique answer. Reed–Solomon codes have algorithms that decode beyond the unique-decoding radius, but list decoding does not always return a short list; the distance range and list size have conditions. Session 5 introduces the idea, and Session 6 connects it to FRI proximity and soundness.

## 7. Connecting to FRI and low-degree testing

The set of evaluation vectors of degree-<$k$ polynomials over a finite field, on fixed evaluation points, is an RS code. Checking whether a supplied table exactly equals such an evaluation vector is a **membership test**. Checking whether some such vector lies within a specified Hamming distance is a **proximity test**. These are different questions; FRI tests low-degree structure and proximity rather than performing channel decoding.

Reading every evaluation value would be expensive. FRI combines commitments to evaluations with interactive random queries to test whether a supplied function is close to a low-degree polynomial; it is an IOP of Proximity. Some constructions are made non-interactive using Fiat–Shamir. Its goal is not to recover the original codeword from a noisy channel; it is to test low-degree structure with a small number of queries.

When probability appears in FRI’s analysis, distinguish the random positions selected by the verifier after the function and commitment are fixed from the probability that the test accepts a false claim. For that probabilistic material, see the [probability tutorial](./probability-tutorial).

## 8. Terms needed in this course

| Term | Meaning | Use in the course |
| --- | --- | --- |
| Code and codeword | A set of permitted fixed-length strings and one member of that set | View polynomial evaluation vectors as an RS code |
| Hamming distance | Number of positions where two strings differ | Measure the number of errors and the notion of closeness |
| Minimum distance | Minimum Hamming distance between distinct codewords | Derive error-detection and unique-correction guarantees |
| Rate | Ratio of information content to codeword length | Understand the tradeoff between information and error tolerance |
| RS evaluation map | Evaluates a polynomial at specified points to form a vector over the field | Connect low-degree polynomials to codewords |
| Membership and proximity tests | Test exact code membership or closeness to a codeword | Distinguish low-degree testing from decoding |
| Unique decoding | Recover one nearby codeword | Understand distance-based correction guarantees |
| List decoding | Enumerate several nearby candidate codewords | Learn advanced context for proximity and FRI soundness |
| Proximity testing | Query whether an object is close to a codeword | Understand the goal of low-degree testing and FRI |

## Exercises

**Exercise 1.** Find the minimum distance and the number of uniquely correctable errors for $C=\{0000,1111\}$.

**Answer.** The minimum distance is $4$, so the code uniquely corrects $\lfloor(4-1)/2\rfloor=1$ error.

**Exercise 2.** Over $\mathbb F_{11}$, an RS code uses $n=8$ distinct evaluation points and polynomials of maximum degree $k-1=3$. Find its minimum distance, rate in $\mathbb F_{11}$ symbols, and number of uniquely correctable errors.

**Answer.** $k=4$, so $d_{\min}=n-k+1=8-4+1=5$, the rate is $k/n=4/8=1/2$, and the code uniquely corrects $\lfloor(5-1)/2\rfloor=2$ errors. Since $n=8\le11$, eight distinct evaluation points can be chosen.

**Exercise 3.** Explain why two distinct RS codewords can agree in at most $k-1$ positions.

**Answer.** Their difference is a nonzero polynomial of degree less than $k$, which has at most $k-1$ roots.

## Continue learning

- [Session 5: Error-correcting codes and information-theoretic perspective](./session-05): study minimum distance, random channel noise, and adversarial errors in the course sequence
- [Session 6: Low-degree testing and soundness amplification](./session-06): understand FRI as an RS-code proximity test
- [Finite fields and polynomials: a compact tutorial for ZK](./finite-fields-tutorial): review the field used for RS coefficients and evaluations
- [Probability: foundations for learning ZK](./probability-tutorial): study randomized tests and error probabilities
- Further reading: [Information and Coding Theory, G. A. Jones and J. M. Jones (Springer)](https://link.springer.com/book/10.1007/978-1-4471-0361-5) · [Japanese edition catalogued by the National Diet Library](https://ndlsearch.ndl.go.jp/books/R100000002-I000008349030)
