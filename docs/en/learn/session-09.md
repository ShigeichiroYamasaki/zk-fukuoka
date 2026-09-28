---
outline: [2, 3]
prev:
  text: Session 8 · Polynomial commitments and cryptographic commitment theory
  link: /en/learn/session-08
next:
  text: Session 10 · The PCP theorem and the IOP framework
  link: /en/learn/session-10
---

<script setup>
import StudyDiagram from "../../.vitepress/theme/StudyDiagram.vue";
</script>

# Session 9: The Fiat–Shamir transform and the merits and limits of ROM

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 26, 2026<br>
Last updated: September 28, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 9 in the syllabus](./#session-9) · [Exercises](../exercises/)

## Position in the course and learning objectives

We have seen procedures in which the verifier supplies random questions during an exchange. But repeated interaction becomes a burden if a proof should be created once and checked later by others. Today we ask how to replace those questions, distinguishing the Fiat–Shamir procedure from the model used to prove its security. Note that a KZG evaluation opening itself is non-interactive once the point is specified.

There are three learning objectives:

1. Understand how the Fiat–Shamir transform turns interactive protocols into non-interactive ones.
2. Understand the idea of security proofs in the Random Oracle Model (ROM).
3. Recognize the heuristic nature of using ROM for concrete implementations, learn about theoretical counterexamples, and critically evaluate the model's significance and limitations.

---

## 1. Why is non-interactivity necessary?

### 1.1 Practical requirements

Consider placing a proof on a blockchain. It is easier for each participant to inspect a published proof than to conduct a separate exchange with the prover. The prover need not remain available to respond later. This operational goal motivates non-interactivity.

### 1.2 A common structure in earlier protocols

Schnorr uses commitment, challenge, and response. FRI also fixes tables before random challenges, but the complete protocol is a multi-round IOP rather than simply a three-message Σ-protocol. The common feature is issuing random challenges after preceding messages in a public-coin exchange.

---

## 2. The Fiat–Shamir transform

### 2.1 The basic idea

Could a reproducible rule replace the verifier’s fresh random choice? Fiat–Shamir hashes information already fixed in the exchange to obtain a challenge that anyone can recompute. The idea is:

> Replace the verifier's random challenge with a value that the prover computes by hashing the transcript so far.

For a Σ-protocol-style protocol, instead of receiving challenge $c$ from the verifier, the prover computes

$$c = H(\text{commitment}, x)$$

The prover is not the only party computing this hash. The verifier recomputes the challenge from the same input and checks the response. Actual constructions unambiguously encode the statement, public parameters, preceding messages, protocol identifiers, and other required context. Choosing what enters the hash is part of the protocol.

### 2.2 Security intuition

The prover can choose commitments and inspect their hashes, so it is inaccurate to say it cannot search for favorable values. We need to bound the probability of producing an invalid proof even after an efficient adversary makes repeated attempts. One-wayness alone does not give this conclusion. ROM makes queries and success probabilities explicit for analysis.

<StudyDiagram id="09-1" :en="true" />

---

## 3. The Random Oracle Model (ROM)

### 3.1 Definition of the model

To model how responses to inputs are determined, treat the hash as an ideal random function: the Random Oracle Model. “Random” does not mean that repeated queries to the same input receive different answers. The model has all three properties below.

- A query on a previously unseen input receives a uniformly random output.
- Repeated queries on the same input always receive the same output, ensuring consistency.
- All algorithms, including attackers, access $H$ only through queries and cannot inspect its internal representation.

<StudyDiagram id="09-2" :en="true" number="09-1" />

### 3.2 The structure of a security proof in ROM

For constructions such as Schnorr satisfying the required conditions, Session 6’s forking lemma can be used. Fork an adversary’s execution, change an oracle response, and obtain accepting transcripts for different challenges from which a witness can be extracted. This proof does not apply identically to every public-coin protocol; check the source protocol’s properties and the target security guarantee.

---

## 4. The limits of ROM

### 4.1 Instantiating ROM remains a heuristic

After proving security in ROM, ask exactly what was proved. The theorem concerns a scheme using an ideal random oracle. An implementation uses a concrete function such as SHA-256. The same guarantee does not automatically survive that substitution. Distinguish the theorem inside the model from the judgment of applying that model to an implementation.

### 4.2 Theoretical counterexamples

Canetti, Goldreich, and Halevi show that this distinction has mathematical consequences. There are artificial constructions secure in ROM but insecure under concrete hash instantiations, discussed in their 2004 JACM paper. This is not a blanket attack on practical schemes; it rules out a general implication from ROM security to implementation security.

<StudyDiagram id="09-3" :en="true" />

### 4.3 Why ROM is still widely used

Does the counterexample make ROM analysis useless? There is value in analyzing a scheme, including adversarial queries, under explicit idealized conditions. But security claims must stay within what was proved. Consider the practical reasons below while retaining that distinction.

- Counterexamples such as CGH are deliberately constructed to exhibit pathological behavior; they do not themselves provide concrete attacks on practical protocols such as Fiat–Shamir-based Schnorr signatures.
- A ROM proof establishes the specified security property within the idealized model; it does not certify an implementation or rule out every kind of attack.
- The cost of avoiding ROM depends on the functionality and setup assumptions. Groth16, for example, is non-interactive in the CRS model without Fiat–Shamir.

### 4.4 How to use this critical perspective

When reading a scheme, trace where it uses a random oracle and what that assumption establishes. Instead of stopping at “there is a security proof,” distinguish the model, assumptions, and implementation. We will use this reading method for PLONK and STARKs.

### 4.5 The IP perspective: losing the enforced order of interaction {#rom-interaction-limits}

Recall interactive proofs from Session 1. Soundness says that for a false statement $x\notin L$, every cheating prover has bounded acceptance probability in an experiment including verifier randomness:

$$\forall x\notin L,\ \forall P^*,\qquad
\Pr_{\rho_V}[\langle P^*,V\rangle(x)=1]\le\epsilon.$$

Include prover randomness if needed. IP soundness does not restrict the prover's computational power. In a public-coin execution, the verifier samples a fresh challenge **after** receiving message $a$. Conditional on the past transcript, its new coins remain fresh. The prover must respond and cannot rewrite that execution's past when the challenge is inconvenient.

With Fiat–Shamir, the prover computes $c=H(x,a)$ and can try many candidates before submitting a favorable one. The challenge conditioned on the finally selected $a$ need not be independent and uniform. Even in ROM, fresh oracle responses are uniform, but **the transcript selected for submission** need not be an unbiased sample. Interactive and non-interactive soundness are different probability experiments.

For intuition, suppose each fixed candidate has at most a $2^{-k}$ fraction of favorable challenges. Across $Q_H$ fresh oracle trials, a union bound gives at most $\min(1,Q_H2^{-k})$ for any favorable trial. With $k=20$ and roughly a million trials, this bound is no longer small. This is an illustration of search cost, not a universal soundness theorem for arbitrary protocols.

An unbounded prover cannot be restricted by computational search cost. Thus information-theoretic proof soundness does not automatically survive the transformation. Fiat–Shamir constructions typically analyze argument soundness against efficient adversaries, accounting for time and oracle queries.

### 4.6 Public-coin protocols are not the same starting point as arbitrary IP

Fiat–Shamir directly replaces public random challenges. General IP verifiers may keep private randomness and reveal only functions of it. Replacing that randomness with publicly recomputable hashes changes what the prover knows.

Goldwasser–Sipser showed a [transformation from private-coin to public-coin interactive proofs](https://www.cs.toronto.edu/tss/files/papers/goldwasser-Sipser.pdf). This transforms the protocol; it does not authorize replacing the original messages by hashes unchanged. Zero-knowledge, knowledge extraction, round complexity, and subsequent Fiat–Shamir soundness each require their own conditions.

Likewise, $\mathrm{IP}=\mathrm{PSPACE}$ does not imply safe, short non-interactive proofs for arbitrary PSPACE computations via Fiat–Shamir. It characterizes expressiveness with interaction and randomness. Succinctness, efficient proving, zero-knowledge, and secure non-interactive compilation are separate requirements.

### 4.7 Does the simulator have more power than the implementation? {#rom-simulation-limits}

Recall Schnorr's acceptance equation $g^z=aY^c$ for $Y=g^w$. Without knowing $w$, choose $c,z$ first and set $a=g^zY^{-c}$ to obtain an accepting transcript. This is the honest-verifier simulation idea. **Creating an accepting transcript differs from answering a challenge chosen after sending $a$.** This concerns knowledge of a witness, not merely language soundness for group membership.

After Fiat–Shamir, the transcript must additionally satisfy $c=H(x,a)$. In a programmable ROM, a simulator may arrange this by setting an as-yet-undefined oracle response. The proof must account for prior queries, consistency, and the difference from a real random-oracle distribution. This does not give a real prover permission to overwrite SHA-256 outputs.

Forking an adversary with changed oracle answers is instead an operation inside a knowledge-extraction reduction. It has a different purpose from zero-knowledge simulation. Neither is an implementation API for changing a hash function.

Research on [definitions of zero-knowledge in ROM](https://www.iacr.org/archive/asiacrypt2009/59120414/59120414.pdf) distinguishes these oracle-access and programming powers. Simulator existence does not imply that a real third party can produce accepting proofs under the same fixed public hash.

### 4.8 The barrier to non-interactive zero-knowledge without setup or oracles {#plain-model-nizk}

Consider a single-message non-interactive zero-knowledge system in the **plain model**, without a CRS, random oracle, prior key distribution, or similar resource. Under the usual definitions, languages admitting such systems lie in BPP. [Goldreich–Oren](https://www.wisdom.weizmann.ac.il/~oded/PSX/oren.pdf) study conditions making interaction necessary for nontrivial zero-knowledge.

Here is the intuition, using a formulation with a simulator $S$ that runs in polynomial time on all inputs. On input $x$, generate $\pi\leftarrow S(x)$ without a witness, then run the ordinary verifier $V(x,\pi)$.

- If $x\in L$, simulated and real proofs are indistinguishable. The efficient verifier is itself a distinguisher, so completeness implies high acceptance probability.
- If $x\notin L$, the simulator is just an efficient algorithm producing a proof. Soundness bounds its acceptance probability.

This decides membership in randomized polynomial time without a witness. For interactive protocols, a simulated transcript is not a live execution with a verifier choosing fresh coins, so the same argument does not apply directly.

ROM and CRS models change the simulator's resources: a programmable oracle, or a simulated reference string with trapdoor information. That is not the same experiment as a prover operating in a fixed real environment without these powers, so the BPP reasoning does not carry over unchanged.

Groth16's avoidance of ROM therefore does not mean it achieves non-interactive zero-knowledge without additional setup: it uses a CRS. **Standard model and plain model are not synonyms.** A construction can avoid ideal random oracles while assuming a CRS.

### 4.9 One-wayness and collision resistance do not close the gap

A concrete hash has a finite public description, such as code and a public key. An adversary may exploit that description. A random oracle is accessed through queries, without such a short usable implementation description. One-wayness or collision resistance alone may not exclude attacks exploiting particular input/output correlations.

Beyond CGH, Goldwasser–Kalai give [secure three-round public-coin identification schemes whose Fiat–Shamir signatures are insecure for every efficient function-ensemble instantiation](https://eccc.weizmann.ac.il/eccc-reports/2003/TR03-015/index.html). This does not say every Fiat–Shamir scheme is broken, nor that the same counterexample applies to all information-theoretically sound IPs. Keep the scheme class and security property in view.

The central question is which resources and assumptions replace the unpredictability and order enforced by interaction. For PLONK and STARK, specify the starting public-coin protocol, adversary's oracle access, simulator's powers, and setup conditions before assessing soundness, knowledge soundness, and zero-knowledge separately.


---

## Summary and next session

Today we studied a transformation removing interaction and the model used to analyze it. Review the procedure, model, and implementation separately.

- Fiat–Shamir replaces interactive challenges with hash outputs to obtain non-interactivity.
- ROM supports security proofs using an idealized hash function, with the forking lemma from Session 6 providing a concrete proof technique.
- CGH counterexamples show why a ROM proof cannot universally guarantee security after concrete instantiation.
- ROM remains useful in practice, but its role requires critical evaluation.

Session 10 concludes Act II with the PCP theorem and the IOP framework. We will bring together the complexity-theoretic background introduced so far, including IP = PSPACE and Cook–Levin, and discuss connections to hardness of approximation. This completes the toolkit needed to study concrete protocols in Act III.

---

## References and further reading

- Fiat and Shamir, [“How to Prove Yourself: Practical Solutions to Identification and Signature Problems,” CRYPTO 1986](https://link.springer.com/chapter/10.1007/3-540-47721-7_12) — the original paper; publisher's page. The proceedings were published in 1987.
- Bellare and Rogaway, [“Random Oracles are Practical: A Paradigm for Designing Efficient Protocols,” CCS 1993](https://web.cs.ucdavis.edu/~rogaway/papers/ro-abstract.html) — the ROM methodology; author's publication page with links to the paper.
- Canetti, Goldreich, and Halevi, [“The Random Oracle Methodology, Revisited,” JACM 2004](https://eprint.iacr.org/1998/011) — counterexamples demonstrating limitations of ROM; public IACR ePrint version with PDF, initially released in 1998.
- Pointcheval and Stern, [“Security Arguments for Digital Signatures and Blind Signatures,” Journal of Cryptology, 2000](https://link.springer.com/article/10.1007/s001450010003) — a developed formulation of the forking lemma; publisher's page. Revisit [Session 6](./session-06).

- Goldwasser, Sipser, [“Private Coins versus Public Coins in Interactive Proof Systems,” STOC 1986](https://www.cs.toronto.edu/tss/files/papers/goldwasser-Sipser.pdf)
- Goldreich, Oren, [“Definitions and Properties of Zero-Knowledge Proof Systems,” Journal of Cryptology 1994](https://www.wisdom.weizmann.ac.il/~oded/PSX/oren.pdf)
- Goldwasser, Kalai, [“On the (In)security of the Fiat-Shamir Paradigm,” 2003](https://eccc.weizmann.ac.il/eccc-reports/2003/TR03-015/index.html)
- Wee, [“Zero Knowledge in the Random Oracle Model, Revisited,” ASIACRYPT 2009](https://www.iacr.org/archive/asiacrypt2009/59120414/59120414.pdf)

## Suggested discussion questions

- Before introducing Fiat–Shamir, ask how randomness might be obtained without an online verifier, helping motivate the use of hashing.
- When presenting CGH, discuss the difference between a mathematical proof and security in a concrete implementation.
- Ask students which resources—ROM, a CRS, or interaction—a design uses, and which assumptions support its security and efficiency.
