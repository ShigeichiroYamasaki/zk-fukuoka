---
outline: [2, 3]
---

# 5. ERC-20とL1検証コントラクト

[応用編](./) · [前：バッチ](./04-batches) · [次：データ公開と退出](./06-availability)

## コントラクトの役割を分ける

| コントラクト | 担当 |
| --- | --- |
| TestToken | 演習用ERC-20。通常の固定残高型で，送金手数料・rebaseなし |
| Rollup | 預託，キュー，状態ルート，バッチ番号，出金請求記録 |
| Verifier | 固定した回路・検証鍵に対するGroth16証明検証 |

TokenとVerifierのアドレス，初期アカウントルートをRollupの構築時に固定します。初版には管理者が任意の新ルートを設定する関数や，証明検証を迂回する関数を置きません。

## SolidityとFoundryの準備

[OpenZeppelin ERC-20とSafeERC20](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20)，[Foundryのプロジェクト作成](https://getfoundry.sh/projects/creating-a-new-project/)を読み，利用版を固定します。

```sh
forge init contracts-lab
cd contracts-lab
forge build
forge test
anvil
```

生成されるサンプルを理解してから，自分のToken・Rollup・Verifierとテストへ置き換えます。先にローカルチェーンで動かし，最後にテストネットへ進みます。

## 入金の実装順序

`deposit(accountId, amount)`は，アカウントと金額の範囲を確認し，`safeTransferFrom`でトークンを受け取り，実残高の増分が指定額と等しいことを確認してからキューを追加します。キューには連番ID，受取アカウント，数量を記録し，返金先（入金者）と受付ブロックもL1のメタデータとして保存します。受け取っていない数量を先にL2へ計上しません。

外部呼び出しの再入を防ぎ，失敗したtransferFromではキューも残らないことをテストします。`SafeERC20`の利用だけで，任意のトークンの経済的挙動へ対応したことにはなりません。

## バッチの受理条件

`submitBatch(proof, publicSignals, data)`の処理を次の順序で実装します。以下は処理仕様であり，省略部分を含む完成済みコントラクトではありません。

```text
require(!frozen)
require(public.domain == configuredDomain)
require(public.batchNumber == nextBatchNumber)
require(public.oldRoot == stateRoot)
require(public.depositStart == depositCursor)
require(depositStart <= depositEnd <= depositQueue.length)
require(depositEnd - depositStart <= 4)
require(data.length == 540)
require(SHA256(data) == join128(public.dataHashHi, public.dataHashLo))
require(SHA256(encodeQueuePrefix(...)) == join128(public.depositHashHi, public.depositHashLo))
require(verifier.verifyProof(proof, publicSignals))
store newRoot, depositEnd, withdrawalRoot
increment nextBatchNumber
emit BatchAccepted(batchNumber, newRoot, data)
```

ハッシュの分割値の上限，公開入力の体の範囲も検査します。入金キューの範囲をL1でも検査し，回路が存在しない入金を作れないようにします。状態更新はすべての確認が成功してから確定します。

## 出金請求

出金木は4葉で，葉の内容を`(domain, batchNumber, slot, recipient, amount)`に固定します。出金以外のスロットは別タグの空葉です。署名付き出金操作の値を回路内でこの葉へ結び付けます。

`claimWithdrawal(batchNumber, slot, recipient, amount, siblings)`は，受理済みバッチの出金ルートへの所属を検査します。`(batchNumber, slot)`の請求済みフラグを**送金前に**立て，葉で固定されたrecipientへだけ支払います。第三者による請求代行を許しても，受取先を変えてはいけません。通常出金と[停止時退出](./06-availability#exit)の請求記録は混同しません。

## 合格条件

`forge test`で，ERC-20受取失敗，未受理の出金，偽造パス，二重出金，公開データ変更，別旧ルート，入金スキップ，別domain，Verifierがfalseを返す場合を拒否します。

最初にモックVerifierでコントラクトの状態機械をテストしても構いません。ただし完成条件は**実際の生成Verifierと実際の証明**を接続したE2Eです。モックで通ったテストを証明検証の成功として数えません。
