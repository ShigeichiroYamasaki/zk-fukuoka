// Bilingual, lecture-specific diagrams. Numeric examples are checked in scripts/check-lecture-diagrams.mjs.
export const diagrams = {
  "02-1": {
    "section": "2.2",
    "type": "compare",
    "title": [
      "確率変数 X と Y：記録全体の分布を比較する",
      "Random variables X and Y: compare distributions of the whole record"
    ],
    "top": [
      "固定するもの：V*，有効な組 (x, w) ∈ R，補助入力 z\nx や w をランダムに選んで平均するのではない．",
      "Fix V*, a valid pair (x, w) ∈ R, and auxiliary input z.\nDo not sample and average over x or w."
    ],
    "nodes": [
      {
        "title": [
          "実際の対話 → 確率変数 X",
          "Real interaction → random variable X"
        ],
        "body": [
          "P は x, w を，V* は x, z を使う．\n乱数 r_P と r_V を独立に選ぶ．\nX は V* の view：公開入力・補助入力・自分の乱数・受信メッセージの記録全体．",
          "P uses x, w; V* uses x, z.\nSample r_P and r_V independently.\nX is V*’s view: public and auxiliary inputs, its own randomness, and received messages."
        ],
        "formula": "X = (x, z, r_V, m₁, …, m_k)"
      },
      {
        "title": [
          "シミュレーション → 確率変数 Y",
          "Simulation → random variable Y"
        ],
        "body": [
          "S は x, z と独自の乱数 r_S を使う．\nw は与えない．\nY は X と同じ形式で生成した記録．\n同じ S で，すべての有効な w に対応する．",
          "S uses x, z and its own randomness r_S.\nIt receives no w.\nY is a generated record in the same format as X.\nOne S must work for every valid w."
        ],
        "formula": "Y = S(x, z; r_S)"
      }
    ],
    "bottom": [
      "比べる量：各記録 t の出現確率 Pr[X = t] と Pr[Y = t]\n\n完全ゼロ知識：すべての t で出現確率が一致\n統計的ゼロ知識：統計距離 Δ(X, Y) ≤ negl(n)\n計算量的ゼロ知識：任意の効率的な識別者 D について\n|Pr[D(x, z, X) = 1] − Pr[D(x, z, Y) = 1]| ≤ negl(n)",
      "Compare each record’s probability: Pr[X = t] versus Pr[Y = t]\n\nPerfect ZK: equal probabilities for every t\nStatistical ZK: statistical distance Δ(X, Y) ≤ negl(n)\nComputational ZK: for every efficient distinguisher D,\n|Pr[D(x, z, X) = 1] − Pr[D(x, z, Y) = 1]| ≤ negl(n)"
    ],
    "note": [
      "本文と同じく n = |x|．確率は記録生成の乱数について取り，識別時は D の乱数も含める．受理・拒否だけでなく view 全体の分布を比較する．個々の実行で X と Y が同じ値になることは要求しない．",
      "As in the text, n = |x|. Probabilities are over record-generation randomness, plus D’s randomness when distinguishing. Compare the entire view, not only acceptance. Individual executions need not produce equal records."
    ]
  },
  "02-4": {
    "section": "3.3",
    "type": "compare",
    "title": [
      "受理と抽出：異なる実験・異なる確率変数",
      "Acceptance and extraction: different experiments and random variables"
    ],
    "top": [
      "固定：公開入力 x と，私的情報を含む証明者 P* の戦略\nP* がウィットネスを持つことは，あらかじめ仮定しない．",
      "Fix public input x and prover strategy P*, including its private information.\nDo not assume that P* starts with a witness."
    ],
    "nodes": [
      {
        "title": [
          "実際の対話：P* ↔ V",
          "Real interaction: P* ↔ V"
        ],
        "body": [
          "P* と V の乱数を選んで対話する．\nV が出す結果：受理または拒否．\nA_x は判定の0・1変数．",
          "Sample prover and verifier randomness and interact.\nV outputs accept or reject.\nA_x is the binary decision variable."
        ],
        "formula": "p_{P*}(x) = Pr[A_x = 1]"
      },
      {
        "title": [
          "抽出実験：E ↔ P*",
          "Extraction experiment: E ↔ P*"
        ],
        "body": [
          "E が検証者の役を実行し，P* を呼び出す．\nこのモデルでは再実行・巻き戻しが可能．\nE の出力 W：有効な w′ または ⊥．\nB は (x, W) ∈ R なら1，失敗なら0．",
          "E emulates a verifier and invokes P*.\nThis model permits reruns and rewinding.\nOutput W: valid witness w′ or failure ⊥.\nB = 1 for (x, W) ∈ R; otherwise B = 0."
        ],
        "formula": "W = E_T^{P*}(x); e_{P*}(x,T) = Pr[B = 1]"
      }
    ],
    "bottom": [
      "知識の健全性：受理確率 p が知識誤差 κ を超えるとき，\n差 p − κ と抽出成功確率・計算時間を結び付ける．\np と e は，同じ確率ではない．",
      "Knowledge soundness: when acceptance p exceeds knowledge error κ,\nrelate p − κ to extraction success and runtime.\np and e are not the same probability."
    ],
    "note": [
      "E は通常の対話の第三の参加者ではなく，安全性の証明で構成するアルゴリズム．巻き戻しでは乱数を共有するため，応答は一般に独立ではない．第2節の S は記録を出すが，E はウィットネスを出す．",
      "E is an algorithm in the security proof, not a third participant in normal interaction. Rewound responses share randomness and need not be independent. Section 2’s S outputs a record; E outputs a witness."
    ]
  },
  "02-2": {
    "section": "4.1",
    "type": "flow",
    "title": [
      "Schnorr：言明・ウィットネスから検証と抽出へ",
      "Schnorr: from statement and witness to verification and extraction"
    ],
    "lead": [
      "公開入力 x = (G, q, g, y) と秘密の指数 w の関係は y = gʷ．例：p = 23，q = 11，g = 2，y = 8，w = 3．",
      "Public input x = (G, q, g, y) and secret exponent w satisfy y = gʷ. Example: p = 23, q = 11, g = 2, y = 8, w = 3."
    ],
    "nodes": [
      {
        "title": [
          "言明とウィットネス",
          "Statement and witness"
        ],
        "body": [
          "言明：公開値 y の離散対数を知っている．\nウィットネス：指数 w．関係 R_DL：y = gʷ．",
          "Claim: know the discrete logarithm of public y.\nWitness: exponent w. Relation R_DL: y = gʷ."
        ]
      },
      {
        "title": [
          "二つの代数構造を結ぶ",
          "Connect two algebraic structures"
        ],
        "body": [
          "指数の加算 a + b（mod q）→ 群の乗算 gᵃgᵇ．\nφ(a) = gᵃ，φ(a + b) = φ(a)φ(b)．",
          "Exponent addition a + b (mod q) → group multiplication gᵃgᵇ.\nφ(a) = gᵃ; φ(a + b) = φ(a)φ(b)."
        ]
      },
      {
        "title": [
          "証明者 P ↔ 検証者 V",
          "Prover P ↔ verifier V"
        ],
        "body": [
          "P → V：t = gʳ ／ V → P：c ／ P → V：s = r + cw．\nV は gˢ = tyᶜ を検査．例：r = 4，t = 16，c = 2，s = 10．両辺は 12（mod 23）．",
          "P → V: t = gʳ / V → P: c / P → V: s = r + cw.\nV checks gˢ = tyᶜ. Example: r = 4, t = 16, c = 2, s = 10. Both sides are 12 (mod 23)."
        ]
      },
      {
        "title": [
          "抽出者 E：同じ t の二つの受理式を割る",
          "Extractor E: divide two accepting equations for the same t"
        ],
        "body": [
          "gˢ¹ = tyᶜ¹ と gˢ² = tyᶜ² → g⁽ˢ¹⁻ˢ²⁾ = y⁽ᶜ¹⁻ᶜ²⁾．\nw′ = (s₁ − s₂)(c₁ − c₂)⁻¹ mod q → gʷ′ = y．\n例：(c₁, s₁) = (2, 10)，(c₂, s₂) = (5, 8) → w′ = 3．",
          "gˢ¹ = tyᶜ¹ and gˢ² = tyᶜ² → g⁽ˢ¹⁻ˢ²⁾ = y⁽ᶜ¹⁻ᶜ²⁾.\nw′ = (s₁ − s₂)(c₁ − c₂)⁻¹ mod q → gʷ′ = y.\nExample: (c₁, s₁) = (2, 10), (c₂, s₂) = (5, 8) → w′ = 3."
        ]
      }
    ],
    "note": [
      "指数 w, r, c, s の演算は mod q．この例の群の乗算は mod p．二つの受理記録は同じ t と異なる c を要する．小さい数は説明用であり，通常の対話で r を再利用しない．",
      "Exponent arithmetic (w, r, c, s) is modulo q; group multiplication in this example is modulo p. Extraction requires the same t and distinct c. These small values are illustrative; never reuse r in normal interactions."
    ]
  },

  "03-1": {
    "section": "2.3",
    "type": "flow",
    "title": [
      "法7の演算：逆元を掛けて割る",
      "Arithmetic modulo 7: divide by multiplying an inverse"
    ],
    "note": [
      "0には逆元がない．有限体の要素と，その乗法群の指数を区別する．",
      "Zero has no inverse. Distinguish field elements from exponents in its multiplicative group."
    ],
    "nodes": [
      {
        "title": [
          "余りで表す",
          "Represent by remainders"
        ],
        "body": [
          "5 + 4 = 9 ≡ 2 mod 7",
          "5 + 4 = 9 ≡ 2 mod 7"
        ]
      },
      {
        "title": [
          "積が1になる相手を探す",
          "Find a multiplier giving 1"
        ],
        "body": [
          "3 × 5 = 15 ≡ 1 mod 7 → 3⁻¹ = 5",
          "3 × 5 = 15 ≡ 1 mod 7 → 3⁻¹ = 5"
        ]
      },
      {
        "title": [
          "除算に使う",
          "Use the inverse for division"
        ],
        "body": [
          "2 ÷ 3 = 2 × 5 ≡ 3 mod 7",
          "2 ÷ 3 = 2 × 5 ≡ 3 mod 7"
        ]
      }
    ]
  },
  "03-2": {
    "section": "3.3",
    "type": "scatter",
    "title": [
      "有限体の多項式は，評価点の表としても読める",
      "Read a finite-field polynomial as an evaluation table"
    ],
    "note": [
      "F₇上のf(X)=X²+1．実数の放物線ではないため，点を曲線で結んでいない．次数2以下なら，相異なる3点の値が多項式を一意に定める．",
      "f(X)=X²+1 over F₇. Points are not joined: this is not a real-valued parabola. Three distinct evaluations uniquely determine a polynomial of degree at most 2."
    ],
    "maxX": 6,
    "maxY": 6,
    "ticksX": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "ticksY": [
      0,
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "alt": [
      "xが0から6のときyは1,2,5,3,3,5,2となる離散点．",
      "Discrete points: for x from 0 to 6, y is 1,2,5,3,3,5,2."
    ],
    "series": [
      {
        "label": "f(x) = x² + 1 mod 7",
        "points": [
          [
            0,
            1
          ],
          [
            1,
            2
          ],
          [
            2,
            5
          ],
          [
            3,
            3
          ],
          [
            4,
            3
          ],
          [
            5,
            5
          ],
          [
            6,
            2
          ]
        ]
      }
    ]
  },
  "03-3": {
    "section": "4.3",
    "type": "bars",
    "title": [
      "標本集合を大きくすると，誤受理の上界が下がる",
      "A larger sample set lowers the false-acceptance bound"
    ],
    "note": [
      "全次数d=2の非零多項式に対するSchwartz–Zippelの上界．各座標を独立一様に選ぶ．実測値ではなく理論上界であり，多項式は点の選択前に固定する．",
      "Schwartz–Zippel bounds for a fixed nonzero polynomial of total degree d=2, with independent uniform coordinates. These are theoretical bounds, not measurements; the polynomial is fixed before sampling."
    ],
    "max": 100,
    "axis": [
      "誤って0と判定する確率の上界",
      "Upper bound on a false zero result"
    ],
    "bars": [
      {
        "label": "|S| = 7",
        "value": 28.57
      },
      {
        "label": "|S| = 17",
        "value": 11.76
      },
      {
        "label": "|S| = 31",
        "value": 6.45
      }
    ]
  },
  "04-1": {
    "section": "3.3",
    "type": "flow",
    "title": [
      "x³+x+5=35を，途中の値の制約へ分ける",
      "Split x³+x+5=35 into constraints on intermediate values"
    ],
    "note": [
      "x=3の計算例．加算も出力条件も含めて制約を満たす必要がある．実際のR1CSでは各式を二つの線形結合の積の形へ書く．",
      "Worked example with x=3. Addition and the output condition must also hold. Each relation is written as a product of linear combinations in R1CS."
    ],
    "nodes": [
      {
        "title": [
          "二乗を作る",
          "Square"
        ],
        "body": [
          "u = x × x → u = 9",
          "u = x × x → u = 9"
        ]
      },
      {
        "title": [
          "三乗を作る",
          "Cube"
        ],
        "body": [
          "v = u × x → v = 27",
          "v = u × x → v = 27"
        ]
      },
      {
        "title": [
          "出力を固定する",
          "Constrain the output"
        ],
        "body": [
          "(v + x + 5) × 1 = 35",
          "(v + x + 5) × 1 = 35"
        ]
      }
    ]
  },
  "04-2": {
    "section": "4.2",
    "type": "flow",
    "title": [
      "R1CSからQAPへ：行の検査を割り切れ性へ",
      "R1CS to QAP: row checks become divisibility"
    ],
    "note": [
      "割り切れ性の表現だけでは暗号学的な証明は完成しない．次数の制限と，評価値が固定された多項式に対応することの保証も必要になる．",
      "Divisibility alone is not a cryptographic proof. Degree bounds and guarantees tying evaluations to fixed polynomials are also needed."
    ],
    "nodes": [
      {
        "title": [
          "R1CSの行",
          "R1CS rows"
        ],
        "body": [
          "各行jで A(z)ⱼ B(z)ⱼ = C(z)ⱼ",
          "For each row j: A(z)ⱼ B(z)ⱼ = C(z)ⱼ"
        ]
      },
      {
        "title": [
          "評価点に対応づける",
          "Assign evaluation points"
        ],
        "body": [
          "相異なるrⱼで列をLagrange補間する",
          "Interpolate columns at distinct points rⱼ"
        ]
      },
      {
        "title": [
          "一つの多項式関係へ",
          "One polynomial relation"
        ],
        "body": [
          "A(X)B(X) − C(X) = H(X)Z(X)\nZ(X) = ∏ⱼ(X − rⱼ)",
          "A(X)B(X) − C(X) = H(X)Z(X)\nZ(X) = ∏ⱼ(X − rⱼ)"
        ]
      }
    ]
  },
  "04-3": {
    "section": "5.2",
    "type": "matrix",
    "title": [
      "AIR：時間を行にして，状態の変化を検査する",
      "AIR: rows track time and constraints check transitions"
    ],
    "note": [
      "F₁₇上でsₜ₊₁=sₜ²，初期値s₀=3を例にしたトレース．遷移制約は隣り合う行，境界制約は指定した行に課す．",
      "Example trace over F₁₇ with sₜ₊₁=sₜ² and s₀=3. Transition constraints link adjacent rows; boundary constraints apply to specified rows."
    ],
    "headers": [
      [
        "時刻t",
        "Time t"
      ],
      [
        "状態sₜ",
        "State sₜ"
      ],
      [
        "確認する関係",
        "Relation to check"
      ]
    ],
    "rows": [
      [
        "0",
        "3",
        [
          "初期境界：s₀=3",
          "Initial boundary: s₀=3"
        ]
      ],
      [
        "1",
        "9",
        "9 ≡ 3² mod 17"
      ],
      [
        "2",
        "13",
        "13 ≡ 9² mod 17"
      ],
      [
        "3",
        "16",
        [
          "16 ≡ 13² mod 17／最終境界：s₃=16",
          "16 ≡ 13² mod 17 / final boundary: s₃=16"
        ]
      ]
    ]
  },
  "05-1": {
    "section": "2.3",
    "type": "matrix",
    "title": [
      "RS符号の距離を，5個の評価値で確かめる",
      "See RS distance in five evaluations"
    ],
    "note": [
      "F₇，次数<2，評価点0〜4のRS符号．n=5，d=2なので最小距離は4，一意訂正は1誤りまで．二つの表示符号語も4箇所で異なる．",
      "RS code over F₇ of degree <2, evaluated at 0–4. With n=5 and d=2, minimum distance is 4 and one error is uniquely correctable. The two displayed codewords differ in four positions."
    ],
    "headers": [
      [
        "評価点x",
        "Evaluation x"
      ],
      "0",
      "1",
      "2",
      "3",
      "4"
    ],
    "rows": [
      [
        "f(x)=2x+1",
        "1",
        "3",
        "5",
        "0",
        "2"
      ],
      [
        "g(x)=1",
        "1",
        "1",
        "1",
        "1",
        "1"
      ],
      [
        [
          "一致？",
          "Match?"
        ],
        "✓",
        "×",
        "×",
        "×",
        "×"
      ]
    ]
  },
  "05-2": {
    "section": "3.2",
    "type": "compare",
    "title": [
      "ノイズのモデルと，不正のモデルを分ける",
      "Separate noise models from adversarial models"
    ],
    "note": [
      "検証者の乱数は，不正な証明者のデータに対する検査をランダム化するために使う．不正そのものを自然なランダム誤りと仮定するわけではない．",
      "Verifier randomness randomizes checks on adversarial data; it does not assume cheating behaves like natural random noise."
    ],
    "nodes": [
      {
        "title": [
          "Shannon的な見方",
          "Shannon perspective"
        ],
        "body": [
          "通信路の確率モデルを置く．レートと復号失敗確率を考える．",
          "Specify a probabilistic channel. Study rate and decoding failure probability."
        ]
      },
      {
        "title": [
          "Hamming的な見方",
          "Hamming perspective"
        ],
        "body": [
          "誤りの位置・内容を最悪ケースで考える．距離と訂正能力を調べる．",
          "Allow worst-case error locations and values. Study distance and error correction."
        ]
      }
    ]
  },
  "05-3": {
    "section": "4.2",
    "type": "compare",
    "title": [
      "一意復号とリスト復号：出力に何を要求するか",
      "Unique versus list decoding: what must be returned?"
    ],
    "note": [
      "概念の整理．候補リストを許すだけで任意の誤りを訂正できるわけではない．許容距離とリストサイズの条件が必要．FRIの検証者が毎回復号を実行するという意味でもない．",
      "Conceptual comparison. Allowing a list does not correct arbitrary corruption: radius and list-size conditions are required. FRI verification does not run a decoder at every query."
    ],
    "top": [
      "受信した，誤りを含むかもしれない語",
      "Received word, possibly corrupted"
    ],
    "nodes": [
      {
        "title": [
          "一意復号",
          "Unique decoding"
        ],
        "body": [
          "保証される半径内で，元の符号語を一つに定める．",
          "Within the guaranteed radius, identify one codeword."
        ]
      },
      {
        "title": [
          "リスト復号",
          "List decoding"
        ],
        "body": [
          "指定半径内の候補を，サイズを制限したリストとして返す．",
          "Return a bounded list of codewords within a specified radius."
        ]
      }
    ]
  },
  "06-1": {
    "section": "2.2",
    "type": "flow",
    "title": [
      "FRI：次数上限を半分ずつにする",
      "FRI: halve the degree bound at each step"
    ],
    "note": [
      "乗法的FRIの手順．各段階で表を固定してから新しいチャレンジを得る．近接性と折り畳みの一貫性を検査するのであって，表を半分捨てるだけではない．",
      "Schematic multiplicative FRI. Fix each table before receiving its new challenge. Check proximity and folding consistency; this is not simply discarding half a table."
    ],
    "nodes": [
      {
        "title": [
          "最初の表",
          "Initial table"
        ],
        "body": [
          "deg f < 16：偶数項と奇数項に分解",
          "deg f < 16: split even and odd terms"
        ]
      },
      {
        "title": [
          "ランダムな結合で折り畳む",
          "Fold with a random combination"
        ],
        "body": [
          "f′ = f_even + α f_odd → 次数上限 8",
          "f′ = f_even + α f_odd → degree bound 8"
        ]
      },
      {
        "title": [
          "繰り返す",
          "Repeat"
        ],
        "body": [
          "8 → 4 → 2 → 1（定数多項式）",
          "8 → 4 → 2 → 1 (constant polynomial)"
        ]
      }
    ]
  },
  "06-2": {
    "section": "3.2",
    "type": "bars",
    "title": [
      "繰り返し回数と健全性誤差の関係",
      "Repetition count and soundness error"
    ],
    "note": [
      "各試行で誤受理確率≤1/2，かつ適切な独立性・繰り返し定理の条件を満たし，全試行の受理を要求する例．一般の対話プロトコルに無条件でこの曲線を適用できない．",
      "Example where each false-acceptance probability is ≤1/2, the necessary independence/repetition conditions hold, and all trials must accept. This bound does not apply unconditionally to arbitrary interactive protocols."
    ],
    "max": 100,
    "axis": [
      "上界 (1/2)ᵏ",
      "Bound (1/2)ᵏ"
    ],
    "bars": [
      {
        "label": "k = 1",
        "value": 50
      },
      {
        "label": "k = 2",
        "value": 25
      },
      {
        "label": "k = 4",
        "value": 6.25
      },
      {
        "label": "k = 8",
        "value": 0.390625
      }
    ]
  },
  "06-3": {
    "section": "4.2",
    "type": "compare",
    "title": [
      "巻き戻し：同じ状態からチャレンジを変える",
      "Rewinding: change the challenge from the same state"
    ],
    "note": [
      "安全性証明内で敵対者を再実行する技法．現実の相手を時間的に巻き戻す操作ではない．Forking lemmaではランダムオラクルへの応答を変える条件も扱う．",
      "A technique for rerunning an adversary inside a security proof, not literally rewinding a remote party. Forking lemmas also address conditions for changing random-oracle answers."
    ],
    "top": [
      "同じ乱数・同じコミットまでの実行状態",
      "Same randomness and state up to the commitment"
    ],
    "nodes": [
      {
        "title": [
          "実行1",
          "Run 1"
        ],
        "body": [
          "チャレンジc₁ → 応答s₁",
          "Challenge c₁ → response s₁"
        ]
      },
      {
        "title": [
          "実行2",
          "Run 2"
        ],
        "body": [
          "異なるc₂ → 応答s₂",
          "Different c₂ → response s₂"
        ]
      }
    ],
    "bottom": [
      "二つの受理記録と抽出条件から，ウィットネスを取り出す",
      "Use two accepting records and extraction conditions to recover a witness"
    ]
  },
  "07-1": {
    "section": "1.2",
    "type": "scatter",
    "title": [
      "有限体上の楕円曲線は，離散的な点の集合",
      "An elliptic curve over a finite field is a discrete set"
    ],
    "note": [
      "F₁₇上のy²=x³+2x+2を満たす18個の有限点．これに無限遠点Oを加えて群を作る．実数上の滑らかな曲線とは異なり，点を結んでいない．この小さな曲線は学習用で，暗号用途ではない．",
      "The 18 affine points of y²=x³+2x+2 over F₁₇. Add the point at infinity O to obtain the group. Unlike a smooth real curve, the points are not joined. This tiny curve is educational, not cryptographically secure."
    ],
    "maxX": 16,
    "maxY": 16,
    "ticksX": [
      0,
      4,
      8,
      12,
      16
    ],
    "ticksY": [
      0,
      4,
      8,
      12,
      16
    ],
    "alt": [
      "法17で楕円曲線の方程式を満たす18点の散布図．座標の一覧も下に示す．",
      "Scatterplot of 18 points satisfying the elliptic-curve equation modulo 17, with coordinates listed below."
    ],
    "series": [
      {
        "label": "y² = x³ + 2x + 2 mod 17",
        "points": [
          [
            0,
            6
          ],
          [
            0,
            11
          ],
          [
            3,
            1
          ],
          [
            3,
            16
          ],
          [
            5,
            1
          ],
          [
            5,
            16
          ],
          [
            6,
            3
          ],
          [
            6,
            14
          ],
          [
            7,
            6
          ],
          [
            7,
            11
          ],
          [
            9,
            1
          ],
          [
            9,
            16
          ],
          [
            10,
            6
          ],
          [
            10,
            11
          ],
          [
            13,
            7
          ],
          [
            13,
            10
          ],
          [
            16,
            4
          ],
          [
            16,
            13
          ]
        ]
      }
    ]
  },
  "07-2": {
    "section": "2.3",
    "type": "flow",
    "title": [
      "ペアリングで，指数の積を扱う",
      "Pairings expose a product in the exponent"
    ],
    "note": [
      "G₁とG₂は加法表記，G_Tは乗法表記．aやbを復元する手順ではなく，群で符号化された値の関係を検証する能力を示す．",
      "G₁ and G₂ use additive notation; G_T uses multiplicative notation. This does not recover a or b: it enables checking relations between encoded values."
    ],
    "nodes": [
      {
        "title": [
          "二つの群の入力",
          "Inputs from two groups"
        ],
        "body": [
          "aP ∈ G₁，bQ ∈ G₂",
          "aP ∈ G₁, bQ ∈ G₂"
        ]
      },
      {
        "title": [
          "双線形写像を適用",
          "Apply the bilinear map"
        ],
        "body": [
          "e(aP, bQ)",
          "e(aP, bQ)"
        ]
      },
      {
        "title": [
          "対象群の関係",
          "Relation in the target group"
        ],
        "body": [
          "e(aP, bQ) = e(P, Q)ᵃᵇ ∈ G_T",
          "e(aP, bQ) = e(P, Q)ᵃᵇ ∈ G_T"
        ]
      }
    ]
  },
  "07-3": {
    "section": "4.1",
    "type": "flow",
    "title": [
      "還元証明は，攻撃者を別の問題の解法へ変える",
      "A reduction turns an attacker into a solver"
    ],
    "note": [
      "安全性は仮定・モデル・還元の損失とともに読む．DL，q-SDH，KEAを一列の単純な強弱ランキングを示すものではない．",
      "Read security together with its assumption, model and reduction loss. DL, q-SDH and KEA are not a simple linear ranking."
    ],
    "nodes": [
      {
        "title": [
          "仮にプロトコルを破るAがあれば",
          "Suppose an attacker A breaks the protocol"
        ],
        "body": [
          "その入力・出力を利用する",
          "Use A’s inputs and outputs"
        ]
      },
      {
        "title": [
          "還元アルゴリズムBを構成",
          "Construct reduction B"
        ],
        "body": [
          "Aを部品として困難な問題を解く",
          "Use A as a subroutine to solve a hard problem"
        ]
      },
      {
        "title": [
          "困難性仮定と矛盾するか調べる",
          "Compare with the hardness assumption"
        ],
        "body": [
          "Bの計算量と成功確率を評価する",
          "Account for B’s runtime and success probability"
        ]
      }
    ]
  },
  "08-1": {
    "section": "1.5",
    "type": "compare",
    "title": [
      "拘束性と隠蔽性は，別々に必要になる",
      "Binding and hiding are separate requirements"
    ],
    "note": [
      "拘束性を示しただけでは隠蔽性は得られない．多項式コミットメントでは，さらに点での評価の正しさを検証する機能を考える．",
      "Binding does not imply hiding. Polynomial commitments additionally support verification of evaluations at chosen points."
    ],
    "nodes": [
      {
        "title": [
          "拘束性：送った側への制約",
          "Binding: constrain the sender"
        ],
        "body": [
          "同じコミットメントを，別の値にすり替えて開示できない．",
          "The same commitment cannot be opened inconsistently to a different value."
        ]
      },
      {
        "title": [
          "隠蔽性：受け取る側への制約",
          "Hiding: limit the receiver"
        ],
        "body": [
          "コミットメントから，隠された値を識別できない．",
          "The commitment does not reveal which hidden value was committed."
        ]
      }
    ]
  },
  "08-2": {
    "section": "2.3",
    "type": "flow",
    "title": [
      "KZG：割り切れ性をペアリングで検証する",
      "KZG: check divisibility with a pairing"
    ],
    "note": [
      "群を区別した表記．次数に対応するG₁のべきのSRSと，G₂のg₂・g₂^τを使う．基本形のKZGは隠蔽性を自動では与えない．",
      "Typed-group notation: use the required G₁ powers in the SRS and g₂, g₂^τ in G₂. Basic KZG does not automatically provide hiding."
    ],
    "nodes": [
      {
        "title": [
          "多項式を固定する",
          "Commit to the polynomial"
        ],
        "body": [
          "C = g₁^{f(τ)}",
          "C = g₁^{f(τ)}"
        ]
      },
      {
        "title": [
          "f(x)=yの開示証明を作る",
          "Prove the evaluation f(x)=y"
        ],
        "body": [
          "q(X) = (f(X)−y)/(X−x)，π = g₁^{q(τ)}",
          "q(X) = (f(X)−y)/(X−x), π = g₁^{q(τ)}"
        ]
      },
      {
        "title": [
          "ペアリング等式を確認する",
          "Check the pairing equation"
        ],
        "body": [
          "e(C·g₁^{−y}, g₂) = e(π, g₂^τ·g₂^{−x})",
          "e(C·g₁^{−y}, g₂) = e(π, g₂^τ·g₂^{−x})"
        ]
      }
    ]
  },
  "08-3": {
    "section": "3.2",
    "type": "merkle",
    "title": [
      "Merkle木が保証するのは，表への所属",
      "A Merkle tree authenticates membership in a table"
    ],
    "note": [
      "四つの葉の模式図．順序を固定してハッシュする．低次数性はMerkle経路だけでは分からず，FRI等の検査が別に必要になる．",
      "Schematic four-leaf tree with ordered hashing. A Merkle path alone does not prove low degree; that requires an additional test such as FRI."
    ],
    "alt": [
      "四つの値のハッシュを二つずつ結合し，最後にrootへ結合する二分木．",
      "A binary tree combining hashes of four values in pairs, then into a root."
    ],
    "bottom": [
      "v₀の開示：v₀ ＋ 隣のh₁ ＋ 右側部分木のハッシュ → rootを再計算",
      "Open v₀: v₀ + sibling h₁ + right-subtree hash → recompute root"
    ]
  },
  "09-1": {
    "section": "2.2",
    "type": "compare",
    "title": [
      "Fiat–Shamir：チャレンジの出どころが変わる",
      "Fiat–Shamir changes where challenges come from"
    ],
    "note": [
      "概念の整理．実装では公開入力・プロトコル識別子・それまでの記録などを曖昧さなく符号化する．ハッシュの一方向性だけで変換の安全性が証明されるわけではない．",
      "Conceptual overview. Encode public inputs, protocol identifiers and the prior transcript unambiguously. One-wayness of the hash alone does not establish security."
    ],
    "nodes": [
      {
        "title": [
          "対話型",
          "Interactive"
        ],
        "body": [
          "Pがコミットtを送る\nVがランダムなcを返す\nPが応答sを送る",
          "P sends commitment t\nV returns random c\nP sends response s"
        ]
      },
      {
        "title": [
          "非対話型",
          "Non-interactive"
        ],
        "body": [
          "Pがtを作る\nc = H(文脈, x, t)\nPが(t,s)を送り，Vもcを再計算",
          "P constructs t\nc = H(context, x, t)\nP sends (t,s); V recomputes c"
        ]
      }
    ]
  },
  "09-2": {
    "section": "3.1",
    "type": "matrix",
    "title": [
      "ランダムオラクル：新しい入力には乱数，同じ入力には同じ値",
      "Random oracle: fresh input, random answer; repeated input, same answer"
    ],
    "note": [
      "小さな出力の説明例．実際の安全性解析では十分な出力長と問い合わせ回数を考える．異なる入力に同じ出力が出る可能性もある．",
      "Illustrative short outputs. Security analysis uses an appropriate output length and query bound. Different inputs can still receive the same answer."
    ],
    "headers": [
      [
        "問い合わせ",
        "Query"
      ],
      [
        "入力",
        "Input"
      ],
      [
        "応答",
        "Answer"
      ],
      [
        "処理",
        "Action"
      ]
    ],
    "rows": [
      [
        "1",
        "a",
        "0110",
        [
          "一様に選び記憶",
          "Choose uniformly and store"
        ]
      ],
      [
        "2",
        "b",
        "1011",
        [
          "新たに選び記憶",
          "Choose a fresh answer and store"
        ]
      ],
      [
        "3",
        "a",
        "0110",
        [
          "記憶した値を返す",
          "Return the stored answer"
        ]
      ]
    ]
  },
  "09-3": {
    "section": "4.2",
    "type": "compare",
    "title": [
      "理想モデルでの証明と，実装の安全性を区別する",
      "Separate ideal-model proofs from implementation security"
    ],
    "note": [
      "CGHの反例は，この置き換えをすべての構成について正当化できないことを示す．ここから，実用のFiat–Shamir構成がすべて破られるとはいえない．",
      "The CGH counterexample rules out a universal justification of this replacement; it does not show that every practical Fiat–Shamir construction is broken."
    ],
    "nodes": [
      {
        "title": [
          "ROMでの言明",
          "Claim in the ROM"
        ],
        "body": [
          "Hを理想的なランダムオラクルとして扱い，安全性を証明する．",
          "Prove security while treating H as an ideal random oracle."
        ]
      },
      {
        "title": [
          "具体的な実装",
          "Concrete implementation"
        ],
        "body": [
          "SHA-256等の具体的な関数を使う．プロトコルと実装の条件を評価する．",
          "Use a concrete function such as SHA-256 and assess protocol and implementation conditions."
        ]
      }
    ],
    "bottom": [
      "ROMの証明だけでは，任意の具体的ハッシュへの置き換えを保証しない",
      "A ROM proof alone does not justify every concrete hash instantiation"
    ]
  },
  "10-1": {
    "section": "3.1",
    "type": "matrix",
    "title": [
      "PCP・IP・IOP：読む量と対話を切り分ける",
      "PCP, IP and IOP: separate access from interaction"
    ],
    "note": [
      "問い合わせの少なさとゼロ知識性は別の性質．オラクルは固定されたデータへの問い合わせを表す理論的なアクセスモデル．",
      "Few queries and zero-knowledge are different properties. An oracle represents a theoretical access model to fixed data."
    ],
    "headers": [
      [
        "枠組み",
        "Framework"
      ],
      [
        "証明者が用意するもの",
        "Prover supplies"
      ],
      [
        "検証者のアクセス",
        "Verifier access"
      ]
    ],
    "rows": [
      [
        "PCP",
        [
          "一つの証明文字列",
          "One proof string"
        ],
        [
          "選んだ位置だけ読む",
          "Read selected positions"
        ]
      ],
      [
        "IP",
        [
          "対話の各メッセージ",
          "Messages across rounds"
        ],
        [
          "通常のメッセージとして受け取る",
          "Receive ordinary messages"
        ]
      ],
      [
        "IOP",
        [
          "各ラウンドのオラクル",
          "Oracles across rounds"
        ],
        [
          "各オラクルの選んだ位置を読む",
          "Query selected positions in each oracle"
        ]
      ]
    ]
  },
  "10-2": {
    "section": "2.1",
    "type": "compare",
    "title": [
      "PCPからギャップのある最適化問題へ",
      "From PCPs to a gap optimization problem"
    ],
    "note": [
      "近似困難性への概念的な対応．具体的なギャップや近似率は帰着と定理に依存する．多項式時間で解けないという結論にはP≠NP等の条件が伴う．",
      "Conceptual connection to hardness of approximation. Concrete gaps and approximation ratios depend on the reduction and theorem; impossibility conclusions are conditional on assumptions such as P≠NP."
    ],
    "top": [
      "PCP検証者の局所的な検査を，制約として表す",
      "Represent a PCP verifier’s local tests as constraints"
    ],
    "nodes": [
      {
        "title": [
          "YES側",
          "YES case"
        ],
        "body": [
          "正しい言明には，多くの検査を満たす証明がある．",
          "A true instance has a proof satisfying many tests."
        ]
      },
      {
        "title": [
          "NO側",
          "NO case"
        ],
        "body": [
          "誤った言明では，どの証明にも一定割合の失敗が残る．",
          "For a false instance, every proof fails a nontrivial fraction of tests."
        ]
      }
    ],
    "bottom": [
      "最適値のギャップを見分ける難しさ → 近似の限界",
      "Difficulty distinguishing the optimum-value gap → limits on approximation"
    ]
  },
  "10-3": {
    "section": "3.2",
    "type": "flow",
    "title": [
      "抽象的な検査を，非対話の暗号プロトコルへ",
      "From abstract checks to a non-interactive cryptographic protocol"
    ],
    "note": [
      "代表的な公開コインIOP／多項式IOPの構成手順．各段階の安全性条件が必要．Groth16をこの変換列そのものとして扱わない（第11回）．",
      "A representative public-coin IOP / polynomial-IOP construction. Each stage needs security conditions. Groth16 does not follow this exact compilation path (Session 11)."
    ],
    "nodes": [
      {
        "title": [
          "算術化",
          "Arithmetization"
        ],
        "body": [
          "計算を制約と多項式の関係へ",
          "Translate computations into constraints and polynomial relations"
        ]
      },
      {
        "title": [
          "IOPの検査を設計",
          "Design IOP checks"
        ],
        "body": [
          "次数・関係式・整合性を検査する",
          "Check degrees, relations and consistency"
        ]
      },
      {
        "title": [
          "コミットメントで固定",
          "Commit to the data"
        ],
        "body": [
          "表または多項式に対する認証された開示",
          "Authenticate openings of tables or polynomials"
        ]
      },
      {
        "title": [
          "Fiat–Shamirで非対話化",
          "Apply Fiat–Shamir"
        ],
        "body": [
          "トランスクリプトからチャレンジを導出",
          "Derive challenges from the transcript"
        ]
      }
    ]
  },
  "11-1": {
    "section": "2.3",
    "type": "flow",
    "title": [
      "QAPの積を，対象群の等式に移す",
      "Move the QAP product into a target-group relation"
    ],
    "note": [
      "発想を整理した表．この式だけではGroth16の健全性もゼロ知識性も得られない．実際の構成は回路固有の鍵・追加項・乱数化を使う．",
      "Conceptual sketch only. This relation alone gives neither Groth16 soundness nor zero-knowledge; the construction also needs circuit-specific keys, additional terms and randomization."
    ],
    "nodes": [
      {
        "title": [
          "確認したい関係",
          "Desired relation"
        ],
        "body": [
          "A(τ)B(τ) = C(τ) + H(τ)Z(τ)",
          "A(τ)B(τ) = C(τ) + H(τ)Z(τ)"
        ]
      },
      {
        "title": [
          "群要素で値を扱う",
          "Encode values in group elements"
        ],
        "body": [
          "g₁^{A(τ)}，g₂^{B(τ)}",
          "g₁^{A(τ)}, g₂^{B(τ)}"
        ]
      },
      {
        "title": [
          "双線形性で積を検査",
          "Use bilinearity to check the product"
        ],
        "body": [
          "e(g₁^{A(τ)}, g₂^{B(τ)}) = e(g₁,g₂)^{A(τ)B(τ)}",
          "e(g₁^{A(τ)}, g₂^{B(τ)}) = e(g₁,g₂)^{A(τ)B(τ)}"
        ]
      }
    ]
  },
  "11-2": {
    "section": "3.3",
    "type": "matrix",
    "title": [
      "Groth16の検証式：各項が担う役割",
      "Roles of the terms in Groth16 verification"
    ],
    "note": [
      "検証式は e(A,B)=e([α]₁,[β]₂)·e(IC,[γ]₂)·e(C,[δ]₂)．A,B,Cは証明の群要素であり，QAP多項式と区別する．ペアリング回数は定数でも，公開入力の処理は残る．",
      "Verification: e(A,B)=e([α]₁,[β]₂)·e(IC,[γ]₂)·e(C,[δ]₂). Here A,B,C are proof group elements, distinct from QAP polynomials. Constant pairing count does not remove public-input processing."
    ],
    "headers": [
      [
        "項",
        "Term"
      ],
      [
        "読むポイント",
        "Interpretation"
      ]
    ],
    "rows": [
      [
        "e(A, B)",
        [
          "証明の二つの群要素を組み合わせる",
          "Pair two proof group elements"
        ]
      ],
      [
        "e([α]₁, [β]₂)",
        [
          "検証鍵に含まれる固定の項",
          "Fixed term from the verification key"
        ]
      ],
      [
        "e(IC, [γ]₂)",
        [
          "公開入力からICを計算して結び付ける",
          "Bind the IC computed from public inputs"
        ]
      ],
      [
        "e(C, [δ]₂)",
        [
          "証明の残りの項との整合性を確認する",
          "Check consistency with the remaining proof term"
        ]
      ]
    ]
  },
  "11-3": {
    "section": "4.2",
    "type": "flow",
    "title": [
      "回路固有の鍵と，残してはいけない秘密",
      "Circuit-specific keys and secrets that must not remain"
    ],
    "note": [
      "秘密のトラップドアはτだけではない．MPCでは所定の正直性・消去条件を必要とする．共有できる準備段階があっても，Groth16の回路固有の段階は残る．",
      "The toxic waste includes more than τ. MPC requires the stated honesty and erasure conditions. Reusable preparation does not remove Groth16’s circuit-specific phase."
    ],
    "nodes": [
      {
        "title": [
          "回路とセットアップ",
          "Circuit and setup"
        ],
        "body": [
          "回路のQAPと秘密の乱数から鍵を生成する",
          "Generate keys from the circuit QAP and secret randomness"
        ]
      },
      {
        "title": [
          "公開するもの／破棄するもの",
          "Publish versus erase"
        ],
        "body": [
          "証明鍵・検証鍵を残す．秘密のトラップドアを消去する．",
          "Keep proving and verification keys. Erase the secret trapdoors."
        ]
      },
      {
        "title": [
          "回路を変えたら",
          "When the circuit changes"
        ],
        "body": [
          "対応する回路固有の鍵を準備し直す",
          "Prepare corresponding circuit-specific keys again"
        ]
      }
    ]
  },
  "12-1": {
    "section": "2.2",
    "type": "matrix",
    "title": [
      "同じ列でも，セレクタが計算を選ぶ",
      "Selectors choose the operation on the same columns"
    ],
    "note": [
      "公開入力項を0とした基本ゲートの例．各行で条件を満たすのであり，多項式が体の全点で0という意味ではない．公開入力やコピー制約は別途組み込む．",
      "Basic-gate examples with the public-input term set to zero. The relation holds on gate rows, not necessarily at every field point. Public inputs and copy constraints must also be incorporated."
    ],
    "headers": [
      [
        "ゲート",
        "Gate"
      ],
      "q_L",
      "q_R",
      "q_O",
      "q_M",
      "q_C",
      [
        "行の関係",
        "Row relation"
      ]
    ],
    "rows": [
      [
        [
          "加算",
          "Addition"
        ],
        "1",
        "1",
        "−1",
        "0",
        "0",
        "a+b−c=0"
      ],
      [
        [
          "乗算",
          "Multiplication"
        ],
        "0",
        "0",
        "−1",
        "1",
        "0",
        "ab−c=0"
      ]
    ]
  },
  "12-2": {
    "section": "3.2",
    "type": "flow",
    "title": [
      "コピー制約は，「どの位置」を結び付けるかが重要",
      "Copy constraints must bind specific positions"
    ],
    "note": [
      "三つの位置を同じ変数に割り当てる例．値だけの多重集合は並べ替えても変わらないため，位置ラベルと回路で固定された置換を使う．",
      "Example with three positions assigned to one variable. Values alone form the same multiset after any permutation; position labels and a circuit-fixed permutation are essential."
    ],
    "nodes": [
      {
        "title": [
          "同じ値が必要な位置を決める",
          "Specify positions that must agree"
        ],
        "body": [
          "p₁ = a₁，p₂ = b₃，p₃ = c₅",
          "p₁ = a₁, p₂ = b₃, p₃ = c₅"
        ]
      },
      {
        "title": [
          "置換の巡回として固定",
          "Fix a permutation cycle"
        ],
        "body": [
          "p₁ → p₂ → p₃ → p₁",
          "p₁ → p₂ → p₃ → p₁"
        ]
      },
      {
        "title": [
          "値と位置を混ぜた積を照合",
          "Compare products binding values to positions"
        ],
        "body": [
          "vⱼ + β·idⱼ + γ と vⱼ + β·idσ(j) + γ の積を検査",
          "Check products of vⱼ + β·idⱼ + γ and vⱼ + β·idσ(j) + γ"
        ]
      }
    ]
  },
  "12-3": {
    "section": "5",
    "type": "compare",
    "title": [
      "共有するSRSと，回路ごとに固定する情報",
      "Shared SRS versus circuit-specific information"
    ],
    "note": [
      "汎用性には次数等の上限がある．KZG型PLONKではトラステッドセットアップとFiat–Shamirの両方を使う．カスタムゲートの効率は次数・列数等も含めて評価する．",
      "Universality is bounded, for example by degree. KZG-based PLONK uses both trusted setup and Fiat–Shamir. Custom-gate efficiency also depends on degree and column count."
    ],
    "top": [
      "上限を定めた汎用・更新可能SRS",
      "Universal, updatable SRS with a fixed capacity"
    ],
    "nodes": [
      {
        "title": [
          "回路A",
          "Circuit A"
        ],
        "body": [
          "セレクタ・配線を前処理\n対応する証明鍵・検証鍵",
          "Preprocess selectors and wiring\nCorresponding proving and verification keys"
        ]
      },
      {
        "title": [
          "回路B",
          "Circuit B"
        ],
        "body": [
          "別のセレクタ・配線を前処理\n対応する証明鍵・検証鍵",
          "Preprocess different selectors and wiring\nCorresponding proving and verification keys"
        ]
      }
    ],
    "bottom": [
      "SRSを共有しても，回路への拘束はなくならない",
      "Sharing the SRS does not remove binding to the circuit"
    ]
  },
  "13-1": {
    "section": "1.2",
    "type": "compare",
    "title": [
      "透明性と，各部品が保証すること",
      "Transparency and the guarantees of each component"
    ],
    "note": [
      "AIR・FRI型STARKの代表例．透明性だけからAIRやFRIが唯一の選択として決まるわけではない．",
      "Representative AIR/FRI-based STARK. Transparency alone does not uniquely require AIR or FRI."
    ],
    "nodes": [
      {
        "title": [
          "Merkle木",
          "Merkle tree"
        ],
        "body": [
          "開示値を，先に固定した表に結び付ける．",
          "Tie opened values to a previously fixed table."
        ]
      },
      {
        "title": [
          "FRI",
          "FRI"
        ],
        "body": [
          "表が低次数多項式の評価に近いことを検査する．",
          "Test proximity to evaluations of a low-degree polynomial."
        ]
      }
    ],
    "bottom": [
      "これらに制約・整合性の検査を組み合わせ，秘密のセットアップを使わず構成する",
      "Combine these with constraint and consistency checks without a secret setup"
    ]
  },
  "13-2": {
    "section": "3.1",
    "type": "flow",
    "title": [
      "STARK：固定してから，チャレンジを導出する",
      "STARK: commit before deriving challenges"
    ],
    "note": [
      "非対話型構成の概略．問い合わせは必要なコミットメントが固定された後に決める．ゼロ知識性には別途マスキング等が必要．",
      "Non-interactive construction outline. Choose queries only after the required commitments are fixed. Zero-knowledge additionally requires masking or other suitable measures."
    ],
    "nodes": [
      {
        "title": [
          "実行と符号化",
          "Execute and encode"
        ],
        "body": [
          "トレース → 補間 → 低次数拡張 → Merkleコミット",
          "Trace → interpolation → low-degree extension → Merkle commitment"
        ]
      },
      {
        "title": [
          "制約をまとめる",
          "Combine constraints"
        ],
        "body": [
          "トランスクリプトから係数を導出し，商・合成多項式を構成してコミット",
          "Derive coefficients from the transcript; construct and commit quotient/composition polynomials"
        ]
      },
      {
        "title": [
          "FRIを構成する",
          "Construct FRI"
        ],
        "body": [
          "各表のコミット後に折り畳みチャレンジを導出",
          "Derive each folding challenge after committing its table"
        ]
      },
      {
        "title": [
          "まとめて検証する",
          "Verify jointly"
        ],
        "body": [
          "制約の関係・表の整合性・FRI・Merkle経路を検査",
          "Check constraint relations, table consistency, FRI and Merkle paths"
        ]
      }
    ]
  },
  "13-3": {
    "section": "4.1",
    "type": "matrix",
    "title": [
      "証明サイズの比較では，数える対象を揃える",
      "Compare proof sizes using consistent accounting"
    ],
    "note": [
      "模式的な比較であり，実測値や速度ランキングではない．固定した安全性パラメータを前提とし，公開入力の処理コストを別途数える．",
      "Schematic comparison, not measurements or a speed ranking. Fix security parameters and account separately for public-input processing."
    ],
    "headers": [
      [
        "方式",
        "Construction"
      ],
      [
        "主な証明の要素",
        "Main proof components"
      ],
      [
        "設計上の条件",
        "Design conditions"
      ]
    ],
    "rows": [
      [
        "Groth16",
        [
          "3個の群要素",
          "Three group elements"
        ],
        [
          "回路固有のセットアップ",
          "Circuit-specific setup"
        ]
      ],
      [
        [
          "KZG型PLONK",
          "KZG-based PLONK"
        ],
        [
          "定数個の群要素・評価値等",
          "Constant number of group elements, evaluations, etc."
        ],
        [
          "汎用SRS・Fiat–Shamir",
          "Universal SRS and Fiat–Shamir"
        ]
      ],
      [
        [
          "FRI型STARK",
          "FRI-based STARK"
        ],
        [
          "評価値・FRI・Merkle認証経路",
          "Evaluations, FRI and Merkle authentication paths"
        ],
        [
          "透明なセットアップ．全通信量を数える",
          "Transparent setup; count total communication"
        ]
      ]
    ]
  },
  "14-1": {
    "section": "1.4",
    "type": "matrix",
    "title": [
      "四つの問いで，安全性の説明を読む",
      "Read security through four questions"
    ],
    "note": [
      "いずれの方式でも，各性質を成立させる構成と仮定を個別に確認する．一つの性質だけでは他の性質を示したことにならない．",
      "For every construction, check the mechanisms and assumptions for each property separately. Establishing one property does not establish the others."
    ],
    "headers": [
      [
        "性質",
        "Property"
      ],
      [
        "確認する問い",
        "Question to ask"
      ]
    ],
    "rows": [
      [
        [
          "完全性",
          "Completeness"
        ],
        [
          "正しいウィットネスで正直に実行すれば受理されるか",
          "Does honest execution with a valid witness accept?"
        ]
      ],
      [
        [
          "健全性",
          "Soundness"
        ],
        [
          "誤った言明を誰が，どの確率で通せるか",
          "Who can make a false statement accept, and with what probability?"
        ]
      ],
      [
        [
          "ゼロ知識性",
          "Zero-knowledge"
        ],
        [
          "ウィットネスなしでviewを再現できるか",
          "Can the view be simulated without the witness?"
        ]
      ],
      [
        [
          "知識の健全性",
          "Knowledge soundness"
        ],
        [
          "どのアクセス・仮定でウィットネスを抽出できるか",
          "Under what access and assumptions can a witness be extracted?"
        ]
      ]
    ]
  },
  "14-2": {
    "section": "2",
    "type": "matrix",
    "title": [
      "共通の道具を，異なる構成に組み合わせる",
      "Shared tools, different constructions"
    ],
    "note": [
      "Groth16をKZGの応用やFiat–Shamirの変換結果として分類しない．表は本講義で扱った代表構成についてのもの．",
      "Do not classify Groth16 as a KZG application or a Fiat–Shamir compilation. The table describes the representative constructions taught here."
    ],
    "headers": [
      [
        "構成",
        "Construction"
      ],
      [
        "算術化",
        "Arithmetization"
      ],
      [
        "検証を支える道具",
        "Checking tools"
      ],
      [
        "非対話性",
        "Non-interactivity"
      ]
    ],
    "rows": [
      [
        "Groth16",
        "QAP",
        [
          "回路固有の鍵・ペアリング",
          "Circuit-specific keys and pairings"
        ],
        [
          "CRSモデルで直接",
          "Directly in the CRS model"
        ]
      ],
      [
        "PLONK",
        "PLONKish",
        "KZG",
        "Fiat–Shamir"
      ],
      [
        "STARK",
        "AIR",
        "Merkle + FRI",
        "Fiat–Shamir"
      ]
    ]
  },
  "14-3": {
    "section": "4",
    "type": "flow",
    "title": [
      "方式を選ぶ前に，評価条件を固定する",
      "Fix evaluation conditions before choosing a system"
    ],
    "note": [
      "選択肢は一律に順位付けできない．同じ計算・安全性条件で，全体のコストを比較する．",
      "There is no universal ranking. Compare end-to-end costs for the same computation and security conditions."
    ],
    "nodes": [
      {
        "title": [
          "要求を決める",
          "Set requirements"
        ],
        "body": [
          "秘密のセットアップは許容できるか．どの安全性が必要か．",
          "Is a secret setup acceptable? Which security properties are required?"
        ]
      },
      {
        "title": [
          "制約を決める",
          "Identify constraints"
        ],
        "body": [
          "生成時間・検証時間・通信量・メモリのどれが限界か．",
          "Which of proving time, verification time, communication or memory is limiting?"
        ]
      },
      {
        "title": [
          "条件を揃えて測る",
          "Measure under matched conditions"
        ],
        "body": [
          "回路・ハードウェア・公開入力・安全性パラメータを揃える．",
          "Match circuit, hardware, public inputs and security parameters."
        ]
      },
      {
        "title": [
          "根拠を示して選ぶ",
          "Choose with evidence"
        ],
        "body": [
          "何を改善し，何を引き受けたかを説明する．",
          "Explain the improvement and the costs or assumptions accepted."
        ]
      }
    ]
  },
  "15-1": {
    "section": "1.3",
    "type": "flow",
    "title": [
      "再帰：前の証明の検証を，次の計算に含める",
      "Recursion: include verification of the previous proof in the next computation"
    ],
    "note": [
      "各時点までの有限の履歴を扱う手順．公開状態とステップの連鎖を正しく結び付ける必要がある．検証回路の効率は群や体の選択にも依存する．",
      "Schematic for a finite history up to each step. Bind the public state and step linkage correctly. Verifier-circuit efficiency also depends on group and field choices."
    ],
    "nodes": [
      {
        "title": [
          "前の結果",
          "Previous result"
        ],
        "body": [
          "状態sᵢと，その履歴の証明πᵢ",
          "State sᵢ and proof πᵢ of its history"
        ]
      },
      {
        "title": [
          "次の証明対象",
          "Next statement to prove"
        ],
        "body": [
          "πᵢの検証 ＋ sᵢ → sᵢ₊₁ の正しい実行",
          "Verify πᵢ and correctly execute sᵢ → sᵢ₊₁"
        ]
      },
      {
        "title": [
          "新しい結果",
          "New result"
        ],
        "body": [
          "状態sᵢ₊₁と証明πᵢ₊₁を次のステップへ",
          "Pass state sᵢ₊₁ and proof πᵢ₊₁ to the next step"
        ]
      }
    ]
  },
  "15-2": {
    "section": "2.2",
    "type": "flow",
    "title": [
      "Folding・IVC・圧縮を，別の役割として読む",
      "Separate the roles of folding, IVC and compression"
    ],
    "note": [
      "Novaを念頭に置いた概念の整理．foldingだけで簡潔なゼロ知識証明が完成するわけではない．FRIの次数縮小とは対象も安全性の議論も異なる．",
      "Conceptual view motivated by Nova. Folding alone is not a succinct zero-knowledge proof. Its objects and security arguments differ from FRI degree reduction."
    ],
    "nodes": [
      {
        "title": [
          "Folding",
          "Folding"
        ],
        "body": [
          "二つの緩和R1CSインスタンスを集約し，ウィットネスを更新",
          "Combine two relaxed-R1CS instances and update their witnesses"
        ]
      },
      {
        "title": [
          "IVC",
          "IVC"
        ],
        "body": [
          "各ステップと累積した関係の連鎖を保証",
          "Ensure the linkage of steps and the accumulated relation"
        ]
      },
      {
        "title": [
          "圧縮",
          "Compression"
        ],
        "body": [
          "累積した関係を，提示しやすい簡潔な証明にする",
          "Turn the accumulated relation into a succinct proof for presentation"
        ]
      }
    ]
  },
  "15-3": {
    "section": "3.1",
    "type": "flow",
    "title": [
      "Sumcheck：総和を，一つの評価の確認まで減らす",
      "Sumcheck: reduce a sum claim to checking one evaluation"
    ],
    "note": [
      "各ラウンドで次数上限と和の整合性を検査し，メッセージの後にチャレンジを選ぶ．最後の評価の確認は省けない．GKRでは層ごとの言明の縮約にこの考え方を使う．",
      "Check degree bounds and sum consistency each round, choosing the challenge after the message. The final evaluation check is essential. GKR uses such reductions between layers."
    ],
    "nodes": [
      {
        "title": [
          "最初の言明",
          "Initial claim"
        ],
        "body": [
          "T = ∑_{b₁,…,bₙ∈{0,1}} g(b₁,…,bₙ)",
          "T = ∑_{b₁,…,bₙ∈{0,1}} g(b₁,…,bₙ)"
        ]
      },
      {
        "title": [
          "一変数の多項式で確認",
          "Check a univariate polynomial"
        ],
        "body": [
          "p₁(0)+p₁(1)=T → ランダムなr₁でp₁(r₁)へ",
          "p₁(0)+p₁(1)=T → reduce to p₁(r₁) at random r₁"
        ]
      },
      {
        "title": [
          "変数を一つずつ確定",
          "Fix one variable per round"
        ],
        "body": [
          "残る和について同じ検査を繰り返す",
          "Repeat the check for the remaining sum"
        ]
      },
      {
        "title": [
          "最後の評価を確認",
          "Check the final evaluation"
        ],
        "body": [
          "g(r₁,…,rₙ)を独立に計算するか，適切な検証手段で確認",
          "Compute g(r₁,…,rₙ) independently or check it with an appropriate mechanism"
        ]
      }
    ]
  },
  "15-4": {
    "section": "4.3",
    "type": "compare",
    "title": [
      "Ethereum：L2の証明とL1の実行証明を分ける",
      "Ethereum: distinguish L2 proofs from L1 execution proofs"
    ],
    "note": [
      "本文の2026年9月27日時点の整理を比較．EIP-8025のDraft提案では証明は任意の補助チェックで，再実行を継続する．メインネットでの有効化を示すものではない．",
      "Visual summary of the lecture’s September 27, 2026 snapshot. The Draft EIP-8025 proposal uses proofs as optional supplementary checks while re-execution continues. This is not a claim of mainnet activation."
    ],
    "nodes": [
      {
        "title": [
          "L2のZKロールアップ",
          "L2 ZK rollup"
        ],
        "body": [
          "L2の計算 → 実行の正当性の証明 → Ethereum L1で検証",
          "L2 computation → validity proof → verification on Ethereum L1"
        ]
      },
      {
        "title": [
          "L1の実行証明",
          "L1 execution proof"
        ],
        "body": [
          "Ethereum本体のブロック実行が対象．EIP-8025は任意の証明の配布・検証を提案．",
          "Targets Ethereum block execution itself. EIP-8025 proposes distribution and verification of optional proofs."
        ]
      }
    ],
    "bottom": [
      "「zk」という名称だけで，取引内容が秘匿されるとは限らない",
      "The “zk” name alone does not imply transaction privacy"
    ]
  }
};
