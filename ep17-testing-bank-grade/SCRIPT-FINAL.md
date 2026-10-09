# EP 17 · Testing a Bank-Grade Platform: Final Script

**Series:** Core Payments Modernization — execution architecture (Stage 5: Test & Deploy). **Delivery:** clear English for global technology leaders. Payments is the sandbox; the execution method applies across large enterprise systems. Bank domain owners define payment rules and acceptance evidence.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- Numbers are written as words, so they are easy to read aloud.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · Many Layers, One Goal | 226 | 01:55 | 00:00 – 01:55 |
| 2 · Evidence Across Test Environments | 190 | 01:35 | 01:55 – 03:30 |
| 3 · Realistic Data, Zero Real Customers | 199 | 01:40 | 03:30 – 05:10 |
| 4 · AI Writes Tests. People Decide. | 215 | 01:50 | 05:10 – 07:00 |
| 5 · Money Must Never Be Lost | 245 | 02:05 | 07:00 – 09:05 |
| 6 · No Green, No Go | 184 | 01:35 | 09:05 – 10:40 |
| 7 · Pilot Gate Evidence | 211 | 01:45 | 10:40 – 12:25 |
| **Total** | **1470** | **12:25** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · Many Layers, One Goal

**[tag ①]** We are at the test and deploy stage of this **payments sandbox**. In large enterprise systems, I turn requirements into evidence before a critical release. A test pyramid gives fast feedback. Payments and compliance owners define the business cases and the acceptance gate.

**[tag ②]** Unit tests cover small decisions quickly. The slide's three thousand tests and two-minute run are **planning figures**. The real suite and duration would be measured in the delivery pipeline.

**[tag ③]** Next are component tests. They test one whole service, with a real Kafka and a real Postgres database, started in Docker by a tool called Testcontainers.

**[tag ④]** Contract tests check APIs and message formats against agreed interfaces. ISO 20022 meaning and scheme profiles still need payments SME approval; a passing schema test is not enough.

**[tag ⑤]** End-to-end tests exercise payment flows with partner simulators. Golden tests can compare old and new outcomes against bank-approved examples. Fifty thousand nightly cases is an illustrative planning target; the actual suite follows the risk profile and available partner environments.

**[tag ⑥]** Load, fault and security tests probe non-functional risks. Their schedule should reflect change risk and environment cost; weekly and pre-release are sample gates.

**[tag ⑦]** Why this shape? Because the earlier we find a bug, the **cheaper** it is. In a pull request, it costs one developer a few minutes. In production, it costs customers, money, and sometimes a call from the regulator.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · Evidence Across Test Environments

**[tag ①]** The diagram proposes six environments, from local development to production. Each step makes the test more representative and adds evidence for the next release gate.

**[tag ②]** A CI environment created by Terraform could give each pull request a clean test space. Whether it is practical for every change depends on cost, security and provisioning time.

**[tag ③]** Staging should be close enough to production to expose integration risks. Access to a scheme test service and mainframe test system must be arranged with the bank and its partners; this slide does not imply access exists.

**[tag ④]** Partner environments may be scarce, so I would **simulate** interfaces we do not control: the scheme, mainframe, fraud API and Verification of Payee. The bank must later test the real contracts in approved environments.

**[tag ⑤]** Simulators let us force late, duplicate or missing responses. The pacs.028 and camt.056 paths are example cases to confirm against the chosen scheme profile. Passing simulator tests would support our handling of those scenarios; scheme connectivity needs separate certification.

**[tag ⑥]** The proposed loop is create, test, retain evidence and destroy. The exact pull-request gate is a delivery choice; evidence must show what was tested and where.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · Realistic Data, Zero Real Customers

**[tag ①]** Tests need realistic data without exposing customers. I would start with **synthetic** data and subject all datasets to the bank's privacy and security controls. Generated data is safer only when it cannot be linked back to real people.

**[tag ②]** Masked production-derived data may be useful for golden comparisons if the bank permits it and re-identification risk is controlled. Access, retention and environment boundaries need explicit approval.

**[tag ③]** Raw production customer data should not enter ordinary test environments. The bank's privacy and legal teams decide whether any exceptional use is lawful and how it is controlled.

**[tag ④]** To make synthetic data useful, feed the generator bank-approved patterns: peak days, account states, valid identifiers and customer profiles. The earlier episodes provide candidate cases, not evidence of a particular bank's behaviour.

**[tag ⑤]** AI can help generate diverse **synthetic** patterns. Two million accounts and thirty days of payments are illustrative load-test parameters. A fixed seed makes a run repeatable, while separate random runs can expose other failures.

**[tag ⑥]** Before use, the data team should check for real identifiers and document privacy approval under the bank's process.

**[tag ⑦]** Finally, every test run starts from a known state. The data is restored in seconds, so tests never depend on each other.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · AI Writes Tests. People Decide.

**[tag ①]** AI can draft tests quickly, which makes false confidence a real risk. I would start from **approved requirements**: acceptance criteria, rule cards, contracts and non-functional targets. Domain owners must check the payment meaning before code is judged.

