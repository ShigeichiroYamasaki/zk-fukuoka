# 文書の編集・更新ガイド

文書の原本はこのリポジトリの `docs/` 以下にある Markdown ファイルです。VS Code などのテキストエディターで直接編集できます。GitHub Pages は原本から生成する公開サイトです。

## 1. ローカルで開く

この作業で作成したローカルリポジトリは次の場所にあります。

```text
/Users/shigeichiroyamasaki/Documents/Codex/2026-09-24/z/outputs/zk-fukuoka
```

VS Code の「ファイル → フォルダーを開く」でこのフォルダーを選択します。

別のPCや作業場所では、保存したい親フォルダーで次を実行します。

```sh
git clone https://github.com/ShigeichiroYamasaki/zk-fukuoka.git
cd zk-fukuoka
```

すでにローカルリポジトリがある場合は、再度 clone する必要はありません。

## 2. 編集するファイルを選ぶ

| 対象 | 日本語の原本 | 英語の原本 |
| --- | --- | --- |
| 第1回の講義本文 | `docs/learn/session-01.md` | `docs/en/learn/session-01.md` |
| 第2回の講義本文 | `docs/learn/session-02.md` | `docs/en/learn/session-02.md` |
| 第3回の講義本文 | `docs/learn/session-03.md` | `docs/en/learn/session-03.md` |
| 第4回の講義本文 | `docs/learn/session-04.md` | `docs/en/learn/session-04.md` |
| 第5回の講義本文 | `docs/learn/session-05.md` | `docs/en/learn/session-05.md` |
| シラバス | `docs/learn/index.md` | `docs/en/learn/index.md` |
| 各回の授業インデックス | `docs/learn/sessions.md` | `docs/en/learn/sessions.md` |
| トピック別インデックス | `docs/learn/topics.md` | `docs/en/learn/topics.md` |
| 演習トップ | `docs/exercises/index.md` | `docs/en/exercises/index.md` |
| ツール一覧 | `docs/exercises/tools.md` | `docs/en/exercises/tools.md` |
| 基本操作マニュアル集 | `docs/exercises/manuals.md` | `docs/en/exercises/manuals.md` |
| ホワイトペーパー | `docs/whitepaper.md` | `docs/en/whitepaper.md` |
| ADR 一覧 | `docs/adr/index.md` | `docs/en/adr/index.md` |
| ADR 本文・テンプレート | `docs/adr/*.md` | `docs/en/adr/*.md` |
| 参加・貢献の案内 | `docs/contribute.md` | `docs/en/contribute.md` |

日本語と英語の翻訳は自動同期されません。内容を変更したら、対応する英語版も更新してください。

トップページの授業名・資料リンク・公開状態は `docs/.vitepress/theme/lessons.ts`、共通の見た目と案内は `Home.vue` と `style.css`、ナビゲーションは `docs/.vitepress/config.mts` にあります。

## 3. 編集前に最新の状態を確認する

ターミナルでリポジトリに移動し、状態を確認します。

```sh
git status
```

未コミットの変更がないことを確認してから最新の `main` を取得します。変更がある場合は、まず作業内容を確認し、コミットなどで保存してください。

```sh
git switch main
git pull --ff-only
```

複数人で編集する場合は、ここから作業用ブランチを作るとレビューしやすくなります。

```sh
git switch -c docs/update-lesson
```

## 4. ローカルプレビュー

Node.js 24 以上と npm を使用します。バージョンを確認してください。リポジトリの `.nvmrc` は Node.js 24 を指定しています。nvm を利用している場合は `nvm install` と `nvm use` で切り替えられます。

```sh
node --version
npm --version
npm ci
npm run docs:dev
```

表示されたローカル URL をブラウザーで開きます。Markdown を保存するとプレビューも更新されます。終了はターミナルで `Ctrl+C` です。

ローカルで保存しただけでは GitHub や公開サイトは変わりません。

## 5. 講義・ADR を追加する

### 講義

たとえば第6回を追加する場合:

