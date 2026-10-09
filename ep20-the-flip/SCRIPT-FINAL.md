# EP 20 · The Flip, Segment by Segment: Final Script

**Series:** Core Banking Payments Modernization (reference scenario · Stage 5: Test & Deploy). **Speed:** 120–130 words per minute. **Language:** clear international English for banking and technology leaders.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- Numbers are written as words, so they are easy to read aloud.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · What "the Flip" Really Means | 242 | 02:00 | 00:00 – 02:00 |
| 2 · Earn the Flip | 216 | 01:50 | 02:00 – 03:50 |
| 3 · The Wave Plan | 247 | 02:05 | 03:50 – 05:55 |
| 4 · The Cutover Runbook | 250 | 02:05 | 05:55 – 08:00 |
| 5 · The Fallback Window | 211 | 01:45 | 08:00 – 09:45 |
| 6 · Hypercare and Switch-Off | 189 | 01:35 | 09:45 – 11:20 |
| 7 · Lessons, AI and Handover | 151 | 01:20 | 11:20 – 12:40 |
| **Total** | **1506** | **12:40** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · What "the Flip" Really Means

**[tag ①]** This episode examines a proposed change of **write authority** in our reference scenario. Before cutover, the example DB2 ledger is authoritative for the accounts in scope. The bank's finance and payments owners define what that authority means in its actual books.

**[tag ②]** During the proposed parallel run, a mirror received legacy changes through CDC, while the shadow ledger calculated postings independently from approved events. Reconciliation compared them at a consistent cut. This distinction matters: copying the old balance does not prove the new ledger's logic.

**[tag ③]** After a bank-approved cutover, the new ledger would become the writer for one defined segment. The team must prove that no in-flight payment can write to both ledgers or disappear between them.

**[tag ④]** The old ledger may receive **reverse sync** during a limited fallback window. Because replication can lag or fail, readiness to switch back requires measured lag, reconciliation and a recovery runbook. A follower is not automatically a safe fallback.

**[tag ⑤]** The central technical change is **write authority**, not a bulk copy. A routing table identifies the proposed owner, but routing alone is not enough. We also need fencing against stale writers, idempotent retries, an in-flight transaction policy and a verified cut position.

**[tag ⑥]** This is phase three of an **illustrative** roadmap. Retiring the old payment path would be a later decision, after dependencies, records and fallback obligations are checked. I am showing the engineering questions a bank team would need to answer, not reporting a cutover I have run.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · Earn the Flip

**[tag ①]** Before any cutover, the bank's decision owners ask whether the evidence is **strong enough**. I would propose entry criteria early, then let Finance, payments, risk and operations approve the exact thresholds.

**[tag ②]** The diagram uses example criteria: repeated clean closes, no unexplained breaks, a peak load test at a chosen rate, and a disaster recovery drill. Three closes and five thousand payments per second are **scenario assumptions**, not universal bank requirements or measured results.

**[tag ③]** I would require full rehearsals with production-like, protected data, including switch-back and in-flight recovery. The diagram asks for a verified old-ledger state. The bank must set and measure its own recovery objective. Operations also need a staffed runbook.

**[tag ④]** In this worked example, customer communication and a possible regulatory notice remain open. The decision is **not yet**. Compliance determines whether a notice is required in the relevant jurisdiction.

**[tag ⑤]** The diagram shows a sample approval group across payments, Finance, technology, risk and compliance. The real bank defines who has authority to accept each risk and sign the cutover.

**[tag ⑥]** AI can help assemble links to test results, reconciliation reports and drills. A person checks completeness and provenance before the pack is used for a decision.

**[tag ⑦]** The bank's named governance body decides go, no-go or not yet. AI can organize evidence; accountable people interpret and sign it.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · The Wave Plan

**[tag ①]** One possible design is to cut over in **waves**. The diagram starts with two thousand staff accounts as an illustrative pilot. A bank might choose another segment after studying product and customer risk.

**[tag ②]** The later waves shown are sample groups, not a recommended order for every bank. Domain owners choose boundaries from product rules, dependencies and rollback options. They also choose change windows around their own peaks and close calendar.

**[tag ③]** Each proposed wave would have a controlled switch, a period of close monitoring, and an evidence review. Two to four weeks of hypercare is an example duration for the bank to validate.

**[tag ④]** Only the bank's agreed gate moves the next wave forward. If a condition fails, we pause, investigate and test the fix.

**[tag ⑤]** Technically, the example uses a routing table to record ledger ownership by account. But a wave is not just a column update. The router, both writers and the reconciliation process must agree on the ownership version, and stale writers must be fenced out.

**[tag ⑥]** Consider a cross-wave transfer: Anna's account is on the new ledger and Ben's remains on the old one. That creates two-system consistency risk. The bank's payments and ledger experts must define the exact posting and exception rules.

