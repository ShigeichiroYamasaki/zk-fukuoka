<script setup>
import { computed } from 'vue';
import { diagrams } from './studyDiagrams';
const props = defineProps({ id: String, en: Boolean });
const d = computed(() => diagrams[props.id]);
const tx = value => {
 if (Array.isArray(value) && value.length === 2 && value.every(item => typeof item === 'string')) return value[props.en ? 1 : 0];
 return Array.isArray(value) ? value.map(tx) : value;
};
const px = x => 48 + x / d.value.maxX * 520;
const py = y => 260 - y / d.value.maxY * 220;
</script>
<template>
 <figure class="study-diagram" :id="`figure-${id}`" :aria-labelledby="`caption-${id}`">
  <figcaption :id="`caption-${id}`"><span class="sd-number">{{ en ? 'Figure' : '図' }} {{ id }}</span><strong>{{ tx(d.title) }}</strong></figcaption>
  <p v-if="d.lead" class="sd-lead">{{ tx(d.lead) }}</p>
  <template v-if="d.type === 'scatter'">
   <div class="sd-svg-scroll" tabindex="0" :aria-label="en ? 'Scrollable graph' : '横にスクロールできるグラフ'"><svg viewBox="0 0 620 310" role="img" :aria-label="tx(d.alt)">
    <g class="sd-grid"><template v-for="tick in d.ticksX" :key="'x'+tick"><line :x1="px(tick)" :x2="px(tick)" y1="40" y2="260"/><text :x="px(tick)" y="281" text-anchor="middle">{{ tick }}</text></template><template v-for="tick in d.ticksY" :key="'y'+tick"><line x1="48" x2="568" :y1="py(tick)" :y2="py(tick)"/><text x="35" :y="py(tick)+5" text-anchor="end">{{ tick }}</text></template></g>
    <path class="sd-axes" d="M48 30V260H580"/><text class="sd-axis-label" x="592" y="264">x</text><text class="sd-axis-label" x="44" y="20">y</text>
    <g v-for="(series,j) in d.series" :key="j" :class="['sd-series',`sd-series-${j}`]"><template v-for="([x,y],k) in series.points" :key="k"><circle v-if="j===0" :cx="px(x)" :cy="py(y)" r="5"/><rect v-else :x="px(x)-4" :y="py(y)-4" width="8" height="8"/></template></g>
   </svg></div>
   <div class="sd-legend"><span v-for="(s,j) in d.series" :key="j">{{ j === 0 ? '●' : '■' }} {{ tx(s.label) }}</span></div>
   <details><summary>{{ en ? 'Point coordinates (text version)' : '点の座標（テキスト版）' }}</summary><p v-for="(s,j) in d.series" :key="j">{{ tx(s.label) }}: {{ s.points.map(p=>`(${p.join(', ')})`).join(' · ') }}</p></details>
  </template>
  <template v-else-if="d.type === 'merkle'">
   <div class="sd-svg-scroll" tabindex="0" :aria-label="en ? 'Scrollable tree diagram' : '横にスクロールできる木構造図'"><svg viewBox="0 0 620 270" role="img" :aria-label="tx(d.alt)">
    <g class="sd-tree-edges"><path d="M80 210L165 120L310 40M250 210L165 120M395 210L460 120L310 40M565 210L460 120"/></g>
    <g class="sd-tree-nodes"><rect x="245" y="16" width="130" height="48" rx="10"/><rect x="100" y="96" width="130" height="48" rx="10"/><rect x="395" y="96" width="130" height="48" rx="10"/><rect v-for="x in [20,190,335,505]" :key="x" :x="x" y="186" width="115" height="48" rx="10"/></g>
    <g class="sd-tree-labels" text-anchor="middle"><text x="310" y="46">root</text><text x="165" y="126">H(h₀ ∥ h₁)</text><text x="460" y="126">H(h₂ ∥ h₃)</text><text x="78" y="215">h₀ = H(v₀)</text><text x="248" y="215">h₁ = H(v₁)</text><text x="393" y="215">h₂ = H(v₂)</text><text x="563" y="215">h₃ = H(v₃)</text></g>
   </svg></div>
   <div class="sd-shared">{{ tx(d.bottom) }}</div>
  </template>
  <template v-else-if="d.type === 'flow'">
   <div v-if="d.top || d.lead" class="sd-shared sd-intro">{{ tx(d.top || d.lead) }}</div>
   <div class="sd-flow" :style="{ gridTemplateColumns: `repeat(${d.nodes.length}, minmax(0, 1fr))` }" :aria-label="tx(d.title)">
    <template v-for="(node, index) in d.nodes" :key="index">
     <div class="sd-flow-item">
      <section class="sd-flow-node" role="group">
       <span class="sd-step-number">{{ index + 1 }}</span>
       <div><strong>{{ tx(node.title) }}</strong><p v-if="node.body">{{ tx(node.body) }}</p><div v-if="node.formula" class="sd-formula">{{ node.formula }}</div></div>
      </section>
      <div v-if="index < d.nodes.length - 1" class="sd-arrow" aria-hidden="true">→</div>
     </div>
    </template>
   </div>
   <div v-if="d.bottom" class="sd-shared sd-outro">{{ tx(d.bottom) }}</div>
  </template>
  <template v-else-if="d.type === 'compare'">
   <div v-if="d.top" class="sd-shared sd-intro">{{ tx(d.top) }}</div>
   <div class="sd-panels">
    <section v-for="(node, index) in d.nodes" :key="index" class="sd-panel" role="group">
     <strong>{{ tx(node.title) }}</strong><p v-if="node.body">{{ tx(node.body) }}</p><div v-if="node.formula" class="sd-formula">{{ node.formula }}</div>
    </section>
   </div>
   <div v-if="d.bottom" class="sd-shared sd-outro">{{ tx(d.bottom) }}</div>
  </template>
  <template v-else-if="d.type === 'matrix'">
   <div class="sd-role-table" role="table" :aria-label="tx(d.title)">
    <div class="sd-role-row sd-role-head" role="row"><span v-for="(header, index) in d.headers" :key="index" role="columnheader">{{ tx(header) }}</span></div>
    <div v-for="(row, rowIndex) in d.rows" :key="rowIndex" class="sd-role-row" role="row">
     <span v-for="(cell, cellIndex) in row" :key="cellIndex" :role="cellIndex === 0 ? 'rowheader' : 'cell'">{{ tx(cell) }}</span>
    </div>
   </div>
  </template>
  <p class="sd-note">{{ tx(d.note) }}</p>
 </figure>