**[tag ②]** AI drafts the tests: unit tests, edge cases, contract tests, and load test scripts. And it writes them from the requirement, not from the code. If you test the code against itself, you just copy its bugs.

**[tag ③]** An engineer reviews every test. Is it correct? Does it really test the requirement?

**[tag ④]** Then ask whether a test can **fail**. Mutation testing can change one operator, such as "greater than" to "greater than or equal to", and check whether the suite catches it.

**[tag ⑤]** If a test fails, the mutant is killed. Good: our tests catch that bug. If no test fails, the mutant survived. That means our tests are weak, and we need a new test at the limit.

**[tag ⑥]** The mutation score is the share of seeded changes the tests catch. Eighty-two percent and a seventy-five-percent gate on this slide are **illustrative**, not measured results or universal thresholds.

**[tag ⑦]** Watch for tests that assert nothing, copy a bug, or fail randomly. The twelve-hundred-test count and seventy-four-percent acceptance are sample dashboard figures. A live release gate needs measured review and mutation evidence.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · Money Must Never Be Lost

**[tag ①]** The hard cases are those that can harm customers or create financial breaks. One proposed stress test sends the same request fifty times with one Idempotency-Key. The expected technical invariant is one authorised debit, subject to bank-approved posting rules.

**[tag ②]** Then test late and rejected responses. An unknown outcome must remain visible rather than become a guessed failure. The diagram uses pacs.028 and camt.056 as reference paths; the bank's scheme experts define the correct inquiry, recall, hold and customer-status rules.

**[tag ③]** I would deliberately crash a service during a payment. The outbox should preserve the event through recovery, and reconciliation should detect any gap. That behaviour needs a recorded test result.

**[tag ④]** A mainframe outage test checks the **approved** fallback from episode seven, if any. Late or repeated events must not create an extra financial effect. The exact final state is defined by the bank's ledger and payment rules.

**[tag ⑤]** Calendar boundaries also matter: midnight, month-end, clock changes and leap day. The bank's scheme and posting rules determine expected behaviour. The engineering aim is predictable handling under each case.

**[tag ⑥]** After each run, check bank-approved **invariants**: no duplicate debit, explainable ledger movements, a traceable payment state and no silent unknowns. Total debit-credit treatment and UETR coverage depend on the bank's ledger model and payment rails.

**[tag ⑦]** And finally, property-based tests. Instead of ten examples, the tool creates thousands of random cases, with random amounts, timings and orders, and checks that the invariants always hold. Test the invariants, not just the examples.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · No Green, No Go

**[tag ①]** I would propose four risk-based quality gates. A pull request could run unit, component and contract tests, security checks and key latency tests. Ten minutes is a **target**, to be measured against the actual pipeline.

**[tag ②]** Gate two runs on every merge: end-to-end flows, a sample of golden tests, and a scan of the container image.

**[tag ③]** A deeper scheduled gate could run the full approved golden set, soak tests and dynamic security checks. Fifty thousand cases and twenty-four hours are sample capacity plans, not existing results.

**[tag ④]** The release gate could include a five-thousand-TPS **target** burst, fault exercise, current recovery evidence, risk-based penetration testing and UAT. The bank chooses the real thresholds and release authority.

**[tag ⑤]** Each result should become **traceable evidence**: test, build, environment, owner and linked requirement. Compliance owners map those requirements to applicable obligations. A locked report helps review, but it is only as good as the underlying tests.

**[tag ⑥]** Flaky tests weaken trust. I would quarantine them quickly, assign an owner, and prevent a rerun from hiding a failure. The twenty-four-hour and five-day windows on the slide are proposed service levels for the sandbox.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · Pilot Gate Evidence

**[tag ①]** Machines test mechanics; **people** accept business meaning. Bank payments operations should run their own UAT cases and exercise runbooks and repair paths. I would provide the platform and evidence for that review.

**[tag ②]** Compliance and product owners check customer wording, reason mappings and limits against the bank's obligations and policy.

**[tag ③]** And customer support looks at what customers see, and what they will ask.

**[tag ④]** The go/no-go report should show coverage, open defects, load evidence and current recovery evidence. Zero major defects, five thousand payments per second and four-hundred-and-twenty-millisecond p99 are **illustrative criteria**. Bank leaders set the actual gate using measured results.

**[tag ⑤]** The seven differences shown are an **example** of a comparison report. Every real difference would need a business explanation, owner and sign-off. Engineers should not decide alone whether an old behaviour is a bug or an obligation.

**[tag ⑥]** And the AI risks are guarded. Mutation scores catch tests that check nothing. Tests come from requirements, not from code. AI only sees synthetic data. And people still review a sample and run UAT, because "all green" can create over-trust.

**[tag ⑦]** Episode eighteen looks at CI/CD controls; episode nineteen at a shadow ledger; episode twenty at a possible flip. A pilot is ready only when the bank's domain owners, operations and risk approvers accept measured evidence.
<!-- /slide -->

---

## Presenter notes

- Keep the English clear and conversational; pause at each diagram tag.
- Read figures as examples or targets unless measured evidence is available.
- Ask bank domain owners to confirm payment meaning, policy and acceptance before implementation.
