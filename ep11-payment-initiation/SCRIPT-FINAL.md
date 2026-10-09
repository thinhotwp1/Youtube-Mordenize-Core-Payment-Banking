# EP 11 · Payment Initiation Service: Final Script

**Series:** Core Payments Modernization on AWS (reference scenario). **Speed:** about 120–130 words per minute. **Level:** clear international English.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- HTTP codes are read digit by digit: 202 = "two-oh-two", 422 = "four-two-two", 409 = "four-oh-nine".

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · The Front Door for Slice 1 | 222 | 01:55 | 00:00 – 01:55 |
| 2 · Inside the Service | 223 | 01:55 | 01:55 – 03:50 |
| 3 · Two Kinds of Duplicate | 210 | 01:45 | 03:50 – 05:35 |
| 4 · Idempotency in Code | 220 | 01:50 | 05:35 – 07:25 |
| 5 · The Outbox in Practice | 209 | 01:45 | 07:25 – 09:10 |
| 6 · AI-Assisted Build Plan | 186 | 01:35 | 09:10 – 10:45 |
| 7 · Proof Plan: Same Payment Twice | 213 | 01:50 | 10:45 – 12:35 |
| **Total** | **1483** | **12:35** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · The Front Door for Slice 1

**[tag ①]** This episode examines the **front door** of the reference first slice. The diagram routes a mobile payment request through an API gateway to an initiation service. I use this scenario to show how I turn an approved contract into code; the bank decides the actual channel and product behavior.

**[tag ②]** The proposed service aims to answer **quickly**, without waiting for fraud or scheme calls. Two-oh-two means accepted for processing, not paid or settled. The response includes a status link, with wording approved by the bank.

**[tag ③]** It saves a payment record and an outbox entry in one transaction. Debezium can publish the event to Kafka, where the orchestrator must handle possible duplicates.

**[tag ④]** The engineering responsibilities are input validation, idempotency, atomic storage, and a timely response. IBAN, amount, and currency checks follow a contract reviewed by the bank; I do not infer business eligibility from these technical checks.

**[tag ⑤]** The boundary is just as important. In this design, fraud, limits, possible business duplicates, ledger holds, and scheme messages belong to separate owners. Those boundaries are proposals to review with the bank; the initiation domain code does not publish directly to Kafka.

**[tag ⑥]** I trace each behavior to a confirmed story, contract, edge case, latency target, or AI rule. That trace is the value I bring as an execution architect: make a small boundary explicit, testable, and reviewable.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · Inside the Service

**[tag ①]** The reference service uses **ports and adapters**. A use case sits in the middle and infrastructure stays at the edges. This is a pattern I can carry from other high-volume enterprise systems; payment rules still come from the bank.

**[tag ②]** On the left, a REST controller reads the request and Idempotency-Key. Validation can check format, IBAN digits, amount, currency, and decimal scale. The exact allowed values and error response need a bank-approved contract.

**[tag ③]** The centre has a **domain model** for Payment, Money, IBAN, and status. BigDecimal with currency avoids binary rounding. Keeping Spring, SQL, and Kafka outside makes the model easier to test. It does not give me authority to define the bank's business states.

**[tag ④]** On the right, a repository writes to PostgreSQL and an outbox writer records the event in the same transaction. Aurora is the candidate managed database in this architecture.

**[tag ⑤]** The domain has **no** Kafka client. A separate connector can publish outbox events; we will examine its failure modes on slide five.

**[tag ⑥]** Java twenty-one provides virtual threads and records. Virtual threads may improve handling of blocking calls, but I would benchmark database contention and downstream limits before making capacity claims.

**[tag ⑦]** ArchUnit tests can enforce the dependency boundary, while AGENTS.md guides AI drafts. The CI build should fail on a broken rule; code review still checks whether the rule itself is right.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · Two Kinds of Duplicate

**[tag ①]** The diagram separates two cases that look alike but need different decisions. On the left is a **technical** retry: a request with key K1 was accepted, the reply was lost, and the app sends the same request again.

**[tag ②]** The service looks up the key and replays the stored result. A database uniqueness rule and concurrency test are needed so parallel retries do not create two instructions.

**[tag ③]** The expected result is one stored instruction. That does not alone prove one ledger debit or one Kafka delivery; downstream systems need their own idempotency and reconciliation controls.

**[tag ④]** On the right is a possible **business** duplicate: two different keys, same payee and amount, two minutes apart. The initiation service can identify the pattern but must not decide whether the customer intended two payments.

**[tag ⑤]** BR-031 and the confirmation flow are **example rules**. The bank's product, fraud, and scheme specialists decide whether to warn, hold, reject, or allow the second instruction. I implement and test the approved choice.

**[tag ⑥]** At the bottom is the proposed HTTP contract: a new key gets two-oh-two, an exact retry replays, changed content gets four-two-two, a concurrent in-progress request gets four-oh-nine, and a missing key gets four hundred. The API team must check these choices against the current specification and its consumers.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · Idempotency in Code

