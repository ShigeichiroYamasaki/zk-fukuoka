# Session 1 exercises: What is a proof?

[Session 1: What is a proof?](../learn/session-01) · [Exercises index](./)

These exercises connect NP verification to the formal properties of interactive proof systems. You are not expected to prove the complexity-theoretic theorem; the goal is to explain what it states and what it guarantees.

## 1. Distinguish a language, a statement, and a witness

### Problems

Let $L_{\mathrm{comp}}$ be the language of encodings of composite numbers. For input $x=91$:

1. Explain the statement $x\in L_{\mathrm{comp}}$.
2. Specify a witness $w$ and a verifier $V(x,w)$.
3. Decide whether $w=7,13,8,1$ is accepted, and explain why.
4. Distinguish the statement “91 is composite” from the witness 7.
5. Explain why running time is measured in the encoding length $|x|$, rather than the numerical value of $x$. Refer to binary representation.

### Worked check

The statement `$x\in L_{\mathrm{comp}}$` means that the encoded integer $x$ is composite. One verifier takes a proper divisor $w$ as the witness and checks $1<w<x$ and $x\bmod w=0$. Formally,

$$x\in L_{\mathrm{comp}}\iff \exists w\;(1<w<x\;\land\;x\bmod w=0).$$

For 91, both 7 and 13 are accepted. The verifier rejects 8 because it does not divide 91, and rejects 1 because it fails the range condition. A statement is the property to be established; a witness is concrete information used to check it, and one statement may have multiple witnesses.

Complexity is measured in the length of the encoded input. An integer represented by $n$ bits can be as large as about $2^n$, so a polynomial in the numerical value and a polynomial in the input length are not the same bound.

## 2. Verify graph isomorphism with a witness

Consider these undirected simple graphs:

- $G_0$ has vertices $\{a,b,c,d\}$ and edges $\{ab,bc,ca,cd\}$.
- $G_1$ has vertices $\{1,2,3,4\}$ and edges $\{12,23,31,14\}$.

### Problems

1. Check that $\pi(a)=2,\pi(b)=3,\pi(c)=1,\pi(d)=4$ is a bijection.
2. Make a table showing where each edge of $G_0$ maps.
3. Check that non-edges are preserved as well.
4. Explain why equal vertex and edge counts do not suffice to prove isomorphism. Give two non-isomorphic graphs with five vertices and three edges.

### Worked check

The image of the map is $\{1,2,3,4\}$ with no repetitions, so it is a bijection. The edges map as $ab\mapsto23$, $bc\mapsto31$, $ca\mapsto12$, and $cd\mapsto14$, all edges of $G_1$. The non-edges $ad,bd$ map to $24,34$, both non-edges of $G_1$. Thus the map preserves edges and non-edges and is an isomorphism.

For a counterexample, compare a 5-vertex star $K_{1,3}$ plus an isolated vertex with a 4-vertex path $P_4$ plus an isolated vertex. Both have five vertices and three edges, but their degree sequences are $(3,1,1,1,0)$ and $(2,2,1,1,0)$. Isomorphisms preserve degrees, so the graphs are not isomorphic.

## 3. From NP verification to interactive proofs

### Problems

1. In $x\in L\iff\exists w\;V(x,w)=1$, explain what the prover and verifier do.
2. State the two assumptions discussed in the lecture: revealing the entire witness and a one-way, single-read verification. Match each assumption to the question that motivates zero knowledge or interaction.
3. In an Arthur–Merlin-style interaction, explain why it matters that the verifier asks a random question before receiving the prover’s response. How is this different from merely splitting a message into pieces?
4. State what IP = PSPACE says, and give one conclusion that does not follow from this theorem alone.
5. For password authentication and graph isomorphism, identify what the verifier wants to learn and what information the prover may not want to reveal.

### Worked check

In NP verification, the prover supplies a witness and the verifier decides whether to accept using the input and witness. Questioning full disclosure motivates asking whether a prover can convince a verifier without revealing the witness. Questioning one-way verification motivates asking whether verifier challenges and prover responses can expand verification power.

When the verifier’s question is chosen randomly before the response, the prover must answer the challenge actually received. Merely splitting a one-way message does not create this challenge-dependent interaction. IP = PSPACE says that the languages decidable by interactive proof systems with probabilistic polynomial-time verifiers are exactly PSPACE. It does not imply $\mathrm{NP}=\mathrm{PSPACE}$ or $\mathrm{P}=\mathrm{PSPACE}$. In password authentication, the verifier wants to know that the other party knows the secret, but sending the password reveals it to the verifier. In graph isomorphism, an isomorphism lets the verifier check the proposition directly, while the prover may want to convince the verifier without revealing the map itself.

## 4. Completeness, soundness, proof, and argument

### Problems

For each verifier or system below, identify which property it can satisfy and which it fails, with a reason.

1. On a true statement, it accepts with high probability when interacting with the honest prover.
2. On a false statement, no dishonest prover can make it accept beyond the required error bound.
3. A verifier that always accepts.
4. A verifier that always rejects.
5. Explain the difference between a Proof and an Argument in terms of the computation allowed to a dishonest prover.

### Worked check

1 is completeness; 2 is soundness. An always-accept verifier may satisfy completeness but fails soundness. An always-reject verifier may satisfy soundness but fails completeness.

For a Proof, soundness must hold even against a prover with no computational time limit. For an Argument, the dishonest prover is restricted to polynomial-time computation, and soundness is guaranteed against provers within that bound. The distinction concerns the adversarial prover’s power, not the verifier’s efficiency.

## 5. Synthesize the two motivations

Complete each sentence in two to four sentences of your own:

- Complexity theory motivates interactive proofs because …
- Cryptography motivates zero knowledge because …
- Completeness and soundness are both needed because …
- Checking a witness and revealing a witness are …

### Readiness checklist

- [ ] I can explain the roles of $x\in L$, witness $w$, and verifier $V$ with an example.
- [ ] I can explain why interaction means responses to verifier challenges, not just splitting messages.
- [ ] I can state what IP = PSPACE means and distinguish it from unproved class separations.
- [ ] I can distinguish completeness, soundness, Proof, and Argument.

[Syllabus](../learn/) · [Session 1 lecture](../learn/session-01) · [Next: Session 2 exercises](./session-02)
