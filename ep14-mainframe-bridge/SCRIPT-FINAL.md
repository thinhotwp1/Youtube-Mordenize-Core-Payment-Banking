# EP 14 · The Mainframe Bridge: Final Script

**Series:** Core Payments Modernization — execution architecture (Stage 4: Build). **Delivery:** clear English for global technology leaders. This is an illustrative bank scenario; the mainframe and payments teams validate the real estate, policy and acceptance criteria.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- Numbers are written as words, so they are easy to read aloud.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · Two Bridges, Two Directions | 230 | 01:55 | 00:00 – 01:55 |
| 2 · Translate, Don’t Leak | 217 | 01:50 | 01:55 – 03:45 |
| 3 · Calling the Mainframe Safely | 241 | 02:00 | 03:45 – 05:45 |
| 4 · Change Data Capture: DB2 → AWS | 211 | 01:45 | 05:45 – 07:30 |
| 5 · One Truth, Two Worlds | 200 | 01:40 | 07:30 – 09:10 |
| 6 · Simulating the Mainframe Boundary | 193 | 01:40 | 09:10 – 10:50 |
| 7 · Operations and Handover | 185 | 01:35 | 10:50 – 12:25 |
| **Total** | **1477** | **12:25** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · Two Bridges, Two Directions

**[tag ①]** This episode asks how a new platform can coexist with a legacy system of record. That is a familiar enterprise integration problem. The payment sandbox uses a DB2 mainframe ledger: while it stays authoritative, new services need a controlled bridge in two directions. A bank would confirm its own system of record and migration boundary.

**[tag ②]** Commands go **out**. For example, an orchestrator requests a hold of two hundred and fifty euros. An adapter could translate that request to a CICS program through z/OS Connect, then return a clear result.

**[tag ③]** Data comes **in**. If the estate supports log-based change data capture, selected committed DB2 changes can be streamed into Kafka.

**[tag ④]** On AWS, selected changes could build read models for balances and statements. That may reduce mainframe reads. Whether it saves MIPS depends on query volume, freshness rules, and the cost of extra write activity; we would measure it.

**[tag ⑤]** My proposed boundary is that new services do not reach into DB2 directly. Commands go through the adapter; data copies come through an approved feed. Existing bank access paths require an estate review.

**[tag ⑥]** Why consider this bridge early? It lets the ledger remain authoritative while new services are introduced. The one-hundred-and-twenty-millisecond hold budget is a design hypothesis from episode five, to validate with the mainframe team.

**[validation plan]** A local harness can exercise the adapter, simulated mainframe, Kafka and CDC path before bank-specific integration testing.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · Translate, Don’t Leak

**[tag ①]** Let's look inside the ledger adapter. On the left is a clean command from our new platform: ReserveFunds, with a payment ID, an IBAN, an amount, and a currency, in modern JSON.

**[tag ②]** The adapter translates at the **edge**. This example maps an IBAN to an internal account key and encodes amount, text and date for a legacy interface. The actual mapping comes from the bank's copybook and domain rules, not an assumption about every mainframe.

**[tag ③]** On the right, HOLDREQ is a sample COBOL copybook. Its fixed widths, packed decimal amount and two decimal places show why exact contract tests matter. A real copybook may differ.

**[tag ④]** In this example, return code zero zero maps to a confirmed hold, fifty-one to insufficient funds, and F1 to a frozen account. Whether AM04 or AC06 is the correct external reason depends on the message, scheme profile and bank policy. Payments SMEs must approve that translation.

**[tag ⑤]** Code ninety-nine represents an uncertain technical outcome in this sample contract. An unknown result is **not** a business rejection. We need a status inquiry before any retry.

**[tag ⑥]** The technical traps are familiar from other large systems: encoding, decimals, fixed widths and time zones. AI may draft a mapping, but contract tests and bank-approved examples must challenge it, field by field. That is where execution discipline matters.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · Calling the Mainframe Safely

**[tag ①]** I would protect this boundary with four controls. First, a **bulkhead**: a cap on concurrent calls. Six hundred is a sample capacity calculation, not a production setting.

**[tag ②]** Second, a **timeout**. The example uses one hundred and twenty milliseconds; the real value needs measured latency and end-to-end budget approval.

**[tag ③]** Third, a **circuit breaker**. If too many calls fail, we stop calling for a short time, like a fuse in a house. It protects the mainframe, and it protects us.

**[tag ④]** After a timeout, the hold outcome is unknown. I would ask through an approved hold-status inquiry before retrying. That is the same **uncertainty pattern** as an external status inquiry, while the actual interface is bank-specific.

**[tag ⑤]** If the inquiry confirms no hold, a retry may use the **same** payment ID. The diagram proposes a COBOL wrapper that recognises that ID. The mainframe team would decide whether this change is feasible and prove duplicate protection under failures; a wrapper alone is not a guarantee.

**[tag ⑥]** If the circuit is open, the stand-in path from episode seven is a **candidate** response, with an illustrative one-thousand-euro cap. The bank's risk, finance and operations owners must decide whether any stand-in is allowed.

