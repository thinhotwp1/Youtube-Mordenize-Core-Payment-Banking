# EP 12 · The Saga Orchestrator: Final Script

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
| 1 · What the Orchestrator Does | 230 | 01:55 | 00:00 – 01:55 |
| 2 · The State Machine | 258 | 02:10 | 01:55 – 04:05 |
| 3 · In the Code: Java 21 | 226 | 01:55 | 04:05 – 06:00 |
| 4 · Time Is a State Too | 180 | 01:30 | 06:00 – 07:30 |
| 5 · Undo Before the Pivot, Forward After | 213 | 01:50 | 07:30 – 09:20 |
| 6 · Test Every Cell, Not Just the Happy Path | 195 | 01:40 | 09:20 – 11:00 |
| 7 · Operations and Handover | 159 | 01:20 | 11:00 – 12:20 |
| **Total** | **1461** | **12:20** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · What the Orchestrator Does

**[tag ①]** In this payment sandbox, the **orchestrator** coordinates a difficult workflow. It begins with PaymentInitiated from the service in episode eleven. The method also applies to complex workflows in other large enterprise systems: make state, ownership, failure and recovery explicit.

**[tag ②]** The orchestrator is the **technical owner** of the workflow state. It records what it knows and selects a next command from approved rules. External systems may still have uncertain or delayed status; the bank defines the authoritative business state.

**[tag ③]** It sends commands to screening, ledger, and scheme adapters, then handles their replies as events. That separation is a reusable enterprise pattern. The bank's experts define what each screening, hold, and scheme response means, and what must be audited.

**[tag ④]** Its proposed database stores workflow state, an inbox for received event IDs, an outbox for commands, and durable timers. I would make related changes atomic and test crash recovery.

**[tag ⑤]** Some states require **people**, such as a possible screening match or an unresolved external status. The bank decides which cases go to operations, who may act, and what the customer may be told.

**[tag ⑥]** Why an orchestrator? It gives engineers and operators one workflow view and one place to trace a stuck instruction. That makes decisions reviewable, but it does not replace ledger or scheme records.

**[validation plan]** Docker, Kafka, PostgreSQL, and a scheme simulator are a proposed test harness; bank specialists would validate the simulated responses.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · The State Machine

**[tag ①]** Here is a **candidate** state machine: initiated, screening, holding funds, submitted, accepted, and settled. The one-and-a-half-second figure is an illustrative target, not observed traffic. The bank must confirm the states and what accepted or settled means.

**[tag ②]** A possible screening match may move to **manual review**. Who reviews it, which evidence they need, and whether the instruction can continue are compliance decisions. I implement the approved path and its audit trail.

**[tag ③]** A failed funds hold needs a defined state and customer response. AM04 appears on the diagram as a possible reason code; scheme and product specialists must confirm whether it applies in this context and what message the customer sees.

**[tag ④]** The dotted line marks a proposed **pivot** in the workflow. I would not equate a generic acceptance message with an irreversible payment. The bank's scheme experts must define the actual point at which automatic compensation is no longer valid.

**[tag ⑤]** If the scheme response is missing, the workflow records **uncertainty**. A pacs.028 inquiry is one possible step under the chosen scheme profile. We do not release funds or mark a payment final until the bank's approved rules resolve the unknown state.

**[tag ⑥]** The six-inquiry limit is an example control. After the approved limit or deadline, an **investigation** queue can hand the case to people with the right authority.

**[tag ⑦]** The table maps state and event to the next state and command. I use it to generate code and tests, then challenge it with bank SMEs. An unmodelled external event can still happen; the system must park it safely and alert an owner.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · In the Code: Java 21

**[tag ①]** The slide shows a Java twenty-one **design sketch**. A sealed interface lists known internal event types. It makes handled cases visible at compile time, though external messages can still be unknown or malformed.

**[tag ②]** The inbox checks whether an event ID was processed before. If yes, the handler can skip it. That reduces duplicate effects, but the ledger and scheme adapters need their own idempotency guarantees and tests.

**[tag ③]** A switch handles each known event with **no** default branch. In this design, a new sealed event type should force a compile-time decision. That is useful engineering feedback, not proof that every business case has been found.

**[tag ④]** Inbox entry, new state, and outgoing commands should commit in the **same** database transaction. I would test crashes before and after commit to verify replay behavior.

**[tag ⑤]** Two events can race on one instruction. This design uses a version number and retries after a conflict. In other enterprise systems I have used locking to manage contention; here I would compare optimistic retries with pessimistic locking under load. Bank owners define the balance and ordering invariants, while benchmarks expose wait time and deadlocks.

