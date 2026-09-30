# Probability: foundations for learning ZK

Author: Shigeichiro Yamasaki  
Created: September 29, 2026  
Last updated: September 30, 2026

Zero-knowledge proofs repeatedly use ideas such as “find an error at a random point,” “make the probability of accepting a false proof small,” and “reduce the error probability by repeating a protocol.” This page develops the probability needed to understand those arguments: events, random variables, conditional probability, independence, expectation, and probability bounds.

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

Random variables are independent exactly when their joint probability distribution factors into the product of their marginals: $p_{X,Y}(x,y)=p_X(x)p_Y(y)$. Thus individual probability distributions may fail to capture dependence or information in the complete record. Zero-knowledge compares the verifier’s complete view as a random variable.

### Distinguishing probability distributions

To **distinguish** two probability distributions $P_0,P_1$ is to inspect a sample $z$ from one of them and decide which one generated it. Let a distinguisher $D$ receive $z$ and output $1$ if it thinks the sample came from $P_0$, and $0$ otherwise. Define its distinguishing gap by

$$
\operatorname{Adv}_D(P_0,P_1)=\left|\Pr_{z\sim P_0}[D(z)=1]-\Pr_{z\sim P_1}[D(z)=1]\right|.
$$

If $D$ is randomized, these probabilities also include its own random coins. For processes A and B above, the test “output $1$ exactly when the bits are equal” has distinguishing gap $1$.

When the distinguisher’s computational power is unrestricted, the maximum distinguishing gap over a finite sample space equals the **total variation distance**

$$
\Delta(P_0,P_1)=\frac12\sum_z|P_0(z)-P_1(z)|.
$$

A small total variation distance makes the distributions hard to distinguish by any test. In **computational indistinguishability**, cryptography restricts distinguishers to probabilistic polynomial time and requires every such distinguisher’s gap to be negligible in the security parameter. Two distributions may have a large total variation distance yet remain indistinguishable to efficient distinguishers.

Zero-knowledge requires that, for a fixed public input, a distinguisher cannot tell the probability distribution of the real interaction’s view from the probability distribution output by a simulator. Session 2 develops the perfect, statistical, and computational versions in detail; see its [formal definition and tables](./session-02#_2-2-formal-definition).

In protocol analysis, distinguish “the verifier’s random challenge $R$,” “the adversary’s random coins $A$,” and “the acceptance indicator $Y$.” If we encode acceptance as $Y=1$ and rejection as $Y=0$, the soundness error can, for example, be expressed as the conditional probability

$$
\Pr[Y=1\mid \text{the fixed statement is false}].
$$

For precision, specify which random choices (such as the verifier’s or adversary’s coins) the probability is taken over.

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

In cryptographic protocols, the order of choices can matter. For example, a prover may commit first and the verifier may choose a random challenge afterward. This differs from a setting where the prover sees the challenge before choosing its commitment. The probability analysis depends on what is fixed first and which random choices are visible to whom.

## 4. Expectation: estimating an average

If a discrete random variable $X$ takes value $x$ with probability $p_x$, its **expectation** is

$$
\mathbb{E}[X]=\sum_x x\,p_x.
$$

Expectation is a long-run average; it does not mean that every individual trial produces that value.

For a uniformly random bit $X$, for example, $\mathbb{E}[X]=0\cdot\frac12+1\cdot\frac12=\frac12$. If $F$ counts failures in $k$ trials, it can be written as the sum of failure-indicator variables, which lets us calculate the expected number of failures. The linearity of expectation, $\mathbb{E}[X_1+\cdots+X_k]=\sum_i\mathbb{E}[X_i]$, does not require independent variables. However, a small expectation alone does not prove that a particular execution will never fail.

## 5. Randomized checks and the Schwartz–Zippel lemma

The Schwartz–Zippel lemma used in Session 3 is a typical probability-variable argument. Let $h$ be a nonzero univariate polynomial over a finite field $\mathbb{F}$ with degree at most $d$, and let $R$ be a random variable chosen uniformly from a subset $S\subseteq\mathbb{F}$. Since a polynomial has at most $d$ roots,

$$
\Pr[h(R)=0]\leq\frac{d}{|S|}.
$$

This bounds the probability that an incorrect polynomial happens to evaluate to $0$ at the random test point. For $d=3$, the bound is $3/16$ when $|S|=16$, and $3/256$ when $|S|=256$. Increasing the test set decreases the bound. The set $S$ must consist of field elements, and its sampling must satisfy the lemma’s assumptions, such as uniformity.

Crucially, the test polynomial $h$ is fixed before the random variable $R$ is chosen. If a prover can see $R$ and then freely choose $h$, it can make $h(R)=0$, and the bound cannot be applied as stated. Protocols enforce the relevant order by fixing a commitment before the challenge is sampled.

## 6. Soundness amplification by repetition

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

## 7. Where these ideas appear in the course

| Course topic | Probability tool | What to check |
| --- | --- | --- |
| Session 3: Schwartz–Zippel lemma | Uniform random test point, probability bound | Is the polynomial fixed first? How is $S$ sampled? |
| Session 5: error-correcting codes | Distinguish random errors from worst-case errors | Is the error channel noise, or chosen by an adversary? |
| Session 6: soundness amplification | Independent trials, conditional probability | Does the repetition preserve independence? |
| Session 9: Random Oracle Model | Queries to random functions, adaptive choices | What is the query history and order of challenges? |

When calculating a probability, first write down what is randomized, how success or failure is defined as an event, and which random choices the probability ranges over. Then check assumptions such as uniformity, independence, and order of selection before applying a formula.

## 8. Exercises

**Exercise 1.** Choose $R$ uniformly from $S=\{0,1,\ldots,15\}$. What upper bound does Schwartz–Zippel give for $\Pr[h(R)=0]$ when $h$ is a nonzero polynomial of degree at most $3$?

**Answer.** At most $3/16$. This is an upper bound; the actual probability need not equal $3/16$.

**Exercise 2.** A single independent test misses a dishonest proof with probability at most $1/8$. What is the upper bound after three independent repetitions?

**Answer.** $(1/8)^3=1/512$. This uses independence and the rule that acceptance requires passing all tests.

**Exercise 3.** Failure events $A$ and $B$ each have probability at most $0.02$ and $0.03$. Bound the probability that at least one occurs without assuming independence.

**Answer.** $\Pr[A\cup B]\leq\Pr[A]+\Pr[B]\leq0.05$.

## Continue learning

- [Session 3: Finite fields, polynomial algebra, and randomized testing](./session-03): the Schwartz–Zippel lemma and error probability
- [Session 5: Error-correcting codes and information-theoretic perspective](./session-05): random errors versus adversarial errors
- [Session 6: Low-degree testing and soundness amplification](./session-06): repetition and soundness error
- [Session 9: Fiat–Shamir and the pros and cons of ROM](./session-09): adaptive queries and the Random Oracle Model
- Further reading: [A First Course in Probability, Sheldon M. Ross (Pearson)](https://www.pearson.com/en-us/subject-catalog/p/Ross-First-Course-in-Probability-A-10th-Edition/P200000006334/9780137504589)
