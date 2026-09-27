---
outline: [2, 3]
---

# 4. バッチ証明と公開入力

[応用編](./) · [前：送金回路](./03-circuit) · [次：L1接続](./05-bridge)

## 4操作を順番につなぐ

バッチは4スロットです．種別はNOP=0，入金=1，送金=2，出金=3とします．各スロットは前の出力ルートを次の入力ルートに使い，順序を固定します．

$$r_0=oldRoot\to r_1\to r_2\to r_3\to r_4=newRoot.$$

NOPは全入力を0へ固定し，ルートとカーソルを変更しません．有効操作の後ろだけにNOPを置きます．種別は範囲と選択条件を制約し，不要な分岐の自由変数が有効な制約を打ち消さないようにします．

## 公開入力を先に決める {#inputs}

Groth16へ渡す公開信号の順序を，回路とSolidityの両方で次のように固定します．実際の生成物の順序を検査するテストも必要です．

```text
[domain, batchNumber, oldRoot, newRoot,
 depositStart, depositEnd, depositHashHi, depositHashLo,
 withdrawalRoot, dataHashHi, dataHashLo]
```

| 項目 | 回路とL1が一致させるもの |
| --- | --- |
| domain・batchNumber | 対象チェーン・コントラクト，次のバッチ番号 |
| oldRoot・newRoot | 現在の保存ルートと，処理後のルート |
| depositStart・End | 消費済みカーソルから始まる連続した入金範囲 |
| depositHashの2分割 | L1キューから得た消費対象データのSHA-256 |
| withdrawalRoot | このバッチが作った4スロットの出金木のルート |
| dataHashの2分割 | L1へ公開するバッチデータのSHA-256 |

SHA-256の256ビット値を上位・下位128ビットに分けます．各limbを128ビットに制約し，回路のビット列と対応させます．256ビット全体を単に体の法で縮めて同一視しない仕様です．

## 公開データの符号化 {#encoding}

すべて符号なし・ビッグエンディアンで，値域外を拒否します．1スロットは次の135バイト，4スロットで540バイトです．

```text
op:u8 | sender:u8 | receiver:u8 | amount:u64 | nonceOrDepositId:u64 |
recipient:u160 | R8x:u256 | R8y:u256 | S:u256
```

送金のrecipientは0，出金のreceiverは0，入金のsender・recipient・署名は0です．入金ではnonce欄をdepositIdとして使います．NOPはすべて0です．アカウントIDは0〜3，署名座標などは使用する体・群の正規値域内に制限します．

入金ハッシュは，消費する各要素の`depositId:u64 | accountId:u8 | amount:u64`をキュー順に並べ，最大4件の残りをゼロ埋めした68バイトにSHA-256を適用します．有効件数は`depositEnd-depositStart`です．金額0の入金を禁止するので，有効レコードとパディングを区別できます．

回路内でも**同じ操作フィールドから同じ540バイトを作り，SHA-256を制約**します．ハッシュ値を公開入力に置くだけで，内部の操作と結び付けなければ意味がありません．L1は受け取ったデータを再ハッシュして照合します．ハッシュ回路には[circomlibのSHA-256実装](https://github.com/iden3/circomlib/blob/master/circuits/sha256/sha256.circom)を参照し，ビット順序のテストを作ります．

## 証明生成まで進む

最初は[送金の算術入門回路](./03-circuit#core)で，[既存のGroth16操作手順](../exercises/manuals#groth16)を実行してください．その後，署名・Merkle更新・キュー・データハッシュを統合した`batch.circom`へ置き換えます．

```sh
circom circuits/batch.circom --r1cs --wasm --sym -o build
snarkjs r1cs info build/batch.r1cs
snarkjs groth16 setup build/batch.r1cs pot_final.ptau build/batch_0000.zkey
snarkjs zkey contribute build/batch_0000.zkey build/batch_final.zkey --name="local exercise"
snarkjs zkey export verificationkey build/batch_final.zkey build/verification_key.json
snarkjs groth16 fullprove batch-input.json build/batch_js/batch.wasm build/batch_final.zkey build/proof.json build/public.json
snarkjs groth16 verify build/verification_key.json build/public.json build/proof.json
snarkjs zkey export solidityverifier build/batch_final.zkey contracts/Verifier.sol
```

`batch.circom`と`batch-input.json`はこの段階の実装成果物です．上のコマンドは，まだ配布されていない本体回路を自動生成するものではありません．`pot_final.ptau`は実際の制約数を満たすものを準備します．ローカルの練習用セットアップで実資産を扱わないでください．[snarkjs公式手順](https://github.com/iden3/snarkjs)でセットアップ検証も行います．

## 合格条件

四つの操作を参照実装と比較し，バッチ順序の入替え，旧ルートの変更，入金カーソルの飛越し，公開データの1バイト変更，出金ルートの変更，NOP欄への非零値を拒否してください．公開信号一つずつの改変テストで，すべてが証明に結び付いていることを確認します．
