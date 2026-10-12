# Program meaning: a prerequisite for arithmetization

Updated: October 12, 2026

[Prerequisites and supplementary resources](./foundations) · [Session 4: Arithmetization](./session-04) · [Execution-trace guide](./terms/execution-traces)

This page introduces only the program-semantics ideas needed before Session 4. You do not need a formal-semantics course; you need to describe what a program computes using inputs, outputs, and state transitions.

## 1. Read a program as an input-output relation

If program $P$ halts on input $x$ and returns output $y$, write $P(x)=y$. To ask whether a program is correct, first specify the allowed inputs and the output expected for each input. For example, a program checking whether total deposits equal total withdrawals takes lists of amounts as input and returns a Boolean result.

In a proof, let $R(x,w)$ express that auxiliary data $w$ satisfies the required conditions for public input $x$. The corresponding language is $L=\{x\mid\exists w,\ R(x,w)\}$; correctness means there is a witness $w$ satisfying the relation. The [NP relation, public input, and witness guide](./terms/np-relations) explains this notation in detail.

## 2. States and transitions

A state is the collection of values needed to determine the next step of an execution. In a running-sum program, the state can be the current accumulated total. A transition rule computes the next state from the current state and the next input.

For instance, starting with $s_0=0$, adding deposit $d_i$ gives $s_{i+1}=s_i+d_i$; a separate running total for withdrawals follows $t_{i+1}=t_i+w_i$. At the end, check $s_n=t_n$. Transitions alone are insufficient: the initial state and final condition must also be specified.

## 3. Expanding a bounded computation into a Boolean circuit

To represent a program as a circuit, fix bounds on the input length, the bit width of each value, and the number of execution steps. Under these bounds, the computation can be represented as a finite network of logic gates. A Boolean circuit takes bits (0 or 1) as inputs and outputs, and computes with gates such as AND, OR, and NOT. Wires carry values between gates, including intermediate results.

For the deposit-and-withdrawal example, first represent each amount as a bit string of a fixed width. Expand binary addition into full-adder logic, with wires carrying each bit sum and carry. Once both totals are computed, compare their bits and output 1 only if every bit matches. Thus, an operation written as one addition or comparison in a program becomes a finite collection of small gates in the circuit. The width must also be large enough for the totals, so overflow cannot make different totals appear equal.

An if-then-else branch can be represented by a selection circuit (multiplexer) controlled by the condition bit. A loop with a fixed upper bound can be unrolled by placing one copy of its circuit for each iteration. A program with unbounded input length or runtime therefore cannot be represented directly by one fixed-size circuit. Instead, use a circuit for each chosen input-size or step bound, or represent the computation step by step with an execution trace.

| Program operation | Circuit representation |
| --- | --- |
| Fixed-width integer addition | Per-bit adder gates and carry wires |
| Conditional branch | A selection circuit controlled by the condition bit |
| Loop with a fixed bound | A sequence of circuit copies, one per iteration |
| Correctness of the result | The output bits have the required value |

Circuit construction translates a program into logical gate constraints. Session 4 then expresses the relations among circuit inputs, intermediate wires, and outputs as algebraic constraints such as R1CS. For example, if a bit is represented by a finite-field element $b$, the condition that it is either 0 or 1 is $b(b-1)=0$. Gate relations are constrained as well, together with the public input and output conditions, so that only valid computations satisfy all constraints. A Boolean circuit is one intermediate representation that preserves the program's meaning on the way to arithmetization.

## 4. Execution traces and AIR

An execution trace is a table listing states in time order from the initial state to the final state. Each row records a state at one step, and adjacent rows must obey the transition rule.

| Step | Input | Cumulative deposits $s_i$ | Cumulative withdrawals $t_i$ |
| ---: | ---: | ---: | ---: |
| 0 | — | 0 | 0 |
| 1 | $d_0=4,\ w_0=2$ | 4 | 2 |
| 2 | $d_1=3,\ w_1=5$ | 7 | 7 |

AIR treats this table as evidence of a valid computation. Transition constraints check adjacent rows; boundary constraints check the initial and final values. See the [execution-trace, state, transition, and boundary guide](./terms/execution-traces).

## 5. Translating meaning into constraints

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
