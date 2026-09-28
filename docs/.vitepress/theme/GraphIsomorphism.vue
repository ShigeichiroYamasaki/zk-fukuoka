<script setup>
import { ref, computed } from 'vue';
import { labels, mapping, edges, positions, rightPositions } from './graphExample.js';
const props = defineProps({ en: Boolean });
const selected = ref(2);
const tx = (ja, en) => props.en ? en : ja;
const neighbors = i => edges.flatMap(([a,b]) => a===i ? [b] : b===i ? [a] : []);
const adjacent = computed(() => neighbors(selected.value));
</script>
<template>
 <p>{{ tx('どちらも6頂点・8辺．名前と配置は違うが，つながりは同じである．頂点を選ぶと，対応する頂点とそこにつながる辺を両方の図で強調する．', 'Both graphs have six vertices and eight edges. Labels and layouts differ, but adjacency is preserved. Select a vertex to highlight its image and incident edges in both drawings.') }}</p>
 <div class="choices" :aria-label="tx('対応を調べる頂点', 'Vertex to inspect')"><button v-for="(label,i) in labels" :key="label" type="button" :aria-pressed="selected===i" @click="selected=i">{{ label }} ↔ {{ mapping[i] }}</button></div>
 <div class="graph-pair">
  <div v-for="side in [0,1]" :key="side" class="panel">
   <b>{{ side===0 ? 'G₁' : 'G₂' }}</b>
   <svg viewBox="0 0 320 300" role="img" :aria-label="side===0 ? tx('六角形の輪に辺ACとCEを加えたグラフ．頂点Cを含む4本の辺などを選択表示できる．', 'A six-cycle with chords AC and CE; selected incident edges are highlighted.') : tx('同じグラフの頂点を並べ替えた図．辺の交差は頂点ではない．', 'A rearranged drawing of the same graph. Crossings are not vertices.')">
    <line v-for="([a,b],i) in edges" :key="i" :x1="(side ? rightPositions : positions)[a][0]" :y1="(side ? rightPositions : positions)[a][1]" :x2="(side ? rightPositions : positions)[b][0]" :y2="(side ? rightPositions : positions)[b][1]" :class="['edge',{active:a===selected || b===selected}]"/>
    <g v-for="(label,i) in labels" :key="label"><circle :cx="(side ? rightPositions : positions)[i][0]" :cy="(side ? rightPositions : positions)[i][1]" r="19" :class="['vertex',{selected:i===selected}]"/><text :x="(side ? rightPositions : positions)[i][0]" :y="(side ? rightPositions : positions)[i][1]+6" text-anchor="middle">{{ side ? mapping[i] : label }}</text></g>
   </svg>
  </div>
 </div>
 <p class="selection" aria-live="polite">{{ tx('選択した対応', 'Selected correspondence') }}：{{ labels[selected] }} ↔ {{ mapping[selected] }}<br>
 {{ labels[selected] }} → { {{ adjacent.map(i=>labels[i]).join(', ') }} }<br>
 {{ mapping[selected] }} → { {{ adjacent.map(i=>mapping[i]).join(', ') }} }</p>
 <p>{{ tx('例えば C ↔ 6 を選ぶと，Cの隣接頂点 A・B・D・E が，6の隣接頂点 4・1・2・5 に一対一で対応する．つながっていない C と F も，つながっていない 6 と 3 に対応する．', 'For C ↔ 6, neighbors A, B, D and E correspond to 4, 1, 2 and 5. The non-adjacent pair C and F also maps to the non-adjacent pair 6 and 3.') }}</p>
 <div class="mapping">π : A → 4 · B → 1 · C → 6 · D → 2 · E → 5 · F → 3</div>
 <details><summary>{{ tx('8本すべての辺の対応を確認する', 'Check all eight edge correspondences') }}</summary><div class="edge-list"><span v-for="([a,b],i) in edges" :key="i">{{ labels[a] }}–{{ labels[b] }} ↔ {{ mapping[a] }}–{{ mapping[b] }}</span></div></details>
 <p class="note">{{ tx('同型とは，すべての頂点を一対一に対応づけ，任意の2頂点について辺が「ある／ない」を保つこと．頂点数・辺数が同じだけでは十分ではない．辺の長さ・角度・交差は関係なく，交差点に丸がなければ頂点ではない．ここでは説明のため写像πを表示した．次の問いは，この写像を渡さず同型性を納得させられるか，である．', 'An isomorphism is a bijection preserving both adjacency and non-adjacency for every vertex pair. Equal vertex and edge counts alone are not sufficient. Edge lengths, angles and crossings do not matter: a crossing without a circle is not a vertex. We reveal π for illustration; the next question is whether isomorphism can be established without handing over that mapping.') }}</p>
</template>
<style scoped>
p{font-size:14px;line-height:1.85}.choices{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}.choices button{padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink);font-weight:600}.choices button[aria-pressed=true]{border:2px solid var(--accent);background:var(--tint)}.choices button:focus-visible{outline:3px solid var(--accent);outline-offset:3px}.graph-pair{display:grid;grid-template-columns:1fr 1fr;gap:12px}.panel{text-align:center;border:1px solid var(--line);border-radius:12px;padding:10px 0;background:var(--card)}svg{width:100%;display:block}.edge{stroke:var(--line);stroke-width:2;stroke-dasharray:4 4}.edge.active{stroke:var(--accent);stroke-width:4;stroke-dasharray:none}.vertex{fill:var(--card);stroke:var(--line);stroke-width:2}.vertex.selected{fill:var(--tint);stroke:var(--accent);stroke-width:4}text{fill:var(--ink);font:bold 18px system-ui}.selection,.mapping{border:1px dashed var(--line);border-radius:8px;padding:12px;font-size:14px}.edge-list{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px}.note{color:var(--muted)}summary{cursor:pointer;font-size:14px}@media(max-width:580px){.graph-pair{grid-template-columns:1fr}.panel svg{max-width:320px;margin:auto}}
</style>
