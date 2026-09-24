import { defineConfig } from 'vitepress'
const base = process.env.PAGES_BASE_PATH || '/'
const repo = process.env.GITHUB_REPOSITORY
const sidebar = (en: boolean) => {
 const p = en ? '/en/' : '/'
 return [{ text: en ? 'LEARN' : '学ぶ', items: [{text: en ? 'Syllabus' : 'シラバス', link:p+'learn/'}, {text:en?'01 · Foundations':'01 · 基礎をつかむ',link:p+'learn/foundations'}]}, {text:en?'COMMUNITY':'コミュニティ',items:[{text:en?'Whitepaper':'ホワイトペーパー',link:p+'whitepaper'}, {text:en?'Architecture Decision Records':'ADR・意思決定の記録',link:p+'adr/'}, {text:en?'Contribute':'参加・貢献する',link:p+'contribute'}]}]
}
export default defineConfig({
 title: 'ZK Fukuoka', description: '福岡から、ゼロ知識証明を学び、つくる。A community for the next generation of ZK builders.',
 base, cleanUrls: false, lastUpdated: false,
 head: [['link',{rel:'icon',type:'image/svg+xml',href:base+'favicon.svg'}],['meta',{name:'theme-color',content:'#101c30'}]],
 locales: {
 root: {label:'日本語',lang:'ja',themeConfig:{nav:[{text:'シラバス',link:'/learn/'},{text:'ホワイトペーパー',link:'/whitepaper'},{text:'ADR',link:'/adr/'}],sidebar:sidebar(false),outline:{label:'このページの内容'},docFooter:{prev:'前のページ',next:'次のページ'}}},
 en: {label:'English',lang:'en',description:'Learn, build, and explore zero-knowledge proofs together in Fukuoka.',themeConfig:{nav:[{text:'Syllabus',link:'/en/learn/'},{text:'Whitepaper',link:'/en/whitepaper'},{text:'ADR',link:'/en/adr/'}],sidebar:sidebar(true)}}
 },
 themeConfig: {logo:'/favicon.svg',siteTitle:'ZK Fukuoka',search:{provider:'local'},...(repo?{socialLinks:[{icon:'github',link:'https://github.com/'+repo}]}:{}),footer:{message:'Learn together. Build in the open.',copyright:'ZK Fukuoka · Community in formation'}}
})
