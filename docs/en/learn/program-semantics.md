# Program meaning: a prerequisite for arithmetization

Updated: October 13, 2026

[Prerequisites and supplementary resources](./foundations) · [Session 4: Arithmetization](./session-04) · [Execution-trace guide](./terms/execution-traces)

This page introduces only the program-semantics ideas needed before Session 4. You do not need a formal-semantics course. The goal is to distinguish what a program computes from the steps by which it computes it, and to understand what must be preserved when translating that meaning into a circuit or algebraic constraints.

## 1. Read a program as an input-output relation

If program $P$ halts on input $x$ and returns output $y$, write $P(x)=y$. To ask whether a program is correct, first specify the allowed inputs and the output expected for each input. For example, a program checking whether total deposits equal total withdrawals takes lists of amounts as input and returns a Boolean result.

In a proof, let $R(x,w)$ express that auxiliary data $w$ satisfies the required conditions for public input $x$. The corresponding language is $L=\{x\mid\exists w,\ R(x,w)\}$; the statement is true when a witness $w$ satisfying the relation exists. Here, $R$ may include more than the program's final output: it can encode input requirements, intermediate computations, and output conditions. The witness may be the secret input itself, or may also contain an execution trace or intermediate values. The [NP relation, public input, and witness guide](./terms/np-relations) explains this notation in detail.

### Two ways to describe program meaning

**Input-output meaning (a denotational view)** treats a program as a function or relation from inputs to outputs. For example, $P(x)=x^2+1$ specifies the output for each input $x$. If the program may not halt on some inputs, its meaning is a partial function rather than a total one.

**Execution meaning (an operational view)** describes execution as a sequence of state transitions. The same computation, written as `t := x*x; y := t+1`, first computes $t$ and then computes $y$. Program semantics connects such a sequence of states to the input-output relation it realizes.

ZK arithmetization must connect these views. The statement to prove concerns the final input-output condition, while a circuit or AIR also checks intermediate values or transitions. Those intermediate constraints must be designed so that the permitted input-output pairs remain exactly the ones specified by the original program.

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

Circuit construction translates a program into logical gate constraints. For example, `t := x*x; y := t+1` computes $y=x^2+1$ as a function, and operationally computes $t$ with a multiplication before adding 1. A circuit represents this with a multiplier, an adder, and intermediate wires. Session 4 then expresses the relations among circuit inputs, intermediate wires, and outputs as algebraic constraints such as R1CS. Over a finite field, the simple relations are $x\cdot x=t$ and $t+1=y$. If a bit is represented by a finite-field element $b$, the condition that it is either 0 or 1 is $b(b-1)=0$. Gate relations are constrained as well, together with the public input and output conditions, so that only valid computations satisfy all constraints.

These equations do not automatically have the same meaning as integer arithmetic. Finite-field operations wrap around modulo the field size. To prove an integer specification, the constraints must also enforce appropriate ranges and bit representations for inputs and intermediate values. Without those conditions, a field equation may describe a different computation. Arithmetization therefore preserves the full program meaning, including value ranges, termination, and branch conditions; it is not merely a rewrite of equations.

## 4. Execution traces and AIR

An execution trace is a table listing states in time order from the initial state to the final state. Each row records a state at one step, and adjacent rows must obey the transition rule.

| Step | Input | Cumulative deposits $s_i$ | Cumulative withdrawals $t_i$ |
| ---: | ---: | ---: | ---: |
| 0 | — | 0 | 0 |
| 1 | $d_0=4,\ w_0=2$ | 4 | 2 |
| 2 | $d_1=3,\ w_1=5$ | 7 | 7 |

AIR treats this table as evidence of a valid computation. Transition constraints check adjacent rows; boundary constraints check the initial and final values. This captures the operational claim that execution starts from an allowed initial state, repeatedly takes valid steps, and reaches a final state satisfying the specification. Transition equations alone may permit arbitrary starting states or traces that stop too early, so the initial condition, input correspondence, stopping point, and final condition matter too. See the [execution-trace, state, transition, and boundary guide](./terms/execution-traces).

## 5. Translating meaning into constraints

Arithmetization introduces variables for intermediate values and arranges that only values corresponding to valid executions satisfy the constraints. This requires the constraint system to represent the source program's meaning exactly. Correct translation needs both directions:

- If the program executes correctly, the corresponding assignment satisfies the constraints (completeness).
- If an assignment satisfies the constraints, it represents a valid execution of the program (soundness).

To ensure the second direction, do not omit required input, output, range, branch, execution-bound, or termination conditions. In particular, completeness says every correct execution satisfies the constraints, while soundness says every satisfying assignment corresponds to an intended execution. When integers are represented in a finite field, range constraints may also be needed to prevent wraparound modulo the field size. The [deposit and withdrawal arithmetization example](../exercises/session-04#private) illustrates this.

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
