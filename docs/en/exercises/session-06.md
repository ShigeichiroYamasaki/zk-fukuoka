# Session 6 exercise: FRI folding and soundness amplification

[Session 6: Low-degree testing and soundness amplification](../learn/session-06) · [Exercises index](./)

Check a degree-reducing fold and repeated soundness error.

### Try it

Split $f(X)=2+3X+X^2+2X^3$ as $f(X)=f_e(X^2)+Xf_o(X^2)$. Find both polynomials and compute $f'(Y)=f_e(Y)+2f_o(Y)$ over $\mathbb F_{11}$. If a test has error $1/4$, find the product after three independent repetitions.

### Check

$f_e=2+Y$, $f_o=3+2Y$, hence $f'=8+5Y$. The degree falls from 3 to 1. The product is $(1/4)^3=1/64$. Repetition requires independence or a suitable conditional error bound.

