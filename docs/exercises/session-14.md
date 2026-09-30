# 第14回の演習：プロトコルを横断比較する

[第14回：統合的視点 — 幕I〜IIIの往還](../learn/session-14) · [演習トップ](./)

completeness・soundness・zero-knowledgeと実務上の設計軸を，方式ごとに比較する．

### やってみる

Groth16，原論文のKZG型PLONK，代表的なFRI型STARKについて，「セットアップ」「証明サイズ」「主な安全性の根拠」「透明性」を表にする．各方式が完全性・健全性・ゼロ知識性をどう実現するか，授業資料の記述を使って一行ずつ補う．

### 確認

Groth16は回路依存のトラステッドセットアップとペアリング，PLONKはuniversal/updatable SRS・KZG・Fiat–Shamir，STARKはtransparent setup・ハッシュ・FRIという違いがある．特性はプロトコル名だけで一括りにせず，構成・仮定・実装を明記する．

