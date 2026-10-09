# EP 09 · Roadmap, Team & AI Guardrails: Final Script

**Series:** Core Payments Modernization on AWS (reference scenario). **Speed:** about 120–130 words per minute. **Level:** clear international English.

**How to read it:** **bold** = stress the word · full stop = short pause · each new **[tag]** = a longer pause, where you draw your arrow.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · From Design to a Plan | 181 | 01:35 | 00:00 – 01:35 |
| 2 · The Roadmap: Slice by Slice | 247 | 02:05 | 01:35 – 03:40 |
| 3 · The Team: Who Builds What | 198 | 01:40 | 03:40 – 05:20 |
| 4 · The Money: Build, Run and Dual-Run | 188 | 01:35 | 05:20 – 06:55 |
| 5 · AI Guardrails for the Whole Programme | 165 | 01:25 | 06:55 – 08:20 |
| 6 · Gates, Done and Metrics | 170 | 01:30 | 08:20 – 09:50 |
| 7 · Risks and the First 90 Days | 177 | 01:30 | 09:50 – 11:20 |
| **Total** | **1326** | **11:20** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · From Design to a Plan

**[tag ①]** This is the final design and planning episode. The earlier episodes produced a **reference set** of inputs: rules to validate with the bank, an estate map, a candidate first slice, a backlog, NFRs, security controls, architecture options, and contracts. They are not claims of completed bank approvals.

**[tag ②]** AI can help turn these inputs into a first plan: dependencies, rough estimates, risks, and a budget draft. I would mark uncertain items and ask the owners for evidence.

**[tag ③]** **Leaders** decide. The CTO, payments owner, CFO, risk owner, and architects would review the plan in a real institution. I can make the technical options and trade-offs clear; I do not choose its business priorities.

**[tag ④]** A useful plan answers five questions. What might we build, and when? Who owns each part? What could it cost? How is AI controlled? And what evidence would justify the next step?

**[tag ⑤]** The execution risks are familiar across large enterprises: a fixed date before discovery, teams blocked by dependencies, and AI used without clear rules. I show how I would expose and manage these risks in this payment reference case.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · The Roadmap: Slice by Slice

**[tag ①]** Here is an **illustrative** twenty-four-month roadmap, not a forecast for a real bank. Phase zero sets a proposed AWS landing zone, delivery pipeline, and AI guardrails. The bank would decide whether this is the right starting point and pace.

**[tag ②]** A possible warm-up is a read-only status API. It may have a smaller change surface, but production still needs data, security, and operations approval. Its purpose would be to test the delivery path end to end.

**[tag ③]** The diagram uses outbound domestic instant payments as slice one. A staff and limited-customer pilot is one possible route. The bank's product, risk, and scheme owners choose the segment and release criteria; meeting KPIs would support, not automatically trigger, expansion.

**[tag ④]** Later slices on this example are inbound payments, recalls, and payroll files. Their order is a **hypothesis**. Each yellow diamond is a proposed go or no-go gate backed by technical, operational, and business evidence.

**[tag ⑤]** A shadow ledger could run in **parallel** if the bank wants to test it. Reconciliation results over time would help assess it. The bank must define what level of agreement is enough.

**[tag ⑥]** The diagram places a system-of-record change late and by segment. That is a risk-reduction option, not an approved date. Cross-border work would need its own discovery and domain review.

**[tag ⑦]** A board could track slices actually live, traffic share, measured legacy load reduction, and incidents or rollbacks. The roadmap changes when those numbers and the bank's risk view change. It is a decision tool, not a promise.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · The Team: Who Builds What

**[tag ①]** Now the people. The diagram proposes three squads of six or seven for the reference slice: initiation and orchestration, screening and limits, and ledger and scheme integration. Actual staffing and ownership depend on the bank's existing teams and obligations.

**[tag ②]** A platform team could provide the shared foundation **once** as a service: landing zone, Kubernetes, Kafka, pipelines, and observability. This is how I would structure shared engineering work, informed by similar problems in large enterprise systems.

**[tag ③]** Legacy-system experts are essential. They validate what the ledger actually does and help the integration squad avoid guessing from code alone.

**[tag ④]** An **AI enablement** function could maintain AGENTS.md rules, approved tools, and examples for squads. It must work under the bank's data and model policies.

**[tag ⑤]** I would involve security, compliance, and SRE early, with clear contacts for each squad. That makes questions visible before a release gate.

**[tag ⑥]** Decision rights are explicit. Product owners set priorities. Architecture owners approve technical decisions. Compliance interprets obligations. Payments and risk leaders decide whether a slice may go live. I provide options and engineering evidence for those decisions.

