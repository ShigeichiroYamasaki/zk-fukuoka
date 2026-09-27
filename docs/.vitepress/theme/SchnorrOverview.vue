<script setup>
defineProps({ en: Boolean });
</script>

<template>
 <figure class="schnorr-overview" aria-labelledby="schnorr-overview-title">
  <figcaption id="schnorr-overview-title">{{ en ? 'Schnorr identification: who sends what, and when?' : 'Schnorr識別プロトコル：誰が，何を，いつ送るか' }}</figcaption>
  <p class="public">{{ en ? 'Public: a value corresponding to the secret exponent. Only the prover knows the secret exponent (witness).' : '公開：秘密の指数に対応する値．秘密の指数（ウィットネス）は証明者だけが知っている．' }}</p>
  <div class="sequence-scroll" tabindex="0" :aria-label="en ? 'Scrollable protocol sequence' : '横にスクロールできる手順図'">
   <div class="sequence">
    <div class="actor prover">{{ en ? 'Prover P' : '証明者 P' }}<small>{{ en ? 'Keeps the witness secret' : 'ウィットネスを秘密に保つ' }}</small></div>
    <div class="time">{{ en ? 'Time ↓' : '時間 ↓' }}</div>
    <div class="actor verifier">{{ en ? 'Honest verifier V' : '正直な検証者 V' }}<small>{{ en ? 'Follows the prescribed procedure' : '指定された手順に従う' }}</small></div>
    <div class="step prover">{{ en ? 'Choose fresh randomness; create the initial message' : '新しい乱数を選び，最初のメッセージを作る' }}</div>
    <div class="message"><b>{{ en ? '① Commitment t' : '① コミット t' }}</b><span aria-hidden="true">⟶</span><small>{{ en ? 'P → V' : '証明者 → 検証者' }}</small></div>
    <div class="step verifier">{{ en ? 'Receive t first' : '先に t を受け取る' }}</div>
    <div class="step prover">{{ en ? 'Receive c after sending t' : 't を送った後で c を受け取る' }}</div>
    <div class="message"><b>{{ en ? '② Challenge c' : '② チャレンジ c' }}</b><span aria-hidden="true">⟵</span><small>{{ en ? 'V → P' : '検証者 → 証明者' }}</small></div>
    <div class="step verifier emphasized">{{ en ? 'Sample c uniformly from the specified set' : '指定された集合から c を一様ランダムに選ぶ' }}</div>
    <div class="step prover">{{ en ? 'Compute s using the witness, randomness and c' : 'ウィットネス・乱数・c を使って応答 s を計算する' }}</div>
    <div class="message"><b>{{ en ? '③ Response s' : '③ 応答 s' }}</b><span aria-hidden="true">⟶</span><small>{{ en ? 'P → V' : '証明者 → 検証者' }}</small></div>
    <div class="step verifier emphasized">{{ en ? 'Apply the prescribed verification equation → accept / reject' : '所定の検証式で確認 → 受理 / 拒否' }}</div>
   </div>
  </div>
  <p class="note">{{ en ? 'Only t, c and s cross the arrows; the secret exponent is not sent. The equations are introduced in Section 4.1. Following the protocol still allows the verifier to record and analyze its view.' : '矢印で送るのは t，c，s であり，秘密の指数そのものは送らない．具体的な式は4.1節で導入する．正直な検証者も，自分が見た情報を記録して分析できる．' }}</p>
  <div class="contrast">
   <div><b>{{ en ? 'Real interaction' : '実際の対話' }}</b><p>t → c → s</p><small>{{ en ? 'Commit before receiving the challenge.' : 'チャレンジを受け取る前にコミットする．' }}</small></div>
   <div><b>{{ en ? 'Honest-verifier simulation' : '正直な検証者の記録のシミュレーション' }}</b><p>(c, s) → t</p><small>{{ en ? 'Choose c and s first; derive t. Output the record in the order (t, c, s).' : 'c と s を先に選び，t を逆算する．出力する記録の並びは (t, c, s)．' }}</small></div>
  </div>
  <p class="note">{{ en ? 'Generating a record in this different order is not the same as responding to a live verifier. This illustration alone does not prove zero-knowledge against malicious verifiers.' : '記録を別の順序で生成できることと，実際の検証者に応答できることは別である．この図だけで悪意ある検証者に対するゼロ知識性を示したことにはならない．' }}</p>
 </figure>
</template>

<style scoped>
.schnorr-overview{margin:28px 0;padding:20px;border:1px solid var(--vp-c-divider);border-radius:16px;background:var(--vp-c-bg-soft);color:var(--vp-c-text-1)}
figcaption{font-weight:700;font-size:1.1rem}.public{border-bottom:1px solid var(--vp-c-divider);padding-bottom:14px}.sequence-scroll{overflow-x:auto}.sequence{display:grid;grid-template-columns:1fr 150px 1fr;gap:12px;min-width:510px}.actor,.step{padding:12px;border:1px solid var(--vp-c-divider);border-radius:10px;line-height:1.65;background:var(--vp-c-bg)}.actor{font-weight:700}.actor small{display:block;font-weight:400;margin-top:5px}.verifier{border-left:3px solid var(--vp-c-brand-1)}.emphasized{background:var(--vp-c-brand-soft)}.time,.message{text-align:center;align-self:center}.message{font-size:.85rem}.message span{display:block;font-size:2.5rem;color:var(--vp-c-brand-1);line-height:1.3}.message small{display:block}.step{font-size:.9rem}.contrast{display:grid;grid-template-columns:1fr 1fr;gap:12px}.contrast>div{padding:14px;border:1px solid var(--vp-c-divider);border-radius:10px}.contrast b{font-size:.9rem}.contrast p{font-size:1.25rem;font-weight:700;margin:8px 0}.note{font-size:.9rem;line-height:1.8}.contrast small{line-height:1.7;display:block}@media(max-width:640px){.schnorr-overview{padding:14px}.contrast{grid-template-columns:1fr}}
</style>
