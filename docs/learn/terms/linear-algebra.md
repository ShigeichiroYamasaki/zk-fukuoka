---
outline: [2, 3]
---

# 線形結合・内積・行列・Rank-1

[第4回へ戻る](../session-04) · [用語ガイド](./) · [前提知識と補助教材](../foundations)

更新日：2026年10月18日

このページでは，例を一般の定義式に結び付けて，R1CSの行列が何を計算し，「Rank-1」が何を指すかを説明する．以下の演算は，特に断らない限り体 $K$ 上で行う．ZKの算術化では，通常，有限体 $K=\mathbb F_p$ などを使う．

## 1．ベクトルと線形結合の定義

$K$ を体とする．$K^n$ は，$K$ の要素を $n$ 個並べた列ベクトル全体である．例えば

$$\mathbf z=(z_1,\ldots,z_n)^T\in K^n$$

であり，成分ごとの加法と，$K$ の要素（スカラー）による定数倍を備えるベクトル空間である．係数 $a_1,\ldots,a_n\in K$ とベクトルの成分を使い，

$$a_1z_1+\cdots+a_nz_n=\sum_{j=1}^{n}a_jz_j$$

と作る値を，成分 $z_j$ の**線形結合**という．係数を列ベクトル $\mathbf a=(a_1,\ldots,a_n)^T$ と書けば，この線形結合は

$$\mathbf a^T\mathbf z=\sum_{j=1}^{n}a_jz_j\in K$$

となる．これは，$\mathbf a$ と $\mathbf z$ の**内積（ドット積）**であり，結果はベクトルではなく体の要素一つである．ここで「内積」は，標準座標での積和を指す．有限体では実数の内積における正の長さなどは前提にせず，式 $\mathbf a^T\mathbf z$ の代数的な計算だけを使う．

例えば $\mathbf z=(1,x,t,s,y)^T$，$\mathbf a=(5,1,0,1,0)^T$ なら，

$$\mathbf a^T\mathbf z=5\cdot1+1\cdot x+0\cdot t+1\cdot s+0\cdot y=5+x+s.$$

先頭に定数 $1$ を含めるのは，定数項も係数との積として同じ形に入れるためである．

## 2．行列積は複数の線形結合をまとめて計算する

$A=(A_{ij})\in K^{m\times n}$ を $m$ 行 $n$ 列の行列とする．行列とベクトルの積 $A\mathbf z$ は，$m$ 個の線形結合を並べた列ベクトルであり，定義は

$$A\mathbf z=\begin{pmatrix}
\sum_{j=1}^{n}A_{1j}z_j\\
\sum_{j=1}^{n}A_{2j}z_j\\
\vdots\\
\sum_{j=1}^{n}A_{mj}z_j
\end{pmatrix}\in K^m$$

である．つまり，**第 $i$ 行**が入力ベクトルから一つの線形結合を作り，**第 $j$ 列**が変数 $z_j$ の係数を各行に渡す．行列は，ベクトル空間 $K^n$ から $K^m$ への線形写像を座標で表したものでもある．

次元もこの積の定義から決まる：$A$ が $m\times n$，$\mathbf z$ が $n\times1$ なら，$A\mathbf z$ は $m\times1$ である．この対応により，$m$ 行の制約と $n$ 個の変数を，それぞれ一つの行列と変数ベクトルにまとめられる．

## 3．R1CSの定義式

R1CS（Rank-1 Constraint System）は，体 $K$ 上の変数ベクトル $\mathbf z\in K^n$ と，三つの係数行列

$$A,B,C\in K^{m\times n}$$

で表される $m$ 個の制約である．$\circ$ は**要素ごとの積（Hadamard積）**で，$\mathbf u,\mathbf v\in K^m$ に対して

$$\mathbf u\circ\mathbf v=(u_1v_1,\ldots,u_mv_m)^T$$

と定義する．割当て $\mathbf z$ がR1CSを満たすとは，次のベクトル等式が成り立つことである：

$$\boxed{(A\mathbf z)\circ(B\mathbf z)=C\mathbf z}.$$

