# Session 15 exercise: recursion, folding, and applications

[Session 15: Directions for further development](../learn/session-15) · [Exercises index](./)

Distinguish recursive proofs, folding, and GKR/sumcheck, then read the Ethereum application snapshot.

### Try it

1. Explain the difference between verifying an earlier proof inside a new proof and folding two relaxed R1CS instances.
2. For $g(x,y)=x+y$ over $x,y\in\{0,1\}$, compute the sum and the first sumcheck polynomial $h(X)=\sum_{y\in\{0,1\}}g(X,y)$. Write the verifier’s first consistency check.
3. Check [the official EIP-8025 proposal](https://eips.ethereum.org/EIPS/eip-8025) for its status and whether its current specification removes execution re-execution.

### Check

Recursive proofs wrap proof verification; folding cheaply aggregates instances before a final proof. The sum is 4, $h(X)=2X+1$, and the verifier checks $h(0)+h(1)=1+3=4$. The lecture’s September 29, 2026 snapshot lists EIP-8025 as Draft and optional supplementary checks; payload re-execution is not replaced. Status can change, so recheck the official proposal page when doing this exercise.
