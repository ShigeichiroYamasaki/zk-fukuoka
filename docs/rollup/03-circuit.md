---
outline: [2, 3]
---
<script setup>
import { withBase } from "vitepress";
</script>

# 3. 署名と送金回路

[応用編](./) · [前：状態ルート](./02-state) · [次：バッチ証明](./04-batches)

## 最初に算術だけを動かす {#core}

<a :href="withBase('/examples/rollup/transfer_core.circom')" download>transfer_core.circom</a>は，送金前後の残高とnonceを結ぶ入門回路です．署名やMerkleパスは含みません．

$$b'_s=b_s-a,\qquad b'_r=b_r+a,\qquad n'=n+1.$$

入力と出力をすべて64ビットに制限し，$a\ne0$ を要求します．負の残高が体の大きな値へ回り込んでも，出力のビット制約で拒否されます．nonceと受取残高の加算上限も同じ考え方で検査します．

```sh
mkdir -p build
circom transfer_core.circom --r1cs --wasm --sym -o build
```

`input.json`を次の内容で作ります．整数は文字列で書きます．

```json
{"senderBalance":"100","receiverBalance":"0","amount":"30","nonce":"0"}
```

```sh
node build/transfer_core_js/generate_witness.js build/transfer_core_js/transfer_core.wasm input.json build/witness.wtns
```

出力は70，30，1です．amountを101にするとウィットネス生成が失敗することも確認します．この回路は公開値の算術だけを証明するため，これをそのまま送金認可に使ってはいけません．

### 配布回路の検証記録

2026年9月27日に，Circomコンパイラ2.2.2（npmのcircom2 0.2.22）とsnarkjs 0.7.5で確認しました．459制約の回路をコンパイルし，ウィットネス検査，ローカル練習用セットアップでのGroth16証明生成・検証まで成功しています．公開信号は出力から並び，この例では`[70,30,1,100,0,30,0]`です．残高超過，金額0，受取残高とnonceの上限超過を拒否し，公開出力を71へ変えた証明も拒否しました．

この検証は算術入門回路だけを対象としています．練習用の鍵やセットアップは配布せず，実資産用のセットアップとして再利用しません．

## 本体回路に追加する条件

`circuits/transfer.circom`では次の関係を同時に強制します．

| 対象 | 制約 |
| --- | --- |
| アカウント | IDの範囲，異なる送受信者，旧ルートへの所属 |
| 認可 | 送金者の葉に含まれるL2公開鍵による署名の検証 |
| メッセージ | 送信者ID，受信者ID，金額，nonce，ドメインのすべてに署名 |
| 残高・nonce | 算術入門回路と同じ範囲・更新条件 |
| 葉の不変部分 | ID，L1所有者，L2鍵を維持 |
| 受取人の更新 | 送金者更新後の中間ルートから更新 |

ドメインは，固定バージョン，L1 chainId，rollupコントラクトアドレス，トークンアドレスを正規化してハッシュします．別ネットワークや別コントラクトで署名を使い回せないようにします．chainIdの表現幅も仕様で固定してください．

```text
message = Poseidon(domain, TAG_TRANSFER, senderId, receiverId, amount, nonce)
```

署名はcircomlibのEdDSA/Poseidon構成を使う方針です．[公式検証回路](https://github.com/iden3/circomlib/blob/master/circuits/eddsaposeidon.circom)の入力を確認し，必須の署名検証を無効化できないようにします．L2公開鍵の曲線・部分群・非零条件と，署名値の正規表現を，選んだ版がどこで保証するか確認して不足分を制約します．Ethereumの`personal_sign`をこの回路へそのまま入力することはできません．

## 出金と入金は認可が違う

出金では`TAG_WITHDRAW`，L1受取先アドレス，金額，nonceに署名し，残高を減らして出金レコードを作ります．後から請求者が受取先を変更できないようにします．

入金はL2送金者の署名で作りません．L1で実際に受け取ったトークンに対応する，入金キューの次の要素を消費します．キューとの対応は[バッチの公開入力](./04-batches#inputs)で結び付けます．

## 合格条件

算術の正常例に加えて，金額0，残高超過，受取残高上限，nonce上限を拒否してください．本体回路では，署名の改変，別人の鍵，受取人変更，別ドメイン，同nonce再使用，Merkleパス改変をすべて拒否することを必須にします．

単に`assert`でホスト側の値を確認するだけではR1CSの制約にならない場合があります．ウィットネス計算と制約の違いを[Circom公式資料](https://github.com/iden3/circom/blob/master/mkdocs/docs/circom-language/constraint-generation.md)で確認し，悪い入力を回路自体が拒否するテストを作ります．
