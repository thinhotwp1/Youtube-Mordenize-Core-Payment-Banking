# EP 15 · Scheme Gateway & ISO 20022: Final Script

**Series:** Core Payments Modernization — execution architecture (Stage 4: Build). **Delivery:** clear English for global technology leaders. This is an illustrative bank scenario; payment-scheme and bank SMEs own message interpretation, policy and acceptance.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- Numbers are written as words, so they are easy to read aloud.
- Message names: say "pacs.008" as **packs oh-oh-eight**, and "camt.056" as **kamt oh-five-six**.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · The Bank’s Door to the Scheme | 210 | 01:45 | 00:00 – 01:45 |
| 2 · Selected Scheme Messages | 178 | 01:30 | 01:45 – 03:15 |
| 3 · From Our Event to a pacs.008 | 208 | 01:45 | 03:15 – 05:00 |
| 4 · Inside the Gateway | 170 | 01:30 | 05:00 – 06:30 |
| 5 · When Answers Are Late — or Wrong | 231 | 01:55 | 06:30 – 08:25 |
| 6 · Test Failure Paths with a Scheme Simulator | 199 | 01:40 | 08:25 – 10:05 |
| 7 · The Real-Money Gate | 181 | 01:35 | 10:05 – 11:40 |
| **Total** | **1377** | **11:40** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · The Bank’s Door to the Scheme

**[tag ①]** The previous episodes described internal boundaries. This one considers the **door** to an external payment scheme. I am using payments as a reference scenario for a broader integration problem I know from large enterprise systems: keep external contracts out of core services. Here, an internal service could publish a submission command through Kafka.

**[tag ②]** The proposed design gives one gateway ownership of scheme integration. It acts as an anti-corruption layer, keeping external message versions and connectivity details out of internal services. The bank decides the actual connectivity boundary.

**[tag ③]** For this SEPA Instant reference case, the outside contract uses a specific ISO 20022 profile and a clearing and settlement mechanism, such as TIPS or RT1. Message versions, fields, network steps and settlement meaning come from the bank and scheme documentation. I would not infer them from the generic ISO standard alone.

**[tag ④]** I would structure the gateway around five engineering duties: translate, validate, protect transport, track state, and retain evidence. The scheme's rules determine the exact message and retention requirements.

**[tag ⑤]** This boundary limits the number of services affected by a scheme change. It does not remove the need to assess downstream contracts, customer communications or operations.

**[validation plan]** A simulator can exercise gateway failure paths; bank and scheme test environments are still required for acceptance.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · Selected Scheme Messages

**[tag ①]** The diagram follows a **sample** two-hundred-and-fifty-euro payment. It is an integration trace, not a statement that every scheme uses this exact sequence.

**[tag ②]** A **pacs.008** is shown as the credit-transfer message. Which fields are mandatory and when it is sent depend on the selected scheme profile.

**[tag ③]** A **pacs.002** may carry a status response. The platform must map that status to a customer-facing state only after the bank's payments team defines what each status means.

**[tag ④]** If a response is late, the engineering rule is **do not guess**. The diagram shows a pacs.028 status inquiry as a candidate path. The scheme rules determine whether, when and how an inquiry is allowed.

**[tag ⑤]** A later problem may need a recall process. The diagram uses **camt.056** as an example request; reason and eligibility must come from payments operations and the scheme rulebook.

**[tag ⑥]** The slide shows **pacs.004** and **camt.029** as possible return and resolution messages. I would ask the payments SME to validate every branch, status and exception before implementation. The set on this slide is deliberately limited; it is not a complete scheme process.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · From Our Event to a pacs.008

**[tag ①]** Now the heart of the gateway: the **mapping**. On the left is our own event, in simple JSON. It has two references, the end-to-end ID and the UETR. It also has the amount, the debtor, the creditor, and the reason for the payment.

**[tag ②]** On the right is a sample pacs.008 in XML. The lines show candidate mappings from internal references, amount, names, accounts and remittance text. Each mapping needs a source rule, target field and test case approved by payments SMEs. A diagram cannot establish the final contract.

**[tag ③]** The gateway may add technical envelope fields such as message ID and transaction count. The settlement method and charge bearer are **not** engineering guesses. Even if this reference profile shows SLEV, the bank must confirm the current scheme guide and message version.

**[tag ④]** AI can draft mapping code and tests from a licensed implementation guide. Engineers check structure; payments SMEs check meaning. Official samples, negative cases and scheme certification would be required before connection. None of those approvals is implied by this reference design.

**[tag ⑤]** I would use three validation layers: ISO schema, scheme profile, and bank-approved business rules. The value is in making every reject explainable and testable. The domain owners supply the actual rules; the engineering team makes them executable.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · Inside the Gateway

