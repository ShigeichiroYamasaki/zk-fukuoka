<script setup>
const props = defineProps({ en: Boolean });
const tx = (ja, en) => props.en ? en : ja;
</script>

<template>
  <figure id="figure-02-6" class="gi-figure" aria-labelledby="caption-02-6">
    <figcaption id="caption-02-6">
      <span class="gi-number">{{ en ? 'Figure 02-6' : '図 02-6' }}</span>
      <strong>{{ tx('グラフ同型性：ウィットネス，対話，シミュレーション', 'Graph isomorphism: witness, interaction, and simulation') }}</strong>
    </figcaption>
    <p class="gi-intro">{{ tx('公開入力は二つのグラフ．辺の形は同じで，頂点の名前だけが置き換わっている．', 'The public input is a pair of graphs. They have the same edge structure, with different vertex labels.') }}</p>
    <div class="gi-graphs" role="img" :aria-label="tx('左の G₀ と右の G₁ は同型で，π は a→3，b→1，c→5，d→2，e→4 に対応づける', 'G₀ on the left and G₁ on the right are isomorphic; π maps a→3, b→1, c→5, d→2, e→4')">
      <svg viewBox="0 0 680 250" aria-hidden="true">
        <g class="gi-edge">
          <path d="M155 56L225 107L198 190L112 190L85 107Z M155 56L198 190" />
          <path d="M525 56L595 107L568 190L482 190L455 107Z M525 56L568 190" />
        </g>
        <g class="gi-node">
          <circle cx="155" cy="56" r="20"/><circle cx="225" cy="107" r="20"/><circle cx="198" cy="190" r="20"/><circle cx="112" cy="190" r="20"/><circle cx="85" cy="107" r="20"/>
          <circle cx="525" cy="56" r="20"/><circle cx="595" cy="107" r="20"/><circle cx="568" cy="190" r="20"/><circle cx="482" cy="190" r="20"/><circle cx="455" cy="107" r="20"/>
        </g>
        <g class="gi-label" text-anchor="middle">
          <text x="155" y="62">a</text><text x="225" y="113">b</text><text x="198" y="196">c</text><text x="112" y="196">d</text><text x="85" y="113">e</text>
          <text x="525" y="62">3</text><text x="595" y="113">1</text><text x="568" y="196">5</text><text x="482" y="196">2</text><text x="455" y="113">4</text>
        </g>
        <text class="gi-graph-title" x="155" y="238" text-anchor="middle">G₀</text><text class="gi-graph-title" x="525" y="238" text-anchor="middle">G₁</text>
        <text class="gi-map" x="340" y="119" text-anchor="middle">π</text><text class="gi-map-sub" x="340" y="144" text-anchor="middle">a→3 · b→1 · c→5</text><text class="gi-map-sub" x="340" y="163" text-anchor="middle">d→2 · e→4</text>
      </svg>
    </div>
    <p class="gi-map-caption">{{ tx('秘密のウィットネス π：頂点名の対応が辺のつながりを保つ', 'Secret witness π: the vertex mapping preserves adjacency') }}</p>

    <h4>{{ tx('実際の対話：コミットの後にチャレンジが来る', 'Real interaction: the challenge follows the commitment') }}</h4>
    <div class="gi-flow">
      <div class="gi-step"><b>1</b><div><strong>{{ tx('証明者がコミット', 'Prover commits') }}</strong><p>{{ tx('ランダムな付け替え ρ で H=ρ(G₀) を作り，H を送る．', 'Choose a random relabeling ρ, form H=ρ(G₀), and send H.') }}</p></div></div>
      <div class="gi-arrow" aria-hidden="true">→</div>
      <div class="gi-step"><b>2</b><div><strong>{{ tx('検証者がチャレンジ', 'Verifier challenges') }}</strong><p>{{ tx('H を見てから，一様なビット b∈{0,1} を選ぶ．', 'After seeing H, sample a uniform bit b∈{0,1}.') }}</p></div></div>
      <div class="gi-arrow" aria-hidden="true">→</div>
      <div class="gi-step"><b>3</b><div><strong>{{ tx('証明者が応答', 'Prover responds') }}</strong><p>{{ tx('b=0 なら ρ，b=1 なら ρ∘π⁻¹ を返す．', 'Return ρ if b=0, or ρ∘π⁻¹ if b=1.') }}</p></div></div>
      <div class="gi-arrow" aria-hidden="true">→</div>
      <div class="gi-step"><b>4</b><div><strong>{{ tx('検証者が確認', 'Verifier checks') }}</strong><p>{{ tx('応答が G_b から H への全単射かつ辺を保つかを検査する．', 'Check that the response is a bijection G_b→H preserving edges.') }}</p></div></div>
    </div>

    <div class="gi-simulator"><strong>{{ tx('正直な検証者に対するシミュレータ', 'Simulator for an honest verifier') }}</strong><p>{{ tx('チャレンジ ', 'Choose the challenge ') }}b{{ tx(' と，頂点のランダムな付け替え φ', ' and a random relabeling φ') }}<sub>b</sub>{{ tx(' を先に選ぶ．次に H=φ', ' first. Then set H=φ') }}<sub>b</sub>({{ tx('G', 'G') }}<sub>b</sub>){{ tx(' として記録を作る．ウィットネス π を使わずに，実際の記録と同じ確率分布を生成する．', '. This generates a record with the same probability distribution as a real transcript, without using witness π.') }}</p></div>
    <p class="gi-alt">{{ tx('図の読み方：G₀の辺は a–b，b–c，c–d，d–e，e–a，a–c．G₁の辺は 3–1，1–5，5–2，2–4，4–3，3–5．π は各辺を対応する辺へ写す．', 'Text alternative: G₀ has edges a–b, b–c, c–d, d–e, e–a, and a–c. G₁ has edges 3–1, 1–5, 5–2, 2–4, 4–3, and 3–5. π maps each edge to the corresponding edge.') }}</p>
  </figure>
