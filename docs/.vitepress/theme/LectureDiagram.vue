<script setup>
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
</script>
<template>
  <figure class="lecture-figure" :aria-labelledby="`diagram-${kind}`">
    <figcaption :id="`diagram-${kind}`"><span class="figure-number">{{ t('図', 'FIG') }} {{ numbers[kind] }}</span><strong>{{ t(...titles[kind]) }}</strong></figcaption>
    <template v-if="kind === 'witness'">
      <div class="shared">{{ t('公開されている問題の入力 x', 'Public instance x') }}</div>
      <div class="flow"><div class="node"><b>{{ t('証明者 P', 'Prover P') }}</b><span>{{ t('ウィットネス w を用意', 'Provides a witness w') }}</span></div><div class="arrow"><span>w</span>→</div><div class="node teal"><b>{{ t('検証者 V', 'Verifier V') }}</b><span>{{ t('V(x, w) を計算', 'Computes V(x, w)') }}</span></div></div>
      <div class="result">{{ t('検査の結果：受理 / 拒否', 'Check result: accept / reject') }}</div>
      <p class="note">{{ t('この方法では w そのものを渡す。正しさの検査と，秘密を守ることは別の要求。', 'This procedure sends w itself. Checking correctness and protecting a secret are separate requirements.') }}</p>
    </template>
    <template v-else-if="kind === 'interaction'">
      <div class="lanes"><b>{{ t('証明者（Merlin）', 'Prover (Merlin)') }}</b><b>{{ t('検証者（Arthur）', 'Verifier (Arthur)') }}</b></div>
      <ol class="messages"><li><span>{{ t('ランダムな質問', 'Random question') }}</span><span class="message-arrow">←</span></li><li><span>{{ t('質問に応じた返答', 'Response to the question') }}</span><span class="message-arrow">→</span></li><li><span>{{ t('必要なラウンドを繰り返す', 'Repeat for the required rounds') }}</span><span class="message-arrow">↔</span></li></ol>
      <div class="result">{{ t('検証者が，やり取りと自分の乱数を使って判定する', 'The verifier decides using the exchange and its randomness') }}</div>
      <p class="note">{{ t('公開コイン型のやり取りを模式化。最初の発言者やラウンド数は方式による。対話するだけでゼロ知識になるわけではない。', 'A schematic public-coin exchange. The first speaker and round count depend on the protocol. Interaction alone does not imply zero-knowledge.') }}</p>
    </template>
    <template v-else-if="kind === 'graphs'">
      <svg viewBox="0 0 620 220" role="img" :aria-label="t('G1はA-B-C-Dの道。G2は3-1-4-2の道。同型写像はAを3，Bを1，Cを4，Dを2へ対応づける。','G1 is the path A-B-C-D. G2 is the path 3-1-4-2. The isomorphism maps A to 3, B to 1, C to 4 and D to 2.')">
        <g class="edges"><path d="M55 75L180 75L180 165L55 165"/><path d="M385 165L450 65L505 165L570 65"/></g>
        <g class="vertices"><circle cx="55" cy="75" r="21"/><circle cx="180" cy="75" r="21"/><circle cx="180" cy="165" r="21"/><circle cx="55" cy="165" r="21"/><circle cx="385" cy="165" r="21"/><circle cx="450" cy="65" r="21"/><circle cx="505" cy="165" r="21"/><circle cx="570" cy="65" r="21"/></g>
        <g class="labels" text-anchor="middle"><text x="118" y="25">G₁</text><text x="478" y="25">G₂</text><text x="55" y="82">A</text><text x="180" y="82">B</text><text x="180" y="172">C</text><text x="55" y="172">D</text><text x="385" y="172">3</text><text x="450" y="72">1</text><text x="505" y="172">4</text><text x="570" y="72">2</text><text x="300" y="110">≅</text></g>
      </svg>
      <div class="shared">π : A → 3 · B → 1 · C → 4 · D → 2</div>
      <p class="note">{{ t('辺 AB・BC・CD は，それぞれ 3–1・1–4・4–2 に対応する。ここでは説明のため写像 π を表示した。問いは，この写像を渡さず同型性を納得させられるか，である。', 'Edges AB, BC and CD map to 3–1, 1–4 and 4–2. The mapping π is displayed here for illustration. The question is whether isomorphism can be established without handing over this mapping.') }}</p>
    </template>
    <template v-else-if="kind === 'motives'">
      <div class="pair"><div class="node"><b>{{ t('計算量理論の問い', 'Complexity-theoretic question') }}</b><span>{{ t('限られた検証者は，どこまで確認できるか？', 'What can a limited verifier check?') }}</span></div><div class="node teal"><b>{{ t('暗号学の問い', 'Cryptographic question') }}</b><span>{{ t('確認の過程で，何が相手に伝わるか？', 'What information does checking reveal?') }}</span></div></div>
      <div class="merge" aria-hidden="true">↘　↙</div><div class="result"><b>{{ t('対話型証明系 (P, V)', 'Interactive proof system (P, V)') }}</b><br>{{ t('メッセージを交換し，最後に受理・拒否を決める', 'Exchange messages, then accept or reject') }}</div>
      <p class="note">{{ t('共通するのは記述の枠組み。完全性・健全性・ゼロ知識性は，それぞれ別に定義する。', 'The descriptive framework is shared. Completeness, soundness and zero-knowledge are defined separately.') }}</p>
    </template>
    <template v-else-if="kind === 'properties'">
      <div class="pair"><div class="node teal"><b>{{ t('完全性', 'Completeness') }}</b><span>x ∈ L</span><span>{{ t('正しい主張 ＋ 正直な証明者', 'True statement + honest prover') }}</span><span class="down">↓</span><strong>{{ t('高い確率で受理', 'Accept with high probability') }}</strong><small>Pr[accept] ≥ 1 − negl</small></div><div class="node"><b>{{ t('健全性', 'Soundness') }}</b><span>x ∉ L</span><span>{{ t('誤った主張 ＋ 任意の不正な証明者', 'False statement + any dishonest prover') }}</span><span class="down">↓</span><strong>{{ t('受理される確率はごく小さい', 'Acceptance probability is negligible') }}</strong><small>Pr[accept] ≤ negl</small></div></div>
      <p class="note">{{ t('何でも受理する検証者は健全性を満たさず，何でも拒否する検証者は完全性を満たさない。二つを同時に要求する。', 'Accepting everything fails soundness; rejecting everything fails completeness. Both properties are required.') }}</p>
    </template>
    <template v-else>
      <div class="pair"><div class="node"><b>Proof</b><span>{{ t('不正な証明者の計算能力に制限なし', 'No computational bound on the dishonest prover') }}</span><span class="down">↓</span><strong>{{ t('統計的健全性', 'Statistical soundness') }}</strong></div><div class="node teal"><b>Argument</b><span>{{ t('不正な証明者を多項式時間に制限', 'Dishonest prover is polynomial-time bounded') }}</span><span class="down">↓</span><strong>{{ t('計算量的健全性', 'Computational soundness') }}</strong></div></div>
      <div class="result">SNARK / STARK : A = Argument</div>
      <p class="note">{{ t('どちらも検証者は効率的に動く。ここで比べているのは，不正な証明者に対する保証の範囲であり，ゼロ知識性の強さではない。', 'In both cases the verifier is efficient. The distinction concerns guarantees against dishonest provers, not the strength of zero-knowledge.') }}</p>
    </template>
  </figure>
