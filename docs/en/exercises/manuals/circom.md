---
outline: [2, 3]
prev:
  text: Basic operation manuals
  link: /en/exercises/manuals
next:
  text: snarkjs operation manual
  link: /en/exercises/manuals/snarkjs
---

# Circom Operation Manual

Updated: November 20, 2026

[Basic operation manuals](../manuals) · [snarkjs manual](./snarkjs) · [Session 11: Groth16](../../learn/session-11) · [Session 12: PLONK](../../learn/session-12)

## What you will do

Write a small arithmetic circuit in Circom, then generate an R1CS, a WebAssembly witness calculator, and a symbol file for debugging. Compute a witness from an input and check that it satisfies the constraints with snarkjs. Setup, proving and verification are covered in the [snarkjs operation manual](./snarkjs).

The repository's applied exercises use Node.js and `circom2` 0.2.22 (Circom compiler 2.2.2) with `snarkjs` 0.7.5. These versions make the course examples reproducible. For new projects, check current official releases and installation instructions.

## 1. Prepare a workspace and tools

Install a maintained Node.js LTS release and npm. Create a new working directory and install the compiler and snarkjs as local dependencies:

```sh
mkdir circom-manual
cd circom-manual
npm init -y
npm install --save-dev circom2@0.2.22 snarkjs@0.7.5
npx circom2 --version
npx snarkjs --help
mkdir -p build
```

If using this repository's [`compose.yaml`](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/compose.yaml), see the [Docker section of the basic manuals](../manuals#docker).

## 2. Write a circuit {#write-circuit}

Save the following as `square.circom`:

```text
pragma circom 2.0.0;

template Square() {
    signal input in;
    signal output out;

    out <== in * in;
}

component main = Square();
```

`signal input` and `signal output` declare circuit inputs and outputs. `out <== in * in` both assigns a value during witness calculation and adds the constraint that `out` equals the square of `in`. The constraint is interpreted over a finite field.

## 3. Compile the circuit {#compile-circuit}

```sh
npx circom2 square.circom --r1cs --wasm --sym --inspect -o build
```

The compiler creates:

| File | Role |
| --- | --- |
| `build/square.r1cs` | Constraint system describing the circuit |
| `build/square_js/square.wasm` | WebAssembly program for witness calculation |
| `build/square_js/generate_witness.js` | Script that invokes the WebAssembly program |
| `build/square.sym` | Debug information mapping signal indices to names |

`--r1cs`, `--wasm` and `--sym` select the generated artifacts; `--inspect` performs additional checks. See the official [compilation guide](https://docs.circom.io/getting-started/compiling-circuits/) and [compiler options](https://docs.circom.io/getting-started/compilation-options/).

## 4. Calculate a witness and check constraints {#compute-witness}

Create `input.json`. Use strings for integer values to avoid loss of precision in JSON tooling:

```json
{"in": "7"}
```

Calculate the witness:

```sh
node build/square_js/generate_witness.js \
  build/square_js/square.wasm input.json build/witness.wtns
```

Check that it satisfies every constraint in the R1CS:

```sh
npx snarkjs wtns check build/square.r1cs build/witness.wtns
npx snarkjs r1cs info build/square.r1cs
```

The first command checks the witness against the circuit. The second reports the curve, signal and constraint counts, and the number of public and private inputs. A witness contains values for all wires and may include secret inputs; do not publish it inadvertently.

## 5. Circom points to watch

- **Distinguish `<==` from `<--`**: `<==` generates both an assignment and a constraint. `<--` only assigns a value for witness calculation; it does not add an R1CS constraint by itself. If using `<--` for a special case, add a constraint that captures the intended relation.
- **Keep constraints quadratic**: An R1CS constraint is a product of linear expressions plus a linear expression. Split higher-degree products using intermediate signals.
- **Constrain integer ranges**: Circuit arithmetic is over a finite field. Integer addition, comparison and range checks need range constraints that prevent wraparound modulo the field size.
- **Make public signals explicit**: By default, main-component inputs are private and outputs are public. Check the official documentation for syntax to designate additional public inputs in the Circom version you use.

See the official explanations of [constraint generation and `<==` / `<--`](https://docs.circom.io/circom-language/constraint-generation/) and [signals](https://docs.circom.io/circom-language/signals/).

## Next

Continue to the [snarkjs operation manual](./snarkjs) to generate and verify a Groth16 or PLONK proof from the R1CS and witness.

## References

[1] Circom Contributors, “[Installation](https://docs.circom.io/getting-started/installation/),” *Circom 2 Documentation*, accessed November 20, 2026.

[2] Circom Contributors, “[Writing Circuits](https://docs.circom.io/getting-started/writing-circuits/),” *Circom 2 Documentation*, accessed November 20, 2026.

[3] Circom Contributors, “[Constraint Generation](https://docs.circom.io/circom-language/constraint-generation/),” *Circom 2 Documentation*, accessed November 20, 2026.

[4] Circom Contributors, “[Compiling Circuits](https://docs.circom.io/getting-started/compiling-circuits/),” *Circom 2 Documentation*, accessed November 20, 2026.
