# EP 24 · Continuous Modernisation with AI: Final Script

**Series:** Core Payments Modernization — execution architecture (Stage 6: Operate · final episode). **Delivery:** clear English for global technology leaders. The migration is a reference scenario, not a completed banking programme; domain owners and providers validate all live requirements.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- Numbers are written as words, so they are easy to read aloud.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · Modern Today, Legacy Tomorrow? | 202 | 01:45 | 00:00 – 01:45 |
| 2 · The Yearly Change Calendar | 201 | 01:40 | 01:45 – 03:25 |
| 3 · Every Change, the Same Path | 213 | 01:50 | 03:25 – 05:15 |
| 4 · Small and Often Beats Big and Rare | 184 | 01:35 | 05:15 – 06:50 |
| 5 · Keep the AI Guardrails Current | 182 | 01:35 | 06:50 – 08:25 |
| 6 · Audit Evidence, Always On | 209 | 01:45 | 08:25 – 10:10 |
| 7 · The Full Circle | 199 | 01:40 | 10:10 – 11:50 |
| **Total** | **1390** | **11:50** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · Modern Today, Legacy Tomorrow?

**[tag ①]** Imagine the bank has completed a controlled payment cutover and retired an old path. What happens next? The new platform begins to **age** as soon as it goes live. This is the day-two question in our reference scenario, not a claim that I have completed a core banking migration.

**[tag ②]** Change comes from scheme guides, regulation, security findings, Java and Spring versions, Kafka and cloud services, and AI models. Each has a different owner and timetable. I can design the execution path; bank domain experts decide which external rule applies.

**[tag ③]** The red line is an **illustration** of upgrade debt. If versions are left behind, the next change can become larger and riskier. The slope is not a measured forecast for a bank; it is a pattern leaders should monitor.

**[tag ④]** The green line represents smaller, regular changes. That does not make debt disappear, but it can keep each upgrade reviewable and easier to reverse.

**[tag ⑤]** My aim is an execution system for continuous change: trace impact, draft the change, test it, get the right approvals and observe the release. AI may speed up drafts; people remain accountable for meaning and risk.

**[validation plan]** An SBOM and support-date inventory are evidence inputs; verify provider dates before planning upgrades.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · The Yearly Change Calendar

**[tag ①]** Some change is **predictable**, but the dates differ by provider and scheme. This calendar is a planning example. Bank payments teams bring the current rulebooks; engineering works backward from confirmed effective dates.

**[tag ②]** Swift publishes annual standards releases, commonly in **November**. A bank should confirm its applicable Swift service, profile and testing window from the current Swift guidance, then plan with partners.

**[tag ③]** Java and framework support dates change by vendor and version. Quarterly review is one internal rhythm; it is not a promise that every upgrade fits that cycle.

**[tag ④]** Kubernetes and Amazon EKS have version support windows. The team should read the provider's current schedule and upgrade before support ends, allowing time for compatibility tests.

**[tag ⑤]** Security findings need a risk-based response. The bank's security policy sets patch deadlines and exception handling; no single number fits every finding.

**[tag ⑥]** Business peaks and freeze windows also shape the plan. The dates depend on the bank's customer activity and operations calendar; even a freeze needs an emergency path.

**[tag ⑦]** In the example, several external changes cluster near a busy period. The execution method is to plan **backwards** from validated dates, with testing, partner sign-off and rollback time. The bank decides where a release fits its own calendar.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · Every Change, the Same Path

**[tag ①]** A repeatable change path starts with a signal: a rulebook update, security finding or approaching end of support. The owner records the source and effective date.

**[tag ②]** AI can help map **impact** using an estate graph and requirement links. The output is a hypothesis for engineers and domain owners to verify, not a complete inventory by default.

**[tag ③]** AI may draft code, tests, documents and backlog items. Each draft needs a source and reviewer.

**[tag ④]** Automated tests provide evidence, not the final business decision. Golden and contract tests, performance budgets and security scans should challenge the draft. Failures send it back for investigation.

**[tag ⑤]** People approve according to risk: payments SMEs for message meaning, Compliance for obligations, architecture and SRE for technical and operational fit.

**[tag ⑥]** A controlled release can then collect test and runtime evidence. The repeatable rule is simple: AI drafts, tools check, and accountable people decide.

**[tag ⑦]** Here is a **public external change**, not a project result. Swift says that after fourteen November twenty twenty-six, fully unstructured postal addresses will be removed for cross-border payments; structured or hybrid addresses will be accepted. A bank must confirm its applicable profile and data gaps. The three services, two schemas, four stories, eleven tests and **hours** on this diagram are synthetic impact-analysis outputs, not results from a live estate.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · Small and Often Beats Big and Rare

**[tag ①]** Software ages even when nobody changes the code. The left side illustrates a version gap that grows until an upgrade becomes difficult. The exact curve depends on the platform and support commitments.

