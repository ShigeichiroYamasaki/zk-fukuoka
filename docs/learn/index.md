---
outline: [2, 3]
---

# ZK Fukuoka ゼロ知識証明シラバス

* 2026/09/07
* Shigeichiro Yamasaki

::: info シラバス案
三幕・全15回の学習構成案です。開催日程・講師・会場は未定です。
:::

[各回の授業インデックス](./sessions) · [トピック別インデックス](./topics)

---

## 設計方針

道具(数学的基礎)から積み上げるのではなく、**目的・動機を先に立ててから道具を揃える**三幕構成を採る。

- **幕I(目的と動機)**:なぜこの技術が必要か、何を達成したいのかを定義する
- **幕II(道具立て)**:幕Iで立てた課題を解くための数学・情報理論・暗号理論の言語を揃える
- **幕III(統合)**:実際のプロトコル(Groth16 / PLONK / STARK)が幕Iの課題にどう答えているかを、成り立ちと発展の方向込みで読む

幕Iと幕IIIが対応する設計とすることで、幕IIの技術習得期間中も目的意識が切れないようにする。

---

## 幕I:目的と動機(なぜこの技術が必要か)— 第1〜2回 {#act-1}

### 第1回:証明とは何か — 対話型証明の背景と形式化 {#session-1}

[第1回の講義本文を読む →](./session-01)

- NPの検証者パラダイムの限界:ウィットネスを全部見せる/一回きりの読み取りという暗黙の前提を問い直す
- 計算量理論的動機:Arthur-Merlinゲーム、IP = PSPACE定理を結果として提示
- 暗号学的動機:Goldwasser-Micali-Rackoff(1985)の問題設定、パスワード認証やグラフ同型性を具体例に
- 二つの動機が対話型証明系という同じ枠組みに合流することを強調
- completeness / soundness の形式化、Proof vs Argument の区別

### 第2回:ゼロ知識性とウィットネスの一般化 {#session-2}

[第2回の講義本文を読む →](./session-02)

- simulator paradigmによるゼロ知識性の形式的定義、識別不可能性の階層
- knowledge soundnessとextractorの概念
- 単純なウィットネス(離散対数などの代数的関係)と一般のNP関係(任意の計算)の質的な差
- Schnorr型プロトコルが群の準同型性という構造に直接乗ることで成立している点の確認 → 一般計算には利用できる代数的構造がない → 算術化(arithmetization)の必然性
- 表現力(ウィットネスの一般性)× 効率性(対話性・簡潔性)の2軸マトリクス、簡潔性が必須要件になる理由

|                                  | 対話型・非簡潔            | 非対話・簡潔                               |
| -------------------------------- | ------------------------- | ------------------------------------------ |
| **代数的関係(単純ウィットネス)** | Schnorr, Chaum-Pedersen   | Σ-protocol + Fiat-Shamir(簡潔性はまだない) |
| **一般NP関係(任意の計算)**       | GMR型の一般ZK(理論的構成) | Groth16 / PLONK / STARK                    |

---

## 幕II:道具立て(目的を実現するための言語)— 第3〜10回 {#act-2}

各回で数学的道具とあわせて、暗号学的視点(安全性定義・困難性仮定との対応)と計算量的視点(複雑性クラス・証明能力との関係)を明示する。

### 第3回:有限体・多項式の代数と確率的検査 {#session-3}

[第3回の講義本文を読む →](./session-03)

- 有限体 $\mathbb{F}_p$、拡大体、多項式環 $\mathbb{F}_p[X]$、Lagrange補間
- **計算量的視点**:Schwartz-Zippel補題 — 多項式表現がなぜ確率的に効率よく検証可能な構造を与えるか。多項式恒等式検査というPCP/IOPの核心技法への接続

### 第4回:算術化の技法と計算量理論 {#session-4}
- R1CS(Rank-1 Constraint System)、QAP(Quadratic Arithmetic Program)、AIR(Algebraic Intermediate Representation)
- **計算量的視点**:Cook-Levin定理によるCircuit-SATへの帰着、回路計算量クラス(NC, P)との関係。「一般計算を多項式制約に翻訳する」ことの理論的裏付け

### 第5回:誤り訂正符号と情報理論的視点 {#session-5}
- Reed-Solomon符号、最小距離、誤り訂正能力
- **情報理論的視点**:Shannon限界とHamming限界の対比、list decodingの考え方
- 符号のパラメータが後の健全性(soundness)の定量的評価にどう効いてくるかを予告

### 第6回:Low-Degree Testingと健全性増幅 {#session-6}
- FRI(Fast Reed-Solomon IOP of Proximity)の再帰的折り畳み構造
- **暗号学的視点**:soundness amplificationの一般論、rewindingやforking lemmaといった証明技法。健全性誤差をどう定量的に抑えるか

### 第7回:楕円曲線とペアリング {#session-7}
- 楕円曲線群の定義、双線形ペアリング $e: G_1 \times G_2 \to G_T$、ペアリングフレンドリーな曲線(BN254, BLS12-381)
- **暗号学的視点**:Discrete Log、q-SDHなどの困難性仮定の階層、還元証明(reduction)の考え方。標準仮定と非標準仮定の違いが何を意味するか

### 第8回:多項式コミットメントと暗号学的コミットメントの理論 {#session-8}
- KZG(Kate)コミットメント、FRIベースのコミットメント
- **暗号学的視点**:コミットメントスキームのbinding/hiding性の形式的定義とKZG/FRIの安全性証明との対応

### 第9回:Fiat-Shamir変換とROMの功罪 {#session-9}
- インタラクティブから非インタラクティブへの変換
- **暗号学的視点**:Random Oracle Modelでの安全性証明と、その限界(ROMヒューリスティックへの批判、反例の存在)についても触れる

### 第10回:PCP定理とIOPの枠組み — 計算量理論的総括 {#session-10}
- PCP定理の主張とその意義(証明は追わず結果を活用)
- IOP(Interactive Oracle Proofs)による統一的理解
- **計算量的視点**:近似困難性(hardness of approximation)研究とのつながりにも触れ、PCP定理がなぜ計算量理論において独立に重要な結果なのかを位置づける

---

## 幕III:統合 — 成り立ちと発展の方向 — 第11〜15回 {#act-3}

### 第11回:Groth16 {#session-11}
- ペアリングとQAPを組み合わせて簡潔性をどう達成したか
- なぜ信頼設定(trusted setup)が必要になったか

### 第12回:PLONK {#session-12}
- universal setupへの動機
- permutation argumentの導入経緯、カスタムゲートの意義

### 第13回:STARK {#session-13}
- trusted setup排除という設計目標からFRI/AIRがどう要請されたか
- 透明性(transparency)とのトレードオフ

### 第14回:統合的視点 — 幕I〜IIIの往還 {#session-14}
- 幕Iで定義したcompleteness/soundness/zero-knowledgeを、Groth16/PLONK/STARKそれぞれがどう満たしているかを照合
- 幕IIで導入した暗号学的仮定・計算量理論的結果が、各プロトコルのどこで効いているかを一覧化して振り返る

### 第15回:発展の方向性 {#session-15}
- 再帰的証明(recursive SNARKs)、folding schemes(Nova等)
- GKR/sumcheckベースの新潮流
- 幕Iの2軸(表現力・効率性)に沿って現在の研究がどこを攻めているかを整理

---

## 補助教材

[有限体の導入演習](./foundations) — 第3回に関連する短い補助教材です。第1〜3回の講義原稿を公開しています。第4〜15回の本編教材は今後整備します。
