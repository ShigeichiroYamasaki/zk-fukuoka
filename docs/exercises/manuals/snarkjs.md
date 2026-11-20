---
outline: [2, 3]
prev:
  text: Circomの操作マニュアル
  link: /exercises/manuals/circom
next:
  text: 基本操作マニュアル集
  link: /exercises/manuals
---

# snarkjsの操作マニュアル

更新日：2026年11月20日

[基本操作マニュアル集](../manuals) · [Circomの操作マニュアル](./circom) · [第11回：Groth16](../../learn/session-11) · [第12回：PLONK](../../learn/session-12)

## このページで行うこと

Circomで作ったR1CSとウィットネスから，snarkjsでGroth16またはPLONKの証明を生成し，公開入力と検証鍵を使って検証します．例では[Circomの操作マニュアル](./circom)の`square.circom`を使います．

このサイトの再現可能な演習例ではNode.js LTSと`snarkjs` 0.7.5を使います．版は演習コードの`package.json`に合わせます．snarkjsの公式READMEは最新版を利用するよう勧めているため，新規開発では使用版の変更履歴と最新の公式手順を確認してください．

## 1. 入力ファイルを用意する

以下は[Circomの手順](./circom)で生成したファイルを前提にします．未作成の場合は先にそちらを完了します．

- `build/square.r1cs`：制約系
- `build/witness.wtns`：入力`in=7`から計算したウィットネス
- `build/square_js/square.wasm`：ウィットネス計算用プログラム

R1CSの情報とウィットネスを確認します．

```sh
npx snarkjs r1cs info build/square.r1cs
npx snarkjs wtns check build/square.r1cs build/witness.wtns
```

