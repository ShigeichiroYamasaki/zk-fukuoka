---
outline: [2, 3]
prev:
  text: Session 1 · What is a proof?
  link: /en/learn/session-01
next:
  text: Session 3 · Finite fields, polynomials, and probabilistic checking
  link: /en/learn/session-03
---

<script setup>

import SchnorrOverview from "../../.vitepress/theme/SchnorrOverview.vue";
</script>

# Session 2: Zero-knowledge and the generalization of witnesses

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 28, 2026

[Session index](./sessions) · [Topic index](./topics) · [Session 2 in the syllabus](./#session-2) · [Session 2 exercises](../exercises/session-02)

## Context and learning objectives

Last time, we asked what changes when a verifier can ask questions. Today we question the other assumption: must we hand over the witness to have a proposition checked? If we do not, how can we establish that no extra information is conveyed? Today’s three objectives are:

1. Formally define zero-knowledge through the simulator paradigm and understand the hierarchy of indistinguishability.
2. Introduce knowledge soundness and extractors as concepts that capture whether a prover really knows a witness.
3. Understand the **qualitative** significance of extending witnesses from simple algebraic objects, such as discrete logarithms, to general computations, and organize this development along the two axes that run through Act II: expressiveness and efficiency.

Today completes Act I, purpose and motivation. In the next session, we begin Act II: assembling the tools.

---

## 1. Introduction: making “prove without revealing a secret” precise

First, consider what “not revealing a secret” means. Last time, we stated a goal: establish knowledge without handing over the secret. Stating that goal does not yet let us decide whether a procedure achieves it.

One might initially think it is enough not to send the witness $w$ to the verifier. That is insufficient, however: the **process** of interaction can itself leak partial information about the witness. Examples include the timing of the prover's responses, statistical biases in those responses, and information accumulated across multiple proofs.

How can we formalize “nothing leaks”? GMR's answer was the **simulator paradigm**.

---

Timing and power side channels are not automatically covered by the abstract zero-knowledge definition: its guarantee concerns the verifier view included in the model.

## 2. Defining zero-knowledge through the simulator paradigm

### 2.1 The central idea

What should we compare the information obtained by the verifier against? We use information that can be generated without the witness. The simulator paradigm expresses this idea as follows:

> Everything a verifier obtains from an interaction is something it could **simulate on its own, without knowing the witness**.

In other words, if an algorithm that generates a transcript—a simulator $S$—can output a distribution indistinguishable from a real interaction without access to the witness $w$, then the interaction is considered to give the verifier essentially no new information.

#### 2.1.1 Before the definition: relation $R$, public input $x$, and proposition $x\in L_R$

Before formalizing zero-knowledge, let us identify what is public and what we want to keep private. In Session 1, a verifier received a public input $x$ and a witness $w$. Relation $R$ specifies **which pairs of these values satisfy the required condition**.

<div class="captioned-table" id="table-02-1" role="group" aria-labelledby="table-caption-02-1">

<p class="table-caption" id="table-caption-02-1"><strong>Table 02-1：Notation for public input, witness, relation and language</strong></p>

| Symbol | Meaning |
| --- | --- |
| $x$ | The public input shared by prover and verifier |
| $w$ | A witness satisfying the condition for input $x$ |
| $R$ | The set of pairs $(x,w)$ satisfying that condition |
| $(x,w)\in R$ | The condition that $w$ is a valid witness for $x$ |
| $L$ | The set of inputs $x$ with at least one valid witness |

</div>

A relation here is a **binary relation**, specifying a condition on pairs of objects. Encoding inputs and witnesses as finite binary strings gives $R\subseteq\{0,1\}^*\times\{0,1\}^*$. Distinguish membership $(x,w)\in R$ from the procedure that checks it. We also sometimes write the result of this check as $R(x,w)=1$ for membership and $R(x,w)=0$ otherwise.

For the NP relations used in this course, membership in $R$ is decidable in deterministic polynomial time, and valid witnesses satisfy $|w|\le p(|x|)$ for some polynomial $p$. The associated language is

$$L=L_R:=\{x\mid \exists w,\ (x,w)\in R\}.$$

Thus **$R$ specifies whether a particular pair satisfies the condition, whereas $L$ collects the inputs for which a suitable partner $w$ exists**. Under these conditions, $L\in\mathrm{NP}$.

Return to the composite-number example from Session 1. Omitting the encoding of integers, define

$$R_{\mathrm{comp}}=\{(n,d)\mid n,d\text{ are integers},\ 1<d<n,\ d\mid n\}.$$

Here $d\mid n$ means that $d$ divides $n$ exactly. The pairs $(91,7)$ and $(91,13)$ belong to this relation, but $(91,8)$ does not. The corresponding language $L_{R_{\mathrm{comp}}}$ consists of encodings of composite numbers: 91 belongs, whereas the prime 97 does not. This small example illustrates the notation, not the difficulty of discovering a secret.

The proposition associated with public input $x$ is **“$x\in L_R$,” meaning that there exists a witness $w$ such that $(x,w)\in R$**. Section 3 distinguishes the truth of this proposition from the responding prover's knowledge of such a witness.

In the next definition, $R$ and $L$ are fixed as part of the scheme and commonly known. The real prover uses a valid witness $w$, whereas the simulator receives public input $x$ without $w$. Keep that distinction in mind when reading the formula. See also [Sets, membership and languages](./terms/sets-and-languages) and [NP relations in more detail](./terms/np-relations).

### 2.2 A formal definition

Consider an interactive proof system $(P,V)$ with the relation $R$ and language $L$ introduced above. In the standard definition, for every **probabilistic polynomial-time verifier** $V^*$, there must be a **polynomial-time simulator** $S$ that reproduces the verifier's view of its interaction with the honest prover without the witness (some definitions permit expected polynomial time). Here, polynomial time is an asymptotic bound in the input size; it does not mean that the computation is practically fast. Let us define the random variables to make clear which distributions are compared.

**Separate what is fixed from what is sampled.** Fix a valid pair $(x,w)\in R$, the verifier algorithm $V^*$, and auxiliary input $z$ that the verifier possesses before the interaction. Use an empty string for $z$ when no auxiliary input is considered. We do not sample and average over $x$ or $w$ here.

In a real interaction, independently sample the prover's random tape $r_P$ and the verifier's random tape $r_V$ according to their procedures. Once inputs and random tapes are fixed, the interaction is determined. Resampling the tapes makes the **verifier's complete record** a random variable:

$$X_{x,w,z}:=\operatorname{View}_{V^*}\bigl[P(x,w;r_P)\leftrightarrow V^*(x,z;r_V)\bigr].$$

Arguments after the semicolon specify an algorithm's random tape. The verifier's view can be encoded as

$$X_{x,w,z}=(x,z,r_V,m_1,\ldots,m_k),$$

where $m_1,\ldots,m_k$ are the messages it receives. Its outgoing messages and final decision can be reconstructed from this record and its algorithm. **The comparison concerns the whole view, not just a one-bit accept/reject decision.** The prover's random tape $r_P$ and witness $w$ are not themselves supplied as components of the view.

The simulator uses its own random tape $r_S$ to output a record in the same format. Its output is another random variable:

$$Y_{x,z}:=S(x,z;r_S).$$

The simulator receives $x,z$ but not $w$. It may depend on $V^*$, but we cannot choose a different simulator for each witness. One simulator must satisfy the condition for all valid pairs $(x,w)$ and admissible auxiliary inputs $z$. Depending on the definition, simulation runs in polynomial or expected polynomial time.

**A distribution assigns a probability to each possible record.** For a particular record $t$, we compare

$$\Pr[X_{x,w,z}=t]\quad\text{and}\quad\Pr[Y_{x,z}=t].$$

The probability on the left comes from the real interaction's randomness $r_P,r_V$; the probability on the right comes from the simulator's randomness $r_S$. We do not require two executions to produce the same record. We compare **the probabilities with which records are produced**.

Below, abbreviate the variables as $X,Y$. We compare families of distributions as input length $n=|x|$ grows, with auxiliary-input length polynomially bounded in $n$. A nonnegative function $\mathrm{negl}(n)$ eventually becomes smaller than every inverse polynomial. Concrete cryptographic schemes may instead explicitly use a security parameter separate from input length.

- **Perfect zero-knowledge:** for every record $t$, $\Pr[X=t]=\Pr[Y=t]$. The two random variables have identical distributions.
- **Statistical zero-knowledge:** the statistical distance between the distributions is negligible. For discrete records, this distance is defined by

$$\Delta(X,Y):=\frac12\sum_t\left|\Pr[X=t]-\Pr[Y=t]\right|\le\mathrm{negl}(n).$$

  Equivalently, for every set of records $A$, the difference $|\Pr[X\in A]-\Pr[Y\in A]|$ is bounded by the same limit. Even a computationally unbounded distinguisher can gain negligible advantage from the difference.

- **Computational zero-knowledge:** for every probabilistic polynomial-time distinguisher $D$, the following difference is negligible:

$$\left|\Pr[D(x,z,X)=1]-\Pr[D(x,z,Y)=1]\right|\le\mathrm{negl}(n).$$

  The algorithm $D$ receives public and auxiliary inputs together with one record from either generation process, and returns 1 to indicate “I think this is a real interaction.” The probabilities include both record-generation randomness and $D$'s own randomness. The distributions need not be statistically close; rather, every probabilistic polynomial-time $D$ has negligible distinguishing advantage. For each $D$, the bound must hold across all valid inputs, witnesses, and admissible auxiliary inputs.

**A small example clarifies what comparing distributions means.** These are hypothetical two-bit records, not a zero-knowledge protocol.

<div class="captioned-table" id="table-02-2" role="group" aria-labelledby="table-caption-02-2">

<p class="table-caption" id="table-caption-02-2"><strong>Table 02-2：Two probability distributions over two-bit records</strong></p>

| Record $t$ | Probability for real record $X$ | Probability for a candidate simulator's record $Y$ |
| --- | --- | --- |
| $00$ | $1/4$ | $1/2$ |
| $01$ | $1/4$ | $0$ |
| $10$ | $1/4$ | $0$ |
| $11$ | $1/4$ | $1/2$ |

</div>

Each individual bit is equally likely to be 0 or 1 under either distribution. However, a distinguisher returning 1 when the bits agree has $\Pr[D(X)=1]=1/2$ and $\Pr[D(Y)=1]=1$, giving advantage $1/2$. Identical marginal distributions do not imply an identical **joint distribution of the complete record**. If this gap persists as input length grows, even computational indistinguishability fails. This is why zero-knowledge compares the entire view.

The objects being compared are therefore **the distributions of the real-view random variable $X$ and simulator-output random variable $Y$, for the same fixed public input**. Restricting a dishonest prover for soundness is a different axis from restricting distinguishers for zero-knowledge. Being an argument does not force computational zero-knowledge: original Groth16, studied in Session 11, establishes perfect zero-knowledge.

Fix V\*, a valid pair (x, w) ∈ R, and auxiliary input z.<br>Do not sample and average over x or w.

<span id="figure-02-1"></span>
<span id="caption-02-1"></span>

<div class="captioned-table" id="table-02-7" role="group" aria-labelledby="table-caption-02-7">

<p class="table-caption" id="table-caption-02-7"><strong>Table 02-7：Random variables X and Y: compare distributions of the whole record</strong></p>

| Item | Explanation | Equation / condition |
| --- | --- | --- |
| Real interaction → random variable X | P uses x, w; V\* uses x, z.<br>Sample r\_P and r\_V independently.<br>X is V\*’s view: public and auxiliary inputs, its own randomness, and received messages. | X = (x, z, r\_V, m₁, …, m\_k) |
| Simulation → random variable Y | S uses x, z and its own randomness r\_S.<br>It receives no w.<br>Y is a generated record in the same format as X.<br>One S must work for every valid w. | Y = S(x, z; r\_S) |

</div>

Compare each record’s probability: Pr[X = t] versus Pr[Y = t]<br><br>Perfect ZK: equal probabilities for every t<br>Statistical ZK: statistical distance Δ(X, Y) ≤ negl(n)<br>Computational ZK: for every probabilistic polynomial-time distinguisher D,<br>&#124;Pr[D(x, z, X) = 1] − Pr[D(x, z, Y) = 1]&#124; ≤ negl(n)

As in the text, n = &#124;x&#124;. Probabilities are over record-generation randomness, plus D’s randomness when distinguishing. Compare the entire view, not only acceptance. Individual executions need not produce equal records.

An **honest verifier** is a verifier that follows the prescribed protocol, not a judgment about someone’s character. It samples challenges from the specified distribution and applies the specified acceptance rule. We still allow it to record and analyze the messages and its own randomness. **Honest-verifier zero-knowledge (HVZK)** means that this verifier’s view can be simulated without the witness. This differs from zero-knowledge against verifiers that deviate from the protocol, for example by choosing challenges differently.

**Graph isomorphism example.** Let the public graphs be $G_0,G_1$ and the secret isomorphism be $\pi:G_0\to G_1$. The prover samples a random vertex permutation $\rho$, sends $H=\rho(G_0)$, receives a uniform bit $b$, and returns an isomorphism $G_b\to H$: $\rho$ for $b=0$, or $\rho\circ\pi^{-1}$ for $b=1$. Answers to both challenges for the same $H$ yield an isomorphism between the public graphs by composition.

An honest-verifier simulator can choose $b$ and a random isomorphism $G_b\to H$ first. Malicious-verifier security requires a separate argument involving rewinding. Generating a record and answering a live verifier are different tasks.

### 2.3 Checking the intuition

The next explanation previews the **Schnorr identification protocol**, developed in Section 4.1. It demonstrates knowledge of a secret exponent corresponding to a public value without handing over that exponent. It has three stages: the prover sends an initial message (commitment), the verifier sends a random challenge, and the prover responds. An honest verifier in this Schnorr-type protocol samples its challenge uniformly from the specified set after receiving the commitment, then checks the response using the prescribed equation.

<SchnorrOverview :en="true" />



<div class="captioned-table" id="table-02-10" role="group" aria-labelledby="table-caption-02-10">

<p class="table-caption" id="table-caption-02-10"><strong>Table 02-10：Message generation in the real interaction and simulation</strong></p>

| Setting | Generation order | Condition |
| --- | --- | --- |
| Real interaction | t → c → s | Commit before receiving the challenge. |
| Honest-verifier simulation | (c, s) → t | Choose c and s first; derive t. Output the record in the order (t, c, s). |

</div>

Generating a record in this different order is not the same as responding to a live verifier. This illustration alone does not prove zero-knowledge against malicious verifiers.

If a transcript can be generated without the witness, could a dishonest prover do the same? Distinguish an output record from a live interaction with a verifier. For example, a Schnorr-type honest-verifier simulator can first choose a challenge and response, then derive a commitment satisfying the verification equation. A real prover commits before receiving the verifier’s challenge. The order differs. This intuition alone does not establish zero-knowledge against arbitrary malicious verifiers.

---

## 3. Knowledge soundness and extractors

### 3.1 Why soundness alone is insufficient

Soundness requires that false propositions are unlikely to be accepted. But is a proposition being true the same as this prover knowing a witness? In authentication, it is not enough that someone with the secret exists. We want the party responding now to possess it. Knowledge soundness addresses this distinction.

### 3.2 The concept of an extractor

**Knowledge soundness** formalizes this requirement. We focus on **black-box extraction**, commonly used for classical interactive protocols: an extractor invokes a prover and examines its responses. It is not assumed to read the prover's secret directly.

> If a prover $P^*$ makes verifier $V$ accept with probability above a specified threshold, an extractor $E$ with prescribed access to $P^*$ must be able to obtain a valid witness. Its success probability and running time must also be evaluated.

The potentially dishonest $P^*$ is not assumed to start with a witness as input. Here $V$ follows the protocol. This differs from Section 2, where we protected information against a potentially dishonest verifier $V^*$.

**The extractor is not a third participant in an ordinary execution.** It is an algorithm constructed in a security proof. Below, the access model allows restarting the prover or rewinding it to the same state with the same randomness and issuing another challenge. An actual verifier interacting with a remote party does not automatically have this access. Permissions depend on the scheme and definition; not all extractors use rewinding.

### 3.3 Two experiments and their random variables

**Fix public input $x$, the prover algorithm $P^*$, and its private auxiliary information.** The extractor need not receive that information; regard it as incorporated into $P^*$. Execution randomness still changes the outcome. Describe real interaction and extraction as separate experiments.

**Experiment 1: real interaction between prover and verifier.** Independently sample their random tapes $\rho_P,\rho_V$ and run the interaction. Define the decision random variable

$$A_x:=\mathbf{1}\{V\text{ accepts in its interaction with }P^*\}\in\{0,1\}.$$

The indicator $\mathbf{1}\{\cdots\}$ equals 1 when the condition holds and 0 otherwise. The acceptance probability is

$$p_{P^*}(x):=\Pr_{\rho_P,\rho_V}[A_x=1].$$

This one-bit decision differs from random variable $X$ in Section 2, which represented the whole verifier view.

**Experiment 2: the extractor runs the prover.** Extractor $E$ receives public input $x$ and invokes $P^*$ with the permitted access. It may emulate the verifier and choose queries or rewinds based on responses. With computational budget $T$, define its output random variable

$$W_{x,T}:=E_T^{P^*}(x)\in\{0,1\}^*\cup\{\bot\}.$$

The superscript $P^*$ denotes access to the prover, not exponentiation. The symbol $\bot$ means that no valid witness was obtained within the budget. Check candidate outputs against $R$ and return $\bot$ if invalid. The budget includes prover-invocation costs as specified by the chosen access model.

Randomness in this experiment comes from $E$ and from the random tapes selected for its executions of $P^*$. Rewound branches reuse the prover's randomness, so **their responses need not be independent**. Define extraction's success indicator and probability by

$$B_{x,T}:=\mathbf{1}\{W_{x,T}\ne\bot\ \land\ (x,W_{x,T})\in R\},\qquad e_{P^*}(x,T):=\Pr[B_{x,T}=1].$$

The extractor must output some $w'$ with $(x,w')\in R$. It need not recover the exact value originally stored inside the prover.

