---
outline: [2, 3]
prev:
  text: Circom operation manual
  link: /en/exercises/manuals/circom
next:
  text: Basic operation manuals
  link: /en/exercises/manuals
---

# snarkjs Operation Manual

Updated: November 20, 2026

[Basic operation manuals](../manuals) · [Circom operation manual](./circom) · [Session 11: Groth16](../../learn/session-11) · [Session 12: PLONK](../../learn/session-12)

## What you will do

Use snarkjs to generate and verify Groth16 or PLONK proofs from the R1CS and witness produced by Circom. The commands below use `square.circom` from the [Circom operation manual](./circom).

The reproducible course examples use Node.js LTS and `snarkjs` 0.7.5, matching the `package.json` in the sample. The official README recommends using a current release; for new work, check the release notes and instructions for the version you install.

## 1. Prepare the inputs

This walkthrough assumes the [Circom steps](./circom) have created:

- `build/square.r1cs`: the constraint system
- `build/witness.wtns`: witness computed from input `in=7`
- `build/square_js/square.wasm`: witness calculator

Inspect the R1CS and check the witness:

```sh
npx snarkjs r1cs info build/square.r1cs
npx snarkjs wtns check build/square.r1cs build/witness.wtns
```

The official [`snarkjs --help`](https://github.com/iden3/snarkjs#readme) lists the available commands and input/output formats.

## 2. Prepare Powers of Tau {#powers-of-tau}

For this exercise, generate a local `bn128` power-8 Powers of Tau ceremony (up to 256 constraints). This avoids downloading a parameter file and lets you follow the setup steps. The value generated with `openssl rand` is only an input for exercising the command; it is not an independent public randomness beacon. Since you control the contribution and input value, this is not a trusted production setup.

```sh
npx snarkjs powersoftau new bn128 8 build/pot8_0000.ptau

POT_ENTROPY="$(openssl rand -hex 32)"
npx snarkjs powersoftau contribute \
  build/pot8_0000.ptau build/pot8_0001.ptau \
  --name="Local learning contribution" --entropy="$POT_ENTROPY"
unset POT_ENTROPY

BEACON_HEX="$(openssl rand -hex 32)"
npx snarkjs powersoftau beacon \
  build/pot8_0001.ptau build/pot8_beacon.ptau \
  "$BEACON_HEX" 10 -n="Local learning beacon"
npx snarkjs powersoftau prepare phase2 \
  build/pot8_beacon.ptau build/pot8_final.ptau
npx snarkjs powersoftau verify build/pot8_final.ptau
```

All commands should succeed, with `Powers Of tau file OK!` at the end. `powersoftau verify` checks the cryptographic consistency of the generated transcript; it cannot prove that a learner destroyed a secret. Choose a power matching the constraint count for larger circuits. Real applications should use parameters whose provenance, checksums and multi-party ceremony have been verified.

## 3. Prove with Groth16 {#groth16}

Groth16 setup is circuit-specific. First create an initial `.zkey` for the circuit:

```sh
npx snarkjs groth16 setup \
  build/square.r1cs build/pot8_final.ptau build/square_0000.zkey
```

Add a contribution to the initial `.zkey`, then finalize it with a random beacon. The commands below are for learning the local workflow and do not constitute a trusted production setup.

```sh
CONTRIBUTION_ENTROPY="$(openssl rand -hex 32)"
npx snarkjs zkey contribute \
  build/square_0000.zkey build/square_0001.zkey \
  --name="Local learning contribution" \
  --entropy="$CONTRIBUTION_ENTROPY"
unset CONTRIBUTION_ENTROPY

BEACON_HEX="$(openssl rand -hex 32)"
npx snarkjs zkey beacon \
  build/square_0001.zkey build/square_final.zkey \
  "$BEACON_HEX" 10 -n="Local learning beacon"

npx snarkjs zkey verify \
  build/square.r1cs build/pot8_final.ptau build/square_final.zkey
```

A secure setup requires verifiable procedures, contributors and randomness-beacon provenance. A solo local experiment does not distribute trust. Never use an initial `.zkey` in production.

Export a verification key and create the proof:

```sh
npx snarkjs zkey export verificationkey \
  build/square_final.zkey build/verification_key.json
npx snarkjs groth16 prove \
  build/square_final.zkey build/witness.wtns \
  build/proof_groth16.json build/public_groth16.json
npx snarkjs groth16 verify \
  build/verification_key.json build/public_groth16.json \
  build/proof_groth16.json
```

Successful verification prints `OK`. The proof JSON contains the proof; the public JSON contains public inputs and outputs. A witness may reveal private inputs, so normally give the verifier only the proof, public values and verification key.

## 4. Prove the same circuit with PLONK {#plonk}

PLONK can also use the Circom R1CS as input. Reuse the same circuit and Powers of Tau file to compare setup requirements. PLONK does not use Groth16's circuit-specific phase-two contribution, but circuit-specific preprocessing and key generation remain.

```sh
npx snarkjs plonk setup \
  build/square.r1cs build/pot8_final.ptau build/square_plonk.zkey
npx snarkjs zkey export verificationkey \
  build/square_plonk.zkey build/verification_key_plonk.json
npx snarkjs plonk prove \
  build/square_plonk.zkey build/witness.wtns \
  build/proof_plonk.json build/public_plonk.json
npx snarkjs plonk verify \
  build/verification_key_plonk.json build/public_plonk.json \
  build/proof_plonk.json
```

Powers of Tau is universal for PLONK, but the selected curve and power still limit which circuits it supports.

## 5. Check as a verifier {#verify-as-a-verifier}

Copy `build/public_groth16.json` (or the PLONK public JSON), change a value, and verify it against the original proof. The proof is bound to the public values, so verification should fail for the changed value. This experiment checks implementation behavior; it is not a mathematical proof of security.

Keep these files separate:

| File | Handling |
| --- | --- |
| `proof_*.json` | Send the proof to the verifier |
| `public_*.json` | Send the public values to the verifier |
| `verification_key*.json` | Send the public verification key to the verifier |
| `witness.wtns`, private input JSON | May contain secrets; do not normally share |
| `.zkey`, `.ptau` | Setup/proving material; control storage and distribution |

## 6. Common confusions

- Circom compiles the circuit; snarkjs inspects the R1CS and performs setup, proving and verification. The full workflow uses both.
- A Groth16 `.zkey` is circuit-specific. Changing the circuit requires setup again.
- PLONK's Powers of Tau parameters are reusable across circuits, but not across every curve and circuit size. Check the required power.
- Committing `.wtns` to Git may disclose private inputs or intermediate signals. Inspect generated files before sharing them.

## References

[1] 0KIMS Association, “[snarkjs README](https://github.com/iden3/snarkjs#readme),” GitHub, accessed November 20, 2026.

[2] Circom Contributors, “[Computing the Witness](https://docs.circom.io/getting-started/computing-the-witness/),” *Circom 2 Documentation*, accessed November 20, 2026.

[3] 0KIMS Association, “[snarkjs Releases](https://github.com/iden3/snarkjs/releases),” GitHub, accessed November 20, 2026.
