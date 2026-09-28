<script setup>
import { computed, ref } from 'vue';
import { basis, quadratic, difference, gridZeros } from './polynomialExamples.js';
const props = defineProps({ kind: String, en: Boolean });
const tx = (ja, en) => props.en ? en : ja;
const showBasis = ref(false);
const interpolation = computed(() => props.kind === 'interpolation');
const xs = computed(() => interpolation.value ? [0, 1, 2] : [0, 1, 2, 3, 4, 5, 6]);
const xmin = computed(() => interpolation.value ? -0.4 : -0.3);
const xmax = computed(() => interpolation.value ? 2.4 : 6.3);
const ymax = computed(() => interpolation.value ? 9 : 17);
const px = x => 56 + (x - xmin.value) / (xmax.value - xmin.value) * 500;
const py = y => 258 - (y + 3) / (ymax.value + 3) * 220;
const path = fn => Array.from({ length: 181 }, (_, i) => {
 const x = xmin.value + (xmax.value - xmin.value) * i / 180;
 return `${i ? 'L' : 'M'}${px(x).toFixed(2)},${py(fn(x)).toFixed(2)}`;
}).join(' ');
const value = x => interpolation.value ? quadratic(x) : difference(x);
</script>

<template>
 <figure class="pv" :aria-labelledby="`pv-${kind}`">
  <figcaption :id="`pv-${kind}`"><span>{{ tx('図', 'Figure') }} {{ interpolation ? '03-4' : '03-5' }}： </span>{{ interpolation ? tx('実数上の補間：3点から放物線を復元する', 'Interpolation over the reals: recover a parabola from three points') : tx('一変数：零点を引いたときだけ見逃す', 'One variable: a test misses the difference only at a root') }}</figcaption>
  <p>{{ interpolation ? tx('f(x) = x² + 1．指定した点は (0, 1)，(1, 2)，(2, 5)．', 'f(x) = x² + 1. The prescribed points are (0, 1), (1, 2), (2, 5).') : tx('h(x) = f(x) − g(x) = (x − 1)(x − 3)．S = {0, 1, 2, 3, 4, 5, 6} から一様に選ぶ．', 'h(x) = f(x) − g(x) = (x − 1)(x − 3). Sample uniformly from S = {0, 1, 2, 3, 4, 5, 6}.') }}</p>
  <label v-if="interpolation" class="pv-control"><input type="checkbox" v-model="showBasis"> {{ tx('重み付き基底 ℓ₀，2ℓ₁，5ℓ₂ を重ねる', 'Overlay weighted bases ℓ₀, 2ℓ₁, 5ℓ₂') }}</label>
  <div class="pv-scroll" tabindex="0" :aria-label="tx('グラフを横スクロール', 'Scrollable graph')">
   <svg viewBox="0 0 620 305" role="img" :aria-label="interpolation ? tx('放物線x二乗たす1が指定した3点を通る', 'The parabola x squared plus one passes through the three prescribed points') : tx('二次多項式の根は1と3．7個の候補点中2個で値が0になる', 'The quadratic has roots 1 and 3: two of seven candidate points give zero')">
    <g class="grid"><template v-for="y in (interpolation ? [-2,0,2,4,6,8] : [0,5,10,15])" :key="y"><line x1="56" x2="556" :y1="py(y)" :y2="py(y)"/><text x="45" :y="py(y)+5" text-anchor="end">{{ y }}</text></template></g>
    <path class="axis" :d="`M${px(0)} 28V258 M56 ${py(0)}H570`"/>
    <text x="581" :y="py(0)+5">x</text><text :x="px(0)-18" y="20">{{ interpolation ? 'f(x)' : 'h(x)' }}</text>
    <template v-if="interpolation && showBasis"><path v-for="(b,i) in basis" :key="i" :d="path(b)" :class="['basis', 'b'+i]"/></template>
    <path :d="path(value)" class="curve"/>
    <g v-for="x in xs" :key="x">
     <line :x1="px(x)" :x2="px(x)" :y1="py(0)" :y2="py(value(x))" class="guide"/>
     <circle :cx="px(x)" :cy="py(value(x))" r="6" :class="!interpolation && value(x)===0 ? 'root' : 'sample'"/>
     <text :x="px(x)" y="281" text-anchor="middle">{{ x }}</text>
     <text v-if="interpolation" :x="px(x)+12" :y="py(value(x))-12">({{ x }}, {{ value(x) }})</text>
     <text v-else-if="value(x)===0" :x="px(x)" :y="py(0)-16" text-anchor="middle">0</text>
    </g>
   </svg>
  </div>
  <p v-if="interpolation && showBasis" class="legend">━━ f　<span class="c0">┄ ℓ₀</span>　<span class="c1">┄ 2ℓ₁</span>　<span class="c2">┄ 5ℓ₂</span></p>
  <div class="pv-scroll"><table v-if="interpolation"><caption>{{ tx('表 03-1：補間点における重み付き基底と多項式の値', 'Table 03-1: Weighted basis and polynomial values at interpolation points') }}</caption><thead><tr><th>x</th><th>ℓ₀(x)</th><th>2ℓ₁(x)</th><th>5ℓ₂(x)</th><th>f(x)</th></tr></thead><tbody><tr v-for="x in xs" :key="x"><th>{{ x }}</th><td v-for="(b,i) in basis" :key="i">{{ b(x) }}</td><td>{{ value(x) }}</td></tr></tbody></table>
   <table v-else><caption>{{ tx('表 03-2：検査候補点と差の多項式の値', 'Table 03-2: Candidate test points and values of the difference polynomial') }}</caption><tbody><tr><th>x</th><td v-for="x in xs" :key="x">{{ x }}</td></tr><tr><th>h(x)</th><td v-for="x in xs" :key="x">{{ value(x) }}</td></tr></tbody></table></div>
  <p class="note">{{ interpolation ? tx('曲線は実数上の例である．有限体でも同じ補間公式を使えるが，座標は離散的な元であり，滑らかな曲線では結ばない．', 'This continuous curve is over the reals. The same interpolation formula works over finite fields, but field elements are discrete and are not joined by a smooth curve.') : tx('見逃す確率は 2/7 = d/|S|．それ以外の5点では違いを検出する．実数全体から選ぶのではなく，有限集合Sの7点から選ぶ例である．', 'The miss probability is 2/7 = d/|S|. The other five points detect a difference. Sampling is from the seven-point finite set S, not from all real numbers.') }}</p>
 </figure>
 <figure v-if="!interpolation" class="pv" aria-labelledby="pv-grid">
  <figcaption id="pv-grid"><span>{{ tx('図', 'Figure') }} 03-6： </span>{{ tx('二変数：49個の候補点のうち，零点は13個', 'Two variables: 13 zeros among 49 candidate points') }}</figcaption>
  <p>{{ tx('F₇ 上で h(X, Y) = (X − 1)(Y − 3)．全次数は2．S = F₇ として，XとYを独立かつ一様に選ぶ．', 'Over F₇, h(X, Y) = (X − 1)(Y − 3) has total degree 2. Choose X and Y independently and uniformly from S = F₇.') }}</p>
  <svg class="gridplot" viewBox="0 0 400 340" role="img" :aria-label="tx('7行7列の点．Xが1の列とYが3の行にある13点が零点', 'A seven by seven grid: the column X = 1 and row Y = 3 contain 13 zeros')">
   <template v-for="y in 7" :key="y"><template v-for="x in 7" :key="x"><circle :cx="70+(x-1)*40" :cy="275-(y-1)*40" r="11" :class="gridZeros(x-1,y-1) ? 'root' : 'sample'"/><text v-if="gridZeros(x-1,y-1)" :x="70+(x-1)*40" :y="280-(y-1)*40" text-anchor="middle" class="zero">0</text></template></template>
   <template v-for="t in 7" :key="t"><text :x="70+(t-1)*40" y="305" text-anchor="middle">{{ t-1 }}</text><text x="42" :y="280-(t-1)*40" text-anchor="end">{{ t-1 }}</text></template><text x="345" y="305">X</text><text x="33" y="18">Y</text>
  </svg>
  <p class="note">{{ tx('「0」と書いた点が見逃す点：7 + 7 − 1 = 13個．実際の確率13/49は，上界2/7 = 14/49以下になる．二変数では「根は2個」とは言えない．補題が抑えるのは，S × S全体での零点の割合である．', 'Points marked 0 are misses: 7 + 7 − 1 = 13. The actual probability 13/49 is below the bound 2/7 = 14/49. With two variables there can be more than two zeros: the lemma bounds the fraction of zeros in S × S.') }}</p>
 </figure>
