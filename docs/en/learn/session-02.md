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
import GraphIsoExample from "../../.vitepress/theme/GraphIsoExample.vue";
</script>

# Session 2: Zero-knowledge and the generalization of witnesses

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: October 4, 2026

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

Simply withholding the witness does not guarantee that no secret information leaks; the interaction record itself may reveal something. The **simulator paradigm** compares the verifier’s record from a real interaction with a record produced without the witness. If they are indistinguishable, the interaction reveals no additional information about the witness.

#### 2.1.1 Preparing to read the definition: relation $R$, public input $x$, and proposition $x\in L_R$

Before the formal definition, clarify the roles of $x$, $w$, and $R$ with an example. Suppose we want to prove that “91 is composite.” The public input is $x=91$, and the prover can use a divisor such as $w=7$ as private evidence. The verifier checks

$$1<w<x\quad\text{and}\quad w\mid x.$$

The pair $(91,7)$ satisfies these conditions, whereas $(91,8)$ does not. A **relation $R$** records which pairs of public input and witness satisfy a specified condition. Write $(x,w)\in R$ when the pair satisfies it.

<div class="captioned-table" id="table-02-1" role="group" aria-labelledby="table-caption-02-1">

<p class="table-caption" id="table-caption-02-1"><strong>Table 02-1：Notation for public input, witness, relation, and language</strong></p>

| Symbol | Meaning |
| --- | --- |
| $x$ | Public input shared by prover and verifier; data in its own right |
| $w$ | A private candidate witness checked together with $x$ |
| $R$ | The relation specifying which pairs $(x,w)$ are valid |
| $(x,w)\in R$ | $w$ is a valid witness for $x$ |
| $L_R$ | The set of public inputs $x$ for which at least one valid witness exists |

</div>

Mathematically, $R$ is a **binary relation**, the set of pairs satisfying the condition. Encode inputs and witnesses as finite binary strings to write

$$R\subseteq\{0,1\}^*\times\{0,1\}^*.$$

An algorithm can test whether a pair belongs to $R$. Its result may also be written $R(x,w)=1$ when the condition holds and $R(x,w)=0$ otherwise. Here, $(x,w)\in R$ and $R(x,w)=1$ express the same test result: the first uses set membership, while the second emphasizes the output of the test.

From $R$, define the language

$$L=L_R:=\{x\mid \exists w,\ (x,w)\in R\}.$$

It contains exactly those public inputs that have at least one valid witness. The proposition to prove is, precisely, that public input $x$ belongs to this language: $x\in L_R$.

For NP relations used in this course, membership in $R$ is decidable in deterministic polynomial time, and a valid witness has length at most $p(|x|)$ for some polynomial $p$. Then $L_R\in\mathrm{NP}$. For the composite-number example,

$$R_{\mathrm{comp}}=\{(n,d)\mid n,d\text{ are integers},\ 1<d<n,\ d\mid n\}.$$

Both $(91,7)$ and $(91,13)$ belong to $R_{\mathrm{comp}}$, but $(91,8)$ does not. Since 91 has a valid witness, $91\in L_{R_{\mathrm{comp}}}$, so the proposition “91 is composite” is true. No divisor satisfies the condition for the prime 97, so $97\notin L_{R_{\mathrm{comp}}}$.

There is a distinction between “a valid $w$ exists” and “the prover in front of us actually knows that $w$.” The proposition $x\in L_R$ expresses the former. Section 3 formalizes the latter.

In the next definition, $R$ and the language $L_R$ specifying valid pairs are public. The prover uses a $w$ for which $(x,w)\in R$, while the simulator receives the public input $x$ but not $w$. See also [Sets, membership, and languages](./terms/sets-and-languages) and [NP relations in more detail](./terms/np-relations).

### 2.2 A formal definition

Assume that the relation $R$ and the language $L_R$ it defines are public. Consider the interactive proof system $(P,V)$ for relation $R$ and language $L$.

For every verifier algorithm $V^*$, assume there is a simulator $S$ that reproduces, without the witness, the information that verifier obtains in the interaction. The computational models are:

- Verifier $V^*$: probabilistic polynomial time.
- Simulator $S$: polynomial time or expected polynomial time.

Now define the random variables.

