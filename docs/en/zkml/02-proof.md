---
outline: [2, 3]
---

<script setup>
import { withBase } from 'vitepress'
</script>

# 2. Run private-input inference proofs

[Overview](./) · [Model and arithmetization](./01-model)

## Download and run

Use Python 3.8 or newer, a Node.js LTS environment and npm. Save these four files in one new exercise directory.

| File | Purpose |
| --- | --- |
| <a :href="withBase('/examples/zkml/train.py')" download>train.py</a> | Train and check all 256 examples |
| <a :href="withBase('/examples/zkml/classifier.circom')" download>classifier.circom</a> | Fixed public model, private input, public label |
| <a :href="withBase('/examples/zkml/package.json')" download>package.json</a> | circom2 0.2.22 and snarkjs 0.7.5 |
| <a :href="withBase('/examples/zkml/run.cjs')" download>run.cjs</a> | Compile, test, set up, prove and verify |

`circom2` is a WASM distribution of the compiler; this package version uses compiler 2.2.2. npm resolves transitive dependencies, so retain the generated `package-lock.json` with your results.

```sh
python3 train.py
npm install
npm run demo
```

Training writes `model.json`. The supplied circuit already contains these learned coefficients as constants; this is not an automatic compiler for arbitrary models.

## What the runner does

1. Compile the circuit to R1CS and witness-generation WASM.
2. Check all 256 outputs and reject four out-of-range inputs.
3. Generate local teaching Powers of Tau and circuit-specific Groth16 keys.
4. Prove and verify (12,7)→1 and (3,4)→0.
5. Flip each public label while retaining its proof and check rejection.

Every run creates a new `build-*` directory. This single-machine educational setup is not a production ceremony or an audited deployment.

```text
PASS: 256 circuit outputs and 4 out-of-range rejections
PASS: 2 Groth16 proofs; 2 changed-label rejections; public signals contain only label
Artifacts: .../build-...
```

## What the verifier receives

The verifier must already trust the approved model's `verification_key.json`. The prover sends `positive.proof.json` and `positive.public.json`; the latter contains only `["1"]`.

```sh
# Replace build-XXXXXX with the generated directory name.
npx --no-install snarkjs groth16 verify \
  build-XXXXXX/verification_key.json \
  build-XXXXXX/positive.public.json \
  build-XXXXXX/positive.proof.json
```

The sample inputs in `run.cjs` are published for teaching. Substitute your own data locally for a private experiment. Do not share raw inputs, witnesses or logs. The circuit and model may be shared; the entire build directory need not be distributed.

## Verified execution

The distributed code was run locally on September 27, 2026:

| Check | Result |
| --- | --- |
| Training | Weights (19,19), bias −296 |
| Arithmetization | All 256 outputs matched |
| Range | (−1,0), (16,0), (0,16), (0,−1) rejected |
| Groth16 | Proof generation and verification succeeded for both labels |
| Tampering | Both changed-label proofs rejected |

Functional tests do not experimentally prove zero knowledge. That property relies on the Groth16 construction, assumptions and appropriate setup.

## Extensions toward a real system {#next}

| Requirement | Additional design |
| --- | --- |
| Bind a particular input | Check $C=\mathrm{Com}(x;r)$ and inference in the same circuit. Use sufficient secret randomness: an unsalted hash of this tiny domain is brute-forceable |
| Authenticate the input | Verify an issuer or measurement signature, trusted origin, time and purpose. A commitment alone does not establish truth |
| Control reuse | Bind request ID and purpose to the proven relation; enforce expiry and reuse policy in the application |
| Real data and neural networks | Separate training and evaluation; check quantized accuracy and circuit equivalence. Consider EZKL with ONNX |
| Operate the system | Fix the model/key mapping, define updates, and measure proving time and memory |

First add an input commitment and test that a proof for another input cannot be substituted for the same record. Then increase model size and measure prover cost. These extensions are not implemented in the supplied code.

## Official resources

- [Circom](https://docs.circom.io/)
- [circom2 WASM distribution](https://github.com/antimatter15/circom)
- [snarkjs manual](https://github.com/iden3/snarkjs)
- [EZKL](https://docs.ezkl.xyz/): an extension option, not executed as part of this example.
