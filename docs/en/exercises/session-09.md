# Session 9 exercise: Fiat–Shamir and ROM

[Session 9: The Fiat–Shamir transform and ROM](../learn/session-09) · [Exercises index](./)

Identify the Fiat–Shamir transcript and explain what ROM does not establish.

### Try it

In Schnorr identification, the prover sends commitment $a$ before receiving challenge $c$. List what should be bound into the Fiat–Shamir hash and what the final verification record contains. Explain why a ROM proof is not automatically a proof about a concrete hash function.

### Check

Bind at least the protocol identifier, public statement, and commitment (real protocols bind the prior transcript). The record contains the public input, commitment, derived challenge, and response. ROM idealizes a random function; it does not directly prove security of SHA or another concrete hash.

