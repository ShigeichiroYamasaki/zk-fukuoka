# ZK Fukuoka

福岡を拠点にゼロ知識証明技術者を育てるコミュニティの、日英 VitePress サイトです。設立準備中の構想・教材草案を含みます。

- 公開先: https://shigeichiroyamasaki.github.io/zk-fukuoka/
- English: https://shigeichiroyamasaki.github.io/zk-fukuoka/en/

## Local development

Node.js 24 以上を使用します。

```sh
npm ci
npm run docs:dev
```

## Production preview

```sh
PAGES_BASE_PATH=/zk-fukuoka/ GITHUB_REPOSITORY=ShigeichiroYamasaki/zk-fukuoka npm run docs:build
npm run docs:preview
```

Open http://localhost:4173/zk-fukuoka/ .

## Content

- `docs/index.md`: Japanese home
- `docs/en/`: English counterparts
- `docs/learn/index.md`: Syllabus, the learning entry point
- `docs/whitepaper.md`: Community proposal
- `docs/adr/`: Decisions and template
- `docs/.vitepress/theme/`: Home design and language tabs

Keep both language versions aligned. The syllabus follows Shigeichiro Yamasaki’s 2026/09/07 proposal: three acts and 15 sessions. The finite-field introduction is supplementary material for Session 3; the Session 1 lecture manuscript and its English translation are published, while materials for Sessions 2–15 are planned. Math notation is rendered at build time with markdown-it-mathjax3.

## GitHub Pages

Set repository Settings → Pages → Source to **GitHub Actions**. Push to `main` to build and deploy. Pull requests run the build without publishing. The workflow sets the `/zk-fukuoka/` base path. Update it if the repository or domain changes.

## Design and maintenance

Responsive custom Vue home with default VitePress documentation navigation and local search. Google Fonts is optional; system fonts are used if unavailable. The skyline and proof illustration are original SVG/CSS; “proof verified” is a conceptual illustration, not an executed cryptographic proof.

Implementation references: [VitePress deployment](https://vitepress.dev/guide/deploy), [internationalization](https://vitepress.dev/guide/i18n).

Licensing for community content and contributions remains to be agreed. No open-source license grant is implied by publication alone.
