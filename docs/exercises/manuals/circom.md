---
outline: [2, 3]
prev:
  text: 基本操作マニュアル集
  link: /exercises/manuals
next:
  text: snarkjsの操作マニュアル
  link: /exercises/manuals/snarkjs
---

# Circomの操作マニュアル

更新日：2026年11月20日

[基本操作マニュアル集](../manuals) · [snarkjsの操作マニュアル](./snarkjs) · [第11回：Groth16](../../learn/session-11) · [第12回：PLONK](../../learn/session-12)

## このページで行うこと

Circomで小さな算術回路を記述し，R1CS・WebAssembly版のウィットネス計算プログラム・デバッグ用シンボル表を生成します．その後，入力値からウィットネスを計算し，制約を満たすことをsnarkjsで確認します．証明のセットアップ・生成・検証は[snarkjsの操作マニュアル](./snarkjs)で扱います．

このリポジトリの応用演習では，Node.jsと`circom2` 0.2.22（Circomコンパイラ2.2.2），`snarkjs` 0.7.5を使います．版を揃えて教材を再現するための選択です．新しいプロジェクトでは公式の現行版と導入手順を確認してください．

## 1. 作業場所とツールを準備する

Node.jsの保守中のLTS版とnpmを用意します．新しい作業フォルダを作り，Circomコンパイラとsnarkjsをローカル依存にします．

```sh
mkdir circom-manual
cd circom-manual
npm init -y
npm install --save-dev circom2@0.2.22 snarkjs@0.7.5
npx circom2 --version
npx snarkjs --help
mkdir -p build
```

このサイトの[`compose.yaml`](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/compose.yaml)を使う場合は，[基本操作マニュアル集のDocker節](../manuals#docker)を参照します．

## 2. 回路を書く {#write-circuit}

`square.circom`を作り，次の内容を保存します．

```text
pragma circom 2.0.0;

template Square() {
    signal input in;
    signal output out;

    out <== in * in;
}

component main = Square();
```

`signal input`と`signal output`は回路の入力・出力です．`out <== in * in`は，ウィットネス計算時に`out`へ値を割り当てると同時に，回路に「`out`は`in`の二乗である」という制約を加えます．ここでは制約は有限体上の式として解釈されます．

## 3. 回路をコンパイルする {#compile-circuit}

```sh
npx circom2 square.circom --r1cs --wasm --sym --inspect -o build
```

生成物は次の通りです．

| ファイル | 役割 |
| --- | --- |
| `build/square.r1cs` | 回路を表す制約系 |
| `build/square_js/square.wasm` | 入力からウィットネスを計算するWebAssemblyプログラム |
| `build/square_js/generate_witness.js` | WebAssemblyを呼び出すウィットネス計算スクリプト |
| `build/square.sym` | R1CSの信号番号と名前を対応づけるデバッグ情報 |

`--r1cs`，`--wasm`，`--sym`は各生成物を指定し，`--inspect`は制約系の追加チェックを有効にします．詳細は[公式コンパイル手順](https://docs.circom.io/getting-started/compiling-circuits/)と[コンパイルオプション](https://docs.circom.io/getting-started/compilation-options/)を参照します．

## 4. ウィットネスを計算し，制約を確認する {#compute-witness}

`input.json`を作ります．大きな整数を扱う場合にJSON処理系で精度を失わないよう，数値は文字列で書きます．

```json
{"in": "7"}
```

ウィットネスを計算します．

```sh
node build/square_js/generate_witness.js \
  build/square_js/square.wasm input.json build/witness.wtns
```

R1CSに含まれるすべての制約をウィットネスが満たすか確認します．

```sh
npx snarkjs wtns check build/square.r1cs build/witness.wtns
npx snarkjs r1cs info build/square.r1cs
```

最初のコマンドで制約検査の成功を確認します．2つ目は曲線，信号数，制約数，公開・秘密入力数などを表示します．ウィットネスは全信号の値を含む中間データです．秘密の入力を含む場合があるため，公開リポジトリへ不用意に保存しないでください．

## 5. Circomで特に注意する点

- **`<==`と`<--`を区別する**：`<==`は代入と制約の両方を生成します．`<--`はウィットネス計算用の代入だけで，それ自体ではR1CS制約を追加しません．`<--`を使う特殊な場合は，対応する条件を別途制約として記述します．
- **非線形式を一つの制約に詰め込まない**：R1CSの各制約は線形式どうしの積と線形式からなる二次制約です．高次の積は中間信号に分けて表現します．
- **整数の範囲を制約する**：回路の演算は有限体上で行われます．整数の足し算・比較・範囲条件を使う場合は，法をまたぐ値の折り返しを防ぐ範囲制約が必要です．
- **公開信号を明示する**：通常，`main`の入力信号は秘密入力として扱われ，出力は公開されます．追加の公開入力を指定する構文は，利用するCircom版の公式文書で確認します．

公式資料の[`<==`・`<--`と制約生成の説明](https://docs.circom.io/circom-language/constraint-generation/)および[信号の説明](https://docs.circom.io/circom-language/signals/)を参照してください．

## 次に読むページ

[snarkjsの操作マニュアル](./snarkjs)へ進み，R1CSとウィットネスからGroth16またはPLONKの証明を作って検証します．

## 参考資料

[1] Circom Contributors, “[Installation](https://docs.circom.io/getting-started/installation/),” *Circom 2 Documentation*, 参照日：2026年11月20日．

[2] Circom Contributors, “[Writing Circuits](https://docs.circom.io/getting-started/writing-circuits/),” *Circom 2 Documentation*, 参照日：2026年11月20日．

[3] Circom Contributors, “[Constraint Generation](https://docs.circom.io/circom-language/constraint-generation/),” *Circom 2 Documentation*, 参照日：2026年11月20日．

[4] Circom Contributors, “[Compiling Circuits](https://docs.circom.io/getting-started/compiling-circuits/),” *Circom 2 Documentation*, 参照日：2026年11月20日．
