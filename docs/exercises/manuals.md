---
outline: [2, 3]
---

# 基本操作マニュアル集

幕III（第11〜15回）の演習を進めるための操作案内です。第11回で証明の生成・検証を一巡し，第12回でセットアップの違い，第13回で実行トレース，第14回で方式の比較，第15回で発展的な構成を確認します。

[演習トップ](./) · [実装・ツール一覧](./tools) · [前提知識・補助教材](../learn/foundations)

公式資料の参照確認日：2026年9月27日。以下は公式手順への日本語の読み順・演習案内です。コマンドの詳細は利用する版の公式マニュアルで確認してください。全実装のローカル実行を検証したものではありません。

[応用編：ERC-20送金用ZK rollupを作る](../rollup/) — 6段階の開発教材と実行用モデル。

## 幕IIIの演習ルート {#route}

| 授業 | 演習で行うこと | このページの操作案内 | 完了の目安 |
| --- | --- | --- | --- |
| [第11回・Groth16](../learn/session-11) | 回路から証明を作り，検証する | [Groth16](#groth16) | 回路・ウィットネス・鍵・証明を区別できる |
| [第12回・PLONK](../learn/session-12) | 同じ計算を別の方式で証明する | [PLONK](#plonk) | 汎用SRSと回路ごとの前処理を区別できる |
| [第13回・STARK](../learn/session-13) | 実行トレースと制約を追う | [STARK](#stark) | 遷移制約・境界制約と検証結果を対応づけられる |
| [第14回・統合](../learn/session-14) | 条件を揃えて記録・比較する | [比較と考察](#comparison) | 実測値と理論的性質を分けて説明できる |
| [第15回・発展](../learn/session-15) | 再帰・folding・sumcheckの役割を調べる | [発展演習](#advanced) | 何を集約し，どの負担を減らすか説明できる |

初めてなら **Circom＋snarkjsで第11・12回を続けて進める**と，回路を再利用して違いを確認できます。第13回はPythonで仕組みを読むならAnatomy of a STARK，RustでAIRを書くならWinterfell，VMの操作を学ぶならMiden VMから一つを選びます。すべての実装を導入する必要はありません。

## 共通の準備と回路の作成 {#circuits}

### 作業環境を揃える

演習用フォルダを作り，選んだ実装のリリースまたはコミット，言語・コンパイラの版を記録します。コード例とAPIマニュアルは同じ版を使います。入力は公開してよい小さなサンプルから始めます。

| 使う環境 | 導入・操作マニュアル | 最初に確認すること |
| --- | --- | --- |
| Circom＋snarkjs | [snarkjs公式README](https://github.com/iden3/snarkjs#readme)，[Circom導入](https://docs.circom.io/getting-started/installation/) | Node.js，Circom，snarkjsが起動し，ヘルプを参照できる |
| Goの実装 | [gnark導入](https://docs.gnark.consensys.io/HowTo/get_started) | 例と依存モジュールの版が一致する |
| Rustの実装 | [Rust導入（日本語）](https://doc.rust-jp.rs/book-ja/ch01-01-installation.html)と選んだ実装のREADME | Rust/Cargoの版，必要な機能フラグを記録する |
| Pythonの実装 | [Python公式チュートリアル（日本語）](https://docs.python.org/ja/3/tutorial/)，[Anatomyのコード](https://github.com/aszepieniec/stark-anatomy/tree/master/code) | Pythonの版と例が要求する依存関係を確認する |

### Circomで共通の入力を用意する

| 順番 | 操作と公式手順 | 確認する生成物 |
| --- | --- | --- |
| 1 | [最初の回路を書く](https://docs.circom.io/getting-started/writing-circuits/) | `.circom`。何を公開し，何をウィットネスとして扱うか |
| 2 | [回路をコンパイルする](https://docs.circom.io/getting-started/compiling-circuits/) | `.r1cs`，ウィットネス計算用のWasmなど |
| 3 | [ウィットネスを計算する](https://docs.circom.io/getting-started/computing-the-witness/) | 入力JSONと`.wtns`。制約を満たす割当であること |

Circomのサイトに接続できない場合は，[snarkjs公式README](https://github.com/iden3/snarkjs#readme)の回路作成・コンパイル・ウィットネス計算の節から進められます。

## 証明を生成・検証する {#proofs}

以下の第11〜13回の手順から，使用する方式を選びます。**証明・公開入力・検証鍵（または検証用パラメータ）の組**を保存し，正常な検証と，公開入力を変えた場合の検証を分けて記録してください。

### 第11回：Groth16 {#groth16}

主ルートはCircom＋snarkjsです。[実装例の一覧](./#groth16)からZoKrates・gnark・bellmanを選ぶ場合も，同じ確認項目を使えます。

| 順番 | 操作 | 公式マニュアル | 確認すること |
| --- | --- | --- | --- |
| 1 | 共通の回路とウィットネスを用意する | [共通準備](#circuits) | 公開入力とウィットネスの役割 |
| 2 | Powers of Tauを準備し，Groth16の回路固有のセットアップを進める | [snarkjsの手順](https://github.com/iden3/snarkjs#readme)，[Circom証明チュートリアル](https://docs.circom.io/getting-started/proving-circuits/) | `.ptau`と回路に対応する`.zkey`の違い。公式手順の貢献・検証も行う |
| 3 | 検証鍵を出力し，証明を生成する | [検証鍵の出力](https://github.com/iden3/snarkjs#22-export-the-verification-key)，[証明生成](https://github.com/iden3/snarkjs#23-create-the-proof) | 検証鍵，証明JSON，公開入力JSON |
| 4 | 検証し，公開入力のコピーを変更して再検証する | [検証](https://github.com/iden3/snarkjs#24-verify-the-proof)のGroth16手順 | 元の組は受理，変更した主張は拒否されること |

**完了後の確認**：制約を変更したら，どの生成物を作り直す必要があるでしょうか。回路固有のセットアップを第11回と結びつけて説明します。ローカルで作るセットアップは学習用として扱います。

### 第12回：PLONK {#plonk}

第11回と同じ回路・入力を使い，snarkjsの**PLONK用**の手順を選びます。出力先をGroth16と分けて，鍵や証明の取り違えを防ぎます。

| 順番 | 操作 | 公式マニュアル | 確認すること |
| --- | --- | --- | --- |
| 1 | 回路の規模・曲線などに適合するPowers of Tauを用意する | [公式README](https://github.com/iden3/snarkjs#readme) | 第11回のSRSを再利用できる条件 |
| 2 | `plonk setup`で回路に対応する鍵を生成する | [SetupのPLONK手順](https://github.com/iden3/snarkjs#15-setup) | 汎用SRSがあっても回路ごとの前処理は残る |
| 3 | 検証鍵を出力し，証明生成・検証を行う | [検証鍵](https://github.com/iden3/snarkjs#22-export-the-verification-key)，[証明生成](https://github.com/iden3/snarkjs#23-create-the-proof)，[検証](https://github.com/iden3/snarkjs#24-verify-the-proof) | 各節でPLONKのコマンドを使う |
| 4 | 公開入力を変更して再検証し，回路変更後の鍵も作り直す | 同じ公式手順で再実行 | 不正な主張の拒否と，SRS再利用・回路前処理の違い |

Groth16用の第2段階の貢献手順をPLONKへそのまま当てはめないようにします。[gnark・Dusk PLONKの操作案内](./#plonk)は，GoやRustで実装を読む場合の選択肢です。CircomのR1CSを入力する経路と，PLONKishなゲート・コピー制約を直接記述する経路も区別しましょう。

### 第13回：STARK {#stark}

目的に合う実装を一つ選び，公式の小さい例から始めます。

| 学び方 | 実装と操作マニュアル | 追いかける箇所 |
| --- | --- | --- |
| Pythonで仕組みを読む | [Anatomy of a STARK](https://aszepieniec.github.io/stark-anatomy/)，[Part 5](https://aszepieniec.github.io/stark-anatomy/rescue-prime)，[コードとテスト](https://github.com/aszepieniec/stark-anatomy/tree/master/code) | Rescue-Primeの計算，トレース，制約，証明生成・検証。Jekyll起動は解説サイト用で，Python演習とは別 |
| RustでAIRを書く | [Winterfellの利用手順](https://github.com/facebook/winterfell#usage)，[実装例](https://github.com/facebook/winterfell/tree/main/examples)，[API](https://docs.rs/winterfell/latest/winterfell/) | トレースの作成，遷移制約，境界の指定，証明・検証 |
| VMで実行を証明する | [Miden VMのCLIと例](https://github.com/0xMiden/miden-vm/blob/next/miden-vm/README.md) | 命令列，入力，実行結果，実行証明。`next`の手順と利用リリースの差を確認する |

1. 公式の例を実行し，正常な証明の検証結果を保存する。
2. 公開入力・出力と，トレース・制約を対応づける。VMでは，利用者のプログラムとVM内部のAIRを分けて読む。
3. 証明を固定し，公開出力など検証対象のコピーを変更する。検証が拒否することを確認する。
4. 同じ実装・安全性設定のままトレース長を変え，証明サイズと処理時間を記録する。

**完了後の確認**：Merkle木によるデータの固定，FRIによる近接性検査，AIRの制約は，それぞれ何を確認するためのものでしょうか。透明性とゼロ知識性も分けて説明します。WinterfellのREADMEは完全ゼロ知識性を提供していないと明記しているため，実装の保証範囲を第13回の理論と照合してください。

## 第14回：結果を比較して考察する {#comparison}

[第14回](../learn/session-14)の比較表に，自分の実験結果を対応づけます。同じ計算を実装できない場合は，数値を優劣の根拠として並べず，構成と生成物の違いを比較します。

| 記録項目 | 記録する内容 |
| --- | --- |
| 実行条件 | 実装・コミット，OS・CPU・メモリ，言語の版，ビルド設定 |
| 計算と入力 | 回路またはプログラム，公開入力の数，制約数またはトレース長 |
| 安全性の設定 | 曲線・体・ハッシュ，SRSの由来，FRIの設定など |
| 正常系・変更時 | 受理／拒否，変更した公開入力，実行ログ |
| 証明サイズ | バイト数と保存形式。JSONとバイナリの違いも明記 |
| 処理時間 | セットアップ，ウィットネス／トレース生成，証明生成，検証を別々に計測。反復回数と集計方法を記録 |
| 理論との対応 | 完全性・健全性・ゼロ知識性，必要な仮定，セットアップの違い |

一度の成功・失敗テストは，完全性や健全性の数学的証明ではありません。ゼロ知識性も「画面に秘密が表示されなかった」だけでは判断できません。観測した動作と，論文・実装文書が保証する性質を分けてまとめましょう。

## 第15回：発展演習へ進む {#advanced}

以下は基本演習を終えた後の選択課題です。

| テーマ | 操作・読み方 | 成果としてまとめること |
| --- | --- | --- |
| 再帰・folding | [Nova公式のTests and examples](https://github.com/microsoft/Nova#tests-and-examples)から，選んだ版の`minroot`例を実行し，ステップ数を変える | 状態の引き継ぎ，folding，最終的な証明・検証を区別する。圧縮を含む場合はそのコストも分ける |
| Sumcheck・GKR | [第15回の説明](../learn/session-15)と[Thalerの教科書](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html)を読み，二変数の小さな多項式の総和を手計算・Python等で確認する | 全点で直接計算する方法と，変数を一つずつ減らす検証の流れを対応づける。完成した証明実装とは区別する |
| Ethereumへの応用 | [第15回の研究地図](../learn/session-15)にあるzkEVM・EIP-8025の一次資料を読む | 何の実行を誰が検証するか，必要な性能指標，提案の状態と参照日を整理する |

## 結果を保存し，共有する {#git}

作業フォルダのREADMEに，選んだ例のURL・版，実行コマンド，公開サンプル入力，結果と考察を残します。方式ごとにフォルダを分け，使用した鍵・証明・公開入力が対応するようにファイル名を付けます。大きな生成物やウィットネスはGitの記録対象から外し，再生成手順を残す方法も使えます。

- [Pro Git 日本語版](https://git-scm.com/book/ja/v2)：`status`・`diff`で変更を確認し，`commit`で記録する。
- [ZK Fukuoka 文書の編集・更新ガイド](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/CONTRIBUTING.md)：教材のローカル編集とプレビュー。

## 数学の操作を復習する {#math}

法7の逆元から復習する場合は，[SageMathCell](https://sagecell.sagemath.org/)に`GF(7)(3)^(-1)`を入力し，**Evaluate**を押します。結果の`5`を[有限体の導入演習](../learn/foundations#finite-field)の手計算と比べてください。

[SageMath公式チュートリアル](https://doc.sagemath.org/html/en/tutorial/) · [導入ガイド](https://doc.sagemath.org/html/en/installation/) · [日本語の前提知識・補助教材](../learn/foundations)
