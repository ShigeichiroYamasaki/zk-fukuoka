# Session 13 exercise: STARK transparency and execution traces

Updated: November 20, 2026

[Session 13: STARK](../learn/session-13) · [Exercises index](./)

Check STARK trace constraints and the design tradeoff with transparent proofs. The runnable calculation example in this site uses Ruby by default.

### Try it

Over $\mathbb F_{17}$, start at $s_0=3$ and apply $s_{i+1}=s_i^2$ three times. Write the trace and separate transition constraints from boundary constraints. Compare KZG and FRI by setup, assumptions, and proof size.

### Check

The trace is $3,9,13,16$. Transitions check each adjacent squaring step; boundaries fix $s_0=3$ and $s_3=16$. KZG uses a trusted setup and pairing assumptions for short proofs. FRI uses transparent commitments based on cryptographic hash functions, typically with larger proofs and verification work.

### Check a folding calculation in Ruby {#ruby-folding}

Run the site's [Ruby FRI folding example](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/docs/public/examples/fri_folding.rb) from the repository root:

```sh
ruby docs/public/examples/fri_folding.rb
```

Over a small evaluation domain in $\mathbb F_{17}$, the code combines even- and odd-degree components and checks examples that do and do not satisfy the degree condition. It is educational arithmetic for following FRI folding, not a STARK implementation with Merkle trees, interaction, or cryptographic security. Anatomy of a STARK is an optional external reference for reading a separate implementation.

### Follow FRI commitments, queries and verification in Ruby {#ruby-fri}

The repository includes a [Ruby sample set](https://github.com/ShigeichiroYamasaki/zk-fukuoka/tree/main/docs/public/examples/stark_anatomy_ruby), rewritten for teaching from the finite-field, polynomial, Merkle-tree and FRI ideas explained in [Anatomy of a STARK](https://github.com/aszepieniec/stark-anatomy/tree/master/code). It is not a line-by-line translation; the small field makes each operation inspectable.

Run from the repository root:

```sh
ruby docs/public/examples/stark_anatomy_ruby/demo.rb
```

The code walks through field arithmetic, Lagrange interpolation, Merkle authentication paths, and FRI challenge derivation, folding, queries and the final degree check. The demo checks the trace's transition and boundary conditions directly. **The FRI proof is not bound to the trace or AIR constraints, so this is not a complete STARK proof and it does not provide zero knowledge.** The small field and one query are intentionally insecure teaching parameters. See the [sample README](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/docs/public/examples/stark_anatomy_ruby/README.md) for the file guide and scope.

