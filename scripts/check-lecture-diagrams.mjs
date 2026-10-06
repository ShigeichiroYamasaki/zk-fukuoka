// Check mathematical examples and bilingual coverage of the educational figures.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { diagrams } from '../docs/.vitepress/theme/studyDiagrams.js';
const mod = (n,p) => ((n%p)+p)%p;
const polynomial = diagrams['03-2'].series[0].points;
assert.deepEqual(polynomial,Array.from({length:7},(_,x)=>[x,mod(x*x+1,7)]));
const curve=diagrams['07-1'].series[0].points;
const all=[];
for(let x=0;x<17;x++)for(let y=0;y<17;y++)if(mod(y*y-x*x*x-2*x-2,17)===0)all.push([x,y]);
assert.deepEqual(curve,all);
assert.equal(curve.length,18);
assert.notEqual(mod(4*2**3+27*2**2,17),0); // nonsingular curve
// Enumerate this small RS code to check its minimum distance, not only a displayed pair.
const words=[];
for(let a=0;a<7;a++)for(let b=0;b<7;b++)words.push(Array.from({length:5},(_,x)=>mod(a*x+b,7)));
let minimum=5;
for(let i=0;i<words.length;i++)for(let j=i+1;j<words.length;j++)minimum=Math.min(minimum,words[i].filter((v,k)=>v!==words[j][k]).length);
assert.equal(minimum,4);
assert.deepEqual(diagrams['05-1'].rows[0].slice(1).map(Number),[1,3,5,0,2]);
const trace=diagrams['04-3'].rows.map(r=>Number(r[1]));
for(let i=1;i<trace.length;i++)assert.equal(trace[i],mod(trace[i-1]**2,17));
for(const [i,k] of [1,2,4,8].entries())assert.equal(diagrams['06-2'].bars[i].value,100*0.5**k);
for(const [i,p] of [7,17,31].entries())assert.equal(diagrams['03-3'].bars[i].value,Math.round(200/p*100)/100);
// A single pair of accepting Schnorr records must extract the same witness modulo q.
const q=11,w=7,r=4,c1=2,c2=5;
const inv=Array.from({length:q},(_,x)=>x).find(x=>mod((c1-c2)*x,q)===1);
assert.equal(mod((mod(r+c1*w,q)-mod(r+c2*w,q))*inv,q),w);
for(const [id,d] of Object.entries(diagrams)){
 for(const field of ['title','note'])assert.ok(d[field].length===2&&d[field].every(s=>typeof s==='string'&&s.length));
 for(const locale of ['','en/']){
  const page=readFileSync(new URL(`../docs/${locale}learn/session-${id.slice(0,2)}.md`,import.meta.url),'utf8');
  const session = Number(id.slice(0,2));
  const marker = (session >= 8 && session <= 15) || ['02-3'].includes(id) || ['scatter','merkle'].includes(d.type)
   ? `<StudyDiagram id="${id}"`
   : id === '02-1' ? '<GraphIsoExample'
   : id === '02-2' ? '<SchnorrOverview'
   : `<span id="figure-${id}">`;
  assert.equal(page.split(marker).length-1,1,`${locale}${id}`);
 }
 if(d.type==='matrix')for(const row of d.rows)assert.equal(row.length,d.headers.length,id);
}
assert.equal(Object.keys(diagrams).length,43);
console.log('43 bilingual diagram definitions: coverage, RS distance, finite-field points, curve, trace, bounds and extraction verified.');

// Session 3: real interpolation and exact Schwartz-Zippel example counts.
const { basis, quadratic, difference, gridZeros } = await import('../docs/.vitepress/theme/polynomialExamples.js');
for (let k=-4;k<=24;k++) {
 const x=k/10;
 assert.ok(Math.abs(basis.reduce((sum,b)=>sum+b(x),0)-quadratic(x))<1e-12);
}
assert.deepEqual([0,1,2].map(x=>basis.map(b=>b(x) || 0)),[[1,0,0],[0,2,0],[0,0,5]]);
assert.equal(Array.from({length:7},(_,x)=>difference(x)).filter(y=>y===0).length,2);
let zeros=0;
for(let x=0;x<7;x++)for(let y=0;y<7;y++)if(gridZeros(x,y))zeros++;
assert.equal(zeros,13);
assert.ok(zeros/49<=2/7);
console.log('Session 3: interpolation identities and 2/7, 13/49 zero counts verified.');

// Check the displayed isomorphism on every pair, including non-edges.
const { mapping, edges, rightEdges } = await import('../docs/.vitepress/theme/graphExample.js');
assert.equal(new Set(mapping).size,6);
assert.equal(edges.length,8);
assert.equal(rightEdges.length,8);
const hasEdge=(es,a,b)=>es.some(([u,v])=>(u===a && v===b)||(u===b && v===a));
for(let a=0;a<6;a++)for(let b=a+1;b<6;b++)assert.equal(hasEdge(edges,a,b),hasEdge(rightEdges,mapping[a],mapping[b]));
assert.equal(edges.filter(e=>e.includes(2)).length,4);
console.log('Session 1 graph: bijection preserves all 15 vertex-pair adjacency relations.');
