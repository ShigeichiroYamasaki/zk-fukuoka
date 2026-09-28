<script setup>
import { computed } from "vue";
import GraphIsomorphism from "./GraphIsomorphism.vue";
const props = defineProps({ kind: String, en: Boolean });
const t = (ja, en) => props.en ? en : ja;
const titles = {
 witness: ['ウィットネスを渡して検査する', 'Send a witness, then check it'],
 interaction: ['質問があると，やり取りが変わる', 'Questions change the interaction'],
 graphs: ['配置が違っても，つながりは同じ', 'Different layouts, the same connections'],
 motives: ['二つの問いから，同じ枠組みへ', 'Two questions, one framework'],
 properties: ['完全性と健全性は，違う場合を扱う', 'Completeness and soundness concern different cases'],
 models: ['不正な証明者に，どこまでの能力を認めるか', 'How powerful may a dishonest prover be?'],
};
const numbers = {witness:1,interaction:2,graphs:3,motives:4,properties:5,models:6};

const tables = {
 motives: {
  number: '01-2',
  headers: [['視点', 'Perspective'], ['確認したいこと', 'Question']],
  rows: [
   [['計算量理論', 'Complexity theory'], ['限られた検証者は，どこまで確認できるか？', 'What can a limited verifier check?']],
   [['暗号学', 'Cryptography'], ['確認の過程で，何が相手に伝わるか？', 'What information does checking reveal?']]
  ],
  result: ['共通の枠組みは対話型証明系 (P, V)．メッセージを交換し，最後に受理・拒否を決める．', 'The shared framework is an interactive proof system (P, V): exchange messages, then accept or reject.'],
  note: ['共通するのは記述の枠組み．完全性・健全性・ゼロ知識性は，それぞれ別に定義する．', 'The descriptive framework is shared. Completeness, soundness and zero-knowledge are defined separately.']
 },
 properties: {
  number: '01-3',
  headers: [['性質', 'Property'], ['対象となる場合', 'Case'], ['受理確率の条件', 'Acceptance condition']],
  rows: [
   [['完全性', 'Completeness'], ['x ∈ L：正しい言明と正直な証明者', 'x ∈ L: true statement and honest prover'], ['高い確率で受理：Pr[accept] ≥ 1 − negl', 'Accept with high probability: Pr[accept] ≥ 1 − negl']],
   [['健全性', 'Soundness'], ['x ∉ L：誤った言明と任意の不正な証明者', 'x ∉ L: false statement and any dishonest prover'], ['受理確率はごく小さい：Pr[accept] ≤ negl', 'Negligible acceptance probability: Pr[accept] ≤ negl']]
  ],
  note: ['何でも受理する検証者は健全性を満たさず，何でも拒否する検証者は完全性を満たさない．二つを同時に要求する．', 'Accepting everything fails soundness; rejecting everything fails completeness. Both properties are required.']
 },
 models: {
  number: '01-4',
  headers: [['証明系', 'Proof system'], ['不正な証明者の能力', 'Dishonest prover’s power'], ['保証', 'Guarantee']],
  rows: [
   [['Proof', 'Proof'], ['計算能力に制限なし', 'No computational bound'], ['統計的健全性', 'Statistical soundness']],
   [['Argument', 'Argument'], ['多項式時間に制限', 'Polynomial-time bounded'], ['計算量的健全性', 'Computational soundness']]
  ],
  result: ['SNARK / STARK の A は Argument を表す．', 'The A in SNARK / STARK stands for Argument.'],
  note: ['どちらも検証者は効率的に動く．ここで比べているのは，不正な証明者に対する保証の範囲であり，ゼロ知識性の強さではない．', 'In both cases the verifier is efficient. The distinction concerns guarantees against dishonest provers, not the strength of zero-knowledge.']
 }
};
const table = computed(() => tables[props.kind]);
</script>
<template>
  <div v-if="table" class="lecture-figure" role="group" :aria-labelledby="`diagram-${kind}`">
    <div class="lecture-table-scroll" tabindex="0" :aria-label="t('横にスクロールできる表', 'Scrollable table')">
      <table class="lecture-table">
        <caption :id="`diagram-${kind}`"><span class="figure-number">{{ t('表', 'Table') }} {{ table.number }}</span><strong>{{ t(...titles[kind]) }}</strong></caption>
        <thead><tr><th v-for="(header, i) in table.headers" :key="i" scope="col">{{ t(...header) }}</th></tr></thead>
        <tbody><tr v-for="(row, i) in table.rows" :key="i"><template v-for="(cell, j) in row" :key="j"><th v-if="j === 0" scope="row">{{ t(...cell) }}</th><td v-else>{{ t(...cell) }}</td></template></tr></tbody>
      </table>
    </div>
    <p v-if="table.result">{{ t(...table.result) }}</p>
    <p class="note">{{ t(...table.note) }}</p>
  </div>
  <figure v-else class="lecture-figure" :aria-labelledby="`diagram-${kind}`">
    <figcaption :id="`diagram-${kind}`"><span class="figure-number">{{ t('図', 'Figure') }} 01-{{ numbers[kind] }}</span><strong>{{ t(...titles[kind]) }}</strong></figcaption>
    <template v-if="kind === 'witness'">
      <div class="shared">{{ t('公開されている問題の入力 x', 'Public instance x') }}</div>
      <div class="flow"><div class="node"><b>{{ t('証明者 P', 'Prover P') }}</b><span>{{ t('ウィットネス w を用意', 'Provides a witness w') }}</span></div><div class="arrow"><span>w</span>→</div><div class="node teal"><b>{{ t('検証者 V', 'Verifier V') }}</b><span>{{ t('V(x, w) を計算', 'Computes V(x, w)') }}</span></div></div>
      <div class="result">{{ t('検査の結果：受理 / 拒否', 'Check result: accept / reject') }}</div>
      <p class="note">{{ t('この方法では w そのものを渡す．正しさの検査と，秘密を守ることは別の要求．', 'This procedure sends w itself. Checking correctness and protecting a secret are separate requirements.') }}</p>
    </template>
    <template v-else-if="kind === 'interaction'">
      <div class="lanes"><b>{{ t('証明者（Merlin）', 'Prover (Merlin)') }}</b><b>{{ t('検証者（Arthur）', 'Verifier (Arthur)') }}</b></div>
      <ol class="messages"><li><span>{{ t('ランダムな質問', 'Random question') }}</span><span class="message-arrow">←</span></li><li><span>{{ t('質問に応じた返答', 'Response to the question') }}</span><span class="message-arrow">→</span></li><li><span>{{ t('必要なラウンドを繰り返す', 'Repeat for the required rounds') }}</span><span class="message-arrow">↔</span></li></ol>
      <div class="result">{{ t('検証者が，やり取りと自分の乱数を使って判定する', 'The verifier decides using the exchange and its randomness') }}</div>
      <p class="note">{{ t('公開コイン型のやり取りを模式化．最初の発言者やラウンド数は方式による．対話するだけでゼロ知識になるわけではない．', 'A schematic public-coin exchange. The first speaker and round count depend on the protocol. Interaction alone does not imply zero-knowledge.') }}</p>
    </template>
    <template v-else-if="kind === 'graphs'">
      <GraphIsomorphism :en="en" />
    </template>
  </figure>
