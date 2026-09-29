# Finite fields and polynomials: a compact tutorial for ZK

Author: Shigeichiro Yamasaki  
Created: September 29, 2026  
Last updated: September 29, 2026

[Prerequisites and resources](./foundations) · [Session 3: Finite fields, polynomials and probabilistic testing](./session-03) · [Session 4: Arithmetization](./session-04)

This tutorial introduces the finite-field and polynomial ideas used in the course. It focuses on the tools needed for interpolation and the Schwartz–Zippel lemma in Session 3, R1CS/QAP in Session 4, Reed–Solomon codes in Session 5, and FRI in Session 6. The explanations and examples are original to this page; the scope is a practical subset of a much broader subject.

## 1. What can we do in a finite field?

A field is a number system with addition, subtraction and multiplication, where every nonzero element also has a multiplicative inverse. The rational and real numbers form fields, but exact computer arithmetic with real numbers is difficult. Cryptographic proof systems use finite fields so every operation is exact and has only finitely many possible values.

For a prime $p$, the finite field $\mathbb F_p$ performs arithmetic on integers modulo $p$. In $\mathbb F_7$,

$$5+6=11\equiv4,\qquad 5\cdot3=15\equiv1\pmod7.$$

Thus 3 is the multiplicative inverse of 5: $5^{-1}=3$. Every nonzero element has an inverse. If the modulus is composite, this can fail: modulo 6, $2$ is nonzero but $2\cdot3\equiv0$, so 2 has no inverse. This is why we use a prime modulus for this simple construction.

| Operation | Example in $\mathbb F_7$ | Result |
| --- | --- | --- |
| Addition | $5+6$ | $4$ |
| Multiplication | $5\cdot3$ | $1$ |
| Inverse | $5^{-1}$ | $3$ |
| Subtraction | $2-5$ | $4$ |

### A hand-calculation rule

When subtraction gives a negative number, add 7 until the answer is between 0 and 6. Division $a/b$ means multiplying by the inverse $b^{-1}$, that is, $a\cdot b^{-1}$ for $b\ne0$. For example, $2/5=2\cdot3=6$ in $\mathbb F_7$.

## 2. Build a larger finite field from polynomials

Proof systems sometimes use fields with $p^k$ elements, not just the prime field $\mathbb F_p$. One construction represents elements as remainders of polynomials divided by an irreducible polynomial.

Take $m(X)=X^2+X+1$ in $\mathbb F_2[X]$. Substituting either 0 or 1 gives a nonzero value, so this quadratic has no root and is irreducible over $\mathbb F_2$. Now consider

$$\mathbb F_2[X]/(X^2+X+1).$$

Write $\alpha$ for the residue class of $X$. Since $\alpha^2+\alpha+1=0$,

$$\alpha^2=\alpha+1.$$

The field has four elements: $0,1,\alpha,\alpha+1$. Addition is coefficient-wise XOR; for multiplication, multiply first and then reduce powers using $\alpha^2=\alpha+1$. For example,

$$\alpha(\alpha+1)=\alpha^2+\alpha=(\alpha+1)+\alpha=1,$$

so $\alpha^{-1}=\alpha+1$. **Irreducibility is what ensures that every nonzero residue class has an inverse, making the quotient a field.**

More generally, quotienting $\mathbb F_p[X]$ by an irreducible polynomial $m(X)$ of degree $k$ gives a finite field with $p^k$ elements. Implementations choose an extension field whose arithmetic fits their protocol and hardware needs.

## 3. Polynomial rings and polynomial arithmetic

$\mathbb F_p[X]$ is the set of polynomials whose coefficients come from $\mathbb F_p$. The symbol $X$ is an indeterminate: no particular field element has been substituted yet. All coefficient calculations use field arithmetic.

For example, in $\mathbb F_7[X]$, let

$$f(X)=3X^2+5X+6,\qquad g(X)=2X+4.$$

Adding their coefficients modulo 7 gives

$$f(X)+g(X)=3X^2+0X+3.$$

To multiply polynomials, multiply terms and add coefficients of equal powers. Store the coefficients of $f$ in constant-first order as $(f_0,f_1,f_2)=(6,5,3)$. Multiplication by $g(X)=g_0+g_1X$ can be written as a convolution matrix times a vector:

$$
\begin{pmatrix}
g_0&0&0\\
g_1&g_0&0\\
0&g_1&g_0\\
0&0&g_1
\end{pmatrix}
\begin{pmatrix}f_0\\f_1\\f_2\end{pmatrix}
=
\begin{pmatrix}h_0\\h_1\\h_2\\h_3\end{pmatrix},
\qquad h(X)=f(X)g(X).
$$

