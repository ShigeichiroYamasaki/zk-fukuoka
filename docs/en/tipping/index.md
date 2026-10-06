---
outline: [2, 3]
---

# Applied course: privacy-preserving stablecoin tips with a JPKI wallet

Updated: October 7, 2026

This design combines JPKI-based identity verification with zero-knowledge proofs so a supporter’s name and wallet mapping need not be published when tipping a musician with a stablecoin. The goal is **not to evade legal obligations through anonymity**. We study how to improve privacy from the general public while allowing regulated service providers to perform required identity checks, retain transaction records and respond to lawful requests.

::: warning Educational scope
This is a system-design example for learning about regulatory and implementation questions. It is not legal advice, a determination of licensing requirements, or a production-ready payment service. Before deployment, consult Japanese counsel and tax professionals and confirm the token’s legal classification, service roles, funds flow, AML/CFT, tax and personal-data requirements. Use testnet tokens and fictional data only in the exercises.
:::

This page is a **design-exercise specification**. It does not include executable JPKI integration, anonymous-credential issuance, stablecoin settlement code, or a service whose legal compliance has been reviewed.

## What we build

After JPKI-based identity verification, a supporter receives a campaign-scoped credential in their wallet. The wallet uses it to prove in zero knowledge that it has a valid participation credential, has not reused it for the same campaign, and stays within the campaign limit. The public site does not publish the supporter’s name or a list mapping supporters to wallets. A contracted provider retains identity and transaction records as required by law and contract.

“Anonymous” here means **pseudonymous to the public**. The design does not aim to hide transactions from every payment provider, issuer, recipient, or legally authorized authority. JPKI itself does not issue anonymous credentials or blockchain wallets. Any service that links JPKI identity verification to a separate credential issuer and verifier needs its own legal, contractual and security review.

## Participants and information flow

| Stage | Actor and operation | Public information | Information retained by providers |
| --- | --- | --- | --- |
| 1. Identity check | Supporter uses a JPKI-compatible identity service | None | Identity data needed for verification and verification records |
| 2. Credential issuance | Identity service or its contractor issues a campaign, expiry and limit-scoped credential | Aggregate issuance counts only | Issuance and revocation records; consider separating identity-to-credential mapping |
| 3. Tip proof | Wallet proves credential validity, non-reuse and amount bounds | Campaign ID, proof and minimum payment data | Supporter, amount, time, destination and other required transaction records |
| 4. Settlement | A provider whose regulatory status has been reviewed processes the supported stablecoin and settles with the musician | Settlement total or verification result; avoid public identity mapping | Individual tips, deposits, withdrawals, identity checks and accounting records |
| 5. Verification | Anyone checks the public proof and campaign rules | Correct aggregate and permitted campaign | Records needed for lawful inquiries and audits |

| Information | Supporter | Musician | Payment / identity provider | Public observer |
| --- | --- | --- | --- | --- |
| Name and identity-check record | Can access own data | Normally unnecessary | Checks and retains as required | Not published |
| Individual amount and transfer record | Can access | May see individual tips or settlement total | Retains required business and legal records | No direct identity mapping published |
| Zero-knowledge proof | Generates | Sees settlement information needed | Checks policy and records | Can verify public portion |

## What is proved

Let $c$ be a campaign ID, $s$ a secret associated with the credential, $a$ the tip amount, and $pk_I$ the issuer’s public key. The relation is conceptually:

$$
\exists(s,\,\mathrm{cred},\,r):\quad
\mathrm{VerifyCred}(pk_I,\mathrm{cred},s,c)=1
\;\land\;
0 < a \leq a_{\max}
\;\land\;
N=H(s,c)
$$

$N$ is a campaign-scoped nullifier that detects reuse of the same credential. It is stable within one campaign, so a second use can be rejected. Including the campaign ID aims to prevent public records from linking the same participant across different campaigns. The credential signature and hash must be selected after evaluating circuit efficiency, security and revocation. This relation does not by itself prove that identity verification was correct, that the supporter intended the payment, or that the stablecoin is legally eligible.

In a ledger exercise, verify each one-time credential and amount limit, then prove the published settlement total equals the sum of accepted tips. If each tip is sent directly on a public chain, sender and recipient addresses, amounts and timestamps remain analyzable. A zero-knowledge proof alone does not anonymize those public records.

## What can be hidden, and what remains

| Item | Direct public-chain transfer | Privacy goal here |
| --- | --- | --- |
| Supporter name | Not necessarily in the transaction, but may be inferred from other public information | Do not publish; reduce wallet-to-person linkage |
| Sender and recipient addresses | Public | Explore designs that do not directly link individual supporter addresses to the musician in public data |
| Individual amount and time | Public | Consider exposing only an aggregate or range to the general public |
| Payment-service records | None if no provider is involved | Retain records required by applicable law, contracts and accounting |
| Lawful investigation | Can use public data and, where applicable, provider records | Preserve an operation that can respond to lawful requests and audits |

