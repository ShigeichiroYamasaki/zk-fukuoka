# Program meaning: a prerequisite for arithmetization

Updated: September 30, 2026

[Prerequisites and supplementary resources](./foundations) · [Session 4: Arithmetization](./session-04) · [Execution-trace guide](./terms/execution-traces)

This page introduces only the program-semantics ideas needed before Session 4. You do not need a formal-semantics course; you need to describe what a program computes using inputs, outputs, and state transitions.

## 1. Read a program as an input-output relation

If program $P$ halts on input $x$ and returns output $y$, write $P(x)=y$. To ask whether a program is correct, first specify the allowed inputs and the output expected for each input. For example, a program checking whether total deposits equal total withdrawals takes lists of amounts as input and returns a Boolean result.

In a proof, let $R(x,w)$ express that auxiliary data $w$ satisfies the required conditions for public input $x$. The corresponding language is $L=\{x\mid\exists w,\ R(x,w)\}$; correctness means there is a witness $w$ satisfying the relation. The [NP relation, public input, and witness guide](./terms/np-relations) explains this notation in detail.

## 2. States and transitions

A state is the collection of values needed to determine the next step of an execution. In a running-sum program, the state can be the current accumulated total. A transition rule computes the next state from the current state and the next input.

For instance, starting with $s_0=0$, adding deposit $d_i$ gives $s_{i+1}=s_i+d_i$; a separate running total for withdrawals follows $t_{i+1}=t_i+w_i$. At the end, check $s_n=t_n$. Transitions alone are insufficient: the initial state and final condition must also be specified.

## 3. Execution traces and AIR

An execution trace is a table listing states in time order from the initial state to the final state. Each row records a state at one step, and adjacent rows must obey the transition rule.

| Step | Input | Cumulative deposits $s_i$ | Cumulative withdrawals $t_i$ |
| ---: | ---: | ---: | ---: |
| 0 | — | 0 | 0 |
| 1 | $d_0=4,\ w_0=2$ | 4 | 2 |
| 2 | $d_1=3,\ w_1=5$ | 7 | 7 |

AIR treats this table as evidence of a valid computation. Transition constraints check adjacent rows; boundary constraints check the initial and final values. See the [execution-trace, state, transition, and boundary guide](./terms/execution-traces).

## 4. Translating meaning into constraints

Arithmetization introduces variables for intermediate values and arranges that only values corresponding to valid executions satisfy the constraints. Correct translation needs both directions:

- If the program executes correctly, the corresponding assignment satisfies the constraints (completeness).
- If an assignment satisfies the constraints, it represents a valid execution of the program (soundness).

To ensure the second direction, do not omit required input, output, range, or branch conditions. When integers are represented in a finite field, range constraints may also be needed to prevent wraparound modulo the field size. The [deposit and withdrawal arithmetization example](../exercises/session-04#private) illustrates this.

## Check your preparation

1. List the state variables for computing deposit and withdrawal totals.
2. Write the initial values, transition rules, and final condition.
3. Explain what an incorrect execution could satisfy if only transition constraints were imposed.

<details>
<summary>Check</summary>

1. The state is the pair of running totals $s_i,t_i$.
2. Initial values: $s_0=t_0=0$. Transitions: $s_{i+1}=s_i+d_i$ and $t_{i+1}=t_i+w_i$. Final condition: $s_n=t_n$.
3. Without fixed initial and final conditions, transitions alone could allow a different starting state or an unintended output.

</details>

This is a short preparation resource. Session 4 develops how these meanings are preserved when translating into R1CS, QAP, and AIR.
