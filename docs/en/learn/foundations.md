# Prerequisites and supplementary resources for beginners

You do not need to master all of mathematics and cryptography before starting. Read Sessions 1–2 for the motivation, then return here when notation or terminology becomes an obstacle. These are suggested preparation targets for this course.

Updated: September 27, 2026

[Syllabus](./) · [Sessions](./sessions) · [Topic index](./topics) · [Exercises, tools and manuals](../exercises/)

[Session 4 term guide: NP relations, circuits, constraints and more](./terms/)

[Session 1 prerequisites: sets, membership and languages (x ∈ L)](./terms/sets-and-languages)

[Supplement: a minimal guide to languages and computation theory following Hopcroft and Ullman](./computation-theory)

## Where to start {#start}

1. **Before Session 1:** review algebraic expressions, sets, functions, logic and elementary probability. Try the [self-check](#check) and start with unfamiliar items.
2. **Around Sessions 3–4:** review modular arithmetic, inverses, polynomials, vectors and matrices. Begin with the [finite-field exercise](#finite-field).
3. **Alongside Sessions 5–10:** fill gaps in probability, codes, groups, hashes and computational complexity. Formal definitions and their applications to proof systems are introduced in the lectures.
4. **Before Sessions 11–15:** use the [topic index](./topics) to revisit QAP, AIR, FRI, pairings, commitments and Fiat–Shamir rather than starting another textbook from scratch.

Elliptic curves, pairings and the PCP theorem are course topics, not entry requirements. Blockchain and Ethereum background can be added when you reach the applications in Session 15. A programming environment is needed for implementation exercises, not to begin reading the lectures.

## Preparation targets {#prerequisites}

Check whether you can explain or calculate the following, rather than simply recognizing the names.

| Area | What to check | Relevant sessions | Support |
| --- | --- | --- | --- |
| Expressions and notation | Substitute values; read powers, logarithms and summation notation; distinguish variables and constants | [1](./session-01), [3](./session-03) | [Self-check](#check), [mathematics](#math-resources) |
| Sets, functions and logic | Explain membership, mappings, “for all,” “there exists,” and an implication versus its converse | [1](./session-01), [2](./session-02) | [Logic and proofs](#math-resources) |
| Probability | Read sample spaces, independence and conditional probability; calculate simple error probabilities | [1](./session-01), [3](./session-03), [6](./session-06), [9](./session-09) | [Discrete probability](#math-resources) |
| Integers and remainders | Understand primes, gcds and congruences; calculate modulo 7, including division by nonzero elements | [3](./session-03), [7](./session-07) | [Finite-field exercise](#finite-field), [number theory](#algebra-resources) |
| Polynomials | Distinguish degree, roots, coefficients and evaluations; expand and evaluate small examples | [3](./session-03)–[6](./session-06), [8](./session-08) | [Self-check](#check), [algebra](#algebra-resources) |
| Linear algebra | Compute a dot product and a matrix–vector product; check dimensions | [4](./session-04), [12](./session-12) | [Linear algebra](#linear-resources) |
| Algorithms and complexity | Explain inputs, outputs, loops, input size and the difference between O(n) and O(n²) | [1](./session-01), [4](./session-04), [10](./session-10), [15](./session-15) | [Bridge to proof systems](#proof-resources) |
| Coding and cryptography vocabulary | Distinguish bit strings and distance, hashing and encryption, public and secret information | [5](./session-05)–[9](./session-09) | [Codes and cryptography](#crypto-resources) |
| Implementation skills | Run a small program with variables, functions, arrays and branches; know where files and commands are located | Before implementation exercises | [Programming and Git](#practice-resources) |

## Supplementary resources: choose what to read

These resources are published by universities, authors or official projects. Their landing pages were checked on September 27, 2026. Chapter numbering may vary by edition; unless specified, look for the named subjects in the table of contents. Use advanced books as references for gaps, not mandatory cover-to-cover prerequisites. Japanese-language alternatives are listed first in each area; they are not necessarily translations of the English resources. Start with introductory material and consult advanced references as needed.

### Logic, proofs and discrete probability {#math-resources}

**Japanese-language starting points**

- Kuniaki Mukai (Keio University), notes on sets and logic: start with [notation](https://web.sfc.keio.ac.jp/~mukai/modular/notation.pdf), then [set operations](https://web.sfc.keio.ac.jp/~mukai/modular/basic-set-operation.pdf) and [functions](https://web.sfc.keio.ac.jp/~mukai/modular/function.pdf). **Japanese; free introductory PDFs**. Review quantifiers, implication, membership and mappings for Sessions 1–2.
- Masashi Katsurada (Meiji University), [Probability notes for first-year students](https://nalab.mind.meiji.ac.jp/~mk/lecture/kakuritsu/kakuritsu1998.pdf) — **Japanese; free introductory PDF**. Read Sections 1–5 on events, sets, addition, conditional probability, multiplication and independent trials for Sessions 3 and 6. Continuous distributions can wait.

**Further reading in English**

[MIT Mathematics for Computer Science: chapter readings](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) — **English; free PDFs**. Start with logic and proofs in Unit 1; use Unit 4 when probability is needed. Review quantifiers, counterexamples, induction, events and independence. The whole course is not required beforehand.

Return to Session 1 and explain the difference between “every input has a witness” and “one witness works for every input.”

### Integers, finite fields, polynomials and groups {#algebra-resources}

**Japanese-language starting point**

Kenta Kasai (Institute of Science Tokyo), [Algebraic Structures and Coding Theory: lecture materials](https://kasai.ict.eng.isct.ac.jp/代数系と符号理論に関する配布資料.pdf) — **Japanese; free university lecture PDF**. Begin with fields and prime-field arithmetic in Section 5, then try the modulo-7 exercise below. Consult polynomials, groups and extension fields alongside Sessions 3 and 7. Select the relevant parts rather than reading the entire document first.

**Further reading in English**

[Victor Shoup, A Computational Introduction to Number Theory and Algebra](https://shoup.net/ntb/) — **English; free PDF and exercises**. Start with divisibility, gcds and congruences. Consult rings, fields and polynomials for Session 3, and groups and cyclic groups for Session 7. Aim to calculate examples before following every proof.

Use the [modulo-7 exercise](#finite-field) to distinguish ordinary integer division from multiplication by a field inverse. You can return to extension-field constructions after reading Session 3.

### Vectors and matrices {#linear-resources}

**Japanese-language starting point**

Kyoto University OCW, [From Vectors to Matrices: What Is Linearity?](https://ocw.kyoto-u.ac.jp/course/427/) — **Japanese; free short videos, PDFs and solutions**. Designed for first-time learners of matrices. Start with representing points as vectors and forming linear combinations, then representing linear transformations as matrices and general matrix multiplication. Practise a matrix–vector product before R1CS in Session 4.

**Further reading in English**

[MIT OpenCourseWare: Linear Algebra](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) — **English; free videos and materials**. Select linear equations, matrix multiplication and elimination first. Small matrix–vector products and row-wise dot products are enough to begin reading R1CS; eigenvalues and singular value decomposition need not come first.

### Codes, hashing and cryptographic security {#crypto-resources}

**Japanese-language starting points**

- Kenta Kasai (Institute of Science Tokyo), [Algebraic Structures and Coding Theory: lecture materials](https://kasai.ict.eng.isct.ac.jp/代数系と符号理論に関する配布資料.pdf) — **Japanese; free PDF**. Select Hamming distance and minimum distance in Section 3 and the following error-correction discussion. Start by counting differing positions in two bit strings before Session 5.
- Eiichiro Fujisaki (JAIST), [Cryptography (6): One-way Functions, Pseudorandom Generators and Pseudorandom Functions (1)](https://www.jaist.ac.jp/~fujisaki/2019/I240-2019-6.pdf) — **Japanese; free PDF; advanced reference**. Begin with the terminology section on probabilistic algorithms and polynomial time as preparation for security arguments in Sessions 7–9. Following all proofs is not a prerequisite.

**Further reading in English**

[MIT Digital Communication Systems: readings](https://ocw.mit.edu/courses/6-02-introduction-to-eecs-ii-digital-communication-systems-fall-2012/pages/readings/) — **English; free chapter PDFs**. Select material on information, coding and error correction to review codewords and Hamming distance. The entire communications curriculum is not required; [Session 5](./session-05) connects RS codes to proof systems.

[Boneh and Shoup, A Graduate Course in Applied Cryptography](https://toc.cryptobook.us/) — **English; free PDF; advanced reference**. Look up hash functions, data integrity and cryptographic security definitions. This is graduate-level material: beginners should use it alongside [Session 7](./session-07) and [Session 8](./session-08), starting with specific definitions.

### A bridge from complexity to proof systems {#proof-resources}

**Japanese-language starting point**

Martin J. Dürst (Aoyama Gakuin University), [Data Structures and Algorithms, Lecture 4](https://www.sw.it.aoyama.ac.jp/2014/DA/lecture4.html) — **Japanese; free web lecture; introduction to complexity**. Select the sections on common orders, finding asymptotic complexity and counting operations with sums. Practise deriving O(n) and O(n²) from loops before Sessions 1, 4 and 10. The later stack and queue material is optional for this preparation.

**Further reading in English**

[Justin Thaler, Proofs, Arguments, and Zero-Knowledge](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html) — **English; free PDF and links to supplementary videos**. Start with mathematical and computational preliminaries, then interactive proofs, sumcheck and polynomial commitments. Use it as further reading for [Session 1](./session-01), [Session 10](./session-10) and [Session 15](./session-15), rather than a first textbook to finish before enrolling.

P, NP, PSPACE, the PCP theorem and IOPs are introduced in the course. The starting point is understanding the distinction between solving a problem and checking a supplied answer, and how costs depend on input size.

### Programming, Git and exercise environments {#practice-resources}

| Resource | Language and format | Start with |
| --- | --- | --- |
| [University of Tokyo: Introduction to Python Programming](https://utokyo-ipp.github.io/) | Japanese; free website | 1-1 arithmetic, 1-2 variables and functions, 1-3 branches, 2-2 lists; an entry point for learning programming |
| [Official Python tutorial](https://docs.python.org/3/tutorial/) | English; free website | Chapters 3–5: arithmetic, control flow and data structures; intended for people with programming experience |
| [Pro Git](https://git-scm.com/book/en/v2) | English; free web book | Getting Started and Git Basics; clone, status, diff and commit |
| [Site operation manuals](../exercises/manuals) | English | Installation and usage instructions for the exercise tool you choose |

Python is one option for checking small calculations. Groth16, PLONK and STARK implementation exercises use languages and environments appropriate to the selected tool. Browse [available tools](../exercises/tools) and the [exercise hub](../exercises/).

## Self-check: identify what to review {#check}

1. For `f(x) = x² + 1`, calculate `f(3)` and the sum of its values at `x = 0, 1, 2`.
2. Refute “every even number is a multiple of 4” with one counterexample.
3. Calculate the probability of three heads in three independent fair coin tosses.
4. Multiply the matrix `[[1, 2], [3, 4]]` by the column vector `[2, 1]`.
5. To establish `x² = y` for a secret `x` and public `y`, identify the public input, witness and relation.
6. Compare visiting each of n elements once with visiting every ordered pair of elements.

::: details Answers and review guidance
1. `f(3) = 10`; the sum is `1 + 2 + 5 = 8`. Review expressions and polynomial evaluation.
2. 2 is even but not a multiple of 4. Review universal statements and counterexamples.
3. `1/8`, using independence to multiply `1/2 × 1/2 × 1/2`. This does not mean error probabilities always multiply in repeated interactive protocols (Session 6).
4. The column vector `[4, 10]`, obtained from a dot product with each row.
5. Public input: `y`; witness: `x`; relation: `x² = y`. Also specify the domain, such as integers or a finite field. Identifying these components does not itself construct a zero-knowledge proof.
6. n versus n² basic operations, assuming constant work per element or pair. Review input size and complexity.
:::

## Calculate in a finite field {#finite-field}

In the field modulo the prime 7, values are represented by 0 through 6, using remainders on division by 7.

```text
5 + 4 = 2  (mod 7)
3 × 5 = 1  (mod 7)
```

The second equation shows that the inverse of 3 is 5. Zero has no multiplicative inverse. With a composite modulus, even a nonzero element can lack an inverse: modulo 8, no multiple of 2 has remainder 1. This is an introduction to finite fields, not a zero-knowledge proof.

### A small exercise

1. Calculate `6 + 6` and `4 × 5` modulo 7.
2. Find the inverse of 2 modulo 7.
3. For a claim involving secret x and public y, separately describe the public inputs, private inputs and relation.

::: details Answers to the calculations
`6 + 6 = 5` and `4 × 5 = 6`. The inverse of 2 is 4, since `2 × 4 = 1 mod 7`. For the third question, see self-check 5 and specify the domain and relation.
:::

## Think ahead

How could someone check a computation without receiving its secret input? Revisit the goals in [Session 1](./session-01) and [Session 2](./session-02), then continue to [Session 3](./session-03) when you are comfortable with the calculations.