Reducing public data makes data availability, auditability, mistaken-payment handling and consumer protection harder to balance. A single operator’s secret key is not a complete solution. Specify key management, multi-party approval, retention, disclosure conditions, appeals and settlement if the operator becomes unavailable.

## Make compliance a design constraint

- Stablecoins are not all legally identical. Determine whether the asset is an “electronic payment instrument” under Japanese law and identify the issuer, redeemer and transaction route. The FSA describes registration requirements for businesses handling electronic payment instruments.
- If an organizer receives, holds, transfers, exchanges or intermediates customer funds, the activity may be regulated even when marketed as “tipping.” Do not build custody or exchange functions based on your own classification. Review the arrangement with counsel and assume a properly registered provider is needed unless qualified advice confirms otherwise.
- Transfers of crypto-assets and electronic payment instruments can involve originator/beneficiary notification and recordkeeping requirements depending on the covered provider and route. A zero-knowledge proof does not remove those duties or create an exemption.
- JPKI is an identity-verification and electronic-signature infrastructure. Do not use the individual number as a credential identifier or on-chain value, and do not send card secrets or personal identification number data into a server, circuit or public log. Confirm the proposed JPKI use, outsourcing and credential issuance model.
- Whether a “tip” is a pure gift or consideration for a performance, exclusive stream or other benefit can change contractual and tax treatment. The musician should ask a tax professional about valuation at receipt, bookkeeping and income classification.
- Design AML/CFT controls applicable to the service providers, including screening, suspicious-activity monitoring and reporting. A credential proof must not become a blanket permit for anyone to transact.

FSA materials describe stablecoin transfers in connection with Travel Rule requirements intended to support tracing and with provider registration regimes. Rules change; check current statutes and supervisory guidance before implementation.

## Exercise stages

1. **Public-chain baseline:** transfer a test token directly from a supporter address to a musician and inspect the amount, timestamp and addresses in a block explorer.
2. **Credential validation:** implement signature checks for a test credential issued from fictional JPKI check results, including campaign, expiry and limit. Do not integrate with real JPKI.
3. **Prevent reuse:** derive a nullifier from the credential secret and campaign ID; reject a second tip in the same campaign.
4. **Add zero knowledge:** make the credential, secret and amount private inputs, and the campaign, limit and nullifier public inputs. Test that identity data is absent separately from testing proof validity.
5. **Aggregate and audit:** prove that accepted tips sum to the settlement total. Document public data and provider-held transaction records as separate data flows.
6. **Threat and compliance review:** document impersonation, credential lending, nullifier correlation, operator breach, mistaken payments, provider outage and lawful inquiries. Do not advance to production with unresolved items.

### Acceptance criteria

- Reject invalid, expired or revoked credentials and repeated use within one campaign.
- Reject amounts over the limit and prove the public total equals the settlement ledger.
- Keep names, individual numbers, certificate data, private keys and supporter mapping out of public inputs, events and logs.
- Explain in a data-flow table why a design hidden from public observers does not delete required records held by the payment provider.
- Do not claim that the implementation resolves licensing requirements; record open issues and professional review.

## References

- [JPKI: About the Public Personal Authentication Service](https://www.jpki.go.jp/jpkiguide/index.html): official explanation of identity verification and electronic signatures.
- [JPKI electronic certificates](https://www.jpki.go.jp/prepare/digital_certificate.html): roles of signature and user-authentication certificates.
- [FSA: Electronic Payment Instruments Service Providers](https://www.fsa.go.jp/common/shinsei/dendai/dentori.html): registration information for stablecoin-related businesses.
- [FSA: Travel Rule for transfers of crypto-assets and electronic payment instruments](https://www.fsa.go.jp/news/r6/sonota/20250625/04.pdf): covered transfers, required notifications and records.
- [FSA: AML/CFT and financial crime measures](https://www.fsa.go.jp/news/r6/20250627/01.pdf): risks and AML/CFT considerations for electronic payment instruments.
- [NTA FAQ on donations of crypto-assets](https://www.nta.go.jp/publication/pamph/pdf/virtual_currency_faq_03.pdf): reference for valuation and tax treatment; application to tips depends on the transaction.
- [NTA: Meaning of “for consideration”](https://www.nta.go.jp/taxes/shiraberu/taxanswer/shohi/6113.htm): distinction between service consideration and gratuitous transfers.

[ERC-20 ZK rollup](../rollup/) · [Private-input AI inference](../zkml/) · [Exercises](../exercises/)
