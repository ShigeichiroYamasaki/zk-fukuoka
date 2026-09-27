---
outline: [2, 3]
---

# 1. Train a model and arithmetize inference

[Overview](./) · [Next: prove and verify](./02-proof)

## Separate training from inference

Training chooses weights from labeled examples. Inference applies those fixed weights to an input. We prove inference only.

Use all 256 pairs $x_0,x_1\in\{0,\ldots,15\}$, with the synthetic target “1 if the sum is at least 16, otherwise 0.” The task could be solved directly by addition; we deliberately train a model to illustrate moving learned coefficients into a circuit.

## Integer perceptron

Start at $w=(0,0),b=0$. Predict $\hat y=[w\cdot x+b\geq0]$, compute $\Delta=y-\hat y$, and update:

$$w_i\leftarrow w_i+\Delta x_i,\qquad b\leftarrow b+\Delta$$

`train.py` processes both coordinates in ascending order until an entire pass makes no updates. On pass 59 it confirms convergence:

$$w=(19,19),\qquad b=-296$$

```python
score = 19 * x[0] + 19 * x[1] - 296
label = int(score >= 0)
```

| Input | Score | Label |
| --- | ---: | ---: |
| (3,4) | −163 | 0 |
| (8,7) | −11 | 0 |
| (8,8) | 8 | 1 |
| (12,7) | 65 | 1 |

All 256 training examples match. This is not a held-out generalization measurement.

## Signed integers inside a finite field

Circom signals are field elements, not ordinary signed integers. First constrain each input to four bits. The score then lies in $[-296,274]$. Shift it:

$$u=\mathrm{score}+512=19x_0+19x_1+216$$

Now $216\leq u\leq786<1024$. The top bit of its ten-bit representation is 1 exactly when the score is nonnegative:

$$u=\sum_{i=0}^{9}2^i b_i,\quad b_i(b_i-1)=0,\quad y=b_9$$

The inputs also have four-bit decompositions. Bit generation is only a witness hint; boolean constraints and exact reconstruction enforce correctness. These small bounds prevent modular wraparound from changing the integer meaning.

## Limit public information

The main component declares no public inputs. `x[2]` is private and the sole output `label` is public. Do not add the score or bits as main outputs. Public model constants are fixed in the circuit and bound to the verification key.

If retraining changes the coefficients, update the circuit, range analysis and tests, then recompile and generate circuit-specific Groth16 keys again. The verifier must use the key for its approved model, not accept an arbitrary key supplied by a prover.

This model is trained using integers, so no floating-point quantization is needed. Neural networks require explicit scales, signed ranges, rounding, saturation and activation rules. Define the precise numerical computation before claiming to prove it.
