# EP 19 · Shadow Ledger & Reconciliation: Final Script

**Series:** Core Banking Payments Modernization (payments sandbox · Stage 5: Test & Deploy). **Speed:** 120–130 words per minute. **Language:** clear international English for banking and technology leaders.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- Numbers are written as words, so they are easy to read aloud.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · Why a Shadow Ledger | 222 | 01:55 | 00:00 – 01:55 |
| 2 · How the Parallel Run Works | 273 | 02:15 | 01:55 – 04:10 |
| 3 · Three Levels, Every Day | 240 | 02:00 | 04:10 – 06:10 |
| 4 · Find, Classify, Fix Every Break | 199 | 01:40 | 06:10 – 07:50 |
| 5 · Month-End and the Hard Days | 220 | 01:50 | 07:50 – 09:40 |
| 6 · Test Read Offload and MIPS | 189 | 01:35 | 09:40 – 11:15 |
| 7 · Ready to Flip? | 177 | 01:30 | 11:15 – 12:45 |
| **Total** | **1520** | **12:45** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · Why a Shadow Ledger

**[tag ①]** Phase two of this **payments sandbox** is a shadow ledger. The proposed new payment path runs beside a legacy mainframe, while the existing ledger remains the system of record. My focus is the execution decision: what evidence would justify changing that authority? The compare-before-cutover method also applies to other large enterprise migrations.

**[tag ②]** Why is this different from moving an ordinary service? Ledger entries affect balances and financial reporting. The exact posting, interest, fee and rounding rules depend on the bank's products and legal entities. Finance and payments specialists must define those rules. My engineering task is to make each rule traceable, testable and observable.

**[tag ③]** One possible migration pattern keeps the existing ledger authoritative while a **shadow** ledger computes postings from the same approved business events. Customers still use the existing balance source during this phase. The shadow uses rules approved by the bank, not rules invented by an architect.

**[tag ④]** We compare the two results at an agreed cut, down to the unit of money the bank requires. The release gate is **zero unexplained differences**, with every known exception documented.

**[tag ⑤]** I would propose four kinds of evidence: account balances, control totals, results on exceptional days, and signed review by the bank's named owners. The bank decides the acceptance rules and any supervisory process. This phase turns an architecture claim into a testable decision.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · How the Parallel Run Works

**[tag ①]** Here is the proposed parallel run. In this example, CICS posts to DB2 on the mainframe, and DB2 remains the system of record. A different bank would map its actual ledger, interfaces and ownership before using this pattern.

**[tag ②]** Change data capture reads committed DB2 changes and publishes them to Kafka. A mirror in AWS represents the legacy ledger at a known log position. I would measure lag, detect gaps and prove ordering before calling it a faithful copy; “within seconds” is a target to test, not a guarantee.

**[tag ③]** Independently, the proposed ledger engine replays the **same** approved business events using bank-approved posting rules. It builds the shadow books. Keeping this calculation independent matters; otherwise we could compare two copies of the same mistake.

**[tag ④]** The reconciliation engine compares mirror and shadow at the same cut, then checks control totals supplied by the legacy process. Bank finance owners decide which totals are authoritative.

**[tag ⑤]** Every difference goes into a break queue with an owner, source position and resolution trail. Finance and operations review it; Audit receives the evidence the bank's governance requires.

**[tag ⑥]** The mirror may also support selected reads, but only where the bank accepts its freshness, access controls and failure behaviour. Any MIPS saving must be measured against the actual contract.

**[tag ⑦]** Three engineering controls frame this pattern. The legacy ledger is the only writer during the parallel run. The shadow calculation is independent of the mirrored balances. And we compare both sides using paired source and event watermarks, stable posting IDs, and checks for late or missing events. A DB2 log position alone cannot define a Kafka cut. Bank owners still validate the accounting meaning.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · Three Levels, Every Day

**[tag ①]** I would test reconciliation at three levels, subject to the bank's accounting model. First are control totals: count and value of postings by the groups Finance defines. The fourteen point two million postings on the diagram are **illustrative**, not production evidence. Totals can reveal a gap quickly.

**[tag ②]** Second, compare **account balances** at the same cut. The four point one million accounts and thirty-seven differences shown here are sample data. Each difference becomes a break with an owner and a trace.

**[tag ③]** Third, match postings by an agreed stable ID and their accounting meaning. The sample has three hundred and ninety unmatched entries. That is a queue to investigate, not a success result. Totals show whether a gap exists; posting traces help locate **where**.

**[tag ④]** A comparison is valid only at a consistent cut. The legacy log position, the shadow event offset and the bank's business date must be linked. A payment after that cut belongs to a later comparison; it should not be misclassified as a break.

**[tag ⑤]** The diagram proposes frequent stream totals, a daily full comparison, and extra checks around financial close. The bank sets the cadence and the required interest, fee and statement cases.