</template>

<style scoped>
.gi-figure{--ink:#172d48;--muted:#405570;--line:#91a7bf;--paper:#f3f7fc;--card:#fff;--accent:#07685f;--tint:#e2f3ee;margin:30px 0;padding:24px;border:1px solid var(--line);border-radius:16px;background:var(--paper);color:var(--ink);scroll-margin-top:110px}
:global(.dark) .gi-figure{--ink:#f1f6fc;--muted:#d0deec;--line:#6f849d;--paper:#19283b;--card:#22364d;--accent:#99ebd8;--tint:#163d39}
figcaption{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;line-height:1.7;margin-bottom:12px;font-size:17px}.gi-number{font:700 16px/1.5 monospace;color:var(--accent);white-space:nowrap}.gi-intro,.gi-map-caption,.gi-alt{font-size:14px;line-height:1.75;color:var(--muted)}.gi-graphs{overflow-x:auto}.gi-graphs svg{display:block;width:100%;min-width:600px;height:auto}.gi-edge{stroke:var(--line);stroke-width:3;fill:none}.gi-node circle{fill:var(--card);stroke:var(--accent);stroke-width:2.5}.gi-label{fill:var(--ink);font:600 15px system-ui,sans-serif}.gi-graph-title{fill:var(--accent);font:700 18px system-ui,sans-serif}.gi-map{fill:var(--accent);font:700 22px system-ui,sans-serif}.gi-map-sub{fill:var(--muted);font:13px system-ui,sans-serif}.gi-map-caption{text-align:center;margin:0 0 22px}.gi-figure h4{font-size:16px;margin:24px 0 12px}.gi-flow{display:flex;align-items:stretch;gap:8px}.gi-step{display:flex;align-items:flex-start;gap:10px;flex:1;min-width:0;padding:13px 11px;border:1px solid var(--line);border-radius:10px;background:var(--card)}.gi-step>b{flex:none;color:var(--accent);font:700 17px/1.4 monospace}.gi-step strong,.gi-simulator strong{font-size:14px}.gi-step p,.gi-simulator p{font-size:13px;line-height:1.7;margin:6px 0 0;overflow-wrap:anywhere}.gi-arrow{align-self:center;color:var(--accent);font-size:20px}.gi-simulator{margin-top:16px;padding:15px 17px;border-left:4px solid var(--accent);background:var(--tint);border-radius:0 8px 8px 0}.gi-alt{margin:14px 0 0;font-size:12px}
@media(max-width:760px){.gi-figure{padding:17px 13px}.gi-flow{display:grid;grid-template-columns:1fr}.gi-arrow{transform:rotate(90deg);justify-self:center;line-height:1}.gi-step{width:100%}}
@media print{.gi-figure{break-inside:avoid}}
</style>