**Separate what is fixed from what is sampled.** Fix a valid pair $(x,w)\in R$, verifier algorithm $V^*$, and auxiliary input $z$ available to the verifier before the interaction. If auxiliary input is not considered, let $z$ be the empty string.

The prover's random tape $r_P$ and verifier's random tape $r_V$ are sampled independently according to their respective algorithms. Once the inputs and tapes are fixed, the transcript is determined. Varying the tapes gives the random variable for the verifier's **entire view**:

$$X_{x,w,z}:=\operatorname{View}_{V^*}\bigl[P(x,w;r_P)\leftrightarrow V^*(x,z;r_V)\bigr].$$

The semicolon separates an algorithm's input from the random tape it uses. The verifier's view can, for example, be encoded as

$$X_{x,w,z}=(x,z,r_V,m_1,\ldots,m_k),$$

where $m_1,\ldots,m_k$ are messages received by the verifier. The verifier's own messages and final decision can be reconstructed from this record and its algorithm.

**The comparison is of the entire record the verifier can know.** The prover's random tape $r_P$ and witness $w$ are not themselves included in the view.

The simulator uses its own random tape $r_S$ to output a record in the same format. Treat its output as the random variable

$$Y_{x,z}:=S(x,z;r_S).$$

The simulator receives $x,z$, but not $w$. It may depend on $V^*$, but a separate simulator cannot be chosen for each witness: one $S$ must satisfy the condition for all valid pairs $(x,w)\in R$ and auxiliary inputs $z$.

**A probability distribution gives the probability of each record appearing.** For a particular record $t$, compare

$$\Pr[X_{x,w,z}=t]\quad\text{and}\quad\Pr[Y_{x,z}=t].$$

The first probability is induced by the real interaction's randomness $r_P,r_V$; the second by the simulator's randomness $r_S$. The two record distributions are compared; individual executions need not produce the same record.

Below, omit subscripts and write $X,Y$. Compare the family of distributions as input length $n=|x|$ grows, with auxiliary-input length polynomially bounded in $n$. The notation $\mathrm{negl}(n)$ denotes a nonnegative function that eventually becomes smaller than every inverse polynomial.

- **Perfect zero-knowledge:** for every record $t$, $\Pr[X=t]=\Pr[Y=t]$. The two random variables have identical probability distributions.
- **Statistical zero-knowledge:** the statistical distance between the distributions is negligible. For discrete records, define

$$\Delta(X,Y):=\frac12\sum_t\left|\Pr[X=t]-\Pr[Y=t]\right|\le\mathrm{negl}(n).$$

  This implies that for any set of records $A$, the difference $|\Pr[X\in A]-\Pr[Y\in A]|$ is bounded by the same negligible quantity. Even an unbounded distinguisher cannot detect a significant difference.
- **Computational zero-knowledge:** for every probabilistic polynomial-time distinguisher $D$,

$$\left|\Pr[D(x,z,X)=1]-\Pr[D(x,z,Y)=1]\right|\le\mathrm{negl}(n).$$

  $D$ receives a record generated by one of the two methods, along with the public and auxiliary inputs, and outputs 1 if it thinks the record came from the real interaction. The probabilities include the randomness used to generate the record and $D$'s own randomness. The probability distributions themselves need not be close; the condition is that the difference available to an efficient distinguisher is negligible. The bound must hold for every such $D$, every valid input and witness, and every admissible auxiliary input.

An **honest verifier** follows the protocol's prescribed steps. For example, it samples a challenge from the specified distribution and decides accept or reject using the specified verification equation. It may still record and analyze the messages and its own randomness. If its view can be simulated without the witness, this property is called **honest-verifier zero-knowledge (HVZK)**. Distinguish it from zero-knowledge against verifiers that deviate from the protocol, for example by changing how they choose challenges.

### 2.3 Example: checking the formal definition

**Comparing probability distributions**

The following hypothetical two-bit records illustrate probability distributions; they are not themselves a zero-knowledge protocol.

<div class="captioned-table" id="table-02-2" role="group" aria-labelledby="table-caption-02-2">

<p class="table-caption" id="table-caption-02-2"><strong>Table 02-2：Two probability distributions over two-bit records</strong></p>

| Record $t$ | Probability under real record $X$ | Probability under hypothetical simulator record $Y$ |
| --- | --- | --- |
| $00$ | $1/4$ | $1/2$ |
| $01$ | $1/4$ | $0$ |
| $10$ | $1/4$ | $0$ |
| $11$ | $1/4$ | $1/2$ |

