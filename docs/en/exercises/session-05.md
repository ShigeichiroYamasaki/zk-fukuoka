# # Session 5 exercise: Reed–Solomon distance

[Session 5: Error-correcting codes and information theory](../learn/session-05) · [Exercises index](./)

Compute RS codewords and use distance to derive correction ability.

### Try it

Over $\mathbb F_7$, use evaluation points $0,1,2,3,4$ and polynomials of degree less than 2. Compute codewords for $f(X)=2X+1$ and $g(X)=1$. Find their Hamming distance, the code’s minimum distance, and its unique-correction radius.

### Check

The codewords are $(1,3,5,0,2)$ and $(1,1,1,1,1)$; their distance is 4. Here $n=5,k=2$, so $d_{\min}=n-k+1=4$ and the unique-correction radius is $\lfloor(4-1)/2\rfloor=1$.

