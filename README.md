# ZK Fukuoka

福岡を拠点にゼロ知識証明技術者を育てるコミュニティの、日英 VitePress サイトです。講義・シラバス・ホワイトペーパー・ADR の原本を Markdown で Git 管理し、ローカルで編集できます。

- [公開サイト](https://shigeichiroyamasaki.github.io/zk-fukuoka/)
- [English](https://shigeichiroyamasaki.github.io/zk-fukuoka/en/)
- **[文書の編集・更新ガイド](./CONTRIBUTING.md)** — ローカルで開く方法、教材の追加、公開手順

## 文書の原本

| 文書 | 編集するファイル |
| --- | --- |
| 第1回の講義本文 | [docs/learn/session-01.md](./docs/learn/session-01.md) |
| 第2回の講義本文 | [docs/learn/session-02.md](./docs/learn/session-02.md) |
| 第3回の講義本文 | [docs/learn/session-03.md](./docs/learn/session-03.md) |
| シラバス | [docs/learn/index.md](./docs/learn/index.md) |
| 授業別インデックス | [docs/learn/sessions.md](./docs/learn/sessions.md) |
| トピック別インデックス | [docs/learn/topics.md](./docs/learn/topics.md) |
| 演習・ツール・マニュアル | [docs/exercises/](./docs/exercises/) |
| ホワイトペーパー | [docs/whitepaper.md](./docs/whitepaper.md) |
| ADR | [docs/adr/](./docs/adr/) |
| 英語版 | [docs/en/](./docs/en/) |

トップページの授業リンク・公開状態は [lessons.ts](./docs/.vitepress/theme/lessons.ts)、デザインは `docs/.vitepress/theme/` で管理します。

## ローカルで編集する

Node.js 24 以上を使用します。既存のローカルリポジトリをエディターで開くか、任意の場所に clone してください。

```sh
git clone https://github.com/ShigeichiroYamasaki/zk-fukuoka.git
cd zk-fukuoka
npm ci
npm run docs:dev
```

表示されたローカル URL を開き、Markdown を保存すると変更を確認できます。既存の作業フォルダーでは clone は不要です。

## GitHub Pages に公開する

```sh
npm run docs:build
git diff --check
```

確認後に変更をコミットして `main` に push すると、GitHub Actions が自動公開します。作業用ブランチでは Pull Request を経由できます。詳細と本番パスのプレビュー方法は [編集ガイド](./CONTRIBUTING.md)を参照してください。

## 現在の教材

2026/09/07 付の Shigeichiro Yamasaki によるシラバス案をもとにした、三幕・全15回の構成です。第1〜3回の講義本文と英語訳、有限体の補助教材を公開しています。第4〜15回の本編教材は準備中です。日本語と英語は対応するファイルをそれぞれ編集します。

数式は `markdown-it-mathjax3` でビルド時に描画します。サイトの構想・運営方針には設立準備段階の草案が含まれます。

## デザインと保守

トップページは Vue、文書ページは VitePress のナビゲーション・ローカル検索を使用します。Google Fonts を取得できない場合はシステムフォントに切り替わります。街並みと証明のイラストは SVG/CSS で作成した概念図です。

設定の参考: [VitePress deployment](https://vitepress.dev/guide/deploy)、[internationalization](https://vitepress.dev/guide/i18n)。

コンテンツと貢献に関するライセンスは今後決定します。公開のみをもってオープンソースライセンスの付与を意味するものではありません。
