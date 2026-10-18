---
outline: [2, 3]
---

# Linear combinations, dot products, matrices, and Rank-1

[Back to Session 4](../session-04) · [Term guide](./) · [Prerequisites](../foundations)

Updated: October 17, 2026

This page connects examples to the general definitions: what an R1CS matrix computes, and what “Rank-1” refers to. Unless stated otherwise, all operations are over a field $K$. ZK arithmetization commonly uses a finite field such as $K=\mathbb F_p$.

## 1. Vectors and linear combinations

Let $K$ be a field. The set $K^n$ consists of column vectors with $n$ entries from $K$. For example,

$$\mathbf z=(z_1,\ldots,z_n)^T\in K^n$$

forms a vector space with componentwise addition and scalar multiplication by elements of $K$. Given coefficients $a_1,\ldots,a_n\in K$, the expression

$$a_1z_1+\cdots+a_nz_n=\sum_{j=1}^{n}a_jz_j$$

is a **linear combination** of the components $z_j$. Writing the coefficients as a column vector $\mathbf a=(a_1,\ldots,a_n)^T$, this becomes

$$\mathbf a^T\mathbf z=\sum_{j=1}^{n}a_jz_j\in K.$$

This is the **dot product** (or inner product) of $\mathbf a$ and $\mathbf z$; its result is one field element, not a vector. Here “inner product” means this standard coordinate-wise sum of products. Over finite fields, we do not assume the usual real inner-product notion of positive length; we use only the algebraic expression $\mathbf a^T\mathbf z$.

For example, if $\mathbf z=(1,x,t,s,y)^T$ and $\mathbf a=(5,1,0,1,0)^T$, then

$$\mathbf a^T\mathbf z=5\cdot1+1\cdot x+0\cdot t+1\cdot s+0\cdot y=5+x+s.$$

The leading constant $1$ lets us include a constant term in the same coefficient expression.

## 2. A matrix product computes many linear combinations

Let $A=(A_{ij})\in K^{m\times n}$ be an $m$-by-$n$ matrix. The product $A\mathbf z$ is a column of $m$ linear combinations, defined by

$$A\mathbf z=\begin{pmatrix}
\sum_{j=1}^{n}A_{1j}z_j\\
\sum_{j=1}^{n}A_{2j}z_j\\
\vdots\\
\sum_{j=1}^{n}A_{mj}z_j
\end{pmatrix}\in K^m.$$

Thus **row $i$** forms one linear combination of the input vector, while **column $j$** supplies the coefficient of variable $z_j$ to each row. A matrix is also a coordinate representation of a linear map from $K^n$ to $K^m$.

The dimensions follow from this definition: if $A$ is $m\times n$ and $\mathbf z$ is $n\times1$, then $A\mathbf z$ is $m\times1$. This lets us collect $m$ constraints and $n$ variables in three matrices and one variable vector.

## 3. Definition of an R1CS

An R1CS (Rank-1 Constraint System) consists of a variable vector $\mathbf z\in K^n$ and three coefficient matrices

$$A,B,C\in K^{m\times n},$$

representing $m$ constraints over the field $K$. The symbol $\circ$ denotes the **Hadamard product** (entrywise product): for $\mathbf u,\mathbf v\in K^m$,

$$\mathbf u\circ\mathbf v=(u_1v_1,\ldots,u_mv_m)^T.$$

An assignment $\mathbf z$ satisfies the R1CS when the following vector equation holds:

$$\boxed{(A\mathbf z)\circ(B\mathbf z)=C\mathbf z}.$$

This does not mean the ordinary matrix product $(A\mathbf z)(B\mathbf z)$. It means multiplying components with the same row index in the two $m$-dimensional vectors. If row $i$ of the matrices is written as coefficient vectors $\mathbf a_i,\mathbf b_i,\mathbf c_i\in K^n$, then the condition is

$$\boxed{(\mathbf a_i^T\mathbf z)(\mathbf b_i^T\mathbf z)=\mathbf c_i^T\mathbf z\qquad(i=1,\ldots,m)}.$$

In other words, each constraint forms two linear combinations of the variables, multiplies them, and sets their product equal to a third linear combination. Rows of $A,B,C$ specify the left factor, right factor, and right-hand side, respectively.

## 4. Example: collect three constraints into matrices

Let

$$\mathbf z=(1,x,t,s,y)^T$$

and consider these three conditions:

$$x\cdot x=t,\qquad x\cdot t=s,\qquad (5+x+s)\cdot1=y.$$

The matrices are

$$A=\begin{pmatrix}0&1&0&0&0\\0&0&1&0&0\\5&1&0&1&0\end{pmatrix},\quad
B=\begin{pmatrix}0&1&0&0&0\\0&1&0&0&0\\1&0&0&0&0\end{pmatrix},\quad
C=\begin{pmatrix}0&0&1&0&0\\0&0&0&1&0\\0&0&0&0&1\end{pmatrix}.$$

Multiplying each matrix by $\mathbf z$ gives

$$A\mathbf z=(x,t,5+x+s)^T,\quad B\mathbf z=(x,x,1)^T,\quad C\mathbf z=(t,s,y)^T.$$

The R1CS vector equation is therefore

$$ (x,t,5+x+s)^T\circ(x,x,1)^T=(t,s,y)^T.$$

Read component by component, the first two rows state $x^2=t$ and $xt=s$, while the third states $(5+x+s)\cdot1=y$. Substituting $\mathbf z=(1,3,9,27,35)^T$ gives $(9,27,35)^T$ on the left, equal to $C\mathbf z$. Over a finite field, all additions and multiplications use that field's operations.

## 5. What “Rank-1” refers to

For a single constraint,

$$ (\mathbf a^T\mathbf z)(\mathbf b^T\mathbf z)=\mathbf c^T\mathbf z,$$

the left side expands as

$$ (\mathbf a^T\mathbf z)(\mathbf b^T\mathbf z)=\mathbf z^T(\mathbf a\mathbf b^T)\mathbf z.$$

Here $\mathbf a\mathbf b^T$ is the $n\times n$ outer product, whose $(j,k)$ entry is $a_jb_k$. Each column is a scalar multiple of $\mathbf a$, so

$$\operatorname{rank}(\mathbf a\mathbf b^T)\leq1$$

(and the rank is exactly one when neither vector is zero). **Rank-1 means that the quadratic part of each constraint factors as a product of two linear forms.** It does not mean that the full matrices $A,B,C$ have rank one.

The right-hand side $\mathbf c^T\mathbf z$ is linear; the claim is not that a coefficient matrix for the whole equation, including that right-hand side, has rank one. R1CS equates this linear expression to the product of two linear forms.

## Check your understanding

Substitute $\mathbf z=(1,3,9,27,35)^T$, compute the linear combinations in each row, and verify the three constraints using the entrywise product.

::: details Answer

$A\mathbf z=(3,9,35)^T$, $B\mathbf z=(3,3,1)^T$, and $C\mathbf z=(9,27,35)^T$. The entrywise product of the first two is $(9,27,35)^T=C\mathbf z$. Over $\mathbb F_{101}$, these values have the same representatives because they are all less than 101.

:::

## Read next

[Interpolation, vanishing polynomials, and polynomial divisibility](./polynomials)

## Further reading

[1] [Gennaro et al., Quadratic Span Programs and Succinct NIZKs without PCPs](https://eprint.iacr.org/2012/215) — Further reading in English; first work through the example on this page.
