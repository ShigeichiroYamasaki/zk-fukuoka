# ADR-0005 · Project-wide terminology and Japanese translations

- Date: 2026-10-12
- Status: Proposed and reflected on the site; community ratification pending

## Context

The lessons, exercises, supplementary materials, and applied courses are authored in Japanese and English. Using different Japanese translations for the same cryptographic or complexity-theoretic concept makes it harder to follow ideas across pages. However, mechanically collapsing terms with distinct roles in logic into one translation can also make the meaning ambiguous.

## Decision

Use the following preferred Japanese terms throughout the project. Where helpful, give the English term at first use. Add a short explanation whenever a translation alone does not preserve a distinction needed by a definition or formula.

| English | Preferred Japanese | Usage |
| --- | --- | --- |
| proposition | 命題 | An object in logic or mathematics whose truth can be evaluated. |
| assertion | 言明 | An act or expression of stating whether a proposition is true or false; do not conflate it with the proposition itself. |
| claim | 主張 | A claim made in explanatory prose. Use proposition／命題 for a formal logical object. |
| witness | ウィットネス | A value $w$ supplied to establish that a proposition specified by a relation such as $R(x,w)$ is true. Do not use 証人. |
| extractor | 抽出器 | An algorithm that extracts a witness from a prover's execution. Do not use 抽出者. |
| knowledge extraction | 知識の抽出 | The property or process of extracting a witness with an extractor. |
| knowledge soundness | 知識の健全性 | The property relating an accepted proof to knowledge of a witness. |
| completeness | 完全性 | The property that an honest prover's proof is accepted when the required condition holds. |
| soundness | 健全性 | The property that limits acceptance of false statements or invalid proofs. |
| soundness error | 健全性誤差 | An upper bound on the probability that an invalid proof is accepted. |
| soundness amplification | 健全性増幅 | Reducing soundness error, for example through protocol repetition. |
| simulator paradigm | シミュレータパラダイム | The zero-knowledge approach that compares the distinguishability of real prover interactions with simulations generated without the secret. |
| simulator | シミュレータ | In a zero-knowledge definition, an algorithm that generates a transcript without knowing the secret. |
| trusted setup | トラステッドセットアップ | An initial setup that requires the secret trapdoor to be generated and managed appropriately. Do not use 信頼設定. |
| folding | フォールディング | An operation that progressively combines polynomials or proof instances. Do not use 折り畳み or 畳み込み for this meaning. |
| polynomial divisibility | 多項式の整除性 | The relation in which one polynomial is divisible by another. Do not use 割り切れ性. |
| probability distribution | 確率分布 | A specification of the probabilities with which a random variable takes values. Do not shorten it to 分布 when the probabilistic meaning is intended. |
| prover | 証明者 | The party that generates a proof. |
| verifier | 検証者 | The party that checks a proof. |
| commitment | コミットメント | A cryptographic construction that binds a value against later change and, depending on the scheme, hides its contents. |

## Process

When adding a term or changing a preferred translation, update this ADR first and align Japanese and English usage. Then search lessons, figures, tables, supplementary materials, exercises, and applied courses, updating prose and diagram labels in the same change. Do not apply blind global replacements when the original meaning or protocol-specific definition depends on context.

## Consequences and review

Preferred terms reduce variation across pages and help beginners track concepts consistently. Revise this ADR with the rationale and affected scope if disciplinary usage changes or a preferred translation is found to cause confusion.

[Back to ADR index](./)
