<script setup>
const props = defineProps({ en: Boolean });
const tx = (ja, en) => props.en ? en : ja;
</script>

<template>
  <figure id="figure-02-1" class="gi-figure" aria-labelledby="caption-02-1">
    <figcaption id="caption-02-1">
      <span class="gi-number">{{ en ? 'Figure 02-1' : '図 02-1' }}</span>
      <strong>{{ tx('グラフ同型性：ウィットネス，対話，シミュレーション', 'Graph isomorphism: witness, interaction, and simulation') }}</strong>
    </figcaption>
    <p class="gi-intro">{{ tx('公開入力は二つのグラフ G₀ と G₁．中央の H は，証明者が頂点名をランダムに付け替えて作り，最初に送るコミットである．', 'The public input is the pair G₀ and G₁. The central graph H is the prover’s commitment, formed by randomly relabeling vertices and sent first.') }}</p>
    <div class="gi-graphs" role="img" :aria-label="tx('G₀ から中央の H へは ρ，G₁ から H へは ρ∘π⁻¹ が対応する．π は秘密のウィットネスで a→3，b→1，c→5，d→2，e→4 に写す', 'ρ maps G₀ to central H; ρ∘π⁻¹ maps G₁ to H. Secret witness π maps a→3, b→1, c→5, d→2, e→4')">
      <svg viewBox="0 0 760 250" aria-hidden="true">
        <defs><marker id="gi-arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="currentColor" /></marker></defs>
        <g class="gi-edge">
          <path d="M115 54L173 98L151 166L79 166L57 98Z M115 54L151 166" />
          <path d="M380 54L438 98L416 166L344 166L322 98Z M380 54L416 166" />
          <path d="M645 54L703 98L681 166L609 166L587 98Z M645 54L681 166" />
        </g>
        <g class="gi-node">
          <circle cx="115" cy="54" r="18"/><circle cx="173" cy="98" r="18"/><circle cx="151" cy="166" r="18"/><circle cx="79" cy="166" r="18"/><circle cx="57" cy="98" r="18"/>
          <circle cx="380" cy="54" r="18"/><circle cx="438" cy="98" r="18"/><circle cx="416" cy="166" r="18"/><circle cx="344" cy="166" r="18"/><circle cx="322" cy="98" r="18"/>
          <circle cx="645" cy="54" r="18"/><circle cx="703" cy="98" r="18"/><circle cx="681" cy="166" r="18"/><circle cx="609" cy="166" r="18"/><circle cx="587" cy="98" r="18"/>
        </g>
        <g class="gi-label" text-anchor="middle">
          <text x="115" y="59">a</text><text x="173" y="103">b</text><text x="151" y="171">c</text><text x="79" y="171">d</text><text x="57" y="103">e</text>
          <text x="380" y="59">u</text><text x="438" y="103">v</text><text x="416" y="171">w</text><text x="344" y="171">x</text><text x="322" y="103">y</text>
          <text x="645" y="59">3</text><text x="703" y="103">1</text><text x="681" y="171">5</text><text x="609" y="171">2</text><text x="587" y="103">4</text>
        </g>
        <text class="gi-graph-title" x="115" y="218" text-anchor="middle">G₀</text><text class="gi-graph-title" x="380" y="218" text-anchor="middle">H = ρ(G₀)</text><text class="gi-graph-title" x="645" y="218" text-anchor="middle">G₁</text>
        <g class="gi-maps" marker-end="url(#gi-arrowhead)">
          <line x1="200" y1="104" x2="294" y2="104" />
          <line x1="560" y1="104" x2="466" y2="104" />
        </g>
        <text class="gi-map-sub" x="247" y="91" text-anchor="middle">ρ</text><text class="gi-map-sub" x="513" y="91" text-anchor="middle">ρ∘π⁻¹</text>
      </svg>
    </div>
    <p class="gi-map-caption">{{ tx('矢印はチャレンジ b に応じて返す H への写像を表す．π は G₀ と G₁ の同型を示す秘密のウィットネスで，a→3，b→1，c→5，d→2，e→4 と対応づける．', 'The arrows show the map to H returned for each challenge b. The secret witness π is an isomorphism from G₀ to G₁, mapping a→3, b→1, c→5, d→2, e→4.') }}</p>

    <h4>{{ tx('実際の対話：コミットの後にチャレンジが来る', 'Real interaction: the challenge follows the commitment') }}</h4>
    <div class="gi-flow">
      <div class="gi-step"><b>1</b><div><strong>{{ tx('証明者がコミット', 'Prover commits') }}</strong><p>{{ tx('ランダムな付け替え ρ で H=ρ(G₀) を作り，H を送る．', 'Choose a random relabeling ρ, form H=ρ(G₀), and send H.') }}</p></div></div>
      <div class="gi-arrow" aria-hidden="true">→</div>
      <div class="gi-step"><b>2</b><div><strong>{{ tx('検証者がチャレンジ', 'Verifier challenges') }}</strong><p>{{ tx('H を見てから，一様なビット b∈{0,1} を選ぶ．', 'After seeing H, sample a uniform bit b∈{0,1}.') }}</p></div></div>
      <div class="gi-arrow" aria-hidden="true">→</div>
      <div class="gi-step"><b>3</b><div><strong>{{ tx('証明者が応答', 'Prover responds') }}</strong><p>{{ tx('b=0 なら ρ，b=1 なら ρ∘π⁻¹ を返す．', 'Return ρ if b=0, or ρ∘π⁻¹ if b=1.') }}</p></div></div>
      <div class="gi-arrow" aria-hidden="true">→</div>
      <div class="gi-step"><b>4</b><div><strong>{{ tx('検証者が確認', 'Verifier checks') }}</strong><p>{{ tx('返された頂点対応が G', 'Check that the returned vertex map is a bijection from G') }}<sub>b</sub>{{ tx(' から H への全単射で，各頂点対の辺の有無を保つか検査する．', ' to H and preserves adjacency for every vertex pair.') }}</p></div></div>
    </div>

    <div class="gi-simulator"><strong>{{ tx('正直な検証者に対するシミュレータ', 'Simulator for an honest verifier') }}</strong><p>{{ tx('チャレンジ ', 'Choose the challenge ') }}b{{ tx(' と，頂点のランダムな付け替え φ', ' and a random relabeling φ') }}<sub>b</sub>{{ tx(' を先に選ぶ．次に H=φ', ' first. Then set H=φ') }}<sub>b</sub>({{ tx('G', 'G') }}<sub>b</sub>){{ tx(' として記録を作る．ウィットネス π を使わずに，実際の記録と同じ確率分布を生成する．', '. This generates a record with the same probability distribution as a real transcript, without using witness π.') }}</p></div>
    <p class="gi-alt">{{ tx('図の読み方：G₀ と H の辺は a–b，b–c，c–d，d–e，e–a，a–c（H では u–v，v–w，w–x，x–y，y–u，u–w）．G₁ の辺は 3–1，1–5，5–2，2–4，4–3，3–5．H が先に送られ，チャレンジ後に左か右の矢印の写像が返される．', 'Text alternative: G₀ and H have edges a–b, b–c, c–d, d–e, e–a, a–c (u–v, v–w, w–x, x–y, y–u, u–w in H). G₁ has edges 3–1, 1–5, 5–2, 2–4, 4–3, 3–5. H is sent first; after the challenge, the prover returns the map shown by the corresponding arrow.') }}</p>
  </figure>