</div>

Under both random variables, each bit considered individually is equally likely to be 0 or 1. But a distinguisher that outputs 1 when the two bits agree has $\Pr[D(X)=1]=1/2$ and $\Pr[D(Y)=1]=1$, a difference of $1/2$. Even when each bit has the same marginal distribution, the **joint distribution of the whole record** differs. If this gap remains as the input grows, computational indistinguishability fails. This is why zero-knowledge compares the entire view.

The indistinguishability condition concerns the distributions of the random variable $X$, representing the real verifier view, and $Y$, representing the simulator output, for the same fixed public input. Restricting a dishonest prover's power for soundness and restricting a distinguisher's power for zero-knowledge are separate axes. Being an argument does not imply computational zero-knowledge; for example, the original Groth16 paper proves perfect zero-knowledge.

**Graph-isomorphism example**

Let the public graphs be $G_0,G_1$, and let the secret isomorphism be $\pi:G_0\to G_1$. The prover chooses a random permutation of vertices $\rho$, forms $H=\rho(G_0)$, and sends $H$ first. The verifier then samples a uniformly random bit $b$ and asks for an isomorphism $G_b\to H$. If $b=0$, the prover can return $\rho$; if $b=1$, it can return $\rho\circ\pi^{-1}$. If both challenges can be answered for the same $H$, composing the two maps yields an isomorphism $G_0\to G_1$.

**Follow one round in message order.** (1) The prover randomly relabels the vertices, forms $H$, and sends its edge list. (2) Only after receiving $H$, the verifier flips a fair coin to choose $b=0$ or $b=1$ and asks for a map from $G_b$ to $H$. (3) The prover returns a vertex map $f$. (4) The verifier checks that every vertex is used exactly once and that adjacency is preserved for every vertex pair. It rejects the round if either check fails. The order matters: after sending $H$, the prover does not know which graph the verifier will select, so it cannot prepare its response after seeing the challenge.

**The verifier checks whether the returned map is actually an isomorphism.** The verifier sees the public graphs $G_0,G_1$, the committed graph $H$, the challenge $b$, and the prover's response $f:G_b\to H$. First, it checks that $f$ maps every vertex exactly once, so it is a bijection. Then, treating these as undirected simple graphs, it checks every vertex pair $u,v$:

$$uv\in E(G_b)\quad\Longleftrightarrow\quad f(u)f(v)\in E(H).$$

This must preserve non-edges as well as edges. In the figure's example, for $b=0$ let $\rho(a)=2,\rho(b)=5,\rho(c)=1,\rho(d)=4,\rho(e)=3$. The prover returns that vertex map. The verifier checks, for example, that edges $a-b$ and $a-c$ in $G_0$ map to edges $2-5$ and $2-1$ in $H$, and that the non-edge $a-d$ maps to the non-edge $2-4$. In this five-vertex example, it checks all ten vertex pairs. The verifier does not need $\pi$ for this one challenge; it only checks the mapping from the graph selected by $b$.

For this example, the verifier checks all ten pairs as follows. “Edge” means both graphs contain the corresponding edge; “non-edge” means neither graph does. If even one pair disagrees, the response is not an isomorphism and the verifier rejects.

<div class="captioned-table" id="table-02-3" role="group" aria-labelledby="table-caption-02-3">

<p class="table-caption" id="table-caption-02-3"><strong>Table 02-3: Checking adjacency for every vertex pair</strong></p>

| Pair in $G_0$ | Corresponding pair in $H$ | Check |
| --- | --- | --- |
| $a-b$ | $2-5$ | Edge |
| $a-c$ | $2-1$ | Edge |
| $a-d$ | $2-4$ | Non-edge |
| $a-e$ | $2-3$ | Edge |
| $b-c$ | $5-1$ | Edge |
| $b-d$ | $5-4$ | Non-edge |
| $b-e$ | $5-3$ | Non-edge |
| $c-d$ | $1-4$ | Edge |
| $c-e$ | $1-3$ | Non-edge |
| $d-e$ | $4-3$ | Edge |

</div>

