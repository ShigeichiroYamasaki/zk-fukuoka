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
import { withBase } from "vitepress";
</script>

# Session 6: Low-degree testing and soundness amplification

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: October 7, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 6 in the syllabus](./#session-6) · [Session 6 exercises](../exercises/session-06)

## Position in the course and learning objectives

Last time, we viewed low-degree polynomial evaluations as codewords and measured deviations by distance. Today we ask how to detect tables far from low-degree polynomials without reading the whole table. FRI is our main tool. We also distinguish techniques for reducing erroneous acceptance from rewinding techniques used to prove security.

There are three learning objectives:

1. Understand the low-degree testing problem and why naive approaches struggle to achieve efficiency.
2. Understand FRI's recursive folding structure and how it enables efficient low-degree testing.
3. Understand the general principles of soundness amplification and the ideas behind rewinding and the forking lemma as tools for cryptographic soundness arguments.

::: tip Prerequisites
You will use Session 5’s Reed–Solomon codes, relative distance, and distinction between unique and list decoding. Following the folding equations also uses Session 3’s finite-field arithmetic and even/odd polynomial decomposition. For the final section, recall special soundness and witness extraction in Session 2’s Schnorr protocol. For review, see the [finite-fields and polynomials tutorial](./finite-fields-tutorial) and the [coding-theory tutorial](./coding-theory-tutorial).
:::

### Three separate questions in this session

<div class="captioned-table" id="table-06-7" role="group" aria-labelledby="table-caption-06-7">

<p class="table-caption" id="table-caption-06-7"><strong>Table 06-7：Questions answered by FRI, soundness amplification, and rewinding</strong></p>

| Question | Tool | Role |
| --- | --- | --- |
| How can a few values test proximity to a low-degree polynomial? | Low-degree testing and FRI | Check proximity and consistency between folds |
| How can we lower the probability of accepting a false proof? | Soundness amplification | Analyze repetition conditions and false-acceptance probability |
| How can a security proof recover a witness? | Rewinding and the forking lemma | Compare executions of the same adversary |

</div>

These ideas are related but are not the same operation. FRI is a low-degree proximity-testing protocol; soundness amplification is a design and analysis method for reducing false acceptance; rewinding is a technique used inside security proofs, for example to establish knowledge extraction.

---

## 1. The low-degree testing problem

### 1.1 Problem statement

Suppose the prover supplies an evaluation table $f:D\to\mathbb{F}$. We want to accept tables obtained from low-degree polynomials and reject, with high probability, tables far from every polynomial of degree below $d$. Distinguish this from deciding exact equality using a few queries. The low-degree testing considered here concerns proximity.

### 1.2 Why is it difficult?

The difficulty is that **we have no polynomial expression, only limited access to a table, yet want to check global consistency with one low-degree polynomial**. If coefficients were available, we could inspect the highest nonzero coefficient. Here they are unknown. Write $f:D\to K$ for the table and $g\in K[X]$ for a candidate polynomial.

#### ① Interpolating a few points does not validate the remaining table

Take $K=\mathbb F_7$, $D=\{0,1,2,3,4,5,6\}$, and degree bound $d=2$: the target is degree at most one. Compare three tables, with all arithmetic modulo 7.

<div class="captioned-table" id="table-06-1" role="group" aria-labelledby="table-caption-06-1">

<p class="table-caption" id="table-caption-06-1"><strong>Table 06-1：A degree-at-most-one table, a one-entry corruption, and a table far from every degree-at-most-one polynomial</strong></p>

| Point $x$ | Valid table $g(x)=1+2x$ | One-entry change $f_{\mathrm{near}}$ | Quadratic table $f_{\mathrm{far}}(x)=x^2$ |
| --- | --- | --- | --- |
| 0 | 1 | 1 | 0 |
| 1 | 3 | 3 | 1 |
| 2 | 5 | 5 | 4 |
| 3 | 0 | 0 | 2 |
| 4 | 2 | 2 | 2 |
| 5 | 4 | 4 | 4 |
| 6 | 6 | 0 | 1 |

</div>

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

<span id="figure-06-1"></span>
<span id="caption-06-1"></span>

<div class="captioned-table" id="table-06-4" role="group" aria-labelledby="table-caption-06-4">

<p class="table-caption" id="table-caption-06-4"><strong>Table 06-4：FRI: halve the degree bound at each step</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. Initial table | deg f &lt; 16: split even and odd terms |
| 2. Fold with a random combination | f′ = f\_even + α f\_odd → degree bound 8 |
| 3. Repeat | 8 → 4 → 2 → 1 (constant polynomial) |

</div>

Schematic multiplicative FRI. Fix each table before receiving its new challenge. Check proximity and folding consistency; this is not simply discarding half a table.

### 2.3 Why low-degree testing is approximate

FRI bounds the probability of accepting a table that is far from every permitted low-degree polynomial, using the Hamming distance introduced in Session 5. One accepting execution does not establish closeness with certainty. Quantifying this closeness involves list-decoding parameters, including Johnson-type bounds. Soundness error depends on a precise analysis of coding-theoretic parameters, and practical choices such as the number of folding rounds and queries are based on that analysis.

*The detailed formulas are beyond this lecture. The key structure to understand is the trade-off between verification cost and soundness error, whose precise form is quantified using coding theory.*

### 2.4 Worked example: folding eight evaluations twice {#fri-worked-example}

Work in $\mathbb F_{17}$ with degree bound 4: every numerical operation below is modulo 17. The [even–odd decomposition from Session 3](./session-03.md#fri-polynomial-folding) lets us check folds using evaluations alone. We show coefficients here for teaching purposes; the verifier does not need them.

$$f_0(X)=3+2X+5X^2+X^3,\qquad D_0=\{1,2,4,8,16,15,13,9\}.$$

The prover first commits to the evaluation table of $f_0$ with a Merkle tree. Suppose the verifier's subsequent random challenge is $\alpha_0=3$. Then

$$f_1(Y)=(3+5Y)+3(2+Y)=9+8Y.$$

For the pair $x=2$ and $-x=15$, the values are $f_0(2)=1$ and $f_0(15)=11$. Thus

$$\frac{1+11}{2}=6,\qquad \frac{1-11}{2\cdot2}=6,\qquad f_1(4)=6+3\cdot6=7\pmod{17}.$$

Here $4^{-1}=13$, so $(1-11)/4=(-10)\cdot13=6$. These are field inverses, not rounded real-number divisions. Applying the same operation to all four pairs gives:

<div class="captioned-table" id="table-06-2" role="group" aria-labelledby="table-caption-06-2">

<p class="table-caption" id="table-caption-06-2"><strong>Table 06-2：First fold: eight evaluations become four, with challenge 3</strong></p>

| $x$ | $-x$ | $Y=x^2$ | $f_0(x)$ | $f_0(-x)$ | $f_1(Y)$ |
|---:|---:|---:|---:|---:|---:|
| 1 | 16 | 1 | 11 | 5 | 0 |
| 2 | 15 | 4 | 1 | 11 | 7 |
| 4 | 13 | 16 | 2 | 11 | 1 |
| 8 | 9 | 13 | 1 | 16 | 11 |

</div>

The prover next commits to the table of $f_1$, before receiving the next challenge. Suppose $\alpha_1=5$. Since $f_1(Y)=9+Y\cdot8$,

$$f_2(Z)=9+5\cdot8=15\pmod{17}.$$

Here $Z=Y^2$. Subscripts identify layers, not derivatives.

<div class="captioned-table" id="table-06-3" role="group" aria-labelledby="table-caption-06-3">

<p class="table-caption" id="table-caption-06-3"><strong>Table 06-3：Second fold: four evaluations become two, with challenge 5</strong></p>

| $Y$ | $-Y$ | $Z=Y^2$ | $f_1(Y)$ | $f_1(-Y)$ | $f_2(Z)$ |
|---:|---:|---:|---:|---:|---:|
| 1 | 16 | 1 | 0 | 1 | 15 |
| 4 | 13 | 16 | 7 | 11 | 15 |

</div>

Table lengths shrink as $8\to4\to2$, and degree bounds as “below 4, below 2, below 1.” The prover supplies the final constant 15, fixing it before query positions are chosen.

### 2.5 What does the verifier read? {#fri-query-example}

The full tables above are for teaching. Reading them all would not yield succinct verification. For an initial query $x=2$, one path checks:

1. Read $f_0(2)=1$ and $f_0(15)=11$; check that their fold, 7, equals $f_1(4)$.
2. Read the next pair $f_1(4)=7$ and $f_1(13)=11$. Their even and odd parts are $(7+11)/2=9$ and $(7-11)/8=8$. Check that $9+5\cdot8=15$ matches the final constant.
3. Verify Merkle authentication paths against the appropriate committed roots for every opened value.

Changing just $f_1(4)$ to 8 would fail this path's first check. Passing one path does not establish correctness of the whole table. The number of paths depends on the proximity threshold and target soundness error.

For a supplied table of length $N$, folding processes $N+N/2+N/4+\cdots<2N$ entries, using $O(N)$ field operations. Preprocessing such as low-degree extension is counted separately. A verifier path reads a constant number of values per layer and uses $O(\ell)$ field operations for $\ell$ layers. Straightforward individual Merkle paths also involve $O(\ell\log N)$ hash values per path. This tiny example is not a practical security or proof-size estimate.

### 2.6 Invalid tables and the role of random challenges

The invalid polynomial $h_0(X)=f_0(X)+X^4$ violates the degree bound but can still be folded. With the same challenges,

$$h_1(Y)=9+8Y+Y^2,\qquad h_2(Z)=15+Z.$$

At the final domain $\{1,16\}$, the values are 16 and 14, not a constant. Faithful folds fail the final degree condition; pretending the result is constant introduces an inconsistency that queries can detect.

Could we fix the first challenge to 3 in advance? Consider $\widetilde h_0(X)=f_0(X)+(X-3)X^4$. The added part has even and odd components $-3Y^2$ and $Y^2$, so it folds to $(\alpha_0-3)Y^2$. **If the prover knows that $\alpha_0=3$ before choosing the table, the invalid addition disappears.** For this particular table fixed before a uniform challenge in $\mathbb F_{17}$, cancellation has probability $1/17$. This is the cancellation probability for one example, not the soundness error of the entire FRI protocol.

This explains why tables must be fixed before unpredictable challenges, and why the final degree condition and inter-layer consistency are both needed. The soundness theorem addresses arbitrary tables far from the code and adversarial strategies, not just these examples. FRI and Merkle commitments alone also do not establish zero-knowledge.

<a :href="withBase('/examples/fri_folding.py')" download>Download the Python arithmetic example</a> and run `python3 fri_folding.py` to check both tables and the invalid examples. No extra libraries are required. This is an arithmetic teaching example, not a proof-system implementation with Merkle trees and cryptographic randomness.


---

## 3. General principles of soundness amplification

### 3.1 Why amplification is necessary

Even if a test can detect an invalid table, a miss probability of $1/2$ is too large for cryptographic use. First decide the target error, then design the queries or repetitions needed to reach it. Soundness amplification addresses this requirement.

### 3.2 Parallel and sequential repetition

Repeat a test with independent randomness and accept only if every run passes. With per-run error $\epsilon$, the target bound is $\epsilon^k$ after $k$ repetitions. But the relevant conditional bounds must be established. Parallel and sequential repetition may allow different adversarial strategies. Check soundness amplification separately from preservation of zero-knowledge.

The value $\epsilon^k$ does not follow merely from writing the same test $k$ times. Conditions such as fresh, appropriate challenges and a conditional false-acceptance probability at most $\epsilon$ after every prior history are needed. By contrast, to combine the probability that any one of several checks fails, the union bound works without independence:

$$\Pr\left[\bigcup_{i=1}^m E_i\right]\le\sum_{i=1}^m\Pr[E_i]$$

Here $E_i$ is the event that check $i$ falsely accepts.

<span id="figure-06-2"></span>
<span id="caption-06-2"></span>

<div class="captioned-table" id="table-06-5" role="group" aria-labelledby="table-caption-06-5">

<p class="table-caption" id="table-caption-06-5"><strong>Table 06-5：Repetition count and soundness error</strong></p>

| Condition | Bound (1/2)ᵏ |
| --- | --- |
| k = 1 | 50% |
| k = 2 | 25% |
| k = 4 | 6.25% |
| k = 8 | 0.390625% |

</div>

Example where each false-acceptance probability is ≤1/2, the necessary independence/repetition conditions hold, and all trials must accept. This bound does not apply unconditionally to arbitrary interactive protocols.

---

## 4. Rewinding and the forking lemma

### 4.1 The idea of rewinding

Now consider a technique for proving knowledge extraction, separate from reducing error. **Rewinding** returns an adversary’s algorithm to an earlier state within a security proof, then reruns it with a different challenge. It does not mean an ordinary verifier can rewind an actual remote party at will.

Recall the special soundness of the Schnorr protocol in Session 2. Responses to two distinct challenges $c_1, c_2$ allowed us to recover the witness. Rewinding obtains these two responses within a simulation: return the prover to the state with the same randomness and initial commitment, then rerun it with a different challenge.

### 4.2 The forking lemma

The **forking lemma** of Pointcheval and Stern (1996) formalizes the rewinding idea for security proofs of non-interactive protocols obtained through the Fiat–Shamir transform. Informally, its message is:

> If an adversary can forge in a suitable non-interactive protocol, running it multiple times while changing a response to a random-oracle query can produce two forked executions from which the desired information, such as a secret key or witness, can be extracted with a probability related to the adversary's success.

This is intuition for schemes meeting the lemma’s conditions, not a theorem extracting information from every non-interactive protocol. In Fiat–Shamir-type signatures studied in Session 9, the probability of a successful fork depends on factors including oracle queries and the adversary’s success probability.

Same randomness and state up to the commitment

<span id="figure-06-3"></span>
<span id="caption-06-3"></span>

<div class="captioned-table" id="table-06-6" role="group" aria-labelledby="table-caption-06-6">

<p class="table-caption" id="table-caption-06-6"><strong>Table 06-6：Rewinding: change the challenge from the same state</strong></p>

| Item | Explanation |
| --- | --- |
| Run 1 | Challenge c₁ → response s₁ |
| Run 2 | Different c₂ → response s₂ |

</div>

Use two accepting records and extraction conditions to recover a witness

A technique for rerunning an adversary inside a security proof, not literally rewinding a remote party. Forking lemmas also address conditions for changing random-oracle answers.

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

---

## Session 6 exercise

Check the lecture concepts with calculations and concrete examples in the [Session 6 exercise](../exercises/session-06).