**[tag ①]** Let's look inside the gateway. The top lane is outbound. The gateway reads a command from Kafka and **translates** it into a pacs.008.

**[tag ②]** Next, it validates the message against the approved profile. Strong validation reduces avoidable format rejects; it cannot guarantee the scheme will accept every message.

**[tag ③]** The drawing includes an HSM and mutual TLS as a candidate security pattern. The bank and network operator must confirm key custody, signing and transport requirements for their connection.

**[tag ④]** The gateway records a **timer** for missing responses. When it expires, the next action follows the scheme's approved inquiry policy; the diagram illustrates a pacs.028 path.

**[tag ⑤]** The bottom lane handles inbound messages: verify authenticity, parse, detect repeated IDs, update state and publish through an outbox. We still need tests for conflicting responses and late messages; simply dropping duplicates is not enough.

**[tag ⑥]** Both lanes need durable timers, observability and a controlled message archive. Retention, access and evidence format are bank and jurisdiction decisions. The execution goal is to reconstruct what was sent, received and decided.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · When Answers Are Late — or Wrong

**[tag ①]** Most payments get a quick yes. This slide is about the rest. After we send a pacs.008, there are three possible outcomes.

**[tag ②]** For an accepted status, the platform follows the bank-approved booking and customer-status rules. A technical status alone must not be treated as proof of final settlement.

**[tag ③]** For a rejected status, the platform follows the approved hold-release and communication policy, with a clear reason where the scheme permits one.

**[tag ④]** A timeout is **not** a business rejection. The payment is unknown until authoritative evidence arrives. A status inquiry, repeat interval and manual handoff must be specified from the chosen scheme's procedures; the engineering control is to keep that uncertainty visible.

**[tag ⑤]** The reason-code labels on this slide are illustrative. Codes such as AC04, AC06 and AB05 must be checked against the exact ISO version and scheme profile. Operations and customer messaging should use the bank-approved interpretation.

**[tag ⑥]** A later duplicate, fraud report or technical issue may start a recall workflow. The diagram shows camt.056 and sample reasons, but the bank decides eligibility, timing and wording under its scheme rules.

**[tag ⑦]** A return or resolution response can follow, shown here as pacs.004 or camt.029. The real workflow depends on the payment state and scheme process; this slide does not replace that process.

**[tag ⑧]** Every exception, whether it is an inquiry, a recall or an unknown payment, lands in **one** operations queue, with its full message history.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Test Failure Paths with a Scheme Simulator

**[tag ①]** For engineering validation, I would first use a **scheme simulator**. One planned test keeps it silent, advances a test clock, and checks that payment state remains unknown. If the scheme policy calls for pacs.028, the gateway should send it at the approved time. This is a test design, not a claim of a completed scheme test.

**[tag ②]** The simulator, built with WireMock, can play six scenarios. It can accept, reject with a reason, stay silent, or answer twice. It can also accept a recall, or refuse one. Each scenario has an expected result.

**[tag ③]** AI may suggest edge cases, but SMEs select them. The examples include accents, long remittance text, three decimal places, late answers and conflicting responses. Allowed characters and lengths come from the active scheme profile, not from a generic rule I claim to know.

**[tag ④]** Before any go-live decision, the bank would need to pass the applicable official message tests and explain any gaps.

**[tag ⑤]** Scheme **certification** and connectivity approval are separate external gates owned by the bank and scheme. This architecture does not claim either has happened.

**[tag ⑥]** Simulator cases can run in the pipeline on every pull request. External certification tests run in the scheme's approved environment and schedule.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · The Real-Money Gate

**[tag ①]** Before any real-money pilot, I would require evidence of scheme approval, message tests, key handling, archive controls, runbooks and rollback. Fifty milliseconds at five thousand payments per second is an **illustrative design target**; it needs a measured benchmark on the bank's environment. A flag is useful only if the old route and in-flight handling have been tested.

**[tag ②]** For production operation, I would monitor response time, reject rate, reason distribution and status inquiries by message type. The bank's operations team sets alerts and ownership.

**[tag ③]** The slide proposes a target of **zero** payments left unknown beyond one hour. The bank's operations team must set the real threshold and show how unknown cases are resolved.

**[tag ④]** AI could mis-map a field or invent a code. I would require official source references, tests for every mapping and sign-off by a payments expert. Technical tests support that review; they cannot replace domain judgment.

**[tag ⑤]** This is the proposed boundary, not a claim of a connected bank gateway. Episode sixteen looks at how to translate fraud and screening policy into an executable decision path, with a sample one-hundred-and-fifty-millisecond budget.
<!-- /slide -->

---

## Presenter notes

- Keep the English clear and conversational; pause at each diagram tag.
- Read figures as examples or targets unless measured evidence is available.
- Ask bank domain owners to confirm payment meaning, policy and acceptance before implementation.
