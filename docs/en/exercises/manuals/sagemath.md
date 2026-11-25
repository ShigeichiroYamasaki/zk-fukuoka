---
outline: [2, 3]
---

# SageMath Operation Manual

Updated: November 25, 2026

SageMath is mathematical software for finite fields, polynomials, matrices and more. SageMathCell lets you check small calculations from a browser without installing anything.

## Calculate in a finite field with SageMathCell

Open [SageMathCell](https://sagecell.sagemath.org/), paste the following into the input area, and press **Evaluate**:

```python
F = GF(7)
F(3)^(-1)
```

The result is `5`. In $\mathbb{F}_7$, $3\cdot5=15\equiv1\pmod 7$, so 5 is the multiplicative inverse of 3.

## Calculate with polynomials

Define a polynomial ring, then evaluate a polynomial and inspect its roots:

```python
F = GF(7)
R.<X> = PolynomialRing(F)
f = X^2 + 2*X + 1
f(3)
f.roots()
```

In SageMath input, `^` means exponentiation. The polynomial is $(X+1)^2$, so its root is $X=6$, with multiplicity 2. Multiple lines can be run together; the result of the last expression is displayed.

## Calculate with matrices

Create a matrix over a finite field and compute its determinant and inverse:

```python
F = GF(7)
M = Matrix(F, [[1, 2], [3, 4]])
M.det()
M.inverse()
```

The determinant is $1\cdot4-2\cdot3=-2\equiv5\pmod7$, which is nonzero, so the matrix has an inverse. Note that its entries are finite-field elements, not real numbers.

## Use SageMath locally

For continuing work, install SageMath using its official instructions. Start the interactive environment with `sage`. To save a script, write calculations in a file such as `calc.sage` and run:

```sh
sage calc.sage
```

## Use in the course and safety

SageMath is a supporting tool for checking finite-field, polynomial and linear-algebra calculations. Record the expression, the field or ring, and the property you intended to check along with the output. Do not enter personal data, private keys or unpublished witnesses into the public SageMathCell service.

## Official references

- [SageMathCell](https://sagecell.sagemath.org/)
- [SageMath tutorial](https://doc.sagemath.org/html/en/tutorial/)
- [SageMath installation](https://doc.sagemath.org/html/en/installation/)

[Basic operation manuals](../manuals) · [Available tools](../tools) · [Finite fields and polynomials tutorial](../../learn/finite-fields-tutorial)
