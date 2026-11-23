<script setup>
import GraphIsomorphism from "./GraphIsomorphism.vue";
const props = defineProps({ kind: String, en: Boolean });
const t = (ja, en) => props.en ? en : ja;
const titles = {
 witness: ['ウィットネスを渡して検査する', 'Send a witness, then check it'],
 interaction: ['対話証明の基本構造：先行メッセージ・質問・応答', 'The basic structure of an interactive proof: message, challenge, response'],
 ipPspace: ['計算量クラスの包含・完全性と，対話証明の能力', 'Complexity-class inclusions, completeness, and interactive proofs'],
 gmr: ['GMRの問題設定：知識を明かさずに，知っていることを確かめる', 'The GMR problem: establish knowledge without revealing it'],
 graphs: ['配置が違っても，つながりは同じ', 'Different layouts, the same connections'],
 motives: ['二つの問いから，同じ枠組みへ', 'Two questions, one framework'],
 properties: ['完全性と健全性は，違う場合を扱う', 'Completeness and soundness concern different cases'],
 models: ['不正な証明者に，どこまでの能力を認めるか', 'How powerful may a dishonest prover be?'],
};
const numbers = {witness:1,interaction:2,ipPspace:3,gmr:4,graphs:5,motives:6,properties:7,models:8};

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
    <template v-else-if="kind === 'ipPspace'">
      <div class="ip-pspace-layout">
        <section class="class-inclusions" :aria-label="t('計算量クラスの包含関係', 'Complexity-class inclusions')">
          <b class="panel-title">{{ t('計算量クラスの包含', 'Complexity-class inclusions') }}</b>
          <div class="class-oval pspace"><span>PSPACE</span><div class="class-oval np"><span>NP</span><div class="class-oval p"><span>P</span></div></div></div>
          <p class="class-equation">P ⊆ NP ⊆ PSPACE</p>
          <div class="complete-markers"><div><b>{{ t('NP完全', 'NP-complete') }}</b><span>{{ t('NPに属し，NP困難', 'in NP and NP-hard') }}</span></div><div><b>{{ t('PSPACE完全', 'PSPACE-complete') }}</b><span>{{ t('PSPACEに属し，PSPACE困難', 'in PSPACE and PSPACE-hard') }}</span></div></div>
          <p class="hardness-note"><b>{{ t('NP困難', 'NP-hard') }}</b>：{{ t('NPの全問題から還元可能．NPに属するとは限らない．', 'Every NP problem reduces to it; it need not be in NP.') }}</p>
          <p class="class-note">{{ t('円は包含関係の模式図であり，大きさはクラスの大きさを表さない．真の包含かどうかは未解決．', 'The circles schematically show inclusion, not class size. Whether either inclusion is strict is open.') }}</p>
        </section>
        <section class="ip-interaction" :aria-label="t('対話証明で判定できる問題', 'Problems decidable by interactive proofs')">
          <b class="panel-title">{{ t('対話で判定できる問題のクラス：IP', 'Class of problems decidable by interaction: IP') }}</b>
          <div class="ip-parties"><div><b>{{ t('検証者 V', 'Verifier V') }}</b><span>{{ t('確率的多項式時間', 'Probabilistic polynomial time') }}</span></div><div class="ip-exchange"><span>質問 ↔ 応答</span><small>{{ t('多項式回の対話', 'Polynomially many rounds') }}</small></div><div><b>{{ t('証明者 P*', 'Prover P*') }}</b><span>{{ t('計算時間に上限なし', 'Unbounded computation time') }}</span></div></div>
          <div class="ip-result">IP = PSPACE</div>
          <p class="class-equation">P ⊆ NP ⊆ IP = PSPACE</p>
          <p class="class-note">{{ t('検証者が一人でPSPACEの計算を実行するのではない．証明者との対話で，PSPACEの問題を確率的多項式時間の検証者が判定できる．', 'The verifier does not run a PSPACE computation alone. Interaction lets a probabilistic polynomial-time verifier decide PSPACE problems.') }}</p>
        </section>
      </div>
      <p class="note">{{ t('検証者はクラスPの決定的アルゴリズムではなく，確率的多項式時間で動く．図の包含関係とIP = PSPACEは別の情報を表しており，右側は対話によって判定できる問題の範囲がPSPACEに一致するという定理を示す．', 'The verifier is probabilistic polynomial time, not a deterministic P algorithm. The left panel shows class inclusions; the right states the theorem that interaction makes exactly PSPACE decidable.') }}</p>
    </template>
    <template v-else-if="kind === 'gmr'">
      <div class="shared">{{ t('確認したいこと：命題「x ∈ L」は真か？　／　秘密の情報：ウィットネス w', 'Question: Is the proposition “x ∈ L” true?  /  Private information: witness w') }}</div>
      <div class="gmr-flow">
        <section class="gmr-party prover"><b>{{ t('証明者 P', 'Prover P') }}</b><strong>{{ t('ウィットネス w を知っている', 'Knows the witness w') }}</strong><span>{{ t('w をそのまま渡さず，知っていることを納得させたい', 'Wants to convince V without handing over w') }}</span><div class="risk">{{ t('懸念：本当は知らないのに，知っているふりをする', 'Risk: claims to know w without actually knowing it') }}</div></section>
        <div class="gmr-exchange"><span>{{ t('対話のメッセージ', 'Interactive messages') }}</span><b>↔</b><small>{{ t('質問と応答', 'questions and responses') }}</small></div>
        <section class="gmr-party verifier"><b>{{ t('検証者 V', 'Verifier V') }}</b><strong>{{ t('命題の真偽を確かめたい', 'Wants to check whether the proposition is true') }}</strong><span>{{ t('受け取った情報を調べ，受理／拒否を決める', 'Checks the transcript and accepts or rejects') }}</span><div class="risk">{{ t('懸念：対話から w について余計な情報を得る', 'Risk: learns extra information about w from the exchange') }}</div></section>
      </div>
      <div class="gmr-question">{{ t('GMRが提起した問い：正しい証明を確かめながら，検証者に秘密を渡さずに済む手続きは作れるか？', 'The GMR question: Can a verifier check a correct proof without learning the secret?') }}</div>
      <p class="note">{{ t('図は研究の問題設定を示すもので，対話すれば自動的に秘密が守られるという意味ではない．不正な証明者を退ける条件と，検証者に余分な情報を与えない条件を，それぞれ定義する必要がある．', 'This figure presents the research problem; interaction alone does not automatically protect the secret. We need separate definitions for rejecting dishonest provers and for preventing the verifier from learning extra information.') }}</p>
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
.ip-pspace-layout{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:stretch}.class-inclusions,.ip-interaction{min-width:0;padding:16px;border:1px solid var(--line);border-radius:14px;background:var(--card);text-align:center}.panel-title{display:block;min-height:2.8em;line-height:1.5}.class-oval{position:relative;margin:12px auto 0;border:2px solid var(--accent);border-radius:50%;display:flex;justify-content:center;box-sizing:border-box}.class-oval>span{position:absolute;top:8px;font-weight:700}.pspace{width:min(100%,320px);height:205px;background:var(--paper)}.np{position:absolute;bottom:0;width:72%;height:150px;background:var(--tint)}.p{position:absolute;bottom:0;width:56%;height:86px;background:var(--card)}.p>span{top:auto;bottom:12px}.class-equation{margin:8px 0 0;font-weight:700}.complete-markers{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:12px 0 0;text-align:left}.complete-markers>div{display:flex;flex-direction:column;gap:3px;padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--tint);font-size:12px;line-height:1.5}.complete-markers span{color:var(--muted)}.hardness-note{margin:8px 0 0;padding:8px;border-left:3px solid var(--accent);background:var(--paper);font-size:12px;line-height:1.6;text-align:left}.class-note{font-size:12px;line-height:1.7;color:var(--muted);margin:8px 0 0}.ip-parties{display:grid;grid-template-columns:1fr 1.1fr 1fr;align-items:center;gap:5px;margin:28px 0 20px}.ip-parties>div:not(.ip-exchange){display:flex;flex-direction:column;gap:7px;padding:12px 6px;border:1px solid var(--line);border-radius:10px;background:var(--paper)}.ip-parties span{font-size:12px;line-height:1.5}.ip-exchange{font-size:14px;color:var(--accent);font-weight:700}.ip-exchange small{display:block;font-size:11px;color:var(--muted);font-weight:400}.ip-result{margin:0 auto;padding:12px;border-radius:10px;background:var(--tint);font-size:22px;font-weight:800;letter-spacing:.04em}
.gmr-flow{display:grid;grid-template-columns:1fr minmax(110px,.6fr) 1fr;gap:12px;align-items:stretch;margin:16px 0}.gmr-party{display:flex;flex-direction:column;gap:9px;padding:16px;border:1px solid var(--line);border-radius:12px;background:var(--card);text-align:center}.gmr-party b{font-size:17px}.gmr-party strong{line-height:1.5}.gmr-party>span{font-size:13px;line-height:1.65}.gmr-party.prover{background:var(--tint)}.gmr-party.verifier{background:var(--paper)}.risk{margin-top:auto;padding:9px;border-radius:8px;background:var(--paper);font-size:12px;line-height:1.6}.verifier .risk{background:var(--card)}.gmr-exchange{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:4px;color:var(--accent);text-align:center;font-size:13px;line-height:1.4}.gmr-exchange b{font-size:34px;line-height:1}.gmr-exchange small{color:var(--muted)}.gmr-question{padding:13px;border:1px dashed var(--accent);border-radius:10px;background:var(--tint);font-weight:700;text-align:center;line-height:1.65}
@media(max-width:700px){.ip-pspace-layout{grid-template-columns:1fr}.class-inclusions,.ip-interaction{padding:12px}.ip-parties{margin:18px 0}}
@media(max-width:600px){.gmr-flow{grid-template-columns:1fr}.gmr-exchange{padding:4px}.gmr-exchange b{transform:rotate(90deg)}}
.lecture-table-scroll{overflow-x:auto}.lecture-table{display:table!important;width:100%;margin:0!important;font-size:16px;line-height:1.7}.lecture-table caption{caption-side:top;text-align:left;margin-bottom:20px;scroll-margin-top:110px}.lecture-table caption .figure-number{margin-right:12px}.lecture-table th,.lecture-table td{border-color:var(--line)!important;background:var(--card)!important;color:var(--ink)!important}.lecture-table thead th{background:var(--tint)!important}@media(max-width:520px){.lecture-table{min-width:440px}}
</style>
