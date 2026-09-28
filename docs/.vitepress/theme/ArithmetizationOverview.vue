<script setup>
const props = defineProps({ en: Boolean });
const t = (ja, en) => props.en ? en : ja;
</script>

<template>
  <figure id="figure-04-4" class="arith-overview" aria-labelledby="arith-caption">
    <figcaption id="arith-caption"><span>{{ en ? 'Figure' : '図' }} 04-4</span><strong>{{ t('プログラムの正しい実行を，満たすべき制約へ翻訳する', 'Translating correct program execution into constraints') }}</strong></figcaption>
    <section class="ao-box">
      <h3>{{ t('① 何を確認するかを固定する', '① Fix the computation and its claim') }}</h3>
      <p>{{ t('プログラムP，入力長，実行ステップ上限T，整数のビット幅・オーバーフロー規則を決める．', 'Fix program P, input length, step bound T, integer widths, and overflow rules.') }}</p>
      <div class="ao-columns">
        <div><b>{{ t('公開する言明 x', 'Public statement x') }}</b><p>{{ t('公開入力a・期待する出力y．PとTも固定し，検証対象に結び付ける．', 'Public input a and claimed output y. Bind verification to the fixed P and T.') }}</p></div>
        <div><b>{{ t('秘密のウィットネス w', 'Private witness w') }}</b><p>{{ t('秘密入力b．制約用には中間値・実行トレースuも用意する．', 'Private input b. Intermediate values or an execution trace u also supply the constraint assignment.') }}</p></div>
      </div>
      <div class="ao-equation">R(x,w)=1 ⇔ P(a,b)=y {{ t('（規定の範囲・T以内で正常終了）', '(valid ranges; successful termination within T)') }}</div>
    </section>
    <div class="ao-arrow" aria-hidden="true">↓</div>
    <section class="ao-box">
      <h3>{{ t('② 検証計算をブール回路へ展開する', '② Expand the verification computation into a Boolean circuit') }}</h3>
      <p>{{ t('公開値xを固定した回路 Cₓ に，秘密入力wを与える．各配線は0か1であり，受理出力が1になることを要求する．', 'Fix public x in circuit Cₓ. Supply private w, require Boolean wires and an acceptance output of 1.') }}</p>
      <div class="ao-equation">∃w : R(x,w)=1 ⇔ ∃w : Cₓ(w)=1</div>
      <p class="ao-small">{{ t('最小例：P(a,b)=a AND b．計算結果tと公開出力yの一致まで検査する．', 'Minimal example: P(a,b)=a AND b. Check that computed t equals public y.') }}</p>
      <div class="ao-circuit" tabindex="0" :aria-label="t('横にスクロールできるブール回路例', 'Scrollable Boolean circuit example')">
        <svg viewBox="0 0 600 150" role="img" :aria-label="t('公開ビットaと秘密ビットbをANDゲートに入力し，結果tと公開ビットyを一致比較する．一致したときだけ受理出力1となる．', 'Public bit a and private bit b enter AND. Its result t is compared with public bit y by XNOR; acceptance requires output 1.')">
          <g class="ao-wires"><path d="M100 35H165V55H190 M100 90H165V80H190 M272 67H380 M315 125H350V90H380 M485 76H560"/></g>
          <path class="ao-gate" d="M190 35H240A32 32 0 0 1 240 99H190Z"/>
          <rect class="ao-gate" x="380" y="42" width="105" height="65" rx="10"/>
          <g class="ao-label"><text x="10" y="40">a ({{ t('公開', 'public') }})</text><text x="10" y="95">b ({{ t('秘密', 'private') }})</text><text x="225" y="73">AND</text><text x="322" y="58">t</text><text x="230" y="130">y ({{ t('公開', 'public') }})</text><text x="392" y="70">{{ t('一致比較', 'Equality') }}</text><text x="400" y="93">XNOR</text><text x="505" y="65">{{ t('受理', 'Accept') }}</text><text x="512" y="97">= 1</text></g>
        </svg>
      </div>
      <p class="ao-small">{{ t('例：a=1，y=0なら，b=0，t=0は充足割当になる．出力を1とする条件を外すと，目的の計算結果を保証できない．', 'For a=1 and y=0, b=0 and t=0 satisfy the circuit. Omitting the acceptance condition loses the claimed-result guarantee.') }}</p>
    </section>
    <div class="ao-arrow" aria-hidden="true">↓</div>
    <section class="ao-box">
      <h3>{{ t('③ 配線・ゲート・出力を有限体上の制約へ', '③ Encode wires, gates, and outputs over a finite field') }}</h3>
      <div class="ao-equation">t = ab　／　t − y = 0　／　v(v − 1) = 0 (v ∈ {a,b,t,y})</div>
      <p>{{ t('ANDの演算だけでなく，出力の一致とビット条件も含める．同じ配線は同じ変数を使うか，コピーの等式で結ぶ．aとyは公開値に固定する．', 'Encode AND, output equality, and bit constraints. Reuse variables for shared wires or impose copy equalities. Fix a and y to their public values.') }}</p>
      <p class="ao-small">{{ t('一般の整数計算では，範囲・桁上がり・比較・分岐条件も制約化する．有限体のmod pでの一致だけでは，整数としての一致にならない．', 'For integers, also constrain ranges, carries, comparisons, and branches. Equality modulo p alone is not integer equality.') }}</p>
      <div class="ao-equation">∃w : R(x,w)=1 ⇔ ∃(w,u) : {{ t('すべての制約が成立', 'all constraints hold') }}</div>
    </section>
    <div class="ao-arrow" aria-hidden="true">↓</div>
    <section class="ao-box">
      <h3>{{ t('④ 同じ正しさを，目的に合う表現へ', '④ Choose a constraint representation') }}</h3>
      <div class="ao-columns">
        <div><b>R1CS → QAP</b><p>{{ t('変数間の制約を行列にする → 多項式の割り切れ性にまとめる．', 'Matrix constraints between variables → a polynomial divisibility identity.') }}</p></div>
        <div><b>AIR</b><p>{{ t('実行トレースの各行を，遷移制約・境界制約で結ぶ．', 'Connect trace rows through transition and boundary constraints.') }}</p></div>
      </div>
      <p class="ao-small">{{ t('ブール回路は一般性を説明する経路である．実装では算術回路や実行トレースから直接変換してよく，AIRがR1CS/QAPを経由する必要はない．', 'Boolean circuits explain generality. Implementations may start directly from arithmetic circuits or traces; AIR need not pass through R1CS/QAP.') }}</p>
    </section>
    <div class="ao-arrow" aria-hidden="true">↓</div>
    <section class="ao-box">
      <h3>{{ t('⑤ 割当を使って証明し，公開情報で検証する', '⑤ Prove with the assignment; verify against public information') }}</h3>
      <div class="ao-equation">{{ t('証明者：x, w, u → 証明π　→　検証者：x, π, 検証鍵・パラメータ', 'Prover: x, w, u → proof π → Verifier: x, π, verification key / parameters') }}</div>
      <p>{{ t('制約・プログラムと公開入力への結び付けを保証する．多項式検査を使う構成では，次数上限や評価値の正しさも保証し，ランダムなチャレンジを使う場合はその前に多項式を固定する．', 'Bind the proof to the constraints, program, and public inputs. Polynomial tests also need degree bounds and authentic evaluations; when random challenges are used, fix the polynomials beforehand.') }}</p>
      <p class="ao-small">{{ t('充足割当を検査することと，未知の割当を探索することは別である．算術化だけでは，ゼロ知識性・知識の健全性・簡潔性は得られない．それらを満たす証明系が別途必要になる．', 'Checking an assignment differs from searching for one. Arithmetization alone gives neither zero knowledge, knowledge soundness, nor succinctness; these require a suitable proof system.') }}</p>
    </section>
  </figure>
