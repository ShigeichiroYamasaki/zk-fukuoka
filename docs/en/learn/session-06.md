---
outline: [2, 3]
prev:
  text: Session 5 · Error-correcting codes and the information-theoretic perspective
  link: /en/learn/session-05
next:
  text: Session 7 · Elliptic curves and pairings (syllabus)
  link: /en/learn/#session-7
---

# Session 6: Low-degree testing and soundness amplification

::: info Lecture manuscript
This page is an English translation of the supplied Session 6 lecture manuscript.
:::

[Sessions](./sessions) · [Topics](./topics) · [Session 6 in the syllabus](./#session-6) · [Exercises](../exercises/)

## Position in the course and learning objectives

In the previous session, we learned about Reed–Solomon codes and why the Hamming worst-case model is central to soundness analysis in proof systems. Today we apply these ideas to FRI, a protocol for efficiently checking whether a function supplied by a prover is close to a low-degree polynomial. We also introduce soundness amplification and cryptographic proof techniques, including rewinding and the forking lemma.

There are three learning objectives:

1. Understand the low-degree testing problem and why naive approaches struggle to achieve efficiency.
2. Understand FRI's recursive folding structure and how it enables efficient low-degree testing.
3. Understand the general principles of soundness amplification and the ideas behind rewinding and the forking lemma as tools for cryptographic soundness arguments.

---

## 1. The low-degree testing problem

### 1.1 Problem statement

Suppose a prover supplies a function $f: D \to \mathbb{F}$, represented as a table of values on an evaluation set $D$. The verifier wants to check whether $f$ is the evaluation representation of a polynomial of degree less than $d$, without reading all of $D$—that is, using only a small number of queries. This is the low-degree testing problem.

### 1.2 Why is it difficult?

As we saw in Session 5, evaluation representations of polynomials of degree less than $d$ are exactly the codewords of a Reed–Solomon code. Low-degree testing can therefore be viewed as **proximity testing**: deciding whether the supplied function approximately belongs to the RS code.

Reading $f$ at every point would allow us to decide membership, but would require as many queries as there are evaluation points, contradicting the goal of succinctness. We want to decide correctly with high probability using few queries.

---

## 2. FRI: Fast Reed–Solomon IOP of Proximity

### 2.1 The basic idea: Fold the degree in half

FRI reduces proximity testing for polynomials of degree less than $d$ to proximity testing for polynomials of degree less than $d/2$. Repeating this **reduction** recursively shrinks the problem to constant degree, where verification becomes easy.

Specifically, decompose a polynomial $f(X)$ into its even- and odd-degree terms:

$$f(X) = f_{\text{even}}(X^2) + X \cdot f_{\text{odd}}(X^2)$$

After receiving a random challenge $\alpha$ from the verifier, define

$$f'(Y) = f_{\text{even}}(Y) + \alpha \cdot f_{\text{odd}}(Y)$$

The new polynomial $f'$ has roughly half the degree. The prover supplies its evaluation representation, and the verifier queries a small number of points to check consistency between $f$ and $f'$.

### 2.2 Recursive folding and the commit and query phases

Repeated folding decreases the degree bound as $d \to d/2 \to d/4 \to \cdots$, eventually reaching a polynomial of constant or very small degree. At that point, checking all evaluation points is easy.

The protocol has two main phases:

- **Commit phase:** The prover successively commits to the polynomials, or their evaluation representations, at each folding stage.
- **Query phase:** The verifier chooses random evaluation points and checks consistency at each stage—whether the folding relation holds.

Consistency can be checked with roughly $O(1)$ queries per stage. With about $\log d$ stages, proximity testing takes roughly $O(\log d)$ queries overall. This provides the succinctness associated with logarithmic verification cost.

### 2.3 Why the claim is approximate

FRI addresses the approximate claim that $f$ is **close** to a low-degree polynomial in the Hamming-distance sense introduced in Session 5. Quantifying this closeness involves list-decoding parameters, including Johnson-type bounds. Soundness error depends on a precise analysis of coding-theoretic parameters, and practical choices such as the number of folding rounds and queries are based on that analysis.

*The detailed formulas are beyond this lecture. The key structure to understand is the trade-off between verification cost and soundness error, whose precise form is quantified using coding theory.*

---

## 3. General principles of soundness amplification

### 3.1 Why amplification is necessary

A single protocol execution often has a soundness error—the probability that a dishonest prover is incorrectly accepted—that is too large for practical use. For example, very few cryptographic applications could tolerate an error probability of roughly $1/2$ per execution.

### 3.2 Parallel and sequential repetition

The basic method for reducing error probability is to repeat the protocol independently. The intuition is that $k$ independent repetitions reduce error exponentially to $\epsilon^k$. However, proving that this intuition holds can vary greatly in technical difficulty depending on whether repetition is parallel or sequential, and whether zero-knowledge is preserved. We will not pursue those details here; the key principle is that repetition provides quantitative control over error probability.

---

## 4. Rewinding and the forking lemma

### 4.1 The idea of rewinding

Earlier sessions introduced knowledge extraction through an extractor that observes a prover. **Rewinding** is a concrete technique for doing this: run the prover's algorithm up to a particular point, then **rerun it from that state with a different challenge**.

Recall the special soundness of the Schnorr protocol in Session 2. Responses to two distinct challenges $c_1, c_2$ allowed us to recover the witness. Rewinding obtains these two responses within a simulation: return the prover to the state with the same randomness and initial commitment, then rerun it with a different challenge.

### 4.2 The forking lemma

The **forking lemma** of Pointcheval and Stern (1996) formalizes the rewinding idea for security proofs of non-interactive protocols obtained through the Fiat–Shamir transform. Informally, its message is:

> If an adversary can forge in a suitable non-interactive protocol, running it multiple times while changing a response to a random-oracle query can produce two forked executions from which the desired information, such as a secret key or witness, can be extracted with a probability related to the adversary's success.

This technique appears in security arguments for signature and proof constructions, including pairing-based constructions related to the next session. Today, focus on the basic pattern: use rewinding to obtain related executions, then compare them to extract information.

### 4.3 Why these techniques matter

Rewinding and the forking lemma are tools for mathematically **proving** why a proof system is secure. Knowing such techniques is essential to understanding rigorous security arguments, beyond simply designing a protocol. They provide background for our discussion of security proofs in Act III, including the discussion of Groth16.

---

## Summary and next session

Today we learned:

- Low-degree testing can be viewed as proximity testing for RS codes.
- FRI's recursive folding structure repeatedly halves the degree bound to achieve logarithmic verification cost.
- Soundness amplification uses repetition to control error probability quantitatively.
- Rewinding and the forking lemma are cryptographic proof techniques supporting knowledge extraction and security arguments for non-interactive protocols.

In Session 7, we will study elliptic curves and pairings, algebraic structures underlying SNARK protocols, particularly Groth16. We will also introduce the hierarchy of cryptographic hardness assumptions, including discrete logarithms and qSDH, and the idea of reduction proofs.

---

## References and further reading

- Ben-Sasson, Bentov, Horesh, and Riabzev, [“Fast Reed-Solomon Interactive Oracle Proofs of Proximity,” ICALP 2018](https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ICALP.2018.14) — the original FRI paper; open-access publisher page with PDF.
- Pointcheval and Stern, [“Security Arguments for Digital Signatures and Blind Signatures,” Journal of Cryptology, 2000](https://link.springer.com/article/10.1007/s001450010003) — a developed formulation of the forking lemma; publisher's article page.
- Bellare and Goldreich, [“On Defining Proofs of Knowledge,” CRYPTO 1992](https://cseweb.ucsd.edu/~mihir/papers/pok.pdf) — formal definitions of knowledge extraction and the role of rewinding; author-hosted PDF.

## Suggested discussion questions

- Before presenting the folding equations, ask students what operation could efficiently halve a polynomial's degree. This helps motivate the even/odd decomposition.
- Discuss why one execution is insufficient using a concrete error probability, such as $1/2$, to illustrate the need for soundness amplification.
- Review the special soundness of Schnorr from Session 2 before introducing rewinding, connecting the new technique to familiar material.
