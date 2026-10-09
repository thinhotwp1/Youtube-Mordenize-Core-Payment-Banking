# EP 06 · Security & Compliance by Design: Final Script

**Series:** Enterprise modernization reference scenario (Stage 2: Requirements). **Speed:** 120–130 words per minute. **Voice:** clear English for technology and business leaders.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- Numbers are written as words, so they are easy to read aloud.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · Built In, Not Bolted On | 181 | 01:35 | 00:00 – 01:35 |
| 2 · How Could Someone Attack This? | 232 | 01:55 | 01:35 – 03:30 |
| 3 · Who Can Do What | 193 | 01:40 | 03:30 – 05:10 |
| 4 · Protect the Data | 203 | 01:45 | 05:10 – 06:55 |
| 5 · Checked Every Time, by Machines | 221 | 01:50 | 06:55 – 08:45 |
| 6 · Stop Fraud in 10 Seconds | 235 | 02:00 | 08:45 – 10:45 |
| 7 · Operate Securely, Then Sign Off | 247 | 02:05 | 10:45 – 12:50 |
| **Total** | **1512** | **12:50** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · Built In, Not Bolted On

**[tag ①]** Security reviews are costly when they arrive after design choices are locked. In large enterprise delivery, this creates avoidable rework. The payments sandbox brings security and bank compliance owners into the first slice decision, so their approved controls shape the architecture from the start.

**[tag ②]** The execution pattern is to make security part of **every** stage: approved requirements, threat model, build checks, adversarial tests, and production monitoring. Bank security owners define the policy. Engineering makes the controls visible and repeatable.

**[tag ③]** Early review reduces rework. The minutes, hours, days, and weeks on this diagram are **illustrative**, not measured cost ratios. The practical point is to find boundary and identity mistakes before they reach production.

**[tag ④]** AWS uses a shared-responsibility model. The provider handles parts of the underlying cloud infrastructure, with details that depend on the service selected.

**[tag ⑤]** The bank remains responsible for its data, identities, configuration, application code, and operating controls under its chosen services.

**[tag ⑥]** Cloud use does not replace the bank's accountability. Its security, risk, and legal teams decide the applicable duties; my job is to turn them into technical controls and proof.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · How Could Someone Attack This?

**[tag ①]** Before detailed design, ask how this reference slice could fail or be attacked. The diagram marks trust boundaries between the internet, AWS, a bank data centre, and external parties. A real threat model must use the bank's actual network, identities, and data flows.

**[tag ②]** In this scenario, a mobile channel enters through a web application firewall and API gateway. We test authentication, rate limits, and input validation at that edge.

**[tag ③]** A **private** link is the proposed path to the mainframe. Its routing, authentication, and resilience still require bank network review.

**[tag ④]** The proposed AML event feed replaces the direct DB2 read shown earlier. This is a design option, not a completed migration. AML owners must confirm the required data, timing, and failure response before the old link is removed.

**[tag ⑤]** STRIDE gives six threat questions: spoofing, tampering, repudiation, disclosure, denial of service, and privilege escalation. The examples on the slide are prompts for investigation, not a claim that these attacks occurred in a bank.

**[tag ⑥]** We map each relevant threat to a control and a test: authentication, mutual TLS, audit integrity, encryption, rate limits, and approval gates are possible controls. Bank security owners decide which are required and how strong they must be.

**[tag ⑦]** AI could draft a threat list from approved diagrams and stories. Security engineers would challenge it against real assets, attackers, and controls. The diagram is a proposed review process, not a completed assessment.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · Who Can Do What

**[tag ①]** Identity is a critical boundary. The diagram separates customers, services, staff, and delivery automation. For customers, the bank defines authentication and step-up rules for each flow. Engineering must bind approval to the right transaction details and test replay and device-change cases.

**[tag ②]** For services, mutual TLS and narrow roles are proposed controls. Short-lived credentials reduce exposure, but they can still be stolen or misused. We test rotation, revocation, and least privilege.

**[tag ③]** For staff, the reference model uses single sign-on, multi-factor authentication, role-based access, and time-limited emergency access. The bank sets review cadence and production-access policy. We make grants and changes auditable.

**[tag ④]** For AI agents and pipelines, the proposed boundary is development-only agent access and a separate deployment role. Tool permissions and secret scanning reduce risk, but do not guarantee that no secret can enter a prompt. We still need review and monitoring.

**[tag ⑤]** The slide proposes a **four-eyes** approval for money-moving changes. Bank risk and security owners decide which actions require it, including emergency procedures.

**[tag ⑥]** Access events should feed security monitoring, and owners should review privileges on a bank-approved schedule. The evidence is a real access log and a completed review, not a policy sentence.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · Protect the Data

**[tag ①]** Data protection starts with classification. The four levels shown—restricted, confidential, internal, and public—are a **sample taxonomy**. The bank applies its own policy and inventory.

**[tag ②]** Customer identifiers, credentials, and keys are sensitive. The bank's data owners classify them and define encryption, masking, access, and logging rules. Engineering tests that sensitive fields do not leak into logs or lower environments.

