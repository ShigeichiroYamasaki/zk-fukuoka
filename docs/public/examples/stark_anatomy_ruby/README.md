# Ruby educational port: finite fields, Merkle trees, and FRI

Updated: November 20, 2026

This is an original, standard-library-only Ruby teaching implementation of the core finite-field, polynomial, Merkle commitment, and FRI ideas explained in [Anatomy of a STARK](https://aszepieniec.github.io/stark-anatomy/). It is not a line-by-line translation of the Python repository. The original project is Apache-2.0 licensed; the accompanying license file is retained with this educational adaptation.

From the repository root, run:

```sh
ruby docs/public/examples/stark_anatomy_ruby/demo.rb
```

The example checks the recurrence `s[i+1] = s[i]^2` over `F_17`, interpolates the four trace values, evaluates that polynomial on a larger domain, and proves/verifies FRI low-degree proximity using Merkle commitments and query openings.

## What this example does not establish

The AIR boundary and transition checks in `demo.rb` are performed directly by the example program. The FRI proof only establishes a low-degree property for a committed table; it does **not** bind the table to those AIR checks. This is therefore a component-level learning implementation, not a complete STARK, not a zero-knowledge proof, and not suitable for protecting real data or production use. A complete STARK also needs a protocol that binds the trace, constraint quotients, composition polynomial, public statement, Fiat–Shamir transcript, and FRI openings with a sound security analysis and appropriate masking where zero knowledge is required.

The small field and one query are deliberately insecure parameters chosen so learners can inspect every operation. The code is intended for reading and experimentation, not as a cryptographic library.

## Learning path through the code

1. `field.rb`: modular arithmetic and inverses in a prime field.
2. `polynomial.rb`: coefficient representation, evaluation, and Lagrange interpolation.
3. `merkle.rb`: commit to a table and authenticate one indexed value.
4. `fri.rb`: commit, derive a challenge, fold paired evaluations, open queries, and check the final degree bound.
5. `demo.rb`: connect a short execution trace to polynomial evaluation and then to the FRI component.

The mathematical structure follows the public educational explanation in Anatomy of a STARK. Its source code is available at [aszepieniec/stark-anatomy](https://github.com/aszepieniec/stark-anatomy/tree/master/code), licensed under Apache-2.0. This Ruby adaptation is independently written for the course and is not affiliated with the original author.
