# Session 2 exercises: Zero knowledge and generalizing the witness

[Session 2: Zero knowledge and generalizing the witness](../learn/session-02) · [Exercises index](./)

These exercises connect five ideas from the lecture: distributions and zero knowledge, the graph-isomorphism protocol, knowledge soundness and extractors, Schnorr’s algebra, and expressiveness versus efficiency. After each problem, explain what is being checked and what information each party sees.

## 1. The relation $R$ and what zero knowledge compares

### Problems

1. Use a relation $R$, public input $x$, and witness $w$ to express that $x$ has a witness belonging to the relation.
2. Explain how the real verifier record $X$ and simulator output $Y$ are generated as random variables. Does the simulator receive the witness?
3. Explain the difference between perfect, statistical, and computational zero knowledge.
4. Distinguish honest-verifier zero knowledge (HVZK) from zero knowledge against arbitrary verifiers.
5. In the lecture’s two-bit example, $P_0$ outputs $00,11$ with probability $1/2$ each, while $P_1$ outputs $01,10$ with probability $1/2$ each. Verify that the marginal probability of each bit is the same. Then compute the output probabilities and distinguishing gap for the distinguisher that outputs 1 exactly when the bits are equal.
6. For a second example, let $P(00)=P(01)=1/2$ and $Q(00)=Q(10)=1/2$. Compute the distinguishing gap for a test that outputs 1 when the first bit is 0. Also compute the statistical distance between these distributions.

### Worked check

A relation is a set of pairs of public inputs and witnesses. The statement is

$$x\in L_R\quad\Longleftrightarrow\quad \exists w\;(x,w)\in R.$$

Let $X$ be the whole record observed by the verifier in a real interaction, varying the prover’s and verifier’s randomness. Let $Y$ be the simulator’s output, varying the simulator’s randomness. Compare their distributions for the same fixed public input (and auxiliary input, when present). The simulator does not receive $w$.

Perfect zero knowledge requires identical distributions. Statistical zero knowledge requires negligible statistical distance. Computational zero knowledge requires that every probabilistic polynomial-time distinguisher’s output probabilities differ by at most a negligible amount. HVZK means that a simulator reproduces the record of a verifier following the prescribed protocol. Zero knowledge against arbitrary verifiers also covers verifiers that deviate, for example by choosing challenges differently, so it does not follow automatically from HVZK alone.

In the two-bit example, each position is 0 or 1 with probability $1/2$ under either source, but equality behaves differently. The equality test outputs 1 with probability 1 under $P_0$ and 0 under $P_1$, for a gap of 1. In the second example, the first-bit test outputs 1 with probability 1 under $P$ and $1/2$ under $Q$, for a gap of $1/2$. The distributions share mass $1/2$ on $00$ and put the remaining mass on different outcomes, so their statistical distance is also $1/2$.

## 2. Follow the graph-isomorphism protocol

Use the graphs from Session 1: $G_0$ has vertices $\{a,b,c,d\}$ and edges $\{ab,bc,ca,cd\}$; $G_1$ has vertices $\{1,2,3,4\}$ and edges $\{12,23,31,14\}$. Let

$$\pi(a)=2,\quad\pi(b)=3,\quad\pi(c)=1,\quad\pi(d)=4.$$

### Problems

1. The prover sends $H=\rho(G_0)$ for a random vertex permutation $\rho$ before the verifier chooses $b\in\{0,1\}$. Give a valid response map for each challenge.
2. State the two checks the verifier performs on a returned map $f:G_b\to H$. Is it enough to check only that edges are preserved?
3. Explain completeness when $G_0$ and $G_1$ are isomorphic.
4. If the graphs are not isomorphic, how many of the two challenges can a prover answer correctly for the same committed $H$, at most? Find the one-round acceptance bound and the bound after $k$ independent repetitions.

### Worked check

For $b=0$, return $\rho:G_0\to H$. For $b=1$, return $\rho\circ\pi^{-1}:G_1\to H$. The verifier checks (i) that $f$ is a bijection and (ii) that every vertex pair preserves both adjacency and non-adjacency. Checking only edges could miss a map that incorrectly sends a non-edge to an edge.

Because $\pi$ is known, the honest prover can answer either challenge and is accepted. If the graphs are not isomorphic, one fixed $H$ cannot be isomorphic to both; at most one challenge can be answered correctly. A uniform one-bit challenge gives a one-round false-acceptance probability at most $1/2$. Repeating with $k$ independent challenges gives an all-round acceptance probability at most $2^{-k}$.

## 3. Distinguish the simulator from the extractor

### Problems

1. Explain how a simulator for an honest verifier can generate a record without witness $\pi$. Include the order in which it generates the challenge and graph.
2. Why does being able to generate a record not mean that a prover can answer any challenge in a live interaction?
3. Suppose an extractor obtains two accepting maps for the same $H$: $f_0:G_0\to H$ and $f_1:G_1\to H$. Construct a witness from $G_0$ to $G_1$ and explain why it is valid.
4. Compare simulator and extractor by input, access, output, and goal. Must either one read the prover’s private memory directly?
5. Let the prover’s acceptance probability be $p$ and the knowledge error be $\kappa$. What does $\delta=p-\kappa$ represent? Why can acceptance probability not be identified with extraction success probability?

