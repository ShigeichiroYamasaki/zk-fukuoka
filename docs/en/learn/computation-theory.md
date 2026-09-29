---
outline: [2, 3]
---

# A Minimal Guide to Languages and Computation Theory

This page introduces the language and computation theory needed for ZK Fukuoka, following the concepts and progression of J. E. Hopcroft, R. Motwani, and J. D. Ullman’s *Introduction to Automata Theory, Languages, and Computation*. It is an original, course-focused explanation, not a reproduction of the textbook.

Updated: September 29, 2026

[Prerequisites and supplementary resources](./foundations) · [Session 1](./session-01) · [Session 4](./session-04) · [Session 10](./session-10) · [Topic index](./topics)

## What you need from the subject

You do not need to read the entire book. For this course, the essential path is:

1. Represent a decision problem as a set of strings and ask whether an input belongs to it.
2. Describe a procedure that recognizes the set and measure its resource use.
3. Express a yes-instance by a short witness and an efficient verification procedure.
4. Reduce an NP computation to circuit satisfiability, then arithmetize that circuit for a proof system.

We briefly introduce finite automata, context-free grammars, and pushdown automata to compare models of language recognition. Detailed properties of regular and context-free languages are not prerequisites for zk-SNARKs or zk-STARKs.

## 1. Alphabets, strings, and languages

An **alphabet** $\Sigma$ is a finite set of symbols, such as $\Sigma=\{0,1\}$. A finite sequence of symbols is a **string**; the empty string is written $\varepsilon$. The set $\Sigma^*$ contains all finite strings over $\Sigma$, including the empty string.

A **language** $L$ is a subset of $\Sigma^*$. Thus, asking whether an input $x$ belongs to $L$ expresses a decision problem as set membership. The notation $x\in L$ means that $x$ is in the set $L$. For example, let $L_{\mathrm{even}}$ be the set of bit strings containing an even number of ones. Then $1011\notin L_{\mathrm{even}}$ because it has three ones, while $1010\in L_{\mathrm{even}}$.

For NP, membership can be established with the help of a **witness** in addition to the input.

## 2. Languages and witnesses: NP relations {#np-relations}

A **relation** $R(x,w)$ is a predicate that says whether the pair consisting of input $x$ and candidate $w$ satisfies a condition. When the relation can be checked in polynomial time and accepted witnesses have polynomially bounded length, define the language

$$L_R=\{x\mid \exists w,\ R(x,w)=1\}.$$

In other words, $x\in L_R$ exactly when at least one witness $w$ satisfies the relation. A verifier receives $w$ and computes $R(x,w)$. In the NP model, the witness is supplied to the verifier; zero-knowledge proofs study how to establish the relation without revealing the witness itself.

### Example: a satisfiable circuit

Let $C$ be a Boolean circuit and $w$ an assignment to its inputs. Define $R(C,w)=1$ when evaluating $C$ on $w$ gives output 1. Then

$$\mathrm{CircuitSAT}=\{\langle C\rangle\mid \exists w,\ C(w)=1\}.$$

The statement is “circuit $C$ is satisfiable”; the witness is an input assignment that makes its output 1. A verifier can evaluate the circuit on the supplied assignment. Sessions 1 and 2 ask how this direct check can be extended to interactive and zero-knowledge verification.

## 3. Recognizers: from finite automata to Turing machines

A **recognizer** is a model of computation that reads strings and accepts some of them. Different models recognize different classes of languages and use different computational resources.

### Finite automata

A deterministic finite automaton (DFA) has finitely many states, an input alphabet, a transition function, a start state, and accepting states. A state is finite memory: it retains only the information from the input read so far that is needed for future decisions.

For example, a machine that checks whether a bit string contains an even number of ones needs just two states: “even so far” and “odd so far.” Reading 0 leaves the state unchanged; reading 1 switches states. Languages accepted by DFAs are called **regular languages**.

This model helps describe simple input formats and finite-state conditions. It does not mean that arbitrary programs or arithmetic circuits are themselves finite automata.

### Grammars and stacks: the short version {#grammars-stacks}

A context-free grammar (CFG) describes strings through production rules and can represent nested structures such as matched parentheses. A pushdown automaton (PDA) adds a stack and recognizes the corresponding class of languages. This comparison illustrates why some tasks require more memory than a finite set of states. Proofs of normal forms or CFG–PDA equivalence are outside the required scope of this course.

### Turing machines

A Turing machine is an abstract computational model with finite control and a tape it can read and write. It provides a formal way to reason about an algorithm reading input, updating working information, and halting. A machine’s state, tape contents, and head position at a particular time form a **configuration**. A computation is a sequence of configurations related by the transition rule.

## 4. Decidability and computational complexity

A language is **decidable** if a Turing machine halts on every input and correctly accepts or rejects it. A recognizer is only required to halt and accept on inputs in its language; on inputs outside the language it may run forever. This distinction concerns whether the procedure is guaranteed to produce an answer.

### Input length and time complexity

Input size is normally measured by the number of symbols in its encoding, $n=|x|$, not by the numeric value represented by the input. A time bound $T(n)$ measures the number of steps needed on inputs of length $n$. A polynomial-time bound has the form $T(n)\leq c n^k$ for constants $c$ and $k$. Polynomial time is not the definition of computability; it is a common theoretical criterion for efficiency in this course.

- **P:** languages decidable in polynomial time by a deterministic Turing machine.
- **NP:** languages whose yes-instances have polynomial-length witnesses that a deterministic polynomial-time verifier can check.
- **PSPACE:** languages decidable using polynomial working space, without requiring a polynomial time bound.

The “N” in NP does not mean randomness. One can define NP by nondeterministic computation, or equivalently by a polynomially bounded witness that a deterministic verifier checks. Also, membership in NP alone does not imply the existence of a short zero-knowledge proof or succinct non-interactive proof.

