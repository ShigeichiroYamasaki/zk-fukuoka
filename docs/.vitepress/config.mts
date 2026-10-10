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
        { text: en ? "Session 4 · Arithmetization" : "第4回 · 算術化の技法と計算量理論", link: p + "learn/session-04" },
        { text: en ? "Session 5 · Error-correcting codes" : "第5回 · 誤り訂正符号と情報理論的視点", link: p + "learn/session-05" },
        { text: en ? "Session 6 · Low-degree testing and soundness amplification" : "第6回 · Low-Degree Testingと健全性増幅", link: p + "learn/session-06" },
        { text: en ? "Session 7 · Elliptic curves and pairings" : "第7回 · 楕円曲線とペアリング", link: p + "learn/session-07" },
        { text: en ? "Session 8 · Polynomial commitments" : "第8回 · 多項式コミットメント", link: p + "learn/session-08" },
        { text: en ? "Session 9 · Fiat–Shamir and ROM" : "第9回 · Fiat-Shamir変換とROMの功罪", link: p + "learn/session-09" },
        { text: en ? "Session 10 · PCP and IOP" : "第10回 · PCP定理とIOPの枠組み", link: p + "learn/session-10" },
        { text: en ? "Session 11 · Groth16" : "第11回 · Groth16", link: p + "learn/session-11" },
        { text: en ? "Session 12 · PLONK" : "第12回 · PLONK", link: p + "learn/session-12" },
        { text: en ? "Session 13 · STARK" : "第13回 · STARK", link: p + "learn/session-13" },
        { text: en ? "Session 14 · An integrated perspective" : "第14回 · 統合的視点", link: p + "learn/session-14" },
        { text: en ? "Session 15 · Future directions" : "第15回 · 発展の方向性", link: p + "learn/session-15" },
        {
          text: en ? "Prerequisites & resources" : "前提知識・補助教材",
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
      text: en ? "APPLIED: ZKML" : "応用編：ZKML",
      collapsed: false,
      items: [
        { text: en ? "Private-input inference" : "入力を隠したAI推論", link: p + "zkml/" },
        { text: en ? "1. Train and arithmetize" : "1. モデルの学習と算術化", link: p + "zkml/01-model" },
        { text: en ? "2. Prove and verify" : "2. 証明生成・検証と配布コード", link: p + "zkml/02-proof" },
      ],
    },
    {
      text: en ? "APPLIED: ZK ROLLUP" : "応用編：ZK rollup",
      collapsed: false,
      items: [
        { text: en ? "Overview" : "応用編の全体像", link: p + "rollup/" },
        { text: en ? "1. Ledger" : "1. 残高台帳と保存則", link: p + "rollup/01-ledger" },
        { text: en ? "2. Merkle state" : "2. Merkle木と状態", link: p + "rollup/02-state" },
        { text: en ? "3. Transfer circuits" : "3. 署名と送金回路", link: p + "rollup/03-circuit" },
        { text: en ? "4. Batch proofs" : "4. バッチ証明", link: p + "rollup/04-batches" },
        { text: en ? "5. ERC-20 and L1" : "5. ERC-20とL1検証", link: p + "rollup/05-bridge" },
        { text: en ? "6. Availability and exits" : "6. データ公開と退出", link: p + "rollup/06-availability" },
      ],
    },
    {
      text: en ? "APPLIED: PRIVATE MUSIC TIPS" : "応用編：プライバシーを守る投げ銭",
      collapsed: false,
      items: [
        { text: en ? "JPKI wallet and stablecoin tips" : "JPKIワレットとステーブルコイン投げ銭", link: p + "tipping/" },
      ],
    },
    {
      text: en ? "APPLIED: DATA MINIMIZATION" : "応用編：個人情報の最小化",
      collapsed: false,
      items: [
        { text: en ? "ZK attributes and ransomware impact" : "ZK属性証明でランサムウェア被害を抑える", link: p + "data-minimization/" },
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