<div class="captioned-table" id="table-02-3" role="group" aria-labelledby="table-caption-02-3">

<p class="table-caption" id="table-caption-02-3"><strong>Table 02-3：Random variables and outputs in interaction and extraction</strong></p>

| Aspect | Real interaction | Extraction experiment |
| --- | --- | --- |
| Algorithms | $P^*$ and $V$ | $E$ invoking $P^*$ |
| Random variables | Decision $A_x\in\{0,1\}$ | Output $W_{x,T}$ and success indicator $B_{x,T}$ |
| Probability | Acceptance $p_{P^*}(x)$ | Extraction success $e_{P^*}(x,T)$ |
| Result | Accept or reject | Valid witness or $\bot$ |

</div>

These are separate experiments: do not assume $p_{P^*}(x)=e_{P^*}(x,T)$. Nor is $e_{P^*}(x,T)$ the probability of learning a secret by eavesdropping on one accepting transcript. Knowledge soundness connects **the ability to cause acceptance with extraction under specified access and computational resources**.

Fix public input x and prover strategy P\*, including its private information.<br>Do not assume that P\* starts with a witness.

<span id="figure-02-4"></span>
<span id="caption-02-4"></span>

<div class="captioned-table" id="table-02-8" role="group" aria-labelledby="table-caption-02-8">

