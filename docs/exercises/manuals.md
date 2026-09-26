# 基本操作マニュアル集

目的別に、公式マニュアルと教材編集の手順をまとめています。外部の技術マニュアルは主に英語です。

[演習トップ](./) · [利用可能なツール](./tools)

## 数学の計算を始める {#math}

| マニュアル | 内容 |
| --- | --- |
| [SageMath 公式チュートリアル](https://doc.sagemath.org/html/en/tutorial/) | 入力・四則演算・変数・ヘルプから、環・多項式・線形代数へ進む |
| [SageMath の導入ガイド](https://doc.sagemath.org/html/en/installation/) | ローカル環境への導入方法を選ぶ |

ブラウザーで試す場合は [SageMathCell](https://sagecell.sagemath.org/) を開き、コード入力欄に `GF(7)(3)^(-1)` を入力して **Evaluate** を押します。結果は `5` です。[有限体の導入演習](../learn/foundations)の逆元の計算と比較してみましょう。

## 回路を作成する {#circuits}

| 順番 | 公式マニュアル | 内容 |
| --- | --- | --- |
| 1 | [Circom の導入](https://docs.circom.io/getting-started/installation/) | コンパイラと周辺ツールの準備 |
| 2 | [最初の回路を書く](https://docs.circom.io/getting-started/writing-circuits/) | 入出力と制約の記述 |
| 3 | [回路をコンパイルする](https://docs.circom.io/getting-started/compiling-circuits/) | 制約とウィットネス計算用コードの出力 |
| 4 | [ウィットネスを計算する](https://docs.circom.io/getting-started/computing-the-witness/) | 入力を与え、ウィットネスを生成する |

## 証明を生成・検証する {#proofs}

| マニュアル | 内容 |
| --- | --- |
| [Circom の証明チュートリアル](https://docs.circom.io/getting-started/proving-circuits/) | snarkjsを使い、Groth16のトラステッドセットアップから証明の生成・検証までを学ぶ |
| [snarkjs 公式README](https://github.com/iden3/snarkjs#readme) | コマンドと利用例を確認する |

## 教材・演習結果をGitで管理する {#git}

| マニュアル | 内容 |
| --- | --- |
| [Pro Git 日本語版](https://git-scm.com/book/ja/v2) | リポジトリ、変更の記録、ブランチなどの基本操作 |
| [ZK Fukuoka 文書の編集・更新ガイド](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/CONTRIBUTING.md) | ローカル編集、プレビュー、GitHubへの反映 |
