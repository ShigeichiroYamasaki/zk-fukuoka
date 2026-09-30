# Session 11 exercise: Groth16 and QAP

[Session 11: Groth16](../learn/session-11) · [Exercises index](./)

Relate the QAP relation, Groth16 verification, and the setup trapdoor.

### Try it

Use the Groth16 verification equation $e(A,B)=e(\alpha,\beta)e(\mathrm{IC},\gamma)e(C,\delta)$. Match each term to public inputs, proof elements, or setup data using the lecture. Explain how pairing bilinearity helps check a relation among values hidden in group elements. Then state what must remain secret in a circuit-specific trusted setup and why.

### Check

Pairing bilinearity compares products of exponents in the target group. $A,B,C$ are proof elements, $\mathrm{IC}$ encodes the public inputs, and $\alpha,\beta,\gamma,\delta$ come from setup-encoded values. The verification equation is Groth16-specific and incorporates the QAP and setup-generated coefficients; it is not a KZG opening equation or the QAP divisibility relation copied literally. Trapdoor leakage can enable false proofs, so setup secrets must be destroyed or safely generated in a distributed ceremony.
