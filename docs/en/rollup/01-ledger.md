---
outline: [2, 3]
---
<script setup>
import { withBase } from "vitepress";
</script>

# 1. Ledger and conservation

[Overview](./) · [Session 4](../learn/session-04) · [Next: Merkle state](./02-state)

## Establish the reference behavior

Start without cryptographic proofs. This reference state machine defines expected outcomes for subsequent circuits and contracts.

Accounts contain `(id, owner, balance, nonce)`. Owners are labels such as Alice in the model; the real implementation separates L1 addresses and L2 public keys. Model calls represent already-authorized actions; there is no signature verification yet.

## Escrow and liabilities

There is a delay between L1 receipt and L2 credit, and between L2 withdrawal debit and L1 payout:

$$V=U+B+W.$$

| Symbol | Meaning |
| --- | --- |
| $V$ | Tokens held in L1 escrow |
| $U$ | Unprocessed deposits |
| $B$ | Total L2 balances |
| $W$ | Debited but unclaimed withdrawals |

The model has no fees or unsolicited token transfers. Real ERC-20 holders can transfer directly to the contract, so distinguish accounted escrow from actual token balance; surplus must not create user liabilities.

| Operation of amount $a$ | $V$ | $U$ | $B$ | $W$ |
| --- | --- | --- | --- | --- |
| Receive deposit | $+a$ | $+a$ | 0 | 0 |
| Credit deposit on L2 | 0 | $-a$ | $+a$ | 0 |
| L2 transfer | 0 | 0 | 0 overall | 0 |
| Finalize withdrawal request | 0 | 0 | $-a$ | $+a$ |
| Claim on L1 | $-a$ | 0 | 0 | $-a$ |

## Operations to implement

- `receive(account, amount)`: append a sequential deposit entry.
- `consume(depositId)`: consume only the next cursor entry.
- `transfer(from, to, amount, nonce)`: check balances, receiver overflow and nonce; increment sender nonce.
- `withdraw(from, recipient, amount, nonce)`: debit and create a fixed-recipient exit record.
- `claim(exitId)`: pay an unclaimed exit once and mark it claimed.

Failed operations must leave state unchanged. The model's `apply` checks a copy before committing it. L1 reverts and offchain working-state copies should provide the corresponding atomicity.

## Run it {#run}

<a :href="withBase('/examples/rollup/ledger_model.py')" download>Download ledger_model.py</a>; run with Python 3.8+:

```sh
python3 ledger_model.py
python3 ledger_model.py --test
```

Compare against the <a :href="withBase('/examples/rollup/expected-demo.json')" download>expected JSON</a>. Before the claim: `vault=100, balances=70, pending_withdrawals=30`. After: `vault=70, balances=70, pending_withdrawals=0`.

This model has no signatures, ERC-20 calls, proofs or network. A successful model transfer does not establish the owner's authorization.

## Acceptance

Twelve tests cover the normal flow, deposit order/replay, overspending, self-transfer, nonce replay, invalid ranges, overflow, repeated withdrawal claims, withdrawal nonces, Merkle membership, tampering and receipt replay.

As an additional exercise, reverse two transfers and explain any different outcome. Conservation alone does not determine validity: intermediate balances and nonces also matter.