**[tag ⑦]** A saga is one possible coordination pattern, but it does not make the two ledgers one atomic database. Compensation can fail or arrive late. I would design idempotent legs, explicit pending states, reconciliation and human exception handling, then test the bank-approved invariants under failure.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · The Cutover Runbook

**[tag ①]** Here is an **illustrative runbook** for one wave. A quiet window and change freeze can reduce noise, but the bank's payment calendar decides when this is safe. The seven-day freeze on the diagram is a planning assumption.

**[tag ②]** Before the window, the authorized decision group reviews the latest evidence and makes a go or no-go call. A stale approval is not enough if risk has changed.

**[tag ③]** Finance operations performs the final reconciliation at an agreed cut. Any unexplained break stops the wave; approved exceptions are recorded under the bank's policy.

**[tag ④]** At the cutover point, the team fences old writers and changes ownership in small **batches**. The batch size comes from tested latency, recovery and customer-impact limits.

**[tag ⑤]** The runbook then calls for approved smoke transactions and a review of latency, payment status and reconciliation. The timestamps shown are sample checkpoints. The bank decides which real-money tests are permitted and who observes them.

**[tag ⑥]** The red line marks a **fallback path**, not a one-click promise. Switching back requires a clean ownership cut, a current old ledger, and a plan for payments already in flight.

**[tag ⑦]** For one batch, new payments wait while in-flight work completes on its original owner. We compare balances at a consistent cut, fence that writer, change the ownership version, and release waiting work to the new path. The two-second pause and ten-second limit on the diagram are **targets to benchmark**, not results. A failed pre-switch check leaves the old owner in charge. A failed post-switch check invokes the separate recovery plan.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · The Fallback Window

**[tag ①]** Even a carefully rehearsed wave can fail. The reference design keeps a **fallback window** after new-ledger authority begins.

**[tag ②]** Reverse sync sends new postings to the old ledger, but it is asynchronous and can lag. The team measures its position and reconciles both sides; “always up to date” would be an unsafe assumption.

**[tag ③]** Switching back is a **controlled recovery operation**: pause or fence new writes, establish the last common cut, resolve in-flight items, verify the old ledger, and then change routing. The time must be proven in rehearsals. A routing flag alone cannot make balances correct.

**[tag ④]** The diagram uses two close cycles as an example fallback window. The bank decides when to end reverse sync and whether the old path can be retired. Retention, reporting and downstream dependencies may continue after writes move.

**[tag ⑤]** Fallback triggers are agreed **before** cutover. Candidate triggers include an unexplained break, duplicate or missing payment, prolonged latency, or reverse-sync lag. The numbers on the slide are sample thresholds that the bank must set from its service obligations and tests.

**[tag ⑥]** The bank names an empowered incident commander and an escalation path in advance. The team executes the rehearsed recovery, records each step, and involves payments, Finance and compliance as required. Customer or regulator communication follows the bank's approved policy.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Hypercare and Switch-Off

**[tag ①]** After each wave, I would propose **hypercare** with payments operations, SRE and the owning squads. The two-to-four-week window is an example; the bank ends it only when evidence supports normal operation.

**[tag ②]** The day-fourteen dashboard is **sample data**, not an observed bank result. It shows the types of evidence to review: p99 latency, straight-through processing, breaks, complaints and fallbacks. A credible go decision also needs the bank's baselines and a check for missing or delayed outcomes.

**[tag ③]** Finance receives the signed reconciliation report at the cadence it approves.

**[tag ④]** These numbers invite a review, not an automatic go. The bank's decision owners decide whether wave three can start.

**[tag ⑤]** After the final wave and its approved fallback window, retirement can begin. The bank defines record retention and legal hold requirements before any old data is archived.

**[tag ⑥]** Engineering maps every remaining dependency before disabling CICS programs or batch jobs. Procurement checks whether reduced usage changes the contract; technical shutdown alone does not prove savings.

**[tag ⑦]** The diagram's fall toward zero MIPS is a **scenario goal**, not a forecast. Measure the actual workload and bill after retirement. Keep history, evidence and contracts traceable through the transition.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · Lessons, AI and Handover

**[tag ①]** Where could AI help in this proposed cutover? It could assemble an evidence pack, draft a runbook from rehearsals, flag unusual patterns, and summarize each wave. Those are capabilities to test, with source links and human review.

**[tag ②]** The fallback call belongs to the bank's authorized incident commander, not a model.

**[tag ③]** My experience with difficult enterprise releases suggests useful engineering habits: rehearse with production-like data, start with a small reversible scope, agree stop conditions, and make the fallback observable. The bank chooses its safe calendar and communication plan. Payment semantics must be validated by its specialists.

**[tag ④]** In the **reference roadmap**, a successful final wave would make the new ledger authoritative for the defined payment scope, subject to bank approval.

**[tag ⑤]** The design then moves into operations: observability, incidents, recovery, cost and continuous change. A cutover is not the end of engineering responsibility. The bank's teams need a tested operating model and clear ownership.
<!-- /slide -->