### Worked check

The honest-verifier simulator first chooses a random challenge $b$, then chooses a random relabeling $\varphi_b$ of $G_b$, and outputs $H=\varphi_b(G_b)$ with the map $\varphi_b$. Since the graphs are isomorphic, uniformly relabeling either one yields the same distribution over labeled graphs. The simulator can therefore generate a record with the same distribution as a real interaction. In a live interaction, however, the prover must commit to $H$ before learning $b$; simulating the whole record does not itself give a prover the ability to answer the later challenge.

Compose the maps as

$$\pi'=f_1^{-1}\circ f_0:G_0\to G_1.$$

$f_0$ maps $G_0$ to $H$, and $f_1^{-1}$ maps $H$ to $G_1$, so their composition preserves edges and non-edges. The extractor is a hypothetical algorithm in the security proof that invokes or rewinds the prover and constructs a valid witness. It does not need to inspect private memory. A simulator instead produces the verifier’s record without the witness. Their access and outputs differ. Knowledge soundness relates how far the acceptance probability $p$ exceeds the knowledge error $\kappa$ (the gap $\delta=p-\kappa$) to an extractor’s running time and success probability. Acceptance is measured in the ordinary interaction, while extraction success is measured in a separate experiment with the extractor’s prescribed access; they are not the same random variable. The precise guarantee depends on the scheme and definition.

## 4. Schnorr’s algebraic verification and witness extraction

Use a group of order $q=11$ with $p=23$, $g=2$, and secret exponent $w=3$. The public value is $y=g^w\bmod p=8$. The prover chooses $r=4$ and sends commitment $t=g^r\bmod p=16$. Its response is $s=r+cw\pmod q$, and verification checks $g^s\equiv ty^c\pmod p$.

### Problems

1. For challenge $c_1=2$, find response $s_1$ and evaluate both sides of the verification equation.
2. For the same $t$, use the second challenge $c_2=5$ and response $s_2=8$ to verify the equation.
3. Derive and compute $w'$ from the two accepting transcripts. Check that it is a valid witness.
4. Why are the same commitment and two different challenges needed? Does this mean an ordinary verifier should send two challenges?

### Worked check

$$s_1=4+2\cdot3=10\pmod{11}.$$

The left side is $2^{10}\bmod23=12$; the right side is $16\cdot8^2\bmod23=12$. For the second transcript, $2^8\bmod23=3$ and $16\cdot8^5\bmod23=3$. Subtracting the two accepting equations cancels the randomness associated with the shared commitment:

$$s_1-s_2\equiv(c_1-c_2)w\pmod q.$$

Since $c_1\ne c_2$, the difference has an inverse modulo prime $q$, so

$$w'=(s_1-s_2)(c_1-c_2)^{-1}\pmod{11}=3.$$

Indeed, $2^3\bmod23=8=y$. This is an extractor’s rewind argument in a security proof, not a procedure for an ordinary verifier to send two challenges.

## 5. General computation and the two evaluation axes

### Problems

1. For Schnorr, the witness is exponent $w$ and the group equation $y=g^w$ supports verification. For a general program, what could a witness contain, and why can’t the same equation be reused directly?
2. State the role of arithmetization. Is arithmetization itself a zero-knowledge proof?
3. Place Schnorr, Schnorr after Fiat–Shamir, and Groth16/PLONK/STARK on the lecture’s expressiveness-versus-efficiency map.
4. Explain these as three separate properties: zero knowledge, non-interactivity, and succinctness. Does Fiat–Shamir by itself shorten a proof?

### Worked check

For a general computation, a witness may contain the input or intermediate values of an execution that satisfies the constraints. Unlike Schnorr, arbitrary computations do not share one simple group equation that directly verifies their correctness. Arithmetization translates a computation into a representation such as a circuit or polynomial constraints that a proof system can check. Arithmetization prepares the claim; it does not itself provide a proof or a zero-knowledge guarantee.

Schnorr checks a specific algebraic relation interactively. Under suitable conditions, Fiat–Shamir removes the interaction, but does not by itself provide succinctness for general computations. Groth16, PLONK, and STARK are examples of succinct proof systems for general computations studied later in the course.

Zero knowledge asks whether witness information is hidden; non-interactivity asks whether verification can happen without a live exchange; succinctness asks whether proof and verification costs are small compared with the computation. These properties are distinct. Setup requirements and prover cost are separate considerations as well.

## Readiness checklist

- [ ] I can explain that zero knowledge compares the real verifier’s record with a simulator’s output for the same public input.
- [ ] I can describe the graph-isomorphism protocol, what the verifier checks, and how repetition lowers the soundness error.
- [ ] I can distinguish the simulator’s and extractor’s access, goals, and outputs.
- [ ] I can compute Schnorr verification and extraction from two accepting responses.
- [ ] I can explain why general computation motivates arithmetization.
- [ ] I can distinguish zero knowledge, non-interactivity, and succinctness.

[Syllabus](../learn/) · [Session 2 lecture](../learn/session-02) · [Previous: Session 1 exercises](./session-01) · [Next: Session 3 exercises](./session-03)
