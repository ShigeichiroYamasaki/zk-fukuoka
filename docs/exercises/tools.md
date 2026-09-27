---
outline: [2, 3]
---

# 利用可能なツール

幕III（第11〜15回）の演習で，目的と経験に合わせて実装・計算環境を選ぶための一覧です。ツールを選んだら，対応する[基本操作マニュアル集](./manuals#route)へ進んでください。

[演習トップ](./) · [基本操作マニュアル集](./manuals) · [前提知識・補助教材](../learn/foundations)

[応用編：ERC-20送金用ZK rollupを作る](../rollup/) — 6段階の開発教材と実行用モデル。

## 幕IIIで使うツールを選ぶ {#choose}

| 授業・目的 | 最初の候補 | 選ぶ理由 | 操作案内 |
| --- | --- | --- | --- |
| [第11回・Groth16](../learn/session-11) | Circom＋snarkjs | 回路から証明生成・検証まで一巡する | [Groth16の手順](./manuals#groth16) |
| [第12回・PLONK](../learn/session-12) | 同じCircom回路＋snarkjs | 計算を揃えてセットアップと生成物の違いを見る | [PLONKの手順](./manuals#plonk) |
| [第13回・STARK](../learn/session-13) | Anatomy of a STARK／Winterfell／Miden VM | Pythonで構造を読む／RustでAIRを書く／VMで実行を証明する | [STARKの手順](./manuals#stark) |
| [第14回・比較](../learn/session-14) | 使った実装＋表計算またはPython＋Git | 条件と結果を記録し，比較する | [比較と考察](./manuals#comparison) |
| [第15回・発展](../learn/session-15) | Nova，SageMath／Python | 再帰・foldingの実装と，sumcheckの小さな計算を調べる | [発展演習](./manuals#advanced) |

すべてを導入する必要はありません。初めてなら第11・12回をCircom＋snarkjsで進め，STARKは学びたい層に合わせて一つを選びます。Go経験者はgnark，Rust経験者は各ライブラリの例から始めても構いません。

## 回路とゼロ知識証明を試す

### 第11回：Groth16のツール {#groth16}

| 実装・サイト | 演習での役割 | 環境・対象 | 操作マニュアル |
| --- | --- | --- | --- |
| [Circom](https://github.com/iden3/circom) ＋ [snarkjs](https://github.com/iden3/snarkjs) | Circomで制約・ウィットネス計算用コードを生成し，snarkjsでセットアップ・証明・検証を行う | ローカルのCircom＋Node.js。入門ルート | [共通準備](./manuals#circuits) → [Groth16](./manuals#groth16)，[公式README](https://github.com/iden3/snarkjs#readme) |
| [ZoKrates](https://github.com/ZoKrates/ZoKrates) | 短いプログラムからコンパイル・ウィットネス・証明を扱う | CLIまたはDocker。独自言語で学ぶ人向け | [Getting Started](https://zokrates.github.io/gettingstarted.html)，[G16の選択](https://zokrates.github.io/toolbox/proving_schemes.html) |
| [gnark](https://github.com/Consensys-Incorporated/gnark) | Goの回路定義とGroth16のSetup・Prove・Verifyを対応づける | Go開発環境。Go経験者向け | [導入](https://docs.gnark.consensys.io/HowTo/get_started)，[証明生成・検証](https://docs.gnark.consensys.io/HowTo/prove) |
| [bellman](https://github.com/zkcrypto/bellman) | 制約・ガジェット・Groth16 APIをコードで読む | Rust/Cargo。発展向け | [回路例とAPI（0.14.0）](https://docs.rs/bellman/0.14.0/bellman/#example-circuit) |

Circomは回路コンパイラであり，単独で証明生成・検証を完結するツールではありません。この演習ではsnarkjsと組み合わせます。[各実装の演習例](./#groth16)も参照してください。

### 第12回：PLONKのツール {#plonk}

| 実装・サイト | 演習での役割 | 環境・対象 | 操作マニュアル |
| --- | --- | --- | --- |
| [Circom＋snarkjs](https://github.com/iden3/snarkjs) | 第11回と同じ回路をPLONKで証明し，汎用SRSと回路ごとの前処理を確認する | Circom＋Node.js。第11回からの継続向け | [PLONKの手順](./manuals#plonk)，[公式Setup](https://github.com/iden3/snarkjs#15-setup) |
| [gnark](https://github.com/Consensys-Incorporated/gnark) | GoでSCSへのコンパイルとPLONK APIを追う | Go開発環境。Groth16とのAPI比較向け | [証明生成・検証のPlonKタブ](https://docs.gnark.consensys.io/HowTo/prove) |
| [Dusk PLONK](https://github.com/dusk-network/plonk) | Rustで回路・ゲートを記述し，コンパイル・証明・検証を読む | Rust/Cargo。発展向け | [利用案内](https://github.com/dusk-network/plonk#usage)，[API](https://docs.rs/dusk-plonk/latest/dusk_plonk/) |

同じPLONK系でも，回路の入力形式やAPIは異なります。CircomのR1CSを使う経路と，ゲート・コピー制約を直接扱う経路を区別して選びます。[実装例の比較](./#plonk)から具体例へ進めます。

### 第13回：STARKのツール {#stark}

| 実装・サイト | 演習での役割 | 環境・対象 | 操作マニュアル |
| --- | --- | --- | --- |
| [Anatomy of a STARK](https://github.com/aszepieniec/stark-anatomy) | 有限体・多項式・FRIから証明系を組み立てる教育用コードを読む | Python。仕組みを段階的に学ぶ人向け | [著者の解説](https://aszepieniec.github.io/stark-anatomy/)，[コードとテスト](https://github.com/aszepieniec/stark-anatomy/tree/master/code) |
| [Winterfell](https://github.com/facebook/winterfell) | 実行トレース，遷移制約，境界の指定を実装する | Rust/Cargo。AIRを自分で記述したい人向け | [利用チュートリアル](https://github.com/facebook/winterfell#usage)，[API](https://docs.rs/winterfell/latest/winterfell/) |
| [Miden VM](https://github.com/0xMiden/miden-vm) | Miden Assemblyのプログラムを実行し，実行証明を生成・検証する | Rust/CargoとVM CLI。VM操作を学ぶ人向け | [CLIと実行例](https://github.com/0xMiden/miden-vm/blob/next/miden-vm/README.md) |

[STARKの操作手順](./manuals#stark)では，正常な実行，公開出力を変えた検証，トレース長を変えた測定へ進みます。Winterfellは完全ゼロ知識性を提供していないと公式READMEに明記しています。透明性・計算の正しさ・ゼロ知識性は分けて確認しましょう。

## 第14回：比較・記録のためのツール {#comparison}

| ツール | 用途 | 操作案内 |
| --- | --- | --- |
| 選んだ証明実装とそのログ | 証明サイズ，生成時間，検証時間，受理・拒否を記録する | [比較条件と記録項目](./manuals#comparison) |
| [Python](https://www.python.org/) または普段使っている表計算ソフト | 測定値をCSV等にまとめ，同じ条件の反復結果を集計する | [Python入門などの補助教材](../learn/foundations#practice-resources) |
| [Git](https://git-scm.com/) | ソース・設定・使用版・再実行手順を記録する | [結果の保存・共有](./manuals#git) |

ツールの出力形式や安全性設定を記録し，JSONとバイナリのサイズ，セットアップ時間と証明生成時間を混同しないようにします。異なる計算・条件の測定値は，方式の優劣を示す比較には使えません。

## 第15回：発展演習のツール {#advanced}

| ツール・資料 | 演習での役割 | 環境・対象 | 操作案内 |
| --- | --- | --- | --- |
| [Nova](https://github.com/microsoft/Nova) | 再帰的な計算の証明とfoldingを例で追う | Rust/Cargo。基本演習後の発展向け | [公式Tests and examples](https://github.com/microsoft/Nova#tests-and-examples)，[発展演習](./manuals#advanced) |
| SageMath／Python | 小さな多変数多項式の総和を計算し，sumcheckの手順と照合する | ブラウザーまたはローカル。計算の確認用 | [数学の計算環境](#math)，[第15回](../learn/session-15) |

SageMathやPythonで総和を計算するだけでは，GKRやゼロ知識証明の実装にはなりません。Novaも，folding・再帰的な状態の引き継ぎ・圧縮の役割を区別して読んでください。zkEVM・EIP-8025の応用調査は[発展演習の資料案内](./manuals#advanced)から進めます。

## 数学を計算する

<span id="math"></span>

幕IIの復習や第15回の小さな計算に使います。

| ツール | できること | 利用方法 | 操作案内 |
| --- | --- | --- | --- |
| [SageMathCell](https://sagecell.sagemath.org/) | 有限体・多項式・行列の計算を入力して試す | ブラウザー。ローカル導入不要 | [SageMathの基本操作](./manuals#math) |
| [SageMath](https://www.sagemath.org/) | 計算を保存し，有限体・多項式・線形代数を継続して調べる | ローカル導入，またはオンライン環境 | [公式チュートリアル](https://doc.sagemath.org/html/en/tutorial/)，[導入](https://doc.sagemath.org/html/en/installation/) |

まずは[法7の手計算](../learn/foundations#finite-field)と結果を比べてみましょう。

## 利用する版と教材の選び方 {#versions}

公式資料の参照確認日：2026年9月27日。掲載は演習候補の案内であり，全ツールのローカル実行を検証したものではありません。外部の操作マニュアルは主に英語です。

利用するリリースまたはコミットを記録し，コード例とAPIの版を揃えます。bellmanの案内は0.14.0，Midenのリンクは開発ブランチ`next`です。`latest`のAPIは利用版へ切り替えて確認してください。導入後は[共通準備](./manuals#circuits)から，小さい公開サンプルで演習を始めます。
