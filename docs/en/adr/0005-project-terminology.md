# ADR-0005 · Project-wide terminology and Japanese translations

- Date: 2026-10-12
- Last updated: October 20, 2026
- Status: Proposed and reflected on the site; community ratification pending

## Context

The lessons, exercises, supplementary materials, and applied courses are authored in Japanese and English. Using different Japanese translations for the same cryptographic or complexity-theoretic concept makes it harder to follow ideas across pages. However, mechanically collapsing terms with distinct roles in logic into one translation can also make the meaning ambiguous.

## Decision

Use the following preferred Japanese terms throughout the project. Where helpful, give the English term at first use. Add a short explanation whenever a translation alone does not preserve a distinction needed by a definition or formula.

| English | Preferred Japanese | Usage |
| --- | --- | --- |
| proposition | 命題 | An object in logic or mathematics whose truth can be evaluated. |
| assertion | 言明 | An act or expression of stating whether a proposition is true or false; do not conflate it with the proposition itself. |
| claim | 主張 | A claim made in explanatory prose. Use proposition／命題 for a formal logical object. |
| witness | ウィットネス | A value $w$ supplied to establish that a proposition specified by a relation such as $R(x,w)$ is true. Do not use 証人. |
| extractor | 抽出器 | An algorithm that extracts a witness from a prover's execution. Do not use 抽出者. |
| knowledge extraction | 知識の抽出 | The property or process of extracting a witness with an extractor. |
| knowledge soundness | 知識の健全性 | The property relating an accepted proof to knowledge of a witness. |
| completeness | 完全性 | The property that an honest prover's proof is accepted when the required condition holds. |
| soundness | 健全性 | The property that limits acceptance of false statements or invalid proofs. |
| soundness error | 健全性誤差 | An upper bound on the probability that an invalid proof is accepted. |
| soundness amplification | 健全性増幅 | Reducing soundness error, for example through protocol repetition. |
| simulator paradigm | シミュレータパラダイム | The zero-knowledge approach that compares the distinguishability of real prover interactions with simulations generated without the secret. |
| simulator | シミュレータ | In a zero-knowledge definition, an algorithm that generates a transcript without knowing the secret. |
| trusted setup | トラステッドセットアップ | An initial setup that requires the secret trapdoor to be generated and managed appropriately. Do not use 信頼設定. |
| folding | フォールディング | An operation that progressively combines polynomials or proof instances. Do not use 折り畳み or 畳み込み for this meaning. |
| polynomial divisibility | 多項式の整除性 | The relation in which one polynomial is divisible by another. Do not use 割り切れ性. |
| probability distribution | 確率分布 | A specification of the probabilities with which a random variable takes values. Do not shorten it to 分布 when the probabilistic meaning is intended. |
| negligible function | 無視可能関数 | A nonnegative function that is eventually smaller than $1/p(n)$ for every positive polynomial $p(n)$. Do not use 無視できる関数 as the term name. Describe a probability, distance, or difference as 無視可能である. |
| hash function | ハッシュ関数 | A general function that maps arbitrary-length inputs to fixed-length outputs. Call one used for cryptographic purposes a 暗号学的ハッシュ関数. |
| cryptographic hash function | 暗号学的ハッシュ関数 | A hash function used in cryptographic protocols with expected properties such as collision resistance. Use this full term rather than ハッシュ関数 alone for cryptographic use. |
| view | ビュー | In zero-knowledge discussions, the complete information available to the verifier during a protocol, including its own input and randomness and the messages it receives. Use ビュー in Japanese prose. |
| prover | 証明者 | The party that generates a proof. |
| verifier | 検証者 | The party that checks a proof. |
| commitment | コミットメント | A cryptographic construction that binds a value against later change and, depending on the scheme, hides its contents. |
| probability space | 確率空間 | The triple consisting of a sample space, a collection of events, and a probability measure on those events. |
| probability measure | 確率測度 | A function assigning probabilities to events in a sample space. |
| experiment / trial | 確率実験／試行 | A procedure whose outcome is probabilistic, or one execution of that procedure. |
| sample space | 標本空間 | The set of all possible outcomes of a probability experiment. |
| event | 事象 | A subset of the sample space whose probability is considered. |
| random variable | 確率変数 | A function that maps outcomes in a sample space to values, such as numbers. |
| probability distribution | 確率分布 | The law assigning probabilities to the values or events of a random variable. Do not shorten this to 分布 in probabilistic contexts. A probability mass function, probability density function, and cumulative distribution function are different functions representing a probability distribution. |
| probability mass function (PMF) | 確率質量関数 | A function giving the probabilities that a discrete random variable takes each value. |
| probability density function (PDF) | 確率密度関数 | A function representing the distribution of a continuous random variable by its density. A density value is not itself the probability of a single point. |
| cumulative distribution function (CDF) | 累積分布関数 | For a real-valued random variable, the function $F(x)=\Pr[X\le x]$. Do not confuse it with the general term probability distribution. |
| joint distribution | 同時確率分布 | The law assigning probabilities to values taken jointly by multiple random variables. |
| marginal distribution | 周辺確率分布 | The distribution of one or some variables obtained by marginalizing a joint distribution over the others. |
| conditional probability | 条件付き確率 | The probability of an event under the condition that another event has occurred. |
| multiplication rule / chain rule | 積の公式／連鎖律 | A formula decomposing the probability of joint events into a product of conditional probabilities. When analyzing protocol randomness or repetition, state the conditioning explicitly. |
| law of total probability | 全確率の法則 | A law for obtaining an overall probability by summing conditional probabilities weighted by a partition of the sample space. |
| Bayes' theorem | ベイズの定理 | A relation for computing conditional probabilities of causes or hypotheses given an observed result. |
| independence | 独立性 | A relation in which information about one event or random variable does not change the probability law of another. For multiple objects, distinguish pairwise from mutual independence. |
| expectation | 期待値 | The probability-weighted average of a random variable's values. Linearity of expectation does not require independence. |
| variance | 分散 | The expectation $\mathbb{E}[(X-\mathbb{E}[X])^2]$, measuring a random variable's spread around its expectation. |
| Bernoulli random variable | ベルヌーイ確率変数 | A random variable taking values 0 or 1, with 1 representing a designated event such as success. |
| indicator random variable | 指示確率変数 | A random variable equal to 1 when an event occurs and 0 otherwise. |
| union bound | 和事象の上界 | An inequality bounding the probability of a union of events by the sum of their probabilities; it does not require independence. |
| Markov's inequality | マルコフの不等式 | An inequality that bounds an upper-tail probability using the expectation of a nonnegative random variable. |
| Chebyshev's inequality | チェビシェフの不等式 | An inequality that bounds deviation probabilities around the expectation using variance. |
| Hoeffding's inequality | Hoeffdingの不等式 | An inequality bounding additive deviations of sums or averages of independent bounded random variables. |
| Chernoff bound | チェルノフ上界 | An upper bound on relative deviations from the expectation, commonly for sums of independent Bernoulli random variables. |
| birthday bound | 誕生日バウンド | An upper bound on the probability of at least one collision when values are sampled repeatedly from a finite uniform set. |
| distinguisher | 識別器 | A randomized procedure that receives an observation and predicts its source or another property. |
| distinguishing advantage | 識別能力（出力確率差） | The absolute difference between the probabilities that a distinguisher outputs 1 in two probability experiments. It is distinct from statistical significance in hypothesis testing. |
| output-probability difference | 出力確率差 | The difference between the probabilities that a specified distinguisher returns a designated output in two experiments. This is the measure used here to define distinguishing power. |
| computational indistinguishability | 計算量的識別不能性 | A property requiring every probabilistic polynomial-time distinguisher to have negligible distinguishing power between two experiments as the security parameter grows. |
| total variation distance | 全変動距離 | A distance between discrete probability distributions, equal to maximum distinguishing power on a finite sample space. Distinguish it from statistical distance in general; specify the distance used for continuous distributions or other settings. |
| almost-sure equality | ほとんど確実な等しさ | Equality of two random variables with probability 1. Distinguish it from equality at every sample point and from equality of distributions. |
| equality in distribution | 確率分布の等しさ（同分布） | Equality of the probability distributions of random variables. It does not mean their values agree pointwise. |
| chi-square test | χ²検定 | A statistical test comparing observed counts with expected counts under a null hypothesis. It examines a particular empirical difference; it does not prove indistinguishability against all distinguishers. |
| p-value | p値 | Under a null hypothesis, the probability of obtaining a test statistic at least as extreme as the observed one. It is not the probability that the null hypothesis is true. |
| statistical significance | 統計的有意性 | A conclusion based on the criterion of a specified statistical test. Do not conflate it with cryptographic distinguishing power or output-probability difference. |
| confidence level | 信頼水準 | A repeated-sampling guarantee about the proportion of intervals constructed by a procedure that contain the true value. It does not assign a probability to an unknown parameter. |
| security parameter | 安全性パラメータ | An integer parameter used to asymptotically evaluate cryptographic input lengths, computational resources, and probability guarantees. |
| perfect zero-knowledge | 完全ゼロ知識 | Zero-knowledge in which the real verifier view and the simulator's record have exactly the same probability distribution. |
| statistical zero-knowledge | 統計的ゼロ知識 | Zero-knowledge in which the total variation distance or other specified statistical distance between the real view and simulated record is negligible. |
| computational zero-knowledge | 計算量的ゼロ知識 | Zero-knowledge in which every probabilistic polynomial-time distinguisher has negligible distinguishing power between the real view and simulated record. |

## Process

When adding a term or changing a preferred translation, update this ADR first and align Japanese and English usage. Then search lessons, figures, tables, supplementary materials, exercises, and applied courses, updating prose and diagram labels in the same change. Do not apply blind global replacements when the original meaning or protocol-specific definition depends on context.

## Consequences and review

Preferred terms reduce variation across pages and help beginners track concepts consistently. Revise this ADR with the rationale and affected scope if disciplinary usage changes or a preferred translation is found to cause confusion.

[Back to ADR index](./)
