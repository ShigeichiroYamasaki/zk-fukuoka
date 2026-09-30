# # Session 4 exercise: translating computation into constraints

[Session 4: Arithmetization techniques and complexity theory](../learn/session-04) · [Exercises index](./)

Follow one computation through R1CS, QAP, and AIR.

### Try it

Use deposits $(4,3)$ and withdrawals $(2,5)$ from the [arithmetization worked example](../learn/balance-arithmetization). Recompute the three R1CS residuals, verify that constraint points $1,2,3$ are roots of the QAP vanishing polynomial, and identify the initial boundary, updates, and final equality in the AIR trace.

### Check

The R1CS assignment is $(1,4,3,2,5,7,7)$ and all residuals are zero. $Z(X)=(X-1)(X-2)(X-3)$ vanishes at all three constraint points. AIR needs initial and final boundary conditions as well as transitions. Use the linked page for full calculations and Python.

