# EP 02 · Legacy Discovery with AI: Final Script

**Series:** Enterprise modernization reference scenario (Stage 1: Discover). **Speed:** 120–130 words per minute. **Voice:** clear English for technology and business leaders.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- Numbers are written as words, so they are easy to read aloud.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · The Rules Live Below the Waterline | 228 | 01:55 | 00:00 – 01:55 |
| 2 · Six Steps from COBOL to a Signed Catalog | 228 | 01:55 | 01:55 – 03:50 |
| 3 · Get the Code Out Safely, Then Map It | 236 | 02:00 | 03:50 – 05:50 |
| 4 · From COBOL to Plain English — With Proof | 207 | 01:45 | 05:50 – 07:35 |
| 5 · AI Drafts. Experts Decide. | 239 | 02:00 | 07:35 – 09:35 |
| 6 · Prove It Before You Rewrite It | 237 | 02:00 | 09:35 – 11:35 |
| 7 · What Can Go Wrong — and What We Hand Over | 170 | 01:30 | 11:35 – 13:05 |
| **Total** | **1545** | **13:05** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · The Rules Live Below the Waterline

**[tag ①]** Episode one set the engineering problem. Before changing a critical system, I would first establish what the current system actually does. The iceberg is an **illustrative model**: documents are visible, while important behavior may be hidden in code, jobs, data, and operations. We must verify this in the bank's own estate rather than assume its documents are wrong.

**[tag ②]** If this bank uses a mainframe, candidate rules may sit in COBOL programs, copybooks, JCL batch jobs, and DB2 tables or triggers. Static analysis can show where behavior is implemented. It cannot tell us whether that behavior is still valid business policy.

**[tag ③]** The last layer is expert knowledge. Mainframe, payments, finance, and operations specialists can explain **why** a rule exists and whether it should continue. Their availability is a programme dependency that we plan, not a detail to leave until testing.

**[tag ④]** A missed rule can cause duplicate processing, wrong dates, or reconciliation differences. These are example failure modes, not claims about one bank. The bank's domain owners must identify the real cases and their impact.

**[tag ⑤]** The goal is a **traceable candidate catalog**: source, proposed meaning, owner, open question, and test. We cannot promise to find every rule in one pass. AI can draft and group candidates; bank experts decide their meaning and priority.

**[validation plan]** A small GnuCOBOL reference can demonstrate the extraction method. It does not reproduce a bank's mainframe behavior.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · Six Steps from COBOL to a Signed Catalog

**[tag ①]** This diagram proposes six discovery steps shared by tools, AI, and people. Step one is **secure intake**. The bank approves which code and data may be copied, where they may be stored, and who may access them. A private repository is one option.

**[tag ②]** Step two is **inventory and mapping**. Deterministic analysis can identify programs, copybooks, jobs, calls, and data references from the files supplied. We still check coverage against deployment records, because an incomplete export creates an incomplete map.

**[tag ③]** Step three: AI proposes rule descriptions from small code sections and cites exact source lines. The output is a **draft**, not an interpretation the bank can rely on.

**[tag ④]** Step four checks that citations point to real lines and relevant fields. This catches fabricated references. It does not prove the rule is complete or correct.

**[tag ⑤]** Step five is named review. A mainframe expert checks the implementation; a bank business owner checks the policy meaning. They approve, change, or reject each candidate. Unresolved questions remain visible.

**[tag ⑥]** Step six creates characterization tests from approved, masked cases. We record current outputs, then compare them with the new path. A difference triggers review, because the bank may choose to correct an old behavior.

**[tag ⑦]** The proposed outputs are a reviewed catalog, inventory, open questions, and tests. They feed estate mapping and requirements. The repeatable pattern is: AI drafts, tools check evidence, and named experts **decide**.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · Get the Code Out Safely, Then Map It

**[tag ①]** Secure intake starts with the bank's source-of-truth systems, which might include Endevor or ChangeMan. We would record the export version and compare it with the deployed version. That trace matters more than the export tool itself.

**[tag ②]** A private repository in an approved environment can hold the copy. The bank's security team defines location, retention, access, and whether any external model may see it.

**[tag ③]** Next, scan for secrets and sensitive data. Mask test records before analysis. These controls need tests of their own; simply calling data "masked" is not enough.

**[tag ④]** A static analyzer then builds a call and data-use map from the supplied programs, copybooks, and jobs. DB2 and CICS references are candidates for validation against runtime evidence.

**[tag ⑤]** If the bank permits AI analysis, a service such as Amazon Bedrock can be evaluated against its data and model policies. We would verify network path, region, retention, provider terms, and audit logging before sending any code.

**[tag ⑥]** Runtime records such as SMF can show which programs ran during the observed period. A program with no hits is a **review candidate**, not automatically dead code; rare seasonal and recovery paths may not appear in a short window.

