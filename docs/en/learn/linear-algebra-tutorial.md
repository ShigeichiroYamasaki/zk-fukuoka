# Vectors and matrices: linear algebra for ZK arithmetization

Author: Shigeichiro Yamasaki  
Created: September 29, 2026  
Last updated: September 29, 2026

This tutorial defines vectors and matrices not merely as computational notation, but as elements of vector spaces and linear maps between those spaces. This perspective makes it easier to understand how matrices translate computations into constraints in Session 4’s R1CS, and how QAP turns those constraints into polynomials.

## 1. Choose a field first

The number system used for coefficients in linear algebra is called a **field**, denoted here by $\mathbb K$. A field supports addition, subtraction, multiplication, and division by nonzero elements. The real numbers $\mathbb R$ are a familiar example; cryptography and zero-knowledge proofs often use a finite field $\mathbb F_p$ or an extension field.

Throughout, scalars are elements of $\mathbb K$. In cryptographic computations, equations may be interpreted over a specified finite field rather than over the real numbers. Addition and multiplication then follow the field operations (for example, in $\mathbb F_7$, $5+4=2$).

## 2. Definition of a vector space

A **vector space** $V$ over a field $\mathbb K$ is a set equipped with vector addition $u+v$ and scalar multiplication $a\cdot v$ for $a\in\mathbb K$ and $u,v\in V$. These operations must be closed in $V$ and satisfy familiar rules such as

$$
u+v=v+u,\quad (u+v)+w=u+(v+w),\quad
a(u+v)=au+av,\quad (a+b)v=av+bv,\quad
a(bv)=(ab)v,\quad 1v=v.
$$

The space also has an additive zero $0_V$ and an additive inverse $-v$ for each $v$. Intuitively, vectors can be added and multiplied by field scalars, and these operations obey distributivity and the other usual laws.

### Example: $\mathbb K^n$

The set of columns containing $n$ field elements,

$$
v=(v_1,\ldots,v_n)^T\in\mathbb K^n,
$$

is a vector space over $\mathbb K$. Addition and scalar multiplication are componentwise:

$$
(v_1,\ldots,v_n)^T+(w_1,\ldots,w_n)^T
=(v_1+w_1,\ldots,v_n+w_n)^T,\qquad
a(v_1,\ldots,v_n)^T=(av_1,\ldots,av_n)^T.
$$

A vector need not be a geometric arrow. A column of finite-field elements is also a vector because it obeys the same operations and laws.

## 3. Scalar multiplication and linearity

The operation $v\mapsto av$, where $a\in\mathbb K$ acts on a vector $v$, is called **scalar multiplication**. The vector-space axioms ensure that this action is compatible with addition.

A map $T:V\to W$ between vector spaces is **linear** if, for all $u,v\in V$ and $a,b\in\mathbb K$,

$$
T(au+bv)=aT(u)+bT(v).
$$

Equivalently, it preserves both addition, $T(u+v)=T(u)+T(v)$, and scalar multiplication, $T(av)=aT(v)$. A linear map is a transformation that preserves these two operations.

For example, $T(x,y)=(x+y,2x-y)$ is a linear map from $\mathbb K^2$ to $\mathbb K^2$:

$$
T\begin{pmatrix}x\\y\end{pmatrix}
=\begin{pmatrix}1&1\\2&-1\end{pmatrix}
\begin{pmatrix}x\\y\end{pmatrix}.
$$

By contrast, $T(x,y)=(x+y+1,2x-y)$ is not linear because it includes a constant term. If we augment the vector with a constant $1$, writing $z=(1,x,y)^T$, such an affine expression can also be written as a matrix times a vector. One reason R1CS places $1$ at the start of its variable vector is to include constant terms among linear combinations.

## 4. A matrix represents a linear map between vector spaces

An $m\times n$ matrix $A$ with entries in $\mathbb K$ defines a linear map from $\mathbb K^n$ to $\mathbb K^m$ by matrix multiplication:

$$
T_A(v)=Av,\qquad A\in\mathbb K^{m\times n},\quad v\in\mathbb K^n.
$$

Each output component is the dot product of a row of $A$ with the input vector—a linear combination of its components:

$$
(Av)_i=\sum_{j=1}^{n}A_{ij}v_j.
$$

Thus, each **row** forms one output linear combination, while each **column** describes how an input variable contributes to the outputs. A matrix is a coordinate table for a linear map once bases have been chosen. Composition of maps corresponds to matrix multiplication: applying $B$ first and then $A$ gives $A(Bv)=(AB)v$.

## 5. Dot products, componentwise products, and linear combinations

For vectors $a,z\in\mathbb K^n$ of the same length, their **dot product** is

$$
a^Tz=\sum_{j=1}^{n}a_jz_j.
$$

It returns one scalar and forms a linear combination of the components of $z$. A matrix product $Az$ computes many such linear combinations at once.

Distinguish this from the **componentwise product**:

$$
u\circ v=(u_1v_1,\ldots,u_mv_m)^T.
$$

The dot product $u^Tv$ returns one number, whereas $u\circ v$ returns a vector of the same length. In the R1CS equation

$$
(Az)\circ(Bz)=Cz,
$$

$Az$ and $Bz$ form columns of linear combinations; the componentwise product computes the left side of each constraint, which is then compared with $Cz$.