**[tag ⑥]** AI could draft the switch from an approved state table. Engineers would review each transition against stories, add ArchUnit checks, and run failure tests. This script describes a method; it does not claim a squad has completed or certified the implementation.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · Time Is a State Too

**[tag ①]** Time is a state too. Each waiting state needs a **deadline** and an owner. The three-hundred-millisecond screening, two-second hold, and four-hour review values on the diagram are example budgets. The bank sets them from service obligations and operational capacity.

**[tag ②]** An unknown scheme response is the most sensitive timer. After an approved deadline, the workflow may **ask** for status. It must not undo blindly, because the external outcome may already be final. The scheme owner defines the permitted inquiry path.

**[tag ③]** Five-second intervals and six attempts are illustrative. I would test rate limits and escalation timing with the bank's scheme and operations teams.

**[tag ④]** Technically, a timer row can be saved with the workflow state. A worker polls for due timers and emits TimeoutFired. I would test duplicate timer firing and worker failure, because timers are usually at-least-once in practice.

**[tag ⑤]** Database timers survive a pod restart, provided the database remains available. A region failover needs separate recovery tests. A **late** scheme answer can race with an inquiry, so the state machine must process it once or park it for investigation under approved rules.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · Undo Before the Pivot, Forward After

**[tag ①]** The diagram separates compensation before a confirmed pivot from forward recovery after it. An **undo** might release a hold or restore a limit, but only if the bank's ledger and risk owners confirm those operations are valid. Customer messaging follows the approved state.

**[tag ②]** I would design compensation commands to be **idempotent** and test retries with the same key. A key alone is insufficient without an adapter contract that honours it.

**[tag ③]** After the scheme-defined pivot, automatic undo may be invalid. The system should recover **forward** under the bank's ledger rules: retry safely, reconcile, and alert when progress stalls. A one-minute alert is an example threshold, not a universal payment rule.

**[tag ④]** A later dispute or recall follows the bank's product and scheme processes. The camt.056 shown is one possible message in the reference route, not the only remedy in every case.

**[tag ⑤]** My engineering controls are an append-only history, idempotent commands, bounded retries with escalation, and visible audit records. These make failure handling inspectable. They do not decide when a payment may legally be reversed.

**[tag ⑥]** Here is a **hypothetical** rejection case. If an approved scheme response means the payment failed and a hold may be released, the saga records that result and requests release. The bank decides the customer-facing reason and when it can be sent.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Test Every Cell, Not Just the Happy Path

**[tag ①]** The state-event matrix is my test design. Nine states times seven events gives **sixty-three candidate cells**. Each needs an expected action: move, ignore with evidence, or park and alert. The counts describe this model, not a completed test suite.

**[tag ②]** Three cells are marked red in the example. One is an acceptance response arriving after a hold was released. That is an unresolved financial state, not proof money moved. The workflow should park it and alert an authorised person **immediately**.

**[tag ③]** A scheme simulator should test rejection, timeout, late answer, and duplicate answer. Bank scheme specialists must validate the simulated messages and meanings.

**[tag ④]** A proposed chaos test kills the orchestrator mid-workflow and checks recovery from durable state. The test must verify no duplicate financial effect, not just that the process restarts.

**[tag ⑤]** AI can draft the matrix and test cases from the approved table. Engineers and bank SMEs then challenge every orange and red cell, including states the first table missed. No AI-generated matrix is self-validating.

**[tag ⑥]** In a delivery programme, a named squad would own these tests in CI. The exit criterion is coverage of the approved matrix plus failure and reconciliation evidence, not a green chart alone.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · Operations and Handover

**[tag ①]** Finally, operations. The diagram uses a tracking ID, such as a UETR where applicable, to connect state changes and timestamps. The twelve-, three-hundred-, and one-thousand-five-hundred-millisecond values are **illustrative trace data**, not a live bank measurement.

**[tag ②]** A proposed dashboard tracks work in flight, stuck cases, inquiries, compensations, and latency. The twenty-four-millisecond p99 on this slide is an example against a thirty-millisecond design budget. Actual performance needs a published workload and test result.

**[tag ③]** The reference ops console has manual-review and investigation queues. The bank defines ownership, evidence, permissions, and escalation times.

**[tag ④]** Every console action should be **audited** with actor, action, and time. Sensitive actions may require a second approver, according to the bank's policy.

**[tag ⑤]** The release gate would require the approved transition tests, chaos and duplicate tests, reconciliation evidence, and operations review to pass. No such result is claimed here. Episode thirteen examines routing at the legacy boundary. Visibility gives us evidence to question and improve a system, not automatic trust.
<!-- /slide -->

