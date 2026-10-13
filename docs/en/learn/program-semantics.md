# Program meaning: a prerequisite for arithmetization

Updated: October 14, 2026

[Prerequisites and supplementary resources](./foundations) · [Session 4: Arithmetization](./session-04) · [Execution-trace guide](./terms/execution-traces)

This page introduces only the program-semantics ideas needed before Session 4. You do not need a formal-semantics course. The goal is to distinguish what a program computes from the steps by which it computes it, and to understand what must be preserved when translating that meaning into a circuit or algebraic constraints.

## 1. Read a program as an input-output relation

If program $P$ halts on input $x$ and returns output $y$, write $P(x)=y$. To ask whether a program is correct, first specify the allowed inputs and the output expected for each input. For example, a program checking whether total deposits equal total withdrawals takes lists of amounts as input and returns a Boolean result.

In a proof, let $R(x,w)$ express that auxiliary data $w$ satisfies the required conditions for public input $x$. The corresponding language is $L=\{x\mid\exists w,\ R(x,w)\}$; the statement is true when a witness $w$ satisfying the relation exists. Here, $R$ may include more than the program's final output: it can encode input requirements, intermediate computations, and output conditions. The witness may be the secret input itself, or may also contain an execution trace or intermediate values. The [NP relation, public input, and witness guide](./terms/np-relations) explains this notation in detail.

## 2. Denotational semantics: the input-output meaning

**Denotational semantics** represents a program's meaning as a mathematical object describing which output it returns for an input. Let $X$ be the input set and $Y$ the output set. A deterministic program $P$ can be represented as a **partial function**

$$\langle\!\langle P\rangle\!\rangle:X\rightharpoonup Y.$$

The partial arrow means that the function may be undefined for some inputs. The equation $\langle\!\langle P\rangle\!\rangle(x)=y$ means that $P$ halts on input $x$ and returns output $y$. For inputs where it does not halt, the function is undefined.

For example, the meaning of `t := x*x; y := t+1` is $\langle\!\langle P\rangle\!\rangle(x)=x^2+1$ under integer arithmetic, once the input domain has been specified. Real programs also depend on value ranges, overflow, division and exception behavior. A specification must therefore state not just a formula, but also which inputs are allowed and which arithmetic rules apply.

A specification can be represented by a relation $S\subseteq X\times Y$. Program correctness then means that, for allowed inputs, each execution result $(x,y)$ satisfies $S$. In a ZK proof, $R(x,w)$ further checks whether public input $x$ and witness $w$ provide an output, secret data or intermediate values satisfying the specification. Even a correct proof system proves the wrong thing if the definition of $R$ omits part of the intended specification.

## 3. Operational semantics: the steps of execution

**Operational semantics** defines program execution as one-step changes to a computation state. A state includes the next instruction to execute and values stored in variables. Write

$$c\longrightarrow_P c'$$

when program $P$ can move from state $c$ to state $c'$ in one step. A multi-step execution is a sequence of these transitions. When it reaches a halted state $c_{\mathrm{halt}}$, the output is read from that state.

For `t := x*x; y := t+1`, execution starts in a state containing input $x$, moves to a state where $t=x^2$ is stored, and then to a halted state where $y=t+1$ is stored. This transition sequence realizes the denotational meaning $\langle\!\langle P\rangle\!\rangle(x)=x^2+1$. For deposit and withdrawal totals, use a state containing two running sums $(s_i,t_i)$ and the transition rules

$$s_0=t_0=0,\qquad s_{i+1}=s_i+d_i,\qquad t_{i+1}=t_i+w_i.$$

Then check $s_n=t_n$. The initial state, consumed inputs, number of steps and final condition must be specified along with the transition equations to describe the intended computation.

Denotational semantics identifies which input-output pairs are allowed; operational semantics identifies whether an execution reaching those outputs follows the correct steps. Arithmetization must preserve the correspondence between them.

## 4. Expanding a bounded computation into a Boolean circuit

To represent a program as a circuit, fix bounds on the input length, the bit width of each value, and the number of execution steps. Under these bounds, the computation can be represented as a finite network of logic gates. A Boolean circuit takes bits (0 or 1) as inputs and outputs, and computes with gates such as AND, OR, and NOT. Wires carry values between gates, including intermediate results.

