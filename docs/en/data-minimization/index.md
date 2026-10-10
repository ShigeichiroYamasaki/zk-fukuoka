---
outline: [2, 3]
---

# Applied course: reduce stored personal data with ZK attribute proofs

Updated: October 10, 2026

## The problem this lesson addresses

Ransomware defenses often focus on preventing intrusion and restoring encrypted data. But attackers may also steal personal information and threaten to publish it, including in attacks that do not encrypt data. In its October 2026 alert, Japan’s IPA advises organizations to avoid retaining unnecessary information and to review what they hold. [IPA alert](https://www.ipa.go.jp/security/security-alert/2026/alert20261009.html)

This lesson treats ZK proofs **not as a way to stop ransomware, but as a way to reduce the need for each service to copy and retain identity data**. If an attacker copies a service database that does not contain names, dates of birth or identity-document images, those records cannot be directly exposed from that database. This also aligns with data minimization: limiting personal-data collection, use, storage and disclosure to what is necessary for the purpose. [NIST definition of minimization](https://csrc.nist.gov/glossary/term/minimization)

::: warning Scope
This is a design and implementation learning example. ZK proofs do not prevent intrusion, encryption or data theft, and they do not make every retained record unnecessary. Continue to use access controls, multifactor authentication, network segmentation, backups, monitoring and vulnerability management. Use fictional data only.
:::

## Example service

Suppose a community service provides restricted content to active members who meet an age threshold. A conventional workflow may collect a name, date of birth and identity-document image, then retain them in the service database or backups. Yet the service only needs to know that the person is an active member and is at least 18.

An issuer performs the appropriate identity check and issues the user an electronic credential containing the relevant attributes and expiry. The user’s wallet proves in zero knowledge that the credential was signed by the issuer, is current, and satisfies the age policy. The service verifies the proof without receiving the date of birth or identity-document image. It may retain a minimal pseudonymous account identifier for access control and abuse prevention.

| Item | Example conventional design | Example ZK attribute-proof design |
| --- | --- | --- |
| Received by service | Name, date of birth, document image and decision | Proof of “active member and age 18+,” plus a minimal pseudonymous ID |
| Service database | May copy identity data into the member record | Does not store date of birth or document image |
| Credential issuer | Performs identity check | Performs the check and issues/revokes credentials |
| Direct exposure in a breach | May include identity records, depending on retention | Limited to the fields the service actually stores |

This does not erase data held by the issuer. If the issuer retains identity records, its systems remain a high-value target. The goal is to reduce unnecessary copies across services and narrow the impact of a breach at each location.

## The relation being proved

Let $pk_I$ be the issuer’s public key, $cred$ the private credential, and $t$ the current time. Conceptually, the relation is:

$$
\exists(cred):\quad
\mathrm{VerifyCred}(pk_I,cred)=1
\;\land\;
\mathrm{age}(cred)\geq 18
\;\land\;
\mathrm{validUntil}(cred)\geq t
$$

An actual circuit must define credential-signature verification, age policy, expiry and revocation using a specific credential format and cryptographic scheme. The issuer remains responsible for the correctness of its identity checks. A ZK proof does not make an incorrect check correct.

For a one-time benefit, a scope-specific nullifier derived from a credential secret and a service/period can prevent reuse without publishing an identity. Reusing the same credential within the same scope produces the same nullifier. A scope that is too broad can link a user’s activity. This example focuses on reducing disclosure of age and membership attributes; it does not replace ordinary login authentication.

## Information flow and trust boundaries

| Stage | Operation | Data received by service | Data to protect |
| --- | --- | --- | --- |
| 1. Issuance | Issuer checks identity and issues a credential to the user | None | Identity data and issuance records held by issuer |
| 2. Proving | User’s device creates a proof from the credential | Not sent yet | Credential, secret and local device data |
| 3. Verification | Service checks proof and public policy | Proof, issuer public key, optional scoped nullifier | No name, date of birth or document image |
| 4. Access | Service allows access if verification succeeds | Pseudonymous ID and minimum access event | Do not put identity data or secrets in logs |
| 5. Revocation | Issuer updates revocation information and verifiers consume it | Public revocation-check data | Revocation reason and identity mapping |

Even with ZK proofs, users may be inferred from IP addresses, timestamps, device identifiers, access patterns or published nullifiers. Review logs, analytics, backups, support screens and vendor data flows as well as proof inputs and outputs.

## Exercise: compare what a database breach reveals

### Materials

- Ten fictional users (name, date of birth, whether a document image is stored, pseudonymous ID)
- A conventional membership database and a ZK attribute-proof service database
- An incident scenario in which an attacker reads each database

### Steps

1. Separate fields genuinely needed by the service from fields retained by habit in the conventional design.
2. For the ZK design, assign roles to the issuer, user’s device and service; document where each piece of information lives.
3. Implement the same access decision: the conventional design checks a stored date of birth, while the ZK design verifies a credential proof.
4. Compare the fields and number of people directly exposed in each simulated database dump.
5. Specify tests that reject an expired or revoked credential, a credential below the age threshold, and a modified proof.
6. Separately consider compromise of the issuer, the user’s device, logs and backups.

Success is not “we used ZK.” It is **showing that the service’s function still works while its copies of personal data and the direct exposure in a breach have actually decreased**.

### Completion criteria

- Explain which information is required for the access decision and why other data is not retained.
- Show a design that removes names, dates of birth and identity-document images from the service database.
- Define tests for expiry, revocation, policy failure and proof tampering.
- Identify data and trust assumptions remaining with the issuer, service and user’s device.
- Review data flows including logs and backups, and list metadata that ZK does not hide.
- Explain that ZK supplements data minimization; it does not prevent intrusion or replace recovery controls.

## Controls that remain necessary

This design addresses mainly what an attacker can take after a breach. Separate controls are needed to prevent, detect and recover from ransomware. Combine data minimization with the preventive, detection and recovery measures in [IPA’s ransomware guidance](https://www.ipa.go.jp/security/anshin/measures/ransom_tokusetsu.html) and an incident-response plan.

Adopting ZK does not remove obligations under applicable privacy laws, including determining whether a breach must be reported or affected people notified. Consult the relevant requirements and contracts. [Japan PPC: breach response resources](https://www.ppc.go.jp/personalinfo/legal/leakAction/)

## Connections to the lectures

| Lecture | Concept used here |
| --- | --- |
| [Session 2: zero knowledge and witnesses](../learn/session-02) | Prove a predicate without revealing the private credential |
| [Session 4: arithmetization](../learn/session-04) | Express signature and range checks as circuit constraints |
| [Session 8: polynomial commitments](../learn/session-08) | Understand how proof systems handle private computations |
| [Session 11: Groth16](../learn/session-11) | Study one concrete proving and verification system |

## References

- [IPA: October 2026 alert on data breaches](https://www.ipa.go.jp/security/security-alert/2026/alert20261009.html): includes reviewing stored information and avoiding unnecessary data.
- [IPA: Ransomware guidance](https://www.ipa.go.jp/security/anshin/measures/ransom_tokusetsu.html): organizational ransomware countermeasures.
- [NIST CSRC: Data minimization](https://csrc.nist.gov/glossary/term/minimization): limiting personal-data processing to what is necessary for a purpose.
- [NIST SP 800-63-4: Privacy](https://pages.nist.gov/800-63-4/sp800-63c/privacy/): privacy-preserving approaches that disclose only needed attributes.
- [Japan PPC: breach response resources](https://www.ppc.go.jp/personalinfo/legal/leakAction/): information on responses and reporting after personal-data breaches.

[ERC-20 ZK rollup](../rollup/) · [ZKML](../zkml/) · [Exercises](../exercises/)
