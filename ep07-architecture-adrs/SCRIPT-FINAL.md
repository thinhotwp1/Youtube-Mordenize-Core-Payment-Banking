# EP 07 · Target Architecture & ADRs: Final Script

**Series:** Core Payments Modernization on AWS (reference scenario). **Speed:** about 120–130 words per minute. **Level:** clear international English.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- Numbers are written as words, so they are easy to read aloud.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · Architecture Starts From Drivers | 229 | 01:55 | 00:00 – 01:55 |
| 2 · Slice 1 in Context | 219 | 01:50 | 01:55 – 03:45 |
| 3 · Inside the Platform | 237 | 02:00 | 03:45 – 05:45 |
| 4 · Follow One Payment Through the Design | 263 | 02:10 | 05:45 – 07:55 |
| 5 · Staying 24/7 When the Mainframe Sleeps | 301 | 02:30 | 07:55 – 10:25 |
| 6 · ADRs: Decisions You Can Audit | 279 | 02:20 | 10:25 – 12:45 |
| 7 · Review, Guardrails & Hand Over | 208 | 01:45 | 12:45 – 14:30 |
| **Total** | **1736** | **14:30** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · Architecture Starts From Drivers

**[tag ①]** Welcome to the **design** stage. This is a reference case, not a claim that I have modernised a bank's payment core. The bank owns its business rules and risk choices. My role is to turn those confirmed inputs into technical decisions. I start with a rules catalog, a proposed first slice, a backlog, NFRs, and security controls.

**[tag ②]** From these, I identify the architecture **drivers**: requirements that shape the design. In this example, preventing duplicate processing and lost instructions ranks above speed. Then come availability, recovery, security, audit, changeability, and cost. The bank must confirm that order and the exact targets.

**[tag ③]** Why rank them? Because drivers **conflict**. I would not remove an idempotency check just to save five milliseconds. The ninety-nine point nine nine availability figure on this slide is an example target, not a measured result or a universal banking requirement. A separate service earns its place only when its ownership and release needs justify it.

**[tag ④]** AI can draft options, link each one to an NFR, and flag conflicts. Architects test the options; the bank's owners **choose** and approve the trade-offs.

**[tag ⑤]** The proposed outputs are C4 diagrams, architecture decision records, automated fitness checks, and a review decision. In a real programme, these are only approved through the bank's own governance.

**[validation plan]** The engineering evidence would be versioned Structurizr diagrams and decision records in Git, so reviewers can trace each choice.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · Slice 1 in Context

**[tag ①]** I use the **C4** model to make assumptions visible. Level one is context: the proposed system as one box, with people and systems around it. This example starts with a retail customer using a mobile app; a bank may choose a different first slice.

**[tag ②]** The reference platform sits **inside** a bank boundary, beside identity, fraud, notifications, a legacy ledger, sanctions screening, and reporting. The actual estate map must come from the bank's teams.

**[tag ③]** One possible flow calls identity and fraud services in real time. The bank's security and fraud owners define what evidence of consent is needed and when a risk score is used. I translate those decisions into contracts and failure paths.

**[tag ④]** This scenario assumes the mainframe remains the **system of record** in phase one. The ledger team must confirm whether a hold and a later debit are supported, and what each operation means.

**[tag ⑤]** The diagram shows a possible SEPA Instant route and a payee-name check. Which scheme, message flow, and verification obligations apply are business and scheme decisions for the bank's specialists. The architecture isolates those integrations behind adapters.

**[tag ⑥]** At the bottom are asynchronous feeds for screening, anti-money-laundering, reporting, and the general ledger. Their timing, content, and controls need bank approval. Technically, I would publish governed events or files and avoid direct reads of another service's database.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · Inside the Platform

**[tag ①]** Now we zoom in to level two, the **containers**. Amazon API Gateway is the proposed public entry point. Authentication and overload controls still depend on the bank's identity design and measured traffic.

**[tag ②]** Behind it, a router can use an AppConfig flag to select the new or legacy route. This diagram assumes a limited retail pilot; the bank would select the segment and release gate. KMS and Secrets Manager hold keys and secrets, outside source code.

**[tag ③]** Inside Amazon EKS, the payment API validates the request and checks idempotency. The **orchestrator** tracks a proposed state machine. A rules service would run rules confirmed by the bank's business and risk owners.

**[tag ④]** On the right are **adapters** for payee verification, fraud, the legacy ledger, and the scheme. They contain partner-specific formats. A change may still affect contracts or operations, but the adapter is where I try to limit that impact.

**[tag ⑤]** The **stand-in** ledger is a candidate, not a production recommendation. It would need strong evidence about balances, exposure, reconciliation, legal obligations, and scheme rules before any bank could use it.

**[tag ⑥]** Below are data and events. In this design, services own separate schemas in Aurora PostgreSQL. Debezium reads database changes from the outbox and publishes through Amazon MSK, our Kafka. OpenTelemetry, CloudWatch, and X-Ray provide trace evidence across the flow.

**[tag ⑦]** A second region is a recovery option. We would test replication, failover, and the actual recovery time against the bank's agreed targets.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · Follow One Payment Through the Design

**[tag ①]** Let's follow one payment through this reference design. The app sends an Idempotency-Key. If a network failure causes a retry, the service should recognise the same instruction and avoid creating a second one. I would prove that with concurrency tests.

**[tag ②]** The payment API aims to answer quickly: accepted for processing, still pending. That response is not proof that money has moved. A later status update comes from the approved business flow.

**[tag ③]** The payment API saves the payment record and an outbox entry in one database transaction. Kafka then carries the event to the orchestrator, with duplicate handling at the consumer.

