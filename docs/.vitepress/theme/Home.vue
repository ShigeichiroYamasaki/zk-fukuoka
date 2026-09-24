<script setup>
import { computed } from "vue";
import { useData, withBase } from "vitepress";
const { lang } = useData();
const en = computed(() => lang.value === "en");
const link = (s) => withBase((en.value ? "/en/" : "/") + s);
const t = (ja, english) => (en.value ? english : ja);
</script>
<template>
  <main class="zk-home">
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow">
          <span class="status-dot"></span> FUKUOKA, JAPAN
          <span class="eyebrow-divider">/</span>
          {{ t("設立準備中", "IN FORMATION") }}
        </div>
        <h1 v-if="!en">
          ZK Fukuoka<br /><span class="hero-subtitle"
            >ゼロ知識証明技術者になろう</span
          >
        </h1>
        <h1 v-else>
          ZK Fukuoka<br /><span class="hero-subtitle"
            >Become a zero-knowledge engineer.</span
          >
        </h1>
        <p class="hero-description">
          {{
            t(
              "福岡から、ゼロ知識証明のつくり手へ。数学をひもとき、コードを書き、仲間と試す。ZK Fukuoka は、次の一歩をいっしょにつくる技術者コミュニティです。",
              "From Fukuoka to the frontiers of zero-knowledge. Explore the math, write the code, and experiment with peers. A community for the next generation of ZK builders.",
            )
          }}
        </p>
        <div class="hero-actions">
          <a class="button primary" :href="link('learn/')"
            >{{ t("シラバスからはじめる", "Explore the syllabus") }}
            <span>↗</span></a
          ><a class="text-link" :href="link('whitepaper.html')"
            >{{ t("私たちの構想を読む", "Read our vision") }} <span>→</span></a
          >
        </div>
        <div class="hero-note">
          <span>⌘</span>
          {{
            t(
              "好奇心を持って、手を動かそう。",
              "Bring your curiosity. Make something real.",
            )
          }}
        </div>
      </div>
      <div
        class="proof-art"
        role="img"
        :aria-label="
          t(
            '福岡の街を背景に、秘密を明かさず証明するイメージ図',
            'An illustration of proving a claim without revealing a secret, above the Fukuoka skyline',
          )
        "
      >
        <div class="art-top">
          <span>PROOF OF CURIOSITY</span><span>01 / ZK</span>
        </div>
        <div class="orbit orbit-one"></div>
        <div class="orbit orbit-two"></div>
        <span class="float-tag tag-one"
          >{{ t("秘密は、秘密のまま。", "Your secret stays yours.")
          }}<br /><small>Keep the secret. Share the proof.</small></span
        >
        <div class="proof-cube">
          <span class="cube-bracket">[</span
          ><span class="cube-zk">ZK<span class="cube-star">✳</span></span
          ><span class="cube-bracket">]</span>
        </div>
        <div class="proof-chip">
          <span>✓</span> PROOF VERIFIED <small>CONCEPT</small>
        </div>
        <svg class="skyline" viewBox="0 0 520 145" aria-hidden="true">
          <g fill="none" stroke="currentColor" stroke-width="1.4">
            <path
              d="M0 127h520M25 127V90h34v37m11 0V71h44v56m12 0V96h28v31m14 0V77h23v50m14 0V55h39v72m19 0V83h33v44m79 0V94h39v33m10 0V67h37v60m14 0V85h33v42M322 127l10-97 10 97M327 76h10m-7-29h5m-3-17V7m-9 86h18m-21 19h24M80 83h6m10 0h6m-22 13h6m10 0h6m115-30h6m10 0h6m-22 16h6m10 0h6M424 80h6m10 0h6m-22 15h6m10 0h6"
            />
            <path d="M150 127q30-22 60 0m238 0q29-35 59 0" />
          </g>
        </svg>
        <div class="art-bottom">
          <span>33.5902° N · 130.4017° E</span><span>HELLO, FUKUOKA ↗</span>
        </div>
      </div>
    </section>
    <div class="manifesto-strip">
      <span>LEARN THE MATH</span><b>✳</b><span>WRITE THE CODE</span><b>✳</b
      ><span>SHARE THE PROOF</span><b>✳</b><span>BUILD WITH FRIENDS</span>
    </div>
    <section class="learn-section section-pad">
      <div class="section-heading">
        <div>
          <span class="section-kicker">01 / LEARNING PATH</span>
          <h2>
            {{
              t("「気になる」を、「つくれる」に。", "From curious to capable.")
            }}
          </h2>
        </div>
        <a class="text-link" :href="link('learn/')"
          >{{ t("シラバスをすべて見る", "View the full syllabus") }} ↗</a
        >
      </div>
      <p class="section-intro">
        {{
          t(
            "基礎から小さな実装へ。理解・実験・共有をくり返す、4つの学習ステップ。",
            "Four steps from first principles to a working prototype. Learn, experiment, and share.",
          )
        }}
        <span class="draft-label">{{
          t("カリキュラム案", "DRAFT CURRICULUM")
        }}</span>
      </p>
      <div class="learning-grid">
        <a
          v-for="(item, i) in en
            ? [
                [
                  'Foundations',
                  'Make sense of the math.',
                  'Finite fields · Polynomials · Commitments',
                ],
                [
                  'Understand proofs',
                  'Explore what zero-knowledge means.',
                  'Completeness · Soundness · Zero-knowledge',
                ],
                [
                  'Build a circuit',
                  'Turn a claim into constraints.',
                  'Witnesses · Circuits · Verification',
                ],
                [
                  'Make & share',
                  'Build a small project with peers.',
                  'Prototype · Review · Demo',
                ],
              ]
            : [
                [
                  '基礎をつかむ',
                  '数学と暗号のことばを知る。',
                  '有限体 · 多項式 · コミットメント',
                ],
                [
                  '証明を理解する',
                  'ゼロ知識の仕組みにふれる。',
                  '完全性 · 健全性 · ゼロ知識性',
                ],
                [
                  '回路をつくる',
                  '主張を制約で表現してみる。',
                  'Witness · 回路 · 検証',
                ],
                [
                  'つくって、共有する',
                  '仲間と小さな作品をかたちに。',
                  '試作 · レビュー · デモ',
                ],
              ]"
          :key="i"
          :href="
            link(
              i === 0
                ? 'learn/foundations.html'
                : 'learn/#' +
                    ['foundations', 'proofs', 'circuits', 'project'][i],
            )
          "
          class="learning-card"
        >
          <div class="card-top">
            <span>0{{ i + 1 }}</span
            ><span>{{ ["↗", "◎", "⌘", "✳"][i] }}</span>
          </div>
          <h3>{{ item[0] }}</h3>
          <p>{{ item[1] }}</p>
          <div class="card-bottom">{{ item[2] }} <span>→</span></div>
        </a>
      </div>
    </section>
    <section class="community-section section-pad">
      <div class="community-copy">
        <span class="section-kicker">02 / OPEN BY DESIGN</span>
        <h2>
          {{ t("学びも、コミュニティも。", "An open community.") }}<br />{{
            t("いっしょにつくっていく。", "Built with you.")
          }}
        </h2>
        <p>
          {{
            t(
              "完成した答えを受け取るだけじゃない。疑問を持ち寄り、失敗から学び、次の人に手渡す。活動の構想と意思決定を、ここに開いていきます。",
              "Bring your questions, learn from experiments, and pass discoveries on. Our vision and decisions live in the open, ready for discussion.",
            )
          }}
        </p>
        <a class="text-link" :href="link('contribute.html')"
          >{{ t("参加・貢献のしかた", "Ways to contribute") }} ↗</a
        >
      </div>
      <div class="resource-links">
        <a :href="link('whitepaper.html')"
          ><span class="resource-icon">↗</span>
          <div>
            <span class="section-kicker">WHITEPAPER</span>
            <h3>{{ t("ZK Fukuoka の構想", "The ZK Fukuoka vision") }}</h3>
            <p>
              {{
                t(
                  "目指す未来、学びの方針、コミュニティのかたち。",
                  "Our purpose, learning approach, and community model.",
                )
              }}
            </p>
          </div>
          <span>→</span></a
        ><a :href="link('adr/')"
          ><span class="resource-icon">≡</span>
          <div>
            <span class="section-kicker">DECISION LOG / ADR</span>
            <h3>
              {{
                t(
                  "選んだ理由を、残していく。",
                  "Keep the why, not just the what.",
                )
              }}
            </h3>
            <p>
              {{
                t(
                  "技術と運営の意思決定を、背景とともに記録。",
                  "The context behind our technical and community decisions.",
                )
              }}
            </p>
          </div>
          <span>→</span></a
        >
      </div>
    </section>
    <section class="join-band">
      <span class="join-spark">✳</span>
      <div>
        <span class="section-kicker">YOUR NEXT CHAPTER STARTS HERE</span>
        <h2>
          {{
            t(
              "最初の一歩は、好奇心でいい。",
              "Curiosity is a great first step.",
            )
          }}
        </h2>
        <p>
          {{
            t(
              "福岡を拠点に、学びをひらく。開催日程・参加方法は準備が整い次第お知らせします。",
              "Rooted in Fukuoka, open to learning together. Event dates and participation details will be announced when ready.",
            )
          }}
        </p>
      </div>
      <a class="button dark-button" :href="link('contribute.html')"
        >{{ t("コミュニティに関わる", "Get involved") }} ↗</a
      >
    </section>
    <footer class="home-footer">
      <a :href="link('')">ZK Fukuoka<span>LEARN. PROVE. BUILD.</span></a
      ><span>{{
        t("福岡から、証明のその先へ。", "From Fukuoka, with curiosity.")
      }}</span
      ><span>EST. {{ t("設立準備中", "IN FORMATION") }}</span>
    </footer>
  </main>
</template>
