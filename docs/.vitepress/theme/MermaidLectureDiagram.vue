<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { useData } from 'vitepress';

const props = defineProps({ kind: { type: String, required: true }, en: Boolean });
const { isDark } = useData();
const target = ref(null);
const svg = ref('');
const error = ref('');
let mermaid;
let sequence = 0;
let stopped = false;

const t = (ja, en) => props.en ? en : ja;
const titles = {
  witness: ['ウィットネスを渡して検査する', 'Send a witness, then check it'],
  interaction: ['質問があると，やり取りが変わる', 'Questions change the interaction'],
  graphs: ['配置が違っても，つながりは同じ', 'Different layouts, the same connections'],
};
const numbers = { witness: 1, interaction: 2, graphs: 3 };

function definition() {
  if (props.kind === 'witness') return props.en ? `flowchart LR
accTitle: Witness check
accDescr: The public instance is known to both parties. The prover sends a witness to the verifier, who runs the verification algorithm and accepts or rejects.
X["Public instance x<br/>Statement x ∈ L"] --> P["Prover P<br/>Provides witness w"]
X --> V["Verifier V<br/>Runs V(x, w)"]
P -->|sends w| V
V --> D{"Decision"}
D -->|accept| A[Accept]
D -->|reject| R[Reject]` : `flowchart LR
accTitle: ウィットネスの検査
accDescr: 公開入力は両者に共有される。証明者がウィットネスを検証者に送り，検証者は検証アルゴリズムを実行して受理または拒否する。
X["公開入力 x<br/>言明 x ∈ L"] --> P["証明者 P<br/>ウィットネス w を用意"]
X --> V["検証者 V<br/>V(x, w) を実行"]
P -->|w を送る| V
V --> D{"判定"}
D -->|受理| A[受理]
D -->|拒否| R[拒否]`;

  if (props.kind === 'interaction') return props.en ? `sequenceDiagram
accTitle: Prover and verifier exchange
accDescr: The verifier asks a random question. The prover responds. They repeat as required, then the verifier decides using the transcript and its randomness.
participant P as Prover (Merlin)
participant V as Verifier (Arthur)
loop For the required rounds
  V->>P: Random question
  P->>V: Response to the question
end
Note over V: Decide using the exchange and verifier randomness
V->>V: Accept or reject` : `sequenceDiagram
accTitle: 証明者と検証者の対話
accDescr: 検証者がランダムな質問を送り，証明者が応答する。必要なラウンドを繰り返した後，検証者は対話記録と自分の乱数を使って判定する。
participant P as 証明者 (Merlin)
participant V as 検証者 (Arthur)
loop 必要なラウンド
  V->>P: ランダムな質問
  P->>V: 質問への応答
end
Note over V: 対話記録と検証者の乱数を使って判定
V->>V: 受理または拒否`;

  if (props.kind === 'graphs') return props.en ? `flowchart LR
accTitle: Two isomorphic graphs
accDescr: Two six-vertex, eight-edge graphs use different labels and layouts. Their edges correspond under the displayed bijection.
subgraph G0["Graph G₀"]
  direction LR
  A((A)) --- B((B))
  B --- C((C))
  C --- D((D))
  D --- E((E))
  E --- F((F))
  F --- A
  A --- C
  C --- E
end
subgraph G1["Graph G₁"]
  direction LR
  N4((4)) --- N1((1))
  N1 --- N6((6))
  N6 --- N2((2))
  N2 --- N5((5))
  N5 --- N3((3))
  N3 --- N4
  N4 --- N6
  N6 --- N5
end` : `flowchart LR
accTitle: 二つの同型なグラフ
accDescr: 頂点6個・辺8本の二つのグラフは，頂点名と配置が異なるが，表示した一対一対応によって辺のつながりを保つ。
subgraph G0["グラフ G₀"]
  direction LR
  A((A)) --- B((B))
  B --- C((C))
  C --- D((D))
  D --- E((E))
  E --- F((F))
  F --- A
  A --- C
  C --- E
end
subgraph G1["グラフ G₁"]
  direction LR
  N4((4)) --- N1((1))
  N1 --- N6((6))
  N6 --- N2((2))
  N2 --- N5((5))
  N5 --- N3((3))
  N3 --- N4
  N4 --- N6
  N6 --- N5
end`;

  throw new Error(`Unknown Mermaid lesson diagram: ${props.kind}`);
}

