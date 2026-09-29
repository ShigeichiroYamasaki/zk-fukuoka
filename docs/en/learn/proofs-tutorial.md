# Logic and proofs: a tutorial for reading ZK

Author: Shigeichiro Yamasaki  
Created: September 29, 2026  
Last updated: September 29, 2026

This tutorial introduces the logic and proof techniques needed to follow the zero-knowledge course. It proceeds from statements and conditionals to quantifiers and proof methods. The goal is to help readers interpret phrases such as “there exists a witness” and “the probability that a false proof is accepted.”

The structure and examples here were written specifically for this site. For a broader systematic treatment, see Richard H. Hammack’s open textbook [Book of Proof](https://richardhammack.github.io/BookOfProof/).

## 1. Statements and truth values

A **statement** is a sentence that is either true or false. “7 is prime” is a true statement; “9 is prime” is false. By contrast, “$n$ is prime” has no truth value until the value of $n$ is specified. It is a predicate containing a variable; specifying the domain and value turns it into a statement.

In a zero-knowledge proof, we first specify the statement to be proved. For a public input $u$, “there exists a witness $w$ satisfying condition $R(u,w)$” is written

$$
\exists w\;R(u,w)=1.
$$

Here $R$ is a relation (a check): it returns $1$ when the pair $(u,w)$ satisfies the condition and $0$ otherwise. The value $u$ is public information, while $w$ is the information that makes the statement hold.

## 2. Logical connectives and conditionals

Statements $P$ and $Q$ can be combined as follows.

| Symbol | Reading | True when |
| --- | --- | --- |
| $\neg P$ | not $P$ | $P$ is false |
| $P\land Q$ | $P$ and $Q$ | both are true |
| $P\lor Q$ | $P$ or $Q$ | at least one is true |
| $P\Rightarrow Q$ | if $P$, then $Q$ | except when $P$ is true and $Q$ is false |
| $P\Leftrightarrow Q$ | $P$ iff $Q$ | they have the same truth value |

A conditional $P\Rightarrow Q$ is false only when its premise $P$ is true and its conclusion $Q$ is false. This matters when reading proofs. The conditional does not automatically imply its converse $Q\Rightarrow P$.

**Example.** “If an integer $n$ is divisible by $4$, then $n$ is even” is true. Its converse, “if $n$ is even, then it is divisible by $4$,” is false; $n=2$ is a counterexample. Do not confuse a conditional with its converse.

A conditional $P\Rightarrow Q$ has the same truth value as its contrapositive $\neg Q\Rightarrow\neg P$. So when it is difficult to derive $Q$ directly from $P$, one can instead show that “if $Q$ is false, then $P$ is false.”

## 3. “For all” and “there exists”

Quantifiers must be read together with the domain of the variable.

| Symbol | Reading | Example |
| --- | --- | --- |
| $\forall x\in S\;P(x)$ | for every $x$ in $S$, $P(x)$ | every even integer is divisible by $2$ |
| $\exists x\in S\;P(x)$ | there is at least one $x$ in $S$ satisfying $P(x)$ | $S$ contains at least one prime |

Negation swaps the quantifier and negates the predicate:

$$
\neg(\forall x\in S\;P(x))\equiv\exists x\in S\;\neg P(x),\qquad
\neg(\exists x\in S\;P(x))\equiv\forall x\in S\;\neg P(x).
$$

Thus, the negation of “it holds for every candidate” is “there is a candidate for which it fails,” while the negation of “there is a candidate that works” is “none of the candidates work.” These transformations are useful when dealing with counterexamples and witnesses.

### NP relations and witnesses

An NP statement is often expressed as the existence of a witness satisfying a check. If a language $L$ is the set of accepted inputs, then

$$
u\in L\quad\Longleftrightarrow\quad \exists w\;R(u,w)=1.
$$

For example, let $u$ describe a graph and an integer $k$. The statement “there are $k$ vertices that are pairwise connected by edges” has as a witness $w$ a list of those vertices. A checker verifies the list length, that the vertices are in range, and that every pair has an edge. The witness is the concrete information that makes the statement true; relation $R$ specifies how to check that information.

## 4. What a proof does

A mathematical proof is a finite argument that connects assumptions to a conclusion by valid rules of inference. When reading a proof, check three things:

1. What is being assumed?
2. Which definitions or established results are being used?
3. Does the conclusion really follow from those reasons?

For example, prove “if $n$ is even, then $n^2$ is even.” By the definition of even, assume $n=2k$ for some integer $k$. Then $n^2=(2k)^2=2(2k^2)$, so $n^2$ is even. This is a direct proof: it uses the definition of even to connect the premise to the conclusion.

### Common proof patterns

| To prove | Basic approach |
| --- | --- |
| $P\Rightarrow Q$ | Assume $P$ and derive $Q$ from definitions or known results (direct proof). |
| $P\Rightarrow Q$ | Prove the contrapositive $\neg Q\Rightarrow\neg P$. |
| $P\Rightarrow Q$ | Assume $P$ and $\neg Q$, then derive a contradiction. |
| $\exists x\;P(x)$ | Give a concrete $x$ and verify that it satisfies the condition. |
| $\forall x\;P(x)$ | Choose an arbitrary allowed $x$ and prove the claim for it. |
| $P\Leftrightarrow Q$ | Prove both $P\Rightarrow Q$ and $Q\Rightarrow P$. |

To refute a universal claim $\forall x\;P(x)$, it is enough to give one specific $x$ for which $P(x)$ fails. Such an example is a **counterexample**. For instance, “every prime is odd” is false because $2$ is prime and even.

## 5. Mathematical proofs and cryptographic proofs

A mathematical proof establishes that a statement follows from definitions, axioms, and rules of inference. A cryptographic proof protocol involves computations by a prover and verifier, and analyzes the probability that the verifier accepts. The two are related, but they are not the same thing.

In a zero-knowledge proof, a prover demonstrates knowledge of a witness for a statement associated with public input $u$. **Completeness** means that a prover with a valid witness is accepted with high probability. **Soundness** means that a prover without a witness satisfying the statement has only a small probability of acceptance. **Zero-knowledge** means the verifier learns no witness information beyond what is needed to accept. Therefore, do not mistake “the protocol accepted” for an unconditional mathematical proof; interpret it under the protocol’s completeness, soundness, and zero-knowledge definitions and assumptions.

## 6. Short exercises

**Exercise 1.** Write “for every input $u$, there exists a witness $w$ satisfying the condition” in symbols, then negate it.

**Answer.** The statement is $\forall u\;\exists w\;R(u,w)=1$. Its negation is $\exists u\;\forall w\;R(u,w)\ne1$. That is, there is an input for which no witness satisfies the condition.

**Exercise 2.** Write the contrapositive of “if $n$ is divisible by $6$, then $n$ is even.”

**Answer.** “If $n$ is not even, then $n$ is not divisible by $6$.” The contrapositive is equivalent to the original conditional.

**Exercise 3.** Give a counterexample to “for every integer $n$, $n^2>n$.”

**Answer.** Set $n=0$; then $0>0$ is false. ($n=1$ is also a counterexample.) One counterexample suffices to refute a universal claim.

## Continue learning

- [Sets, membership and languages](./terms/sets-and-languages): review notation such as $u\in L$
- [Session 1: What is a proof?](./session-01): learn the verifier paradigm, languages, and the role of a witness
- [Session 2: Zero-knowledge and generalizing witnesses](./session-02): study relation $R$, completeness, soundness, and knowledge extraction
- Further reading: [Book of Proof, Richard Hammack (official site)](https://richardhammack.github.io/BookOfProof/)