</template>

<style scoped>
.arith-overview{--ao-bg:#f3f7fc;--ao-card:#fff;--ao-ink:#172d48;--ao-line:#91a7bf;--ao-accent:#07685f;margin:32px 0;padding:24px;border:1px solid var(--ao-line);border-radius:18px;background:var(--ao-bg);color:var(--ao-ink);scroll-margin-top:100px}
:global(.dark) .arith-overview{--ao-bg:#19283b;--ao-card:#22364d;--ao-ink:#f1f6fc;--ao-line:#6f849d;--ao-accent:#99ebd8}
figcaption{display:flex;gap:12px;align-items:baseline;margin-bottom:20px}figcaption span{white-space:nowrap;font:700 12px monospace;color:var(--ao-accent)}
.ao-box{padding:16px;border:1px solid var(--ao-line);border-radius:10px;background:var(--ao-card)}.ao-box h3{margin:0 0 10px;border:0;font-size:16px;line-height:1.6}.ao-box p{font-size:14px;line-height:1.8;margin:8px 0}.ao-columns{display:grid;grid-template-columns:1fr 1fr;gap:14px}.ao-columns>div{border-left:3px solid var(--ao-accent);padding-left:12px}.ao-equation{padding:10px;background:var(--ao-bg);border-radius:6px;font-size:14px;overflow-wrap:anywhere;line-height:1.8}.ao-arrow{text-align:center;color:var(--ao-accent);font-size:25px}.ao-small{font-size:13px!important}.ao-circuit{overflow-x:auto}svg{width:100%;min-width:510px;display:block}.ao-wires{stroke:var(--ao-accent);stroke-width:2;fill:none}.ao-gate{stroke:var(--ao-accent);stroke-width:2;fill:var(--ao-bg)}.ao-label{fill:var(--ao-ink);font:14px system-ui,sans-serif}
@media(max-width:600px){.arith-overview{padding:14px}.ao-box{padding:12px}.ao-columns{grid-template-columns:1fr}figcaption{font-size:15px}}
</style>
