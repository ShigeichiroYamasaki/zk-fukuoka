# Session 13 exercise: STARK transparency and execution traces

[Session 13: STARK](../learn/session-13) · [Exercises index](./)

Check STARK trace constraints and the design tradeoff with transparent proofs.

### Try it

Over $\mathbb F_{17}$, start at $s_0=3$ and apply $s_{i+1}=s_i^2$ three times. Write the trace and separate transition constraints from boundary constraints. Compare KZG and FRI by setup, assumptions, and proof size.

### Check

The trace is $3,9,13,16$. Transitions check each adjacent squaring step; boundaries fix $s_0=3$ and $s_3=16$. KZG uses a trusted setup and pairing assumptions for short proofs. FRI uses transparent, hash-based commitments, typically with larger proofs and verification work.

