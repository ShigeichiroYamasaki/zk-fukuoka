---
outline: [2, 3]
---

# Sets, membership and languages: reading x ∈ L

[Back to Session 1](../session-01) · [Prerequisites](../foundations) · [Topic index](../topics)

Updated: September 28, 2026

## 1. Sets and elements

A set is a collection of objects called elements. For $A=\{2,4,6\}$, $4\in A$ means “4 is an element of A,” whereas $3\notin A$ means “3 is not an element of A.” Membership is not equality: an element and the set containing it are different objects.

| Notation | Meaning | Example |
| --- | --- | --- |
| $x\in A$ | x belongs to A | $4\in\{2,4,6\}$ |
| $x\notin A$ | x does not belong to A | $3\notin\{2,4,6\}$ |
| $A\subseteq B$ | Every element of A also belongs to B | $\{2,4\}\subseteq\{2,4,6\}$ |
| $\{x\mid C(x)\}$ | All x satisfying condition C | $\{n\in\mathbb{Z}\mid n>0\}$ is the set of positive integers |

## 2. Encoding a problem as a string

Numbers, graphs and programs can be encoded as finite strings. An alphabet $\Sigma$ is the set of available symbols. For $\Sigma=\{0,1\}$, examples include `0`, `101` and `1100`. $\Sigma^*$ is the set of all finite strings, including the empty string; the star is not multiplication here.

We write x for an encoded input and $|x|$ for its length. The binary string `1100` represents the number twelve but has length four. A graph input encodes its vertices and edges.

## 3. A language is a set of Yes inputs

In complexity theory, a **language** is a set of strings $L\subseteq\Sigma^*$, not a natural language such as English. A decision problem can be represented by collecting precisely the inputs for which the answer is Yes. Thus,

$$x\in L$$

means “input x is a Yes instance,” or “the claim about x is true.” $x\notin L$ describes a No instance.

For example, let L contain binary representations of even nonnegative integers. Then `1100` belongs to L, while `1101` does not. **Acceptance by a verifier does not make an input a member of L.** The problem defines the set beforehand.

For an example closer to this course, let L contain encodings of satisfiable Boolean formulas. If x encodes $a\land b$, the assignment $a=b=1$ shows membership. If x encodes $a\land\neg a$, no assignment makes it true, so x is outside L. Malformed encodings are excluded from this language.

## 4. x ∈ L and L ∈ NP refer to different levels

An input x is one string; L is a set of strings; NP is a collection of languages satisfying a verifier condition.

- $x\in L$: this input has answer Yes.
- $L\in\mathrm{NP}$: Yes inputs of this decision problem have short witnesses that can be checked efficiently.

Membership in NP does not mean every input has answer Yes, or that the problem must be hard. The even-number example is in NP and is easy to decide without using a witness.

## 5. Reading the Session 1 formula

$$x\in L\iff\exists w,\ |w|\le\mathrm{poly}(|x|),\ V(x,w)=1$$

The symbol $\iff$ means “if and only if,” and $\exists$ means “there exists.” Here w is a witness, V is the verification algorithm, and 1 denotes acceptance. The notation $\mathrm{poly}(|x|)$ abbreviates a bound given by some fixed polynomial in the input length. The NP definition also requires polynomial-time verification.

The formula says: x is a Yes input exactly when at least one witness within the length bound is accepted by V. In the satisfiability example, x encodes the formula and w is an assignment to its variables. **These are different roles.** Continue with [NP relations, public inputs and witnesses](./np-relations) and [polynomial time and complexity](./complexity).

In Session 1, completeness concerns $x\in L$ and soundness concerns $x\notin L$. Acceptance in an interactive proof is a probabilistic event; language membership is a fact defined by the problem.

## 6. Check your understanding

1. For $A=\{1,3,5\}$, how do $3\in A$ and $\{3\}\subseteq A$ differ?
2. Is $x\in L$ always equivalent to “a verifier accepted x”?
3. In satisfiability, which is x: the formula or the assignment? Which is w?

<details>
<summary>Answers</summary>

1. The first relates an element to a set; the second relates two sets. Both are true.
2. No. The problem defines membership; a verifier may accept incorrectly.
3. The encoded formula is x; an assignment making it true is w.

</details>

See also the [supplementary resources on sets, functions and logic](../computation-theory).
