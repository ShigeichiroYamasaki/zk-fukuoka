# 第13回の演習：STARKの透明性と実行トレース

更新日：2026年11月20日

[第13回：STARK](../learn/session-13) · [演習トップ](./)

STARKのトレース制約と，透明性・証明サイズの設計上の交換条件を確認する．演習で動かす計算例は，サイト内のRubyコードを基本にする．

### やってみる

$\mathbb F_{17}$ で $s_0=3$，遷移 $s_{i+1}=s_i^2$ を3回実行し，トレースを計算する．どの条件が遷移制約で，どれが境界制約かを分ける．次にKZG方式とFRI方式を，セットアップ，基礎仮定，証明サイズの観点で比較する．

### 確認

トレースは $3,9,13,16$．遷移制約は各隣接状態の二乗関係，境界制約は $s_0=3$ と $s_3=16$．KZGはトラステッドセットアップとペアリング系仮定を使い短い証明を得る．FRIは暗号学的ハッシュ関数を使う透明な構成だが，一般に証明サイズ・検証量は大きくなる．

### Rubyでフォールディング計算を確かめる {#ruby-folding}

[FRIのフォールディングを計算するRubyコード](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/docs/public/examples/fri_folding.rb)をリポジトリのルートで実行する．

```sh
ruby docs/public/examples/fri_folding.rb
```

このコードは $\mathbb F_{17}$ 上の小さな評価点集合で，偶数次・奇数次の成分を組み合わせる計算，次数条件を満たす例と満たさない例を確認する．これはFRIの算術を追う教材用コードであり，Merkle木，対話，暗号学的安全性を備えたSTARK証明の実装ではない．外部のAnatomy of a STARKは，別の実装を読むための任意の参考資料として扱う．

### RubyでFRIのコミット・問い合わせ・検証を追う {#ruby-fri}

[Anatomy of a STARK](https://github.com/aszepieniec/stark-anatomy/tree/master/code)で説明されている有限体，多項式，Merkle木，FRIの考え方を，教材向けにRubyの標準ライブラリで書き直した[サンプル一式](https://github.com/ShigeichiroYamasaki/zk-fukuoka/tree/main/docs/public/examples/stark_anatomy_ruby)を用意した．原著のコードを逐語的に翻訳したものではなく，小さい有限体で各処理を追えるように構成している．

リポジトリのルートから次を実行する．

```sh
ruby docs/public/examples/stark_anatomy_ruby/demo.rb
```

コードは，有限体演算，Lagrange補間，Merkle木の認証経路，FRIのチャレンジ導出・フォールディング・問い合わせ・最終多項式の次数確認を順に示す．実行トレースの遷移制約と境界制約はデモ内で直接確認する．**このFRI証明はトレースやAIR制約に結び付いていないため，完全なSTARK証明ではなく，ゼロ知識性も実現しない．**小さな体と問い合わせ数1は学習用であり，安全性を持たない．各ファイルの読み方と適用範囲は[サンプルのREADME](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/docs/public/examples/stark_anatomy_ruby/README.md)を参照する．

