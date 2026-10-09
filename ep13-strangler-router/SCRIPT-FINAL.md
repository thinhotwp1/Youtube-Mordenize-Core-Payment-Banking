# EP 13 · The Strangler Router: Final Script

**Series:** Core Payments Modernization — execution architecture (Stage 4: Build). **Delivery:** clear English for global technology leaders. This is an illustrative bank scenario; bank domain owners validate payment policy and acceptance criteria.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- Numbers are written as words, so they are easy to read aloud.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · One Front Door | 227 | 01:55 | 00:00 – 01:55 |
| 2 · How the Router Decides | 201 | 01:40 | 01:55 – 03:35 |
| 3 · Flags as Code | 210 | 01:45 | 03:35 – 05:20 |
| 4 · A Pure Decision | 231 | 01:55 | 05:20 – 07:15 |
| 5 · The Dangerous Edges | 208 | 01:45 | 07:15 – 09:00 |
| 6 · Ramp Up, Roll Back | 197 | 01:40 | 09:00 – 10:40 |
| 7 · Proof Plan and Next | 193 | 01:40 | 10:40 – 12:20 |
| **Total** | **1467** | **12:20** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · One Front Door

**[tag ①]** In large enterprise systems, including airline networks, I have worked with comparable load and routing problems. Gradual traffic shifts and rollback are patterns I can bring here; **payment meaning is not transferable one-to-one**. This router is an illustrative bank design. Domain teams must confirm eligible channels and payment types. In the reference flow, channels keep one API while the gateway checks the caller and reads the Idempotency-Key.

**[tag ②]** Behind the gateway is the **payment router**. It asks one question for every payment: old system, or new platform?

**[tag ③]** The starting assumption is that all eligible traffic stays on the legacy route, through MQ to the mainframe. A bank-approved pilot would move a small share to the new route. That is the dial.

**[tag ④]** The routing policy can be driven by **feature flags** in AWS AppConfig, so an approved cohort change does not require a code release. The rules themselves still need versioning and review.

**[tag ⑤]** I keep the router thin: read a few facts, apply an approved policy, add an internal X-Route trace header, and forward. Twenty milliseconds is a design target from episode five, to be tested against a real baseline.

**[tag ⑥]** The router should not invent payment policy, store balances, or alter the request. Bank domain owners define eligibility; engineers encode and test it. If routing facts are missing, legacy is our proposed default, subject to the bank's safety review.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · How the Router Decides

**[tag ①]** So how does the router decide? First, it reads a few facts, and only facts it can read quickly: the payment type, the channel, the customer segment, the amount, a customer bucket, and the current flags.

**[tag ②]** Then it checks seven rules, from top to bottom. The **first** rule that matches wins.

**[tag ③]** Rule one is the kill switch. If it is on, every new payment goes to legacy. It comes first, so nothing can skip it.

**[tag ④]** Rules two to four are example pilot boundaries: an outbound instant payment, a selected channel, and an illustrative five-hundred-euro cap. The bank's product and risk owners must set the real scope and limit.

**[tag ⑤]** The diagram uses staff first, then retail buckets zero to four, as an example rollout. The bank would choose eligible cohorts and confirm customer treatment.

**[tag ⑥]** And rule seven is the default. If no rule matches, the answer is **always** legacy, the safe answer.

**[tag ⑦]** A stable hash maps a customer ID to a bucket from zero to ninety-nine. That makes the pilot cohort repeatable, so a larger percentage adds customers instead of reshuffling them. It does **not** prove a customer has no payments on both systems; ownership and retry rules still need separate controls.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · Flags as Code

**[tag ①]** How could a flag change safely? In this reference workflow, moving from one to five percent starts with a reviewed pull request. The bank decides who may request and approve the change.

**[tag ②]** Automatic checks run. Is the file valid? Is the new value allowed? And two people must approve it.

**[tag ③]** AWS AppConfig can roll out the new value **gradually**. Ten minutes is a sample setting; production timing depends on how quickly the team can detect harm.

**[tag ④]** Each router has a small agent next to it. It checks for new flags every thirty seconds, and it keeps a local copy.

**[tag ⑤]** The new rule is live without a deployment, and without a restart.

**[tag ⑥]** We would watch error rate, p99 and duplicate signals. A tested alarm should roll the flag back automatically. The rollback path needs its own rehearsal and evidence.

**[tag ⑦]** If the flag service is down, the router can use its last validated copy. With no valid copy, this design proposes the legacy route. We must test that path; a flag outage must not turn into an uncontrolled routing decision.

**[tag ⑧]** On the right is the flag file itself. Kill switch, payment types, channels, the pilot limit, staff, and the retail percentage. Every change has an author, a ticket, and a full history.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · A Pure Decision

