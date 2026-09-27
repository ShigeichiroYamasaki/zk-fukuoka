---
outline: [2, 3]
prev:
  text: Session 5 · Error-correcting codes and the information-theoretic perspective
  link: /en/learn/session-05
next:
  text: Session 7 · Elliptic curves and pairings
  link: /en/learn/session-07
---

<script setup>
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
</script>

# Session 6: Low-degree testing and soundness amplification

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 28, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 6 in the syllabus](./#session-6) · [Exercises](../exercises/)

## Position in the course and learning objectives

Last time, we viewed low-degree polynomial evaluations as codewords and measured deviations by distance. Today we ask how to detect tables far from low-degree polynomials without reading the whole table. FRI is our main tool. We also distinguish techniques for reducing erroneous acceptance from rewinding techniques used to prove security.

There are three learning objectives:

1. Understand the low-degree testing problem and why naive approaches struggle to achieve efficiency.
2. Understand FRI's recursive folding structure and how it enables efficient low-degree testing.
3. Understand the general principles of soundness amplification and the ideas behind rewinding and the forking lemma as tools for cryptographic soundness arguments.

---

## 1. The low-degree testing problem

### 1.1 Problem statement

Suppose the prover supplies an evaluation table $f:D\to\mathbb{F}$. We want to accept tables obtained from low-degree polynomials and reject, with high probability, tables far from every polynomial of degree below $d$. Distinguish this from deciding exact equality using a few queries. The low-degree testing considered here concerns proximity.

### 1.2 Why is it difficult?

As we saw in Session 5, evaluation representations of polynomials of degree less than $d$ are exactly the codewords of a Reed–Solomon code. Low-degree testing can therefore be viewed as **proximity testing**: deciding whether the supplied function approximately belongs to the RS code.

Reading $f$ at every point would allow us to decide membership, but would require as many queries as there are evaluation points, contradicting the goal of succinctness. We want to decide correctly with high probability using few queries.

---

## 2. FRI: Fast Reed–Solomon IOP of Proximity

### 2.1 The basic idea: Fold the degree in half

Can we move to a smaller problem instead of inspecting a large table at once? FRI repeatedly applies an operation that roughly halves the degree of a low-degree polynomial and checks consistency between stages. First understand the operation on honest polynomials; proximity analysis supplies the guarantee against invalid tables.

First separate even and odd powers. The following equations describe the multiplicative FRI setting over an odd-characteristic field, where evaluation points can be paired. In characteristic two, the same evaluation-table folding cannot simply be assumed.

$$f(X) = f_{\text{even}}(X^2) + X \cdot f_{\text{odd}}(X^2)$$

After receiving a random challenge $\alpha$ from the verifier, define

$$f'(Y) = f_{\text{even}}(Y) + \alpha \cdot f_{\text{odd}}(Y)$$

The new polynomial $f'$ has roughly half the degree. The prover supplies its evaluation representation, and the verifier queries a small number of points to check consistency between $f$ and $f'$.

### 2.2 Recursive folding and the commit and query phases

Reducing the degree as $d\to d/2\to d/4\to\cdots$ eventually leaves a small polynomial that can be checked directly. Fix each stage’s table before obtaining the next folding challenge. If the prover could alter an earlier table after seeing the challenge, the test would lose its purpose.

The protocol has two main phases:

- **Commit phase:** The prover successively commits to the polynomials, or their evaluation representations, at each folding stage.
- **Query phase:** The verifier chooses random evaluation points and checks consistency at each stage—whether the folding relation holds.

One query path checks a constant number of values per stage, giving roughly $O(\log d)$ values as the stages shrink. The number of paths needed depends on the target soundness error. A Merkle-tree implementation also requires authentication-path verification. Count queried values separately from proof size and total verification work.

<StudyDiagram id="06-1" :en="true" />

### 2.3 Why the claim is approximate

FRI bounds the probability of accepting a table that is far from every permitted low-degree polynomial, using the Hamming distance introduced in Session 5. One accepting execution does not establish closeness with certainty. Quantifying this closeness involves list-decoding parameters, including Johnson-type bounds. Soundness error depends on a precise analysis of coding-theoretic parameters, and practical choices such as the number of folding rounds and queries are based on that analysis.

*The detailed formulas are beyond this lecture. The key structure to understand is the trade-off between verification cost and soundness error, whose precise form is quantified using coding theory.*

---

## 3. General principles of soundness amplification

### 3.1 Why amplification is necessary

Even if a test can detect an invalid table, a miss probability of $1/2$ is too large for cryptographic use. First decide the target error, then design the queries or repetitions needed to reach it. Soundness amplification addresses this requirement.

### 3.2 Parallel and sequential repetition

Repeat a test with independent randomness and accept only if every run passes. With per-run error $\epsilon$, the target bound is $\epsilon^k$ after $k$ repetitions. But the relevant conditional bounds must be established. Parallel and sequential repetition may allow different adversarial strategies. Check soundness amplification separately from preservation of zero-knowledge.

<StudyDiagram id="06-2" :en="true" />

---

## 4. Rewinding and the forking lemma

### 4.1 The idea of rewinding

Now consider a technique for proving knowledge extraction, separate from reducing error. **Rewinding** returns an adversary’s algorithm to an earlier state within a security proof, then reruns it with a different challenge. It does not mean an ordinary verifier can rewind an actual remote party at will.

Recall the special soundness of the Schnorr protocol in Session 2. Responses to two distinct challenges $c_1, c_2$ allowed us to recover the witness. Rewinding obtains these two responses within a simulation: return the prover to the state with the same randomness and initial commitment, then rerun it with a different challenge.

### 4.2 The forking lemma

The **forking lemma** of Pointcheval and Stern (1996) formalizes the rewinding idea for security proofs of non-interactive protocols obtained through the Fiat–Shamir transform. Informally, its message is:

> If an adversary can forge in a suitable non-interactive protocol, running it multiple times while changing a response to a random-oracle query can produce two forked executions from which the desired information, such as a secret key or witness, can be extracted with a probability related to the adversary's success.

This is intuition for schemes meeting the lemma’s conditions, not a theorem extracting information from every non-interactive protocol. In Fiat–Shamir-type signatures studied in Session 9, the probability of a successful fork depends on factors including oracle queries and the adversary’s success probability.

<StudyDiagram id="06-3" :en="true" />

### 4.3 Why these techniques matter

Being able to implement a procedure is different from proving it secure. Rewinding and the forking lemma help analyze adversarial behavior for the latter purpose. Not every proof system uses the same extraction technique. In Act III, check each scheme’s model and proof method, including Groth16’s generic bilinear group model.

---

## Summary and next session

Today we distinguished low-degree proximity testing from techniques used to argue security. Review the guarantee each is intended to support.

- Low-degree testing can be viewed as proximity testing for RS codes.
- FRI repeatedly halves the degree bound, checking logarithmically many values along one query path. Count authentication paths and repetitions separately for total cost.
- Soundness amplification uses repetition to control error probability quantitatively.
- Rewinding and the forking lemma are cryptographic proof techniques supporting knowledge extraction and security arguments for non-interactive protocols.

In Session 7, we will study elliptic curves and pairings, algebraic structures underlying SNARK protocols, particularly Groth16. We will also introduce the types and relationships of cryptographic hardness assumptions, including discrete logarithms and q-SDH, and the idea of reduction proofs.

---

## References and further reading

- Ben-Sasson, Bentov, Horesh, and Riabzev, [“Fast Reed-Solomon Interactive Oracle Proofs of Proximity,” ICALP 2018](https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ICALP.2018.14) — the original FRI paper; open-access publisher page with PDF.
- Pointcheval and Stern, [“Security Arguments for Digital Signatures and Blind Signatures,” Journal of Cryptology, 2000](https://link.springer.com/article/10.1007/s001450010003) — a developed formulation of the forking lemma; publisher's article page.
- Bellare and Goldreich, [“On Defining Proofs of Knowledge,” CRYPTO 1992](https://cseweb.ucsd.edu/~mihir/papers/pok.pdf) — formal definitions of knowledge extraction and the role of rewinding; author-hosted PDF.

## Suggested discussion questions

- Before presenting the folding equations, ask students what operation could efficiently halve a polynomial's degree. This helps motivate the even/odd decomposition.
- Discuss why one execution is insufficient using a concrete error probability, such as $1/2$, to illustrate the need for soundness amplification.
- Review the special soundness of Schnorr from Session 2 before introducing rewinding, connecting the new technique to familiar material.