**[tag ④]** The orchestrator calls rules, limits, and fraud services. The forty and one hundred and fifty millisecond figures on the diagram are **design budgets**, not benchmarks. A bank would set them from its own service levels and load tests.

**[tag ⑤]** This scenario then asks the legacy ledger to **hold** funds. The one hundred and twenty millisecond figure is a target to investigate. The ledger team must confirm the operation, semantics, and capacity.

**[tag ⑥]** At the scheme boundary, the diagram uses pacs.008, pacs.002, and a possible pacs.028 inquiry. A response marked accepted is not the same as final settlement. Scheme specialists must validate message timing, status meaning, and inquiry rules. The engineering rule is to preserve uncertainty rather than release funds on a guess.

**[tag ⑦]** Finally, the proposed flow posts to the legacy ledger and sends a customer update only when the bank's confirmed state allows it. The half-second p99 shown here is an **illustrative target** for internal steps. It needs a load test and end-to-end reconciliation evidence.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · Staying 24/7 When the Mainframe Sleeps

**[tag ①]** This slide explores a hard architectural question: what if a legacy ledger has a planned outage but the proposed service needs wider hours? I have not made this decision for a bank. Here are three candidate options scored against the example drivers.

**[tag ②]** Option B, **stand-in** processing, appears on the diagram as the working hypothesis for slice one. It cannot claim a ninety-nine point nine nine percent outcome, a risk rating, or a delivery date yet. Those require evidence and approval from ledger, finance, risk, compliance, and scheme owners.

**[tag ③]** Option A extends legacy availability and could be a longer-term path. Option C considers a degraded mode. Neither is automatically safer or faster. I would compare feasibility, customer impact, financial exposure, and operational burden with the people who own those risks.

**[tag ④]** How might a stand-in work? The diagram uses a copied balance, existing holds, and an example limit of one thousand euros. A stale balance alone is not enough to authorise money movement. Before any build, we would test freshness, concurrent channels, reservation semantics, exposure caps, and whether the bank may legally operate this way.

**[tag ⑤]** If a stand-in were approved, each instruction would need durable ordering, idempotent posting, and a reconciliation path when the ledger returns. A payment ID helps with deduplication; it does not prove exactly-once posting by itself. We would test retries, partial failures, and any differences before release.

**[tag ⑥]** If the transaction is outside approved limits, the design must fail safely and show a message approved by the bank. Whether another payment route is offered is a product and scheme decision.

**[tag ⑦]** Risk owners would set exposure limits, maximum duration, alerts, and reporting. I would first run a **spike** with failure and replay tests, then present the evidence to the bank. The architecture is only credible if its controls can be demonstrated.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · ADRs: Decisions You Can Audit

**[tag ①]** I put each major technical choice in an architecture decision record, or ADR. This **example** is ADR zero zero five: stand-in processing. It records a question, not an actual bank approval.

**[tag ②]** It starts with context and options. The diagram marks option B for slice one and A as a possible longer-term path. I would treat that as a provisional recommendation until the bank validates the business and risk assumptions.

**[tag ③]** Next come consequences, good **and** bad. The proposed availability target is ninety-nine point nine nine percent for eligible payments, but stand-in adds reconciliation work and potential financial exposure. Neither the outcome nor the risk size is established by the diagram. An honest ADR makes uncertainty visible.

**[tag ④]** An ADR should have a fitness check. For this case, a planned game day could stop the ledger adapter and measure what happens to eligible requests, balance freshness, and reconciliation. The bank decides whether that test is safe and sufficient.

**[tag ⑤]** The example log has eight candidate decisions, including the first slice and Kafka as the event backbone. Its accepted and proposed labels show a governance pattern, not real approvals. We preserve superseded ADRs so reviewers can see why a design changed.

**[tag ⑥]** AI can draft an ADR from an options matrix and flag conflicts with earlier decisions. Architects verify the evidence; the bank's review board is responsible for its own signoff.

**[tag ⑦]** Spikes are where technical confidence becomes evidence. I would measure whether the ledger can meet a one hundred and twenty millisecond budget, whether Kafka handles a five-thousand-per-second test load, and whether replay preserves accounting invariants. The ninety-eight millisecond result shown is an example only; I am not presenting it as a real bank benchmark.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · Review, Guardrails & Hand Over

**[tag ①]** Before building a production payment flow, the bank's architecture and risk owners must **review** the design. The diagram lists possible reviewers: enterprise architecture, security, risk, platform, and the payments business owner. The real approval route belongs to the institution.

**[tag ②]** I would also use an AWS Well-Architected review to challenge operations, security, reliability, performance, cost, and sustainability. Where relevant, the financial-services guidance gives additional questions; it does not replace the bank's controls.

**[tag ③]** Technical decisions become rules the build can **check**. ArchUnit can block cross-service database access and direct Kafka calls from domain code. Latency budgets need load-test evidence, and each ADR needs either a fitness check or a review date.

**[tag ④]** New ADRs can update AGENTS.md, the rulebook for an AI coding assistant. That helps keep generated code aligned with decisions, but a human still checks the result.

**[tag ⑤]** AI may suggest fashionable technology, invent service limits, or forget earlier decisions. I test every choice against a ranked driver, official documentation, and measured spikes. The simplest design that meets confirmed NFRs wins.

**[tag ⑥]** Episode eight turns this reference design into API and event contracts. Then comes the roadmap and build evidence. The point is to show **how** I make an uncertain decision reviewable, while business interpretation and approval remain with the bank.
<!-- /slide -->

