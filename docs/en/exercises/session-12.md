# Session 12 exercise: PLONK gates and copy constraints

[Session 12: PLONK](../learn/session-12) · [Exercises index](./)

Check how PLONK selectors enforce gates and why copy constraints are separate.

### Try it

For the gate equation $q_La+q_Rb+q_Oc+q_Mab+q_C=0$, give selector values for the multiplication $3\cdot4=12$. Then create two gate rows that should share a value and explain why satisfying each gate equation alone does not enforce the wiring.

### Check

Set $q_M=1,q_O=-1$ and all other selectors to zero, giving $ab-c=0$. Each row’s gate equation does not by itself ensure that a cell in one row equals a cell in another; a permutation argument checks those copy constraints.