Every product and sum is in the coefficient field. This shows how polynomial multiplication can be implemented as a matrix operation on coefficient vectors.

Polynomial division has a quotient and remainder, just as integer division does. For $g\ne0$, there are unique polynomials $q(X),r(X)$ such that

$$f(X)=q(X)g(X)+r(X),\qquad r=0\ \text{or}\ \deg r<\deg g.$$

If the remainder is zero, $g$ divides $f$. QAP uses this fact.

### A polynomial and the function it defines

A polynomial is a formal expression; it can also be evaluated as a function on the field. Over a finite field, different formal polynomials can define the same function. For every $a\in\mathbb F_p$, $a^p=a$. Therefore $X^p-X$ is a nonzero polynomial, yet evaluates to zero at every point of $\mathbb F_p$.

So “the polynomial is identically zero” and “the polynomial evaluates to zero at every field element” need not mean the same thing. Never infer that two polynomials are identical from their evaluations without checking the degree bound.

## 4. Roots, interpolation and vanishing polynomials

A nonzero polynomial $f$ of degree $d$ over a field has at most $d$ roots. For example, $f(X)=(X-1)(X-3)$ is zero at 1 and 3. If more than $d$ distinct roots are found, the polynomial must be zero.

Given distinct points $r_1,\ldots,r_n$ and values $y_1,\ldots,y_n$, there is exactly one polynomial of degree below $n$ that takes those values. This is interpolation. It does not “fit a nearby curve”; it constructs a polynomial that passes exactly through the specified points. See the [interpolation section in Session 3](./session-03#_3-3-lagrange-interpolation).

The polynomial

$$Z_D(X)=\prod_{i=1}^{n}(X-r_i)$$

vanishes at every point in $D=\{r_1,\ldots,r_n\}$ and is called the vanishing polynomial of that set. A polynomial $F$ vanishes at every distinct point in $D$ exactly when $Z_D$ divides $F$. This lets a QAP combine many row constraints into one divisibility condition. The [QAP tutorial](./qap) works through that transformation using the course example.

## 5. Testing at a random point

If $f$ is a nonzero polynomial of degree at most $d$ and $r$ is chosen uniformly from a finite set $S$, then

$$\Pr[f(r)=0]\le \frac{d}{|S|}.$$

This is the basic form of the Schwartz–Zippel lemma. A nonzero polynomial has at most $d$ roots, so the chance of accidentally sampling one decreases as the candidate set grows. For example, for degree at most 4 and $|S|=101$, the false-zero probability is at most $4/101$. With $|S|=1009$, it is at most $4/1009$. If $d\ge|S|$, the bound is at least 1 and gives no useful guarantee.

In a proof protocol, the polynomial must be fixed before the challenge is selected, and its degree bound must be enforced. If the prover can choose the polynomial after seeing the challenge, this simple argument does not establish security. Session 3 and the [FRI lesson in Session 6](./session-06) explain how this probabilistic check is used.

## 6. Connection to Reed–Solomon codes

Take a polynomial $f$ of degree below $k$ and evaluate it at $n$ distinct points:

$$\bigl(f(r_1),f(r_2),\ldots,f(r_n)\bigr).$$

This is the basic Reed–Solomon encoding. The difference between two distinct polynomials of degree below $k$ also has degree below $k$, so they can agree at no more than $k-1$ points. Their codewords therefore differ in at least $n-k+1$ positions, giving minimum distance $n-k+1$.

Evaluation turns a polynomial into a vector; coding theory explains how to recognize or recover the low-degree polynomial despite some corrupted values. This connects the error-correcting codes in [Session 5](./session-05) to FRI in [Session 6](./session-06).

## Where these ideas appear in the course

| Session | Tools used |
| --- | --- |
| 3 | Finite-field arithmetic, polynomial rings, interpolation, roots, Schwartz–Zippel |
| 4 | Variable vectors, polynomial constraints, vanishing polynomials, QAP divisibility |
| 5 | Polynomial evaluation vectors, Reed–Solomon codes, minimum distance |
| 6 | Low-degree testing, random challenges over a finite field, FRI |

## References

- Rudolf Lidl and Harald Niederreiter, *Finite Fields*, 2nd ed., Cambridge University Press. The [publisher's book information and contents](https://www.cambridge.org/core/books/finite-fields/75BDAA74ABAE713196E718392B9E5E72) include algebraic foundations, finite-field structure, and polynomials over finite fields. This tutorial uses that scope as a guide and rebuilds the material for this course with original explanations and examples.
- [Session 3: Finite fields, polynomials and probabilistic testing](./session-03)
- [Session 4: QAP tutorial](./qap)
