---
outline: [2, 3]
---

# Linear combinations, dot products, matrices and rank one

[Session 4](../session-04) · [Term guide](./) · [Prerequisites](../foundations)

Updated: September 27, 2026

## Select values with coefficients

Let $\mathbf z=(1,x,t,s,y)^T$. Its dot product with coefficients $(5,1,0,1,0)$ is $5+x+s$. A linear combination multiplies values by coefficients and adds them. The leading constant one lets us include constant terms.

## Read R1CS row by row

The three equations in [constraints](./constraints) use:

$$A=\begin{pmatrix}0&1&0&0&0\\0&0&1&0&0\\5&1&0&1&0\end{pmatrix},\quad
B=\begin{pmatrix}0&1&0&0&0\\0&1&0&0&0\\1&0&0&0&0\end{pmatrix},\quad
C=\begin{pmatrix}0&0&1&0&0\\0&0&0&1&0\\0&0&0&0&1\end{pmatrix}.$$

Then $A\mathbf z=(x,t,5+x+s)^T$, $B\mathbf z=(x,x,1)^T$ and $C\mathbf z=(t,s,y)^T$. The symbol $\circ$ means entrywise multiplication. Thus $(A\mathbf z)\circ(B\mathbf z)=C\mathbf z$ collects all three constraints.

Each matrix is $3\times5$, the variable vector is $5\times1$, and each product is $3\times1$. Rows are constraints; columns are variables. That correspondence helps when QAP interpolates columns.

## What rank one refers to

For one row with coefficient columns $a,b,c$, write $(a^Tz)(b^Tz)=c^Tz$. Its left side equals $z^T(ab^T)z$. Every column of the outer product $ab^T$ is a multiple of $a$, so its rank is at most one (exactly one if both vectors are nonzero).

This does not mean the full matrices $A,B,C$ have rank one. Also distinguish ordinary matrix multiplication from $\circ$.

## Check your understanding

Substitute $\mathbf z=(1,3,9,27,35)^T$.

::: details Answer
The products are $(3,9,35)^T$, $(3,3,1)^T$ and $(9,27,35)^T$. The first two multiply entrywise to the third, also over $\mathbb F_{101}$.
:::

## Read next

[Interpolation, vanishing polynomials and divisibility](./polynomials)

## Further reading

[Gennaro et al., Quadratic Span Programs and Succinct NIZKs without PCPs](https://eprint.iacr.org/2012/215) — external material in English.