For the deposit-and-withdrawal example, first represent each amount as a bit string of a fixed width. Expand binary addition into full-adder logic, with wires carrying each bit sum and carry. Once both totals are computed, compare their bits and output 1 only if every bit matches. Thus, an operation written as one addition or comparison in a program becomes a finite collection of small gates in the circuit. The width must also be large enough for the totals, so overflow cannot make different totals appear equal.

An if-then-else branch can be represented by a selection circuit (multiplexer) controlled by the condition bit. A loop with a fixed upper bound can be unrolled by placing one copy of its circuit for each iteration. A program with unbounded input length or runtime therefore cannot be represented directly by one fixed-size circuit. Instead, use a circuit for each chosen input-size or step bound, or represent the computation step by step with an execution trace.

| Program operation | Circuit representation |
| --- | --- |
| Fixed-width integer addition | Per-bit adder gates and carry wires |
| Conditional branch | A selection circuit controlled by the condition bit |
| Loop with a fixed bound | A sequence of circuit copies, one per iteration |
| Correctness of the result | The output bits have the required value |

Circuit construction expands the operational steps of a program into a finite set of logic gates, while making the circuit's output agree with the denotationally specified function. For example, `t := x*x; y := t+1` returns $y=x^2+1$ denotationally; operationally, it computes $t$ with a multiplication and then adds 1. A circuit represents this with a multiplier, an adder and intermediate wires. Session 4 expresses relations among circuit inputs, intermediate wires and outputs as algebraic constraints such as R1CS. Over a finite field, the simple relations are $x\cdot x=t$ and $t+1=y$. If a bit is represented by a finite-field element $b$, the condition that it is either 0 or 1 is $b(b-1)=0$. Gate relations and public input/output conditions are constrained together so that only the intended computations satisfy all constraints.

These equations do not automatically have the same meaning as integer arithmetic. Finite-field operations wrap around modulo the field size. To prove an integer specification, the constraints must also enforce appropriate ranges and bit representations for inputs and intermediate values. Without those conditions, a field equation may describe a different function than the integer specification. Missing branch or termination conditions can also admit executions that the operational semantics does not allow. Arithmetization must preserve the source program's meaning; it is not merely a rewrite of equations.

## 5. Execution traces and AIR

An execution trace is a table listing states in time order from the initial state to the final state. Each row records a state at one step, and adjacent rows must obey the transition rule.

| Step | Input | Cumulative deposits $s_i$ | Cumulative withdrawals $t_i$ |
| ---: | ---: | ---: | ---: |
| 0 | — | 0 | 0 |
| 1 | $d_0=4,\ w_0=2$ | 4 | 2 |
| 2 | $d_1=3,\ w_1=5$ | 7 | 7 |

AIR encodes the state-transition sequence from operational semantics as a table and checks that the rows form a valid execution. Transition constraints check whether adjacent rows obey one step of the operational rules; boundary constraints check whether the initial and final states meet the specification. The constraints must imply the input-output condition specified denotationally. Transition equations alone may permit arbitrary starting states or traces that stop too early, so the initial condition, input correspondence, stopping point and final condition matter too. See the [execution-trace, state, transition, and boundary guide](./terms/execution-traces).

## 6. Translating meaning into constraints

Arithmetization introduces variables for intermediate values and arranges that only values corresponding to valid executions satisfy the constraints. The constraints must represent both the valid executions from operational semantics and the input-output meaning from denotational semantics. If $C_P(x,y,w)$ means that input $x$, output $y$ and auxiliary values $w$ satisfy all arithmetized constraints, verify both directions:

- If $\langle\!\langle P\rangle\!\rangle(x)=y$, then there is a $w$ containing suitable intermediate values such that $C_P(x,y,w)=1$.
- If some $w$ satisfies $C_P(x,y,w)=1$, then $y$ is the correct output of $P$ on $x$, and the intermediate values describe an allowed execution.

These are correctness conditions for translating program meaning into arithmetization. SNARK completeness and soundness are properties of a proof system for the relation $C_P$. Thus, even a sound proof system does not guarantee the intended program's correctness if the translation from the specification into $C_P$ is inaccurate.

To establish both directions, do not omit required input, output, range, branch, execution-bound or termination conditions. When integers are represented in a finite field, range constraints may also be needed to prevent wraparound modulo the field size. The [deposit and withdrawal arithmetization example](../exercises/session-04#private) shows how these conditions preserve the intended meaning.

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
