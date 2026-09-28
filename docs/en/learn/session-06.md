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
import CaptionedTable from "../../.vitepress/theme/CaptionedTable.vue";
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

The difficulty is that **we have no polynomial expression, only limited access to a table, yet want to check global consistency with one low-degree polynomial**. If coefficients were available, we could inspect the highest nonzero coefficient. Here they are unknown. Write $f:D\to K$ for the table and $g\in K[X]$ for a candidate polynomial.

#### ① Interpolating a few points does not validate the remaining table

Take $K=\mathbb F_7$, $D=\{0,1,2,3,4,5,6\}$, and degree bound $d=2$: the target is degree at most one. Compare three tables, with all arithmetic modulo 7.

<CaptionedTable number="06-1" caption="A degree-at-most-one table, a one-entry corruption, and a table far from every degree-at-most-one polynomial" :en="true">

| Point $x$ | Valid table $g(x)=1+2x$ | One-entry change $f_{\mathrm{near}}$ | Quadratic table $f_{\mathrm{far}}(x)=x^2$ |
| --- | --- | --- | --- |
| 0 | 1 | 1 | 0 |
| 1 | 3 | 3 | 1 |
| 2 | 5 | 5 | 4 |
| 3 | 0 | 0 | 2 |
| 4 | 2 | 2 | 2 |
| 5 | 4 | 4 | 4 |
| 6 | 6 | 0 | 1 |

</CaptionedTable>

Querying $f_{\mathrm{near}}$ at 0 and 1 returns 1 and 3, uniquely determining $g(X)=1+2X$. But this only determines **the line through the observed points**, not whether the remaining table lies on it. At point 6 the table returns 0 whereas $g(6)=6$. No alternative line repairs this: $g$ is already the unique line through the first two points.

The relative distance to the degree-at-most-one RS code $\mathcal C$ is $\Delta(f_{\mathrm{near}},\mathcal C)=1/7$. Failing exact membership differs from being far from every low-degree polynomial.

#### ② Even a far table fits a line on every pair of points

For $f_{\mathrm{far}}$, points 0 and 1 fit $g_1(X)=X$, but at 2 it predicts 2 rather than the table's 4. Points 4 and 5 instead fit $g_2(X)=2X+1$. **A line for each sampled pair need not be one line for the whole table.**

For every degree-at-most-one $g$, $X^2-g(X)$ is a nonzero quadratic with at most two roots. Thus agreement occurs at at most two points and disagreement at at least five. The line $g_1=X$ agrees at exactly two, so the distance is exactly $5/7$. This far table nevertheless has a valid line explaining any two observed entries.

In this small example, three distinct queries suffice to reject $f_{\mathrm{far}}$. The point is not that testing is impossible, but that **the number of points needed by the direct approach grows with the degree bound**.

#### ③ In general, up to d observations cannot demonstrate inconsistency

By [Lagrange interpolation in Session 3](./session-03#_3-3-lagrange-interpolation), any values at $d$ distinct points determine a polynomial of degree less than $d$. A test querying only the original table and always accepting valid tables therefore **cannot establish invalidity from at most $d$ observations**: the unobserved entries can be completed into a valid codeword consistent with the transcript. This remains true for adaptive queries chosen from earlier answers.

For example, with $n=2^{20}=1048576$ points and $d=2^{18}=262144$, interpolating a candidate already reads over 260,000 entries; the field must supply at least $n$ distinct points. Further work is needed to check the remaining entries. This is expensive when the goal is a short proof and few queries. The argument concerns **queries to the original table without auxiliary proof data**; it is not a lower bound against systems such as FRI that receive additional tables.

#### ④ Reject far tables rather than decide exact equality

Reliably detecting a single changed entry is also expensive. Even with a known correct comparison table, if one of $n$ positions differs, $q$ uniformly sampled distinct positions hit it with probability $q/n$. For $f_{\mathrm{near}}$ above, two queries hit the changed position with probability only $2/7$. This assumes the correct comparison table is known; interpolating an unknown candidate alone does not give the same detection power.

Instead, choose a distance threshold $\rho$ and aim to reject tables with

$$\Delta(f,\mathcal C)=\min_{\deg g<d}\frac{|\{x\in D:f(x)\ne g(x)\}|}{|D|}\ge\rho$$

except with small soundness error. For $\rho=1/3$, $f_{\mathrm{far}}$ at distance $5/7$ falls under this rejection guarantee, while $f_{\mathrm{near}}$ at distance $1/7$ does not. The latter need not always be accepted either. **Accept valid codewords, reject sufficiently far tables with high probability, and make no conclusion about the intermediate region from this guarantee alone.**

#### ⑤ Schwartz–Zippel and commitments are not enough by themselves

Schwartz–Zippel bounds random zeros of a fixed difference polynomial with a known degree bound. Here we are trying to establish the low-degree premise itself. Every table on $n$ distinct points has an interpolant of degree less than $n$, but this need not satisfy the target bound $d$. We cannot simply assume a low-degree error bound.

A Merkle commitment fixes a table before queries, preventing answers from being changed to suit the queries. But it can also commit to $f_{\mathrm{far}}$. **Binding a table and establishing low degree are separate guarantees.**

FRI uses more than isolated entries of the original table: the prover supplies successive folding tables in response to random challenges. The verifier checks relations between neighboring tables and the final small table. This auxiliary proof avoids directly interpolating $d$ points at the original large degree. Proximity analysis explains why far tables are unlikely to pass these checks. Next, first examine how folding works for an honest polynomial.

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
