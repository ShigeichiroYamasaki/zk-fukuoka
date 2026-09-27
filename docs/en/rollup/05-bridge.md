---
outline: [2, 3]
---

# 5. ERC-20 and L1 verification

[Overview](./) · [Previous: batches](./04-batches) · [Next: availability/exits](./06-availability)

## Separate responsibilities

| Contract | Responsibility |
| --- | --- |
| TestToken | Ordinary ERC-20 without transfer fees or rebasing |
| Rollup | Escrow, queue, state roots, batch numbers and claims |
| Verifier | Groth16 verification under a fixed circuit/key |

Fix token/verifier addresses and genesis root at deployment. Do not introduce an administrative arbitrary-root setter or proof-verification bypass.

## Solidity and Foundry preparation

Read [OpenZeppelin ERC-20/SafeERC20](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20) and [Foundry project creation](https://getfoundry.sh/projects/creating-a-new-project/); pin dependency versions.

```sh
forge init contracts-lab
cd contracts-lab
forge build
forge test
anvil
```

Understand the generated sample before replacing it with Token, Rollup, Verifier and your tests. Start locally, then proceed to a testnet.

## Deposit implementation

`deposit(accountId, amount)` checks ranges, receives tokens with `safeTransferFrom`, checks that the actual token-balance increase equals the amount, then appends the queue entry. Store sequential ID, recipient account and amount; also retain the depositor refund address and receipt block as L1 metadata. Never credit quantities not received.

Guard external-call reentrancy and test that a failed transfer leaves no queue entry. SafeERC20 does not make arbitrary token economics compatible.

## Batch acceptance

Implement `submitBatch(proof, publicSignals, data)` according to this specification; this is not a supplied complete contract:

```text
require(!frozen)
require(public.domain == configuredDomain)
require(public.batchNumber == nextBatchNumber)
require(public.oldRoot == stateRoot)
require(public.depositStart == depositCursor)
require(depositStart <= depositEnd <= depositQueue.length)
require(depositEnd - depositStart <= 4)
require(data.length == 540)
require(SHA256(data) == join128(public.dataHashHi, public.dataHashLo))
require(SHA256(encodeQueuePrefix(...)) == join128(public.depositHashHi, public.depositHashLo))
require(verifier.verifyProof(proof, publicSignals))
store newRoot, depositEnd, withdrawalRoot
increment nextBatchNumber
emit BatchAccepted(batchNumber, newRoot, data)
```

Validate hash-limb bounds and public field-element ranges. Enforce queue bounds on L1 so nonexistent deposits cannot be created. Commit updates only after all checks pass.

## Withdrawal claims

A four-leaf withdrawal tree commits to `(domain, batchNumber, slot, recipient, amount)`. Non-withdrawal slots use separately tagged empty leaves. The circuit binds signed withdrawal fields to these leaves.

`claimWithdrawal(batchNumber, slot, recipient, amount, siblings)` checks membership against an accepted batch's exit root. Set the `(batchNumber, slot)` claimed flag before external transfer. Pay only the committed recipient; third-party claim submission must not redirect funds. Keep normal and [frozen-state exit](./06-availability#exit) records distinct.

## Acceptance

Use `forge test` to reject token receipt failure, unaccepted exits, forged paths, repeated claims, changed data, wrong old root, skipped deposits, wrong domain and a false verifier result.

A mock verifier can initially test the contract state machine. Completion requires the actual generated verifier and real proofs in end-to-end tests. Passing mock tests is not proof-verification success.