**[tag ⑦]** The one-to-three-to-five squad path is illustrative. I would grow capacity only when ownership and operational support keep pace with delivery.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · The Money: Build, Run and Dual-Run

**[tag ①]** Now the cost model. The chart uses an **index**: one hundred stands for current payment spend. It is not based on an actual bank's books. The black line represents total cost in this example.

**[tag ②]** In this scenario, cost goes **up** during dual run: legacy capacity remains, AWS begins, and the delivery team grows. I would measure this overlap, not assume it will be short.

**[tag ③]** After traffic moves, legacy load may fall. Contract terms and fixed costs may delay any savings. A CFO needs the actual capacity and commercial model, not just a traffic chart.

**[tag ④]** The twenty percent reduction in year three is an **illustrative assumption**, not a result or business case. A bank would build its own model using contracts, usage, staff, risk, and dual-run duration.

**[tag ⑤]** The diagram groups costs into four drivers: legacy capacity, AWS, delivery team, and dual run. These categories help frame questions for finance.

**[tag ⑥]** A staged funding model can limit exposure. At each gate, leaders compare the agreed KPIs, costs, and risks with evidence. They may continue, change scope, or stop. That is a funding decision for the bank, supported by transparent **engineering evidence**.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · AI Guardrails for the Whole Programme

**[tag ①]** The diagram scales AI guardrails from one task to a reference programme. At the top, the bank's own AI policy defines approved tools, model review, and data rules. My technical process must fit inside that policy.

**[tag ②]** A programme-level AGENTS.md could record agreed architecture rules for repositories.

**[tag ③]** Service-level guidance can add detail, provided it does not conflict with higher-level policy.

**[tag ④]** At the bottom, CI can **enforce** technical rules through architecture tests, secret and licence scans, security checks, and human review.

**[tag ⑤]** Example rules include outbox publishing, idempotent commands, decimal money types, and no customer data in prompts. Any legal or business rule needs an authoritative bank source and owner; AI must not invent one.

**[tag ⑥]** Within bank policy, AI **may** draft code, tests, stories, and documents, explain legacy code, and suggest review fixes. These drafts are engineering inputs.

**[tag ⑦]** In this proposed model, AI cannot approve a pull request, deploy to production, access customer data, or interpret legal obligations. Named people remain accountable, subject to the bank's actual policy.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Gates, Done and Metrics

**[tag ①]** The diagram shows a possible delivery rhythm: two-week cycles to plan, build, inspect evidence, and improve. A bank may use a different cadence.

**[tag ②]** Periodic joint planning helps squads expose dependencies **together**, before those dependencies block delivery.

**[tag ③]** Each slice would pass the bank's own go or no-go gate, with architecture, risk, operations, and payments ownership represented.

**[tag ④]** For suitable changes, canary release and tested rollback can reduce technical risk. Some payment changes require a more controlled window or cannot be undone; the bank decides the release mode.

**[tag ⑤]** A Definition of Done can require acceptance and contract tests, NFR evidence, security checks, runbook updates, and human review. Business acceptance criteria must come from the bank's owners.

**[tag ⑥]** Delivery metrics can show deployment frequency, change lead time, failure rate, and recovery time. These are the DevOps DORA metrics, separate from the EU regulation of the same name.

**[tag ⑦]** I would also measure AI contribution and rework: reviewed drafts accepted, defects associated with AI-generated changes, and time spent correcting them. Otherwise, claimed productivity is just a guess.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · Risks and the First 90 Days

**[tag ①]** The reference plan has six risk categories: loss of legacy knowledge, a possible availability gap, scope growth, over-trust in AI, dual-run cost, and changing regulation. Their likelihood must be assessed for the real estate.

**[tag ②]** In a real programme, each risk needs a named **owner**, a response, and a review date. The list on this slide is a starting template.

**[tag ③]** The first ninety days on the diagram are a **planning example**. Weeks one to four focus on confirming owners and rules, testing the platform foundation, and preparing golden tests.

**[tag ④]** Weeks five to eight show a possible warm-up release. Production timing depends on the bank's approvals and readiness. A successful release would provide evidence about the pipeline, not prove the whole programme.

**[tag ⑤]** Weeks nine to thirteen prepare the first slice and a pilot-readiness review. The exact sequence changes with dependencies and risk findings.

**[tag ⑥]** Episode ten moves from the reference plan to a platform design using Terraform and a local test stack. I will show how I turn uncertain requirements into reviewable **engineering work**, while the bank retains business decisions.
<!-- /slide -->