この等式は，通常の行列積 $(A\mathbf z)(B\mathbf z)$ を意味しない．左辺の二つの $m$ 次元ベクトルについて，同じ行番号の成分同士を掛ける．各行 $i$ を係数ベクトル $\mathbf a_i,\mathbf b_i,\mathbf c_i\in K^n$ で書き直すと，条件は

$$\boxed{(\mathbf a_i^T\mathbf z)(\mathbf b_i^T\mathbf z)=\mathbf c_i^T\mathbf z\qquad(i=1,\ldots,m)}$$

となる．すなわち，一つの制約は「変数の線形結合を二つ作り，その積を第三の線形結合と等しくする」式である．$A,B,C$ の各行が，それぞれ左因子・右因子・右辺の係数を指定する．

## 4．例：三つの制約を行列にまとめる

変数ベクトルを

$$\mathbf z=(1,x,t,s,y)^T$$

とし，次の三条件を考える：

$$x\cdot x=t,\qquad x\cdot t=s,\qquad (5+x+s)\cdot1=y.$$

これを表す行列は

$$A=\begin{pmatrix}0&1&0&0&0\\0&0&1&0&0\\5&1&0&1&0\end{pmatrix},\quad
B=\begin{pmatrix}0&1&0&0&0\\0&1&0&0&0\\1&0&0&0&0\end{pmatrix},\quad
C=\begin{pmatrix}0&0&1&0&0\\0&0&0&1&0\\0&0&0&0&1\end{pmatrix}.$$

各行を掛けると

$$A\mathbf z=(x,t,5+x+s)^T,\quad B\mathbf z=(x,x,1)^T,\quad C\mathbf z=(t,s,y)^T.$$

したがってR1CSのベクトル式は

$$ (x,t,5+x+s)^T\circ(x,x,1)^T=(t,s,y)^T$$

であり，成分ごとに読むと，最初の二行は $x^2=t$ と $xt=s$，第三行は $(5+x+s)\cdot1=y$ を表す．$\mathbf z=(1,3,9,27,35)^T$ を代入すれば，左辺は $(9,27,35)^T$ となり，右辺 $C\mathbf z$ と一致する．有限体上で計算する場合，これらの加減乗除はすべてその体の演算で行う．

## 5．「Rank-1」が指すもの

一つの行の制約

$$ (\mathbf a^T\mathbf z)(\mathbf b^T\mathbf z)=\mathbf c^T\mathbf z$$

の左辺を展開すると，

$$ (\mathbf a^T\mathbf z)(\mathbf b^T\mathbf z)=\mathbf z^T(\mathbf a\mathbf b^T)\mathbf z$$

となる．ここで $\mathbf a\mathbf b^T$ は外積で作った $n\times n$ 行列であり，その $(j,k)$ 成分は $a_jb_k$ である．各列は $\mathbf a$ のスカラー倍なので，

$$\operatorname{rank}(\mathbf a\mathbf b^T)\leq1$$

である（$\mathbf a$ と $\mathbf b$ がともに零ベクトルでなければランクは1）．**Rank-1とは，各制約の二次部分を二つの線形形式の積に因数分解できることを指す**．行列 $A,B,C$ 全体のランクが1という意味ではない．

また，右辺 $\mathbf c^T\mathbf z$ は線形式であり，この右辺まで含めた式全体の係数行列がランク1であるという命題でもない．R1CSの記法では，この線形な右辺と，二つの線形形式の積を等置する．

## 確認問題

$\mathbf z=(1,3,9,27,35)^T$ を代入して，各行の線形結合と要素ごとの積を計算し，三つの制約が成り立つことを確かめよう．

::: details 解答

$A\mathbf z=(3,9,35)^T$，$B\mathbf z=(3,3,1)^T$，$C\mathbf z=(9,27,35)^T$ である．最初の二つを要素ごとに掛けると $(9,27,35)^T=C\mathbf z$ になる．$\mathbb F_{101}$ では，これらの整数値はいずれも $101$ より小さいため同じ表示になる．

:::

## 次に読む

[補間・消失多項式・多項式の整除性](./polynomials)

## 参考資料

[Gennaro et al., Quadratic Span Programs and Succinct NIZKs without PCPs](https://eprint.iacr.org/2012/215) — 英語の発展資料．まずこのページの例を確認してから読む．