**[tag ②]** The right side proposes smaller, regular upgrades. They can be easier to review, but database or message changes may still be hard to reverse and need special planning.

**[tag ③]** A dependency bot, such as Renovate or Dependabot, can open upgrade pull requests. The bank sets which libraries and repositories it may touch.

**[tag ④]** AI could summarise release notes and suggest code changes, with citations to the provider's documentation. Engineers verify compatibility.

**[tag ⑤]** Golden and contract tests, performance checks and security scans help assess the change. If people approve, a canary and SLO monitoring can limit exposure. Java, Spring Boot, Kafka clients and Kubernetes may need different rollback plans even when they use the same governance path.

**[tag ⑥]** The seven- and thirty-day patch windows on this slide are **illustrative policy targets**. Security owners set the real deadlines. An SBOM helps locate exposed services, but "affected in minutes" is a response target to measure, not an automatic result.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · Keep the AI Guardrails Current

**[tag ①]** AI model behaviour and provider support can change. I would treat a model update like a controlled release, with an owner, tests, rollout and rollback plan.

**[tag ②]** First, **evaluate** on tasks with known, bank-approved answers. The suite must cover both technical quality and domain meaning.

**[tag ③]** The bank's model governance team decides whether sign-off is required and what evidence it needs.

**[tag ④]** A limited rollout can start with one authorised team, then expand only after measured results.

**[tag ⑤]** Monitor acceptance, defects and incidents. Useful lessons can become reviewed repository rules and tests; an AGENTS.md file is one possible place for local guidance.

**[tag ⑥]** The evaluation table is **synthetic**. Ninety-seven-percent rule recall, ninety-six-percent instruction adherence and a ninety-eight-percent target are examples, not measurements of a model I deployed. A real decision would use an approved dataset, clear scoring and a named risk owner. If a critical gate fails, the rollout waits.

**[tag ⑦]** The skipped-outbox incident is a **hypothetical failure**. It shows an execution response: add a reviewed architecture rule, an ArchUnit check and a regression test. That reduces repeat risk; it cannot promise the error will never happen again.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Audit Evidence, Always On

**[tag ①]** Audit preparation can consume significant time. I would make evidence a **routine output** of delivery and operation: requirement links, test results, approvals, DR drill records, SLO history, governed AI records and changes. The bank decides which evidence is required and which sensitive logs may be retained.

**[tag ②]** A controlled evidence store can make records tamper-resistant, with access and retention set by the bank and applicable rules. Absolute claims that nobody can ever change or delete data need a tested control design.

**[tag ③]** Imagine an auditor asks for evidence about Verification of Payee. A proposed pack links the obligation, owner, stories, tests, release approvals and measured service results. One second and a pack in minutes are **illustrative targets**; Compliance checks whether the evidence satisfies the actual obligation.

**[tag ④]** The hoped-for outcome is a faster, better-supported answer to an auditor. Weeks to **hours** is a hypothesis to test against the bank's current process.

**[tag ⑤]** DORA includes a register-of-information obligation for ICT third-party arrangements. Compliance and Procurement define its scope and keep the official register. Delivery data may help, but cannot guarantee that the register is complete.

**[tag ⑥]** AI may assemble and link existing records. Compliance checks the pack before external use. The system of record creates the evidence; AI does not invent facts or approve compliance.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · The Full Circle

**[tag ①]** Let's close the **reference** journey. It starts with discovery: a rules catalogue and estate map, built with the people who own them.

**[tag ②]** Next, turn domain needs into backlog items, non-functional targets and security controls.

**[tag ③]** Then record architecture decisions, contracts, a sequenced roadmap and AI guardrails.

**[tag ④]** The build stage asks how a platform, services and a legacy bridge would be implemented and verified.

**[tag ⑤]** Testing and deployment examine CI/CD, a shadow ledger and a possible segment-by-segment cutover. Each move waits for bank-approved evidence.

**[tag ⑥]** Operations bring SRE, recovery, cost and continuous change back into the same loop. New evidence starts discovery **again**.

**[tag ⑦]** The execution principles are: trace each rule to its owner; give each target a test; change in controlled steps; use evidence at every gate; and let AI draft while people decide. Whether the ledger moves last is a bank-specific architecture decision, not a universal rule.

**[tag ⑧]** Thank you for following this series. I bring experience with difficult engineering problems in large enterprises; the bank brings its domain authority. These are my own views; they do not represent any employer, client or organisation. If your organisation faces a similar execution challenge, I would welcome a conversation about the roadmap or delivery leadership.
<!-- /slide -->

---

## Presenter notes

- Treat all impact counts, AI evaluation figures and time savings as synthetic examples.
- Swift source for the postal-address change: [Swift November 2026 call to action](https://www.swift.com/insights/newsletters/iso-20022-bytes-payments-call-action-november-2026). Confirm the applicable service and current profile before publication.
- Provider version and support windows must be checked again close to recording.