Passing one round shows only that the selected graph is isomorphic to $H$. The protocol repeats the same procedure with a fresh random $H$ and accepts only if every round passes. If $G_0$ and $G_1$ are not isomorphic, no $H$ can be isomorphic to both. The prover can therefore answer correctly for at most one of the two possible challenges, so its chance of being accepted by mistake in one round is at most $1/2$. With $k$ independent challenges, the probability of passing all rounds is at most $2^{-k}$. If the graphs are isomorphic, the honest prover uses secret $\pi$ to answer either challenge and passes every round.

**A simulator for an honest verifier can generate the record without knowing witness $\pi$.** In the real interaction, the prover samples a uniform random vertex permutation $\rho$ and sends $H=\rho(G_0)$ first. The verifier then independently samples a uniform bit $b$. The simulator reverses the sampling order: it first samples a uniform $b$, then a uniform random relabeling $\varphi_b$, and records $H=\varphi_b(G_b)$ together with the response $\varphi_b$.

This record has the same probability distribution as a real interaction because $G_0$ and $G_1$ are isomorphic. Relabeling either graph uniformly selects from the same set of labeled graphs with the same probabilities. Moreover, for a fixed $H$ and $b$, the response mapping is selected with the same probability as the real prover's mapping. Thus the entire verifier record has exactly the same distribution. This explains simulation for an honest verifier only; zero-knowledge against a verifier that changes the challenge procedure requires a separate argument, such as one involving rewinding. Distinguish generating a record without the witness from responding to an arbitrary verifier in a live interaction.

<GraphIsoExample :en="true" />

### 2.4 Checking the intuition

The next explanation previews the **Schnorr identification protocol**, developed in Section 4.1. It demonstrates knowledge of a secret exponent corresponding to a public value without handing over that exponent. It has three stages: the prover sends an initial message (commitment), the verifier sends a random challenge, and the prover responds. An honest verifier in this Schnorr-type protocol samples its challenge uniformly from the specified set after receiving the commitment, then checks the response using the prescribed equation.

<SchnorrOverview :en="true" />

<div class="captioned-table" id="table-02-4" role="group" aria-labelledby="table-caption-02-4">

<p class="table-caption" id="table-caption-02-4"><strong>Table 02-4：Message generation in the real interaction and simulation</strong></p>

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

**Soundness** asks whether a prover can make a false proposition be accepted. Authentication asks an additional question: is the prover responding now the one who knows the secret? It is not enough that the proposition is true or that someone, somewhere, knows a secret. **Knowledge soundness** addresses this distinction.

Consider the graph-isomorphism example. The witness for the public statement that $G_0$ and $G_1$ are isomorphic is an isomorphism $\pi:G_0\to G_1$. Suppose the prover correctly answers both challenges, $b=0$ and $b=1$, for the same committed graph $H$. Write the two responses as $f_0:G_0\to H$ and $f_1:G_1\to H$. Then we can compute

$$\pi'=f_1^{-1}\circ f_0:G_0\to G_1.$$

This is a valid isomorphism, so the extractor has obtained a witness. It did not look inside the prover's memory; it built a valid witness from the prover's responses.

The composition is an isomorphism because $f_0$ maps $G_0$ to $H$, and $f_1^{-1}$ maps $H$ to $G_1$. Both preserve adjacency, so their composition does too.

Conversely, if $G_0$ and $G_1$ are not isomorphic, no single $H$ can be isomorphic to both. For a fixed $H$, the prover can answer at most one of the two challenges. With one random-bit challenge, the chance of accidental acceptance is at most $1/2$. This is the soundness idea from the previous section.

### 3.2 The concept of an extractor

An **extractor $E$** is a hypothetical algorithm used in a security proof. In this graph example, it rewinds the prover to the point where it sent the same commitment $H$, issues the other challenge, and obtains both responses. It then constructs a witness using the equation above. This method of invoking a prover and examining its responses is called **black-box extraction**.

The extractor is not a third participant in the ordinary interaction, and it cannot read the prover's private memory. Whether rewinding is allowed depends on the proof system and security definition. In this example, **knowledge soundness** requires that if a prover convinces the verifier more often than the “guess at random” baseline, an extractor can obtain a valid witness.

The key idea is to define “knowing the secret” operationally: can a valid witness be constructed from the prover's responses? The extractor does not have to recover the exact secret originally held inside the prover.

