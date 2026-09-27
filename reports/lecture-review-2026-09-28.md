# 第1〜15回の表記・論理的整合性レビュー

確認日：2026年9月28日

## 対象と方法

第1〜15回の日本語本文を通読し，定義・前提・式・比較表・まとめ・次回予告の対応を確認した．原論文・教科書と照合し，内容を修正した箇所は英語版にも反映した．これは教材の論理的整合性のレビューであり，プロトコルの安全性の形式検証ではない．

句読点の対象は `docs/learn`，`docs/exercises`，`docs/rollup`，`docs/zkml` の日本語教材43文書と講義図の日本語表示である．読点を「，」，句点を「．」に統一した．数式・コード・URL・英語本文は変換対象外とし，既存リンクを維持するため旧見出しIDも保持した．

## 用語

| 原語・旧表記 | 日本語表記 |
| --- | --- |
| knowledge extraction | 知識の抽出 |
| knowledge soundness | 知識の健全性 |
| witness / 証人 | ウィットネス |
| completeness | 完全性 |
| soundness | 健全性 |
| soundness error | 健全性誤差 |
| soundness amplification | 健全性増幅 |
| extractor | 抽出者 |
| simulator paradigm | シミュレータパラダイム |
| trusted setup / 信頼設定 | トラステッドセットアップ |
| special soundness | 特殊健全性 |
| binding / hiding | 拘束性 / 隠蔽性 |
| list decoding | リスト復号 |

日本語本文の混在表記を修正し，シラバス・トピック別索引・図の説明にも同じ表記を適用した．英語の原語併記と数学記号は維持した．

## 各回の確認結果

| 回 | 確認した関係・修正内容 |
| --- | --- |
| 1 | NPの定義が全ビットの読取りや一回限りの走査を要求するわけではないこと，完全性・健全性・ProofとArgumentの区別を確認．シラバスも整合させた |
| 2 | ゼロ知識性のシミュレータの入力と実行時間，モデル外のサイドチャネルを明確化．グラフ同型性の具体例を追加．Schnorrのチャレンジの分布を明記．非対話性と簡潔性を混同していた比較表を修正 |
| 3 | Schwartz-Zippel補題の非零多項式・全次数・非空集合・独立一様サンプリングを確認・明示．恒等性検査と評価計算コストを区別 |
| 4 | Cook-Levinに対応する回路版と，NP関係の検証回路によるウィットネス対応を区別．加算を線形結合に吸収する場合と独立した等式制約を置く場合に発問を修正 |
| 5 | RS符号の次数上限・最小距離・一意復号半径・レートの整合を確認．リスト復号の表記を統一 |
| 6 | 遠い表を受理する確率と，一度の受理からの断定を区別．問い合わせ経路の長さと認証経路・反復を含む全コストを区別．健全性増幅と抽出の技法の役割を確認 |
| 7 | Schnorrの代数的な特殊健全性とDL困難性の役割を区別．q-SDHの分母非零条件とqの用途を明記．異種の仮定を単純な階層として扱わない表現に修正 |
| 8 | KZG検証式のG1/G2を明示．評価拘束性と知識の抽出を区別．FRI系の証明サイズにMerkle経路等を含める比較表に修正．基本KZGが自動的に隠蔽性を持つわけではないことを確認 |
| 9 | ROM内の定理と具体的ハッシュによる実体化のヒューリスティックを区別．ROMなしの構成についての過度な一般化を修正 |
| 10 | 近似困難性の不可能性主張にP≠NP条件を明示．IPのアクセスと読取りコストを整理．Groth16がIOP＋KZG＋Fiat-Shamirという構成ではないことを次回予告まで揃えた |
| 11 | 既存本文のQAPと直接CRS構成，3群要素，公開入力に依存する検証コスト，汎用双線形群モデルを確認．KZGやq-SDHだけを根拠にする説明へ戻っていないことを確認 |
| 12 | 汎用SRSと回路固有の鍵・セレクタ，評価領域上のゲート制約，ラベルを含むコピー制約，Fiat-Shamirの位置づけを確認 |
| 13 | 透明性がAIR/FRIを一意に強制しないこと，コミットとチャレンジの順序，制約の商と低次数検査，量子安全性の条件を確認 |
| 14 | 第11〜13回の構成・安全性・コストの比較が第2〜10回の定義と整合することを確認 |
| 15 | 再帰・folding・GKR/sumcheckの保証と適用条件を確認．EIP-8025のDraft状態と，その提案段階では実行の再実行を省略しないことを公式本文で再確認 |

## 検証

- `python3 scripts/check-course-style.py`：日本語教材43文書の句読点・主要な表記揺れを検査し成功．この検査は語義の正しさを自動証明するものではない．
- `node scripts/check-lecture-diagrams.mjs`：43個の二言語図定義について，収録範囲，RS距離，有限体の点，楕円曲線，トレース，境界値，抽出計算の検査に成功．第1回の6図は別のVueコンポーネントで管理される．
- GitHub Pages用のbase pathを設定したVitePress本番ビルドに成功．既存のバンドルサイズ警告のみ．
- 生成HTMLの教材内リンク6,541件について，対象ファイルとフラグメントIDの存在を検査し成功．外部サイト全件の到達性を保証する検査ではない．
- `git diff --check` に成功．

## 照合した主な資料

- [Thaler, Proofs, Arguments, and Zero-Knowledge](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf)：証明系の定義，Schnorr，sumcheck，算術化の全体像．
- [Groth, On the Size of Pairing-Based Non-interactive Arguments](https://eprint.iacr.org/2016/260)：Groth16の構成と安全性モデル．
- [Gabizon et al., PLONK](https://eprint.iacr.org/2019/953)：汎用・更新可能SRSと置換検査．
- [Ben-Sasson et al., FRI](https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ICALP.2018.14)：近接性検査と問い合わせ計算量．
- [Kate et al., Constant-Size Commitments to Polynomials and Their Applications](https://www.iacr.org/archive/asiacrypt2010/6477178/6477178.pdf)：多項式拘束性と評価拘束性．
- [Kothapalli et al., Nova](https://eprint.iacr.org/2021/370)：foldingと再帰的な計算検証．
- [EIP-8025](https://eips.ethereum.org/EIPS/eip-8025)：Draft提案の範囲とConsensus Layer節における再実行の扱い．
