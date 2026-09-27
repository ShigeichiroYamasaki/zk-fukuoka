---
outline: [2, 3]
---
<script setup>
import { withBase } from "vitepress";
</script>

# 3. Signatures and transfer circuits

[Overview](./) · [Previous: state](./02-state) · [Next: batches](./04-batches)

## Start with arithmetic {#core}

<a :href="withBase('/examples/rollup/transfer_core.circom')" download>transfer_core.circom</a> is an arithmetic-only introductory circuit, without signatures or Merkle paths:

$$b'_s=b_s-a,\qquad b'_r=b_r+a,\qquad n'=n+1.$$

All inputs/outputs are uint64 and the amount is nonzero. Output range constraints reject underflow wrapping to a large field element, receiver overflow and nonce overflow.

```sh
mkdir -p build
circom transfer_core.circom --r1cs --wasm --sym -o build
```

Create `input.json`, encoding integers as strings:

```json
{"senderBalance":"100","receiverBalance":"0","amount":"30","nonce":"0"}
```

```sh
node build/transfer_core_js/generate_witness.js build/transfer_core_js/transfer_core.wasm input.json build/witness.wtns
```

Outputs are 70, 30 and 1. An amount of 101 must fail witness generation. This public arithmetic circuit cannot authorize a transfer by itself.

### Validation record

On September 27, 2026, the starter was checked with Circom compiler 2.2.2 (circom2 npm package 0.2.22) and snarkjs 0.7.5. Compilation produced 459 constraints. Witness checking and Groth16 proving/verification with a local practice setup succeeded. Public signals list outputs first: `[70,30,1,100,0,30,0]`. Overspending, zero amount, receiver/nonce overflow and changing the public output to 71 were rejected.

This validates only the arithmetic starter. Practice keys/setup are not distributed or intended for real assets.

## Conditions in the full transfer circuit

Implement `circuits/transfer.circom` with all of these constraints:

| Subject | Required relation |
| --- | --- |
| Accounts | Valid distinct IDs and old-root membership |
| Authorization | Verify the sender leaf's L2-key signature |
| Message | Bind sender, receiver, amount, nonce and domain |
| Arithmetic | The introductory circuit's range/update rules |
| Immutable fields | Preserve ID, L1 owner and L2 key |
| Receiver | Update from the intermediate sender-updated root |

Hash a canonical domain containing fixed version, L1 chain ID, rollup address and token address. Fix the chain ID encoding width. This separates signatures across networks and deployments.

```text
message = Poseidon(domain, TAG_TRANSFER, senderId, receiverId, amount, nonce)
```

Use circomlib's EdDSA/Poseidon construction. Inspect the [official verifier inputs](https://github.com/iden3/circomlib/blob/master/circuits/eddsaposeidon.circom) and never let mandatory verification be disabled. Check where the chosen version guarantees curve/subgroup/nonzero-key conditions and canonical signature values; constrain any missing requirements. Ethereum `personal_sign` is not directly compatible with this verifier.

## Deposits and withdrawals authorize differently

A withdrawal signs `TAG_WITHDRAW`, recipient L1 address, amount and nonce; debit the balance and bind those fields into an exit record. Claimants must not change the recipient.

Deposits are not created by an L2 signature. Consume the next queue entry representing tokens actually received on L1, using [batch public-input binding](./04-batches#inputs).

## Acceptance

Test arithmetic zero amount, overspend, receiver overflow and nonce overflow. For the full circuit, reject changed signatures, another account's key, changed recipient/domain, repeated nonce and modified Merkle paths.

Host assertions alone may not constrain the R1CS. Review [Circom constraint generation](https://github.com/iden3/circom/blob/master/mkdocs/docs/circom-language/constraint-generation.md); test rejection by the circuit itself.
