---
outline: [2, 3]
---

# Applied course: build an ERC-20 transfer ZK rollup

A six-stage development course connects Sessions 1–15 to deposits, L2 transfers, withdrawals and L1 verification of state transitions for one ERC-20 token.

Updated: September 27, 2026

[Lectures](../learn/sessions) · [Balance arithmetization](../exercises/session-04#program) · [Exercises](../exercises/)

::: info Course scope and supplied artifacts
These pages provide specifications, implementation steps and acceptance tests. Downloads include a Python ledger/Merkle reference model and an introductory Circom arithmetic circuit. The integrated signature/Merkle rollup circuit, L1 bridge and operator-failure exits are learner implementation tasks. This is not a completed rollup or a deployed testnet system.
:::

## Target user journey {#goal}

1. Alice deposits 100 test-token units into the L1 contract.
2. An accepted batch consumes that queue entry and credits her L2 balance.
3. Alice signs a transfer of 30 to Bob. Balances become 70 and 30.
4. Bob signs a withdrawal of 30. His L2 balance becomes zero; an unclaimed withdrawal remains.
5. After L1 accepts the proof, the withdrawal pays Bob once.
6. An independent node reconstructs state from public data; users can follow the specified exit procedure if the operator stops.

Reject forged signatures, overspending, nonce replay, duplicate deposit credits and duplicate withdrawal claims.

## Six development stages {#course}

| Stage | Build | Deliverables | Lectures |
| --- | --- | --- | --- |
| [1. Ledger and conservation](./01-ledger) | Deposit/transfer/withdrawal state machine | Reference runs and positive/negative tests | 4 |
| [2. Merkle state](./02-state) | Account membership and updates | Leaf specification, paths, sequential-update tests | 8 |
| [3. Signatures and circuits](./03-circuit) | Authorization, ranges, nonces, balances | R1CS, witness generation, rejection tests | 2, 4, 7 |
| [4. Batches and public inputs](./04-batches) | Four operations in one proof | Proofs, verification key, data binding | 9, 11 |
| [5. ERC-20 and L1 verification](./05-bridge) | Escrow, queue, roots and claims | Solidity and local end-to-end tests | 11, 14 |
| [6. Availability, exits and integration](./06-availability) | Independent replay and failure recovery | Replay tool, outage tests, testnet record | 14, 15 |

## Fix a small initial scope {#scope}

- One ordinary test ERC-20; exclude fee-on-transfer, rebasing and arbitrary tokens.
- Unsigned 64-bit amounts, balances and nonces; no fees, zero-value operations or self-transfers.
- Four accounts, IDs 0–3. Fix L1 owner addresses and L2 signing keys at genesis. Registration and key rotation are extensions.
- Depth-two account tree and four-slot batches with explicit NOP padding.
- Circom, circomlib, snarkjs/Groth16 and Solidity/Foundry. General EVM execution is outside scope.
- Start with L1 calldata for data availability. Operations and reconstruction data are public; transaction privacy is not a goal.

A rollup needs reconstructible state data as well as validity proofs. Read [Ethereum's explanation](https://ethereum.org/developers/docs/scaling/zk-rollups/) before treating proof submission alone as completion.

## Workspace and prerequisites {#setup}

Keep learner implementation artifacts in a separate exercise directory:

```text
zk-token-lab/
  model/           # reference transitions
  circuits/        # transfer, deposit, withdrawal, batch
  contracts/       # Token, Rollup, Verifier
  operator/        # queue, batching and proving
  client/          # L2 keys, signatures, user operations
  tests/           # circuit, contract and end-to-end
  fixtures/        # canonical input and expected output
```

Review Python/CLI basics, Solidity storage/events/reverts, ERC-20 approve/transferFrom, JavaScript BigInt, and hashing versus signing. Do not convert amounts to JavaScript Number.

Complete the [Groth16 operation manual](../exercises/manuals#groth16) first. Record compiler, dependency and verification-key versions. Circuit changes require rebuilding the R1CS, keys and verifier.

## Run the first artifact

[Stage 1's model](./01-ledger#run) needs only Python's standard library. Run the 100 → 70/30 → withdrawal example, then divide its responsibilities between circuits and L1 contracts.
