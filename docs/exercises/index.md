---
outline: [2, 3]
---

# 演習

講義で学んだことを，計算や実装で確かめよう．演習教材，利用可能なツール，基本操作マニュアルをここから探せます．

## 各回の演習

各ページには，講義内容に対応する計算・比較・実装の課題と，自己確認用の解答・確認基準があります．授業後の復習や自習に使ってください．

| 回 | 演習ページ | 検証する内容 |
| ---: | --- | --- |
| 1 | [証明の言明と検査](./session-01) | グラフ同型性，言明とウィットネス |
| 2 | [シミュレーションと識別](./session-02) | 確率分布の識別差，Schnorrの関係 |
| 3 | [有限体と確率的検査](./session-03) | 有限体演算，Schwartz–Zippelの誤り確率 |
| 4 | [計算を制約へ翻訳する](./session-04) | R1CS・QAP・AIRの具体例 |
| 5 | [Reed–Solomon符号の距離](./session-05) | 符号語，最小距離，訂正半径 |
| 6 | [FRIの折り畳みと健全性増幅](./session-06) | 偶奇分解，次数低減，反復誤差 |
| 7 | [楕円曲線・ペアリング・仮定](./session-07) | 双線形性と困難性仮定 |
| 8 | [多項式コミットメント](./session-08) | KZG開示とFRI/Merkleの役割 |
| 9 | [Fiat–Shamir変換とROM](./session-09) | transcript，ランダムオラクルの限界 |
| 10 | [PCP・IOPの役割](./session-10) | 検証者アクセスと構成要素の対応 |
| 11 | [Groth16とQAP](./session-11) | ペアリング検証とセットアップ |
| 12 | [PLONKのゲートとコピー制約](./session-12) | セレクタとpermutation argument |
| 13 | [STARKの透明性と実行トレース](./session-13) | AIR制約と方式のトレードオフ |
| 14 | [プロトコルを横断比較する](./session-14) | 完全性・健全性・ゼロ知識性と設計軸 |
| 15 | [再帰・folding・応用の研究地図](./session-15) | folding，sumcheck，Ethereum応用 |


[応用編：ERC-20送金用ZK rollupを作る](../rollup/) — 6段階の開発教材と実行用モデル．

[応用編：入力を隠したAI推論 ZKML](../zkml/) — [実行用コードと操作マニュアル](../zkml/02-proof)．


## まずはここから

1. [有限体の導入演習](../learn/foundations)で，法7の加法・乗法・逆元を手で計算する．
2. [ツール一覧](./tools)から，計算や実装に使う環境を選ぶ．
3. [基本操作マニュアル集](./manuals)で，起動・入力・実行の手順を確認する．

## 演習教材

| 教材 | 内容 | 関連する授業 |
| --- | --- | --- |
| [有限体の導入演習](../learn/foundations) | 加法・乗法・逆元，公開入力とウィットネスの整理．計算問題の解答付き | [第3回](../learn/session-03) |

新しい演習教材は，準備ができたものからこの一覧に追加します．

