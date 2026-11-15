---
outline: [2, 3]
prev:
  text: Session 6 · Low-degree testing and soundness amplification
  link: /en/learn/session-06
next:
  text: Session 8 · Polynomial commitments and cryptographic commitment theory
  link: /en/learn/session-08
---

<script setup>
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
</script>

# Session 7: Elliptic curves and pairings

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: November 15, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 7 in the syllabus](./#session-7) · [Session 7 exercises](../exercises/session-07)

## Position in the course and learning objectives

So far, we have studied polynomial evaluations and how to check a table’s proximity to low-degree polynomials. Today we add another tool. How can we check multiplication relations while handling values as group elements? This question motivates elliptic curves and pairings, preparing us to read Groth16 in Act III.

There are three learning objectives:

1. Understand the definition and basic structure of elliptic curve groups.
2. Understand bilinear pairings and the new cryptographic capabilities they provide.
3. Understand the types and relationships of hardness assumptions, including discrete logarithms and q-SDH, and the basic structure of security arguments based on reductions.

Session 2 used algebraic properties to establish Schnorr special soundness and honest-verifier simulation. Hardness of recovering the secret exponent from the public key relies on discrete logarithms. Distinguish these roles. Pairings extend the available algebraic tools toward succinct systems such as Groth16.

::: tip Prerequisites
This session uses Session 3’s finite fields and multiplicative groups, the discrete-log relation and witness from Session 2’s Schnorr protocol, and the cryptographic idea of proving security under assumptions. Familiarity with point addition, scalar multiplication, group order, and generators is enough; elliptic-curve number theory and pairing algorithms are not prerequisites. Review the [finite-fields and polynomials](./finite-fields-tutorial), [vectors and matrices](./linear-algebra-tutorial), and [cryptographic security](./cryptographic-security-tutorial) tutorials as needed.
:::

### Roadmap for this session

<div class="captioned-table" id="table-07-4" role="group" aria-labelledby="table-caption-07-4">

<p class="table-caption" id="table-caption-07-4"><strong>Table 07-4：Learning sequence from groups to security reductions</strong></p>

| Stage | Question | Connection to later sessions |
| --- | --- | --- |
| Elliptic-curve groups | What algebraic structure do points form? | Discrete-log assumptions and group operations |
| Bilinear pairings | How can group elements test a product of exponents? | Groth16 verification in Session 11 |
| Hardness assumptions | What computational task is assumed difficult? | The basis for protocol security |
| Reduction arguments | If an attacker existed, what hard problem could it solve? | Explaining security relative to assumptions |

</div>

Figure 07-1 shows a learning example of points over a finite field, not a smooth real curve or a secure cryptographic curve. From pairings onward, shift from geometric intuition to the algebraic properties of group operations and maps.

---

## 1. Elliptic curve groups

### 1.1 Definition

First specify the objects on which we will compute. For a prime $p>3$, consider the following equation over the finite field $\mathbb{F}_p$.

$$y^2 = x^3 + ax + b \quad (4a^3 + 27b^2 \ne 0)$$

where $(x, y) \in \mathbb{F}_p \times \mathbb{F}_p$, together with a point at infinity $O$. The discriminant condition $4a^3+27b^2 \ne 0$ ensures that the curve has no singularities.

### 1.2 Group structure

A set of points alone is not yet a cryptographic tool. Defining addition of points gives a finite abelian group with the point at infinity $O$ as identity. Lines intersecting the curve provide a geometric interpretation of that addition. Rather than deriving every formula here, establish that we can add points and multiply them by integer scalars.

<StudyDiagram id="07-1" :en="true" />

### 1.3 Why use elliptic curves?

The discrete-log problem can also be defined in $\mathbb{F}_p^*$ from Session 3. One reason to choose elliptic curves is that appropriate curves allow shorter keys at a comparable security level. This is not a guarantee for every curve; assess the chosen group, known attacks, and required security together.

---

## 2. Bilinear pairings

### 2.1 Definition

Given group addition and scalar multiplication, what extra operation lets us check a relation involving the product of two hidden scalars? Consider the following map from two groups into a target group.

$$e: G_1 \times G_2 \to G_T$$

where $q$ is prime and $G_1,G_2,G_T$ are cyclic groups of order $q$, satisfying:

- **Bilinearity:** $e(aP, bQ) = e(P, Q)^{ab}$ for all $a, b \in \mathbb{Z}_q$, $P \in G_1$, and $Q \in G_2$.
- **Non-degeneracy:** $e(P, Q) \ne 1$ when $P$ and $Q$ are generators.
- **Efficient computability:** $e$ can be computed in polynomial time.

The symbols alone can obscure what these sets contain, so let us distinguish the three groups. A **subgroup** is a subset of a larger group that is closed under the group operation and contains the identity and inverses. In an elliptic-curve group, the elements are curve points and the operation is point addition.

- $G_1$ and $G_2$ are subgroups of order $q$ (that is, with $q$ elements) selected from suitable elliptic-curve groups. Their elements are points and their operation is addition. A pairing treats them as distinct input types. In implementations, $G_1$ often uses points on a curve over the base field, while $G_2$ uses points represented on a curve over an extension field or on its twist.
- $G_T$ is not a set of elliptic-curve points. It is a subgroup of order $q$ inside the multiplicative group $\mathbb F_{p^k}^{*}$ of **nonzero** elements of the extension field $\mathbb F_{p^k}$. Its elements are nonzero field elements, its operation is multiplication, and its identity is $1$.

All three groups have $q$ elements, but their elements and operations differ: $G_1,G_2$ add points, while $G_T$ multiplies field elements. Figure 07-2 shows the types: two point groups go in, and a multiplicative subgroup of a field receives the output.

For example, a subgroup of order 7 generated by $P$ contains $O,P,2P,3P,4P,5P,6P$; adding $P$ once more returns to $7P=O$. In an actual $G_1$, these symbols stand for points on an elliptic curve, not just abstract labels.

<figure id="figure-07-2" aria-labelledby="caption-07-2" style="margin:24px 0">
<div style="overflow-x:auto"><svg viewBox="0 0 960 340" role="img" aria-labelledby="pairing-groups-title-en pairing-groups-desc-en" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;min-width:760px;height:auto;border:1px solid var(--vp-c-divider,#d1d5db);border-radius:12px;background:var(--vp-c-bg,#fff)">
<title id="pairing-groups-title-en">The three groups in a pairing and the map's types</title>
<desc id="pairing-groups-desc-en">G1 and G2 are subgroups of order q consisting of elliptic-curve points and use point addition. The pairing e takes points from both groups and outputs an element of order q in GT, a multiplicative subgroup of the nonzero elements of an extension field.</desc>
<defs><marker id="pairing-arrow-07-en" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--vp-c-brand-1,#2563eb)"/></marker></defs>
<g fill="var(--vp-c-bg-soft,#f8fafc)" stroke="var(--vp-c-divider,#94a3b8)" stroke-width="2">
<rect x="24" y="28" width="320" height="112" rx="14"/><rect x="24" y="198" width="320" height="112" rx="14"/>
<rect x="420" y="106" width="150" height="124" rx="18" fill="var(--vp-c-brand-soft,#eff6ff)" stroke="var(--vp-c-brand-1,#2563eb)"/>
<rect x="652" y="91" width="284" height="154" rx="14"/>
</g>
<g fill="var(--vp-c-text-1,#111827)" font-family="system-ui, sans-serif">
<text x="48" y="63" font-size="24" font-weight="700">G₁: elliptic-curve points</text><text x="48" y="94" font-size="17">e.g. curve E over Fₚ</text><text x="48" y="121" font-size="17">operation: point addition | order q</text>
<text x="48" y="233" font-size="24" font-weight="700">G₂: another point group</text><text x="48" y="264" font-size="17">e.g. extension-field curve or twist</text><text x="48" y="291" font-size="17">operation: point addition | order q</text>
<text x="495" y="151" text-anchor="middle" font-size="28" font-weight="700">e(P,Q)</text><text x="495" y="183" text-anchor="middle" font-size="16">pairing</text><text x="495" y="207" text-anchor="middle" font-size="15">point × point → field element</text>
<text x="677" y="128" font-size="24" font-weight="700">G_T: target group</text><text x="677" y="164" font-size="17">multiplicative subgroup in Fₚᵏ</text><text x="677" y="194" font-size="17">operation: multiplication | order q</text><text x="677" y="224" font-size="17">identity: 1</text>
</g>
<g fill="none" stroke="var(--vp-c-brand-1,#2563eb)" stroke-width="3" marker-end="url(#pairing-arrow-07-en)"><path d="M344 84 C380 84 390 130 420 144"/><path d="M344 254 C380 254 390 208 420 194"/><path d="M570 168 L640 168"/></g>
<g fill="var(--vp-c-text-2,#4b5563)" font-family="system-ui, sans-serif" font-size="15"><text x="360" y="68">P ∈ G₁</text><text x="360" y="278">Q ∈ G₂</text><text x="579" y="151">output</text></g>
</svg></div>
<figcaption id="caption-07-2"><strong>Figure 07-2: A pairing maps point-addition groups to a field-multiplication group.</strong> G₁ and G₂ are input groups whose elements are points; G_T is an output group whose elements are nonzero extension-field values. They have the same order q, but different elements and operations.</figcaption>
</figure>

Work through a small **abstract example**. Let the groups have order $q=7$, let $P\in G_1,Q\in G_2$ be generators, and set $g_T=e(P,Q)$. Non-degeneracy gives $g_T\ne1$; in a cyclic group of prime order 7, every non-identity element is a generator, so $g_T$ generates $G_T$. Here $2P$ means $P+P$, and $3Q$ means $Q+Q+Q$. Bilinearity gives

$$
e(2P,3Q)=e(P,Q)^{2\cdot3}=g_T^6.
$$

Exponents are computed modulo the group order, so the exponent here is $6$. This symbolic example illustrates how the number of point additions becomes a product in the exponent; it is not an actual pairing calculation or a cryptographic parameter set. The relationship between real curve groups and fields is revisited in [Section 2.4](#pairing-math). Weil and Tate pairings are constructions that realize such maps. We will focus on the verification equations enabled by their properties, not on their computation algorithms.

### 2.2 Pairing-friendly curves

Making pairings easy to compute is not enough; some choices undermine security. We need to balance efficient pairing computation with hardness of discrete logarithms. Examples of curves designed for this purpose include:

- **BN254:** A Barreto–Naehrig curve that has long been widely used in many systems.
- **BLS12-381:** A curve widely adopted for its higher security level.

Selecting parameters such as the embedding degree requires number-theoretic analysis. For now, the key point is that carefully designed curves balance security and efficiency and are used in practice.

### 2.3 The new capability provided by pairings

Read bilinearity as a verification tool. Given $aP$ and $bQ$, the pairing produces $e(P,Q)^{ab}$: the product appears in an exponent without recovering $a$ or $b$. Symmetric notation writes this as $e(g^a,g^b)=e(g,g)^{ab}$, but actual constructions may require distinct generators in $G_1$ and $G_2$. Keep those types clear.

This is a **multiplicative verification capability** unavailable from ordinary discrete-log group operations alone, which provide additive structure in the exponents. Many SNARKs, including Groth16, use this property to verify polynomial multiplication relations in QAPs from Session 4. This connection will be crucial when studying Groth16 in Act III.

<div class="captioned-table" id="table-07-2" role="group" aria-labelledby="table-caption-07-2">

<p class="table-caption" id="table-caption-07-2"><strong>Table 07-2：Pairings expose a product in the exponent</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. Inputs from two groups | aP ∈ G₁, bQ ∈ G₂ |
| 2. Apply the bilinear map | e(aP, bQ) |
| 3. Relation in the target group | e(aP, bQ) = e(P, Q)ᵃᵇ ∈ G\_T |

</div>

G₁ and G₂ use additive notation; G\_T uses multiplicative notation. This does not recover a or b: it enables checking relations between encoded values.

::: tip Connection to PLONK: pairings support KZG openings
The original PLONK uses KZG polynomial commitments. Pairings help verify evaluation openings of committed polynomials; PLONK's copy constraints themselves are checked with a permutation argument and grand product over the scalar field. Do not conflate this with pairings directly checking the circuit wiring. Read [Session 8 on KZG](./session-08) alongside [Session 12's overview](./session-12).
:::

### 2.4 Coordinate fields, scalar fields, and three groups {#pairing-math}

The field containing point coordinates need not equal the field of scalars. Keep $\mathbb F_p$ as the coordinate field, and now assume the common group order $q$ is prime. Scalars belong to $\mathbb F_q$: since $qP=O$, scalar multiplication depends only on the scalar modulo $q$. **Groth16's R1CS and QAP coefficients live in this scalar field.** Do not confuse $q$ with the coordinate modulus $p$.

For generators $P\in G_1$ and $Q\in G_2$, write

$$[a]_1=aP,\qquad[b]_2=bQ,\qquad g_T=e(P,Q),\qquad[c]_T=g_T^c.$$

We use additive notation for the source groups and multiplicative notation for the target. Session 11's notation $[a]_1=g^a$ describes the same structure multiplicatively.

<div class="captioned-table" id="table-07-1" role="group" aria-labelledby="table-caption-07-1">

<p class="table-caption" id="table-caption-07-1"><strong>Table 07-1：Pairing types and their corresponding scalar operations</strong></p>

| Object | Notation and operation | Scalar interpretation |
|---|---|---|
| $G_1$ | $[a]_1+[b]_1=[a+b]_1$ | Addition |
| $G_2$ | $k[a]_2=[ka]_2$ | Multiplication by known $k\in\mathbb F_q$ |
| $G_T$ | $[a]_T[b]_T=[a+b]_T$ | Addition of exponents |
| Pairing | $e([a]_1,[b]_2)=[ab]_T$ | Multiplication of two scalars |

</div>

For practical asymmetric pairings, a $G_1$ element cannot simply be supplied in a $G_2$ input position. $G_2$ uses an extension-field curve or a twist representation; $G_T$ is an order-$q$ subgroup of $\mathbb F_{p^k}^*$. The embedding degree $k$ is the smallest positive integer satisfying $q\mid(p^k-1)$.

### 2.5 What bilinearity can check {#pairing-product-check}

Separating the two arguments gives

$$e(U+V,Q)=e(U,Q)e(V,Q),\qquad e(P,S+T)=e(P,S)e(P,T).$$

Applying these identities to scalar multiplication yields $e(aP,bQ)=g_T^{ab}$. Non-degeneracy and prime order imply that $g_T$ has order $q$, hence

$$e([a]_1,[b]_2)=e([c]_1,[1]_2)\quad\Longleftrightarrow\quad ab=c\text{ in }\mathbb F_q.$$

Checking the left side does not require recovering the scalars. In an abstract order-101 example, $a=7,b=9,c=63$ gives $[63]_T$ on both sides; $c=64$ fails. This illustrates exponent arithmetic, not a concrete secure elliptic-curve construction.

Likewise,

$$e([a]_1,[b]_2)=e([c]_1,[1]_2)e([h]_1,[z]_2)\quad\Longleftrightarrow\quad ab=c+hz.$$

This helps read [Session 4's QAP relation](./session-04#qap-worked-math), $\mathcal A(\tau)\mathcal B(\tau)=\mathcal C(\tau)+H(\tau)Z(\tau)$. This does not mean that Groth16 sends these four evaluations directly.

Pairing output lies in $G_T$ and cannot simply be fed back into the pairing to multiply by another unknown scalar. Encoding a value as a point also does not automatically hide it: if $a\in\{0,1\}$, compare $[a]_1$ with $O$ and $P$. Discrete-log hardness and zero-knowledge are distinct properties.

### 2.6 Evaluating at a secret point using group elements {#encoded-polynomial-evaluation}

An **SRS** is a *structured reference string*: public parameters generated during setup and referenced by the prover and verifier according to their roles. Despite the word “string,” in this example it is an ordered list of group elements. The entries are structured: they correspond to powers of a setup scalar $\tau$.

Consider a simplified setup for polynomials of maximum degree $d$. Let $P_1$ generate $G_1$, and use a secret $\tau\in\mathbb F_q$ to compute $[1]_1=P_1,[\tau]_1=\tau P_1,\dots,[\tau^d]_1=\tau^dP_1$. Publish these group elements. Here $[a]_1$ means the scalar $a$ encoded as the point $aP_1$; it does not publish the number $a$. A security premise is that no one knows $\tau$ after setup. A distributed setup depends on conditions such as at least one honest participant erasing their secret contribution. If the secret remains known, the security of the construction may be undermined.

For example, if $f(X)=2+3X+X^2$, an SRS up to degree 2 lets the prover compute

$$2[1]_1+3[\tau]_1+[\tau^2]_1=[2+3\tau+\tau^2]_1=[f(\tau)]_1.$$

The left side uses only scalar multiplication by the known coefficients and group addition. The prover need not know $\tau$ or directly read the numerical value $f(\tau)$.

<StudyDiagram id="07-4" :en="true" />

In general, for $f(X)=\sum_{j=0}^d f_jX^j$, an SRS containing $[1]_1,[\tau]_1,\dots,[\tau^d]_1$ enables

$$\sum_{j=0}^d f_j[\tau^j]_1=[f(\tau)]_1.$$

This is a **multi-scalar multiplication (MSM)**: known coefficients multiply points, and the results are added. It is analogous to Session 4's dot product, with encoded values replacing scalars. The published output is the group encoding $[f(\tau)]_1$, not the numerical value $f(\tau)$. Here we focus on the powers-of-$\tau$ portion of the SRS.

Groth16's proving key additionally contains circuit-dependent combinations and encodings involving $1/\delta$. Using a supplied point $[u/\delta]_1$ does not mean the prover numerically divides by an unknown $\delta$. The available key elements determine which computations can be performed.

### 2.7 Reading Groth16's verification equation as a scalar identity {#groth16-pairing-derivation}

As preparation for Session 11, check why a correctly generated proof satisfies verification. The following rewrites the [original Groth construction](https://iacr.org/archive/eurocrypt2016/96650272/96650272.pdf) in our QAP notation.

Let $z_0=1,z_1,\dots,z_m$ be an assignment. Public indices $I$ include 0; private indices $J$ form the complementary set. For column polynomials $A_j,B_j,C_j$, define explanatory scalars

$$U=\sum_jz_jA_j(\tau),\quad V=\sum_jz_jB_j(\tau),\quad W=\sum_jz_jC_j(\tau).$$

A valid assignment satisfies $UV=W+H(\tau)Z(\tau)$. Define

$$S_I=\sum_{j\in I}z_j(\beta A_j(\tau)+\alpha B_j(\tau)+C_j(\tau)),$$
$$S_J=\sum_{j\in J}z_j(\beta A_j(\tau)+\alpha B_j(\tau)+C_j(\tau)),$$

so $S_I+S_J=\beta U+\alpha V+W$. For nonzero $\gamma,\delta$ and fresh proof randomness $r,s\in\mathbb F_q$, set

$$a=\alpha+U+r\delta,\qquad b=\beta+V+s\delta,$$
$$c=\frac{S_J+H(\tau)Z(\tau)}{\delta}+sa+rb-rs\delta.$$

The proof contains $\pi_A=[a]_1,\pi_B=[b]_2,\pi_C=[c]_1$, not the numerical scalars. They are computed through proving-key linear combinations. The construction provides the key elements needed to encode the $rb$ term in $G_1$; it does not convert $\pi_B$ from $G_2$ to $G_1$.

Using verification-key points $K_j=[(\beta A_j(\tau)+\alpha B_j(\tau)+C_j(\tau))/\gamma]_1$, compute

$$\mathrm{IC}=\sum_{j\in I}z_jK_j=[S_I/\gamma]_1.$$

Expansion gives

$$\begin{aligned}
ab&=\alpha\beta+\beta U+\alpha V+UV+s\delta(\alpha+U)+r\delta(\beta+V)+rs\delta^2\\
&=\alpha\beta+S_I+S_J+H(\tau)Z(\tau)+s\delta(\alpha+U)+r\delta(\beta+V)+rs\delta^2\\
&=\alpha\beta+S_I+\delta c.
\end{aligned}$$

The first step expands the product; the second substitutes the QAP identity; the third uses the definition of $c$. Both $sa$ and $rb$ contain $rs\delta$, so one copy must be subtracted. Bilinearity translates this scalar identity into

$$e(\pi_A,\pi_B)=e([\alpha]_1,[\beta]_2)\,
 e(\mathrm{IC},[\gamma]_2)\,e(\pi_C,[\delta]_2).$$

**The verifier compares target-group elements without recovering secret scalars.** This calculation establishes completeness for correctly generated proofs. Knowledge soundness and zero-knowledge require separate arguments, discussed with the original paper's model in Session 11. Implementations must also validate inputs, including curve and subgroup membership.

Public-input MSM work depends on the number of public inputs, while the proof has three group elements and the number of pairings is constant. Groth16 does not check every circuit multiplication with a separate pairing.


---

## 3. A types and relationships of cryptographic hardness assumptions {#_3-a-hierarchy-of-cryptographic-hardness-assumptions}

### 3.1 Why are assumptions needed?

More available operations do not by themselves give a secure scheme. Specify which problem the adversary is assumed unable to solve. For each assumption, ask what the adversary receives and what it is challenged to compute, rather than memorizing its name.

### 3.2 The discrete logarithm (DL) assumption

The DL assumption says that an adversary given a generator $g$ of a group $G$ and $g^x$ cannot efficiently recover $x$. Notice the asymmetry between computing an exponentiation and reversing it. Schnorr in Session 2 checked knowledge of such a secret exponent.

### 3.3 Moving to stronger assumptions

DL alone may not suffice to prove a scheme’s required properties. Some constructions use hardness problems with richer input or assumptions about knowledge behind an output. The following examples distinguish computational hardness from knowledge assumptions involving extractors.

- **The q-SDH (q-Strong Diffie–Hellman) assumption:** Given $g, g^x, g^{x^2}, \dots, g^{x^q}$, it is hard to find a pair of the form $(c, g^{1/(x+c)})$ with $x+c\ne0$. Here q bounds the supplied powers; it is separate from the group order denoted q in Section 2. Exponents and c are taken modulo the prime group order. It is used in analyses such as KZG evaluation binding. Original Groth16 knowledge soundness is analyzed separately in the generic bilinear group model.
- **The Knowledge-of-Exponent Assumption (KEA):** An adversary given $g$ and $g^x$ that outputs a pair $(g^a, (g^x)^a)$ is assumed to know the exponent $a$. Unlike standard computational hardness assumptions, this is an assumption about knowledge.

### 3.4 What the distinction between standard and non-standard assumptions means

Labels such as “standard” and “non-standard” do not order all security guarantees on one scale. Assess the history of analysis, information given to the adversary, and whether an extractor’s existence is assumed. q-SDH and KEA are different kinds of assumptions. Groth16’s original knowledge-soundness analysis in Session 11 uses the generic bilinear group model; distinguish it from q-SDH-based evaluation binding for KZG.

---

## 4. Security proofs by reduction

### 4.1 The basic idea

Suppose an adversary can break the scheme. Can we use it to solve another problem? Such a construction makes the connection between an attack and an assumed hardness problem explicit. A reduction has the following basic form:

> If an efficient adversary $\mathcal{A}$ can break a protocol $\Pi$, then we can use $\mathcal{A}$ to construct an efficient algorithm $\mathcal{B}$ that solves a supposedly hard computational problem $P$, such as discrete logarithms.

If this construction is possible, then assuming $P$ is hard implies that breaking $\Pi$ is also hard. This is the basic form of a **reduction proof**.

<span id="figure-07-3"></span>
<span id="caption-07-3"></span>

<div class="captioned-table" id="table-07-3" role="group" aria-labelledby="table-caption-07-3">

<p class="table-caption" id="table-caption-07-3"><strong>Table 07-3：A reduction turns an attacker into a solver</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. Suppose an attacker A breaks the protocol | Use A’s inputs and outputs |
| 2. Construct reduction B | Use A as a subroutine to solve a hard problem |
| 3. Compare with the hardness assumption | Account for B’s runtime and success probability |

</div>

Read security together with its assumption, model and reduction loss. DL, q-SDH and KEA are not a simple linear ranking.

### 4.2 Why this form matters

A reduction establishes that an attack is difficult if the assumed problem is difficult. It does not prove the assumption itself. Rewinding and the forking lemma from Session 6 can help construct the algorithm establishing that relationship. Check the allowed access and how success probability and running time change.

This perspective explains why an assumption such as q-SDH might be introduced: it enables a security proof for a construction by reducing an attack on that construction to the assumed-hard problem.

---

## Summary and next session

Today we studied a tool for checking multiplication and the premises for using it securely. Distinguish available computations from security guarantees.

- The definition of elliptic curve groups and their role as cryptographically useful finite abelian groups.
- The definition of bilinear pairings and their multiplicative verification capability.
- The practical role of pairing-friendly curves such as BN254 and BLS12-381.
- The progression from discrete logarithms to q-SDH and KEA, and the distinction between standard and non-standard assumptions.
- Reductions as a way to establish cryptographic security relative to assumptions.

In Session 8, we will study polynomial commitments: committing to a polynomial and later revealing its value at a chosen point in a verifiable way. We will examine both KZG commitments, which use today's pairings, and FRI-based commitments, which use FRI from Session 6, alongside the cryptographic definitions of binding and hiding.

---

## References and further reading

[1] Silverman, [*The Arithmetic of Elliptic Curves*](https://link.springer.com/book/10.1007/978-0-387-09494-6) — a standard textbook on elliptic curves; publisher's page for the second edition.

[2] Boneh and Franklin, [“Identity-Based Encryption from the Weil Pairing,” CRYPTO 2001](https://www.iacr.org/archive/crypto2001/21390212.pdf) — a classic starting point for cryptographic applications of pairings; public conference-version PDF. [Author's publication page and 2003 full version](https://crypto.stanford.edu/~dabo/pubs/abstracts/bfibe.html).

[3] Barreto and Naehrig, [“Pairing-Friendly Elliptic Curves of Prime Order,” SAC 2005](https://eprint.iacr.org/2005/133) — public IACR ePrint version with PDF; the conference proceedings were published in 2006.

[4] Katz and Lindell, [*Introduction to Modern Cryptography*](https://www.cs.umd.edu/~jkatz/imc.html) — textbook treatment of reduction-based security; author's book page, contents, and errata. The supplied manuscript specifies Chapter 11; check the contents of the edition you are using.

## Suggested discussion questions

- Present $e(aP, bQ) = e(P,Q)^{ab}$ and let students explore what it enables before discussing Section 2.3, highlighting the nontrivial new capability.
- Ask why some protocols cannot be proved secure using standard assumptions alone, and discuss the motivation for introducing non-standard assumptions.
- Have students explain the reduction structure in their own words: if an adversary existed, we could use it to solve another problem. Encourage them to notice the resemblance to proof by contradiction.

---

## Session 7 exercise

Check the lecture concepts with calculations and concrete examples in the [Session 7 exercise](../exercises/session-07).
