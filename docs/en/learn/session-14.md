---
outline: [2, 3]
prev:
  text: Session 13 · STARK
  link: /en/learn/session-13
next:
  text: Session 15 · Future directions (syllabus)
  link: /en/learn/#session-15
---

# Session 14: An integrated perspective — revisiting Acts I–III

::: info Lecture manuscript
This is an English translation of the supplied Session 14 manuscript. Its comparison tables are retained, with editorial notes on security, zero knowledge, and performance, plus references.
:::

[Sessions](./sessions) · [Topics](./topics) · [Session 14 in the syllabus](./#session-14) · [Exercises](../exercises/)

## Context and learning objectives

Across the previous thirteen sessions, we have covered Act I (Purpose and motivation), Act II (Tools), and the main protocols of Act III (Integration). In this penultimate session, we organize Groth16, PLONK, and STARK side by side, showing **where and how each protocol answers the questions from Act I using the tools from Act II**.

The three learning objectives are:

1. Explain how Groth16, PLONK, and STARK meet the completeness, soundness, and zero-knowledge properties defined in Act I.
2. Map the cryptographic assumptions and complexity-theoretic results from Act II to their roles in each protocol.
3. Understand their design differences as **different optimization choices along the expressiveness and efficiency axes**, rather than merely performance comparisons.

We introduce few new concepts. The emphasis is on reorganizing and reconnecting the material from the first thirteen sessions.

---

## 1. Revisiting the properties from Act I

### 1.1 Completeness

In all three protocols, an honest prover with a correct witness is accepted with certainty or overwhelming probability, according to the completeness guarantee. This is the fundamental property defined in Session 1; it does not create an essential distinction among the three here.

### 1.2 Soundness: proof or argument?

Recall the proof/argument distinction from Session 1. Groth16, PLONK, and STARK are all **arguments**, assuming computationally bounded provers (Session 1, Section 4.2). None retains its full soundness guarantee against an unbounded prover. The types of assumptions underlying soundness differ substantially:

| Protocol | Soundness basis as summarized in the manuscript |
| --- | --- |
| Groth16 | Reduction to pairing-based hardness assumptions such as q-SDH (Session 7) |
| PLONK | Pairing-based assumptions through KZG binding (Session 8), plus permutation-argument soundness (Session 12) |
| STARK | Hash collision resistance and FRI soundness (Session 6), with quantitative analysis involving list-decoding parameters (Session 5) |

The Cook–Levin theorem from Session 4 provides common theoretical background for translating general NP statements into constraints and justifying arithmetization.

### 1.3 Zero knowledge

The supplied manuscript describes all three as achieving computational zero knowledge—the weakest of the three levels from Session 2, but sufficient for practical purposes. The mechanisms differ:

- Groth16 introduces random blinding terms during proof generation (Session 11, Section 3.2).
- PLONK similarly uses blinding, with randomness also present in the permutation argument.
- STARK uses random masking polynomials to prevent trace information from leaking through its commitments. Session 13 did not develop this in detail; implementations incorporate randomness into the relevant stages.

### 1.4 Knowledge soundness and extractors

Revisit knowledge soundness and extractors from Session 2. For a simple algebraic relation such as Schnorr, an extractor can recover the witness using linear algebra on two transcripts (Session 2, Section 4.1). For general computations in Groth16, PLONK, and STARK, extractor constructions are more sophisticated. The manuscript relates this to generalizations of rewinding and the forking lemma from Session 6. This increased complexity illustrates the qualitative difficulty associated with the loss of simple algebraic structure anticipated in Session 2.

---

::: info Editorial note: security foundations and levels of zero knowledge
The Groth16 entry in Section 1.2 needs correction: the original paper proves knowledge soundness in the generic bilinear group model, not by a simple reduction to q-SDH. It also establishes **perfect zero knowledge**, so Section 1.3 should not be read as assigning the same precise zero-knowledge level to all three constructions. See the [Groth16 paper](https://iacr.org/archive/eurocrypt2016/96650272/96650272.pdf).

Non-interactive PLONK and STARK also require Fiat–Shamir and ROM analysis beyond the entries in the table. A STARK implementation is not automatically zero knowledge; inspect the concrete masking construction. Random challenges for checking permutations have a different role from privacy-preserving blinding. Extractors do not all arise by generalizing rewinding or the forking lemma; their construction depends on the proof system and security model. See the notes in [Session 11](./session-11), [Session 12](./session-12), and [Session 13](./session-13).
:::

## 2. Revisiting Act II: a cross-protocol map

The following table maps the tools we studied to their roles in each protocol.

| Tool (session) | Groth16 | PLONK | STARK |
| --- | --- | --- | --- |
| Finite fields, polynomials, Schwartz–Zippel (3) | Foundation for polynomial identity reasoning at QAP evaluation points | Foundation for gate and permutation polynomial checks | Foundation for aggregating constraints with random linear combinations |
| Arithmetization: R1CS/QAP/AIR (4) | QAP | PLONKish arithmetization with selectors | AIR execution traces |
| Error-correcting codes (5) | Not used directly | Not used directly | Encode trace polynomials as Reed–Solomon codewords |
| FRI and soundness amplification (6) | Not used directly | Used in FRI-based derivatives | Core low-degree testing component |
| Elliptic curves and pairings (7) | Central to the verification equation | Foundation for KZG commitments | Not used directly |
| Polynomial commitments (8) | Described in the manuscript as implicit KZG integrated into verification | KZG | FRI-based commitments |
| Fiat–Shamir and ROM (9) | Not used: directly non-interactive through trusted setup | Used | Used |
| PCP/IOP (10) | Theoretical background | Explicit IOP design framework | Explicit IOP design framework |

The table highlights how **each protocol selects a different combination from the same Act II toolbox**. The division between pairing-based Groth16/PLONK and coding-based STARK runs through the commitment discussion from Session 8.

---

## 3. Comparing design priorities using the two axes from Act I

Recall the expressiveness × efficiency matrix from Session 2. All three protocols support general NP relations. Their differences lie in **which aspects of efficiency they prioritize**.

| Priority | Groth16 | PLONK | STARK |
| --- | --- | --- | --- |
| Proof size and verification speed | Highest priority; constant-size proof | High priority; constant-size proof, somewhat larger than Groth16 | Relatively less compact; described as logarithmic size |
| Setup flexibility | Low: circuit-specific | High: universal and updatable | Highest: no trusted setup |
| Long-term, post-quantum security | Low: relies on elliptic curves | Low: relies on elliptic curves | High: relies on hashes |
| Prover computation cost | Relatively high | Relatively high | Amenable to quasi-linear computation |

**The central point is not that one protocol is universally superior. Different constraints—acceptable setup trust, long-term security needs, or strict proof-size limits—lead to different choices.**

---

::: info Editorial note: how to read the comparison tables
The Groth16 polynomial-commitment entry is not an accurate component description. Groth16 directly combines QAPs and pairings; distinguish it from PLONK’s use of KZG as a component. Here, PLONK means the KZG-based construction and STARK means representative AIR/FRI-based constructions.

Section 3 describes design tendencies, not a general performance ranking. STARKs include Merkle authentication paths and generally have polylogarithmic costs. Groth16 and PLONK also incur public-input-dependent verification work. Prover speed depends on the circuit, implementation, hardware, and security parameters. Post-quantum claims require appropriate hash parameters and analysis of non-interactivity in a quantum model. Base exercise decisions on requirements and measurements under comparable conditions.
:::

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
