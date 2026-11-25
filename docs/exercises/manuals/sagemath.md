---
outline: [2, 3]
---

# SageMathの操作マニュアル

更新日：2026年11月25日

SageMathは，有限体，多項式，行列などを計算できる数学ソフトウェアです．ブラウザーで試せるSageMathCellを使えば，インストールせずに授業の小さな計算を確認できます．

## SageMathCellで有限体を計算する

[SageMathCell](https://sagecell.sagemath.org/)を開き，入力欄に次を貼り付けて **Evaluate** を押します．

```python
F = GF(7)
F(3)^(-1)
```

結果は `5` です．有限体 $\mathbb{F}_7$ では $3\cdot5=15\equiv1\pmod 7$ なので，5は3の乗法逆元です．

## 多項式を計算する

同じ入力欄で，多項式環を定義して値や根を調べられます．

```python
F = GF(7)
R.<X> = PolynomialRing(F)
f = X^2 + 2*X + 1
f(3)
f.roots()
```

SageMathの入力では `^` がべき乗です．この多項式は $(X+1)^2$ なので，根は $X=6$ です（重複度2）．入力欄では複数行を実行でき，最後の式の値が結果に表示されます．

## 行列を計算する

有限体上の行列を作り，行列式と逆行列を求めます．

```python
F = GF(7)
M = Matrix(F, [[1, 2], [3, 4]])
M.det()
M.inverse()
```

この行列の行列式は $1\cdot4-2\cdot3=-2\equiv5\pmod7$ で，0ではないため逆行列があります．係数を実数ではなく有限体の元として計算している点に注意してください．

## ローカルで使う

継続して計算する場合は，公式の導入手順に従ってSageMathをインストールします．対話環境は `sage` で起動できます．スクリプトを保存する場合は，例えば `calc.sage` に計算を書き，次のように実行します．

```sh
sage calc.sage
```

## 授業での使い方と注意

SageMathは有限体・多項式・線形代数の手計算を照合する補助ツールです．出力だけを記録するのではなく，入力した式，計算する体や環，期待した性質も一緒に残します．公開のSageMathCellには個人情報，秘密鍵，未公開のウィットネスを入力しないでください．

## 公式資料

- [SageMathCell](https://sagecell.sagemath.org/)
- [SageMathチュートリアル（英語）](https://doc.sagemath.org/html/en/tutorial/)
- [SageMathの導入（英語）](https://doc.sagemath.org/html/en/installation/)

[基本操作マニュアル集](../manuals) · [利用可能なツール](../tools) · [有限体と多項式のチュートリアル](../../learn/finite-fields-tutorial)
