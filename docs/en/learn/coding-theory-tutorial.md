# Coding theory: foundations for learning ZK

Author: Shigeichiro Yamasaki  
Created: September 29, 2026  
Last updated: September 29, 2026

Coding theory studies how to encode information with redundancy so that errors can be detected and corrected. Zero-knowledge proofs use code distance and low-degree testing not only to handle accidental channel noise, but also to detect data deliberately crafted by a dishonest prover. This tutorial covers the foundations needed for Session 5’s Reed–Solomon codes and Session 6’s low-degree testing and FRI.

The explanations and examples are original to this site. For systematic study, see G. A. Jones and J. M. Jones, [Information and Coding Theory](https://link.springer.com/book/10.1007/978-1-4471-0361-5). The Japanese edition, [『情報理論と符号理論』](https://ndlsearch.ndl.go.jp/books/R100000002-I000008349030), is catalogued by the National Diet Library. This page does not reproduce or adapt the book; it explains concepts needed for this course through original examples.

## 1. The basics of encoding

Let $\Sigma$ be a set of symbols called an **alphabet**. A **code** is a subset $C\subseteq\Sigma^n$ of the length-$n$ strings, selected for encoding or checking. An element of $C$ is a **codeword**.

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

This is a Reed–Solomon (RS) code. A codeword is a vector of evaluation values of a low-degree polynomial. With $n$ evaluation points and maximum degree $k-1$, its minimum distance is

$$
d_{\min}=n-k+1,
$$

under the usual condition $n\le q$. The difference of two distinct degree-<$k$ polynomials is nonzero and has degree less than $k$, so it has at most $k-1$ roots. Therefore two codewords agree in at most $k-1$ positions and differ in at least $n-k+1$.

### A small example

Over $\mathbb F_7$, take evaluation points $0,1,2,3,4$ and polynomials of degree less than $2$. The codeword for $f(X)=2X+1$ is

$$
(f(0),f(1),f(2),f(3),f(4))=(1,3,5,0,2)\quad(\bmod 7).
$$

Here $n=5$ and $k=2$, so the minimum distance is $5-2+1=4$ and the code uniquely corrects $\lfloor(4-1)/2\rfloor=1$ error. All component operations take place in $\mathbb F_7$, not over the real numbers.

## 4. Dimension, rate, and distance

The source polynomial is determined by $k$ coefficients, so the RS code has $q^k$ codewords. It carries $k$ degrees of freedom in a length-$n$ word; its **rate** is $R=k/n$. The relative minimum distance $d_{\min}/n$ measures how far apart different codewords are.

For an RS code, $d_{\min}=n-k+1$. Increasing the rate to carry more information per symbol reduces the distance, and therefore reduces the error-correction margin. Allocating a limited word length between information and error tolerance is a basic coding tradeoff.

## 5. Channel errors and adversarial errors

Communication coding may model symbols as changing randomly because of noise. Probability of error and channel capacity are then important performance measures. In cryptographic soundness, however, errors may be chosen deliberately by a malicious prover. We therefore distinguish average-case tolerance to random noise from worst-case guarantees based on Hamming distance and the soundness error of a randomized check.

“Worst-case error” and “probabilistic test error” are different notions. The first measures how many positions of data were changed; the second measures the probability that the verifier’s random choices miss dishonest data. FRI soundness combines code proximity with a probabilistic analysis of its tests.

## 6. Unique decoding and list decoding

Unique decoding recovers a single codeword when the received word lies in a region where there is exactly one nearby codeword. The general minimum-distance guarantee allows up to $\lfloor(d_{\min}-1)/2\rfloor$ errors.

Even beyond that radius, it may be possible to output a list of several nearby candidate codewords. This is **list decoding**. Narrowing the possibilities to a small list can be useful even when there is no unique answer. Reed–Solomon codes have algorithms that decode beyond the unique-decoding radius, but list decoding does not always return a short list; the distance range and list size have conditions.

## 7. Connecting to FRI and low-degree testing

The set of evaluation vectors of low-degree polynomials is an RS code. Thus, checking whether a supplied table equals or is close to the evaluation vector of a low-degree polynomial can be viewed as a **membership test** or **proximity test** for the RS code.

Reading every evaluation value would be expensive. FRI uses commitments and random queries to efficiently test the claim that a supplied function is close to a low-degree polynomial. Its goal is not to recover the original codeword from a noisy channel; it is to test low-degree structure with a small number of queries.

When probability appears in FRI’s analysis, distinguish the random positions selected by the verifier after the function and commitment are fixed from the probability that the test accepts a false claim. For that probabilistic material, see the [probability tutorial](./probability-tutorial).

## 8. Terms needed in this course

| Term | Meaning | Use in the course |
| --- | --- | --- |
| Code and codeword | A set of permitted fixed-length strings and one member of that set | View polynomial evaluation vectors as an RS code |
| Hamming distance | Number of positions where two strings differ | Measure the number of errors and the notion of closeness |
| Minimum distance | Minimum Hamming distance between distinct codewords | Derive error-detection and unique-correction guarantees |
| Rate | Ratio of information content to codeword length | Understand the tradeoff between information and error tolerance |
| Unique decoding | Recover one nearby codeword | Understand distance-based correction guarantees |
| List decoding | Enumerate several nearby candidate codewords | Learn advanced context for proximity and FRI soundness |
| Proximity testing | Query whether an object is close to a codeword | Understand the goal of low-degree testing and FRI |

## Exercises

**Exercise 1.** Find the minimum distance and the number of uniquely correctable errors for $C=\{0000,1111\}$.

**Answer.** The minimum distance is $4$, so the code uniquely corrects $\lfloor(4-1)/2\rfloor=1$ error.

**Exercise 2.** An RS code has $n=8$ evaluation points and maximum polynomial degree $k-1=3$. Find its minimum distance and rate.

**Answer.** $d_{\min}=n-k+1=8-4+1=5$, and the rate is $k/n=4/8=1/2$.

**Exercise 3.** Explain why two distinct RS codewords can agree in at most $k-1$ positions.

**Answer.** Their difference is a nonzero polynomial of degree less than $k$, which has at most $k-1$ roots.

## Continue learning

- [Session 5: Error-correcting codes and information-theoretic perspective](./session-05): study minimum distance, random channel noise, and adversarial errors in the course sequence
- [Session 6: Low-degree testing and soundness amplification](./session-06): understand FRI as an RS-code proximity test
- [Finite fields and polynomials: a compact tutorial for ZK](./finite-fields-tutorial): review the field used for RS coefficients and evaluations
- [Probability: foundations for learning ZK](./probability-tutorial): study randomized tests and error probabilities
- Further reading: [Information and Coding Theory, G. A. Jones and J. M. Jones (Springer)](https://link.springer.com/book/10.1007/978-1-4471-0361-5) · [Japanese edition catalogued by the National Diet Library](https://ndlsearch.ndl.go.jp/books/R100000002-I000008349030)
