# Session 10 exercise: PCP and IOP

[Session 10: The PCP theorem and IOP framework](../learn/session-10) · [Exercises index](./)

Compare verifier access in PCP, IP, and IOP, then map the proof-system components.

### Try it

Compare the three models by number of interaction rounds and how much of each message the verifier reads. Then classify arithmetization, FRI, polynomial commitments, and Fiat–Shamir by their role.

### Check

PCP presents a proof once and checks a few random locations; IP has multiple rounds and reads each message; IOP has multiple rounds and oracle-style partial access. Arithmetization constructs constraints, FRI checks low-degree proximity, commitments implement fixed values and openings, and Fiat–Shamir removes interaction by deriving challenges from hashes.

