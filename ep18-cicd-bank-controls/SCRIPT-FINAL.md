# EP 18 · CI/CD with Bank Controls: Final Script

**Series:** Core Payments Modernization — execution architecture (Stage 5: Test & Deploy). **Delivery:** clear English for global technology leaders. This is an illustrative bank scenario; bank change, risk, security and payments owners set the real controls.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- Numbers are written as words, so they are easy to read aloud.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · Fast and Safe Are Not Opposites | 205 | 01:45 | 00:00 – 01:45 |
| 2 · One Change, End to End | 199 | 01:40 | 01:45 – 03:25 |
| 3 · Scan Every Change | 184 | 01:35 | 03:25 – 05:00 |
| 4 · Know What You Ship | 215 | 01:50 | 05:00 – 06:50 |
| 5 · Approval by Risk, Not by Meeting | 189 | 01:35 | 06:50 – 08:25 |
| 6 · Release in Small Steps | 182 | 01:35 | 08:25 – 10:00 |
| 7 · Evidence by Design | 174 | 01:30 | 10:00 – 11:30 |
| **Total** | **1348** | **11:30** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · Fast and Safe Are Not Opposites

**[tag ①]** Large organisations often face tension between **speed** and control. This slide contrasts two hypothetical release models. In the first, a developer writes a change ticket and waits for a monthly approval meeting. It is an example, not a claim about how every bank works.

**[tag ②]** If fifty changes are bundled into one release, fault isolation becomes harder and manual evidence takes more work. The number fifty is illustrative. I would measure a bank's actual batch size, failure rate and lead time before recommending a change.

**[tag ③]** The proposed pattern is a smaller change, with a reviewed pull request, controlled canary and tested rollback. Release timing follows the bank's change policy and operational readiness.

**[tag ④]** The key idea is **controls as code**. Tests, scans and approvals become repeatable pipeline rules. Whether a low-risk change can be pre-approved is a bank governance decision; higher-risk changes may require named human approval. I translate that policy into a verifiable workflow.

**[tag ⑤]** Four useful evidence questions are: who changed it, who approved it, what was tested, and how can it be reversed? A pipeline can collect much of that evidence. Audit and compliance owners decide what else is required.

**[validation plan]** Pipeline configuration in Git gives reviewers a traceable control change, subject to bank approval rules.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · One Change, End to End

**[tag ①]** Follow a **proposed** change through the pipeline. It starts as a pull request, with checks and independent review. The bank's segregation-of-duties policy sets who may approve it.

**[tag ②]** The proposed pipeline builds the change **once** and promotes the same container image through environments. That makes the release identity easier to trace.

**[tag ③]** Then come the tests and scans: contract tests, golden tests and NFR tests, and scans of our code, our libraries and our secrets.

**[tag ④]** The pipeline would package and sign the image and attach a software bill of materials. More on that soon.

**[tag ⑤]** Pre-production may add load and running-app security tests. Human approval depends on the bank's risk classification; automation should enforce that classification, not invent it.

**[tag ⑥]** The diagram uses a canary from one to one hundred percent as an example. The on-call team needs authority and a tested way to stop rollout, with stage sizes set from risk and observed metrics.

**[tag ⑦]** At the end, all the evidence is stored and locked.

**[tag ⑧]** AI may summarise a change, explain findings and draft release notes. People validate those outputs. Same-day production is an **aspiration for suitable changes**, not a performance result or a promise that all bank changes should ship that fast.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · Scan Every Change

**[tag ①]** Security needs repeated checks, not only a late review. The diagram proposes seven check types; the bank's security team sets scope and exceptions.

**[tag ②]** SAST scans our own code for unsafe patterns, like injection.

**[tag ③]** SCA scans the open-source libraries we use, for known vulnerabilities. Careful: this SCA is software composition analysis. It is not strong customer authentication!

**[tag ④]** Secret scanning makes sure no passwords or keys reach the repository. One leaked key can open the door to attackers.

**[tag ⑤]** The plan also covers infrastructure code, images, licences and a running-app security scan in pre-production. Tool cost, data access and AWS integration depend on the chosen stack; this slide is a control design, not proof of an installed pipeline.

**[tag ⑥]** A finding needs a decision: fix, or record a time-bound exception with an owner and rationale. Ninety days is an illustrative cap. Security and risk owners set the real policy, and the pipeline enforces expiry.

**[tag ⑦]** AI is very helpful here. It explains each finding in plain words, drafts a fix as a pull request, and groups the same finding across many services. But a developer reviews every AI fix.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · Know What You Ship

**[tag ①]** Modern services include many third-party libraries, so leaders need to know what is shipped. My proposed workflow starts with one build from a reviewed pull request in a controlled environment.

