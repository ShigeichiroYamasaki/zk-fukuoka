---
outline: [2, 3]
---

<script setup>
import { withBase } from 'vitepress'
</script>

# 2. 入力を隠した推論の証明を動かす

[応用編の全体像](./) · [モデルと算術化](./01-model)

## 配布ファイル

Python 3.8以上とNode.jsのLTS環境，npmを使います．次の4ファイルを，同じ新しい演習用ディレクトリへ保存してください．

| ファイル | 役割 |
| --- | --- |
| <a :href="withBase('/examples/zkml/train.py')" download>train.py</a> | 整数パーセプトロンの学習と全256組の確認 |
| <a :href="withBase('/examples/zkml/classifier.circom')" download>classifier.circom</a> | 公開モデル・非公開入力・公開分類結果の回路 |
| <a :href="withBase('/examples/zkml/package.json')" download>package.json</a> | circom2 0.2.22，snarkjs 0.7.5を指定 |
| <a :href="withBase('/examples/zkml/run.cjs')" download>run.cjs</a> | コンパイル・全入力確認・セットアップ・証明・拒否テスト |

`circom2` はCircomコンパイラのWASM配布で，この版はコンパイラ2.2.2を使います．推移依存はnpmが解決するため，実行時に生成される `package-lock.json` も成果物として保存してください．

```sh
python3 train.py
npm install
npm run demo
```

学習結果は `model.json` へ出力されます．回路の係数はこの学習結果を定数として記述済みです．任意のモデルを自動変換するコンパイラではありません．

## 何が実行されるか

1. 回路からR1CSとウィットネス計算用WASMを生成する．
2. 全256入力で回路の出力を正解と比較し，範囲外の4入力が失敗することを確認する．
3. ローカルの学習用Powers of TauとGroth16の回路固有の鍵を生成する．
4. (12,7)→1 と (3,4)→0 の2件について証明し，検証する．
5. 同じ証明の公開分類結果だけを反転すると，検証が失敗することを確認する．

各実行で新しい `build-*` ディレクトリができます．ローカルのセットアップは操作を学ぶためのものです．本番用の第三者参加セレモニーや監査を実施したものではありません．

期待する終了表示は次のとおりです．

```text
PASS: 256 circuit outputs and 4 out-of-range rejections
PASS: 2 Groth16 proofs; 2 changed-label rejections; public signals contain only label
Artifacts: .../build-...
```

## 検証者に渡すもの

検証者があらかじめ承認した `verification_key.json` を持っているとします．証明者から受け取るのは `positive.proof.json` と `positive.public.json` です．後者の内容は `["1"]` だけです．

```sh
# build-XXXXXX を実際に生成されたディレクトリ名に置き換える
npx --no-install snarkjs groth16 verify \
  build-XXXXXX/verification_key.json \
  build-XXXXXX/positive.public.json \
  build-XXXXXX/positive.proof.json
```

`run.cjs` のサンプル入力は説明のため公開されています．実際に自分の秘密データを使う場合はローカルで置き換え，入力・ウィットネス・ログを共有しないでください．回路とモデルは共有できますが，生成ディレクトリ全体を配布する必要はありません．

## 検証記録

2026年9月27日，配布コードをローカルで実行して確認しました．

| 項目 | 確認内容 |
| --- | --- |
| 学習 | 重み(19,19)，バイアス−296へ収束 |
| 算術化 | 全256入力の回路出力が参照結果と一致 |
| 入力範囲 | (−1,0)，(16,0)，(0,16)，(0,−1)を拒否 |
| Groth16 | 0と1の両方の分類結果で証明・検証に成功 |
| 改ざん | 公開分類結果を反転した2件を拒否 |

これは回路の機能確認であり，ゼロ知識性を実験で証明したという意味ではありません．ゼロ知識性はGroth16の構成・仮定・適切なセットアップに依存します．

## 実システムへの拡張 {#next}

| 課題 | 追加する設計・確認 |
| --- | --- |
| 特定の入力との結び付け | 公開コミットメント $C=\mathrm{Com}(x;r)$ と推論の両方を同じ回路で検査する．小さい入力空間の単純なハッシュは総当たり可能なので，秘密の十分な乱数を使う |
| 入力の真正性 | 測定者などの署名，信頼する発行者，時刻・用途を検査する．コミットメントだけではデータが真実だとは分からない |
| 再利用の制御 | リクエストIDや用途を証明する関係に結び付け，アプリ側で有効期限と再使用を管理する |
| 実データ・ニューラルネットワーク | 学習用と評価用を分け，量子化後の予測精度と回路内演算の一致を確認する．EZKLとONNXへの移行を検討する |
| 運用 | 承認モデルと検証鍵の対応を固定し，更新手順・証明時間・メモリ使用量を測る |

発展課題として，まず入力コミットメントを加え，「別の入力で生成した証明を，同じ記録に対して使えない」ことをテストしてみましょう．次にモデルの大きさを変え，証明者コストを測ります．これらは今回の配布コードには未実装です．

## 公式マニュアル

- [Circomコンパイラと回路](https://docs.circom.io/)
- [WASMコンパイラ circom2](https://github.com/antimatter15/circom)
- [snarkjs：証明生成・検証・セレモニー](https://github.com/iden3/snarkjs)
- [EZKL：ONNXモデルによるZKML](https://docs.ezkl.xyz/) — 発展用の候補．ここではEZKLによる実行確認は行っていません．