snarkjsのコマンドと各入出力は[`snarkjs --help`](https://github.com/iden3/snarkjs#readme)でも確認できます．

## 2. Powers of Tauを準備する {#powers-of-tau}

この練習では，`bn128`のpower 8（最大256制約）でローカルにPowers of Tauを作ります．配布ファイルを取得せずにセットアップ手順を追えます．ここで`openssl rand`から作る値はコマンド動作確認用の実験入力であり，独立した公開乱数ビーコンではありません．自分だけで貢献・入力値を管理する学習用実験なので，信頼できる本番用セットアップにはなりません．

```sh
npx snarkjs powersoftau new bn128 8 build/pot8_0000.ptau

POT_ENTROPY="$(openssl rand -hex 32)"
npx snarkjs powersoftau contribute \
  build/pot8_0000.ptau build/pot8_0001.ptau \
  --name="Local learning contribution" --entropy="$POT_ENTROPY"
unset POT_ENTROPY

BEACON_HEX="$(openssl rand -hex 32)"
npx snarkjs powersoftau beacon \
  build/pot8_0001.ptau build/pot8_beacon.ptau \
  "$BEACON_HEX" 10 -n="Local learning beacon"
npx snarkjs powersoftau prepare phase2 \
  build/pot8_beacon.ptau build/pot8_final.ptau
npx snarkjs powersoftau verify build/pot8_final.ptau
```

すべてのコマンドが成功し，最後に`Powers Of tau file OK!`と表示されることを確認します．`powersoftau verify`は生成物の暗号学的整合性を検査しますが，学習者自身が秘密を破棄したことまでは証明しません．大きな回路では制約数に合うpowerを選びます．実際のアプリケーションでは，出所・チェックサム・複数参加者によるセレモニーを確認したパラメータを使ってください．

## 3. Groth16で証明する {#groth16}

Groth16のセットアップは回路ごとに行います．まず回路用の初期`.zkey`を生成します．

```sh
npx snarkjs groth16 setup \
  build/square.r1cs build/pot8_final.ptau build/square_0000.zkey
```

初期`.zkey`へ貢献を追加し，その結果をランダムビーコンで最終化します．以下はコマンドの流れを学ぶためのローカル例であり，実運用の信頼できるセットアップではありません．

```sh
CONTRIBUTION_ENTROPY="$(openssl rand -hex 32)"
npx snarkjs zkey contribute \
  build/square_0000.zkey build/square_0001.zkey \
  --name="Local learning contribution" \
  --entropy="$CONTRIBUTION_ENTROPY"
unset CONTRIBUTION_ENTROPY

BEACON_HEX="$(openssl rand -hex 32)"
npx snarkjs zkey beacon \
  build/square_0001.zkey build/square_final.zkey \
  "$BEACON_HEX" 10 -n="Local learning beacon"

npx snarkjs zkey verify \
  build/square.r1cs build/pot8_final.ptau build/square_final.zkey
```

安全なセットアップには，手順・貢献者・乱数ビーコンの由来を検証できることが必要です．単独のローカル実験は信頼を分散していません．初期`.zkey`を本番に使ってはいけません．

検証鍵をエクスポートし，証明を作ります．

```sh
npx snarkjs zkey export verificationkey \
  build/square_final.zkey build/verification_key.json
npx snarkjs groth16 prove \
  build/square_final.zkey build/witness.wtns \
  build/proof_groth16.json build/public_groth16.json
npx snarkjs groth16 verify \
  build/verification_key.json build/public_groth16.json \
  build/proof_groth16.json
```

検証が成功すると`OK`が表示されます．証明JSONは証明本体，公開JSONは公開入力・出力を含みます．ウィットネスは証明生成者の秘密を含むことがあるため，検証者には通常，証明・公開JSON・検証鍵だけを渡します．

## 4. PLONKで同じ回路を証明する {#plonk}

PLONKでもCircom回路をR1CSとして入力します．Groth16と同じ回路・同じPowers of Tauを用い，セットアップ方式の違いを比較します．PLONKではGroth16の回路ごとの第2段階貢献を行いませんが，回路に対応する前処理・鍵生成は残ります．

```sh
npx snarkjs plonk setup \
  build/square.r1cs build/pot8_final.ptau build/square_plonk.zkey
npx snarkjs zkey export verificationkey \
  build/square_plonk.zkey build/verification_key_plonk.json
npx snarkjs plonk prove \
  build/square_plonk.zkey build/witness.wtns \
  build/proof_plonk.json build/public_plonk.json
npx snarkjs plonk verify \
  build/verification_key_plonk.json build/public_plonk.json \
  build/proof_plonk.json
```

Powers of TauはPLONK向けに回路をまたいで使える汎用セットアップですが，対応する最大規模や曲線は選んだファイルに依存します．

## 5. 検証者として確認する {#verify-as-verifier}

`build/public_groth16.json`（またはPLONK側の公開JSON）を複製して値を変更し，元の証明と組み合わせて再検証します．証明と公開値の組が結び付いているため，変更した値では検証が失敗するはずです．この実験は実装の動作確認であり，安全性の数学的証明ではありません．

検証者へ渡すファイルと，渡さないファイルを分けます．

| ファイル | 取り扱い |
| --- | --- |
| `proof_*.json` | 検証者へ渡す証明 |
| `public_*.json` | 検証者へ渡す公開値 |
| `verification_key*.json` | 検証者へ渡す公開検証鍵 |
| `witness.wtns`，秘密入力JSON | 秘密が含まれる可能性がある．通常は共有しない |
| `.zkey`，`.ptau` | 設定・証明生成用ファイル．保管先と配布範囲を区別する |

## 6. よくある取り違え

- Circomは回路をコンパイルし，snarkjsはR1CSの確認，セットアップ，証明，検証を行います．片方だけではこの演習の全工程になりません．
- Groth16の`.zkey`は回路固有です．回路を変更したらセットアップからやり直します．
- PLONKのPowers of Tauは汎用ですが，すべての曲線・回路規模に使えるわけではありません．必要なpowerを確認します．
- `.wtns`をGitへ登録すると，秘密入力や中間信号を漏らすことがあります．生成物を共有する前に内容を確認します．

## 参考資料

[1] 0KIMS Association, “[snarkjs README](https://github.com/iden3/snarkjs#readme),” GitHub, 参照日：2026年11月20日．

[2] Circom Contributors, “[Computing the Witness](https://docs.circom.io/getting-started/computing-the-witness/),” *Circom 2 Documentation*, 参照日：2026年11月20日．

[3] 0KIMS Association, “[snarkjs Releases](https://github.com/iden3/snarkjs/releases),” GitHub, 参照日：2026年11月20日．
