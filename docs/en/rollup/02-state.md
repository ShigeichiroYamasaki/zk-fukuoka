---
outline: [2, 3]
---

# 2. Merkle state and roots

[Overview](./) · [Previous: ledger](./01-ledger) · [Next: circuits](./03-circuit)

## What L1 stores

Store an account-tree root rather than the entire ledger in contract storage. A root does not reconstruct balances: [Stage 6](./06-availability) separately publishes reconstruction data. Four accounts need four leaves, two internal nodes and one root. Two ID bits fix leaf position.

## Fix the leaf format

The circuit version hashes ordered fields:

```text
leaf = Poseidon(TAG_ACCOUNT, id, l1Owner, l2KeyX, l2KeyY, balance, nonce)
node = Poseidon(TAG_NODE, left, right)
```

Use distinct fixed tags consistently in the circuit, operator and genesis generator. Constrain IDs to two bits, owners to 160 bits, balances/nonces to 64 bits. L2 Baby Jubjub signing keys are separate from Ethereum wallet keys.

Publish genesis registration, validate owner-to-key bindings and fix a zero-balance/zero-nonce initial root. This version has no registration or key rotation after genesis. Updates must not arbitrarily change owners or keys.

## Membership plus update

Recompute the old root from a leaf and siblings; require equality. Replace that leaf on the same path to compute the updated root. For transfers:

1. Verify the sender against `oldRoot`.
2. Update the sender and compute `intermediateRoot`.
3. Verify the receiver against **`intermediateRoot`**.
4. Update the receiver to produce `newRoot`.

Two independent updates against the old root do not guarantee a root containing both changes. Reject self-transfers in this initial design.

## Try the model

```python
from ledger_model import Ledger
l = Ledger()
l.apply('receive', 0, 100)
l.apply('consume', 0)
old = l.root()
a = l.accounts[0].copy()
assert l.verify(a, 0, l.path(0), old)
a['balance'] += 1
assert not l.verify(a, 0, l.path(0), old)
```

The Python model uses SHA-256/JSON for teaching. Its roots do **not** match the Poseidon circuit format. When connecting implementations, replace this encoding and create cross-language golden vectors.

## Implementation and acceptance

Implement encoding, tree/path generation and sequential updates in `operator/state.ts`. Test both TypeScript and circuit behavior:

| Case | Expected |
| --- | --- |
| All four membership paths | Initial root matches |
| Swapped sibling ordering | Reject |
| Modified balance, owner, key or ID | Reject |
| Stale path after updates | Reject where inconsistent |
| Two-account update | Equals full tree recomputation |

Consult the [official Poseidon circuit](https://github.com/iden3/circomlib/blob/master/circuits/poseidon.circom) and pin implementation parameters and versions.