Keep this separate from the simulator in Section 2. A simulator produces the **verifier's record** without a witness. An extractor invokes the prover and constructs a **valid witness** from its responses. They have different goals and outputs.

The formal treatment using random variables and knowledge error is available in the expandable note below.

::: details Formal note: random variables, knowledge error, and the Schnorr example

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

<div class="captioned-table" id="table-02-5" role="group" aria-labelledby="table-caption-02-5">

<p class="table-caption" id="table-caption-02-5"><strong>Table 02-5：Random variables and outputs in interaction and extraction</strong></p>

| Aspect | Real interaction | Extraction experiment |
| --- | --- | --- |
| Algorithms | $P^*$ and $V$ | $E$ invoking $P^*$ |
| Random variables | Decision $A_x\in\{0,1\}$ | Output $W_{x,T}$ and success indicator $B_{x,T}$ |
| Probability | Acceptance $p_{P^*}(x)$ | Extraction success $e_{P^*}(x,T)$ |
| Result | Accept or reject | Valid witness or $\bot$ |

</div>

These are separate experiments: do not assume $p_{P^*}(x)=e_{P^*}(x,T)$. Nor is $e_{P^*}(x,T)$ the probability of learning a secret by eavesdropping on one accepting transcript. Knowledge soundness connects **the ability to cause acceptance with extraction under specified access and computational resources**.

Fix public input x and prover strategy P\*, including its private information.<br>Do not assume that P\* starts with a witness.

<div class="captioned-table" id="table-02-6" role="group" aria-labelledby="table-caption-02-6">

<p class="table-caption" id="table-caption-02-6"><strong>Table 02-6：Acceptance and extraction: different experiments and random variables</strong></p>

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

:::

---

## 4. Generalizing witnesses: from algebraic relations to general computation

Section 3 treated “knowing a witness” operationally: can an extractor obtain a valid witness from the prover's responses? This section asks what changes when the witness grows from a simple value to an entire computation.

### 4.1 In Schnorr, the group structure helps verification {#schnorr-witness-extraction}

In the Schnorr identification protocol, the public value $y$ and secret exponent $w$ satisfy

$$y=g^w.$$

The exponent $w$ satisfying this equation is the witness for the public value $y$. The relation being checked is summarized below.

<div class="captioned-table" id="table-02-7" role="group" aria-labelledby="table-caption-02-7">

<p class="table-caption" id="table-caption-02-7"><strong>Table 02-7：Schnorr public input, witness and relation</strong></p>

| Symbol | Meaning | Who has it? |
| --- | --- | --- |
| $x=(G,q,g,y)$ | Public input containing the group parameters and public value $y$ | Prover and verifier |
| $w\in\mathbb{Z}_q$ | Secret exponent satisfying $y=g^w$ (the witness) | Honest prover |
| $R_{\mathrm{DL}}$ | Relation that checks whether $(x,w)$ satisfies $y=g^w$ | Public definition |

</div>

The protocol proceeds as follows:

1. The prover chooses fresh randomness $r$ and sends $t=g^r$.
2. The verifier sends a random challenge $c$.
3. The prover responds with $s=r+cw\pmod q$.
4. The verifier checks $g^s=t\,y^c$.

An honest prover is accepted because

$$g^s=g^{r+cw}=g^r(g^w)^c=t\,y^c.$$

The verifier checks this equation without receiving $w$. This is **completeness**.

Why can a witness be extracted from this check? Suppose responses $s_1,s_2$ to two different challenges $c_1,c_2$ are both accepted for the same first message $t$. Canceling $t$ in the two verification equations gives

$$g^{s_1-s_2}=y^{c_1-c_2}.$$

Then compute

$$w'=(s_1-s_2)(c_1-c_2)^{-1}\pmod q$$

