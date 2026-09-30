# # Session 2 exercise: simulation and distinguishing

[Session 2: Zero knowledge and generalizing the witness](../learn/session-02) · [Exercises index](./)

Compute a distinguishing gap and identify what zero knowledge compares.

### Try it

Let $P_0$ output $00$ or $11$, each with probability $1/2$, and let $P_1$ output $01$ or $10$, each with probability $1/2$. For the distinguisher that outputs 1 exactly when the bits are equal, compute both output probabilities and the gap. Then, for Schnorr identification with public value $y=g^x$, identify the statement and witness.

### Check

The output-one probabilities are 1 under $P_0$ and 0 under $P_1$, so the gap is 1. The witness is $x$ and the relation is $g^x=y$.