1. `docs/learn/session-06.md` と `docs/en/learn/session-06.md` を作成する。
2. シラバスの第6回から講義本文へリンクを追加する。
3. `sessions.md` と `topics.md` の該当リンクを講義本文へ変更する。
4. `docs/.vitepress/theme/lessons.ts` の第6回の `material` を `"learn/session-06.html"` に変更する。トップページに「公開済み」と表示される。
5. 必要に応じて `config.mts` のサイドバーと、前後の講義の `prev`・`next` を更新する。
6. 「準備中」などの案内を、実際の公開状況に合わせて日英とも更新する。

文書間のリンクは既存の書き方に合わせます。Markdown の例は `[第6回](./session-06)`、数式はインラインに `$...$`、独立した数式に `$$...$$` を使用します。

### ADR

`docs/adr/template.md` と英語版を複製して次の番号を付け、日付・状態・背景・決定内容・代替案・影響を記入します。日英の ADR 一覧にリンクを追加してください。置き換えられた ADR は削除せず、新しい ADR と相互に参照できるようにします。

## 6. 確認して GitHub に反映する

```sh
npm run docs:build
git diff --check
git diff
```

ビルドと差分を確認後、変更したファイルを指定してコミットします。以下は第1回の日英本文を修正した例です。

```sh
git add docs/learn/session-01.md docs/en/learn/session-01.md
git commit -m "Update session 1 lecture notes"
```

`main` で直接作業した場合:

```sh
git push origin main
```

作業用ブランチの場合:

```sh
git push -u origin docs/update-lesson
```

GitHub で Pull Request を作成し、確認後に `main` へマージします。書き込みには GitHub の認証とリポジトリへの権限が必要です。

`main` への反映後、GitHub Actions が自動でサイトをビルド・公開します。[Actions](https://github.com/ShigeichiroYamasaki/zk-fukuoka/actions) の成功と、[公開サイト](https://shigeichiroyamasaki.github.io/zk-fukuoka/)の該当ページを確認してください。Pull Request の段階ではビルド確認のみで、公開は行いません。

## 7. 公開先と同じパスでプレビューする

macOS / Linux のターミナルで:

```sh
PAGES_BASE_PATH=/zk-fukuoka/ GITHUB_REPOSITORY=ShigeichiroYamasaki/zk-fukuoka npm run docs:build
PAGES_BASE_PATH=/zk-fukuoka/ npm run docs:preview
```

通常は `http://localhost:4173/zk-fukuoka/` で確認できます。ポートが使用中の場合はターミナルに表示された URL を使用してください。

`node_modules/` と `docs/.vitepress/dist/`、`docs/.vitepress/cache/` は生成物で、Git 管理から除外しています。編集・コミットするのは原本です。

## 8. 日本語の訳語

日本語の本文・見出し・トピック名・リンク表示・ナビゲーションには、次の訳語を使用します。英語版と参考文献の原題は原語で記載します。

| 原語・旧表記 | 統一する訳語 |
| --- | --- |
| knowledge extraction | 知識の抽出 |
| knowledge soundness | 知識の健全性 |
| witness / 証人 | ウィットネス |
| completeness | 完全性 |
| soundness error | 健全性誤差 |
| soundness amplification | 健全性増幅 |
| soundness | 健全性 |
| extractor / 抽出器 | 抽出者 |
| simulator paradigm | シミュレータパラダイム |
| trusted setup / 信頼設定 | トラステッドセットアップ |

見出しを変更する場合は、文書内・文書間のアンカーリンクも確認してください。

## 9. 演習リンク集を更新する

演習教材は `docs/exercises/index.md`、ツールは `tools.md`、基本操作マニュアルは `manuals.md` の表に追記します。対応する英語版も更新してください。各項目には名称、リンク、用途を記載し、ツールには利用方法、教材には関連する授業を添えます。外部リンクは公式サイトや公式マニュアルを優先し、リンク先を確認してから公開してください。独自教材と外部教材、公開済みと準備中を区別します。