to obtain a witness satisfying $g^{w'}=y$. The algebraic relation between group operations and exponents makes this possible. This property is called **special soundness**.

This is not an instruction for an ordinary verifier to send two challenges. It describes a security proof in which an extractor rewinds the prover to obtain another response from the same $t$.

::: details Group arithmetic and a small numerical example
Exponent arithmetic is modulo $q$, while multiplication of group elements in this example is modulo $p$. For example, with $p=23,\ q=11,\ g=2$, the group $G=\langle2\rangle\subset\mathbb{F}_{23}^{*}$ has order 11. If $w=3$, then $y=2^3\bmod23=8$.

For $r=4$ and $c=2$, the commitment is $t=2^4\bmod23=16$, and the response is $s=4+2\cdot3=10\pmod{11}$. The verifier computes

$$2^{10}\bmod23=12,\qquad 16\cdot8^2\bmod23=12,$$

so the two sides agree. This tiny group is exhaustively searchable and is unsuitable for cryptography; the values are only for illustration.

If a second accepted response $s_2=8$ to challenge $c_2=5$ is obtained for the same $t=16$, combine it with $c_1=2,s_1=10$ to compute $w'=3$. The extracted witness need not equal the prover's original internal value; it is valid as long as it satisfies $y=g^{w'}$.

<div class="captioned-table" id="table-02-8" role="group" aria-labelledby="table-caption-02-8">

<p class="table-caption" id="table-caption-02-8"><strong>Table 02-8：Schnorr numerical example and extraction</strong></p>

| Stage | Example or check |
| --- | --- |
| Public input and witness | $p=23,\ q=11,\ g=2,\ y=8,\ w=3$. Relation: $y=g^w$. |
| First interaction | $r=4,\ t=16,\ c_1=2,\ s_1=10$. Both sides equal $12\pmod{23}$. |
| Second response | For the same $t=16$, $c_2=5,\ s_2=8$. |
| Extraction | $w'=(10-8)(2-5)^{-1}=3\pmod{11}$, hence $g^{w'}=y$. |

</div>

:::

### 4.2 For a general computation, we must build a checkable representation {#general-computation-arithmetization}

In Schnorr, the witness is an exponent $w$, and the group relation $y=g^w$ supports both verification and extraction. For a general program, the claim may be that a given input produces a specified output. The witness may include an input or intermediate computation values, and Schnorr's equation does not automatically apply.

Instead, we translate the program into a collection of constraints that can be checked. Representing a computation with circuits and polynomial constraints is called **arithmetization**. Session 4 introduces R1CS, QAP, and AIR as concrete methods. Arithmetization is not itself a proof; it prepares the claimed computation in a form a proof system can handle.

The key change is that a general computation does not automatically come with Schnorr's convenient verification equation. We must translate the computation into another representation.

### 4.3 Large computations also make verification cost matter {#succinctness-motivation}

If the verifier must check every step from scratch after the prover performs the computation, outsourcing saves little. SNARKs and STARKs therefore also aim for **succinctness**: short proofs and low verification costs relative to the original computation.

Zero-knowledge and succinctness are separate properties. A system may hide the witness yet have a large proof or verification cost; a short proof does not by itself hide the witness. Consider separately what can be represented and the cost of proving and verifying it.

### 4.4 Extraction must also be designed for each proof system {#general-knowledge-extraction}

Schnorr extracts an exponent from two accepted responses to the same commitment. For a general computation, the target is an input or execution record satisfying the constraints, and the useful interaction depends on the proof system. It is therefore unsafe to assume that two responses always suffice. As Section 3 explained, knowledge soundness includes what access the extractor is allowed and how efficiently it can obtain a valid witness.

The next section organizes these questions along two axes: expressiveness and efficiency.


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

<div class="captioned-table" id="table-02-9" role="group" aria-labelledby="table-caption-02-9">

<p class="table-caption" id="table-caption-02-9"><strong>Table 02-9：Relations, interaction and succinctness</strong></p>

| Relation | Interactive examples | Non-interactive examples | Reading succinctness |
| --- | --- | --- | --- |
| Algebraic relations | Schnorr | Fiat–Shamir applied to suitable Sigma protocols | Short transcripts for a particular relation do not mean that Fiat–Shamir compresses proofs |
| General NP relations | Interactive ZK constructions for general NP | Groth16 / PLONK / STARK | Assess proof size and verification cost relative to computation size separately from non-interactivity |

</div>

These constructions do not all follow the same route. For example, Groth16 is constructed non-interactively using a reference string, without applying Fiat–Shamir. Act III examines each construction's route.

<div class="captioned-table" id="table-02-10" role="group" aria-labelledby="table-caption-02-10">

<p class="table-caption" id="table-caption-02-10"><strong>Table 02-10：Separate expressiveness from efficiency</strong></p>

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
