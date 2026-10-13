---
outline: [2, 3]
---

# 基本操作マニュアル集

更新日：2026年10月14日

幕III（第11〜15回）の演習を進めるための操作案内です．第11回で証明の生成・検証を一巡し，第12回でセットアップの違い，第13回で実行トレース，第14回で方式の比較，第15回で発展的な構成を確認します．

[演習トップ](./) · [実装・ツール一覧](./tools) · [前提知識・補助教材](../learn/foundations)

公式資料の参照確認日：2026年10月12日．以下は公式手順への日本語の読み順・演習案内です．コマンドの詳細は利用する版の公式マニュアルで確認してください．参照先の確認は，その版を使ったローカル実行確認を意味しません．

[応用編：ERC-20送金用ZK rollupを作る](../rollup/) — 6段階の開発教材と実行用モデル．

[応用編：入力を隠したAI推論 ZKML](../zkml/) — [実行用コードと操作マニュアル](../zkml/02-proof)．

[応用編：JPKIワレットによる投げ銭](../tipping/) と [ZK属性証明による個人情報の最小化](../data-minimization/) は，現状は設計・脅威分析の演習です．実動するJPKI連携，資格発行，匿名クレデンシャル，ZK属性証明の配布コードはありません．

## Dockerで実行環境を揃える {#docker}

リポジトリの[`compose.yaml`](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/compose.yaml)は，Ruby 3.4，Node.js 24，および任意のFoundry／Anvil環境を別々のコンテナとして起動します．教材と生成物はローカルの作業ディレクトリに保存され，AnvilのポートはこのPC内からのみ接続できます．Docker DesktopまたはDocker EngineとCompose v2が必要です．

リポジトリのルートで次を実行します．macOS／LinuxではUIDとGIDを合わせ，コンテナが作成したファイルをホスト側でも編集できるようにします．Windowsではこの2行を省略してください．

```sh
export LOCAL_UID="$(id -u)" LOCAL_GID="$(id -g)"
docker compose pull ruby node
docker compose run --rm ruby ruby docs/public/examples/rollup/ledger_model.rb --test
docker compose run --rm node npm --prefix docs/public/examples/zkml install
docker compose run --rm node npm --prefix docs/public/examples/zkml run demo
```

ZKMLの`node_modules`は名前付きDocker volumeに置かれます．Circomの単独コマンドはNode.jsコンテナ内で`npx --yes circom2@0.2.22 --version`のように実行できます．Foundry／Anvilを使う場合は，別のターミナルで`docker compose --profile evm run --rm --service-ports foundry`を起動します．ローカルRPCは`http://127.0.0.1:8545`です．Forgeコマンドは，たとえば`docker compose --profile evm run --rm --entrypoint forge foundry --version`で確認できます．実際のコントラクト課題は各応用編の手順に従ってください．

終了時はAnvilを起動したターミナルで`Ctrl+C`を押します．RubyとNode.jsはメジャー／マイナー版のタグを使い，パッチ更新に追随します．Foundryは`v1.8.5`に固定しています．実験を再現可能にする場合は`docker compose images`の結果と`docker compose config`を記録し，必要なら利用したイメージをダイジェストで固定してください．ここでのAnvilはローカル学習用であり，テストネットや本番環境へ接続する設定は含みません．

## 応用編で使うツールを選ぶ {#applied}

応用編ごとに，配布済みコードと，受講者が実装する課題を分けて確認します．**すべてのツールを導入する必要はありません**．実データ・実資産・実際のJPKIを使わず，架空データとローカル環境から始めます．

| 応用編 | 現在の教材で実行できる範囲 | 主なツール | 未実装・注意点 |
| --- | --- | --- | --- |
| [ERC-20 ZK rollup](../rollup/) | Ruby残高台帳モデル，送金算術のCircom入門回路 | Ruby，Circom／circomlib／snarkjs，Solidity／Foundry（Forge・Anvil），OpenZeppelin Contracts | オフチェーン参照モデルはRubyを基本にする．署名・Merkle木・バッチ証明・L1コントラクトを結んだ完成E2Eは受講者の実装課題．独立復元用TypeScriptのRPCクライアントは未指定 |
| [入力を隠した推論 ZKML](../zkml/) | Ruby配布コードで小さな整数分類器を学習し，Circom／snarkjsで証明・検証・改ざん拒否を実行 | Ruby，Node.js LTS／npm，`circom2` 0.2.22（Circom 2.2.2），`snarkjs` 0.7.5 | オフチェーンの学習例はRubyを基本にする．証明ツールの版は配布`package.json`に固定．EZKL／ONNXは発展候補で，この教材の配布コードでは未実行 |
| [JPKIワレットの投げ銭](../tipping/) | データフロー，公開範囲，脅威・制度上の前提を設計する | 架空データ，表計算またはMarkdown，脅威分析表．将来の試作候補はCircom／snarkjsとFoundry／Anvil | 実装コード・資格形式・署名方式・失効方式は未提供／未決定．本物のJPKI，個人番号，実資産は使わない |
| [個人情報の最小化](../data-minimization/) | 架空利用者データで，従来方式と最小化方式の保存項目・漏えい時の露出を比較 | 表計算ソフトまたはRuby標準ライブラリ（`csv`） | Rubyを補助プログラムの基本言語にする．ZK属性証明の回路・資格署名形式・発行／失効基盤は未提供／未決定．この課題自体は設計演習 |