</template>

<style scoped>
.pv{margin:28px 0;padding:20px;border:1px solid var(--vp-c-divider);border-radius:16px;background:var(--vp-c-bg-soft);color:var(--vp-c-text-1)}
caption{text-align:left;font-weight:700;line-height:1.7;padding:12px 0;caption-side:top}figcaption{font-weight:700;font-size:1.1rem}.pv p{font-size:.95rem;line-height:1.8}.pv-scroll{overflow-x:auto}.pv-scroll svg{display:block;width:100%;min-width:460px}.pv svg text{fill:var(--vp-c-text-1);font-size:14px}.grid line{stroke:var(--vp-c-divider)}.axis{stroke:var(--vp-c-text-2);fill:none}.curve{stroke:var(--vp-c-brand-1);stroke-width:3;fill:none}.guide{stroke:var(--vp-c-text-3);stroke-dasharray:3 4}.sample{fill:var(--vp-c-brand-1)}.root{fill:#b94b08;stroke:var(--vp-c-text-1);stroke-width:1}.pv .zero{fill:white;font-size:13px}.basis{fill:none;stroke-width:2;stroke-dasharray:6 4}.b0{stroke:#a64dbe}.b1{stroke:#b94b08}.b2{stroke:#008577}.c0{color:#a64dbe}.c1{color:#b94b08}.c2{color:#008577}.pv-control{display:flex;align-items:center;gap:8px;cursor:pointer}.pv-control input{width:18px;height:18px}.note{border-top:1px solid var(--vp-c-divider);padding-top:12px}.gridplot{display:block;max-width:400px;width:100%;margin:auto}.pv table{font-size:.9rem}.dark .b0{stroke:#d995ef}.dark .b1{stroke:#ffab70}.dark .b2{stroke:#58cebf}.dark .c0{color:#d995ef}.dark .c1{color:#ffab70}.dark .c2{color:#58cebf}@media(max-width:640px){.pv{padding:14px}}
</style>
