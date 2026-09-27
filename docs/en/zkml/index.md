---
outline: [2, 3]
---

# Applied course: verify private-input AI inference with ZKML

Updated: September 27, 2026

How can someone check an AI result without seeing the data used to compute it? In this working example, train a small classifier in Python, express its inference as a Circom circuit, and generate a Groth16 proof locally. The verifier receives the classification and proof; the input remains with the prover.

## The statement we prove

For a fixed public model $f$, private input $x$ and public label $y$:

$$\exists x\in\{0,\ldots,15\}^2:\quad y=f(x)$$

| Item | Visibility and scope |
| --- | --- |
| Weights and bias | Public constants fixed in the circuit |
| Input and intermediate values | Private witness |
| Classification | Public output, 0 or 1 |
| Proven computation | Inference using the trained model |
| Training and data provenance | Not proven |

::: info What this minimal example establishes
The prover can choose any input. There is no binding to an external measurement or user record. This example therefore does not establish eligibility or the truth of a real measurement. The [extension section](./02-proof#next) explains how commitments and signatures can supply additional guarantees.
:::

Zero knowledge does not hide information implied by the public label, including deductions from repeated results. A remote proving service would also see any raw inputs you send to it. This example generates proofs locally.

## Learning path

1. [Train and arithmetize the model](./01-model): an integer perceptron and a constrained sign test.
2. [Generate and verify proofs](./02-proof): downloadable code, successful verification, tampering and invalid-input tests.
3. [Extend toward an application](./02-proof#next): input authenticity, quantization and neural networks.

## Connections to the lectures

| Lecture | Application |
| --- | --- |
| [Session 2](../learn/session-02) | Public statements, private witnesses and zero knowledge |
| [Session 4](../learn/session-04) | Turning inference into R1CS |
| [Session 7](../learn/session-07) and [Session 11](../learn/session-11) | Pairings and Groth16 |
| [Session 15](../learn/session-15) | Prover costs for large computations |

The model is a linear classifier trained on synthetic data, small enough to enumerate every possible input. This is an implementation lesson, not evidence of predictive performance on real data.

## References

- [Circom signals](https://docs.circom.io/circom-language/signals/): main outputs are public, so copying a secret to an output exposes it.
- [snarkjs implementation and manual](https://github.com/iden3/snarkjs): setup, proving and verification.
- [EZKL documentation](https://docs.ezkl.xyz/) and [repository](https://github.com/zkonduit/ezkl): an extension route using ONNX models, separate from this Circom implementation.

[ERC-20 ZK rollup course](../rollup/) · [Exercises](../exercises/)