**[tag ⑥]** This scorecard is a **worked example**: a ninety-nine point nine nine seven percent match rate, thirty-seven breaks, and three unexplained. I would not call that release-ready without the bank's agreed threshold and a complete explanation for each material difference. A percentage alone can hide financial risk.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · Find, Classify, Fix Every Break

**[tag ①]** A difference between two ledger results is a **break**. This chart sketches an illustrative target trajectory over thirty-two weeks and three close cycles. I would use signed reconciliation reports to track actual progress and decide whether the gate is ready.

**[tag ②]** I would start triage with four candidate causes, then let bank specialists refine the taxonomy.

**[tag ③]** Timing: an event was in flight at the cut. It may appear on one side first. We prove that it clears at the next consistent cut rather than assuming it will.

**[tag ④]** A rule gap might be different rounding; a data problem might be a wrong status mapping. Finance decides the correct meaning. Engineering fixes the mapping or implementation and **replays** affected events to test it.

**[tag ⑤]** The legacy result might also contain a defect. We do not silently preserve or “correct” it. The bank's business and control owners decide the treatment, and we record the rule, exception and test.

**[tag ⑥]** AI could group similar breaks and link them to candidate rules, with masked data and source citations. A named owner still confirms each root cause against the records.

**[tag ⑦]** A break closes only with a documented decision, a fix where needed, replay evidence, and a clean re-check.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · Month-End and the Hard Days

**[tag ①]** An ordinary day is not enough evidence. Bank operations and Finance choose the **hard** days that expose their real posting rules.

**[tag ②]** Candidate cases include month-end, quarter-end and year-end. Interest, fees, statements and reporting vary by product and jurisdiction, so the bank defines the actual test set.

**[tag ③]** Add the bank's peak-volume days and the holidays of the schemes it uses. A payroll peak or a TARGET calendar difference may matter for some flows, but not every bank or product.

**[tag ④]** Clock changes and time-zone boundaries also deserve tests. The expected business date comes from bank policy, not from the server clock.

**[tag ⑤]** Close periods need careful comparison because small rounding or posting differences can become material at scale. Finance specifies how to compare accruals, fees, statements and the general ledger interface for the products in scope.

**[tag ⑥]** One common integration problem is the difference between **business date** and event timestamp. A legacy process may use a close calendar, while the new platform records an exact timestamp. The bank must define the cut-off, holidays and time zone.

**[tag ⑦]** An engineering control is to retain both the bank-defined business date and the exact event time, with the rule version used to derive them. We reconcile against the approved business calendar and trace by timestamp. We never assume a Friday payment belongs to Monday without that bank rule.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Test Read Offload and MIPS

**[tag ①]** A parallel-run mirror may support selected **read** workloads before any ledger cutover. Candidates include reporting or balance views, but the bank must approve freshness, access and failure behaviour for each one. I would not move a funds check or AML control based on a generic assumption about acceptable delay.

**[tag ②]** In this reference design, funds checks still use the authoritative legacy path until ownership changes. The bank's ledger experts confirm where the authoritative balance and reservation live.

**[tag ③]** Read offload is a cost **hypothesis**. We measure mainframe usage and contract terms before counting savings.

**[tag ④]** The chart models a fall from one hundred to seventy-eight MIPS units, about twenty-two percent. It is an **illustrative calculation**; actual savings require measured workload and contract evidence.

**[tag ⑤]** Freshness must be observable. The five-second p99 target and thirty-second alert shown here are example thresholds. A bank sets them from each read's tolerance and tests them under peak load.

**[tag ⑥]** If CDC lags, a tested routing control can return eligible reads to the mainframe, provided that path has spare capacity. The on-call team is paged and checks freshness. The fallback is a design to rehearse, not an automatic guarantee.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · Ready to Flip?

**[tag ①]** What evidence would justify a ledger cutover? This reference proposes eight exit criteria, including repeated close cycles, zero unexplained breaks, peak-day comparison, a recovery drill and a rehearsed fallback. The exact durations, signatories and supervisory steps are **bank decisions**. I would agree them before the parallel run, not at its end.

**[tag ②]** In the diagram's example, seven checks are complete and one report is still a draft. That means **not yet** under a strict gate. The bank's named decision owners decide whether a later cutover is approved once evidence is final.

**[tag ③]** Finance, risk, technology and payments operations each need an accountable owner. I can prepare the technical proof, but the bank defines its approval authority and confirms accounting and risk acceptance.

**[tag ④]** AI may assemble links to signed reports and break logs, then draft a summary. People check each claim against the source. The evidence pack is versioned and protected after approval.

**[tag ⑤]** Episode twenty applies this method to a **proposed** segment-by-segment cutover and its fallback limits. Evidence, domain ownership and rehearsed recovery must earn any change of write authority.
<!-- /slide -->