**[tag ③]** The reference design proposes TLS in transit and encryption at rest for Aurora, Kafka, and storage. Key ownership and rotation require bank security review; a KMS setting alone is not full data protection.

**[tag ④]** If a scheme requires message signing, a hardware security module may protect the keys. Scheme and security specialists define the exact custody, signing, and rotation process.

**[tag ⑤]** Data location and retention are **bank legal decisions**. The EU-region and five-year boxes on this slide are sample controls, not universal requirements. Privacy, AML, and legal owners must agree the applicable jurisdiction, retention schedule, deletion rules, and disaster recovery location.

**[tag ⑥]** AI use needs an approved data boundary. The bank decides whether a model may see code or customer data, what masking is required, what is logged, and who approves each use case. We would enforce those decisions with access controls and tests, then monitor for leakage.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · Checked Every Time, by Machines

**[tag ①]** Compliance still requires legal judgment and accountable owners. Engineering can turn **approved controls** into repeatable pipeline checks. That gives reviewers timely evidence instead of a late document hunt.

**[tag ②]** A secrets scan and a code scan catch known classes of mistakes. They reduce exposure but cannot prove the code has no secret or vulnerability.

**[tag ③]** Dependency scanning and a software bill of materials improve visibility into libraries. When a flaw appears, the team can investigate affected components quickly; "in minutes" is a response target to measure, not a guaranteed result.

**[tag ④]** The proposed pipeline scans infrastructure and images, signs release artifacts, and applies a bank-approved gate to critical findings. Exceptions need a named risk owner and expiry. AI-written code follows the same review path.

**[tag ⑤]** The important link is from **bank-approved obligation** to control to evidence. DORA-related ICT risk and strong-authentication requirements may lead to encryption checks and contract tests, but one automated check cannot prove legal compliance. Compliance owns the interpretation; engineering shows what the control did.

**[tag ⑥]** Evidence should be collected at the agreed cadence, protected from alteration, and linked to the control version. Auditors still need context and human explanation, but the evidence trail should be ready.

**[tag ⑦]** AI can draft policy checks and summarise findings. Security engineers validate the logic and test false positives before the rule can block or approve a release.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Stop Fraud in 10 Seconds

**[tag ①]** Fast payment flows leave little time for intervention, so this sample uses layered controls. Before submission, the proposed flow includes Verification of Payee, authentication, and limits. The bank's fraud, product, and scheme owners define when each applies.

**[tag ②]** During processing, the diagram gives fraud scoring a one-hundred-and-fifty-millisecond **budget** within a half-second internal target. These are not measured results. The fraud team defines signals and actions; engineering measures latency and handles a slow or unavailable scorer.

**[tag ③]** After submission, AML monitoring may look across transactions. A suspected fraud case needs a bank-approved investigation and recall path. A camt.056 may apply in some flows, but it does not guarantee funds return.

**[tag ④]** **Authorised push payment fraud** is one important threat: a criminal persuades a customer to approve a transfer. The relative scale varies by market and bank, so the fraud owner supplies local data and priorities.

**[tag ⑤]** Authentication confirms who approved a payment; it may not reveal deception. The bank might add payee warnings or step-up checks for risky cases. Fraud, product, and legal owners must decide customer wording, friction, liability, and market-specific obligations.

**[tag ⑥]** On the right, the proposed architecture gives AML a payment **event feed**. That is an engineering interface option, subject to AML data and timing requirements.

**[tag ⑦]** The direct DB2 read can be removed only after the new feed is reconciled and approved. The sanctions cadence also stays with bank compliance; the slide's daily job is a scenario assumption.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · Operate Securely, Then Sign Off

**[tag ①]** Security continues after launch. In an EU-regulated context, DORA may impose timed reporting for a **major ICT incident**. The four-hour, twenty-four-hour, seventy-two-hour, and one-month markers on this slide need compliance validation against the current rule and the bank's incident classification. My role is to build the detection, evidence, and escalation workflow around the approved timetable.

**[tag ②]** Third-party risk needs a current supplier inventory. Whether AWS or an AI provider is classified as critical for a particular function is a bank governance decision. Engineering supplies the service dependencies and exit assumptions.

**[tag ③]** Contracts, data location, audit rights, exit support, and resilience tests need bank legal and risk review. A written exit plan is only credible after the team tests key recovery assumptions. Any threat-led testing cadence must come from the bank's applicable obligations.

**[tag ④]** AI-written code needs the same review and tests as human code. Prompt injection and secret leakage require limited tools, access controls, and monitoring. The bank's supplier and data governance decides how the model provider is recorded and assessed.

**[tag ⑤]** The proposed release gate asks named security, privacy, and compliance owners to review their parts. Thirty-four requirements and two accepted risks are **illustrative counts**, not a completed assessment. Every accepted risk needs an owner, rationale, expiry, and compensating control where appropriate.

**[tag ⑥]** The requirements stage can close only when the bank's open domain, risk, and legal questions are resolved or explicitly carried forward. Episode seven turns the approved boundaries and controls into a target architecture and a testable delivery plan.
<!-- /slide -->

---
