---
outline: [2, 3]
---

# 4. Batch proofs and public inputs

[Overview](./) · [Previous: circuits](./03-circuit) · [Next: L1](./05-bridge)

## Chain four operations

Use four slots with opcodes NOP=0, deposit=1, transfer=2, withdrawal=3. Chain each output root into the next input:

$$r_0=oldRoot\to r_1\to r_2\to r_3\to r_4=newRoot.$$

NOP fields are all zero and preserve root/cursor; allow NOP only after active operations. Constrain opcode selection so free values in unused branches cannot cancel active constraints.

## Fix public signals first {#inputs}

Agree on this order in circuits and Solidity, and test the generated order:

```text
[domain, batchNumber, oldRoot, newRoot,
 depositStart, depositEnd, depositHashHi, depositHashLo,
 withdrawalRoot, dataHashHi, dataHashLo]
```

| Signals | Bound facts |
| --- | --- |
| Domain and batch number | Deployment/network and next batch |
| Old/new roots | Stored state and computed result |
| Deposit start/end | Contiguous consumed queue prefix |
| Deposit hash limbs | SHA-256 of consumed L1 queue records |
| Withdrawal root | Four-slot tree of exits created here |
| Data hash limbs | SHA-256 of published batch data |

Split each SHA-256 digest into high/low 128-bit limbs. Constrain each limb and its correspondence to the digest bits; do not reduce the whole digest modulo the circuit field.

## Canonical data encoding {#encoding}

Use unsigned big-endian fields and reject out-of-range values. Each slot has 135 bytes; four slots have 540:

```text
op:u8 | sender:u8 | receiver:u8 | amount:u64 | nonceOrDepositId:u64 |
recipient:u160 | R8x:u256 | R8y:u256 | S:u256
```

Transfer recipient is zero; withdrawal receiver is zero; deposit sender, recipient and signature fields are zero. Deposits use the nonce field as deposit ID. NOP is all zero. IDs are 0–3; signature values use canonical field/group ranges.

The deposit hash covers up to four `depositId:u64 | accountId:u8 | amount:u64` records, in queue order, zero-padded to 68 bytes. The active count is `depositEnd-depositStart`. Positive deposit amounts distinguish records from padding.

The circuit must reconstruct **the same 540 bytes from its operation fields and constrain their SHA-256**. Supplying an unrelated hash as a public input is insufficient. L1 rehashes the received data. Inspect [circomlib SHA-256](https://github.com/iden3/circomlib/blob/master/circuits/sha256/sha256.circom) and test bit ordering.

## Generate proofs

First use the [arithmetic circuit](./03-circuit#core) with the [Groth16 manual](../exercises/manuals#groth16). Then replace it with your integrated `batch.circom`, containing signatures, Merkle updates, queue and data binding.

```sh
circom circuits/batch.circom --r1cs --wasm --sym -o build
snarkjs r1cs info build/batch.r1cs
snarkjs groth16 setup build/batch.r1cs pot_final.ptau build/batch_0000.zkey
snarkjs zkey contribute build/batch_0000.zkey build/batch_final.zkey --name="local exercise"
snarkjs zkey export verificationkey build/batch_final.zkey build/verification_key.json
snarkjs groth16 fullprove batch-input.json build/batch_js/batch.wasm build/batch_final.zkey build/proof.json build/public.json
snarkjs groth16 verify build/verification_key.json build/public.json build/proof.json
snarkjs zkey export solidityverifier build/batch_final.zkey contracts/Verifier.sol
```

`batch.circom` and `batch-input.json` are learner deliverables, not generated automatically by these commands or already supplied. Choose a `pot_final.ptau` large enough for actual constraints. A local practice setup is not for real assets. Follow [snarkjs](https://github.com/iden3/snarkjs) to verify setup artifacts too.

## Acceptance

Compare all operations against the reference state machine. Reject reordered dependent operations, altered old roots, skipped deposits, a changed data byte, changed withdrawal roots and nonzero NOP fields. Mutate every public signal individually to check its proof binding.
