# Session 8 exercise: polynomial commitments

[Session 8: Polynomial commitments and commitment theory](../learn/session-08) · [Exercises index](./)

Connect an evaluation opening to its quotient polynomial.

### Try it

For $f(X)=X^2+2X+1$, compute $y=f(3)$ and $q(X)=(f(X)-y)/(X-3)$. Explain why a commitment to $q$ helps verify the KZG opening. For FRI/Merkle, distinguish the guarantee of the Merkle path from that of the low-degree test.

### Check

$y=16$ and $f(X)-16=(X-3)(X+5)$, so $q=X+5$. The Merkle path authenticates a table value; FRI tests whether the table is close to a low-degree polynomial.