</template>
<style scoped>
.lecture-figure{--ink:#172d48;--muted:#405570;--line:#99aec4;--paper:#f3f7fc;--card:#fff;--accent:#06665e;--tint:#e3f4ef;margin:32px 0;padding:24px;border:1px solid var(--line);border-radius:18px;background:var(--paper);color:var(--ink)}
:global(.dark) .lecture-figure{--ink:#f0f5fc;--muted:#c8d7e9;--line:#697f9a;--paper:#19283b;--card:#22364d;--accent:#9debd9;--tint:#143e3b}
figcaption{flex-wrap:wrap;scroll-margin-top:110px;display:flex;gap:12px;align-items:baseline;margin-bottom:22px;line-height:1.7;font-size:17px}.figure-number{font:700 16px/1.5 monospace;letter-spacing:.08em;white-space:nowrap;color:var(--accent)}
.flow{display:grid;grid-template-columns:1fr 48px 1fr;align-items:center}.pair,.lanes{display:grid;grid-template-columns:1fr 1fr;gap:16px}.node{display:flex;flex-direction:column;gap:10px;text-align:center;padding:20px 12px;background:var(--card);border:1px solid var(--line);border-radius:12px;font-size:14px;line-height:1.6}.node b{font-size:17px}.teal{background:var(--tint);border-color:var(--accent)}.arrow{text-align:center;font-size:28px}.arrow span{display:block;font-size:14px}.shared,.result{padding:12px 14px;text-align:center;border:1px dashed var(--line);border-radius:10px;font-size:14px;line-height:1.7}.shared{margin-bottom:16px}.result{margin-top:16px}.note{font-size:13px!important;line-height:1.85!important;color:var(--muted);margin:16px 0 0!important}.merge{text-align:center;font-size:30px;margin:12px 0}.down{font-size:24px}.lanes{text-align:center;font-size:14px}.messages{list-style:none!important;padding:0!important;margin:14px 18px!important;border-left:2px dashed var(--line);border-right:2px dashed var(--line)}.messages li{padding:8px 12px;margin:0!important;text-align:center;font-size:14px}.message-arrow{display:block;font-size:32px;line-height:1.2;color:var(--accent)}svg{display:block;width:100%;height:auto}.edges{fill:none;stroke:var(--line);stroke-width:3}.vertices{fill:var(--card);stroke:var(--accent);stroke-width:2}.labels{fill:var(--ink);font:20px system-ui,sans-serif}
@media(max-width:520px){.lecture-figure{padding:16px 12px}.pair{grid-template-columns:1fr}.flow{grid-template-columns:1fr 30px 1fr}.node{padding:14px 8px}.node b{font-size:15px}figcaption{font-size:16px;gap:8px}}
.lecture-table-scroll{overflow-x:auto}.lecture-table{display:table!important;width:100%;margin:0!important;font-size:16px;line-height:1.7}.lecture-table caption{caption-side:top;text-align:left;margin-bottom:20px;scroll-margin-top:110px}.lecture-table caption .figure-number{margin-right:12px}.lecture-table th,.lecture-table td{border-color:var(--line)!important;background:var(--card)!important;color:var(--ink)!important}.lecture-table thead th{background:var(--tint)!important}@media(max-width:520px){.lecture-table{min-width:440px}}
</style>
