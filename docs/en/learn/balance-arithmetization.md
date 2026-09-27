---
outline: [2, 3]
---

<script setup>
import { withBase } from "vitepress";
</script>

# From balanced deposits and withdrawals to R1CS, QAP and AIR

Updated: September 27, 2026

[Session 4](./session-04) · [Term guide](./terms/) · [Exercises](../exercises/)

Take one program checking that total deposits equal total withdrawals, and translate it along two paths. Follow the correspondence between variables and constraints, including the numerical polynomials.

| Starting computation | Representation | What is checked |
| --- | --- | --- |
| Compute and compare two totals | Gates → R1CS rows → QAP polynomials | Row satisfaction / polynomial divisibility |
| The same program | States over time → AIR trace and constraints | Initial values, updates and final equality |

[Applied course: build an ERC-20 transfer ZK rollup](../rollup/) - six development stages and runnable starter models.

## 1. Fix the program and claim {#program}

### Inputs and execution

Use deposits $d_0=4,d_1=3$ and withdrawals $w_0=2,w_1=5$. There are exactly two entries on each side, each an integer from zero to seven. Use an arbitrary smallest unit, without floating-point amounts.

```python
def balanced(deposits, withdrawals):
    if len(deposits) != 2 or len(withdrawals) != 2:
        return False
    if not all(type(x) is int and 0 <= x <= 7
               for x in deposits + withdrawals):
        return False
    s = 0
    t = 0
    for i in range(2):
        s += deposits[i]
        t += withdrawals[i]
    return s == t

print(balanced([4, 3], [2, 5]))  # True: 7 == 7
```

### Public inputs and field arithmetic

All four amounts are public inputs in this example. The verifier first checks their count and range. Totals and intermediate states are auxiliary assignment values. The prover must not substitute different public amounts.

