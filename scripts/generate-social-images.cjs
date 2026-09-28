// Run with `node scripts/generate-social-images.cjs`; requires sharp.
// Optional SHARP_MODULE_PATH points to an existing sharp installation.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.env.SHARP_MODULE_PATH || 'sharp');
const out = path.join(__dirname, '../docs/public/social');
fs.mkdirSync(out, { recursive: true });
async function build(en) {
 const title = en ? ['Become a', 'zero-knowledge engineer.'] : ['ゼロ知識証明', '技術者になろう'];
 const size=en?38:52;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
 <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#6a92a4" stroke-opacity=".12"/></pattern></defs>
 <rect width="1200" height="630" fill="#101c30"/><rect x="760" width="440" height="630" fill="url(#grid)"/>
 <circle cx="966" cy="290" r="162" fill="none" stroke="#7ce6d0" stroke-opacity=".28"/>
 <ellipse cx="966" cy="290" rx="202" ry="90" transform="rotate(-32 966 290)" fill="none" stroke="#c6f56c" stroke-opacity=".45"/>
 <g font-family="Hiragino Sans, Hiragino Kaku Gothic ProN, sans-serif">
 <circle cx="69" cy="73" r="6" fill="#c6f56c"/><text x="89" y="80" font-size="19" letter-spacing="3" fill="#c6f56c">FUKUOKA, JAPAN / ZK COMMUNITY</text>
 <text x="62" y="213" font-size="96" font-weight="800" letter-spacing="-3" fill="#ffffff">ZK Fukuoka</text>
 <text x="66" y="309" font-size="${size}" font-weight="700" fill="#c6f56c">${title[0]}</text>
 <text x="66" y="383" font-size="${size}" font-weight="700" fill="#c6f56c">${title[1]}</text>
 <text x="68" y="456" font-size="22" fill="#d4e2ef">${en?'Learn the math. Write the code. Build together.':'数学を学び，コードを書き，仲間とつくる．'}</text>
 <text x="966" y="326" text-anchor="middle" font-size="96" font-weight="800" fill="#7ce6d0">[ ZK ]</text>
 <text x="836" y="396" font-size="15" letter-spacing="2" fill="#d4e2ef">KEEP THE SECRET.</text><text x="836" y="420" font-size="15" letter-spacing="2" fill="#d4e2ef">SHARE THE PROOF.</text>
 <path d="M785 511H1142M807 511V474H840V511M855 511V452H891V511M908 511V472H936V511M974 511L988 435L1002 511M988 435V411M1021 511V461H1057V511M1070 511V478H1100V511M1110 511V455H1142V511" fill="none" stroke="#7ce6d0" stroke-width="2" opacity=".6"/>
 <path d="M64 535H1136" stroke="#496071"/>
 <text x="68" y="576" font-size="18" fill="#e8eff7">${en?'LECTURES · HANDS-ON · ZK ROLLUP · ZKML':'全15回の授業資料  /  演習  /  ZK rollup・ZKML'}</text>
 <text x="68" y="604" font-size="15" fill="#9cb2c7">shigeichiroyamasaki.github.io/zk-fukuoka/${en?'en/':''}</text>
 </g></svg>`;
 const base=path.join(out,`zk-fukuoka-${en?'en':'ja'}`);
 fs.writeFileSync(base+'.svg',svg);
 await sharp(Buffer.from(svg)).png().toFile(base+'.png');
}
Promise.all([build(false),build(true)]).catch(e=>{console.error(e);process.exitCode=1});
