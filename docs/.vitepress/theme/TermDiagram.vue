<script setup>
const props = defineProps({ kind: { type: String, required: true }, en: Boolean });
const kind = props.kind;
const en = props.en;
const t = (ja, english) => en ? english : ja;
const figures = {
  np: { id: 'T4-01', title: t('公開入力とウィットネスを関係で結ぶ', 'A relation connects public input and witness'),
    a: t('公開入力 u\n例：35', 'Public input u\ne.g. 35'), b: t('秘密のウィットネス w\n例：3', 'Private witness w\ne.g. 3'), c: t('関係 R を検査\nw³ + w + 5 = u', 'Check relation R\nw³ + w + 5 = u'), d: t('言語 L_R\n有効な w が存在する u', 'Language L_R\ninputs u with some valid w'), note: t('証明対象は u ∈ L_R．w を直接公開せずに示す方法が，この先のゼロ知識証明につながる．', 'The claim is u ∈ L_R. Later, zero-knowledge proofs show this without revealing w.') },
  circuit: { id: 'T4-02', title: t('計算をゲートと配線に分解する', 'Break a computation into gates and wires'),
    a: t('入力 x=3', 'Input x=3'), b: t('t = x × x\n9', 't = x × x\n9'), c: t('s = t × x\n27', 's = t × x\n27'), d: t('y = s + x + 5\n35', 'y = s + x + 5\n35'), note: t('矢印は値の受け渡しを表す．同じ x が複数のゲートに届き，中間値 t と s が後続の計算に使われる．', 'Arrows carry values. The same x feeds multiple gates, and intermediate values t and s feed later operations.') },
  constraints: { id: 'T4-03', title: t('割当がすべての条件を同時に満たすか調べる', 'Check whether one assignment satisfies every condition'),
    a: t('変数への割当\nx=3, t=9, s=27, y=35', 'Variable assignment\nx=3, t=9, s=27, y=35'), b: t('条件1\nx² = t ✓', 'Constraint 1\nx² = t ✓'), c: t('条件2\ntx = s ✓', 'Constraint 2\ntx = s ✓'), d: t('条件3\ns+x+5 = y ✓', 'Constraint 3\ns+x+5 = y ✓'), note: t('一つでも条件を外すと，誤った計算が通ることがある．「条件の書き漏らし」がないかが回路から制約へ移すときの要点．', 'If even one condition is omitted, an incorrect computation may pass. The translation must include every required condition.') },
  reductions: { id: 'T4-04', title: t('帰着は入力を変換し，YES／NOの答えを保つ', 'A reduction transforms inputs and preserves YES/NO'),
    a: t('問題 A の入力 u\n答えは未知', 'Problem A input u\nanswer unknown'), b: t('多項式時間の変換 f\nv = f(u)', 'Polynomial-time map f\nv = f(u)'), c: t('問題 B の入力 v\n既知の解法を使う', 'Problem B input v\nuse its solver'), d: t('答えが一致\nu∈A ⇔ f(u)∈B', 'Same answer\nu∈A ⇔ f(u)∈B'), note: t('A を B に帰着できれば，B の解法を使って A を解ける．向きは「難しい問題 A から，解法のある B へ」．', 'If A reduces to B, a solver for B can solve A. The direction is from A to the problem B whose solver is available.') },
  complexity: { id: 'T4-05', title: t('同じ仕事量でも，依存の深さは変えられる', 'The same amount of work can have different dependency depth'),
    note: t('8個の値を二項加算で合計する例．どちらも7ゲート（サイズ7）だが，左から順に計算する鎖は深さ7，並列にまとめる木は深さ3．NCは多項式サイズかつ polylog 深さの回路族を扱う．', 'Example: add eight values with binary gates. Both circuits use 7 gates (size 7), but the left-to-right chain has depth 7 while the balanced tree has depth 3. NC studies polynomial-size circuit families with polylogarithmic depth.') },
  linear: { id: 'T4-06', title: t('行列の各行が，変数の線形結合を選ぶ', 'Each matrix row selects a linear combination of variables'),
    a: t('変数ベクトル z\n(1, x, t, s, y)', 'Variable vector z\n(1, x, t, s, y)'), b: t('A z\n(x, t, 5+x+s)', 'A z\n(x, t, 5+x+s)'), c: t('B z\n(x, x, 1)', 'B z\n(x, x, 1)'), d: t('要素ごとに積を取り\n(Az)∘(Bz) = Cz', 'Multiply entrywise\n(Az)∘(Bz) = Cz'), note: t('各行が一つの条件に対応する．∘ は行列積ではなく，同じ位置の要素同士の積．', 'Each row represents one constraint. The symbol ∘ means entrywise multiplication, not matrix multiplication.') },
  polynomials: { id: 'T4-07', title: t('制約点での値を補間し，条件を一つの割り切れ性にまとめる', 'Interpolate constraint values and combine them as divisibility'),
    a: t('制約点と値\n(1, F(1)=0)\n(2, F(2)=0)', 'Constraint points\n(1, F(1)=0)\n(2, F(2)=0)'), b: t('消失多項式\nZ(X)=(X−1)(X−2)', 'Vanishing polynomial\nZ(X)=(X−1)(X−2)'), c: t('すべての点で F=0\n⇔ Z が F を割る', 'F vanishes at all points\n⇔ Z divides F'), d: t('QAP の形\nF(X)=H(X)Z(X)', 'QAP form\nF(X)=H(X)Z(X)'), note: t('制約点での評価がすべて0であることと，その点を根に持つ Z(X) で割り切れることが同値．次数の条件も含めて検査する．', 'Vanishing at every constraint point is equivalent to divisibility by Z(X), whose roots are those points. Degree bounds are also part of the check.') },
  trace: { id: 'T4-08', title: t('実行トレースは状態・遷移・境界の表', 'An execution trace records states, transitions and boundaries'),
    a: t('初期状態\na₀ = 2', 'Initial state\na₀ = 2'), b: t('次の状態\na₁ = a₀² = 4', 'Next state\na₁ = a₀² = 4'), c: t('次の状態\na₂ = a₁² = 16', 'Next state\na₂ = a₁² = 16'), d: t('最終状態\na₃ = 54', 'Final state\na₃ = 54'), note: t('遷移条件 aᵢ₊₁=aᵢ² は隣の行を結び，境界条件は開始値と終了値を固定する．最後の行から最初の行へ遷移を誤って課さない．', 'The transition aᵢ₊₁=aᵢ² links adjacent rows; boundary constraints fix the start and end. Do not accidentally impose a transition from the final row back to the first.') },
};
const figure = figures[props.kind];
</script>