<p class="table-caption" id="table-caption-02-8"><strong>Table 02-8：Acceptance and extraction: different experiments and random variables</strong></p>

| Item | Explanation | Equation / condition |
| --- | --- | --- |
| Real interaction: P\* ↔ V | Sample prover and verifier randomness and interact.<br>V outputs accept or reject.<br>A\_x is the binary decision variable. | p\_&#123;P\*&#125;(x) = Pr[A\_x = 1] |
| Extraction experiment: E ↔ P\* | E emulates a verifier and invokes P\*.<br>This model permits reruns and rewinding.<br>Output W: valid witness w′ or failure ⊥.<br>B = 1 for (x, W) ∈ R; otherwise B = 0. | W = E\_T^&#123;P\*&#125;(x); e\_&#123;P\*&#125;(x,T) = Pr[B = 1] |

</div>

Knowledge soundness: when acceptance p exceeds knowledge error κ,<br>relate p − κ to extraction success and runtime.<br>p and e are not the same probability.

E is an algorithm in the security proof, not a third participant in normal interaction. Rewound responses share randomness and need not be independent. Section 2’s S outputs a record; E outputs a witness.

### 3.4 Knowledge error and extraction time

Should one lucky acceptance already count as knowledge? A **knowledge error $\kappa(x)$** supplies a threshold. When $p_{P^*}(x)>\kappa(x)$, relate the gap