**[tag ①]** Now the implementation pattern. In Java twenty-one, I would model the route with a sealed interface: Legacy or NewPlatform, plus the rule that made the decision. This is an example code design, not a deployed router.

**[tag ②]** The decide method is a **pure function**. Same facts in, same answer out, with no side effects. Line six is the kill switch, so it runs before anything else.

**[tag ③]** Then the pilot rules, staff, and retail. And line fourteen is the safe default: legacy.

**[tag ④]** The bucket comes from a stable hash of the customer ID. Stable means it never changes between servers or restarts.

**[tag ⑤]** A **Spring Cloud Gateway** filter could call that function, add the X-Route header and forward the request. The header supports logs and traces, but should remain internal. I would test that it never appears in an external response.

**[tag ⑥]** The tests are simple, because the function is pure. One test for every rule. A property test that tries thousands of random customers, to prove that the same customer always gets the same route. A test that five percent really means about five percent. And a test that missing flags mean legacy.

**[tag ⑦]** AI can draft a policy and property tests from a rule table. The bank's domain owner approves the rule meaning; the architect checks ordering; security reviews the header. Generated code is only a starting point until people and tests validate it.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · The Dangerous Edges

**[tag ①]** Two systems at once create dangerous edges. First, a retry after a flag change could reach the other route and create a duplicate. I would **pin** an Idempotency-Key to its first route for an agreed period. Twenty-four hours is a sample retention window; the bank must confirm the payment retry horizon and test it.

**[tag ②]** Second, a status request must reach the system that owns the payment. The proposal encodes route ownership in a payment reference or lookup. That reference must be reliable across retries and migration.

**[tag ③]** Third: duplicates across systems. Episode two uses a five-minute duplicate window as a working assumption. Sticky cohorts reduce one risk, but they do not close it. A shared recent-payment index may help; bank experts must define what counts as a duplicate, and engineers must prove the index is complete enough.

**[tag ④]** Fourth: limits. If both routes enforce the same customer limit, they need one authoritative decision or a proven equivalent. The policy and limit period belong to the bank's domain owners.

**[tag ⑤]** Finally, rollback must not abandon payments in flight. The proposed rule sends **new** payments back to legacy while existing work remains with its original owner until resolved. We need tests for crashes, delayed messages and unknown outcomes before relying on that rule.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Ramp Up, Roll Back

**[tag ①]** How might a bank move the dial? The slide proposes a staff cohort for two weeks. That is a planning example, not a claim that staff are always the right pilot group. Product, risk and operations would approve the cohort.

**[tag ②]** The diagram proposes one, five, twenty-five, fifty and one hundred percent as possible steps. Each step needs a bank-approved gate and enough observation time to support the next move.

**[tag ③]** Imagine p99 crossing a half-second threshold at twenty-five percent. The alarm should reduce exposure to the last proven level. A one-minute rollback is a **target to test**, not a measured result. The team investigates before trying again.

**[tag ④]** The ten-week path on the diagram is illustrative. Reaching one hundred percent needs evidence at every gate; the calendar follows the evidence, not the other way around.

**[tag ⑤]** What should "green" mean? Compare old and new routes at the same time: errors, p99, duplicates, straight-through processing, and complaints. The bank sets the acceptance window and any domain-specific guardrails before a step-up.

**[tag ⑥]** There are two proposed ways back: an automatic alarm and an authorised manual kill switch. Small steps limit exposure. I would require a timed rollback drill before relying on either path.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · Proof Plan and Next

**[tag ①]** This is the **engineering evidence** I would ask for. k6 sends synthetic payment traffic through the reference stack from episode ten.

**[tag ②]** They go through the router, built with Spring Cloud Gateway. Behind it are the mainframe simulator in WireMock, and the new initiation service from episode eleven.

**[tag ③]** Unleash stands in for AppConfig in the isolated test environment. We can vary the cohort and record the routing result.

**[tag ④]** Grafana can show the route split, errors, p99 and duplicate signals. A controlled fault test then checks whether rollback actually happens within the agreed target.

**[tag ⑤]** Before a real pilot, I would require evidence for each rule, stable retry routing, the latency target, flag-outage behaviour, a rollback drill, and removal of the internal header. Bank owners would add payment-specific acceptance tests.

**[tag ⑥]** Terraform can make the AWS control path repeatable: AppConfig profile, rollout policy, CloudWatch alarm, and API Gateway in front of the router on EKS. The pipeline and fault tests provide proof, not the diagram alone.

**[tag ⑦]** This router is a reference execution pattern. Episode fourteen examines the legacy boundary: a mainframe bridge, change data capture, and an anti-corruption layer. The bank's actual estate determines the final design.
<!-- /slide -->

---

## Presenter notes

- Keep the English clear and conversational; pause at each diagram tag.
- Read figures as examples or targets unless measured evidence is available.
- Ask bank domain owners to confirm payment meaning, policy and acceptance before implementation.