</template>
<style scoped>
.study-diagram{--sd-ink:#172d48;--sd-muted:#405570;--sd-line:#91a7bf;--sd-paper:#f3f7fc;--sd-card:#fff;--sd-accent:#07685f;--sd-tint:#e2f3ee;--sd-second:#6a43a5;margin:32px 0;padding:24px;border:1px solid var(--sd-line);border-radius:18px;background:var(--sd-paper);color:var(--sd-ink);scroll-margin-top:110px}
:global(.dark) .study-diagram{--sd-ink:#f1f6fc;--sd-muted:#d0deec;--sd-line:#6f849d;--sd-paper:#19283b;--sd-card:#22364d;--sd-accent:#99ebd8;--sd-tint:#163d39;--sd-second:#d8b8ff}
figcaption,caption{display:flex;flex-wrap:wrap;gap:12px;align-items:baseline;line-height:1.7;margin-bottom:20px;font-size:17px}.sd-number{font:700 16px/1.5 monospace;white-space:nowrap;color:var(--sd-accent)}.sd-lead{margin:0 0 18px!important;font-size:14px;white-space:pre-line;overflow-wrap:anywhere}.sd-note{margin:18px 0 0!important;color:var(--sd-muted);font-size:13px!important;line-height:1.85!important}.sd-step{display:flex;align-items:flex-start;gap:14px;background:var(--sd-card);padding:14px 16px;border:1px solid var(--sd-line);border-radius:10px}.sd-step p,.sd-panel p{margin:6px 0 0!important;font-size:14px;white-space:pre-line;line-height:1.7}.sd-step-number{color:var(--sd-accent);font:700 18px/1.5 monospace}.sd-arrow{font-size:24px;text-align:center;line-height:1.4;color:var(--sd-accent)}.sd-panels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.sd-panel{background:var(--sd-card);border:1px solid var(--sd-line);border-radius:10px;padding:18px 14px}.sd-panel:nth-child(even){background:var(--sd-tint)}.sd-panel strong{font-size:16px}.sd-formula{font-family:ui-monospace,monospace;font-size:13px;margin-top:12px;overflow-wrap:anywhere}.sd-shared{padding:12px 14px;text-align:center;border:1px dashed var(--sd-line);border-radius:10px;font-size:14px;white-space:pre-line}.sd-bottom{margin-top:16px}.sd-connector{text-align:center;font-size:26px;margin:10px}.sd-table-wrap{overflow-x:auto;border-radius:10px}.sd-table{display:table!important;width:100%;margin:0!important;font-size:16px;line-height:1.7;border-collapse:collapse}.sd-table th,.sd-table td{color:var(--sd-ink)!important;background:var(--sd-card)!important;border:1px solid var(--sd-line)!important;padding:10px!important;white-space:pre-line}caption{display:table-caption;text-align:left;caption-side:top;scroll-margin-top:110px}caption .sd-number{margin-right:12px}.sd-table thead th{background:var(--sd-tint)!important}.sd-table tbody th{font-weight:600}.sd-table tr{background:transparent!important}
.sd-svg-scroll{overflow-x:auto}svg{display:block;width:100%;min-width:520px;height:auto}.sd-step>div{min-width:0}.sd-step p,.sd-panel p,.sd-shared{overflow-wrap:anywhere}.sd-grid line{stroke:var(--sd-line);stroke-width:.5;opacity:.65}.sd-grid text,.sd-axis-label{fill:var(--sd-ink);font:13px system-ui,sans-serif}.sd-axes{stroke:var(--sd-ink);fill:none;stroke-width:1.5}.sd-series-0{fill:var(--sd-accent)}.sd-series-1{fill:var(--sd-second)}.sd-legend{display:flex;flex-wrap:wrap;gap:12px;font-size:13px}.sd-legend span:first-child{color:var(--sd-accent)}.sd-legend span:nth-child(2){color:var(--sd-second)}details{margin-top:12px;font-size:13px}summary{cursor:pointer}details p{font-size:12px!important;overflow-wrap:anywhere}.sd-bar-scale{font-size:12px;color:var(--sd-muted);margin-bottom:16px}.sd-bar-row{margin-bottom:16px}.sd-bar-label{display:flex;justify-content:space-between;gap:12px;font-size:13px;margin-bottom:6px}.sd-track{height:16px;background:var(--sd-card);border:1px solid var(--sd-line);border-radius:4px;overflow:hidden}.sd-bar{height:100%;background:var(--sd-accent)}.sd-tree-edges{stroke:var(--sd-line);stroke-width:2;fill:none}.sd-tree-nodes{fill:var(--sd-card);stroke:var(--sd-accent)}.sd-tree-labels{fill:var(--sd-ink);font:14px system-ui,sans-serif}
.sd-flow{display:grid;align-items:stretch;gap:10px}.sd-flow-item{display:flex;gap:6px;align-items:center;min-width:0}.sd-flow-node{display:flex;gap:12px;align-items:flex-start;flex:1;min-width:0;background:var(--sd-card);border:1px solid var(--sd-line);border-radius:10px;padding:16px 12px}.sd-flow-node>div{min-width:0}.sd-flow .sd-arrow{flex:0 0 24px}.sd-intro{margin-bottom:16px}.sd-outro{margin-top:16px}.sd-role-table{overflow-x:auto;border:1px solid var(--sd-line);border-radius:10px}.sd-role-row{display:grid;grid-auto-columns:minmax(100px,1fr);grid-auto-flow:column;min-width:max-content}.sd-role-row>span{padding:10px 12px;border-right:1px solid var(--sd-line);border-top:1px solid var(--sd-line);background:var(--sd-card);white-space:pre-line;overflow-wrap:anywhere}.sd-role-row>span:last-child{border-right:0}.sd-role-head>span{border-top:0;background:var(--sd-tint);font-weight:700}.sd-role-row:not(.sd-role-head):nth-child(odd)>span{background:var(--sd-tint)}
@media(max-width:700px){.sd-flow{grid-template-columns:1fr!important}.sd-flow-item{flex-direction:column}.sd-flow .sd-arrow{transform:rotate(90deg);font-size:20px}.sd-panels{grid-template-columns:1fr}}
@media(max-width:520px){.study-diagram{padding:16px 12px}figcaption,caption{font-size:16px;gap:8px}.sd-step{padding:12px;gap:10px}.sd-table{min-width:440px}.sd-note{font-size:13px!important}}
@media print{.study-diagram{break-inside:avoid}.sd-table-wrap{overflow:visible}.sd-table{min-width:0}}
</style>
