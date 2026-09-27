---
outline: [2, 3]
prev:
  text: Session 13 · STARK
  link: /en/learn/session-13
next:
  text: Session 15 · Future directions
  link: /en/learn/session-15
---

# Session 14: An integrated perspective — revisiting Acts I–III

[Sessions](./sessions) · [Topics](./topics) · [Session 14 in the syllabus](./#session-14) · [Exercises](../exercises/)

## Context and learning objectives

Across the previous thirteen sessions, we have covered Act I (Purpose and motivation), Act II (Tools), and the main protocols of Act III (Integration). In this penultimate session, we organize Groth16, PLONK, and STARK side by side, showing **where and how each protocol answers the questions from Act I using the tools from Act II**.

The three learning objectives are:

1. Explain how Groth16, PLONK, and STARK meet the completeness, soundness, and zero-knowledge properties defined in Act I.
2. Map the cryptographic assumptions and complexity-theoretic results from Act II to their roles in each protocol.
3. Understand their design differences as **different optimization choices along the expressiveness and efficiency axes**, rather than merely performance comparisons.

We introduce few new concepts. The emphasis is on reconnecting earlier material. We compare Groth16, original KZG-based PLONK, and representative AIR/FRI-based STARKs. Derivatives can have different components and assumptions; a family name alone does not determine its properties.

---

## 1. Revisiting the properties from Act I

### 1.1 Completeness

In all three protocols, an honest prover with a correct witness is accepted with certainty or overwhelming probability, according to the completeness guarantee. This is the fundamental property defined in Session 1; it does not create an essential distinction among the three here.

### 1.2 Soundness: proof or argument?

Recall the proof/argument distinction from Session 1. Groth16, PLONK, and STARK are all **arguments**, assuming computationally bounded provers (Session 1, Section 4.2). None retains its full soundness guarantee against an unbounded prover. The types of assumptions underlying soundness differ substantially:

| Protocol | Main premises and components for reading its security analysis |
| --- | --- |
| Groth16 | Given correctly generated CRS parameters, the original paper proves knowledge soundness in the generic bilinear group model, not simply by reduction to q-SDH |
| KZG-based PLONK | Polynomial-IOP soundness, commitment security of KZG, and Fiat–Shamir analysis in the ROM; knowledge soundness also requires the applicable extraction conditions |
| AIR/FRI-based STARK | AIR constraint/consistency checks, FRI soundness, hash collision resistance for Merkle binding, and Fiat–Shamir analysis in the ROM |

This table guides the reading of security proofs; listing assumptions and models does not itself prove security. See the [Groth16 paper](https://iacr.org/archive/eurocrypt2016/96650272/96650272.pdf) and [Sessions 11](./session-11), [12](./session-12), and [13](./session-13) for the constructions.

Cook–Levin and circuit reductions from Session 4 provide theoretical background for representing general NP relations as constraints. Correctness of each arithmetization and cryptographic soundness still require their own arguments.

### 1.3 Zero knowledge

The three families should not be assigned one uniform level of zero knowledge. Check the construction, model, and simulator establishing the property.

- **Groth16:** Fresh prover randomness blinds the proof's group elements. The original paper establishes **perfect zero knowledge** (Session 11, Section 3.2).
- **PLONK:** Witness-encoding polynomials and the grand-product polynomial are randomized to prevent leakage through openings. Permutation-checking challenges have a different role from privacy-preserving blinding.
- **STARK:** A zero-knowledge construction needs masking compatible with degree bounds and constraints to prevent leakage from trace evaluations and other openings. Transparency and FRI alone do not guarantee zero knowledge.

### 1.4 Knowledge soundness and extractors

For Schnorr in Session 2, two accepting transcripts sharing the first message but using distinct challenges yield a witness through linear algebra. For general-computation proof systems, extractors depend on the protocol and security model.

Groth16's generic-group analysis, PLONK's polynomial-commitment construction, and STARK's coding-theoretic construction cannot all be described as generalizations of rewinding or the forking lemma. Identify what is extracted, which access the extractor has, and which assumptions it uses.

---

## 2. Revisiting Act II: a cross-protocol map

The following table maps the tools we studied to their roles in each protocol.

| Tool (session) | Groth16 | PLONK | STARK |
| --- | --- | --- | --- |
| Finite fields, polynomials, Schwartz–Zippel (3) | Foundation for polynomial identity reasoning at QAP evaluation points | Foundation for gate and permutation polynomial checks | Foundation for aggregating constraints with random linear combinations |
| Arithmetization: R1CS/QAP/AIR (4) | QAP | PLONKish arithmetization with selectors | AIR execution traces |
| Error-correcting codes (5) | Not used directly | Not used directly | Encode trace polynomials as Reed–Solomon codewords |
| FRI and soundness amplification (6) | Not used directly | Not used in original KZG-based PLONK | Core low-degree testing component |
| Elliptic curves and pairings (7) | Central to the verification equation | Foundation for KZG commitments | Not used directly |
| Polynomial commitments (8) | Direct QAP-and-pairing construction; does not use KZG as a component | KZG | FRI-based commitments |
| Fiat–Shamir and ROM (9) | Not used: directly non-interactive in the CRS model | Used | Used |
| PCP/IOP (10) | Theoretical background | Explicit IOP design framework | Explicit IOP design framework |

The table highlights how **each protocol selects a different combination from the same Act II toolbox**. Groth16 and KZG-based PLONK share pairings, but Groth16 is not a KZG-based system. Commitment choices can be compared between PLONK and STARK, distinguishing Merkle binding from FRI low-degree proximity in STARKs.

---

## 3. Comparing design priorities using the two axes from Act I

Recall the expressiveness × efficiency matrix from Session 2. All three protocols support general NP relations. Their differences lie in **which aspects of efficiency they prioritize**.

Fix groups and security parameters when considering scaling with circuit or trace size. Account separately for public-input processing.

| Property | Groth16 | KZG-based PLONK | AIR/FRI-based STARK |
| --- | --- | --- | --- |
| Proof size | Three group elements | Constant numbers of group and field elements | Includes queried values and Merkle paths; polylogarithmic in representative constructions |
| Verification cost | Public-input processing plus constant pairing count | Public-input processing plus verification of constant numbers of openings and related checks | Queries, authentication paths, and FRI checks; polylogarithmic for representative constructions with fixed parameters |
| Setup | Circuit-specific keys and trusted setup | Universal, updatable SRS plus circuit-specific public preprocessing | No secret trapdoor required |
| Post-quantum security | Not secure against sufficiently large quantum computers | Not secure against sufficiently large quantum computers | Requires suitable hashes, parameters, and security analysis in a quantum model |
| Assessing prover cost | Measure QAP processing, group operations, and related work | Measure polynomial processing, commitments, and related work | Measure trace processing, low-degree extension, hashing, FRI, and related work |

STARK costs depend on query counts and authentication paths, not just FRI rounds. Prover speed depends on circuits, trace width, implementation, hardware, memory, and security parameters; this table establishes no universal speed ranking. Hashing alone does not establish post-quantum security of a non-interactive STARK (Session 13, Section 4.2).

**Choose according to setup trust, required security, proof size, and computing resources, rather than declaring one system universally superior.** Exercise decisions should use measurements for the same computation and security conditions.

---

## 4. Exercise: simulating design decisions

Present the following scenarios and ask students to select a protocol and justify their choice:

- On-chain verification cost must be minimized under a strict gas budget.
- New applications must be released frequently, without time to repeat trusted setup for each circuit.
- Long-term security against future practical quantum computers is the highest priority.
- Prover resources are limited, but large computations must be proved efficiently.

The aim is to go beyond recalling facts and develop the ability to **apply the course’s tradeoff structure to practical decisions**.

---

## Summary and next session

Today we:

- Compared how the three protocols satisfy completeness, soundness, and zero knowledge from Act I.
- Mapped the selective combinations of tools from Act II in each protocol.
- Connected different performance profiles to different priorities within the efficiency axis of the Act I matrix.

The final session (Session 15) introduces recursive SNARKs, folding schemes, and emerging GKR/sumcheck-based approaches. We will use the two-axis matrix to discuss the directions pursued by current research.

---

## References and further reading

- Groth, [“On the Size of Pairing-based Non-interactive Arguments,”](https://eprint.iacr.org/2016/260) EUROCRYPT 2016 (Groth16 construction, security, and efficiency; public PDF).
- Gabizon, Williamson, Ciobotaru, [“PLONK: Permutations over Lagrange-bases for Oecumenical Noninteractive arguments of Knowledge,”](https://eprint.iacr.org/2019/953) 2019 (universal and updatable SRS, arithmetization, and permutation arguments; public PDF).
- Ben-Sasson, Bentov, Horesh, Riabzev, [“Scalable, transparent, and post-quantum secure computational integrity,”](https://eprint.iacr.org/2018/046) 2018 (STARK transparency and coding-based construction; public PDF).

[Groth16 implementations and manuals](../exercises/#groth16) · [PLONK implementations and manuals](../exercises/#plonk) · [STARK implementations and manuals](../exercises/#stark)

## Suggested classroom questions

- Hand out Section 2’s map with empty cells and ask students to fill it using earlier lecture notes as an active review exercise.
- Discuss protocol-selection scenarios in groups, then compare the reasoning of groups that reach different conclusions to deepen understanding of tradeoffs.
- Ask how a new requirement, such as acceleration on particular hardware, might change the comparison table and motivate the next session’s advanced topics.
