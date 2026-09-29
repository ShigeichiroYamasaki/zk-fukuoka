# QAP: Combining R1CS constraints into a polynomial

Author: Shigeichiro Yamasaki  
Created: September 29, 2026  
Last updated: September 29, 2026

[Prerequisites and resources](./foundations) · [Session 4](./session-04) · [Linear algebra terms](./terms/linear-algebra) · [Polynomial terms](./terms/polynomials)

## What does a QAP do?

R1CS describes a computation using several constraints. A QAP (Quadratic Arithmetic Program) represents those constraints as a polynomial relation. This short guide follows one example from Session 4: knowing an $x$ such that $x^3+x+5=35$.

All calculations below take place in the finite field $\mathbb F_{101}$. Unless a range restriction is added, arithmetic wraps modulo 101.

## 1. Split the computation into three constraints

Introduce intermediate values $t=x^2$ and $s=tx$. The computation becomes

$$x\cdot x=t,\qquad t\cdot x=s,\qquad (s+x+5)\cdot1=y.$$

Fix the public output $y=35$. For $x=3$, we have $t=9$, $s=27$, and $y=35$, so all three conditions hold. Write each row as “left value × right value = output value.”

| Constraint row $i$ | Left value $L_i$ | Right value $R_i$ | Output $O_i$ | Check for this example |
| --- | --- | --- | --- | --- |
| 1 | $x$ | $x$ | $t$ | $3\cdot3=9$ |
| 2 | $t$ | $x$ | $s$ | $9\cdot3=27$ |
| 3 | $s+x+5$ | $1$ | $y$ | $35\cdot1=35$ |

Here $L_i,R_i,O_i$ are row values after substituting the assignment. In R1CS, each is formed as a linear combination of the variable vector, and every row checks whether the product of its left and right values equals its output. See the [linear algebra guide](./terms/linear-algebra) for the matrix form.

## 2. Turn the row values into polynomials

Assign distinct points $r_1=1$, $r_2=2$, and $r_3=3$ to the three constraint rows. Let $L(X)$ interpolate the left values, $R(X)$ the right values, and $O(X)$ the output values. In other words, construct polynomials that take these values:

$$
\begin{array}{c|ccc}
 & X=1 & X=2 & X=3\\ \hline
L(X) & 3 & 9 & 35\\
R(X) & 3 & 3 & 1\\
O(X) & 9 & 27 & 35
\end{array}
$$

Values at three distinct points determine a unique interpolating polynomial of degree below three. In the formal QAP construction, the columns of the R1CS matrices are interpolated before the assignment is substituted. Combining those polynomials with the assignment values yields the $L(X),R(X),O(X)$ above. Interpolation preserves linear combinations, so the matrix calculation is represented in polynomial form.

## 3. Combine the checks as one divisibility condition

Form the difference

$$F(X)=L(X)R(X)-O(X).$$

For a valid assignment, each row satisfies left × right = output, so

$$F(1)=F(2)=F(3)=0.$$

Define the polynomial that has these three points as roots:

$$Z(X)=(X-1)(X-2)(X-3).$$

By the factor theorem, $F$ vanishes at all three points exactly when $Z$ divides $F$. Thus the three row constraints can be represented together by asking whether some polynomial $H(X)$ satisfies

$$L(X)R(X)-O(X)=H(X)Z(X).$$

The roots of $Z(X)$ mark the constraint rows being checked.

### What if one constraint fails?

Keep $x=3$ but assign the wrong value $t=10$. On the first row,
$L(1)R(1)-O(1)=3\cdot3-10=-1=100$ in $\mathbb F_{101}$. Therefore $F(1)\ne0$, and $Z$ cannot divide $F$. Making the other rows look valid does not erase this violation.

## What becomes simpler, and what is still needed?

R1CS lists one condition per row; a QAP combines them into one polynomial identity or divisibility condition. This gives SNARKs a basis for succinctly checking a large constraint system.

Writing a QAP does not by itself produce a zero-knowledge proof. Nor does checking an identity at one random point give certainty; it only makes the chance of an undetected error small under the required assumptions. A proof system must also enforce degree bounds, fix polynomials before the challenge, and provide commitments or other cryptographic verification. Groth16 uses a trusted setup and pairings to check the QAP relation in a proof.

## Check your understanding

Why should each constraint row be assigned a distinct point among the roots of $Z(X)$?

::: details Answer
Each row must be checked at its own point. If multiple rows shared a point, seeing $F=0$ there would not check those rows individually. Distinct roots let the factor theorem connect each row’s condition to divisibility by the product polynomial.
:::

## Further reading

This guide uses an original example and wording while following the general idea of interpolating R1CS columns and combining the result into a QAP relation.

- [RareSkills, “Quadratic Arithmetic Programs”](https://rareskills.io/post/quadratic-arithmetic-program) — a detailed explanation in English.
- [Session 4: Arithmetization and complexity theory](./session-04) — R1CS, QAP and AIR.