**[tag ①]** Here is the core algorithm as **illustrative code**. First, look up the customer and key. If there is a completed result, replay it. The code shown is a design sketch, not a claim about deployed bank software.

**[tag ②]** Compare a **hash** of the approved request fields. A changed amount with the same key must be rejected under the proposed contract. We need tests for canonicalisation, not only one happy-path hash.

**[tag ③]** For a new key, create the payment record and outbox entry in **one** transaction. Kafka publishing happens later, so consumers still need duplicate handling.

**[tag ④]** The table has a unique rule on customer ID plus idempotency key. That gives the database a clear boundary for one technical request; customer identity and key retention still need a bank-approved policy.

**[tag ⑤]** Two parallel requests can both see no row. The unique constraint lets only **one** insert win; the other must safely read the committed result. I have handled similar contention in large enterprise systems. Pessimistic locking is another option for a shared resource, but I would benchmark lock waits and deadlocks before choosing it here.

**[tag ⑥]** The technical safety case combines per-customer keys, request comparison, a database constraint, and a tested replay path. Retention length and any balance invariant belong to the bank's owners. The proof is a concurrency test plus reconciliation, not the diagram alone.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · The Outbox in Practice

**[tag ①]** The outbox pattern begins with one transaction for the payment row and the outbox row. That closes the gap between saving a request and recording an event to publish.

**[tag ②]** Debezium reads the database write-ahead log rather than polling the application table. It still creates replication and storage load; I would measure that under representative traffic.

**[tag ③]** The Outbox Event Router maps each outbox change to a Kafka message on the proposed payment-events topic.

**[tag ④]** The payment ID is the message key. Kafka sends the same key to a partition and preserves partition **order**. We must also test producer ordering, retries, and reprocessing.

**[tag ⑤]** This sample message has a payment key, event ID, amount, currency, and status. The diagram also shows IBANs. A real bank's data owner must decide whether those identifiers should be published, masked, or replaced with references.

**[tag ⑥]** If Debezium stops, a retained log may allow recovery, but only until storage and retention limits are reached. I would alert on replication-slot lag, test restart and duplicate delivery, and set an approved outbox cleanup policy. A restart may publish twice; consumers must be idempotent.

**[tag ⑦]** MSK Connect and Aurora logical replication are candidate deployment choices. Configuration is only a small part of the work; operational proof includes lag, storage, replay, and failover tests.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · AI-Assisted Build Plan

**[tag ①]** How would I structure AI-assisted delivery? Start with a bank-approved story such as US-101, the reviewed API contract, and architecture rules in AGENTS.md. Without approved inputs, AI can make the wrong behavior look polished.

**[tag ②]** An AI assistant can draft Java code and tests from those inputs. The draft is a starting point for engineering review.

**[tag ③]** The developer **owns** the result, including concurrency and failure behavior.

**[tag ④]** Small pull requests should cite the story and contract version they implement.

**[tag ⑤]** My proposed CI gate includes unit and contract tests, ArchUnit, Testcontainers with PostgreSQL, Kafka and Debezium, idempotency and latency tests, security scanning, and a software bill of materials. These are checks to implement and run; this script does not claim they have passed.

**[tag ⑥]** Useful test cases include an exact retry, fifty parallel requests with one key, changed content under one key, and an invalid decimal scale. The contention test should report lock waits, deadlocks, and duplicate outcomes.

**[tag ⑦]** People decide whether the tests cover the bank's approved rule and whether the engineering evidence is enough. Only named reviewers can approve and merge. AI can write fast; accountability stays with people.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · Proof Plan: Same Payment Twice

**[tag ①]** Here is the **proof plan** for this design. A reproducible test stack would need Kafka, PostgreSQL, Debezium, Kafka UI, and the service. Until the repository contains a runnable setup, I treat this as the test to build, not a live result.

**[tag ②]** First, send a new instruction and check for the proposed two-oh-two response and status link.

**[tag ③]** Then repeat it with the same key. The expected response is the stored answer and an Idempotent-Replayed marker set to **true**.

**[tag ④]** Check that the database has **one** instruction for the key. Kafka may deliver a record more than once, so inspect event IDs and the consumer's deduplication result rather than claim exactly one message.

**[tag ⑤]** Run fifty parallel retries and verify one stored instruction, a consistent replay response, and no duplicate downstream effect. Record latency, lock waits, and failed attempts.

**[tag ⑥]** Stop and restart Debezium while creating one hundred **synthetic** instructions, then count outbox rows against consumed event IDs. The sixty-two-millisecond p99 shown is an illustrative figure, not a measured benchmark. We would publish the actual test setup and result before making a performance claim.

**[tag ⑦]** The front door would pass the Definition of Done only after these tests, security review, and bank acceptance. Episode twelve shows how an orchestrator could consume PaymentInitiated. The evidence, not the drawing, decides readiness.
<!-- /slide -->

