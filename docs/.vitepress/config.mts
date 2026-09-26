import { defineConfig } from "vitepress";
const base = process.env.PAGES_BASE_PATH || "/";
const repo = process.env.GITHUB_REPOSITORY;
const sidebar = (en: boolean) => {
  const p = en ? "/en/" : "/";
  return [
    {
      text: en ? "LEARN" : "学ぶ",
      items: [
        { text: en ? "Syllabus" : "シラバス", link: p + "learn/" },
        { text: en ? "Session index" : "各回の授業", link: p + "learn/sessions" },
        { text: en ? "Topic index" : "トピック別", link: p + "learn/topics" },
        { text: en ? "Session 1 · What is a proof?" : "第1回 · 証明とは何か", link: p + "learn/session-01" },
        { text: en ? "Session 2 · Zero-knowledge and witnesses" : "第2回 · ゼロ知識性とウィットネス", link: p + "learn/session-02" },
        { text: en ? "Session 3 · Finite fields and polynomials" : "第3回 · 有限体・多項式と確率的検査", link: p + "learn/session-03" },
        {
          text: en ? "Supplement · Finite fields" : "補助教材 · 有限体",
          link: p + "learn/foundations",
        },
      ],
    },
    {
      text: en ? "PRACTICE" : "演習",
      items: [
        { text: en ? "Exercises" : "演習トップ", link: p + "exercises/" },
        { text: en ? "Available tools" : "利用可能なツール", link: p + "exercises/tools" },
        { text: en ? "Basic operation manuals" : "基本操作マニュアル集", link: p + "exercises/manuals" },
      ],
    },
    {
      text: en ? "COMMUNITY" : "コミュニティ",
      items: [
        {
          text: en ? "Whitepaper" : "ホワイトペーパー",
          link: p + "whitepaper",
        },
        {
          text: en ? "Architecture Decision Records" : "ADR・意思決定の記録",
          link: p + "adr/",
        },
        { text: en ? "Contribute" : "参加・貢献する", link: p + "contribute" },
      ],
    },
  ];
};
export default defineConfig({
  title: "ZK Fukuoka",
  description:
    "福岡から、ゼロ知識証明を学び、つくる。A community for the next generation of ZK builders.",
  base,
  cleanUrls: false,
  markdown: { math: true },
  lastUpdated: false,
  head: [
    [
      "link",
      { rel: "icon", type: "image/svg+xml", href: base + "favicon.svg" },
    ],
    ["meta", { name: "theme-color", content: "#101c30" }],
  ],
  locales: {
    root: {
      label: "日本語",
      lang: "ja",
      themeConfig: {
        nav: [
          { text: "学ぶ", items: [
            { text: "シラバス", link: "/learn/" },
            { text: "各回の授業インデックス", link: "/learn/sessions" },
            { text: "トピック別インデックス", link: "/learn/topics" },
          ] },
          { text: "演習", link: "/exercises/" },
          { text: "ホワイトペーパー", link: "/whitepaper" },
          { text: "ADR", link: "/adr/" },
        ],
        sidebar: sidebar(false),
        outline: { label: "このページの内容" },
        docFooter: { prev: "前のページ", next: "次のページ" },
      },
    },
    en: {
      label: "English",
      lang: "en",
      description:
        "Learn, build, and explore zero-knowledge proofs together in Fukuoka.",
      themeConfig: {
        nav: [
          { text: "Learn", items: [
            { text: "Syllabus", link: "/en/learn/" },
            { text: "Session index", link: "/en/learn/sessions" },
            { text: "Topic index", link: "/en/learn/topics" },
          ] },
          { text: "Exercises", link: "/en/exercises/" },
          { text: "Whitepaper", link: "/en/whitepaper" },
          { text: "ADR", link: "/en/adr/" },
        ],
        sidebar: sidebar(true),
      },
    },
  },
  themeConfig: {
    logo: "/favicon.svg",
    siteTitle: "ZK Fukuoka",
    search: { provider: "local" },
    ...(repo
      ? {
          socialLinks: [{ icon: "github", link: "https://github.com/" + repo }],
        }
      : {}),
    footer: {
      message: "Learn together. Build in the open.",
      copyright: "ZK Fukuoka · Community in formation",
    },
  },
});