**[tag ⑦]** The graph at the bottom is an **illustrative call chain** for payment validation. It shows where account, duplicate, and cut-off checks might sit. A hard-coded five-thirty cut-off is a candidate rule; the bank must confirm which products, dates, and exceptions it applies to.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · From COBOL to Plain English — With Proof

**[tag ①]** This is a small **reference code sample**, not a bank's COBOL. We feed a named paragraph from PAYVALID to the analysis tool with its dependencies, rather than asking a model to infer the whole system at once.

**[tag ②]** Context includes the account copybook and the DB2 fields referenced. That can improve a draft, but a reviewer still has to trace the code path and data meaning.

**[tag ③]** The sample rule card says status F leads to rejection with AC06 and cites source lines. Treat that as a **candidate mapping**. Bank payments and scheme experts must confirm the account status, response code, and customer wording.

**[tag ④]** The orange line checks status D, whose meaning is missing from the sample. The correct output is **unknown** with an owner and question. A plausible AI answer is still unsafe if the source does not support it.

**[tag ⑤]** A deterministic citation check can reject missing line references or wrong fields. The expert then checks the control flow and business meaning. Both checks are needed.

**[tag ⑥]** The other rules shown are also **illustrative**: a high-amount review, a duplicate window, and a cut-off. Their values are not universal bank rules. The useful technique is to expose each assumption, ask a named owner to validate it, and attach a test.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · AI Drafts. Experts Decide.

**[tag ①]** Step five is about **ownership**. A candidate rule may come from AI, static analysis, or an interview. None is approved merely because it is written down.

**[tag ②]** A technical expert checks what the code does. A bank domain owner checks what it **should** do. They may approve, change, or reject the candidate. Keeping these two questions separate prevents us from copying an old defect as policy.

**[tag ③]** In this sample, status D may mean **dormant**. A bank SME would confirm that meaning from data definitions and operations practice. The rule card is updated and reviewed again.

**[tag ④]** Sign-off has **names**. Mainframe specialists validate implementation; payments or operations owners validate business intent; compliance validates any legal interpretation. A Git review can record who approved what and when, if it fits the bank's governance.

**[tag ⑤]** The traceability table links source lines, approved meaning, story, test, and future owner. This lets a reviewer follow a decision without relying on memory. The target is a complete trail, not a promise that every audit question takes one minute.

**[tag ⑥]** Progress measures include candidates found, approved rules, open questions, and code coverage. They show uncertainty as well as work completed; a high rule count alone does not mean discovery is done.

**[tag ⑦]** In large enterprise work, expert time is often the **bottleneck**. I would reserve review sessions, group questions by flow, and start with one bounded slice. This is a delivery decision I can own; the answers remain with bank experts.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Prove It Before You Rewrite It

**[tag ①]** Step six is characterization testing. Approved rules are still words until we test behavior. The bank provides or approves masked cases covering normal, edge, and exception paths.

**[tag ②]** In a real programme, we would run those cases against an approved test environment and capture current outputs. This slide's PAYVALID and GnuCOBOL example shows the **method**, not measured results from a bank's production code.

**[tag ③]** Later, the new Java service receives the same inputs. Equal outputs are useful evidence, but not a complete safety proof: timing, side effects, accounting, and failure behavior also matter.

**[tag ④]** A difference is not corrected automatically. It might be a new defect, an old defect, or a deliberate policy change. The bank's domain owner decides the intended behavior and records the decision.

**[tag ⑤]** BR-014 illustrates a readable test: given a frozen account and a two-hundred-and-fifty-euro request, expect a reviewed response. The bank must confirm whether AC06 is right for this flow. We would run the test on both paths and report the result, not assume it passes.

**[tag ⑥]** AI can suggest **edge cases** at boundaries shown in the sample: exactly one hundred thousand euros, a retry near five minutes, or a payment at five-thirty. Bank SMEs decide which boundaries are real and what the expected result is.

**[tag ⑦]** In the proposed delivery gate, approved characterization tests run in the pipeline. A failure blocks the merge until the team and bank owner explain the difference or approve a deliberate change.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · What Can Go Wrong — and What We Hand Over

**[tag ①]** AI can **invent** a rule. We require source citations, mechanical checks, and expert approval. None of these alone is enough.

**[tag ②]** Code or data could **leak**. The bank must approve the AI environment, access, masking, retention, and logging before use. Its own security and model governance determine the exact control path.

**[tag ③]** People may trust fluent output **too much**. AI cannot approve rules. Named bank experts do, with sampling and challenge for high-risk decisions.

**[tag ④]** Expert time can become the bottleneck. The delivery plan must reserve it and show unresolved questions to leadership early.

**[tag ⑤]** The proposed handover is a reviewed rules catalog, inventory and call graph, open-question log, and characterization tests. Each artifact shows its source and owner.

**[tag ⑥]** These artifacts feed estate mapping and requirements. The bank chooses the first slice; engineering turns approved rules into contracts and tests. Later services can run the approved tests as one part of their release evidence.

Discovery is a living control. When the code or policy changes, the source, rule card, and tests must change together.
<!-- /slide -->

---
