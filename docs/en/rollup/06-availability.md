---
outline: [2, 3]
---

# 6. Availability, failure exits and integration

[Overview](./) · [Previous: L1](./05-bridge) · [Session 14](../learn/session-14)

## Roots and proofs are not enough

Reconstruct state independently from genesis registrations, L1 deposits, accepted 540-byte batches and finalized/claimed withdrawals. Recompute each root and stop on mismatch.

Initially publish data in calldata and events, binding its hash in both the circuit and L1. Moving data to IPFS and posting only a hash does not retain the same availability guarantee. See [Ethereum's rollup explanation](https://ethereum.org/developers/docs/scaling/zk-rollups/).

## Independent replay

Implement `operator/replay.ts` without the operator's private database. Record chain ID, contract, start block and specification version.

1. Read finalized L1 blocks in order; check contiguous batch numbers.
2. Decode canonical big-endian data; reject extra bytes and invalid NOPs.
3. Re-execute signature, nonce, queue and balance checks.
4. Rebuild account and withdrawal trees and compare roots.
5. Save a restart cursor and roll back to the common ancestor after reorganization.

## Operator failure {#exit}

Use **permanent freeze after a deadline, followed by recovery from the last accepted state**. Resuming normal operation after freeze is outside scope. An unconditional “withdraw using any balance path” method can double-pay while normal transfers continue.

Allow only the genesis-registered L1 owner to request exit for their account ID, with a deadline in L1 blocks. Unrelated batches must not extend that deadline. Resolve a request only by its owner cancelling it, or by a membership proof showing that account has zero balance under the current accepted root. Any unclaimed normal withdrawals remain recoverable through their separate exit roots. Anyone may freeze after the oldest unprocessed request expires. Also give pending deposits a timeout so never-credited funds can be recovered.

Freeze atomically fixes the state root and deposit cursor, and disables deposits and new batches. Separate three recovery pools:

| Recovery | Evidence | Replay prevention |
| --- | --- | --- |
| Unprocessed deposits | L1 queue at/after frozen cursor | Per-deposit refund flag; original recorded refund recipient |
| Frozen L2 balances | Account path to frozen root | Full balance once per account, paid to the leaf's L1 owner |
| Accepted unclaimed exits | Existing withdrawal roots | Same claimed flags as normal operation |

An already-debited exit must not also be refunded as a frozen account balance. Immutable L1 owners simplify the recovery destination.

Implement `requestExit(accountId)`, `cancelExit(requestId)`, `resolveEmptyAccount(requestId, leaf, path)` and `freeze()` on L1. Bind zero-balance proofs to the request account/owner and current state root; reject old roots and different accounts. There is no arbitrary administrator resolution. This intentionally simple design allows a user request to halt the entire system permanently. Forced processing without shutdown is a separate extension.

## Capstone acceptance tests {#acceptance}

| Test | Required result |
| --- | --- |
| Alice deposits 100, sends Bob 30, Bob withdraws | Actual verifier accepts; Bob receives 30 on L1 |
| Invalid operations | Reject forged signatures, overspend, replay and duplicate credits/claims |
| Altered public data | Reject calldata inconsistent with the proof |
| Independent replay | Reproduce every accepted root from a new database |
| Operator outage | Freeze after timeout; service all three recovery pools without overlap |
| Artificial deadline extension | Unrelated batches cannot delay exits |
| Freeze race | Reject post-freeze batches; include the last pre-freeze accepted state |
| L1 reorganization | Roll back unfinalized deposits/batches and replay |

## Submission

Provide source, dependency versions, circuit hash, verification key, setup provenance, positive/negative test results, replay logs and outage tests. Record testnet chain ID, deployment addresses, token and transaction references.

Publishing this course does not establish that a learner's full-system tests passed. Before real assets, separately review and audit circuits, bridge and exits, and validate setup, keys and operation.