</template>
<style scoped>
.lecture-figure{--ink:#172d48;--muted:#405570;--line:#99aec4;--paper:#f3f7fc;--card:#fff;--accent:#06665e;--tint:#e3f4ef;margin:32px 0;padding:24px;border:1px solid var(--line);border-radius:18px;background:var(--paper);color:var(--ink)}
:global(.dark) .lecture-figure{--ink:#f0f5fc;--muted:#c8d7e9;--line:#697f9a;--paper:#19283b;--card:#22364d;--accent:#9debd9;--tint:#143e3b}
figcaption{scroll-margin-top:110px;display:flex;gap:12px;align-items:baseline;margin-bottom:22px;line-height:1.7;font-size:17px}.figure-number{font:700 11px/1.5 monospace;letter-spacing:.08em;white-space:nowrap;color:var(--accent)}
.flow{display:grid;grid-template-columns:1fr 48px 1fr;align-items:center}.pair,.lanes{display:grid;grid-template-columns:1fr 1fr;gap:16px}.node{display:flex;flex-direction:column;gap:10px;text-align:center;padding:20px 12px;background:var(--card);border:1px solid var(--line);border-radius:12px;font-size:14px;line-height:1.6}.node b{font-size:17px}.teal{background:var(--tint);border-color:var(--accent)}.arrow{text-align:center;font-size:28px}.arrow span{display:block;font-size:14px}.shared,.result{padding:12px 14px;text-align:center;border:1px dashed var(--line);border-radius:10px;font-size:14px;line-height:1.7}.shared{margin-bottom:16px}.result{margin-top:16px}.note{font-size:13px!important;line-height:1.85!important;color:var(--muted);margin:16px 0 0!important}.merge{text-align:center;font-size:30px;margin:12px 0}.down{font-size:24px}.lanes{text-align:center;font-size:14px}.messages{list-style:none!important;padding:0!important;margin:14px 18px!important;border-left:2px dashed var(--line);border-right:2px dashed var(--line)}.messages li{padding:8px 12px;margin:0!important;text-align:center;font-size:14px}.message-arrow{display:block;font-size:32px;line-height:1.2;color:var(--accent)}svg{display:block;width:100%;height:auto}.edges{fill:none;stroke:var(--line);stroke-width:3}.vertices{fill:var(--card);stroke:var(--accent);stroke-width:2}.labels{fill:var(--ink);font:20px system-ui,sans-serif}
@media(max-width:520px){.lecture-figure{padding:16px 12px}.pair{grid-template-columns:1fr}.flow{grid-template-columns:1fr 30px 1fr}.node{padding:14px 8px}.node b{font-size:15px}figcaption{font-size:16px;gap:8px}}
</style>
