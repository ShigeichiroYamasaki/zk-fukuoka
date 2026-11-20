---
outline: [2, 3]
---

# Foundry／Anvilの操作マニュアル

更新日：2026年11月20日

FoundryはSolidityのビルド・テスト用ツール群です．Forgeでコントラクトをビルドしてテストし，AnvilでローカルのEVMチェーンを動かします．このページではZK rollup演習のL1側を，テストネットに接続せずに確認します．

## このリポジトリのDocker環境を使う

リポジトリのルートで，次のコマンドを実行します．

```sh
docker compose --profile evm run --rm --service-ports foundry
```

このコマンドはAnvilを起動し，ローカルRPCを `http://127.0.0.1:8545` で待ち受けます．起動したターミナルはそのままにして，別のターミナルで接続を確認します．

```sh
curl -s -X POST -H 'Content-Type: application/json' \\
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \\
  http://127.0.0.1:8545
```

応答の `result` が `0x7a69`（10進数で31337）なら，ローカルAnvilへ接続できています．停止するときは，Anvilを起動したターミナルで `Ctrl+C` を押します．

## Foundryプロジェクトを操作する

ローカルにFoundryをインストール済みの場合は，練習用プロジェクトを作って基本コマンドを実行できます．

```sh
forge init hello-foundry
cd hello-foundry
forge build
forge test
```

`forge init` は雛形を作成し，`forge build` はSolidityをコンパイルし，`forge test` はテストを実行します．テストが成功すると，各テストの結果が表示されます．まず雛形のまま実行し，その後，演習用コントラクトとテストを追加してください．

## ローカルにインストールする場合

公式の導入スクリプトを使う場合は，公式ガイドの手順とセキュリティ上の注意を確認してから実行してください．インストール後，新しいターミナルを開いて次を実行します．

```sh
foundryup
forge --version
anvil --version
```

Anvilを手動で起動する場合は `anvil --host 127.0.0.1` とします．既定の開発用アカウントと秘密鍵はローカル学習専用です．実資産や本番用秘密鍵を扱わず，このRPCを外部ネットワークへ公開しないでください．

## 演習での使い方

ERC-20 ZK rollup演習では，Solidityコントラクトのコンパイルに `forge build`，状態遷移のテストに `forge test` を使います．デプロイやRPC接続を試す場合も，接続先はローカルAnvilに限定します．この環境だけで，Circomの回路，証明生成，L1コントラクトを接続した完成システムが自動的にできるわけではありません．

## 公式資料

- [Foundryのインストール](https://www.getfoundry.sh/introduction/installation)
- [Foundryプロジェクトの作成](https://www.getfoundry.sh/projects/)
- [Forgeの概要](https://www.getfoundry.sh/forge/)
- [Anvilの概要](https://www.getfoundry.sh/anvil/)

[基本操作マニュアル集](../manuals) · [利用可能なツール](../tools) · [ERC-20 ZK rollup応用編](../../rollup/)