## 6. Reading a Rank-1 Constraint System (R1CS) with linear algebra

Given a vector $z$ containing public inputs and a witness, R1CS uses matrices $A,B,C$ and requires

$$
(Az)\circ(Bz)=Cz.
$$

Each matrix has dimensions $m\times n$, and $z\in\mathbb K^n$, so $Az,Bz,Cz\in\mathbb K^m$. The componentwise equality represents $m$ constraints.

For row $i$, let $a_i^T,b_i^T,c_i^T$ be the corresponding row vectors. The constraint becomes

$$
(a_i^Tz)(b_i^Tz)=c_i^Tz.
$$

The left side is a product of two linear forms; the right side is one linear form. This is a **rank-1 constraint**. It does not mean that the full matrices $A,B,C$ have rank 1. Stacking constraints row by row represents the whole circuit.

### A small example: product and sum

Suppose we compute $t=xy$ and then $s=t+y$. With variables $z=(1,x,y,t,s)^T$, the two constraints must be written as

$$
x\cdot y=t,\qquad (t+y)\cdot1=s.
$$

Each side in R1CS is assembled from linear forms in $z$. In the second constraint, one multiplicand is the constant linear form $1$, and the other is $t+y$. This illustrates how each constraint’s three linear forms are stored as one row across the matrices $A,B,C$.

Concretely,

$$
A=\begin{pmatrix}0&1&0&0&0\\0&0&1&1&0\end{pmatrix},\quad
B=\begin{pmatrix}0&0&1&0&0\\1&0&0&0&0\end{pmatrix},\quad
C=\begin{pmatrix}0&0&0&1&0\\0&0&0&0&1\end{pmatrix}.
$$

Then $Az=(x,t+y)^T$, $Bz=(y,1)^T$, and $Cz=(t,s)^T$, so

$$
(Az)\circ(Bz)=(xy,t+y)^T=Cz
$$

encodes both constraints at once. Each row of the matrices corresponds to one constraint.

## 7. QAP, linear maps, and arithmetization

In R1CS, row index $i$ identifies a constraint and column index $j$ identifies a variable $z_j$. For a fixed variable vector $z$, component $i$ of $Az$ is

$$
(Az)_i=\sum_j A_{ij}z_j.
$$

In a QAP, for each matrix column, the coefficient values across constraint positions $i$ are treated as evaluations and interpolated into a polynomial. The polynomial $A_j(X)$ associated with column $j$ is chosen so that $A_j(r_i)=A_{ij}$. Therefore,

$$
A(r_i)=\sum_j z_jA_j(r_i)=\sum_j z_jA_{ij}=(Az)_i.
$$

In other words, the linear map $z\mapsto Az$ is represented by polynomials that agree at the constraint evaluation points. The columns of $B$ and $C$ are interpolated similarly, and the row-wise R1CS equations are combined into polynomial identity or divisibility conditions. This row-column correspondence explains why QAP interpolates columns.

## 8. Topics needed in this course

| Topic | Meaning | Role in the course |
| --- | --- | --- |
| Vector space | A space with vector addition and scalar multiplication by field elements | Treat witnesses and evaluation values over finite fields as vectors |
| Linear map | A map preserving addition and scalar multiplication | Understand how matrices express the linear parts of computations |
| Dot product and linear combination | Multiply coefficients by variables and add the results | Read each row of an R1CS constraint |
| Matrix product | Compute many linear combinations together | Compute $(Az),(Bz),(Cz)$ |
| Componentwise product | Multiply entries at matching positions | Express the quadratic part of R1CS constraints |
| Dimension and rank | Matrix shape and number of independent directions | Understand rows/columns in R1CS and the name Rank-1 |
| Composition of linear maps | Applying transformations in sequence | Relate staged circuit computations to matrix products |

## Exercises

**Exercise 1.** Let $A=\begin{pmatrix}1&2\\0&-1\end{pmatrix}$ and $v=(3,4)^T$. Compute $Av$ and verify that the result is a vector in $\mathbb K^2$.

**Answer.** $Av=(1\cdot3+2\cdot4,\;0\cdot3-1\cdot4)^T=(11,-4)^T$. Over a finite field, reduce each component according to that field’s arithmetic.

**Exercise 2.** Explain using a matrix representation why $T(x,y)=(x+2y,3x-y)$ is linear.

**Answer.** We can write $T(x,y)=\begin{pmatrix}1&2\\3&-1\end{pmatrix}(x,y)^T$. A matrix product preserves vector addition and scalar multiplication, so $T$ is linear.

**Exercise 3.** For $u=(1,2,3)^T$ and $v=(4,5,6)^T$, compute the dot product and componentwise product, and compare their result types.

**Answer.** The dot product is the scalar $u^Tv=32$; the componentwise product is the vector $u\circ v=(4,10,18)^T$.

## Continue learning

- [Linear combinations, dot products, matrices, and Rank-1](./terms/linear-algebra): work through concrete R1CS matrices from Session 4
- [Session 4: Arithmetization and computational complexity](./session-04): follow the transformations from R1CS to QAP and AIR
- [QAP: Combining R1CS constraints into a polynomial](./qap): see how matrix constraints are combined into polynomials
- [Finite fields and polynomials: a compact tutorial for ZK](./finite-fields-tutorial): learn the finite field over which scalars are computed
