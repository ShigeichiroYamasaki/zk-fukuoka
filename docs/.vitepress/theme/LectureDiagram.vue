<script setup>
import GraphIsomorphism from "./GraphIsomorphism.vue";
const props = defineProps({ kind: String, en: Boolean });
const t = (ja, en) => props.en ? en : ja;
const titles = {
 witness: ['ウィットネスを渡して検査する', 'Send a witness, then check it'],
 interaction: ['対話証明の基本構造：先行メッセージ・質問・応答', 'The basic structure of an interactive proof: message, challenge, response'],
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
      <div class="shared">{{ t('共通入力 x：確かめる命題「x ∈ L」', 'Common input x: the proposition “x ∈ L” to be checked') }}</div>
      <div class="lanes"><div class="lane-role"><b>{{ t('証明者 P（Merlin）', 'Prover P (Merlin)') }}</b><span>{{ t('必要な情報を持ち，応答を作る', 'Has relevant information and prepares responses') }}</span></div><div class="lane-role"><b>{{ t('検証者 V（Arthur）', 'Verifier V (Arthur)') }}</b><span>{{ t('確率的多項式時間で判定する', 'Decides in probabilistic polynomial time') }}</span></div></div>
      <div class="interaction-flow">
        <div class="exchange-step"><span class="step-tag">{{ t('1 先行メッセージ a を送る', '1 Send an initial message a') }}</span><span class="exchange-arrow">a ─────→</span><span class="step-detail">{{ t('a を受け取る', 'receives a') }}</span></div>
        <div class="exchange-step"><span class="step-detail">{{ t('質問 c を受け取る', 'receives challenge c') }}</span><span class="exchange-arrow">←───── c</span><span class="step-tag">{{ t('2 a を見た後で乱数から質問 c を選ぶ', '2 After seeing a, sample a random challenge c') }}</span></div>
        <div class="exchange-step"><span class="step-tag">{{ t('3 a と c に整合する応答 z を返す', '3 Return a response z consistent with a and c') }}</span><span class="exchange-arrow">z ─────→</span><span class="step-detail">{{ t('z を受け取る', 'receives z') }}</span></div>
      </div>
      <div class="result">{{ t('V は x と対話記録 (a, c, z) を調べ，命題「x ∈ L」を受理するか拒否するか判定する', 'V examines x and the transcript (a, c, z), then accepts or rejects the proposition “x ∈ L”') }}</div>
      <p class="note">{{ t('重要なのは送信回数ではなく順序である．証明者は質問 c を見る前に a を送るため，質問を見てから a を都合よく選び直すことはできない．応答 z は，先に送った a と質問 c の両方に整合しなければならない．この図では質問 c を証明者にも見せる公開コイン型を描いている（公開コイン型とは，検証者のランダムな質問が証明者にも公開される方式）．一般の対話型証明では，質問の見せ方や発言順は方式によって異なる．後のグラフ同型性の例では，a・c・z がそれぞれ何に当たるかを具体的に見る．', 'The key is the order, not the number of messages. The prover sends a before seeing challenge c, so it cannot choose a afterward to fit the question. Its response z must be consistent with both the earlier a and the challenge c. This diagram shows a public-coin protocol, where the verifier reveals its random challenge to the prover. Interactive proofs can use different visibility rules and speaking orders. The later graph-isomorphism example will instantiate a, c and z with concrete objects.') }}</p>
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