**[tag ⑦]** Why show six hundred? At a hypothetical five thousand requests per second and a one-hundred-and-twenty-millisecond call, Little's Law suggests roughly six hundred calls in flight. This is only a starting estimate. The mainframe team must measure real capacity, branch impact and batch windows before setting the limit.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · Change Data Capture: DB2 → AWS

**[tag ①]** Now the data direction. A log-based CDC product can read committed changes without repeatedly polling tables. It still uses capacity, so we would test its effect on the actual mainframe. Precisely and IBM IIDR are examples of products to assess, not a chosen bank solution.

**[tag ②]** The diagram shows raw Kafka topics per source table. The final topic design depends on data ownership, privacy and consumer needs.

**[tag ③]** Then a transformer decodes the EBCDIC and the packed decimals, and builds clean account events, like "balance changed". Other teams can use them without knowing any COBOL.

**[tag ④]** A stream alone misses earlier records. The proposal combines an initial load with a change stream and keys events by account. We must prove snapshot consistency and ordering across the handover point.

**[tag ⑤]** We measure copy lag against the source. Five seconds is an example alert threshold; the bank decides acceptable freshness for each read use case.

**[tag ⑥]** The copy could support balance views, statements and search. Using it for stand-in decisions is a separate risk decision. In this design, ordinary money decisions still query the authoritative ledger.

**[tag ⑦]** The one-third reduction shown here is a **hypothesis**, not an observed saving. We would compare before and after query volume, CDC overhead and total MIPS, then decide whether read offload is worthwhile.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · One Truth, Two Worlds

**[tag ①]** With two worlds, who is authoritative? In this reference design, the mainframe remains the source of truth. AWS copies carry an "as of" time. Money decisions use the source unless the bank explicitly approves a controlled fallback. The team, not the customer, should detect differences.

**[tag ②]** There is a tricky problem here: the **echo**. The orchestrator asks the adapter to hold funds. CICS places the hold, and DB2 changes. Then CDC sees that change, and sends it back to us. Now the same hold looks like a new event.

**[tag ③]** One possible control is echo suppression using a propagated payment ID. We must verify the legacy change record actually carries a reliable correlation key; otherwise we need another reconciliation method.

**[tag ④]** I would check the copy at two levels. Continuous signals could include row counts, sequence gaps and lag. A one-minute interval is only a proposed monitoring frequency.

**[tag ⑤]** A daily balance reconciliation is one candidate control, down to the **cent** where the domain model supports it. The bank sets coverage, timing and treatment of known differences.

**[tag ⑥]** The diagram's two-point-one-million accounts and three differences are **synthetic test data**. The execution principle is real: every unexplained difference gets an owner, evidence and a resolution path.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Simulating the Mainframe Boundary

**[tag ①]** How would I de-risk a mainframe bridge before integration? Start with the same ledger-adapter code intended for deployment, surrounded by controlled test doubles. The local harness tests engineering behaviour; the bank's interface and environment provide the contract and capacity gates.

**[tag ②]** Toxiproxy could inject delays and broken connections between the adapter and simulator. A recorded fault test would show whether timeout and circuit-breaker behaviour meet the target.

**[tag ③]** A REST shim can mimic z/OS Connect, and GnuCOBOL can execute a **representative** PAYHOLD routine. The bank's approved copybooks and program behaviour become the contract for integration tests.

**[tag ④]** Postgres plays DB2, and Debezium plays the CDC tool, so the data-in direction works too.

**[tag ⑤]** Docker Compose can start this integration harness repeatably. Copybooks are representative until the bank provides its actual interface contract.

**[tag ⑥]** I would plan four test groups: actual copybook contracts, bank-approved golden cases, slow or broken mainframe faults, and CDC initial-load, ordering and echo cases. The local harness supplies early feedback; bank integration tests supply acceptance evidence.

**[tag ⑦]** Before any release, the bank would need tests on its authorised mainframe environment to measure true latency, return codes and MIPS. The frequency belongs in the agreed release plan.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · Operations and Handover

**[tag ①]** To operate this bridge, I would ask for a dashboard covering hold latency, return codes, circuit state, CDC lag, reconciliation breaks and MIPS. Ninety-eight milliseconds at p99 is an **example target reading**, not a measured bank result.

**[tag ②]** And here is the MIPS **surprise**. In phase one, MIPS can go **up**, because instant payments now call CICS twenty-four hours a day, seven days a week.

**[tag ③]** Read offload may offset that increase, but a flat net is only a planning hypothesis. We would measure MIPS per slice and let the evidence shape the next move. Even a later ledger migration does not guarantee a specific saving.

**[tag ④]** The delivery team and the bank's mainframe experts need clear joint ownership for this boundary, including support and incident response.

**[tag ⑤]** Before handover, runbooks must be tested for an open circuit, CDC lag and planned mainframe maintenance.

**[tag ⑥]** AI can accelerate copybook mapping drafts. It cannot certify their meaning. Mainframe owners, payments SMEs and contract tests must validate the mapping before any live use.

**[tag ⑦]** Episode fifteen examines the external scheme boundary, using ISO 20022 messages and a simulator as a reference test pattern.
<!-- /slide -->

---

## Presenter notes

- Keep the English clear and conversational; pause at each diagram tag.
- Read figures as examples or targets unless measured evidence is available.
- Ask bank domain owners to confirm payment meaning, policy and acceptance before implementation.