### Rollup：参照モデルからローカルL1まで {#rollup-tools}

1. [台帳モデル](../rollup/01-ledger#run)の`ledger_model.rb`を保存し，`ruby ledger_model.rb`と`ruby ledger_model.rb --test`を実行します．まず残高保存則と異常系テストを確認します．外部gemは不要です．
2. [送金回路](../rollup/03-circuit#core)の`transfer_core.circom`でCircomコンパイル，ウィットネス生成，R1CS検査を行います．署名やMerkleパスはこの入門回路には含まれません．[Circom公式導入手順](https://docs.circom.io/getting-started/installation/)と[Circomlibの回路](https://github.com/iden3/circomlib)を参照し，Node／npmとCircomの版を記録します．
3. L1側は[Foundry公式導入](https://getfoundry.sh/introduction/installation/)の`forge`と`anvil`を使います．`forge build`でコンパイル，`forge test`で状態遷移を確認し，Anvilのローカルチェーンでだけ接続試験を行います．[Foundryのプロジェクト作成](https://getfoundry.sh/projects/creating-a-new-project/)と[OpenZeppelin ERC-20／SafeERC20](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20)を参照します．テストネットへの送信は基本演習に不要です．
4. 運営者停止後の独立復元では[第6段階](../rollup/06-availability)の`operator/replay.ts`を実装します．教材はTypeScript実行環境とEthereum JSON-RPCクライアントを指定していないため，チームで選んでバージョンを固定し，RPCクライアントを使う範囲を記録してください．

### ZKML：配布コードを再現する {#zkml-tools}

1. [証明を動かすページ](../zkml/02-proof)から`train.rb`，`classifier.circom`，`package.json`，`run.cjs`を同じ新規フォルダへ保存します．
2. RubyとNode.js LTS／npmを用意し，`ruby train.rb`，`npm install`，`npm run demo`の順で実行します．`package.json`の指定版を使い，生成された`package-lock.json`も記録します．
3. 正常な証明の検証と，公開分類結果を変更した場合の拒否を確認します．検証者だけに渡す手順は[単独検証の案内](../zkml/02-proof#検証者に渡すもの)を使います．
4. より大きなニューラルネットワークを試す場合は，ONNXへ出力できるモデル作成環境と[EZKL公式ドキュメント](https://docs.ezkl.xyz/)を別途調べます．これは配布済みCircom演習とは別ルートで，量子化後の出力差・モデル対応演算・使用版を検証してください．

### 投げ銭・個人情報最小化：設計演習と試作の境界 {#privacy-tools}

- 投げ銭では[設計ページ](../tipping/)の段階に従い，架空の本人確認結果と資格だけを用いて，発行者・利用者端末・検証者・決済事業者が保持する情報を表にします．現在，実際のJPKI連携や匿名資格発行を実行するコードはありません．
- 将来ローカル試作を加える場合は，偽の発行者鍵・架空資格・ローカルAnvil上のテストトークンに限定します．資格署名・失効・nullifierをどう構成するか決めてから，Circom／snarkjsで証明回路を実装します．ライブラリを入れるだけでは資格の正当性やプライバシーは実現しません．
- 個人情報最小化では[設計演習](../data-minimization/#演習-漏えい時に見えるデータを比較する)に沿い，架空10件のデータで保存項目を比較します．表計算ソフトを使うか，Ruby標準ライブラリの`csv`でCSVを扱います．実在の氏名・生年月日・本人確認書類は入力しません．
- 資格署名方式や失効確認を含む実装に進む場合は，現行のページに確定済みツールとして追加せず，方式・版・脅威モデルを先に設計記録へ明記します．


## 幕IIIの演習ルート {#route}

| 授業 | 演習で行うこと | このページの操作案内 | 完了の目安 |
| --- | --- | --- | --- |
| [第11回・Groth16](../learn/session-11) | 回路から証明を作り，検証する | [Groth16](#groth16) | 回路・ウィットネス・鍵・証明を区別できる |
| [第12回・PLONK](../learn/session-12) | 同じ計算を別の方式で証明する | [PLONK](#plonk) | 汎用SRSと回路ごとの前処理を区別できる |
| [第13回・STARK](../learn/session-13) | 実行トレースと制約を追う | [STARK](#stark) | 遷移制約・境界制約と検証結果を対応づけられる |
| [第14回・統合](../learn/session-14) | 条件を揃えて記録・比較する | [比較と考察](#comparison) | 実測値と理論的性質を分けて説明できる |
| [第15回・発展](../learn/session-15) | 再帰・フォールディング・sumcheckの役割を調べる | [発展演習](#advanced) | 何を集約し，どの負担を減らすか説明できる |

応用編で自作するオフチェーンの台帳・学習・集計モデルはRubyを基本言語にします．証明回路にはCircom，L1コントラクトにはSolidity，証明ツールにはNode.jsが必要なため，これらは目的に応じて併用します．初めてなら **Circom＋snarkjsで第11・12回を続けて進める**と，回路を再利用して違いを確認できます．第13回のAnatomy of a STARKは外部のPython教材，WinterfellはRustでAIRを書く外部実装，Miden VMはVMの操作を学ぶ外部実装です．すべて導入する必要はありません．

## 共通の準備と回路の作成 {#circuits}

### 作業環境を揃える

演習用フォルダを作り，選んだ実装のリリースまたはコミット，言語・コンパイラの版を記録します．コード例とAPIマニュアルは同じ版を使います．入力は公開してよい小さなサンプルから始めます．

| 使う環境 | 導入・操作マニュアル | 最初に確認すること |
| --- | --- | --- |
| Circom＋snarkjs | [snarkjs公式README](https://github.com/iden3/snarkjs#readme)，[Circom導入](https://docs.circom.io/getting-started/installation/) | Node.js，Circom，snarkjsが起動し，ヘルプを参照できる |
| Goの実装 | [gnark導入](https://docs.gnark.consensys.io/HowTo/get_started) | 例と依存モジュールの版が一致する |
| Rustの実装 | [Rust導入（日本語）](https://doc.rust-jp.rs/book-ja/ch01-01-installation.html)と選んだ実装のREADME | Rust/Cargoの版，必要な機能フラグを記録する |
| Rubyの実装 | [Rubyのインストール](https://www.ruby-lang.org/ja/documentation/installation/)，[20分ではじめるRuby](https://www.ruby-lang.org/ja/documentation/quickstart/)，[リファレンスマニュアル](https://docs.ruby-lang.org/ja/) | プレビュー版ではなく，保守中の安定版Rubyを使う．応用編の配布Rubyコードは標準ライブラリで動く |
| 外部のPython教材 | [Anatomy of a STARKのコード](https://github.com/aszepieniec/stark-anatomy/tree/master/code) | これは外部教材の言語選択であり，本サイトの応用編の基本言語とは区別する |

### Circomで共通の入力を用意する

| 順番 | 操作と公式手順 | 確認する生成物 |
| --- | --- | --- |
| 1 | [最初の回路を書く](https://docs.circom.io/getting-started/writing-circuits/) | `.circom`．何を公開し，何をウィットネスとして扱うか |
| 2 | [回路をコンパイルする](https://docs.circom.io/getting-started/compiling-circuits/) | `.r1cs`，ウィットネス計算用のWasmなど |
| 3 | [ウィットネスを計算する](https://docs.circom.io/getting-started/computing-the-witness/) | 入力JSONと`.wtns`．制約を満たす割当であること |

Circomのサイトに接続できない場合は，[snarkjs公式README](https://github.com/iden3/snarkjs#readme)の回路作成・コンパイル・ウィットネス計算の節から進められます．

## 証明を生成・検証する {#proofs}

以下の第11〜13回の手順から，使用する方式を選びます．**証明・公開入力・検証鍵（または検証用パラメータ）の組**を保存し，正常な検証と，公開入力を変えた場合の検証を分けて記録してください．

### 第11回：Groth16 {#groth16}

主ルートはCircom＋snarkjsです．[実装例の一覧](./#groth16)からZoKrates・gnark・bellmanを選ぶ場合も，同じ確認項目を使えます．

| 順番 | 操作 | 公式マニュアル | 確認すること |
| --- | --- | --- | --- |
| 1 | 共通の回路とウィットネスを用意する | [共通準備](#circuits) | 公開入力とウィットネスの役割 |
| 2 | Powers of Tauを準備し，Groth16の回路固有のセットアップを進める | [snarkjsの手順](https://github.com/iden3/snarkjs#readme)，[Circom証明チュートリアル](https://docs.circom.io/getting-started/proving-circuits/) | `.ptau`と回路に対応する`.zkey`の違い．公式手順の貢献・検証も行う |
| 3 | 検証鍵を出力し，証明を生成する | [検証鍵の出力](https://github.com/iden3/snarkjs#22-export-the-verification-key)，[証明生成](https://github.com/iden3/snarkjs#23-create-the-proof) | 検証鍵，証明JSON，公開入力JSON |
| 4 | 検証し，公開入力のコピーを変更して再検証する | [検証](https://github.com/iden3/snarkjs#24-verify-the-proof)のGroth16手順 | 元の組は受理，変更した主張は拒否されること |

**完了後の確認**：制約を変更したら，どの生成物を作り直す必要があるでしょうか．回路固有のセットアップを第11回と結びつけて説明します．ローカルで作るセットアップは学習用として扱います．

### 第12回：PLONK {#plonk}

第11回と同じ回路・入力を使い，snarkjsの**PLONK用**の手順を選びます．出力先をGroth16と分けて，鍵や証明の取り違えを防ぎます．

| 順番 | 操作 | 公式マニュアル | 確認すること |
| --- | --- | --- | --- |
| 1 | 回路の規模・曲線などに適合するPowers of Tauを用意する | [公式README](https://github.com/iden3/snarkjs#readme) | 第11回のSRSを再利用できる条件 |
| 2 | `plonk setup`で回路に対応する鍵を生成する | [SetupのPLONK手順](https://github.com/iden3/snarkjs#15-setup) | 汎用SRSがあっても回路ごとの前処理は残る |
| 3 | 検証鍵を出力し，証明生成・検証を行う | [検証鍵](https://github.com/iden3/snarkjs#22-export-the-verification-key)，[証明生成](https://github.com/iden3/snarkjs#23-create-the-proof)，[検証](https://github.com/iden3/snarkjs#24-verify-the-proof) | 各節でPLONKのコマンドを使う |
| 4 | 公開入力を変更して再検証し，回路変更後の鍵も作り直す | 同じ公式手順で再実行 | 不正な主張の拒否と，SRS再利用・回路前処理の違い |

Groth16用の第2段階の貢献手順をPLONKへそのまま当てはめないようにします．[gnark・Dusk PLONKの操作案内](./#plonk)は，GoやRustで実装を読む場合の選択肢です．CircomのR1CSを入力する経路と，PLONKishなゲート・コピー制約を直接記述する経路も区別しましょう．

演習ログには，チャレンジの有限体への変換方法，検査ごとの誤受理確率と全体上界，公開値・ウィットネスの範囲制約も記録します．単純な剰余変換の偏りを避けているかは方式の仕様で確認し，失敗テストだけで健全性が証明されたとは扱いません．整数を表す回路では，法による桁あふれを防ぐ範囲制約も確認します．

### 第13回：STARK {#stark}

目的に合う実装を一つ選び，公式の小さい例から始めます．

| 学び方 | 実装と操作マニュアル | 追いかける箇所 |
| --- | --- | --- |
| 外部Python実装を読む | [Anatomy of a STARK](https://aszepieniec.github.io/stark-anatomy/)，[Part 5](https://aszepieniec.github.io/stark-anatomy/rescue-prime)，[コードとテスト](https://github.com/aszepieniec/stark-anatomy/tree/master/code) | Rescue-Primeの計算，トレース，制約，証明生成・検証．外部教材の実装言語はPython．Jekyll起動は解説サイト用で，コード演習とは別 |
| RustでAIRを書く | [Winterfellの利用手順](https://github.com/facebook/winterfell#usage)，[実装例](https://github.com/facebook/winterfell/tree/main/examples)，[API](https://docs.rs/winterfell/latest/winterfell/) | トレースの作成，遷移制約，境界の指定，証明・検証 |
| VMで実行を証明する | [Miden VMのCLIと例](https://github.com/0xMiden/miden-vm/blob/next/miden-vm/README.md) | 命令列，入力，実行結果，実行証明．`next`の手順と利用リリースの差を確認する |

1. 公式の例を実行し，正常な証明の検証結果を保存する．
2. 公開入力・出力と，トレース・制約を対応づける．VMでは，利用者のプログラムとVM内部のAIRを分けて読む．
3. 証明を固定し，公開出力など検証対象のコピーを変更する．検証が拒否することを確認する．
4. 同じ実装・安全性設定のままトレース長を変え，証明サイズと処理時間を記録する．

**完了後の確認**：Merkle木によるデータの固定，FRIによる近接性検査，AIRの制約は，それぞれ何を確認するためのものでしょうか．透明性とゼロ知識性も分けて説明します．WinterfellのREADMEは完全ゼロ知識性を提供していないと明記しているため，実装の保証範囲を第13回の理論と照合してください．

## 第14回：結果を比較して考察する {#comparison}

[第14回](../learn/session-14)の比較表に，自分の実験結果を対応づけます．同じ計算を実装できない場合は，数値を優劣の根拠として並べず，構成と生成物の違いを比較します．

| 記録項目 | 記録する内容 |
| --- | --- |
| 実行条件 | 実装・コミット，OS・CPU・メモリ，言語の版，ビルド設定 |
| 計算と入力 | 回路またはプログラム，公開入力の数，制約数またはトレース長 |
| 安全性の設定 | 曲線・体・ハッシュ，SRSの由来，FRIの設定など |
| 正常系・変更時 | 受理／拒否，変更した公開入力，実行ログ |
| 証明サイズ | バイト数と保存形式．JSONとバイナリの違いも明記 |
| 処理時間 | セットアップ，ウィットネス／トレース生成，証明生成，検証を別々に計測．反復回数と集計方法を記録 |
| 理論との対応 | 完全性・健全性・ゼロ知識性，必要な仮定，セットアップの違い |

一度の成功・失敗テストは，完全性や健全性の数学的証明ではありません．ゼロ知識性も「画面に秘密が表示されなかった」だけでは判断できません．観測した動作と，論文・実装文書が保証する性質を分けてまとめましょう．

## 第15回：発展演習へ進む {#advanced}

以下は基本演習を終えた後の選択課題です．

| テーマ | 操作・読み方 | 成果としてまとめること |
| --- | --- | --- |
| 再帰・フォールディング | [Nova公式のTests and examples](https://github.com/microsoft/Nova#tests-and-examples)から，選んだ版の`minroot`例を実行し，ステップ数を変える | 状態の引き継ぎ，フォールディング，最終的な証明・検証を区別する．圧縮を含む場合はそのコストも分ける |
| Sumcheck・GKR | [第15回の説明](../learn/session-15)と[Thalerの教科書](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html)を読み，二変数の小さな多項式の総和を手計算またはRubyで確認する | 全点で直接計算する方法と，変数を一つずつ減らす検証の流れを対応づける．完成した証明実装とは区別する |
| Ethereumへの応用 | [第15回の研究地図](../learn/session-15)にあるzkEVM・EIP-8025の一次資料を読む | 何の実行を誰が検証するか，必要な性能指標，提案の状態と参照日を整理する |

## 結果を保存し，共有する {#git}

作業フォルダのREADMEに，選んだ例のURL・版，実行コマンド，公開サンプル入力，結果と考察を残します．方式ごとにフォルダを分け，使用した鍵・証明・公開入力が対応するようにファイル名を付けます．大きな生成物やウィットネスはGitの記録対象から外し，再生成手順を残す方法も使えます．

- [Pro Git 日本語版](https://git-scm.com/book/ja/v2)：`status`・`diff`で変更を確認し，`commit`で記録する．
- [ZK Fukuoka 文書の編集・更新ガイド](https://github.com/ShigeichiroYamasaki/zk-fukuoka/blob/main/CONTRIBUTING.md)：教材のローカル編集とプレビュー．

## 数学の操作を復習する {#math}

法7の逆元から復習する場合は，[SageMathCell](https://sagecell.sagemath.org/)に`GF(7)(3)^(-1)`を入力し，**Evaluate**を押します．結果の`5`を[有限体のチュートリアル](../learn/finite-fields-tutorial)の手計算と比べてください．

[SageMath公式チュートリアル](https://doc.sagemath.org/html/en/tutorial/) · [導入ガイド](https://doc.sagemath.org/html/en/installation/) · [日本語の前提知識・補助教材](../learn/foundations)