**[tag ②]** The build creates one artefact with three proofs. The first is the **SBOM**, the software bill of materials. It lists every library inside, with its version, like an ingredients label on food.

**[tag ③]** A digital **signature** helps verify the image's origin and integrity. **Provenance** records the build path and commit. These controls reduce risk when key management and verification are implemented correctly; a signature alone is not a guarantee.

**[tag ④]** A Kubernetes admission rule can refuse unsigned images. I would test both allowed and blocked cases before relying on it in production.

**[tag ⑤]** Promoting the same image across environments reduces the chance that a different build reaches production. Environment-specific configuration still needs control and testing.

**[tag ⑥]** Imagine a new library vulnerability. Search the SBOMs, identify affected services, notify owners and assess the fix. The nine-o'clock timeline and three affected services are **illustrative**, not a response time I have observed. Actual speed depends on inventory quality and patch risk.

**[tag ⑦]** The target is a reliable answer to "are we affected?" quickly, backed by current inventory. I would measure response time and test admission controls. Legal teams determine which supply-chain obligations apply.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · Approval by Risk, Not by Meeting

**[tag ①]** Change approval must follow the bank's own governance. The diagram proposes three categories. A **standard** change might be a pre-approved low-risk type; only the bank can authorise the pipeline to release it automatically.

**[tag ②]** A **normal** change may need an independent named approver. A new payment rule would also need domain approval for its meaning, not just a technical review.

**[tag ③]** An **emergency** change needs a controlled faster path and later review. Twenty-four hours is an example window; the bank's incident and audit policies set the real one.

**[tag ④]** A risk score can make classification repeatable. This sample pull request touches the payment path, database and AI-assisted code, giving six points in the **illustrative model**. Bank governance must calibrate the weights and decide who approves.

**[tag ⑤]** Segregation of duties separates author, reviewer and, where policy requires, release approver. The pipeline should prevent self-approval and retain the decision record.

**[tag ⑥]** The deployment identity should have narrow, auditable access. Whether humans retain any standing access is a bank security decision; the target is least privilege.

**[tag ⑦]** Break-glass access needs time limits, approval, logging and review. I would exercise it before an incident, under the bank's access policy.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Release in Small Steps

**[tag ①]** For release, I propose a canary on Kubernetes. **One percent** is an example initial exposure, not a universal safe level.

**[tag ②]** The slide shows ten minutes, then ten, fifty and one hundred percent. Those steps need enough traffic to make metrics meaningful. The bank chooses the observation window and gate thresholds.

**[tag ③]** An alarm should trigger **automatic** rollback when the gate fails. Under five minutes is a target to rehearse and measure. Customer impact still needs monitoring and incident handling.

**[tag ④]** We also need **business-facing** signals, not only CPU: payment outcomes, latency, errors and duplicate debits. Five hundred milliseconds is a sample budget. Payments owners define comparable outcomes and acceptable deltas.

**[tag ⑤]** There is one more important idea: deploy is not release. First, we deploy the new code, but it is switched off. We call this deploying dark.

**[tag ⑥]** Then a feature flag releases it, to pilot customers first. So putting code live and turning a feature on are two separate decisions.

**[tag ⑦]** Database changes can use expand and contract so versions coexist during rollout. I would verify compatibility with real data patterns before removing the old structure.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · Evidence by Design

**[tag ①]** The pipeline can collect a useful evidence chain: pull request, reviewers, approvals, tests, scans, exceptions, SBOM, signature and canary analysis. Bank compliance owners decide which requirements and obligations each record supports.

**[tag ②]** Evidence should have controlled retention and tamper-resistant storage. Years of retention and direct auditor search depend on bank policy, access rules and jurisdiction.

**[tag ③]** The before-and-after numbers are **hypotheses**: monthly to daily releases, shorter lead time and faster recovery. I would establish a baseline, run a controlled rollout and report measured results. No improvement should be claimed from a diagram.

**[tag ④]** And the AI risks here? AI could approve its own code, so AI can **never** approve. An AI suggestion could hide a weakness, so every pull request is reviewed and scanned. And secrets could be pasted into a prompt, so we use secret scans and masked data.

**[tag ⑤]** Episode nineteen examines a proposed shadow ledger and reconciliation. Episode twenty examines a possible segment-by-segment flip. The bank's acceptance evidence determines whether the next gate opens; this series shows the execution method, not a completed banking migration.
<!-- /slide -->

---

## Presenter notes

- Keep the English clear and conversational; pause at each diagram tag.
- Read figures as examples or targets unless measured evidence is available.
- Ask bank domain owners to confirm payment meaning, policy and acceptance before implementation.