async function render() {
  const current = ++sequence;
  error.value = '';
  if (!target.value) return;
  try {
    mermaid ??= (await import('mermaid')).default;
    const dark = isDark.value;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      themeVariables: dark ? {
        background: '#18283b', primaryColor: '#25435b', primaryTextColor: '#f3f7fc',
        primaryBorderColor: '#8bb5cb', lineColor: '#c5d5e4', secondaryColor: '#1f493f',
        tertiaryColor: '#51452d', fontFamily: 'system-ui, sans-serif',
      } : {
        background: '#f3f7fc', primaryColor: '#e8f2fc', primaryTextColor: '#172d48',
        primaryBorderColor: '#356485', lineColor: '#35556f', secondaryColor: '#e6f6f0',
        tertiaryColor: '#fff2d8', fontFamily: 'system-ui, sans-serif',
      },
      flowchart: { htmlLabels: true, nodeSpacing: 34, rankSpacing: 48, curve: 'linear' },
    });
    const { svg: rendered } = await mermaid.render(`zkf-lecture-${props.kind}-${props.en ? 'en' : 'ja'}-${current}`, definition());
    if (!stopped && current === sequence) svg.value = rendered;
  } catch (cause) {
    if (!stopped && current === sequence) error.value = String(cause?.message ?? cause);
  }
}

onMounted(() => { stopped = false; render(); });
onBeforeUnmount(() => { stopped = true; sequence++; });
watch(() => [props.kind, props.en, isDark.value], render);
</script>

<template>
  <figure class="mermaid-lecture" :aria-labelledby="`mermaid-title-${kind}-${en ? 'en' : 'ja'}`">
    <figcaption :id="`mermaid-title-${kind}-${en ? 'en' : 'ja'}`">
      <span class="figure-number">{{ t('図', 'Figure') }} 01-{{ numbers[kind] }}</span>
      <strong>{{ t(...titles[kind]) }}</strong>
    </figcaption>
    <div v-if="svg" ref="target" class="diagram" v-html="svg"></div>
    <div v-else ref="target" class="diagram" role="status">{{ t('図を読み込み中です…', 'Loading diagram…') }}</div>
    <p v-if="kind === 'graphs'" class="mapping">
      <strong>π:</strong> {{ t('A ↔ 4 · B ↔ 1 · C ↔ 6 · D ↔ 2 · E ↔ 5 · F ↔ 3', 'A ↔ 4 · B ↔ 1 · C ↔ 6 · D ↔ 2 · E ↔ 5 · F ↔ 3') }}
    </p>
    <p class="note" v-if="kind === 'witness'">{{ t('この方法ではウィットネス w そのものを渡す．正しさの検査と，秘密を守ることは別の要求．', 'This procedure sends w itself. Checking correctness and protecting a secret are separate requirements.') }}</p>
    <p class="note" v-else-if="kind === 'interaction'">{{ t('公開コイン型のやり取りを模式化．最初の発言者やラウンド数は方式による．対話するだけでゼロ知識になるわけではない．', 'A schematic public-coin exchange. The first speaker and round count depend on the protocol. Interaction alone does not imply zero-knowledge.') }}</p>
    <p class="note" v-else>{{ t('同型写像はすべての頂点を一対一に対応づけ，辺の有無を保つ．頂点数・辺数が同じだけでは十分ではない．この図では対応 π を明示している．', 'An isomorphism is a bijection that preserves adjacency and non-adjacency. Equal vertex and edge counts alone are not sufficient. This diagram displays the mapping π.') }}</p>
  </figure>
</template>

<style scoped>
.mermaid-lecture{--ink:#172d48;--muted:#405570;--line:#99aec4;--paper:#f3f7fc;--accent:#06665e;margin:32px 0;padding:24px;border:1px solid var(--line);border-radius:18px;background:var(--paper);color:var(--ink)}
:global(.dark) .mermaid-lecture{--ink:#f0f5fc;--muted:#c8d7e9;--line:#697f9a;--paper:#19283b;--accent:#9debd9}
figcaption{display:flex;flex-wrap:wrap;gap:12px;align-items:baseline;margin-bottom:18px;line-height:1.7;font-size:17px}.figure-number{font:700 16px/1.5 monospace;letter-spacing:.08em;white-space:nowrap;color:var(--accent)}
.diagram{width:100%;min-height:80px;overflow-x:auto}.diagram :deep(svg){display:block;width:100%;height:auto;max-height:520px;margin:auto}.mapping{margin:14px 0 0;padding:10px;border:1px dashed var(--line);border-radius:8px;text-align:center;font-size:15px;line-height:1.8}.note{margin:14px 0 0!important;color:var(--muted);font-size:14px!important;line-height:1.8!important}
@media(max-width:600px){.mermaid-lecture{padding:16px 12px}figcaption{font-size:16px;gap:8px}.diagram :deep(svg){min-width:520px}}
</style>
