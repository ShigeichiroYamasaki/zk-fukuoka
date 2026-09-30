---
outline: [2, 3]
prev:
  text: Session 13 · STARK
  link: /en/learn/session-13
next:
  text: Session 15 · Future directions
  link: /en/learn/session-15
---

<script setup>

</script>

# Session 14: An integrated perspective — revisiting Acts I–III

**Author: Shigeichiro Yamasaki (山崎重一郎)**<br>
Created: September 27, 2026<br>
Last updated: September 27, 2026

[Sessions](./sessions) · [Topics](./topics) · [Session 14 in the syllabus](./#session-14) · [Session 14 exercises](../exercises/session-14)

## Context and learning objectives

We have read Groth16, PLONK, and STARKs separately. Today compare them by returning to Session 1’s questions. What ensures acceptance of true claims? Which assumptions prevent cheating? What hides witness information? **Reading constructions from their goals** reveals the roles of Act II’s tools.

The three learning objectives are:

1. Explain how Groth16, PLONK, and STARK meet the completeness, soundness, and zero-knowledge properties defined in Act I.
2. Map the cryptographic assumptions and complexity-theoretic results from Act II to their roles in each protocol.
3. Understand their design differences as **different optimization choices along the expressiveness and efficiency axes**, rather than merely performance comparisons.

We introduce few new concepts. The emphasis is on reconnecting earlier material. We compare Groth16, original KZG-based PLONK, and representative AIR/FRI-based STARKs. Derivatives can have different components and assumptions; a family name alone does not determine its properties.

---

## 1. Revisiting the properties from Act I

### 1.1 Completeness

First consider an honest prover following the procedure with a valid witness. All three systems require the verifier to accept with high probability: Session 1’s completeness. Different constructions share this starting goal.

### 1.2 Soundness: proof or argument?

Next consider an adversary trying to establish a false claim. Groth16, PLONK, and STARKs are arguments, providing guarantees against computationally bounded adversaries—the distinction in Session 1, Section 5.2. That classification alone does not identify their security premises. Use the table to separate the bases of each guarantee.

<div class="captioned-table" id="table-14-1" role="group" aria-labelledby="table-caption-14-1">

<p class="table-caption" id="table-caption-14-1"><strong>Table 14-1：Assumptions and components supporting protocol soundness</strong></p>

| Protocol | Main premises and components for reading its security analysis |
| --- | --- |
| Groth16 | Given correctly generated CRS parameters, the original paper proves knowledge soundness in the generic bilinear group model, not simply by reduction to q-SDH |
| KZG-based PLONK | Polynomial-IOP soundness, commitment security of KZG, and Fiat–Shamir analysis in the ROM; knowledge soundness also requires the applicable extraction conditions |
| AIR/FRI-based STARK | AIR constraint/consistency checks, FRI soundness, hash collision resistance for Merkle binding, and Fiat–Shamir analysis in the ROM |

</div>

This table guides the reading of security proofs; listing assumptions and models does not itself prove security. See the [Groth16 paper](https://iacr.org/archive/eurocrypt2016/96650272/96650272.pdf) and [Sessions 11](./session-11), [12](./session-12), and [13](./session-13) for the constructions.

Cook–Levin and circuit reductions from Session 4 provide theoretical background for representing general NP relations as constraints. Correctness of each arithmetization and cryptographic soundness still require their own arguments.

### 1.3 Zero knowledge

Does a mechanism for soundness also protect secrets? Keep the two properties separate. Zero-knowledge requires showing that the verifier’s information can be simulated without the witness. For each scheme, identify what is randomized and the model used for simulation.

- **Groth16:** Fresh prover randomness blinds the proof's group elements. The original paper establishes **perfect zero knowledge** (Session 11, Section 3.2).
- **PLONK:** Witness-encoding polynomials and the grand-product polynomial are randomized to prevent leakage through openings. Permutation-checking challenges have a different role from privacy-preserving blinding.
- **STARK:** A zero-knowledge construction needs masking compatible with degree bounds and constraints to prevent leakage from trace evaluations and other openings. Transparency and FRI alone do not guarantee zero knowledge.

### 1.4 Knowledge soundness and extractors

In Session 2, two accepting Schnorr transcripts sharing the first commitment but differing in challenge yielded the witness. Does exactly the same extraction work for general computation? When the target becomes a circuit assignment, the information used and extractor access vary by scheme.

Groth16's generic-group analysis, PLONK's polynomial-commitment construction, and STARK's coding-theoretic construction cannot all be described as generalizations of rewinding or the forking lemma. Identify what is extracted, which access the extractor has, and which assumptions it uses.

<span id="figure-14-1"></span>
<span id="caption-14-1"></span>

<div class="captioned-table" id="table-14-2" role="group" aria-labelledby="table-caption-14-2">

<p class="table-caption" id="table-caption-14-2"><strong>Table 14-2：Read security through four questions</strong></p>

| Property | Question to ask |
| --- | --- |
| Completeness | Does honest execution with a valid witness accept? |
| Soundness | Who can make a false statement accept, and with what probability? |
| Zero-knowledge | Can the view be simulated without the witness? |
| Knowledge soundness | Under what access and assumptions can a witness be extracted? |

</div>

For every construction, check the mechanisms and assumptions for each property separately. Establishing one property does not establish the others.

---

## 2. Revisiting Act II: a cross-protocol map

Now shift from properties to tools. Even the same finite fields and polynomials can serve different checks. In the table below, go beyond naming a tool: explain which proving or verification operation each entry represents.

<div class="captioned-table" id="table-14-3" role="group" aria-labelledby="table-caption-14-3">

<p class="table-caption" id="table-caption-14-3"><strong>Table 14-3：How Act II tools map to each protocol</strong></p>

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

</div>

Sharing tools does not make entire constructions equivalent. Groth16 and KZG-based PLONK both use pairings, but Groth16 does not incorporate KZG openings. In a STARK, Merkle trees fix tables while FRI checks low-degree proximity. Read across and down the table to check these different roles.

<span id="figure-14-2"></span>
<span id="caption-14-2"></span>

<div class="captioned-table" id="table-14-4" role="group" aria-labelledby="table-caption-14-4">

<p class="table-caption" id="table-caption-14-4"><strong>Table 14-4：Shared tools, different constructions</strong></p>

| Construction | Arithmetization | Checking tools | Non-interactivity |
| --- | --- | --- | --- |
| Groth16 | QAP | Circuit-specific keys and pairings | Directly in the CRS model |
| PLONK | PLONKish | KZG | Fiat–Shamir |
| STARK | AIR | Merkle + FRI | Fiat–Shamir |

</div>

Do not classify Groth16 as a KZG application or a Fiat–Shamir compilation. The table describes the representative constructions taught here.

---

## 3. Comparing design priorities using the two axes from Act I

All three systems can handle general NP relations. Does that make them interchangeable? Although similar on Session 2’s expressiveness axis, they differ in setup requirements, proof size, and proving and verification costs. Rather than reducing efficiency to one number, specify what should be made small.

Fix groups and security parameters when considering scaling with circuit or trace size. Account separately for public-input processing.

<div class="captioned-table" id="table-14-5" role="group" aria-labelledby="table-caption-14-5">

<p class="table-caption" id="table-caption-14-5"><strong>Table 14-5：Comparing Groth16, KZG-based PLONK and AIR/FRI-based STARK</strong></p>

| Property | Groth16 | KZG-based PLONK | AIR/FRI-based STARK |
| --- | --- | --- | --- |
| Proof size | Three group elements | Constant numbers of group and field elements | Includes queried values and Merkle paths; polylogarithmic in representative constructions |
| Verification cost | Public-input processing plus constant pairing count | Public-input processing plus verification of constant numbers of openings and related checks | Queries, authentication paths, and FRI checks; polylogarithmic for representative constructions with fixed parameters |
| Setup | Circuit-specific keys and trusted setup | Universal, updatable SRS plus circuit-specific public preprocessing | No secret trapdoor required |
| Post-quantum security | Not secure against sufficiently large quantum computers | Not secure against sufficiently large quantum computers | Requires suitable hashes, parameters, and security analysis in a quantum model |
| Assessing prover cost | Measure QAP processing, group operations, and related work | Measure polynomial processing, commitments, and related work | Measure trace processing, low-degree extension, hashing, FRI, and related work |

</div>

STARK costs depend on query counts and authentication paths, not just FRI rounds. Prover speed depends on circuits, trace width, implementation, hardware, memory, and security parameters; this table establishes no universal speed ranking. Hashing alone does not establish post-quantum security of a non-interactive STARK (Session 13, Section 4.2).

**State the requirements before selecting a scheme.** Identify whom the setup may trust, the security needed, and whether communication or computation is the limiting resource. In the exercises, justify choices using measurements made under aligned conditions.

---

## 4. Exercise: simulating design decisions

Imagine choosing a scheme for each situation below. Give more than its name: explain the priority, the cost you accept, and any information still needed to make the decision.

- On-chain verification cost must be minimized under a strict gas budget.
- New applications must be released frequently, without time to repeat trusted setup for each circuit.
- Long-term security against future practical quantum computers is the highest priority.
- Prover resources are limited, but large computations must be proved efficiently.

If groups reach different conclusions, compare their premises first. One may prioritize verification cost, another setup or long-term security. Asking which changed condition would change the decision is a practical way to understand the tradeoffs.

<span id="figure-14-3"></span>
<span id="caption-14-3"></span>

<div class="captioned-table" id="table-14-6" role="group" aria-labelledby="table-caption-14-6">

<p class="table-caption" id="table-caption-14-6"><strong>Table 14-6：Fix evaluation conditions before choosing a system</strong></p>

| Step / stage | Explanation |
| --- | --- |
| 1. Set requirements | Is a secret setup acceptable? Which security properties are required? |
| 2. Identify constraints | Which of proving time, verification time, communication or memory is limiting? |
| 3. Measure under matched conditions | Match circuit, hardware, public inputs and security parameters. |
| 4. Choose with evidence | Explain the improvement and the costs or assumptions accepted. |

</div>

There is no universal ranking. Compare end-to-end costs for the same computation and security conditions.

---

## Summary and next session

Today we compared three systems through goals, tools, and conditions. Be ready to explain a choice in terms of its requirements rather than just a scheme name.

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
