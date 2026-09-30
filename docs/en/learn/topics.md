# Topic index

88 topics extracted from the current text of Sessions 1–15, organized into 11 subject areas. Each session link opens the relevant section, so you can follow a concept from its definition to its applications and comparisons.

Updated: September 27, 2026

[New to the subject? Start with prerequisites and supplementary resources.](./foundations)


[Browse by session](./sessions) · [Read the syllabus](./) · [Exercises and tools](../exercises/)

- [Proof foundations & security definitions](#proofs)
- [Finite fields, polynomials & arithmetization](#algebra)
- [Complexity theory, PCPs & IOPs](#complexity)
- [Error-correcting codes & information theory](#coding)
- [FRI, soundness analysis & proof techniques](#fri)
- [Elliptic curves, pairings & hardness assumptions](#curves)
- [Commitments & non-interactive proofs](#commitments)
- [Setup, transparency & implementing zero-knowledge](#setup)
- [Protocols & design comparisons](#protocols)
- [Recursion, folding & further directions](#research)
- [Ethereum, zkEVMs & execution proofs](#ethereum)

[Applied course: build an ERC-20 transfer ZK rollup](../rollup/) - six development stages and runnable starter models.

[Applied course: private-input ZKML inference](../zkml/) — [Runnable code and manual](../zkml/02-proof).

## Proof foundations & security definitions {#proofs}

| Topic | Lecture sections |
| --- | --- |
| Sets, membership, strings, languages and x ∈ L | [Prerequisite explanation](./terms/sets-and-languages) / [Session 1](./session-01) |
| NP verifiers, witnesses and NP relations | [Session 1 §1.1](./session-01#_1-1-the-np-verifier-paradigm) / [Session 2 §4.2](./session-02#_4-2-general-witnesses-when-that-structure-is-absent) / [Explanation](./terms/np-relations) |
| Interactive proofs, provers and verifiers | [Session 1 §4](./session-01#_4-the-convergence-of-the-two-motivations) / [Session 1 §5](./session-01#_5-a-formal-definition-of-interactive-proof-systems) |
| Password authentication and graph isomorphism (motivating examples) | [Session 1 §3.2](./session-01#_3-2-building-intuition-with-examples) |
| Completeness | [Session 1 §5.1](./session-01#_5-1-completeness-and-soundness) / [Session 14 §1.1](./session-14#_1-1-completeness) |
| Soundness; proofs versus arguments | [Session 1 §5.2](./session-01#_5-2-proof-vs-argument) / [Session 14 §1.2](./session-14#_1-2-soundness-proof-or-argument) |
| Zero-knowledge and the simulator paradigm | [Session 2 §2.1](./session-02#_2-1-the-central-idea) / [Session 2 §2.2](./session-02#_2-2-a-formal-definition) |
| Perfect, statistical and computational zero-knowledge; indistinguishability | [Session 2 §2.2](./session-02#_2-2-a-formal-definition) / [Session 14 §1.3](./session-14#_1-3-zero-knowledge) |
| Honest-verifier simulation | [Session 2 §2.3](./session-02#_2-3-checking-the-intuition) |
| Knowledge soundness, knowledge extraction and extractors | [Session 2 §3.2](./session-02#_3-2-the-concept-of-an-extractor) / [Session 2 §4.4](./session-02#_4-4-the-increasing-difficulty-of-knowledge-extraction) / [Session 14 §1.4](./session-14#_1-4-knowledge-soundness-and-extractors) |
| Schnorr, Sigma protocols and extraction from two accepting transcripts | [Session 2 §4.1](./session-02#_4-1-simple-witnesses-proofs-built-on-structure) / [Session 6 §4.1](./session-06#_4-1-the-idea-of-rewinding) |
| Generalizing witnesses and the motivation for arithmetization | [Session 2 §4.2](./session-02#_4-2-general-witnesses-when-that-structure-is-absent) |
| Expressiveness, succinctness and non-interactivity | [Session 2 §4.3](./session-02#_4-3-how-efficiency-requirements-change) / [Session 2 §5](./session-02#_5-organizing-the-landscape-in-a-two-axis-matrix) |

## Finite fields, polynomials & arithmetization {#algebra}

| Topic | Lecture sections |
| --- | --- |
| Finite fields and extension fields | [Session 3 §2.1](./session-03#_2-1-what-is-a-finite-field) / [Session 3 §2.2](./session-03#_2-2-a-brief-mention-of-extension-fields) |
| Cyclic groups, multiplicative subgroups and prerequisites for NTTs | [Session 3 §2.3](./session-03#_2-3-the-structure-of-the-multiplicative-group) / [Session 13 §4.3](./session-13#_4-3-prover-computation-cost) |
| Polynomial rings, division and root bounds | [Session 3 §3.1](./session-03#_3-1-definitions-and-basic-operations) / [Session 3 §3.2](./session-03#_3-2-the-basic-theorem-on-the-number-of-roots) |
| Lagrange interpolation; coefficient and evaluation representations | [Session 3 §3.3](./session-03#_3-3-lagrange-interpolation) / [Session 4 §4.1](./session-04#_4-1-from-r1cs-to-qap) |
| Schwartz–Zippel lemma and polynomial identity testing (PIT) | [Session 3 §4.2](./session-03#_4-2-statement-of-the-lemma-the-multivariate-version) / [Session 3 §4.3](./session-03#_4-3-what-the-lemma-tells-us) / [Session 3 §4.4](./session-03#_4-4-the-complexity-theoretic-significance) |
| Arithmetization: translating computations into constraints | [Session 4 §1](./session-04#_1-what-is-arithmetization-—-revisiting-the-motivation) / [Session 4 §3.2](./session-04#_3-2-why-rank-1-a-concrete-example) / [Explanation](./terms/constraints) |
| R1CS, public inputs, intermediate variables and worked constraints | [Session 4 §3.1](./session-04#_3-1-definition) / [Session 4 §3.3](./session-04#_3-3-a-worked-exercise) / [Explanation](./terms/linear-algebra) |
| Dot products, outer products, rank one and R1CS checking cost | [Linear algebra and the bridge to QAP](./session-04#r1cs-linear-algebra) |
| QAP interpolation and quotient bounds / AIR transition and boundary quotients | [QAP calculation](./session-04#qap-worked-math) / [AIR calculation](./session-04#air-worked-math) |
| QAPs, vanishing polynomials and divisibility | [Session 4 §4.1](./session-04#_4-1-from-r1cs-to-qap) / [Session 11 §1](./session-11#_1-revisiting-the-starting-point-the-qap-equation) / [Explanation](./terms/polynomials) |
| AIR, execution traces, transition and boundary constraints | [Session 4 §5.1](./session-04#_5-1-a-different-starting-point-from-r1cs-qap) / [Session 4 §5.2](./session-04#_5-2-transition-and-boundary-constraints) / [Session 13 §2](./session-13#_2-revisiting-air-arithmetization) / [Explanation](./terms/execution-traces) |
| PLONKish arithmetization, selectors and public-input constraints | [Session 12 §2.1](./session-12#_2-1-how-the-approach-differs-from-qaps) / [Session 12 §2.2](./session-12#_2-2-the-basic-constraint) |
| Copy constraints, permutation arguments and position labels | [Session 12 §3.1](./session-12#_3-1-why-it-is-needed-consistent-wiring) / [Session 12 §3.2](./session-12#_3-2-the-idea-behind-the-permutation-argument) |
| Custom gates; trade-offs in constraint degree and column count | [Session 12 §4.1](./session-12#_4-1-motivation-making-common-patterns-more-efficient) / [Session 12 §4.2](./session-12#_4-2-expressiveness-and-efficiency) |

[Supplement · Finite-field calculations](./finite-fields-tutorial)

## Complexity theory, PCPs & IOPs {#complexity}

| Topic | Lecture sections |
| --- | --- |
| Arthur–Merlin, public coins and round counts | [Session 1 §2.1](./session-01#_2-1-arthur–merlin-games) |
| IP = PSPACE | [Session 1 §2.2](./session-01#_2-2-ip-pspace-presenting-the-result) / [Session 15 §3.1](./session-15#_3-1-revisiting-the-sumcheck-protocol) |
| Cook–Levin, SAT, CircuitSAT and NP-completeness | [Session 4 §2.1](./session-04#_2-1-why-this-theorem-underpins-arithmetization) / [Explanation](./terms/reductions) / [Circuits](./terms/circuits) |
| NC, P, P/poly and circuit uniformity | [Session 4 §2.2](./session-04#_2-2-connections-to-circuit-complexity-classes) / [Explanation](./terms/complexity) |
| Randomized PIT algorithms and one-sided error | [Session 3 §4.4](./session-03#_4-4-the-complexity-theoretic-significance) |
| The PCP theorem and verification with few queries | [Session 10 §1.1](./session-10#_1-1-what-is-a-pcp) / [Session 10 §1.2](./session-10#_1-2-statement-of-the-pcp-theorem) |
| Hardness of approximation and connections to MAX-3SAT | [Session 10 §2.1](./session-10#_2-1-why-does-the-pcp-theorem-connect-to-approximation-algorithms) |
| Access models for PCPs, IPs and IOPs | [Session 10 §3.1](./session-10#_3-1-definition-of-an-iop) |
| Polynomial IOPs, commitments and non-interactive compilation | [Session 10 §3.2](./session-10#_3-2-revisiting-earlier-techniques-in-the-language-of-iops) / [Session 12 §5](./session-12#_5-revisiting-the-map-from-session-10) / [Session 13 §5](./session-13#_5-revisiting-the-map-from-session-10) |
| Choosing arithmetization and commitments | [Session 10 §3.3](./session-10#_3-3-restating-the-snark-stark-comparison) / [Session 14 §2](./session-14#_2-revisiting-act-ii-a-cross-protocol-map) |

## Error-correcting codes & information theory {#coding}

| Topic | Lecture sections |
| --- | --- |
| Reed–Solomon codes, codewords and encoding | [Session 5 §2.1](./session-05#_2-1-definition) |
| Minimum distance, unique decoding and error correction | [Session 5 §2.2](./session-05#_2-2-minimum-distance) / [Session 5 §2.3](./session-05#_2-3-error-correcting-capability) |
| The Singleton bound and MDS codes | [Session 5 §2.3](./session-05#_2-3-error-correcting-capability) |
| Shannon and Hamming bounds; stochastic versus worst-case errors | [Session 5 §3.1](./session-05#_3-1-two-different-error-models) / [Session 5 §3.2](./session-05#_3-2-why-this-distinction-matters-for-proof-systems) |
| List decoding, the Johnson bound and Guruswami–Sudan | [Session 5 §4.1](./session-05#_4-1-the-limit-of-unique-decoding) / [Session 5 §4.2](./session-05#_4-2-why-this-concept-matters-a-preview) |
| Code rate, distance and parameter choices | [Session 5 §5](./session-05#_5-exercises-minimum-distance-and-parameter-design) |

## FRI, soundness analysis & proof techniques {#fri}

| Topic | Lecture sections |
| --- | --- |
| Low-degree testing, proximity and IOPPs | [Session 6 §1.1](./session-06#_1-1-problem-statement) / [Session 6 §1.2](./session-06#_1-2-why-is-it-difficult) / [Session 10 §3.2](./session-10#_3-2-revisiting-earlier-techniques-in-the-language-of-iops) |
| FRI, even–odd decomposition and recursive folding | [Session 6 §2.1](./session-06#_2-1-the-basic-idea-fold-the-degree-in-half) |
| Commit and query phases; query costs | [Session 6 §2.2](./session-06#_2-2-recursive-folding-and-the-commit-and-query-phases) / [Session 13 §3.2](./session-13#_3-2-verification-cost-and-proof-size) |
| Soundness error and code parameters | [Session 6 §2.3](./session-06#_2-3-why-the-claim-is-approximate) / [Session 5 §4.2](./session-05#_4-2-why-this-concept-matters-a-preview) |
| Soundness amplification; sequential and parallel repetition | [Session 6 §3.1](./session-06#_3-1-why-amplification-is-necessary) / [Session 6 §3.2](./session-06#_3-2-parallel-and-sequential-repetition) |
| Rewinding | [Session 6 §4.1](./session-06#_4-1-the-idea-of-rewinding) |
| The forking lemma and extraction in non-interactive proofs | [Session 6 §4.2](./session-06#_4-2-the-forking-lemma) / [Session 9 §3.2](./session-09#_3-2-the-structure-of-a-security-proof-in-rom) |

## Elliptic curves, pairings & hardness assumptions {#curves}

| Topic | Lecture sections |
| --- | --- |
| Elliptic curves, the point at infinity and group structure | [Session 7 §1.1](./session-07#_1-1-definition) / [Session 7 §1.2](./session-07#_1-2-group-structure) |
| Discrete logarithms (DL) and why elliptic curves are used | [Session 7 §1.3](./session-07#_1-3-why-use-elliptic-curves) / [Session 7 §3.2](./session-07#_3-2-the-discrete-logarithm-dl-assumption) |
| Bilinear pairings, non-degeneracy and checking multiplication | [Session 7 §2.1](./session-07#_2-1-definition) / [Session 7 §2.3](./session-07#_2-3-the-new-capability-provided-by-pairings) / [Session 11 §2.3](./session-11#_2-3-the-pairing-based-solution) |
| Coordinate/scalar fields, MSM and the Groth16 verification identity | [Groups and fields](./session-07#pairing-math) / [Derivation](./session-07#groth16-pairing-derivation) |
| Pairing-friendly curves, BN254 and BLS12-381 | [Session 7 §2.2](./session-07#_2-2-pairing-friendly-curves) |
| q-SDH and knowledge-of-exponent assumptions (KEA) | [Session 7 §3.3](./session-07#_3-3-moving-to-stronger-assumptions) / [Session 7 §3.4](./session-07#_3-4-what-the-distinction-between-standard-and-non-standard-assumptions-means) |
| Reductions; distinguishing assumptions and security models | [Session 7 §4.1](./session-07#_4-1-the-basic-idea) / [Session 7 §4.2](./session-07#_4-2-why-this-form-matters) / [Session 14 §1.2](./session-14#_1-2-soundness-proof-or-argument) |
| The generic bilinear group model and Groth16 security | [Session 11 §4.3](./session-11#_4-3-the-security-basis-the-generic-bilinear-group-model) |

## Commitments & non-interactive proofs {#commitments}

| Topic | Lecture sections |
| --- | --- |
| Commitments, binding and hiding | [Session 8 §1.2](./session-08#_1-2-formal-components) / [Session 8 §1.3](./session-08#_1-3-binding) / [Session 8 §1.4](./session-08#_1-4-hiding) |
| Polynomial commitments and evaluation openings | [Session 8 §1.5](./session-08#_1-5-extending-to-polynomial-commitments) |
| KZG commitments, quotient polynomials and pairing verification | [Session 8 §2.2](./session-08#_2-2-commitment) / [Session 8 §2.3](./session-08#_2-3-opening-and-verification-the-role-of-pairings) |
| KZG and FRI-based openings for the same polynomial | [KZG example](./session-08#kzg-worked-example) / [FRI-based example](./session-08#fri-pcs-worked-example) |
| KZG evaluation binding versus hiding | [Session 8 §2.4](./session-08#_2-4-security-foundations) |
| Merkle trees, authentication paths and collision resistance | [Session 8 §3.2](./session-08#_3-2-construction-outline) / [Session 8 §3.3](./session-08#_3-3-security-foundations) |
| FRI-based polynomial commitments and comparison with KZG | [Session 8 §3.2](./session-08#_3-2-construction-outline) / [Session 8 §4](./session-08#_4-comparing-kzg-and-fri-based-commitments) |
| The Fiat–Shamir transform, transcripts and challenges | [Session 9 §2.1](./session-09#_2-1-the-basic-idea) / [Session 9 §2.2](./session-09#_2-2-security-intuition) |
| The Random Oracle Model (ROM) and idealized hashing | [Session 9 §3.1](./session-09#_3-1-definition-of-the-model) / [Session 9 §3.2](./session-09#_3-2-the-structure-of-a-security-proof-in-rom) |
| IP ordering, public coins, ROM simulation and plain-model limits | [Role of interaction](./session-09#rom-interaction-limits) / [Simulator powers](./session-09#rom-simulation-limits) / [Plain-model NIZK](./session-09#plain-model-nizk) |
| ROM limitations and the Canetti–Goldreich–Halevi counterexample | [Session 9 §4.1](./session-09#_4-1-instantiating-rom-remains-a-heuristic) / [Session 9 §4.2](./session-09#_4-2-theoretical-counterexamples) / [Session 9 §4.3](./session-09#_4-3-why-rom-is-still-widely-used) |

## Setup, transparency & implementing zero-knowledge {#setup}

| Topic | Lecture sections |
| --- | --- |
| Trusted setup, SRSs and trapdoors | [Session 8 §2.1](./session-08#_2-1-setup) / [Session 11 §3.1](./session-11#_3-1-trusted-setup) / [Session 11 §4.1](./session-11#_4-1-revisiting-the-necessity) |
| MPC generation and circuit-specific setup | [Session 11 §3.1](./session-11#_3-1-trusted-setup) / [Session 11 §4.2](./session-11#_4-2-the-restriction-of-circuit-specific-setup) |
| Universal and updatable SRSs; circuit-specific verification keys | [Session 12 §1.2](./session-12#_1-2-desired-properties-universal-and-updatable) / [Session 12 §2.1](./session-12#_2-1-how-the-approach-differs-from-qaps) |
| Transparency and removing secret setup dependencies | [Session 13 §1.1](./session-13#_1-1-concerns-about-trusted-setup) / [Session 13 §1.2](./session-13#_1-2-defining-transparency) |
| Blinding, masking and implementing zero-knowledge | [Session 11 §3.2](./session-11#_3-2-proof-generation) / [Session 14 §1.3](./session-14#_1-3-zero-knowledge) |
| Post-quantum security, Shor and quantum-model analysis | [Session 13 §4.2](./session-13#_4-2-post-quantum-security) |

## Protocols & design comparisons {#protocols}

| Topic | Lecture sections |
| --- | --- |
| Groth16: a construction from QAPs and pairings | [Session 11 §1](./session-11#_1-revisiting-the-starting-point-the-qap-equation) / [Session 11 §3](./session-11#_3-an-outline-of-groth16) |
| Groth16's three group elements, verification equation and public-input costs | [Session 11 §3.2](./session-11#_3-2-proof-generation) / [Session 11 §3.3](./session-11#_3-3-verification) |
| Groth16 as a directly non-interactive construction in the CRS model | [Session 11 §5](./session-11#_5-revisiting-the-map-from-session-10) |
| PLONK: polynomial IOPs, KZG and Fiat–Shamir | [Session 12 §5](./session-12#_5-revisiting-the-map-from-session-10) |
| STARKs: AIR, low-degree extension, composition polynomials and consistency checks | [Session 13 §2.2](./session-13#_2-2-revisiting-and-extending-transition-and-boundary-constraints) / [Session 13 §3.1](./session-13#_3-1-outline-of-the-steps) |
| Comparing the tools and security of Groth16 / PLONK / STARK | [Session 14 §1.2](./session-14#_1-2-soundness-proof-or-argument) / [Session 14 §2](./session-14#_2-revisiting-act-ii-a-cross-protocol-map) |
| Comparing proof size, verifier cost and prover cost | [Session 13 §3.2](./session-13#_3-2-verification-cost-and-proof-size) / [Session 13 §4.3](./session-13#_4-3-prover-computation-cost) / [Session 14 §3](./session-14#_3-comparing-design-priorities-using-the-two-axes-from-act-i) |
| Choosing protocols from requirements; design exercises | [Session 14 §4](./session-14#_4-exercise-simulating-design-decisions) |

## Recursion, folding & further directions {#research}

| Topic | Lecture sections |
| --- | --- |
| Recursive proofs, composition and finite computation histories | [Session 15 §1.1](./session-15#_1-1-the-idea-verifying-a-proof-inside-a-proof) / [Session 15 §1.2](./session-15#_1-2-why-this-is-powerful) |
| Verifier circuits, non-native field arithmetic and elliptic-curve cycles | [Session 15 §1.3](./session-15#_1-3-technical-requirements-making-verification-amenable-to-recursion) |
| Folding schemes, Nova and relaxed R1CS | [Session 15 §2.1](./session-15#_2-1-practical-challenges-of-recursive-proofs) / [Session 15 §2.2](./session-15#_2-2-the-idea-folding-the-relations-to-be-verified) |
| Incrementally verifiable computation (IVC); folding versus compression | [Session 15 §2.2](./session-15#_2-2-the-idea-folding-the-relations-to-be-verified) / [Session 15 §2.3](./session-15#_2-3-where-this-approach-helps) |
| Sumcheck, sums of multivariate polynomials and the final evaluation check | [Session 15 §3.1](./session-15#_3-1-revisiting-the-sumcheck-protocol) |
| GKR, layered circuits and prover costs | [Session 15 §3.2](./session-15#_3-2-the-gkr-protocol) / [Session 15 §3.3](./session-15#gkr-cost) / [Session 15 §3.4](./session-15#_3-4-position-within-the-iop-framework) |
| Research through expressiveness, efficiency and composability | [Session 15 §4](./session-15#_4-a-research-map-expanding-the-two-axis-matrix) |

## Ethereum, zkEVMs & execution proofs {#ethereum}

These links refer to the lecture’s September 27, 2026 snapshot; distinguish research and proposals from mainnet activation.

| Topic | Lecture sections |
| --- | --- |
| zkEVMs, L2 ZK rollups and L1 execution proofs | [Session 15 §4.1](./session-15#ethereum-zkevm) |
| zkVM standards, interoperability, worst-case proving time and formal verification | [Session 15 §4.2](./session-15#_4-2-recent-directions-interoperability-and-security-alongside-speed) |
| EIP-8025, optional execution proofs and staged adoption | [Session 15 §4.3](./session-15#eip-8025) |
| Evaluating proving, aggregation and verification in applications | [Session 15 §4.4](./session-15#_4-4-connecting-the-application-to-the-course-s-research-map) |