<template>
  <figure v-if="figure" class="term-diagram" :aria-labelledby="`term-${figure.id}`">
    <figcaption :id="`term-${figure.id}`"><span class="number">{{ t('図', 'Figure') }} {{ figure.id }}</span><strong>{{ figure.title }}</strong></figcaption>
    <div v-if="kind === 'complexity'" class="comparison">
      <section><h3>{{ t('直列の鎖', 'Serial chain') }}</h3><div class="chain"><span>a₁</span><i>＋</i><span>a₂</span><i>＋</i><span>a₃</span><i>＋ … ＋ <b>a₈</b></i><small>{{ t('7ゲート・深さ7', '7 gates · depth 7') }}</small></div></section>
      <section><h3>{{ t('並列の木', 'Balanced tree') }}</h3><div class="tree"><span>a₁+a₂　a₃+a₄　a₅+a₆　a₇+a₈</span><span>↘　↙　　 ↘　↙</span><span>(a₁+a₂)+(a₃+a₄)　 (a₅+a₆)+(a₇+a₈)</span><span>↘　　　　　　 ↙</span><b>合計</b><small>{{ t('7ゲート・深さ3', '7 gates · depth 3') }}</small></div></section>
    </div>
    <div v-else-if="kind === 'linear'" class="matrix-flow">
      <div class="card variables"><span>{{ figure.a }}</span></div>
      <div class="arrow matrix-arrow" aria-hidden="true">→</div>
      <div class="matrix-branches">
        <div class="card"><span>{{ t('A z\n線形結合の列', 'A z\nlinear combinations') }}</span></div>
        <div class="card"><span>{{ t('B z\n線形結合の列', 'B z\nlinear combinations') }}</span></div>
        <div class="card"><span>{{ t('C z\n右辺の列', 'C z\nright-hand side') }}</span></div>
      </div>
      <div class="check-equation"><span>{{ t('各行で左の二つを要素ごとに掛ける', 'Multiply the first two entries row by row') }}</span><b>(A z) ∘ (B z) = C z</b></div>
    </div>
    <div v-else class="flow">
      <div class="card"><span>{{ figure.a }}</span></div><div class="arrow" aria-hidden="true">→</div>
      <div v-if="kind === 'np'" class="card secret"><span>{{ figure.b }}</span></div><div v-else class="card"><span>{{ figure.b }}</span></div><div class="arrow" aria-hidden="true">→</div>
      <div class="card"><span>{{ figure.c }}</span></div><div class="arrow" aria-hidden="true">→</div><div class="card outcome"><span>{{ figure.d }}</span></div>
    </div>
    <p class="note">{{ figure.note }}</p>
  </figure>
