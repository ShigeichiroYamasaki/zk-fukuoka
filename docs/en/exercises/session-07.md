# Session 7 exercise: elliptic curves, pairings, and assumptions

[Session 7: Elliptic curves and pairings](../learn/session-07) · [Exercises index](./)

Check bilinearity and distinguish computational assumptions.

### Try it

For $P=g^a,Q=h^b$, express $e(P,Q)$ as a power of $e(g,h)$ and find the exponent for $a=3,b=4$. State what discrete log and q-SDH each assume to be hard.

### Check

$e(g^a,h^b)=e(g,h)^{ab}$, giving exponent 12 modulo the group order. Discrete log asks for $x$ from $g,g^x$; q-SDH asks for a specified inverse-exponent form from a structured powers sequence. They are distinct assumptions.