第11〜15回の演習は，[幕IIIの操作ガイド](./manuals#route)で，証明生成・検証から比較・発展演習まで順に進められます．

## Groth16の実装例と操作マニュアル {#groth16}

[第11回・Groth16](../learn/session-11)に対応する外部の実装例です．実装サイトと公式の操作マニュアルを対にしてまとめました．まずは **Circom＋snarkjsの回路例** で，回路作成から証明の生成・検証までを一巡するのがおすすめです．

| 実装サイト | 演習で扱う例・学習の目的 | 環境・目安 | 操作マニュアル・実行例 |
| --- | --- | --- | --- |
| [Circom](https://github.com/iden3/circom) ＋ [snarkjs](https://github.com/iden3/snarkjs) | 乗算を含む回路．R1CS，ウィットネス，セットアップ，証明，検証の各成果物を確認する | ローカルのCircomコンパイラとNode.js．入門向け | [snarkjs公式の一連の手順](https://github.com/iden3/snarkjs#readme)（回路作成・コンパイル・ウィットネス計算・Groth16セットアップ・証明・検証） / [Circomの導入と基本操作](./manuals#circuits) |
| [ZoKrates](https://github.com/ZoKrates/ZoKrates) | 非公開の平方根と公開の平方の関係を証明するHello World．短いプログラムから一連の処理を試す | ローカルCLIまたはDocker．入門向け | [導入から証明・検証まで](https://zokrates.github.io/gettingstarted.html) / [CLI操作](https://zokrates.github.io/toolbox/cli.html) / [Groth16（G16）の選択](https://zokrates.github.io/toolbox/proving_schemes.html) |
| [gnark](https://github.com/Consensys-Incorporated/gnark) | Goで回路とウィットネスを記述し，`groth16.Setup`・`Prove`・`Verify`の対応を追う | ローカルのGo開発環境．Go経験者向け | [導入](https://docs.gnark.consensys.io/HowTo/get_started) / [回路の記述](https://docs.gnark.consensys.io/HowTo/write/circuit_api) / [証明生成・検証のコード例](https://docs.gnark.consensys.io/HowTo/prove) |
| [bellman](https://github.com/zkcrypto/bellman) | SHA-256を2回適用したハッシュの原像を知っていることを証明する例．制約・ガジェット・Groth16 APIを読む | ローカルのRust/Cargo．発展向け | [公式の回路・証明生成・検証例（0.14.0）](https://docs.rs/bellman/0.14.0/bellman/#example-circuit) / [Groth16 API（0.14.0）](https://docs.rs/bellman/0.14.0/bellman/groth16/) |

### 演習の進め方

1. 上の表から1つ選び，リンク先の例をそのまま実行する．Groth16を選択し，使用バージョンとコマンドを記録する．
2. 公開入力，非公開のウィットネス，証明鍵，検証鍵，証明がそれぞれ何かを整理する．
3. 正しい入力で証明を生成・検証する．次に，証明は変えずに公開入力を変更して，検証が失敗することを確認する．
4. 回路の制約を変更した場合に，再コンパイルと回路に対応したセットアップが必要になることを，第11回と結びつけて説明する．

公式資料の参照確認日: **2026年9月27日**．外部マニュアルは主に英語です．Circomのドキュメントサイトは確認時に接続できなかったため，上の表では参照できたsnarkjs公式READMEを主な手順として案内しています．ここではリンク先の例とGroth16対応を確認しており，全ツールのローカル実行を検証したものではありません．bellmanは例とAPIの版を0.14.0に揃えています．演習で生成するローカルのセットアップは学習用として扱います．

## PLONKの実装例と操作マニュアル {#plonk}

[第12回・PLONK](../learn/session-12)に対応する実装と公式手順です．まずは **Circom＋snarkjs** で，Groth16の演習と同じ回路をPLONKでも証明し，セットアップや生成物を比べてみましょう．GoでAPIを学ぶ場合はgnark，Rustで回路の構成を読む場合はDusk PLONKが候補になります．

| 実装サイト | 演習で扱う例・学習の目的 | 環境・目安 | 操作マニュアル・実行例 |
| --- | --- | --- | --- |
| [Circom](https://github.com/iden3/circom) ＋ [snarkjs](https://github.com/iden3/snarkjs) | 公式READMEの乗算を含む回路例をPLONKで証明する．同じR1CSからGroth16との違いを比較する | ローカルのCircomコンパイラとNode.js．入門向け | [導入・全体の手順](https://github.com/iden3/snarkjs#readme) / [セットアップ](https://github.com/iden3/snarkjs#15-setup) / [証明生成](https://github.com/iden3/snarkjs#23-create-the-proof) / [検証](https://github.com/iden3/snarkjs#24-verify-the-proof)．各節の **PLONK** のコマンドを選ぶ |
| [gnark](https://github.com/Consensys-Incorporated/gnark) | Goで回路をSCSとしてコンパイルし，`plonk.Setup`・`Prove`・`Verify`を追う．Groth16用R1CSとのコンパイル方法の違いを確認する | ローカルのGo開発環境．Go経験者向け | [導入](https://docs.gnark.consensys.io/HowTo/get_started) / [回路の記述](https://docs.gnark.consensys.io/HowTo/write/circuit_api) / [証明生成・検証](https://docs.gnark.consensys.io/HowTo/prove)（**PlonK** タブの例を使用） |
| [Dusk PLONK（dusk-plonk）](https://github.com/dusk-network/plonk) | Rustの公式回路例から，制約の構成・コンパイル・証明・検証を読む．BLS12-381，KZG，カスタムゲートを用いる実装 | ローカルのRust/Cargo．発展向け | [利用案内](https://github.com/dusk-network/plonk#usage) / [公式回路例 circuit.rs](https://github.com/dusk-network/plonk/blob/master/examples/circuit.rs) / [APIマニュアル](https://docs.rs/dusk-plonk/latest/dusk_plonk/) |

### PLONK演習の進め方

1. 実装を1つ選び，公式の例を実行する．使用したリリースまたはコミット，依存ライブラリ，コマンドを記録する．例とAPIマニュアルの版を揃える．
2. 公開入力とウィットネスを確認し，証明を生成・検証する．証明を固定したまま公開入力を変え，検証が失敗することを確かめる．
3. 回路を変更し，対応する鍵を生成し直す．容量などの条件を満たす同じ汎用SRSを再利用できることと，回路ごとの前処理が残ることを区別する．
4. Groth16と比較する場合は，同じ計算・入力で証明サイズと生成時間を記録する．実装・曲線・バージョンも併記し，その実験条件での比較として考察する．

**セットアップを読むときのポイント:** snarkjsのPLONKでは，Powers of Tauを利用して `plonk setup` で回路ごとの鍵を生成します．Groth16用の第2段階の貢献手順は不要ですが，「セットアップ処理がすべて不要」になるわけではありません．gnarkの公式例にある `unsafekzg.NewSRS` は開発・テスト用です．演習用のローカルSRSとして扱います．

公式資料の参照確認日: **2026年9月27日**．主に英語のマニュアルです．掲載した例とPLONK対応を資料で確認しており，全実装のローカル実行を検証したものではありません．

## STARKの実装例と操作マニュアル {#stark}

[第13回・STARK](../learn/session-13)に対応する外部の実装例です．**仕組みをPythonで追うならAnatomy of a STARK，AIRを自分で記述するならWinterfell，プログラムの実行を証明するならMiden VM**を選べます．実装サイトと，著者・開発元の操作手順やコード例を対にしています．

| 実装サイト | 演習で扱う例・学習の目的 | 環境・目安 | 操作マニュアル・実行例 |
| --- | --- | --- | --- |
| [Anatomy of a STARK](https://github.com/aszepieniec/stark-anatomy) | Rescue-Primeの計算を証明する教育用Python実装．有限体・多項式・FRI・STARKを段階的に組み立てる | ローカルのPython．第3〜6回を復習しながら実装を学ぶ人向け | [著者のチュートリアル](https://aszepieniec.github.io/stark-anatomy/) / [Part 5: 証明系の組み立て](https://aszepieniec.github.io/stark-anatomy/rescue-prime) / [Pythonコードとテスト](https://github.com/aszepieniec/stark-anatomy/tree/master/code)．READMEのJekyll起動手順は解説サイト用で，Python演習の手順ではない |
| [Winterfell](https://github.com/facebook/winterfell) | 値を3乗して42を加える反復計算の例．実行トレース，遷移制約，境界の指定，証明生成・検証を対応づける | ローカルのRust/Cargo．Rust経験者向け | [公式の利用チュートリアル](https://github.com/facebook/winterfell#usage) / [演習用の実装例](https://github.com/facebook/winterfell/tree/main/examples) / [APIマニュアル](https://docs.rs/winterfell/latest/winterfell/) |
| [Miden VM](https://github.com/0xMiden/miden-vm) | Miden Assemblyの加算やFibonacciの例．VMでプログラムを実行し，その実行証明を生成・検証する | ローカルのRust/CargoとMiden VM CLI．VMを使う演習向け | [公式クレートREADME・利用例](https://github.com/0xMiden/miden-vm/blob/next/miden-vm/README.md) / [CLI操作](https://github.com/0xMiden/miden-vm/blob/next/miden-vm/README.md#cli-interface) / [Fibonacci演習](https://github.com/0xMiden/miden-vm/blob/next/miden-vm/README.md#fibonacci-example)．リンクは開発ブランチ `next` のため，利用するリリースと手順の版を揃える |

### STARK演習の進め方

1. 実装を1つ選び，バージョンまたはコミットを記録する．対応する手順に従い，小さい入力・短い実行トレースで例を動かす．
2. 公開入力・出力，実行トレース，遷移制約，境界制約がコードのどこにあるかを確認する．VMを使う場合は，命令列とVMが生成するトレースの役割を区別する．
3. 正しい実行の証明を検証する．証明を固定したまま公開の出力などを変え，検証が失敗することを確かめる．
4. トレース長を変更して証明サイズ・生成時間・検証時間を記録する．安全性パラメータやハッシュ関数も併記し，同じ条件で比較する．

**学習上の区別:** 計算の正しさを証明できることと，ウィットネスの情報が漏れないゼロ知識性は別の性質です．Winterfellは公式READMEで完全なゼロ知識性を提供していないと明記しています．実装ごとの性質を確認し，演習には公開してよいサンプル入力を使います．

資料の参照確認日: **2026年9月27日**．外部の解説・操作マニュアルは主に英語です．掲載した実装・手順を資料で確認しており，全実装のローカル実行を検証したものではありません．

## ツールとマニュアル

| リンク集 | 探せるもの |
| --- | --- |
| [利用可能なツール](./tools) | 幕IIIの授業・使用言語・学習目的に合わせたツール選び |
| [基本操作マニュアル集](./manuals) | 幕III：Groth16・PLONK・STARKの操作手順，比較・発展演習 |

[シラバス](../learn/) · [各回の授業](../learn/sessions) · [トピック別](../learn/topics)
