# Session 14 exercise: comparing protocols

[Session 14: An integrated view across Acts I–III](../learn/session-14) · [Exercises index](./)

Compare completeness, soundness, zero knowledge, and practical design choices across protocols.

### Try it

For Groth16, original KZG-based PLONK, and a representative FRI-based STARK, make a table of setup, proof size, main security basis, and transparency. Use the lecture to add one sentence on how each meets completeness, soundness, and zero knowledge.

### Check

Groth16 uses a circuit-specific trusted setup and pairing assumptions; PLONK uses a universal/updatable SRS, KZG, and Fiat–Shamir; STARK uses transparent setup, hashes, and FRI. Do not infer properties from a protocol family name alone; state the exact construction, assumptions, and implementation.

