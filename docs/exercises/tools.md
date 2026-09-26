# 利用可能なツール

演習に使える外部ツールへのリンク集です。ブラウザーですぐ試せるものと、ローカルに導入して使うものをまとめています。

[演習トップ](./) · [基本操作マニュアル集](./manuals)

## 数学を計算する

| ツール | できること | 利用方法 | 操作案内 |
| --- | --- | --- | --- |
| [SageMathCell](https://sagecell.sagemath.org/) | SageMathのコードを入力して計算を試す | ブラウザー | [SageMathの基本操作](./manuals#math) |
| [SageMath](https://www.sagemath.org/) | 有限体・多項式・行列などの計算 | ローカル導入、またはオンライン環境 | [公式チュートリアル](https://doc.sagemath.org/html/en/tutorial/) |

まずは[有限体の導入演習](../learn/foundations)で扱う計算から始められます。

## 回路とゼロ知識証明を試す

| ツール | できること | 利用方法 | 操作案内 |
| --- | --- | --- | --- |
| [Circom](https://github.com/iden3/circom) | 算術回路を記述し、制約やウィットネス計算用のコードを生成する | ローカル導入 | [導入・回路作成の手順](./manuals#circuits) |
| [snarkjs](https://github.com/iden3/snarkjs) | ゼロ知識証明の生成・検証を試す | Node.jsのコマンドライン、またはブラウザーへの組み込み | [証明の生成・検証の手順](./manuals#proofs) |

関連する学習項目は、[第4回・算術化](../learn/session-04)と[第11回・Groth16](../learn/#session-11)です。ZK Fukuoka独自の回路演習は今後追加します。現在はリンク先の公式教材を利用できます。