</template>

<style scoped>
.gi-figure{--ink:#172d48;--muted:#405570;--line:#91a7bf;--paper:#f3f7fc;--card:#fff;--accent:#07685f;--tint:#e2f3ee;margin:30px 0;padding:24px;border:1px solid var(--line);border-radius:16px;background:var(--paper);color:var(--ink);scroll-margin-top:110px}
:global(.dark) .gi-figure{--ink:#f1f6fc;--muted:#d0deec;--line:#6f849d;--paper:#19283b;--card:#22364d;--accent:#99ebd8;--tint:#163d39}
figcaption{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap;line-height:1.7;margin-bottom:12px;font-size:17px}.gi-number{font:700 16px/1.5 monospace;color:var(--accent);white-space:nowrap}.gi-intro,.gi-map-caption,.gi-alt{font-size:14px;line-height:1.75;color:var(--muted)}.gi-graphs{overflow-x:auto}.gi-graphs svg{display:block;width:100%;min-width:760px;height:auto}.gi-edge{stroke:var(--line);stroke-width:3;fill:none}.gi-node circle{fill:var(--card);stroke:var(--accent);stroke-width:2.5}.gi-label{fill:var(--ink);font:600 15px system-ui,sans-serif}.gi-graph-title{fill:var(--accent);font:700 17px system-ui,sans-serif}.gi-map-sub{fill:var(--accent);font:700 14px system-ui,sans-serif}.gi-maps{stroke:var(--accent);stroke-width:2.5;color:var(--accent)}.gi-maps marker path{fill:var(--accent)}.gi-map-caption{text-align:center;margin:0 0 22px}.gi-figure h4{font-size:16px;margin:24px 0 12px}.gi-flow{display:flex;align-items:stretch;gap:8px}.gi-step{display:flex;align-items:flex-start;gap:10px;flex:1;min-width:0;padding:13px 11px;border:1px solid var(--line);border-radius:10px;background:var(--card)}.gi-step>b{flex:none;color:var(--accent);font:700 17px/1.4 monospace}.gi-step strong,.gi-simulator strong{font-size:14px}.gi-step p,.gi-simulator p{font-size:13px;line-height:1.7;margin:6px 0 0;overflow-wrap:anywhere}.gi-arrow{align-self:center;color:var(--accent);font-size:20px}.gi-simulator{margin-top:16px;padding:15px 17px;border-left:4px solid var(--accent);background:var(--tint);border-radius:0 8px 8px 0}.gi-alt{margin:14px 0 0;font-size:12px}
@media(max-width:760px){.gi-figure{padding:17px 13px}.gi-flow{display:grid;grid-template-columns:1fr}.gi-arrow{transform:rotate(90deg);justify-self:center;line-height:1}.gi-step{width:100%}}
@media print{.gi-figure{break-inside:avoid}}
</style>
