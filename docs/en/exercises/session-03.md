# # Session 3 exercise: finite fields and randomized checks

[Session 3: Finite fields, polynomials, and probabilistic checking](../learn/session-03) · [Exercises index](./)

Check finite-field arithmetic and the Schwartz–Zippel error probability.

### Try it

Compute $2/5$ in $\mathbb F_7$. For $h(X)=X(X-1)$, choose a uniform point from $S=\{0,1,2,3,4,5,6\}$ and find the probability that $h(r)=0$. Repeat for $S=\{0,1,2,3\}$ and compare with the lemma’s upper bound.

### Check

Since $5^{-1}=3$, $2/5=6$ in $\mathbb F_7$. Over the full field the probability is $2/7$, equal to the bound. Over the smaller set it is $2/4=1/2$, also equal to the bound. A smaller sample set can give a larger error bound.