</template>

<style scoped>
.term-diagram{--ink:#172d48;--muted:#405570;--line:#9aadc1;--paper:#f3f7fc;--card:#fff;--accent:#075e72;--tint:#e1f2f5;color:var(--ink);background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:22px;margin:28px 0}:global(.dark) .term-diagram{--ink:#f1f6fc;--muted:#c7d6e6;--line:#70859e;--paper:#19283b;--card:#22364d;--accent:#83d6e5;--tint:#183b48}figcaption{display:flex;align-items:baseline;gap:12px;margin:0 0 18px;line-height:1.6;font-size:17px;flex-wrap:wrap}.number{font:700 16px/1.5 monospace;color:var(--accent);white-space:nowrap}.flow{display:grid;grid-template-columns:minmax(100px,1fr) 28px minmax(100px,1fr) 28px minmax(100px,1fr) 28px minmax(120px,1.15fr);gap:7px;align-items:stretch}.card{display:flex;justify-content:center;align-items:center;min-height:88px;padding:12px 9px;text-align:center;white-space:pre-line;background:var(--card);border:1px solid var(--line);border-radius:12px;font-size:14px;line-height:1.65;font-weight:600}.card.secret{border-style:dashed;background:var(--tint)}.card.outcome{background:var(--tint);border-color:var(--accent)}.arrow{align-self:center;text-align:center;font-size:23px;color:var(--accent)}.note{margin:16px 0 0!important;color:var(--muted);font-size:14px!important;line-height:1.8!important}.comparison{display:grid;grid-template-columns:1fr 1fr;gap:16px}.comparison section{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px}.comparison h3{margin:0 0 9px!important;font-size:15px!important}.chain,.tree{min-height:105px;display:flex;justify-content:center;align-items:center;gap:5px;flex-wrap:wrap;text-align:center;font-size:14px}.chain span{border:1px solid var(--line);border-radius:6px;padding:5px}.chain i{font-style:normal;color:var(--accent)}.chain small,.tree small{flex-basis:100%;color:var(--muted);font-weight:700}.tree{display:flex;flex-direction:column;gap:1px;font-size:12px}.tree b{font-size:17px;color:var(--accent)}.matrix-flow{display:grid;grid-template-columns:minmax(130px,.8fr) 30px minmax(300px,2fr);gap:12px;align-items:center}.variables{grid-row:1 / span 2}.matrix-arrow{grid-row:1 / span 2}.matrix-branches{grid-column:3;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.check-equation{grid-column:3;display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 12px;background:var(--tint);border-radius:9px;font-size:13px}.check-equation b{font-size:17px;white-space:nowrap;color:var(--accent)}@media(max-width:720px){.flow{grid-template-columns:1fr 22px 1fr;gap:8px}.flow .arrow:nth-of-type(4){display:none}.flow .arrow:nth-of-type(6){display:none}.flow .card:nth-of-type(5),.flow .card:nth-of-type(7){grid-column:span 1}.comparison{grid-template-columns:1fr}.matrix-flow{grid-template-columns:1fr}.variables{grid-row:auto}.matrix-arrow{transform:rotate(90deg)}.matrix-branches{grid-column:1;grid-template-columns:1fr}.check-equation{grid-column:1;flex-direction:column;text-align:center}.term-diagram{padding:16px 12px}}@media(max-width:430px){.flow{grid-template-columns:1fr}.flow .arrow{transform:rotate(90deg);height:18px}.flow .arrow:nth-of-type(4),.flow .arrow:nth-of-type(6){display:block}.card{min-height:64px}}
</style>
