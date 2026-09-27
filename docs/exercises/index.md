---
outline: [2, 3]
---

# 演習

講義で学んだことを、計算や実装で確かめよう。演習教材、利用可能なツール、基本操作マニュアルをここから探せます。

## まずはここから

1. [有限体の導入演習](../learn/foundations)で、法7の加法・乗法・逆元を手で計算する。
2. [ツール一覧](./tools)から、計算や実装に使う環境を選ぶ。
3. [基本操作マニュアル集](./manuals)で、起動・入力・実行の手順を確認する。

## 演習教材

| 教材 | 内容 | 関連する授業 |
| --- | --- | --- |
| [有限体の導入演習](../learn/foundations) | 加法・乗法・逆元、公開入力とウィットネスの整理。計算問題の解答付き | [第3回](../learn/session-03) |

新しい演習教材は、準備ができたものからこの一覧に追加します。

## Groth16の実装例と操作マニュアル {#groth16}

[第11回・Groth16](../learn/session-11)に対応する外部の実装例です。実装サイトと公式の操作マニュアルを対にしてまとめました。まずは **Circom＋snarkjsの回路例** で、回路作成から証明の生成・検証までを一巡するのがおすすめです。

| 実装サイト | 演習で扱う例・学習の目的 | 環境・目安 | 操作マニュアル・実行例 |
| --- | --- | --- | --- |
| [Circom](https://github.com/iden3/circom) ＋ [snarkjs](https://github.com/iden3/snarkjs) | 乗算を含む回路。R1CS、ウィットネス、セットアップ、証明、検証の各成果物を確認する | ローカルのCircomコンパイラとNode.js。入門向け | [snarkjs公式の一連の手順](https://github.com/iden3/snarkjs#readme)（回路作成・コンパイル・ウィットネス計算・Groth16セットアップ・証明・検証） / [Circomの導入と基本操作](./manuals#circuits) |
| [ZoKrates](https://github.com/ZoKrates/ZoKrates) | 非公開の平方根と公開の平方の関係を証明するHello World。短いプログラムから一連の処理を試す | ローカルCLIまたはDocker。入門向け | [導入から証明・検証まで](https://zokrates.github.io/gettingstarted.html) / [CLI操作](https://zokrates.github.io/toolbox/cli.html) / [Groth16（G16）の選択](https://zokrates.github.io/toolbox/proving_schemes.html) |
| [gnark](https://github.com/Consensys-Incorporated/gnark) | Goで回路とウィットネスを記述し、`groth16.Setup`・`Prove`・`Verify`の対応を追う | ローカルのGo開発環境。Go経験者向け | [導入](https://docs.gnark.consensys.io/HowTo/get_started) / [回路の記述](https://docs.gnark.consensys.io/HowTo/write/circuit_api) / [証明生成・検証のコード例](https://docs.gnark.consensys.io/HowTo/prove) |
| [bellman](https://github.com/zkcrypto/bellman) | SHA-256を2回適用したハッシュの原像を知っていることを証明する例。制約・ガジェット・Groth16 APIを読む | ローカルのRust/Cargo。発展向け | [公式の回路・証明生成・検証例（0.14.0）](https://docs.rs/bellman/0.14.0/bellman/#example-circuit) / [Groth16 API（0.14.0）](https://docs.rs/bellman/0.14.0/bellman/groth16/) |

### 演習の進め方

1. 上の表から1つ選び、リンク先の例をそのまま実行する。Groth16を選択し、使用バージョンとコマンドを記録する。
2. 公開入力、非公開のウィットネス、証明鍵、検証鍵、証明がそれぞれ何かを整理する。
3. 正しい入力で証明を生成・検証する。次に、証明は変えずに公開入力を変更して、検証が失敗することを確認する。
4. 回路の制約を変更した場合に、再コンパイルと回路に対応したセットアップが必要になることを、第11回と結びつけて説明する。

公式資料の参照確認日: **2026年9月27日**。外部マニュアルは主に英語です。Circomのドキュメントサイトは確認時に接続できなかったため、上の表では参照できたsnarkjs公式READMEを主な手順として案内しています。ここではリンク先の例とGroth16対応を確認しており、全ツールのローカル実行を検証したものではありません。bellmanは例とAPIの版を0.14.0に揃えています。演習で生成するローカルのセットアップは学習用として扱います。

## ツールとマニュアル

| リンク集 | 探せるもの |
| --- | --- |
| [利用可能なツール](./tools) | ブラウザーで使う計算環境、有限体・多項式の計算、回路の記述、証明の生成・検証 |
| [基本操作マニュアル集](./manuals) | ツールの導入と基本操作、回路作成、ウィットネス計算、Gitでの教材編集 |

[シラバス](../learn/) · [各回の授業](../learn/sessions) · [トピック別](../learn/topics)
