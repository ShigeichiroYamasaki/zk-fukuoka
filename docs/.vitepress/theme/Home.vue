<script setup>
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import { lessons } from "./lessons";
const acts = [
 { ja: "幕I · 目的と動機", en: "Act I · Goals and motivations", start: 1, end: 2 },
 { ja: "幕II · 道具立て", en: "Act II · Tools", start: 3, end: 10 },
 { ja: "幕III · 統合", en: "Act III · Integration", start: 11, end: 15 },
];
const rollupChapters = [
  { path: '01-ledger', ja: '残高台帳と保存則', en: 'Ledger and conservation' },
  { path: '02-state', ja: 'Merkle木と状態ルート', en: 'Merkle trees and state roots' },
  { path: '03-circuit', ja: '署名と送金回路', en: 'Signatures and transfer circuits' },
  { path: '04-batches', ja: 'バッチ証明と公開入力', en: 'Batch proofs and public inputs' },
  { path: '05-bridge', ja: 'ERC-20とL1検証', en: 'ERC-20 and L1 verification' },
  { path: '06-availability', ja: 'データ公開・退出・総合テスト', en: 'Data availability, exits and testing' },
];
const { lang } = useData();
const en = computed(() => lang.value === "en");
const link = (s) => withBase((en.value ? "/en/" : "/") + s);
const t = (ja, english) => (en.value ? english : ja);
</script>
<template>
  <main class="zk-home">
    <section class="share-hero">
      <h1 class="sr-only">{{ t('ZK Fukuoka ゼロ知識証明技術者になろう', 'ZK Fukuoka — Become a zero-knowledge engineer.') }}</h1>
      <img class="share-hero-image" :src="withBase('/social/zk-fukuoka-' + (en ? 'en' : 'ja') + '.png')" width="1200" height="630" fetchpriority="high" :alt="t('ZK Fukuoka．ゼロ知識証明技術者になろう．福岡で数学を学び，コードを書き，仲間とつくる．全15回の授業資料・演習・ZK rollup・ZKML．', 'ZK Fukuoka. Become a zero-knowledge engineer. Learn the math, write the code, and build together in Fukuoka. 15 lectures, exercises, ZK rollup and ZKML.')" />
      <div class="hero-actions share-hero-actions">
        <a class="button primary" href="#lesson-materials">{{ t('授業資料を見る', 'Browse lecture materials') }} ↗</a>
        <a class="text-link" :href="link('learn/session-01.html')">{{ t('第1回の資料を読む', 'Read Session 1') }} →</a>
        <a class="text-link share-download" :href="withBase('/social/zk-fukuoka-' + (en ? 'en' : 'ja') + '.png')" download>{{ t('案内用画像を保存', 'Download share image') }} ↓</a>
      </div>
    </section>
    <div class="manifesto-strip">
      <span>LEARN THE MATH</span><b>✳</b><span>WRITE THE CODE</span><b>✳</b
      ><span>SHARE THE PROOF</span><b>✳</b><span>BUILD WITH FRIENDS</span>
    </div>
    <section id="lesson-materials" class="learn-section section-pad">
      <div class="section-heading">
        <div>
          <span class="section-kicker">01 / LEARNING PATH</span>
          <h2>
            {{
              t("各回の授業資料", "Lecture materials")
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
            "全15回の資料をここから。公開済みの講義は本文へ、準備中の回はシラバスの概要へ進めます。",
            "Find all 15 sessions here. Published lectures open directly; upcoming sessions link to their syllabus outlines.",
          )
        }}
        <span class="draft-label">{{
          t("カリキュラム案", "DRAFT CURRICULUM")
        }}</span>
      </p>
      <nav class="lesson-shortcuts" :aria-label="t('学習コンテンツの索引', 'Learning indexes')">
        <a :href="link('learn/')">{{ t('シラバス', 'Syllabus') }} ↗</a>
        <a :href="link('learn/topics.html')">{{ t('トピック別インデックス', 'Topic index') }} ↗</a>
        <a :href="link('learn/foundations.html')">{{ t('初学者向け・前提知識と補助教材', 'Beginner prerequisites & resources') }} ↗</a>
        <a :href="link('rollup/')">{{ t('応用編・ERC-20のZK rollupを作る', 'Applied course: build an ERC-20 ZK rollup') }} ↗</a>
        <a :href="link('zkml/')">{{ t('応用編・入力を隠したAI推論', 'Applied course: private-input AI inference') }} ↗</a>
        <a :href="link('tipping/')">{{ t('応用編・JPKIワレットでプライバシーを守る投げ銭', 'Applied course: privacy-preserving tips with a JPKI wallet') }} ↗</a>
        <a :href="link('data-minimization/')">{{ t('応用編・ZK属性証明で個人情報の保管を減らす', 'Applied course: reduce stored personal data with ZK attributes') }} ↗</a>
        <a :href="link('exercises/')">{{ t('演習・ツール・マニュアル', 'Exercises, tools & manuals') }} ↗</a>
      </nav>
      <p class="lesson-scroll-hint">{{ t('一覧内をスクロールして全15回を確認できます。', 'Scroll within the list to browse all 15 sessions.') }}</p>
      <div class="lesson-directory" tabindex="0" role="region" :aria-label="t('全15回の授業資料一覧', 'All 15 lecture sessions')">
        <section v-for="act in acts" :key="act.start" class="lesson-act">
          <h3>{{ t(act.ja, act.en) }} <span>{{ act.start }}–{{ act.end }}</span></h3>
          <ul>
            <li v-for="lesson in lessons.filter(item => item.number >= act.start && item.number <= act.end)" :key="lesson.number">
              <a :href="link(lesson.material || 'learn/#session-' + lesson.number)" class="lesson-row" :class="{ published: lesson.material }">
                <span class="lesson-number">{{ t('第' + lesson.number + '回', 'Session ' + lesson.number) }}</span>
                <span class="lesson-title">{{ t(lesson.ja, lesson.en) }}</span>
                <span class="lesson-action"><span class="lesson-status">{{ lesson.material ? t('公開済み', 'Published') : t('準備中', 'Coming soon') }}</span><span>{{ lesson.material ? t('資料を読む', 'Read lecture') : t('概要を見る', 'View outline') }} ↗</span></span>
              </a>
            </li>
          </ul>
        </section>
      </div>
    </section>
    <section id="applied-course" class="applied-section section-pad" aria-labelledby="applied-title">
      <div class="section-heading">
        <div>
          <span class="section-kicker">02 / APPLIED COURSE</span>
          <h2 id="applied-title">{{ t('応用編：ERC-20のZK rollupを作る', 'Applied course: build an ERC-20 ZK rollup') }}</h2>
        </div>
        <a class="text-link" :href="link('rollup/')">{{ t('応用編の全体像を見る', 'Explore the applied course') }} ↗</a>
      </div>
      <p class="section-intro">{{ t('全15回で学んだ技術を、入金・送金・出金のあるシステムへ。参照モデルと入門回路を動かしながら、6段階で状態遷移の証明、L1検証、データ公開と退出の実装に取り組みます。', 'Put the 15 lectures into practice with deposits, transfers and withdrawals. Run the reference model and introductory circuit, then work through six stages of state-transition proofs, L1 verification, data availability and exits.') }}</p>
      <nav class="applied-chapters" :aria-label="t('応用編の各章', 'Applied course chapters')">
        <a v-for="(chapter, index) in rollupChapters" :key="chapter.path" :href="link('rollup/' + chapter.path + '.html')">
          <span class="applied-number">0{{ index + 1 }}</span>
          <span>{{ t(chapter.ja, chapter.en) }}</span>
          <span aria-hidden="true">→</span>
        </a>
      </nav>
    </section>
    <section id="applied-zkml" class="applied-section section-pad" aria-labelledby="zkml-title">
      <div class="section-heading">
        <div>
          <span class="section-kicker">03 / APPLIED COURSE · ZKML</span>
          <h2 id="zkml-title">{{ t('応用編：入力を隠したAI推論を検証する', 'Applied course: verify private-input AI inference') }}</h2>
        </div>
        <a class="text-link" :href="link('zkml/')">{{ t('ZKMLの実装例を見る', 'Explore the ZKML implementation') }} ↗</a>
      </div>
      <p class="section-intro">{{ t('小さな分類モデルを学習し、入力を公開せずに推論結果の正しさを証明します。Python・Circom・Groth16で動かすコードと、改ざんを拒否するテストを用意しました。', 'Train a small classifier and prove its inference without revealing the input. Run the Python, Circom and Groth16 example, including tampering tests.') }}</p>
      <nav class="applied-chapters" :aria-label="t('ZKML応用編', 'ZKML applied course')">
        <a :href="link('zkml/')"><span class="applied-number">START</span><span>{{ t('何を隠し、何を証明するか', 'What is private, what is proven') }}</span><span aria-hidden="true">→</span></a>
        <a :href="link('zkml/01-model.html')"><span class="applied-number">01</span><span>{{ t('モデルの学習と算術化', 'Training and arithmetization') }}</span><span aria-hidden="true">→</span></a>
        <a :href="link('zkml/02-proof.html')"><span class="applied-number">02</span><span>{{ t('証明生成・検証と配布コード', 'Proving, verification and code') }}</span><span aria-hidden="true">→</span></a>
      </nav>
    </section>
    <section id="applied-data-minimization" class="applied-section section-pad" aria-labelledby="data-minimization-title">
      <div class="section-heading">
        <div>
          <span class="section-kicker">04 / APPLIED COURSE · PRIVACY</span>
          <h2 id="data-minimization-title">{{ t('応用編：ZK属性証明でランサムウェア被害を抑える', 'Applied course: reduce ransomware impact with ZK attributes') }}</h2>
        </div>
        <a class="text-link" :href="link('data-minimization/')">{{ t('教材を読む', 'Explore the lesson') }} ↗</a>
      </div>
      <p class="section-intro">{{ t('利用資格や年齢条件を満たすことだけを証明し，サービス側に本人確認書類や生年月日を重ねて保管しない設計を考えます。攻撃を止めるのではなく，侵入後に持ち出される個人情報を減らす演習です。', 'Prove only eligibility or an age threshold, without copying identity documents or dates of birth into every service. This exercise reduces personal data exposed after a breach; it does not stop ransomware.') }}</p>
      <nav class="applied-chapters" :aria-label="t('個人情報最小化の応用編', 'Data-minimization applied course')">
        <a :href="link('data-minimization/')"><span class="applied-number">START</span><span>{{ t('設計例・情報の流れ・演習', 'Design, data flows and exercise') }}</span><span aria-hidden="true">→</span></a>
      </nav>
    </section>
    <section class="community-section section-pad">
      <div class="community-copy">
        <span class="section-kicker">05 / OPEN BY DESIGN</span>
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
