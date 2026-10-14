# Ruby examples: tests

Run the integration suite from the repository root:

```sh
ruby test/ruby/test_examples.rb
```

The suite uses Ruby's standard-library Minitest and launches each distributed script as a separate process. It checks:

- all 4,096 bounded inputs against the R1CS, QAP and AIR examples, plus altered assignments and wraparound rejection;
- the FRI folding arithmetic examples and their stated limitations;
- the rollup ledger's conservation, range, replay, Merkle and failure-atomicity tests;
- the ZKML training output over all 256 synthetic input pairs;
- the STARK byte-accounting model against explicit tree traversal and the generated CSV.

The ZKML model and STARK CSV are written into temporary directories during tests. The suite validates these educational models; it does not prove cryptographic security, zero knowledge, or production readiness.