## 5. Reductions: bringing problems to circuit satisfiability

A **polynomial-time reduction** efficiently maps inputs of one problem to inputs of another while preserving yes/no answers. If problem $A$ reduces to $B$, an algorithm for $B$ can be used to solve $A$.

The Cook–Levin theorem shows that every language in NP reduces to CircuitSAT in polynomial time. CircuitSAT is therefore NP-complete, and circuits provide a common representation for computations from NP. The course uses this result rather than reproving it: it justifies translating a general computation into a circuit and checking whether that circuit is satisfied.

## 6. From interactive proofs to arithmetization

In the classical NP verifier model, the verifier receives a candidate witness and computes $R(x,w)$. In an interactive proof, the verifier can ask a prover questions; completeness, soundness, and zero knowledge are defined separately. The Session 1 result IP = PSPACE shows what interaction and randomized verification can achieve in complexity theory. It does not claim that every problem has a short non-interactive proof.

Arithmetization replaces the input, intermediate values, and output of a circuit with constraints over a finite field. Session 4 uses R1CS, QAP, and AIR for this purpose. Keep the stages distinct: the system does not directly encode an arbitrary Turing-machine configuration sequence as a cryptographic proof; it represents a target computation as a circuit or execution trace, then proves the required constraints.

| Computation-theory concept | Role in the ZK course | Relevant sessions |
| --- | --- | --- |
| Language $L$ and membership $x\in L$ | Formalize the statement to be proved | [1](./session-01), [2](./session-02) |
| Relation $R(x,w)$ and NP | Verify a statement using a witness | [1](./session-01), [2](./session-02) |
| Computation models and complexity | Evaluate time and space used by a verifier | [1](./session-01), [4](./session-04) |
| Reductions and CircuitSAT | Reduce general NP computations to circuit satisfiability | [4](./session-04) |
| Interactive proofs and IP = PSPACE | Understand how interaction changes verification power | [1](./session-01), [10](./session-10) |
| Arithmetization of circuits and traces | Turn computational correctness into finite-field constraints | [4](./session-04), [13](./session-13) |

## 7. A minimal reading route through the textbook

Chapter numbering varies by edition, so use topic names as well. The publisher’s Japanese second-edition translation is divided into Volumes I and II. Its contents place formal proofs, finite automata, regular languages, and context-free languages in Volume I, and Turing machines, undecidability, P/NP, and PSPACE in Volume II.

| Goal | Topics to look for in the book | Where they appear here |
| --- | --- | --- |
| Get comfortable with proofs and language notation | Volume I, Chapter 1: formal proofs, definitions, examples and induction | [Languages and witnesses](#np-relations) |
| Understand finite state | Volume I, Chapters 2–3: finite automata, regular expressions and regular languages | [Finite automata](#finite-automata) |
| Compare grammars and memory models | Volume I, Chapters 5–6: context-free grammars and pushdown automata | [Grammars and stacks](#grammars-stacks) (overview only) |
| Study computability and complexity | Volume II, Chapters 8–11: Turing machines, undecidability, P and NP, PSPACE | [Decidability and complexity](#_4-decidability-and-computational-complexity), [reductions](#_5-reductions-bringing-problems-to-circuit-satisfiability) |

**Priority:** Start with proof techniques and induction in Volume I, Chapter 1, then the basic Turing-machine and P/NP chapters in Volume II. Use finite automata and context-free languages to understand the landscape of models; return for detailed properties and exercises only when needed. Review PSPACE and reductions alongside Sessions 1, 4 and 10.

Bibliographic information: see the publisher’s official pages for [Volume I](https://saiensu.co.jp/search/?isbn=978-4-7819-1026-0&y=2003) and [Volume II](https://saiensu.co.jp/search/?isbn=978-4-7819-1027-7&y=2003). The second-edition Japanese translation lists Hopcroft, Motwani and Ullman as authors.

## 8. Check your understanding

1. For $\Sigma=\{0,1\}$, give an element of $\Sigma^*$ and explain how it differs from a language $L$.
2. Identify the input, membership condition, and witness for CircuitSAT.
3. Why are two states enough for a finite automaton to track whether it has read an even number of ones?
4. Explain using witness verification why NP is not “computation that tries random answers.”
5. Why is a reduction to CircuitSAT useful before studying R1CS and QAP?

::: details Sample answers
1. `010` is in $\Sigma^*$. The set $\Sigma^*$ contains all finite strings, while $L$ selects only strings satisfying a particular condition.
2. The input is an encoding of circuit $C$; it belongs if a satisfying assignment exists; that assignment is the witness.
3. The exact count is unnecessary; only its parity matters, so “even” and “odd” suffice.
4. The NP verifier deterministically checks a supplied candidate witness. Randomness is not part of the NP definition.
5. Since CircuitSAT is NP-complete, reducing general NP computations to circuit satisfiability gives a common route to arithmetizing the circuit’s constraints.
:::

## References

- J. E. Hopcroft, R. Motwani, and J. D. Ullman, [*Automata, Languages, and Computation I* (Japanese second-edition translation)](https://saiensu.co.jp/search/?isbn=978-4-7819-1026-0&y=2003), Saiensu-Sha, 2003.
- J. E. Hopcroft, R. Motwani, and J. D. Ullman, [*Automata, Languages, and Computation II* (Japanese second-edition translation)](https://saiensu.co.jp/search/?isbn=978-4-7819-1027-7&y=2003), Saiensu-Sha, 2003.
- [Session 1: What Is a Proof?](./session-01) · [Session 4: Arithmetization and Complexity](./session-04) · [Session 10: PCP and IOP](./session-10)
