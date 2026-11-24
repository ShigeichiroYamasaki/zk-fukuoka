---
outline: [2, 3]
prev:
  text: Session index
  link: /en/learn/sessions
next:
  text: Session 2 · Zero-knowledge and the generalization of witnesses
  link: /en/learn/session-02
---

<script setup>

import LectureDiagram from "../../.vitepress/theme/LectureDiagram.vue";
</script>

# Session 1: What is a proof? — Background and formalization of interactive proofs — Illustrated edition

[Open the maintained Session 1 page](./session-01). The diagrams are now included in the main lecture.


**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 24, 2026<br>
Last updated: November 24, 2026

[Session index](./sessions) · [Topic index](./topics) · [Session 1 in the syllabus](./#session-1)

## Context and learning objectives

Over 15 sessions, this course explores zk-SNARKs and zk-STARKs. The first question is what we want these technologies to achieve. Before assembling the mathematics needed to understand their mechanisms, let us establish why those mechanisms are needed. Today's three objectives are:

1. Make explicit the implicit assumptions behind the classical concept of a proof—the NP verifier paradigm—and question them.
2. Understand how removing those assumptions leads to interactive proofs, independently motivated by two different contexts: complexity theory and cryptography.
3. Take the first steps toward a mathematical definition of interactive proofs: completeness, soundness, and the distinction between proofs and arguments.

We define zero-knowledge in the next session. Before that, we reconsider checking correctness as a computational procedure. In particular, what changes if the verifier can ask the prover questions?

---

## 1. The classical proof paradigm and its limitations

### 1.1 The NP verifier paradigm

First, consider how to check whether a statement is true. Even when checking the statement directly is difficult, information supporting it may allow us to check it efficiently. We call this information a witness.

For example, consider the statement **“91 is composite.”** A composite number is an integer greater than one with a positive divisor other than one and itself. If someone supplies the number 7, the verifier can check $1<7<91$ and $91=7\times13$. Here the input being checked is 91, and the witness is 7.

<div class="captioned-table" id="table-01-1" role="group" aria-labelledby="table-caption-01-1">

<p class="table-caption" id="table-caption-01-1"><strong>Table 01-1：Statement, witness and verifier roles for the composite number 91</strong></p>

| Role | In this example |
| --- | --- |
| Statement | 91 is composite |
| Public input | 91 |
| Witness | The nontrivial divisor 7 |
| Verification | Check that 7 is an integer strictly between 1 and 91 and divides 91 exactly |

</div>

Supplying 8 fails because it does not divide 91. Supplying 1 also fails: it divides 91 but does not satisfy $1<w<91$. The number 13, however, is another valid witness. **A witness is concrete information used to check a statement, not the statement itself, and it need not be unique.** This example illustrates the role of a witness: handing over 7 does not conceal that value. However, zero-knowledge does not require hiding information easily computed from the public input, as in this small example. We define zero-knowledge next time.

#### 1.1.1 Languages in computation theory

Before reading the formula, review **sets, elements, membership, and languages $L$ in complexity theory**. A finite set of symbols is an alphabet $\Sigma$, and $\Sigma^*$ is the set of all finite strings over it. **A language is a set of strings $L\subseteq\Sigma^*$.** The language itself is a set, distinct from an algorithm deciding membership in it.

The set of syntactically well-formed expressions is one example of a language. However, languages are not limited to syntax: the encodings of composite numbers or of satisfiable logical formulas also form languages. **Being well-formed and satisfying the condition expressed by a formula are different properties.** Our choice of what to include in $L$ specifies the decision problem.

See [Sets, membership and languages: reading $x\in L$](./terms/sets-and-languages) for examples and a step-by-step reading of the symbols.

#### 1.1.2 Truth of a statement and acceptance by an NP verifier

A decision problem is represented by the language $L$ of encodings of its Yes instances. Read $x\in L$ as “input $x$ belongs to that set of Yes instances.” For example, if $L$ contains the encodings of composite numbers, the encoding of 91 belongs to $L$, whereas that of the prime 97 does not. Both are well-formed integers, so this problem is not simply a syntax check.

When this course uses “statement $x$ is true” as shorthand, it means, more precisely, **the statement “$x\in L$” about input $x$ is true**. By contrast, $L\in\mathrm{NP}$ says that language $L$ belongs to the complexity class NP defined below. Distinguish membership of an individual input from classification of a decision problem.

An NP verifier is an algorithm that takes an input $x$ and a witness $w$ and accepts or rejects. It is not an automatic method for deciding the truth of arbitrary propositions. For a specified language $L$, it connects Yes instances with the existence of accepted witnesses.

#### 1.1.3 Definition of the NP verifier paradigm

A language $L\subseteq\Sigma^*$ belongs to $\mathrm{NP}$ if there exist a **deterministic polynomial-time** verification algorithm $V$ and a polynomial $p$ such that, for every input $x$,

$$x \in L \iff \exists w\in\Sigma^*,\ |w| \le p(|x|),\ V(x, w) = 1$$

Here $x$ is the problem input, $w$ is a witness, and $V(x,w)=1$ means acceptance. The quantities $|x|$ and $|w|$ are lengths of encoded strings, not the numerical values of integers. The running time of $V$ is polynomial in its total input length; together with the witness bound $p(|x|)$, this makes verification polynomial in $|x|$.

Do not read **NP as the class of only “hard problems.”** Problems in P are also in NP: if a problem can be decided in polynomial time, that decision procedure can serve as an NP verifier without needing a witness. The name NP comes from “nondeterministic polynomial time”; it does not mean “not solvable in polynomial time.” For an NP problem, a witness for a Yes instance can be checked efficiently, even though finding such a witness may be difficult. NP-complete problems are the hardest problems in NP. Since whether P equals NP remains open, some hard problems may be in NP, but it is not accurate to call every problem in NP hard.

Cryptography nevertheless builds systems on **specific computational hardness assumptions**. For example, it assumes that factoring or solving the discrete logarithm problem at suitable input sizes is infeasible with realistic resources. In factoring, it is easy to check that candidate factors multiply to the given number, while finding the factors is believed to be hard. This is not a theorem about all of NP; it is an assumption about a particular problem, how its inputs are selected, and the attacker’s computational model. Whether $\mathrm{P}\ne\mathrm{NP}$ remains open, and even if proved, that alone would not establish the average-case hardness of the particular problems cryptography needs. Conversely, if $\mathrm{P}=\mathrm{NP}$, cryptography based on one-wayness—the property that a function is easy to compute but hard to invert—would lose its security foundation. The proved relations among complexity classes and the hardness assumptions made by cryptographic schemes are connected, but distinct.

Read the equivalence in both directions. If the statement “$x\in L$” is true, an accepted witness exists. Taking the contrapositive of the reverse implication, if the statement is false, no witness meeting the length bound is accepted.

Using this definition directly as a proving procedure means giving the witness to the verifier for inspection. Notice the choice this procedure makes about how information is communicated.

**Let us identify two assumptions in this way of verifying:**

- **Assumption A (full disclosure):** The prover reveals the entire witness $w$ to the verifier.
- **Assumption B (non-interaction and one-way communication):** Verification is completed in a single reading, with no questions from the verifier to the prover.

Here, “a single reading” means inspecting a received witness without sending questions back. The definition of NP neither requires every bit to be read nor limits the verifier to one pass.

Giving the witness allows verification, but is giving it necessary? Is there a reason the verifier should not ask questions? Separating the goal of checking correctness from the chosen method lets us question these two assumptions.

<LectureDiagram kind="witness" :en="true" />

### 1.2 Asking the questions

- Questioning Assumption A: “Can we convince someone that $x \in L$ without revealing the entire witness?” This foreshadows **zero-knowledge**, which we discuss next time.
- Questioning Assumption B: “If the verifier and prover exchange messages repeatedly rather than relying on a single reading, does the power of proofs—the class of languages that can be verified—change?” This is today's topic.

One question concerns what information to give the verifier. The other concerns which exchanges to allow. They are different questions, but interactive proof systems provide a common framework for addressing them. We first examine the motivations for interaction from the perspectives of complexity theory and cryptography.

---

## 2. Motivation for interactive proofs (1): Complexity theory

### 2.1 Arthur–Merlin games

In 1985, Babai proposed interactive games in which the verifier uses randomness. The prover, Merlin, has no computational restriction; the verifier, Arthur, has limited computational resources.

Merlin's power does not make its answers trustworthy. Arthur must check Merlin's statements within its own computational budget. Randomness and interaction provide tools for doing so.

The key feature of interaction is not the number of transmissions. The verifier asks random questions, the prover responds, and the verifier checks those responses.

Does allowing such exchanges change which statements can be verified? When comparing Arthur–Merlin public-coin models with general IP, conditions such as the number of rounds must be distinguished. The next result concerns IP with polynomially many rounds.

<LectureDiagram kind="interaction" :en="true" />

### 2.2 IP = PSPACE

The question is how far the verifier paradigm can reach if we replace receiving a witness once with interaction with a prover. Cryptography uses assumptions that particular computational problems are hard; interactive proof theory asks whether a verifier can delegate computation to a powerful party and still check correctness without trusting it. The relationship between IP and PSPACE answers this question in a striking way. Building on work by Lund, Fortnow, Karloff, and Nisan, Shamir established the following result. We refer here to the 1992 paper.

To place the theorem in context, let us define the complexity classes and completeness terms. In plain terms, a **polynomial-time reduction using one transformed instance** (a many-one reduction) takes an input $x$ to problem $A$ and, in polynomial time, turns it into one input $f(x)$ to problem $B$. It preserves the answer: $x$ is a yes-instance of $A$ exactly when $f(x)$ is a yes-instance of $B$ ($x\in A\iff f(x)\in B$). So a solver for that one instance of $B$ also tells us the answer to the original question about $x$. We write $A\leq_p B$. If $A\leq_p B$, an efficient way to solve $B$ would also give an efficient way to solve $A$ through this transformation. Reductions let us compare how difficult problems are to solve.

| Term | Definition |
| --- | --- |
| **P** | Problems decidable by a deterministic algorithm in polynomial time. |
| **NP** | Problems for which a polynomial-length witness for a “yes” instance can be checked in deterministic polynomial time. Equivalently, problems decidable in nondeterministic polynomial time. |
| **NP-hard** | A problem $H$ to which every problem $A$ in NP reduces in polynomial time: $A\leq_p H$ for every $A\in\mathrm{NP}$. $H$ need not itself be in NP. |
| **NP-complete** | A problem in NP that is also NP-hard; it is among the hardest problems in NP under polynomial-time reductions. |
| **PSPACE** | Problems decidable by a deterministic algorithm using an amount of workspace polynomial in the input length. |
| **PSPACE-complete** | A problem in PSPACE to which every problem in PSPACE reduces in polynomial time. |

These classes satisfy $\mathrm{P}\subseteq\mathrm{NP}\subseteq\mathrm{PSPACE}$. Whether either inclusion is strict—that is, whether $\mathrm{P}\ne\mathrm{NP}$ or $\mathrm{NP}\ne\mathrm{PSPACE}$—is open. NP-complete problems lie in NP, whereas an NP-hard problem may lie outside NP. A PSPACE-complete problem lies in PSPACE and represents the difficulty of the entire class, which includes NP.

This also gives us the idea of an **NP-intermediate problem**: a problem in NP that is outside P and is not NP-complete. The existence of such problems depends on the open question $\mathrm{P}\ne\mathrm{NP}$. Ladner’s theorem constructs an NP-intermediate problem if $\mathrm{P}\ne\mathrm{NP}$. However, no naturally arising concrete problem has been proved to be both outside P and not NP-complete. Graph Isomorphism is often discussed as a candidate, but it has not been established to be NP-intermediate. See [Ladner’s original paper](https://doi.org/10.1145/321864.321877).

This classification does not, by itself, guarantee cryptographic security or resistance to quantum computers. Cryptographic security assumptions separately claim that attackers cannot solve a particular computational problem within realistic resources. Factoring and the discrete logarithm problem, for example, have been considered hard for conventional computers and used in cryptography; Shor’s quantum algorithm solves them in polynomial time on a sufficiently capable quantum computer ([Shor, 1997](https://doi.org/10.1137/S0097539795293172)). Post-quantum standards include lattice-based key-encapsulation and signature schemes, and hash-based signature schemes ([NIST PQC standards](https://csrc.nist.gov/projects/post-quantum-cryptography)). Their security depends on the evidence and analysis for each assumption against both classical and quantum attacks—not on whether a problem is NP-intermediate. The absence of a known efficient attack is not a proof of security.

$$\mathrm{IP} = \mathrm{PSPACE}$$

<LectureDiagram kind="ipPspace" :en="true" />

IP is the class of languages decidable through interactive proofs with a probabilistic polynomial-time verifier. PSPACE is the class decidable using polynomial workspace. NP $\subseteq$ PSPACE holds, but NP and PSPACE have not been proved distinct. Keep that open question separate from the theorem IP = PSPACE.

The surprising point is that an interactive proof lets a polynomial-time verifier handle the entire class PSPACE. For example, deciding whether a fully quantified Boolean formula is true is PSPACE-complete; checking every assignment in the straightforward way may take exponential time. Yet interaction with a prover of unlimited computational power lets the verifier ask random questions and check the answers so that a false claim is rejected with high probability. The prover may be powerful, but the verifier need not trust it.

**The distinction to notice is between solving a problem yourself and checking correctness with another party's help.** A verifier running in polynomial time can, through interaction, handle all of PSPACE. The point is not to trust the powerful party, but to construct a procedure unlikely to accept even when that party makes a false statement.

*(We discuss sumcheck, a technique used in the proof, in [Session 15](./session-15#_3-1-revisiting-the-sumcheck-protocol), after assembling the polynomial tools in Act II. Today, rather than following the proof, we establish what this result makes possible.)*

### 2.3 Summary of this motivation

From the perspective of complexity theory, the central question is how much a computationally limited verifier can check through interaction. Verification must work without trusting the prover, but this question alone does not require keeping a secret from the verifier. We next turn to cryptography, where the information communicated becomes an issue in its own right.

---

## 3. Motivation for interactive proofs (2): Cryptography

### 3.1 The Goldwasser–Micali–Rackoff problem setting (1985)

Also in 1985, Goldwasser, Micali, and Rackoff studied what knowledge is conveyed through a proof. The concern is not only which statements can be verified, but how much information must be given to another party for verification. With authentication applications in mind, we can pose the question as follows:

> How can you convince someone that you know a secret without revealing it?

This question requires considering **the possibility that either the prover or the verifier departs from the intended procedure**.

- The prover may be dishonest: they might pretend to know a secret they do not actually know.
- The verifier may be curious: they might try to extract secret information from the proof process.

<LectureDiagram kind="gmr" :en="true" />

Interactive proofs in complexity theory already required protection against dishonest provers. Cryptography additionally considers whether a verifier might learn extra information from the exchange.

“Being able to check that a statement is true” and “not needing to disclose a secret to do so” are different properties. “The statement is true” and “the prover knows its witness” must also be distinguished. Defining these separately, rather than treating them as one notion, is a task for the coming sessions.

### 3.2 Building intuition with examples

**Example 1: Password authentication.** What we want to check is that the other party knows a password. Receiving the password may enable that check, but it also gives the secret to the party performing the check. If sending the same cryptographic hash-function output suffices for authentication, someone who obtains that value may be able to reuse it. Can we check knowledge without sending either the secret or a fixed value that substitutes for it? Here we examine the motivation; the requirements for an actual authentication scheme need separate consideration.

**Example 2: Graph isomorphism.** Suppose there are two graphs $G_1, G_2$, and the prover knows an isomorphism $\pi$. Given this mapping, the verifier could inspect the correspondence between vertices and edges to check isomorphism. But if the statement to be checked is $G_1 \cong G_2$, is handing over the mapping itself necessary? We want to consider ways to establish isomorphism through interaction.

In complexity theory, Graph Isomorphism is **in NP**: an isomorphism $\pi$ is a witness, and a verifier can check in polynomial time that it is a bijection preserving both adjacency and non-adjacency. However, membership in NP is not the same as being NP-complete. **Whether Graph Isomorphism is NP-complete remains open**, as does whether it has a polynomial-time algorithm. Babai gave a quasipolynomial-time algorithm, which is not a polynomial-time algorithm. Keep the [unsettled NP-completeness and running-time status](https://arxiv.org/abs/1512.03547) distinct. In this course, Graph Isomorphism is useful because it has a checkable witness $\pi$, while still raising the question of whether one can convince someone without handing over that mapping.

*(We study the concrete procedure for graph isomorphism next time, together with the definition of zero-knowledge. Today, use it to distinguish giving someone a witness from having them check a statement.)*

<LectureDiagram kind="graphs" :en="true" />

### 3.3 Summary of this motivation

From the cryptographic perspective, we want both to check a statement and to control what the other party learns in the process. This also requires a framework for describing exchanges between a prover and a verifier mathematically. Interactive proofs supply that framework, but interaction alone does not protect a secret.

---

## 4. The convergence of the two motivations

We have now examined two motivations for interactive proofs. The 1985 work of Babai and GMR addresses exchanges between provers and verifiers from different starting questions. Placing their goals side by side makes the distinction clearer.

- Complexity theory: “How far can interaction increase verification power?”
- Cryptography: “How can we prove something without revealing a secret?”

In both settings, the verifier receives messages from the prover, asks questions as needed, and finally decides whether to accept or reject. We define this shared procedure as an **interactive proof system**.

First, we specify conditions for accepting true statements and rejecting false ones. Then we add the requirement of not giving the verifier extra information. This order helps us keep track of why each definition is needed.

<span id="diagram-motives"></span>

<div class="captioned-table" id="table-01-2" role="group" aria-labelledby="table-caption-01-2">

<p class="table-caption" id="table-caption-01-2"><strong>Table 01-2：Two questions, one framework</strong></p>

| Perspective | Question |
| --- | --- |
| Complexity theory | What can a limited verifier check? |
| Cryptography | What information does checking reveal? |

</div>

The shared framework is an interactive proof system (P, V): exchange messages, then accept or reject.

The descriptive framework is shared. Completeness, soundness and zero-knowledge are defined separately.

---

## 5. A formal definition of interactive proof systems

Let us rewrite the preceding discussion as conditions a procedure must satisfy. Descriptions such as “convincing” or “hard to deceive” are insufficient for comparing schemes or proving security. We need to specify who accepts, under which circumstances, and with what probability.

### 5.1 Completeness and soundness

For a language $L$, consider a pair $(P,V)$ consisting of prover $P$ and verifier $V$. The prover has unrestricted computational power, while the verifier runs in probabilistic polynomial time. We write $\langle P,V\rangle(x)=1$ when the verifier accepts as the outcome of their exchange.

The verifier must run in time polynomial in the input length against any prover, with polynomially bounded communication and number of rounds. The probabilities below are over the random choices of the verifier and, when randomized, the prover.

Here, we state the two conditions in a form where error probabilities are negligible. $\mathrm{negl}(|x|)$ denotes a function that eventually becomes smaller than every inverse polynomial as the input length grows. IP can also be defined starting with constant error probabilities, which appropriate repetition can reduce.

**Completeness:** If the statement is true and the honest prover follows the procedure, the verifier accepts with high probability. For $x \in L$, we require

$$x \in L \implies \Pr[\langle P, V \rangle(x) = 1] \ge 1 - \mathrm{negl}(|x|)$$

**Soundness:** If the statement is false, the probability that the verifier accepts is negligible, however the dishonest prover responds. For $x \notin L$, we require

$$x \notin L \implies \forall P^*,\ \Pr[\langle P^*, V \rangle(x) = 1] \le \mathrm{negl}(|x|)$$

Notice the universal quantification over all provers in the soundness condition. Examining only a party that follows the procedure honestly does not establish soundness. We must also consider a party that uses the preceding exchange to adapt its responses.

The definition of NP already required that no witness be accepted for a false statement. Interactive proofs extend the object of this requirement from a fixed witness to a prover's strategy for responding throughout an exchange.

A verifier that accepts everything could satisfy completeness alone. A verifier that rejects everything could satisfy soundness alone. A useful verification procedure must satisfy both.

<span id="diagram-properties"></span>

<div class="captioned-table" id="table-01-3" role="group" aria-labelledby="table-caption-01-3">

<p class="table-caption" id="table-caption-01-3"><strong>Table 01-3：Completeness and soundness concern different cases</strong></p>

| Property | Case | Acceptance condition |
| --- | --- | --- |
| Completeness | x ∈ L: true statement and honest prover | Accept with high probability: Pr[accept] ≥ 1 − negl |
| Soundness | x ∉ L: false statement and any dishonest prover | Negligible acceptance probability: Pr[accept] ≤ negl |

</div>

Accepting everything fails soundness; rejecting everything fails completeness. Both properties are required.

### 5.2 Proof vs argument

Next, consider how much computational power to allow the dishonest prover $P^*$. Changing that condition changes what is guaranteed, even if both cases are described informally as “hard to deceive.”

- **Interactive proof:** No restriction is placed on the computational power of $P^*$. Soundness in this setting is called **statistical soundness**. The class IP is defined in this sense.
- **Interactive argument:** $P^*$ is restricted to polynomial-time algorithms. Soundness in this setting is called **computational soundness**.

A proof requires soundness even without restricting the adversary's computational power. An argument requires soundness against adversaries that can compute efficiently. Cryptographic constructions typically measure the adversary's running time and success probability in terms of a security parameter.

**The A in SNARK and STARK stands for Argument.** We may call them proofs in everyday discussion, but this distinction matters when reading their mathematical guarantees. When a scheme is described as secure, ask what the adversary is assumed unable to compute and under which assumptions the guarantee holds. We will use this perspective again when comparing protocols in Act III.

<span id="diagram-models"></span>

<div class="captioned-table" id="table-01-4" role="group" aria-labelledby="table-caption-01-4">

<p class="table-caption" id="table-caption-01-4"><strong>Table 01-4：How powerful may a dishonest prover be?</strong></p>

| Proof system | Dishonest prover’s power | Guarantee |
| --- | --- | --- |
| Proof | No computational bound | Statistical soundness |
| Argument | Polynomial-time bounded | Computational soundness |

</div>

The A in SNARK / STARK stands for Argument.

In both cases the verifier is efficient. The distinction concerns guarantees against dishonest provers, not the strength of zero-knowledge.

---

## Summary and next session

Before studying proof mechanisms, today we considered what we want to check and what procedures we allow for that purpose. The three points to retain are:

- Made explicit two implicit assumptions in the NP verifier paradigm: full disclosure and non-interaction.
- Saw how interactive proofs were motivated independently by complexity theory (IP = PSPACE) and cryptography (GMR).
- Introduced formal definitions of completeness and soundness and the distinction between proofs and arguments.

These definitions alone do not establish that a witness remains secret. A procedure that simply hands over the witness can still satisfy completeness and soundness.

Next time, we question the remaining Assumption A. How should we define not giving the verifier extra information? We introduce the simulator paradigm for that purpose. We also consider what changes when witnesses extend from algebraic relations, such as discrete logarithms, to general computations.

---

## References and further reading

[1] Goldwasser, Micali, Rackoff, “[The Knowledge Complexity of Interactive Proof Systems](https://epubs.siam.org/doi/10.1137/0218012),” 1985 (1989 SIAM Journal on Computing version). — SIAM, 1989 version

[2] Babai, “[Trading Group Theory for Randomness](https://doi.org/10.1145/22145.22192),” STOC 1985. — ACM publication page

[3] Shamir, “[IP = PSPACE](https://weizmann.esploro.exlibrisgroup.com/esploro/outputs/journalArticle/IP--PSPACE/993265992703596),” Journal of the ACM, 1992. — bibliography and abstract at the author’s institution

[4] Goldreich, *[Foundations of Cryptography, Volume 1: Basic Tools](https://www.wisdom.weizmann.ac.il/~oded/foc-vol1.html)*, Chapter 4 (a textbook introduction to interactive proofs). — author’s book information, contents, and errata

[5] Babai, “Graph Isomorphism in Quasipolynomial Time,” arXiv:1512.03547, 2015. — [arXiv](https://arxiv.org/abs/1512.03547)

[6] Ladner, R. E., “On the Structure of Polynomial Time Reducibility,” *Journal of the ACM*, 22(1), 155–171, 1975. — [ACM Digital Library](https://doi.org/10.1145/321864.321877)

[7] Shor, P. W., “Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer,” *SIAM Journal on Computing*, 26(5), 1484–1509, 1997. — [SIAM](https://doi.org/10.1137/S0097539795293172)

[8] National Institute of Standards and Technology, “Post-Quantum Cryptography,” NIST CSRC. — [NIST](https://csrc.nist.gov/projects/post-quantum-cryptography)

## Suggested classroom questions

- Before beginning the discussion, ask students to predict whether it seems possible or impossible to convince someone that $x \in L$ without revealing the entire witness.
- After presenting IP = PSPACE, ask questions such as “What if we allow infinitely many rounds of interaction?” or “Does fixing the number of rounds change the class?” These provide useful preparation for the discussion of efficiency—round complexity and succinctness—in Act II.
