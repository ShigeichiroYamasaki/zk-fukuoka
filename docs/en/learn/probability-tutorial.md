# Probability: foundations for learning ZK

Author: Shigeichiro Yamasaki  
Created: September 29, 2026  
Last updated: October 14, 2026

Zero-knowledge proofs repeatedly use ideas such as “find an error at a random point,” “make the probability of accepting a false proof small,” and “reduce the error probability by repeating a protocol.” This page starts with events and random variables, then develops conditional probability, independence, expectation, and probability inequalities. It next applies them to distinguishing distributions from samples, randomized checks, and soundness amplification.

The explanations and examples are original to this site. For systematic study of probability, see Sheldon M. Ross’s [A First Course in Probability (Pearson)](https://www.pearson.com/en-us/subject-catalog/p/Ross-First-Course-in-Probability-A-10th-Edition/P200000006334/9780137504589). This tutorial does not reproduce or adapt that textbook; it selects foundational ideas used in this course.

## 1. Experiments, sample spaces, and events

An operation whose outcome is uncertain is a **random experiment**. The set of all possible outcomes is the **sample space** $\Omega$, and any subset of $\Omega$ is an **event**. The probability $\Pr[A]$ of an event $A$ is the chance that the outcome lies in $A$.

If one element is selected uniformly from a finite set $\Omega$, then

$$
\Pr[A]=\frac{|A|}{|\Omega|}.
$$

For example, choose $r$ uniformly from $S=\{0,1,2,3,4,5,6,7,8,9\}$. For $A=\{0,2,4,6,8\}$, we have $\Pr[r\in A]=5/10=1/2$. Whenever we say “choose at random,” we must specify the set and probability distribution used for the choice.

The complement of $A$ is written $A^c$. The event that $A$ or $B$ occurs is $A\cup B$; the event that both occur is $A\cap B$. Basic identities include

$$
\Pr[A^c]=1-\Pr[A],\qquad
\Pr[A\cup B]=\Pr[A]+\Pr[B]-\Pr[A\cap B].
$$

In particular, $\Pr[A\cup B]\leq\Pr[A]+\Pr[B]$. This **union bound** applies even when the events are dependent. It is useful when bounding the total failure probability by adding bounds for individual failure events.

## 2. Random variables and probability distributions

A **random variable** $X$ is a function that assigns a numerical value $X(\omega)$ to each experiment outcome $\omega\in\Omega$. The variable itself is not moving randomly; it is a tool for describing a quantity whose value depends on the random outcome.

For example, choose $r$ uniformly from $S=\{0,1,\ldots,9\}$ and define $X=r\bmod 2$. Then $X$ takes values $0$ and $1$, each with probability $1/2$. The assignment of probabilities $\Pr[X=x]$ to possible values $x$ is the **probability distribution** of $X$. For a discrete random variable, it can be written as the probability mass function $p_X(x)=\Pr[X=x]$. These probabilities are nonnegative and sum to $1$ over all possible values. In this example, $p_X(0)=p_X(1)=1/2$.

### Joint and marginal distributions

When two random variables $X,Y$ are defined on the same experiment, the probability of each pair $(x,y)$,

$$
p_{X,Y}(x,y)=\Pr[X=x\;\text{and}\;Y=y],
$$

is their **joint probability distribution**. The individual distributions $p_X,p_Y$ are the **marginal probability distributions**. They are obtained by summing the joint probabilities over the other variable:

$$
p_X(x)=\sum_y p_{X,Y}(x,y),\qquad p_Y(y)=\sum_x p_{X,Y}(x,y).
$$

Equal marginals do not imply equal joint distributions. Consider two processes that output a pair of bits. Process A outputs $00$ and $11$, each with probability $1/2$. Process B outputs $01$ and $10$, each with probability $1/2$. In either process, each bit individually is $0$ or $1$ with probability $1/2$, but the joint distributions differ. Testing whether the two bits are equal distinguishes the processes perfectly.

Thus individual probability distributions may fail to capture dependence or information in the complete record. Zero-knowledge compares the verifier’s complete view as a random variable.

## 3. Conditional probability and independence

When $\Pr[B]>0$, the probability of $A$ given that $B$ has occurred is the **conditional probability**

$$
\Pr[A\mid B]=\frac{\Pr[A\cap B]}{\Pr[B]}.
$$

It describes whether knowing that $B$ occurred changes the chance of $A$.

Events $A$ and $B$ are **independent** if knowing that $B$ occurred does not change the probability of $A$; that is,

$$
\Pr[A\mid B]=\Pr[A]
$$

(equivalently, $\Pr[A\cap B]=\Pr[A]\Pr[B]$). For independent repeated trials, the probability that every trial fails can be computed as a product. Do not multiply probabilities without establishing independence.

Random variables $X,Y$ are independent exactly when their joint probability distribution factors into the product of their marginal distributions: $p_{X,Y}(x,y)=p_X(x)p_Y(y)$.

In cryptographic protocols, the order of choices can matter. For example, a prover may commit first and the verifier may choose a random challenge afterward. This differs from a setting where the prover sees the challenge before choosing its commitment. The probability analysis depends on what is fixed first and which random choices are visible to whom.

## 4. Expectation and probability inequalities

If a discrete random variable $X$ takes value $x$ with probability $p_x$, its **expectation** is

$$
\mathbb{E}[X]=\sum_x x\,p_x.
$$

Expectation is a long-run average; it does not mean that every individual trial produces that value.

For a uniformly random bit $X$, for example, $\mathbb{E}[X]=0\cdot\frac12+1\cdot\frac12=\frac12$.

### Representing the number of failures with indicator variables

A **Bernoulli trial** is an experiment whose outcome is classified as either success or failure. Its success probability may be $p$ and its failure probability $1-p$. Calling an experiment a Bernoulli trial does not, by itself, mean that multiple trials are independent; independence must be stated separately when an argument needs it.

Let $I_i=1$ if trial $i$ fails, and $I_i=0$ if it succeeds. This random variable is an **indicator variable** for failure and is a Bernoulli random variable taking values 0 and 1. If the failure probability on trial $i$ is $p_i$, then

$$
\mathbb{E}[I_i]=0\cdot(1-p_i)+1\cdot p_i=p_i=\Pr[\text{trial $i$ fails}].
$$

The number of failures $F$ in $k$ trials is the sum of these individual 0/1 counts:

$$
F=I_1+I_2+\cdots+I_k.
$$

Therefore, by linearity of expectation,

$$
\mathbb{E}[F]=\sum_{i=1}^{k}\mathbb{E}[I_i]=\sum_{i=1}^{k}p_i.
$$

For example, if three checks have failure probabilities $0.1$, $0.02$, and $0.01$, their expected number of failures is $0.1+0.02+0.01=0.13$. This calculation does not require the trials to be independent. By contrast, calculating the probability of at least one failure as $1-\prod_i(1-p_i)$ does require independence of the failure events. A small expected number of failures alone does not prove that a particular execution will never fail.

### Markov's inequality: bounding an upper tail from the mean

Let $X$ be a nonnegative random variable with finite expectation, and let $a>0$. On the event $X\ge a$, the value of $X$ is at least $a$, so its expectation is at least $a$ times the probability of that event. Therefore,

$$
\Pr[X\ge a]\leq\frac{\mathbb{E}[X]}{a}.
$$

This is **Markov's inequality**. It uses only the expectation, with no assumption about the distribution's shape or independence. For example, let $F$ count failures in 20 checks, each with failure probability $0.01$. Linearity of expectation gives $\mathbb{E}[F]=0.2$, even without independence. Hence the probability of at least four failures is at most $\Pr[F\ge4]\le0.2/4=0.05$. This bound can be conservative and larger than the actual probability.

### Chebyshev's inequality: bounding deviations from the mean

If a random variable $X$ has expectation $\mu$ and finite variance $\sigma^2=\mathbb{E}[(X-\mu)^2]$, then for every $t>0$,

$$
\Pr[|X-\mu|\ge t]\leq\frac{\sigma^2}{t^2}.
$$

This is **Chebyshev's inequality**. It follows by applying Markov's inequality to $Y=(X-\mu)^2$; it bounds the probability of a large deviation using the variance. For example, after 100 fair coin tosses, the observed fraction of heads $\widehat p$ has expectation $0.5$ and variance $0.25/100=0.0025$. Thus $\Pr[|\widehat p-0.5|\ge0.1]\le0.0025/0.1^2=0.25$. For an average of independent, identically distributed samples, the variance decreases in proportion to $1/n$, improving this bound as the sample count grows.

### Hoeffding's inequality: bounding additive deviations of bounded variables

Suppose independent random variables $X_1,\ldots,X_n$ satisfy $a_i\le X_i\le b_i$. For their sum $S=\sum_i X_i$ and any $t>0$, the upper-tail probability is bounded by

$$
\Pr[S-\mathbb{E}[S]\ge t]\le\exp\!\left(-\frac{2t^2}{\sum_i(b_i-a_i)^2}\right).
$$

For deviations in either direction, multiply the right-hand side by $2$. This is **Hoeffding's inequality**. It needs independence and bounds on the variables, but not their detailed distributions. Since it measures deviation by a specified absolute amount $t$, it is useful for **additive deviations**.

For example, in 100 independent trials with success probability $0.1$, the success count $S$ has expectation 10. Reaching at least 20 successes means exceeding the expectation by 10. Since each indicator $X_i$ lies in $[0,1]$, Hoeffding gives

$$
\Pr[S\ge20]\le\exp\!\left(-\frac{2\cdot10^2}{100}\right)=e^{-2}\approx0.135.
$$

The later section on statistical identification uses this inequality to bound how far the average of a distinguisher's 0/1 outputs can be from its true output probability.

### Chernoff bounds: controlling relative deviations in independent trials

Let $X_1,\ldots,X_n$ be independent Bernoulli random variables (each taking value 0 or 1), let $X=\sum_i X_i$, and write $\mu=\mathbb{E}[X]$. For every $\delta>0$, the upper tail satisfies

$$
\Pr[X\ge(1+\delta)\mu]\le\left(\frac{e^\delta}{(1+\delta)^{1+\delta}}\right)^\mu\le\exp\!\left(-\frac{\mu\delta^2}{2+\delta}\right).
$$

For $0<\delta<1$, the lower tail satisfies

$$
\Pr[X\le(1-\delta)\mu]\le\exp\!\left(-\frac{\mu\delta^2}{2}\right).
$$

These are **Chernoff bounds**. The proof applies Markov's inequality to $e^{\lambda X}$, factors the expectation using independence of the $X_i$, and chooses a suitable $\lambda$. The bounds control a **relative (multiplicative) deviation** from the mean $\mu$.

For example, run 100 independent trials, each succeeding with probability $0.1$. The success count $X$ has mean $\mu=10$. At least 20 successes means $X\ge2\mu$, so the upper-tail bound with $\delta=1$ gives

$$
\Pr[X\ge20]\le e^{-10/3}\approx0.036.
$$

This is an upper bound, not the actual probability. Hoeffding's inequality gives $e^{-2}\approx0.135$ for the same event. Chernoff uses the Bernoulli setting and the mean to bound a relative deviation more tightly here, yielding $e^{-10/3}\approx0.036$. Hoeffding applies more broadly to sums of independent bounded variables. Markov uses only the expectation, while Chebyshev also uses the variance; choose among them by balancing assumptions against the tightness of the bound.

## 5. Distinguishing probability distributions

This section applies the random variables and expectations from the previous sections to comparing probability distributions. A sample $z$ is drawn from one of two distributions $P_0,P_1$, and a distinguisher $D$ predicts its source. Output $1$ means “from $P_1,” and output $0$ means “from $P_0.” The prediction may be wrong, and $D$ may use internal randomness.

### Original definition: compare output probabilities in two experiments

Cryptography defines this comparison using **two separate experiments**, not two decisions on one sample. For distribution ensembles $X_n,Y_n$ indexed by a security parameter $n$, Goldreich defines the difference for an algorithm $A$ as

$$
d_A(n)=\left|\Pr[A(X_n)=1]-\Pr[A(Y_n)=1]\right|
$$

([Goldreich, *Foundations of Modern Cryptography*, Definition 1.2, §1.2.2](https://www.wisdom.weizmann.ac.il/~oded/PDF/mcppp-v2.pdf)). In each probability, a sample is drawn from the indicated ensemble and the algorithm is run; if it is randomized, its coins are included. Goldreich calls the ensembles computationally indistinguishable when this difference is negligible in $n$ for every probabilistic polynomial-time algorithm.

Now fix $n$ and write the corresponding pair of distributions as $P_0,P_1$. Let $q_i$ be the probability that $D$ outputs $1$ in the separate experiment using $P_i$:

$$
q_0=\Pr_{z\sim P_0}[D(z)=1],\qquad q_1=\Pr_{z\sim P_1}[D(z)=1].
$$

In this notation, Goldreich’s definition becomes the **output-probability difference**

$$
d_D(P_0,P_1)=|q_0-q_1|=\left|\Pr_{z\sim P_0}[D(z)=1]-\Pr_{z\sim P_1}[D(z)=1]\right|.
$$

Here $q_0$ is the false-positive rate (a sample from $P_0$ is labeled as $P_1$), and $q_1$ is the true-positive rate (a sample from $P_1$ is labeled as $P_1$). Thus the output-probability difference is their absolute difference.

| Actual source of sample | Probability that the distinguisher outputs 1 | Meaning |
| --- | --- | --- |
| $P_0$ | $q_0$ | False-positive rate: incorrectly classifies $P_0$ as $P_1$ |
| $P_1$ | $q_1$ | True-positive rate: correctly classifies $P_1$ as $P_1$ |

A difference of $0$ means that this distinguisher’s output alone cannot distinguish the two experiments. A difference of $1$ means it outputs $1$ with certainty in one experiment and $0$ with certainty in the other, so it separates them perfectly. This quantity is not a statistical significance level or a $p$-value, nor is it itself a classification accuracy. If the source $P_0$ or $P_1$ is selected uniformly and the labels are assigned in the favorable direction, the best accuracy is $1/2+d_D(P_0,P_1)/2$.

### Example: compare distributions through a distinguisher’s output

Consider a sample consisting of two bits. Let $P_0$ output $00$ and $11$ with probability $1/2$ each, and let $P_1$ output $01$ and $10$ with probability $1/2$ each.

| Sample $z$ | $P_0(z)$ | $P_1(z)$ |
| --- | ---: | ---: |
| $00$ | $1/2$ | $0$ |
| $01$ | $0$ | $1/2$ |
| $10$ | $0$ | $1/2$ |
| $11$ | $1/2$ | $0$ |

Let distinguisher $D_{\ne}$ output 1 exactly when the two bits differ. A sample from $P_0$ always has equal bits, so $q_0=\Pr_{z\sim P_0}[D_{\ne}(z)=1]=0$. A sample from $P_1$ always has different bits, so $q_1=\Pr_{z\sim P_1}[D_{\ne}(z)=1]=1$. Thus the output-probability difference is $|q_1-q_0|=1$, and this distinguisher perfectly separates the distributions. By contrast, distinguisher $D_{\mathrm{first}}$ outputs 1 only when the first bit is 0. Under either distribution, this happens with probability $1/2$, so $q_0=q_1=1/2$ and the difference is 0. The same pair of probability distributions can therefore produce different output-probability differences depending on which feature the distinguisher tests.

### Example: distinguishing distributions on four values

Let a sample be one of $z\in\{0,1,2,3\}$. In this example, $P_0$ tends to produce smaller values and $P_1$ tends to produce larger values. Each column sums to 1.

| Sample value $z$ | $P_0(z)$ | $P_1(z)$ |
| ---: | ---: | ---: |
| 0 | 0.50 | 0.10 |
| 1 | 0.30 | 0.20 |
| 2 | 0.15 | 0.30 |
| 3 | 0.05 | 0.40 |

<figure>
<svg viewBox="0 0 640 350" role="img" aria-labelledby="dist-chart-title dist-chart-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:720px;height:auto;margin:0 auto;background:#fff;border:1px solid #d1d5db;border-radius:12px">
  <title id="dist-chart-title">Two probability distributions and the region where the distinguisher outputs one</title>
  <desc id="dist-chart-desc">Probability mass at values zero through three, with P0 in purple and P1 in blue. The pale orange region contains values two and three, where the distinguisher outputs 1 to classify the sample as coming from P1. The probability of this region is 0.2 under P0 and 0.7 under P1.</desc>
  <rect x="342" y="55" width="248" height="225" fill="#fff4d6"/>
  <text x="466" y="73" text-anchor="middle" font-size="14" fill="#7c4a03" font-family="system-ui, sans-serif">D(z)=1 region: z≥2</text>
  <g stroke="#d1d5db" stroke-width="1"><line x1="92" y1="280" x2="590" y2="280"/><line x1="92" y1="240" x2="590" y2="240"/><line x1="92" y1="200" x2="590" y2="200"/><line x1="92" y1="160" x2="590" y2="160"/><line x1="92" y1="120" x2="590" y2="120"/><line x1="92" y1="80" x2="590" y2="80"/></g>
  <g font-family="system-ui, sans-serif" font-size="12" fill="#374151" text-anchor="end"><text x="82" y="284">0.0</text><text x="82" y="244">0.1</text><text x="82" y="204">0.2</text><text x="82" y="164">0.3</text><text x="82" y="124">0.4</text><text x="82" y="84">0.5</text></g>
  <g fill="#6d4aff"><rect x="128" y="80" width="32" height="200" rx="3"/><rect x="253" y="160" width="32" height="120" rx="3"/><rect x="378" y="220" width="32" height="60" rx="3"/><rect x="503" y="260" width="32" height="20" rx="3"/></g>
  <g fill="#168aad"><rect x="166" y="240" width="32" height="40" rx="3"/><rect x="291" y="200" width="32" height="80" rx="3"/><rect x="416" y="160" width="32" height="120" rx="3"/><rect x="541" y="120" width="32" height="160" rx="3"/></g>
  <g font-family="system-ui, sans-serif" font-size="13" fill="#111827" text-anchor="middle"><text x="163" y="303">0</text><text x="288" y="303">1</text><text x="413" y="303">2</text><text x="538" y="303">3</text><text x="340" y="330">Sample value z</text></g>
  <g font-family="system-ui, sans-serif" font-size="13" fill="#111827"><rect x="408" y="22" width="14" height="14" rx="2" fill="#6d4aff"/><text x="428" y="34">P₀</text><rect x="476" y="22" width="14" height="14" rx="2" fill="#168aad"/><text x="496" y="34">P₁</text></g>
  <line x1="92" y1="280" x2="590" y2="280" stroke="#4b5563" stroke-width="1.5"/><line x1="92" y1="55" x2="92" y2="280" stroke="#4b5563" stroke-width="1.5"/>
</svg>
<figcaption>Figure: compare the probability masses assigned to sample values 2 and 3, for which the distinguisher outputs 1.</figcaption>
</figure>

Choose $D(z)=1$ when $z\ge2$ (classifying the sample as coming from $P_1$), and $D(z)=0$ otherwise. The shaded region contains exactly the values for which $D$ outputs 1. Under $P_0$, this event has probability $q_0=P_0(2)+P_0(3)=0.15+0.05=0.20$. Under $P_1$, it has probability $q_1=P_1(2)+P_1(3)=0.30+0.40=0.70$. Therefore, this distinguisher's output-probability difference is $|q_1-q_0|=|0.70-0.20|=0.50$. The distinguisher first chooses the set of samples on which it outputs 1, then compares how much probability each distribution assigns to that set.

We can also estimate the difference from finite samples. Suppose ten samples from $P_0$ are $0,1,0,2,1,0,3,0,1,0$, and ten from $P_1$ are $0,1,2,3,2,3,1,3,0,3$.

| Sample value | Count from $P_0$ (relative frequency) | Count from $P_1$ (relative frequency) |
| ---: | ---: | ---: |
| 0 | 5 (0.50) | 2 (0.20) |
| 1 | 3 (0.30) | 2 (0.20) |
| 2 | 1 (0.10) | 2 (0.20) |
| 3 | 1 (0.10) | 4 (0.40) |

In these observations, $D=1$ on $\widehat q_0=(1+1)/10=0.20$ of the $P_0$ samples and $\widehat q_1=(2+4)/10=0.60$ of the $P_1$ samples. The estimated output-probability difference is $|0.60-0.20|=0.40$. It differs from the theoretical value $0.50$ because a finite sample fluctuates by chance. More samples tend to bring the estimate closer to the theoretical value, but a finite experiment need not match it exactly.

When the distinguisher’s computational power is unrestricted, the maximum output-probability difference over a finite sample space equals the **total variation distance**

$$
\Delta(P_0,P_1)=\frac12\sum_z|P_0(z)-P_1(z)|.
$$

A small total variation distance makes the distributions hard to distinguish by any test. In **computational indistinguishability**, cryptography restricts distinguishers to probabilistic polynomial time and requires the output-probability difference of every such distinguisher to be negligible in the security parameter. Two distributions may have a large total variation distance yet remain indistinguishable to efficient distinguishers.

### Estimating from samples: separate theoretical probabilities from observations

An experiment observes finitely many samples, not the distributions themselves. Collect independent samples from $P_0$ and $P_1$ under the same conditions, then apply a distinguisher $D$ chosen in advance. If $D$ uses randomness, draw fresh independent coins for each sample. If $P_i$ supplies $n_i$ samples, estimate its probability of outputting $1$ by

$$
\widehat q_i=\frac{1}{n_i}\sum_{j=1}^{n_i}\mathbf{1}[D(z_{i,j})=1].
$$

The estimated difference from the observations is $\widehat d_D=|\widehat q_1-\widehat q_0|$. In the four-value example above, the observed frequencies give $\widehat q_0=0.20$ and $\widehat q_1=0.60$, hence an estimated difference of $0.40$ for a theoretical difference of $0.50$. This keeps the theoretical output-probability difference separate from its finite-sample estimate.

Hoeffding’s inequality gives a simple uncertainty bound. For independent samples, with confidence at least $1-\alpha$, both estimates simultaneously satisfy

$$
|\widehat q_i-q_i|\le r_i,\qquad r_i=\sqrt{\frac{\log(4/\alpha)}{2n_i}},
$$

where $q_i=\Pr_{z\sim P_i}[D(z)=1]$. Thus the estimation error for the output-probability difference is at most $r_0+r_1$ at that confidence level. Increasing the sample count narrows this range at roughly the rate $1/\sqrt{n_i}$. For finite-valued random variables, empirical frequencies estimate the probability mass functions; one can also compare the empirical total variation $\frac12\sum_z|\widehat P_0(z)-\widehat P_1(z)|$, while remembering that it too is only a finite-sample estimate.

Here is why the inequality applies. For each sample, set $X_{i,j}=\mathbf{1}[D(z_{i,j})=1]$. This is a Bernoulli random variable taking values 0 or 1, with expectation $q_i$. For the average $\widehat q_i$ of $n_i$ independent samples, Hoeffding’s inequality states

$$
\Pr\!\left[|\widehat q_i-q_i|>r\right]\le 2e^{-2n_i r^2}.
$$

It bounds the probability that the sample average differs from the true probability by more than $r$; that probability decreases exponentially with the sample count. To make the bound hold for both the $P_0$ and $P_1$ samples simultaneously, assign at most $\alpha/2$ failure probability to each and use the union bound. This gives $r_i=\sqrt{\log(4/\alpha)/(2n_i)}$. The reverse triangle inequality then gives $\bigl||\widehat q_1-\widehat q_0|-|q_1-q_0|\bigr|\le |\widehat q_1-q_1|+|\widehat q_0-q_0|$, so the two error margins bound the error in the estimated output-probability difference.

For example, let $\alpha=0.05$ (95% simultaneous confidence) and take $n_i=1000$ independent samples from each distribution. Then each $r_i\approx0.047$, so the observed output-probability difference is guaranteed to be within about $0.094$ of the true value. This is a conservative upper bound; it does not mean the actual error will be that large. With fewer samples the margin is wider: at 10 samples per distribution, each $r_i\approx0.468$, so this inequality alone gives little useful precision.

Such an experiment asks whether a particular distinguisher detects a difference with the available samples. Failing to detect one does not prove that the distributions are equal or computationally indistinguishable to every efficient distinguisher. The latter requires a theoretical security proof that accounts for the security parameter, sample budget, and computational resources.

### Connection to zero-knowledge

For a fixed public input, zero-knowledge requires that an allowed distinguisher cannot tell the probability distribution of the real interaction’s view from the probability distribution output by a simulator. Session 2 develops the perfect, statistical, and computational versions in detail; see its [formal definition and tables](./session-02#_2-2-a-formal-definition). Here $d_D$ can be read as the output-probability difference for those two distributions.

### Connection to soundness error and randomized checks

In protocol analysis, distinguish “the verifier’s random challenge $R$,” “the adversary’s random coins $A$,” and “the acceptance indicator $Y$.” If we encode acceptance as $Y=1$ and rejection as $Y=0$, the soundness error can, for example, be expressed as the conditional probability

$$
\Pr[Y=1\mid \text{the fixed statement is false}].
$$

For precision, specify which random choices (such as the verifier’s or adversary’s coins) the probability is taken over. The next section applies this way of tracking randomness to the Schwartz–Zippel lemma, where a random field element can expose an incorrect polynomial identity.

## 6. Randomized checks and the Schwartz–Zippel lemma

The Schwartz–Zippel lemma used in Session 3 is a typical probability-variable argument. Let $h$ be a nonzero univariate polynomial over a finite field $\mathbb{F}$ with degree at most $d$, and let $R$ be a random variable chosen uniformly from a subset $S\subseteq\mathbb{F}$. Since a polynomial has at most $d$ roots,

$$
\Pr[h(R)=0]\leq\frac{d}{|S|}.
$$

This bounds the probability that an incorrect polynomial happens to evaluate to $0$ at the random test point. For $d=3$, the bound is $3/16$ when $|S|=16$, and $3/256$ when $|S|=256$. Increasing the test set decreases the bound. The set $S$ must consist of field elements, and its sampling must satisfy the lemma’s assumptions, such as uniformity.

Crucially, the test polynomial $h$ is fixed before the random variable $R$ is chosen. If a prover can see $R$ and then freely choose $h$, it can make $h(R)=0$, and the bound cannot be applied as stated. Protocols enforce the relevant order by fixing a commitment before the challenge is sampled.

## 7. Soundness amplification by repetition

Suppose one test misses a dishonest proof with probability at most $\epsilon$. If we run $k$ tests using independent randomness and accept only when all tests pass, the probability of missing the dishonesty in every test is at most

$$
\epsilon^k.
$$

For example, four independent tests with $\epsilon=1/4$ give a miss probability at most $(1/4)^4=1/256$. If the tests are dependent, or later tests are chosen after observing earlier outcomes, this simple product may not apply. A soundness-amplification claim requires an argument for the protocol’s repetition method and the adversary’s adaptive behavior.

For failure events $E_1,\ldots,E_m$, the union bound gives

$$
\Pr\!\left[\bigcup_{i=1}^m E_i\right]\leq\sum_{i=1}^m\Pr[E_i].
$$

The events need not be independent. This is a basic method for bounding the probability that any of several protocol checks fails.

## 8. Where these ideas appear in the course

| Course topic | Probability tool | What to check |
| --- | --- | --- |
| Session 3: Schwartz–Zippel lemma | Uniform random test point, probability bound | Is the polynomial fixed first? How is $S$ sampled? |
| Session 5: error-correcting codes | Distinguish random errors from worst-case errors | Is the error channel noise, or chosen by an adversary? |
| Session 6: soundness amplification | Independent trials, conditional probability | Does the repetition preserve independence? |
| Session 9: Random Oracle Model | Queries to random functions, adaptive choices | What is the query history and order of challenges? |

When calculating a probability, first write down what is randomized, how success or failure is defined as an event, and which random choices the probability ranges over. Then check assumptions such as uniformity, independence, and order of selection before applying a formula.

## 9. Exercises

**Exercise 1.** Choose $R$ uniformly from $S=\{0,1,\ldots,15\}$. What upper bound does Schwartz–Zippel give for $\Pr[h(R)=0]$ when $h$ is a nonzero polynomial of degree at most $3$?

**Answer.** At most $3/16$. This is an upper bound; the actual probability need not equal $3/16$.

**Exercise 2.** A single independent test misses a dishonest proof with probability at most $1/8$. What is the upper bound after three independent repetitions?

**Answer.** $(1/8)^3=1/512$. This uses independence and the rule that acceptance requires passing all tests.

**Exercise 3.** Failure events $A$ and $B$ each have probability at most $0.02$ and $0.03$. Bound the probability that at least one occurs without assuming independence.

**Answer.** $\Pr[A\cup B]\leq\Pr[A]+\Pr[B]\leq0.05$.

**Exercise 4.** A nonnegative random variable $X$ has expectation $3$. Use Markov’s inequality to bound $\Pr[X\ge12]$.

**Answer.** $\Pr[X\ge12]\leq\mathbb{E}[X]/12=3/12=1/4$.

**Exercise 5.** A random variable $X$ has expectation $10$ and variance $9$. Use Chebyshev’s inequality to bound $\Pr[|X-10|\ge6]$.

**Answer.** $\Pr[|X-10|\ge6]\leq9/6^2=1/4$.

## Continue learning

- [Session 3: Finite fields, polynomial algebra, and randomized testing](./session-03): the Schwartz–Zippel lemma and error probability
- [Session 5: Error-correcting codes and information-theoretic perspective](./session-05): random errors versus adversarial errors
- [Session 6: Low-degree testing and soundness amplification](./session-06): repetition and soundness error
- [Session 9: Fiat–Shamir and the pros and cons of ROM](./session-09): adaptive queries and the Random Oracle Model
- Further reading: [A First Course in Probability, Sheldon M. Ross (Pearson)](https://www.pearson.com/en-us/subject-catalog/p/Ross-First-Course-in-Probability-A-10th-Edition/P200000006334/9780137504589)