Work over $\mathbb F_{101}$. With the range checks, each total is at most 14, so field equality agrees with integer equality. This is an arithmetization exercise: public totals are already easy to check directly. [Private amounts](#private) need additional conditions.

## 2. R1CS: three constraints {#r1cs}

### 2.1 Unroll the loop

Name the two totals $s_D,s_W$:

$$(d_0+d_1)\cdot1=s_D,\qquad(w_0+w_1)\cdot1=s_W,\qquad(s_D-s_W)\cdot1=0.$$

An addition-only program fits R1CS by making one of the linear factors equal to one. The last row requires the program's comparison to return true.

### 2.2 Variable vector and matrices

Fix column order:

$$\mathbf z=(1,d_0,d_1,w_0,w_1,s_D,s_W)^T.$$

$$
A=\begin{pmatrix}
0&1&1&0&0&0&0\\
0&0&0&1&1&0&0\\
0&0&0&0&0&1&-1
\end{pmatrix},\quad
B=\begin{pmatrix}
1&0&0&0&0&0&0\\
1&0&0&0&0&0&0\\
1&0&0&0&0&0&0
\end{pmatrix},\quad
C=\begin{pmatrix}
0&0&0&0&0&1&0\\
0&0&0&0&0&0&1\\
0&0&0&0&0&0&0
\end{pmatrix}.
$$

Rows are constraints; columns are variables. Each matrix is $3\times7$, multiplied by a $7\times1$ vector. The coefficient $-1$ equals 100 in this field. See [linear combinations and matrices](./terms/linear-algebra).

### 2.3 Substitute the values

For $\mathbf z=(1,4,3,2,5,7,7)^T$:

$$A\mathbf z=(7,7,0)^T,\quad B\mathbf z=(1,1,1)^T,\quad C\mathbf z=(7,7,0)^T.$$

Every entry of $(A\mathbf z)\circ(B\mathbf z)-C\mathbf z$ is zero. Change withdrawals to 2 and 6 and honestly report total 8: the last residual becomes $7-8=100\pmod{101}$. Falsely report total 7 instead: the second row fails with residual one.

::: details Could we use fewer constraints?
Yes. This example can be optimized to $(d_0+d_1-w_0-w_1)\cdot1=0$. We retain three rows to show intermediate totals and their correspondence to the program.
:::

## 3. QAP: turn rows into a polynomial condition {#qap}

### 3.1 Assign row evaluation points

Map the three rows to field points 1, 2 and 3. The Lagrange basis is

$$L_1(X)=\frac{(X-2)(X-3)}2,\quad L_2(X)=-(X-1)(X-3),\quad L_3(X)=\frac{(X-1)(X-2)}2.$$

$L_j(i)$ equals one when $i=j$, and zero otherwise. Here $1/2=51$ in the field. The indeterminate $X$ encodes row positions, not an amount.

### 3.2 Interpolate each matrix column

For example, A's $d_0$ column $(1,0,0)^T$ becomes $L_1$; its $s_W$ column $(0,0,-1)^T$ becomes $-L_3$.

| Variable column | $A_j(X)$ | $B_j(X)$ | $C_j(X)$ |
| --- | --- | --- | --- |
| Constant 1 | 0 | $L_1+L_2+L_3=1$ | 0 |
| $d_0$ | $L_1$ | 0 | 0 |
| $d_1$ | $L_1$ | 0 | 0 |
| $w_0$ | $L_2$ | 0 | 0 |
| $w_1$ | $L_2$ | 0 | 0 |
| $s_D$ | $L_3$ | 0 | $L_1$ |
| $s_W$ | $-L_3$ | 0 | $L_2$ |

Weight these polynomials by the assignment values:

$$
\begin{aligned}
a(X)&=(d_0+d_1)L_1+(w_0+w_1)L_2+(s_D-s_W)L_3,\\
b(X)&=1,\\
c(X)&=s_DL_1+s_WL_2.
\end{aligned}
$$

### 3.3 Check divisibility

For the valid assignment, $a=c=7L_1+7L_2$. Expanding modulo 101:

$$a(X)=c(X)=47X^2+61X,\qquad b(X)=1.$$

The vanishing polynomial for the row points is

$$Z(X)=(X-1)(X-2)(X-3)=X^3-6X^2+11X-6.$$

The QAP condition is $ab-c=HZ$. Here the difference is identically zero, so **$H=0$**. This is expected for these linear constraints with $b=1$. R1CS instances involving multiplication can have a nonzero quotient even for valid assignments.

### 3.4 An invalid assignment

For withdrawals 2 and 6 with $s_D=7,s_W=8$:

$$a(X)b(X)-c(X)=-L_3(X)=50X^2+52X+100.$$

It vanishes at 1 and 2 but equals 100 at 3. Division by $Z$ leaves this nonzero quadratic as the remainder. The failed R1CS row becomes failed QAP divisibility.

We check full polynomials here. A proof system checking a random point additionally needs degree bounds and fixation of the polynomials before the challenge.

## 4. AIR: represent the loop as a trace {#air}

### 4.1 States before and after processing

Let $S_i,T_i$ be cumulative deposit and withdrawal totals. Row $i$ is the state after processing $i$ entries; $D_i,W_i$ contain the next amounts.

| Row | Next deposit $D_i$ | Next withdrawal $W_i$ | Deposit total $S_i$ | Withdrawal total $T_i$ |
| --- | --- | --- | --- | --- |
| 0 | 4 | 2 | 0 | 0 |
| 1 | 3 | 5 | 4 | 2 |
| 2 | 0 | 0 | 7 | 7 |

The last amount entries are padding, not a third transaction. There is no transition out of the final row.

### 4.2 All required constraints

| Kind | Condition | Purpose |
| --- | --- | --- |
| Initial boundary | $S_0=T_0=0$ | Start totals at zero |
| Input binding | $D_0=d_0,D_1=d_1,W_0=w_0,W_1=w_1$ | Process the specified public inputs |
| Padding | $D_2=W_2=0$ | Fix the unused row's representation |
| Transition, $i=0,1$ | $S_{i+1}-S_i-D_i=0$ | Add a deposit |
| Transition, $i=0,1$ | $T_{i+1}-T_i-W_i=0$ | Add a withdrawal |
| Final boundary | $S_2-T_2=0$ | Compare final totals |

Transitions alone allow a different input schedule; boundaries alone permit false intermediate states. Input binding, boundaries and transitions together represent the program.

### 4.3 Interpolate the columns

Assign points $X=1,2,3$ to rows 0, 1, 2. The degree-at-most-two polynomials are

$$
\begin{aligned}
D(X)&=100X^2+2X+3,\\
W(X)&=97X^2+15X+92,\\
S(X)&=50X^2+56X+96,\\
T(X)&=52X^2+48X+1.
\end{aligned}
$$

Evaluate modulo 101: for example $S(1)=0,S(2)=4,S(3)=7$. QAP interpolated coefficient-matrix columns; here we interpolate trace columns.

### 4.4 Turn transitions into divisibility

Use $X+1$ to refer to the next row in this small example. Transitions apply only at points 1 and 2, so let $Z_{\mathrm{tr}}=(X-1)(X-2)$. Expanding gives

$$
\begin{aligned}
S(X+1)-S(X)-D(X)&=X^2-3X+2=Z_{\mathrm{tr}}(X),\\
T(X+1)-T(X)-W(X)&=4X^2-12X+8=4Z_{\mathrm{tr}}(X).
\end{aligned}
$$

The quotients are 1 and 4, with zero remainders. A transition expression need not be identically zero: it must vanish at the designated transition points.

Boundary conditions also have a polynomial interpretation. $S(1)=T(1)=0$ requires divisibility of $S,T$ by $X-1$; $S(3)=T(3)$ requires divisibility of $S-T$ by $X-3$. Input binding checks $D(1)=4,D(2)=3,W(1)=2,W(2)=5$, and padding checks $D(3)=W(3)=0$.

Practical STARKs often use multiplicative domains and a $gX$ next-row shift. These three additive points illustrate AIR by hand; they are not parameters for a particular STARK implementation.

### 4.5 Tamper with an intermediate value

Change $T_1$ from 2 to 3 while retaining final total 7. Initial and final boundaries pass, but transition residuals become $3-0-2=1$ and $7-3-5=-1$. Both fail. Matching final totals alone does not establish correct intermediate computation.

## 5. Compare the representations {#compare}

| Program element | R1CS → QAP | AIR |
| --- | --- | --- |
| Amount inputs | Fixed public-input columns | Trace amount columns bound to public inputs |
| Accumulation | Total variables and addition constraints | Cumulative states and transitions |
| Final comparison | Third row → evaluation at point 3 | Final boundary |
| Interpolated objects | Coefficient-matrix columns | Trace columns |
| Divisibility here | $ab-c=HZ$ with $H=0$ | Transition quotients 1 and 4, plus boundaries |

Both check the same claim for the same inputs. This example establishes no speed or proof-size ranking. Each arithmetization still needs a proof protocol built around it.

## 6. Private amounts and ranges {#private}

If amounts are private, the verifier cannot read them to check the range. For each amount $v$, introduce

$$v=b_0+2b_1+4b_2,\qquad b_k(b_k-1)=0\quad(k=0,1,2).$$

In R1CS this adds three bit constraints and one reconstruction constraint per amount: 16 additional rows, or 19 including the original three. Interpolate again at 19 points; the three-point QAP above is no longer the complete system.

In AIR, add bit columns and constrain bitness and reconstruction at rows processing amounts. State which rows receive these constraints, including how padding is treated.

Why ranges? Deposits $4+3=7$ and withdrawals $60+48=108$ differ as integers but agree modulo 101. The arithmetic core accepts; the declared program rejects the out-of-range inputs. Without ranges, field equality does not establish conservation of integer amounts.

Private values also need to be tied to the intended transaction data, for example through a public commitment. Otherwise choosing every amount to be zero satisfies equality. Range, data binding and zero knowledge are distinct requirements.

## 7. Run the Python example {#run}

<a :href="withBase('/examples/balance_arithmetization.py')" download>Download the Python file</a>. It uses only the Python 3.8+ standard library. In the directory containing the saved file, run:

```sh
python3 balance_arithmetization.py
python3 balance_arithmetization.py 4 3 2 6
python3 balance_arithmetization.py --self-test
```

The first accepts all three representations; the second rejects all three. Coefficient lists are constant-first: `[0, 61, 47]` means $47X^2+61X$.

The self-test exhausts all $8^4=4096$ declared inputs and compares the program against R1CS, QAP and AIR checks. It also tests intermediate-value tampering, public-input substitution and modular wraparound. These are arithmetic checks, not a cryptographic security proof or a SNARK/STARK prover.

## References and related pages

- [Session 4](./session-04)
- [Constraints](./terms/constraints), [interpolation and divisibility](./terms/polynomials), [execution traces](./terms/execution-traces)
- Gennaro et al., [Quadratic Span Programs and Succinct NIZKs without PCPs](https://eprint.iacr.org/2012/215) — QAP background
- Ben-Sasson et al., [Scalable, transparent, and post-quantum secure computational integrity](https://eprint.iacr.org/2018/046) — AIR/STARK background
- Thaler, [Proofs, Arguments, and Zero-Knowledge](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf) — further reading on circuits and polynomial proof systems