$$\delta(x):=p_{P^*}(x)-\kappa(x)>0$$

to extraction time and success probability. The threshold is protocol- and definition-dependent; it is not a probability obtained by inspecting whether someone mentally “knows.”

A representative formulation bounds the expected time to obtain a valid witness by an expression such as $\operatorname{poly}(|x|)/\delta(x)$. An inverse-polynomial gap supports efficient extraction; a merely positive gap need not yield polynomial time. Other formulations constrain the success probability of a time-bounded extractor. In either case, read **acceptance probability, knowledge error, extraction probability, and running time together**. See [Bellare–Goldreich's original paper](https://www.wisdom.weizmann.ac.il/~oded/pok.html) and their [follow-up on randomized provers](https://www.wisdom.weizmann.ac.il/~oded/COL/pok-note.pdf) for precise quantifiers and randomness models.

**Preview rewinding through Schnorr.** In Section 4.1's notation, the public value is $y=g^w$ and the challenge $c\in\mathbb{Z}_q$ is uniform over $q$ choices. Guess one $c$, choose a response $s$, and set $t=g^s y^{-c}$: this permits answering that challenge without using a witness. The guessing probability $1/q$ gives the knowledge-error threshold for this protocol.

The extractor rewinds to the state after sending the same commitment $t$ and seeks two accepting responses $s_1,s_2$ to different challenges $c_1,c_2$. If obtained, it computes

$$w'=(s_1-s_2)(c_1-c_2)^{-1}\pmod q$$

and checks $y=g^{w'}$. Obtaining both accepting responses is a probabilistic event: one acceptance does not guarantee a second.

For example, fix the prover's randomness and post-commitment state so responses are deterministic. If exactly $k$ of the $q$ challenges are accepted in that state, a single acceptance has probability $k/q$. Sampling two independent uniform challenges from the same state gives two distinct accepting challenges with probability

$$\frac{k(k-1)}{q^2}.$$

It is zero for $k=1$, whereas $k\ge2$ allows an extractable pair. This calculation concerns one fixed state. A guarantee for general randomized provers also requires analyzing runtime and resampling initial states. This is why acceptance and extraction are treated with different random variables.

### 3.5 How this differs from simulation

Section 2's simulator $S$ generates a **verifier's record** without a witness. The extractor $E$ uses prescribed access to a prover capable of causing acceptance to generate a **valid witness**. Their outputs and available access differ.

Zero-knowledge protects against extra information being learned in ordinary interaction. Extraction with additional rewinding access does not by itself contradict that guarantee. If an implementation allows the verifier to force randomness reuse or reset the prover, its security in that setting needs separate analysis.

*(Session 6 develops rewinding and the forking lemma further.)*

---

## 4. Generalizing witnesses: from algebraic relations to general computation

This is the second half of today's lecture and the closing topic of Act I as a whole.

### 4.1 Simple witnesses: proofs built on structure

Use Schnorr identification to make the distinction concrete. First fix the proposition being checked and what the prover asserts that they know.

**Separate the proposition from its witness**

The public parameters specify a cyclic group $G=\langle g\rangle$ of prime order $q$ and a generator $g$. “Cyclic” means that every group element is a power of $g$; the order $q$ is the number of elements. We write the group operation multiplicatively.

<div class="captioned-table" id="table-02-4" role="group" aria-labelledby="table-caption-02-4">

<p class="table-caption" id="table-caption-02-4"><strong>Table 02-4：Schnorr public input, witness and relation</strong></p>

| Symbol | Meaning | Who has it? |
| --- | --- | --- |
| $x=(G,q,g,y)$ | Public input that specifies the proposition $x\in L_{R_{\mathrm{DL}}}$; $y\in G$ acts as a public key | Both prover and verifier |
| $w\in\mathbb{Z}_q$ | A secret exponent satisfying $y=g^w$: the witness | The honest prover |
| $R_{\mathrm{DL}}$ | The relation checking that the public input and exponent match | Its definition and checking procedure are public |

</div>

In an implementation, $G$ is represented by a description of the group and its operations. With valid shared group parameters and membership of $y$ checked, define

$$
(x,w)\in R_{\mathrm{DL}}
\quad\Longleftrightarrow\quad
x=(G,q,g,y),\quad w\in\mathbb{Z}_q,\quad y=g^w.
$$

This instantiates Section 2's relation $R$ as the discrete-logarithm relation $R_{\mathrm{DL}}$. When the group parameters are fixed, the public input may be written simply as $y$. The prover asserts: **“For this public value $y$, I know an exponent $w$ such that $y=g^w$.”** The prover does not send $w$. Every $y\in G$ has such an exponent, so checking existence alone does not establish knowledge. Section 3's extractor formalizes precisely this distinction.

**Group elements and exponents live in different algebraic structures**

The exponents $w,r,c,s$ lie in $\mathbb{Z}_q$, with addition and multiplication modulo $q$. Since $q$ is prime, this is also a finite field, in which every nonzero element has an inverse. In contrast, $y$ and the commitment $t$ are elements of $G$. If $G$ is a subgroup of the multiplicative group of $\mathbb{F}_p$, **group multiplication is modulo $p$, while exponent arithmetic is modulo $q$**.

The map connecting these structures is $\varphi:\mathbb{Z}_q\to G$, $\varphi(a)=g^a$. It satisfies

$$
\varphi(a+b)=\varphi(a)\varphi(b),\qquad
\varphi(ca)=\varphi(a)^c.
$$

This **group homomorphism** translates addition of exponents into multiplication of group elements. Because $g$ has order $q$, $g^a=g^b$ implies $a=b\pmod q$. The inverse map exists mathematically, but in a cryptographic group recovering $w$ efficiently from $g^w$ is assumed difficult. An invertible mathematical structure does not imply an efficient inversion algorithm.

**Use this structure to verify without sending the witness**

1. Prover: choose fresh uniform $r\in\mathbb{Z}_q$ and send the commitment $t=g^r$.
2. Verifier: send a uniform challenge $c\in\mathbb{Z}_q$.
3. Prover: send the response $s=r+cw\pmod q$.
4. Verifier: check valid group-element and exponent inputs, and check $g^s=t\cdot y^c$.

For an honest prover, the verification equation follows from

$$
g^s=g^{r+cw}=g^r(g^w)^c=t\cdot y^c.
$$

The verifier uses only public $g,y$, received $t,s$, and its own challenge $c$, without needing $w$ or $r$. This identity explains completeness; a single acceptance does not by itself guarantee knowledge.

**Work through small numbers**

For illustration, take $p=23$, $q=11$, and $g=2$. In power order, the 11 elements of $G=\langle2\rangle\subset\mathbb{F}_{23}^{*}$ are $1,2,4,8,16,9,18,13,3,6,12$. This tiny group is searchable exhaustively and unsuitable for real cryptography.

With witness $w=3$, the public value is $y=2^3\bmod23=8$. Randomness $r=4$ gives commitment $t=16$. For challenge $c=2$, the response is $s=4+2\cdot3=10\pmod{11}$. The verifier obtains

$$
2^{10}\bmod23=12,\qquad
16\cdot8^2\bmod23=12.
$$

The two sides agree. The secret input $w=3$ satisfies the relation, whereas $r=4$ is fresh randomness for this execution. Both are exponents, but their roles differ.

**Extract an exponent satisfying the same relation from two accepting records**

For a malicious prover, do not assume that its responses were honestly computed as $s=r+cw$. Nevertheless, if responses to distinct challenges $c_1\ne c_2$ are both accepted with **the same initial commitment $t$**, dividing the verification equations gives

$$
\frac{g^{s_1}}{g^{s_2}}
=\frac{t y^{c_1}}{t y^{c_2}}
\quad\Longrightarrow\quad
g^{s_1-s_2}=y^{c_1-c_2}.
$$

The nonzero difference $c_1-c_2$ has an inverse in $\mathbb{Z}_q$. Raising both sides to that inverse yields

$$
w'=(s_1-s_2)(c_1-c_2)^{-1}\pmod q,
\qquad g^{w'}=y.
$$

Thus the extracted $w'$ is a **witness satisfying the original relation $(x,w')\in R_{\mathrm{DL}}$**. Group division cancels the common commitment, and inversion in the exponent field solves for a witness. This is special soundness.

In the numerical example, suppose we also obtain the accepting response $s_2=8$ to challenge $c_2=5$ for the same $t=16$. Since $c_1-c_2=8\pmod{11}$ has inverse 7, extraction gives $w'=(10-8)\cdot7=3\pmod{11}$. This describes Section 3's rewinding experiment, not a procedure for reusing randomness in ordinary interactions.

**The relation's algebraic structure directly supplies both the verification and extraction equations.** Whether arbitrary computations come with such a structure is the question leading into Section 4.2.

Public input x = (G, q, g, y) and secret exponent w satisfy y = gʷ. Example: p = 23, q = 11, g = 2, y = 8, w = 3.

<span id="figure-02-2"></span>
<span id="caption-02-2"></span>

<div class="captioned-table" id="table-02-9" role="group" aria-labelledby="table-caption-02-9">

<p class="table-caption" id="table-caption-02-9"><strong>Table 02-9：Schnorr: from proposition and witness to verification and extraction</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. Statement and witness | Claim: know the discrete logarithm of public y.<br>Witness: exponent w. Relation R\_DL: y = gʷ. |
| 2. Connect two algebraic structures | Exponent addition a + b (mod q) → group multiplication gᵃgᵇ.<br>φ(a) = gᵃ; φ(a + b) = φ(a)φ(b). |
| 3. Prover P ↔ verifier V | P → V: t = gʳ / V → P: c / P → V: s = r + cw.<br>V checks gˢ = tyᶜ. Example: r = 4, t = 16, c = 2, s = 10. Both sides are 12 (mod 23). |
| 4. Extractor E: divide two accepting equations for the same t | gˢ¹ = tyᶜ¹ and gˢ² = tyᶜ² → g⁽ˢ¹⁻ˢ²⁾ = y⁽ᶜ¹⁻ᶜ²⁾.<br>w′ = (s₁ − s₂)(c₁ − c₂)⁻¹ mod q → gʷ′ = y.<br>Example: (c₁, s₁) = (2, 10), (c₂, s₂) = (5, 8) → w′ = 3. |

</div>

Exponent arithmetic (w, r, c, s) is modulo q; group multiplication in this example is modulo p. Extraction requires the same t and distinct c. These small values are illustrative; never reuse r in normal interactions.

For another description of the construction, see [RFC 8235 §2.2](https://www.rfc-editor.org/rfc/rfc8235.html#section-2.2). It uses subtraction in the response, so its verification equation is arranged differently from the additive-response convention used here.

### 4.2 General witnesses: when that structure is absent

Now extend the relation to a general program. Consider an NP relation, with bounded computation time and witness length, expressing knowledge of an input producing a specified output. A computation containing branches and comparisons need not come with a group relation to which Schnorr’s verification equation directly applies. We therefore need to translate the computation into a form we can check.

The qualitative shift is worth making explicit:

> A shift from “use the group homomorphism” to “**translate the computation itself into the language of polynomials**.”

This translation mechanism is **arithmetization**, a central topic of Act II that we will study in Session 4 through R1CS/QAP and AIR. For now, emphasize that this translation is a **means, not an end**. The goal remains to satisfy completeness, soundness, and zero-knowledge for arbitrary computations.

### 4.3 How efficiency requirements change

Generalizing computation also raises the question of how much work the verifier performs. In the discrete-log example, the exponent is small once security parameters are fixed. A program’s execution record grows with the computation. Checking the whole record may establish correctness, but does it achieve the goal of delegating computation to reduce verification work?

For that goal, we require **succinctness**: proof size and verification time should be small relative to the original computation or witness. Costs such as reading public inputs remain. General zero-knowledge proofs need not be succinct; distinguish succinctness as a design goal of the SNARKs and STARKs studied here. Session 10 introduces PCPs and IOPs as frameworks for pursuing it.

### 4.4 The increasing difficulty of knowledge extraction

Changing the witness representation also changes extraction. In Schnorr, two accepting transcripts with the same first commitment and different challenges yield the exponent. For a general computation, the target is an assignment satisfying circuit constraints. Required transcripts and access depend on the scheme; extraction may use several response stages or knowledge properties of commitments. Do not assume that two transcripts always suffice in the same way.

---

## 5. Organizing the landscape in a two-axis matrix

Separate the questions into **what can be expressed** and **how much interaction and computation is needed**. Before reading the comparison tables, clarify the purposes and limitations of three terms.

### 5.1 Succinctness: reduce the verifier's workload

**Succinctness** asks for a short proof and little verification work relative to a potentially large computation, so that checking the result is cheaper than repeating all of it. This serves Section 4.3's goal of outsourcing computation while reducing the checking burden. Specify what “short” is relative to: computation size, public-input length, and the security parameter play different roles.

However, **a short proof need not be cheap to generate**. Reading public inputs still costs work. Succinctness also does not imply that the witness is hidden or that interaction is unnecessary. Zero-knowledge, non-interactivity, and succinctness are separate properties. Sessions 11–13 compare concrete proof sizes and verification costs.

### 5.2 Sigma protocols: a basic form of interactive knowledge proof

A **Sigma protocol (Σ-protocol)** is a framework for three-message interactive protocols demonstrating knowledge of a witness. Schnorr in Section 4.1 is an example: commitment $t$, then a uniform random challenge $c$, then response $s$.

Three messages alone do not make a Sigma protocol. Here we use the basic definition requiring **completeness**, **special soundness** (extracting a witness from two accepting records with the same commitment and distinct challenges), and **special honest-verifier zero-knowledge** (simulating an honest transcript even for a specified challenge, without a witness). In Schnorr, fix $c$, choose uniform $s$, and compute $t=g^s y^{-c}$ to generate such a record.

The purpose is to design and analyze interactions with these properties through a common framework. The definition alone does not guarantee **zero-knowledge against malicious verifiers** or **succinctness for general computations**. Schnorr's short transcripts exploit the structure of a particular discrete-logarithm relation. Moving to general NP relations requires reassessing representation and communication costs.

### 5.3 Fiat–Shamir: remove the round trip with the verifier

The **Fiat–Shamir transformation** aims to turn a suitable interactive protocol into a **non-interactive** one: the prover generates a proof that a verifier can check later. In the Schnorr example, instead of receiving $c$ from the verifier, the prover derives it by hashing public input $x$, commitment $t$, and context:

$$c=H(\text{protocol identifier},x,t).$$

This is schematic: an implementation must specify input encoding and how hash outputs map to challenges. The prover sends $(t,s)$; the verifier recomputes $c$ from the same inputs and checks the proof. A signature application also includes the signed message in the hash input. See [RFC 8235 §2.3](https://www.rfc-editor.org/rfc/rfc8235.html#section-2.3) for an application to Schnorr.

However, **removing interaction does not compress a long proof**. A protocol that sends large amounts of data does not automatically become succinct for general computation through Fiat–Shamir. Nor can every interactive protocol be transformed safely: security depends on the original construction and how the hash is modeled.

Typical analyses use the **random oracle model (ROM)**, treating the hash as an ideal random function. A proof in that model does not unconditionally guarantee security when a concrete hash function is substituted. The analysis must also account for a prover trying many commitments and hash queries. [Session 9](./session-09.md) develops the transformation and its limitations.

### 5.4 Compare expressiveness and efficiency separately

With these distinctions in place, the landscape can be organized as follows. Interactive versus non-interactive is not the same distinction as succinct versus non-succinct.

<div class="captioned-table" id="table-02-5" role="group" aria-labelledby="table-caption-02-5">

<p class="table-caption" id="table-caption-02-5"><strong>Table 02-5：Relations, interaction and succinctness</strong></p>

| Relation | Interactive examples | Non-interactive examples | Reading succinctness |
| --- | --- | --- | --- |
| Algebraic relations | Schnorr | Fiat–Shamir applied to suitable Sigma protocols | Short transcripts for a particular relation do not mean that Fiat–Shamir compresses proofs |
| General NP relations | Interactive ZK constructions for general NP | Groth16 / PLONK / STARK | Assess proof size and verification cost relative to computation size separately from non-interactivity |

</div>

These constructions do not all follow the same route. For example, Groth16 is constructed non-interactively using a reference string, without applying Fiat–Shamir. Act III examines each construction's route.

<span id="figure-02-3"></span>

<div class="captioned-table" id="table-02-6" role="group" aria-labelledby="table-caption-02-6">

<p class="table-caption" id="table-caption-02-6"><strong>Table 02-6：Separate expressiveness from efficiency</strong></p>

| Question | Algebraic relation: the Schnorr example | General computation |
| --- | --- | --- |
| What is represented? | Knowledge of an exponent satisfying $y=g^w$ | Knowledge of an input and execution satisfying a program's conditions |
| Checking tools | Group relations and Sigma protocols | Arithmetization and polynomial constraints, among other tools |
| Purpose of non-interactivity | Remove the verifier round trip and allow later verification | The same purpose, with a construction-dependent route |
| Purpose of succinctness | Limit communication and verification group operations for the relation | Keep proof size and verification work small relative to a large computation |
| What must be checked separately? | The relation, verifier model, and security after transformation | Prover cost, public-input processing, setup, and security assumptions |

</div>

Increasing expressiveness and improving proof efficiency are separate design tasks. Rather than treating succinctness, non-interactivity, and zero-knowledge as a single notion of performance, distinguish the guarantees and remaining costs. This provides a guide to the tools and protocols in Acts II and III.

---

## Recap and next session

Today we separated hiding information, knowing a witness, and expressing general computation. Check whether you can explain the following points in your own words.

- The formal definition of zero-knowledge through the simulator paradigm and the three levels of indistinguishability: perfect, statistical, and computational.
- Knowledge soundness and extractors as an operational definition of a prover really knowing a witness.
- The qualitative difference between simple algebraic witnesses and witnesses for general computation: moving from proofs based on existing structure to translation through arithmetization.
- The two-axis matrix of expressiveness and efficiency as a way to locate the protocols we will study.

This completes Act I, purpose and motivation. In Session 3, we begin Act II by developing the algebraic tools of finite fields and polynomial rings. Through the Schwartz–Zippel lemma, an important result in complexity theory, we will examine why polynomial representations provide a structure that supports efficient probabilistic verification.

---

## References and further reading

- Goldwasser, Micali, Rackoff, “[The Knowledge Complexity of Interactive Proof Systems](https://epubs.siam.org/doi/10.1137/0218012),” 1989. — SIAM, 1989 version
- Schnorr, “[Efficient Signature Generation by Smart Cards](https://link.springer.com/article/10.1007/BF00196725),” *Journal of Cryptology*, 1991. — Springer publication page / [Public manuscript PDF (German National Library)](https://d-nb.info/1156214580/34)
- Goldreich, *[Foundations of Cryptography, Volume 1](https://www.wisdom.weizmann.ac.il/~oded/foc-vol1.html)*, Chapter 4 (a textbook treatment of the definition of zero-knowledge). — author’s book information, contents, and errata
- Cook, “[The Complexity of Theorem-Proving Procedures](https://www.cs.utoronto.ca/~sacook/homepage/1971.pdf),” STOC 1971 (the Cook–Levin theorem, providing background for arithmetization in subsequent sessions). — author-hosted PDF

## Suggested classroom questions

- When introducing the proposition that a simulator can fabricate an interaction without a witness, first ask students whether this seems contradictory. This highlights the nontrivial nature of the simulator paradigm.
- Write Schnorr's verification equation on the board and ask students to identify where the group structure is used. This makes the discussion in Section 4.1 more concrete.
- Before presenting the two-axis matrix, invite students to suggest why Schnorr's protocol cannot be directly extended to general computation, then compare their predictions with the explanation.

---

## Session 2 exercise

Check the lecture concepts with calculations and concrete examples in the [Session 2 exercise](../exercises/session-02).
