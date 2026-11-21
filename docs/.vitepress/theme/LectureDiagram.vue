<script setup>
import GraphIsomorphism from "./GraphIsomorphism.vue";
const props = defineProps({ kind: String, en: Boolean });
const t = (ja, en) => props.en ? en : ja;
const titles = {
 witness: ['ウィットネスを渡して検査する', 'Send a witness, then check it'],
 interaction: ['対話証明の具体例：グラフ同型性をランダムな質問で確かめる', 'An interactive-proof example: checking graph isomorphism with a random challenge'],
 graphs: ['配置が違っても，つながりは同じ', 'Different layouts, the same connections'],
 motives: ['二つの問いから，同じ枠組みへ', 'Two questions, one framework'],
 properties: ['完全性と健全性は，違う場合を扱う', 'Completeness and soundness concern different cases'],
 models: ['不正な証明者に，どこまでの能力を認めるか', 'How powerful may a dishonest prover be?'],
};
const numbers = {witness:1,interaction:2,graphs:3,motives:4,properties:5,models:6};

</script>
<template>
  <figure class="lecture-figure" :aria-labelledby="`diagram-${kind}`">
    <figcaption :id="`diagram-${kind}`"><span class="figure-number">{{ t('図', 'Figure') }} 01-{{ numbers[kind] }}</span><strong>{{ t(...titles[kind]) }}</strong></figcaption>
    <template v-if="kind === 'witness'">
      <div class="shared">{{ t('公開されている問題の入力 x', 'Public instance x') }}</div>
      <div class="flow"><div class="node"><b>{{ t('証明者 P', 'Prover P') }}</b><span>{{ t('ウィットネス w を用意', 'Provides a witness w') }}</span></div><div class="arrow"><span>w</span>→</div><div class="node teal"><b>{{ t('検証者 V', 'Verifier V') }}</b><span>{{ t('V(x, w) を計算', 'Computes V(x, w)') }}</span></div></div>
      <div class="result">{{ t('検査の結果：受理 / 拒否', 'Check result: accept / reject') }}</div>
      <p class="note">{{ t('この方法では w そのものを渡す．正しさの検査と，秘密を守ることは別の要求．', 'This procedure sends w itself. Checking correctness and protecting a secret are separate requirements.') }}</p>
    </template>
    <template v-else-if="kind === 'interaction'">
      <div class="shared">{{ t('共通入力：グラフ G₀，G₁　／　確かめる命題：G₀ ≅ G₁', 'Common input: graphs G₀, G₁  /  Proposition: G₀ ≅ G₁') }}</div>
      <div class="lanes"><div class="lane-role"><b>{{ t('証明者 P（Merlin）', 'Prover P (Merlin)') }}</b><span>{{ t('同型写像 π を知っている', 'Knows an isomorphism π') }}</span></div><div class="lane-role"><b>{{ t('検証者 V（Arthur）', 'Verifier V (Arthur)') }}</b><span>{{ t('確率的多項式時間で判定する', 'Decides in probabilistic polynomial time') }}</span></div></div>
      <div class="interaction-flow">
        <div class="exchange-step"><span class="step-tag">{{ t('1 G₀ の頂点名をランダムに付け替える', '1 Randomly relabel the vertices of G₀') }}</span><span class="exchange-arrow">H = ρ(G₀) ─→</span><span class="step-detail">{{ t('受け取る', 'receives H') }}</span></div>
        <div class="exchange-step"><span class="step-detail">{{ t('質問を受け取る', 'receives challenge') }}</span><span class="exchange-arrow">←───── b</span><span class="step-tag">{{ t('2 b∈{0,1} をランダムに選び，G_b との対応を質問', '2 Choose random b∈{0,1}; ask for a map to G_b') }}</span></div>
        <div class="exchange-step"><span class="step-tag">{{ t('3 G_b から H への対応 φ を答える', '3 Return a map φ from G_b to H') }}</span><span class="exchange-arrow">φ ─────→</span><span class="step-detail">{{ t('対応を受け取る', 'receives the map') }}</span></div>
      </div>
      <div class="result">{{ t('V は φ が一対一対応で，辺がある組・ない組の両方を保つかを調べ，命題 G₀ ≅ G₁ の真偽を判定する（受理／拒否）', 'V checks that φ is a bijection preserving both edges and non-edges, then decides whether G₀ ≅ G₁ (accept / reject)') }}</div>
      <p class="note">{{ t('なぜ質問をランダムにするのか：G₀ と G₁ が同型なら，証明者はどちらを選ばれても H との対応を示せる．同型でなければ，H は両方と同型にはなれないため，証明者はランダムな質問にいつも正しく答えることができない．この質問と応答によって命題の真偽を確かめるのが対話証明の考え方である．この例では検証者の質問 b が証明者にも見えるので「公開コイン型」と呼ぶ．グラフ同型性の定義と具体的な手続きは後の節で詳しく見る．', 'Why randomize the question? If G₀ and G₁ are isomorphic, the prover can provide a valid map to H whichever graph is selected. If they are not, H cannot be isomorphic to both, so the prover cannot answer every random challenge correctly. This illustrates how interaction can help determine whether a proposition is true. Here the challenge b is visible to the prover; this is called a public-coin protocol. The later graph-isomorphism section develops the definition and procedure in detail.') }}</p>
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
.flow{display:grid;grid-template-columns:1fr 48px 1fr;align-items:center}.pair,.lanes{display:grid;grid-template-columns:1fr 1fr;gap:16px}.node{display:flex;flex-direction:column;gap:10px;text-align:center;padding:20px 12px;background:var(--card);border:1px solid var(--line);border-radius:12px;font-size:14px;line-height:1.6}.node b{font-size:17px}.teal{background:var(--tint);border-color:var(--accent)}.arrow{text-align:center;font-size:28px}.arrow span{display:block;font-size:14px}.shared,.result{padding:12px 14px;text-align:center;border:1px dashed var(--line);border-radius:10px;font-size:14px;line-height:1.7}.shared{margin-bottom:16px}.result{margin-top:16px}.note{font-size:13px!important;line-height:1.85!important;color:var(--muted);margin:16px 0 0!important}.merge{text-align:center;font-size:30px;margin:12px 0}.down{font-size:24px}.lanes{text-align:center;font-size:14px}.lane-role{display:flex;flex-direction:column;gap:3px}.lane-role span{font-size:12px;color:var(--muted)}.interaction-flow{margin:10px 0 0;border:1px solid var(--line);border-radius:12px;background:var(--card);overflow:hidden}.exchange-step{display:grid;grid-template-columns:1fr minmax(130px, .8fr) 1fr;align-items:center;min-height:56px;padding:8px 14px;border-bottom:1px solid var(--line)}.exchange-step:last-child{border-bottom:0}.step-tag,.step-detail{font-size:14px;line-height:1.5}.step-tag:first-child{text-align:left}.exchange-step .step-tag:last-child,.exchange-step .step-detail:last-child{text-align:right}.exchange-arrow{text-align:center;color:var(--accent);font-weight:700;font-size:16px;white-space:nowrap}.messages{list-style:none!important;padding:0!important;margin:14px 18px!important;border-left:2px dashed var(--line);border-right:2px dashed var(--line)}.messages li{padding:8px 12px;margin:0!important;text-align:center;font-size:14px}.message-arrow{display:block;font-size:32px;line-height:1.2;color:var(--accent)}svg{display:block;width:100%;height:auto}.edges{fill:none;stroke:var(--line);stroke-width:3}.vertices{fill:var(--card);stroke:var(--accent);stroke-width:2}.labels{fill:var(--ink);font:20px system-ui,sans-serif}
@media(max-width:520px){.lecture-figure{padding:16px 12px}.pair{grid-template-columns:1fr}.exchange-step{grid-template-columns:1fr minmax(100px, .7fr) 1fr;padding:8px 7px}.step-tag,.step-detail{font-size:12px}.exchange-arrow{font-size:13px}.flow{grid-template-columns:1fr 30px 1fr}.node{padding:14px 8px}.node b{font-size:15px}figcaption{font-size:16px;gap:8px}}
.lecture-table-scroll{overflow-x:auto}.lecture-table{display:table!important;width:100%;margin:0!important;font-size:16px;line-height:1.7}.lecture-table caption{caption-side:top;text-align:left;margin-bottom:20px;scroll-margin-top:110px}.lecture-table caption .figure-number{margin-right:12px}.lecture-table th,.lecture-table td{border-color:var(--line)!important;background:var(--card)!important;color:var(--ink)!important}.lecture-table thead th{background:var(--tint)!important}@media(max-width:520px){.lecture-table{min-width:440px}}
</style>
