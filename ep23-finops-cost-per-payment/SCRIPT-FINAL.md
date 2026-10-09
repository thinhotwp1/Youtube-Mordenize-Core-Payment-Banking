# EP 23 · FinOps: Cost per Payment — Final Script

**Series:** Core Payments Modernization — execution architecture (Stage 6: Operate). **Delivery:** clear English for global technology leaders. Payments is the sandbox for an enterprise FinOps method. Chart values are illustrative; Finance, Procurement and engineering validate the live contracts and baseline.

**How to read it**
- **Bold** = stress this word.
- A full stop = a short pause.
- A new **[tag]** = a longer pause. Draw your arrow with the pen here.
- Money is written in words, so it is easy to read aloud.

## Time plan

<!-- TIMETABLE -->
| Slide | Words | Length | Timestamp |
|---|---|---|---|
| 1 · Two Bills, One Question | 188 | 01:35 | 00:00 – 01:35 |
| 2 · Cost per Payment | 217 | 01:50 | 01:35 – 03:25 |
| 3 · Make Cost Visible | 143 | 01:15 | 03:25 – 04:40 |
| 4 · Where the Money Goes | 167 | 01:25 | 04:40 – 06:05 |
| 5 · Test the Mainframe Savings | 189 | 01:35 | 06:05 – 07:40 |
| 6 · Budgets, Anomalies, Cost in CI | 184 | 01:35 | 07:40 – 09:15 |
| 7 · From Numbers to Decisions | 140 | 01:15 | 09:15 – 10:30 |
| **Total** | **1228** | **10:30** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · Two Bills, One Question

**[tag ①]** Earlier, we treated lower cost as a possible outcome. It must be **measured**, not promised. This payments sandbox compares two cost models. Mainframe pricing may involve capacity, software and contract terms; the actual bill and renewal rules are specific to the organisation.

**[tag ②]** AWS has usage-based charges, commitments and discounts. A technical change can move the cloud bill, but the net effect depends on pricing, utilisation and the bank's agreements.

**[tag ③]** The execution habit is **FinOps**: Finance, engineering and product use one cost model. Inform: make costs visible. Optimise: test changes that may reduce waste. Operate: set budgets, review results and repeat. The cadence is a governance choice.

**[tag ④]** A board may ask: "Is the migration creating value?" The answer needs an agreed baseline, actual bills, volume and service outcomes. A lower unit cost is useful only if risk and service quality remain acceptable.

**[tag ⑤]** Finance owns accounting and forecasts; engineering owns usage and design choices; product weighs cost against customer value. A FinOps lead can connect those views. The bank sets formal ownership.

**[validation plan]** Synthetic cost data can test the allocation model before it is connected to approved billing and contract data.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · Cost per Payment

**[tag ①]** One useful executive measure is **cost per payment**. It is not the whole business case, but it can show whether cost moves with volume. First define the slice, the period and which payments count.

**[tag ②]** Make it **fully loaded**: direct cloud cost, shared platform, retained mainframe work and operations. Finance must approve how shared and committed costs are allocated. Otherwise a low unit cost can hide stranded spend.

**[tag ③]** Divide the agreed monthly cost by the agreed payment count. Reconcile volume from the authoritative business record; Kafka counts alone may include retries, failures or duplicate events.

**[tag ④]** The chart's four-and-a-half-cent pilot cost is **illustrative**. Low volume can make fixed platform cost look high per payment, but a real pilot needs actual spend and workload data.

**[tag ⑤]** The grey line illustrates **stranded cost**: if fixed mainframe charges remain while volume falls, unit cost may rise. Whether those charges can be removed depends on contracts, shared workloads and decommissioning, not traffic routing alone.

**[tag ⑥]** More volume may spread cloud fixed cost, but variable charges, peak capacity and resilience requirements may offset that effect. I would measure the curve rather than assume it always falls.

**[tag ⑦]** The one-cent target by year two is a **scenario target**, not a forecast. Finance and Procurement would test it against contracts, volume ranges and service-level requirements before leaders use it.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · Make Cost Visible

**[tag ①]** Cost needs clear ownership. I would tag cloud resources by slice, service, team, environment and cost centre, with Terraform applying the agreed scheme.

**[tag ②]** A "no tag, no deploy" policy is one option. The bank would decide exceptions for shared and emergency resources, and test whether the policy blocks the right cases.

**[tag ③]** Shared Kubernetes and Kafka costs need an **allocation rule**. Topic data volume is one possible Kafka driver, but it may not reflect broker replication, retention or peak capacity. Finance and engineering must agree what is fair.

**[tag ④]** Pod CPU and memory usage can help allocate Kubernetes cost. Reservations and idle capacity also matter, so a pod-level estimate is not the whole bill.

**[tag ⑤]** A weekly showback can show each team's cost, trend and main drivers. It supports decisions; it does not by itself prove behaviour or savings changed. Any later chargeback needs Finance approval.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · Where the Money Goes

**[tag ①]** This is a **synthetic monthly cost breakdown**. Kubernetes, Kafka and databases are major categories in the illustration; a bank's actual bill may look very different.

**[tag ②]** Logs, non-production environments and data transfer deserve explicit owners. They may be necessary costs or waste; the right question is what value each cost buys.

**[tag ③]** Candidate levers include rightsizing and testing Graviton. Any price or performance gain depends on the workload, compatibility and the bank's rates. I would benchmark before estimating savings.

**[tag ④]** Savings Plans may reduce the price of stable usage in return for a commitment. Procurement should compare commitment risk, existing discounts and forecast demand before buying.

**[tag ⑤]** Non-production may use scheduled shutdown or Spot capacity where interruption is acceptable. Log levels and storage tiers must still meet investigation, audit and retention needs.

**[tag ⑥]** The goal is the lowest **defensible** cost for the agreed service level. Capacity headroom, multi-zone resilience, a second Region and evidence retention are design choices with costs. Risk and operations decide which are required; FinOps makes the trade-off visible.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · Test the Mainframe Savings

**[tag ①]** The mainframe side is **contract-specific**. Some charges depend on peak measures, others on licences or fixed commitments. This chart uses a four-hour peak as one illustration; Procurement and the mainframe team must map the real agreement.

**[tag ②]** In this synthetic profile, night batch sits below the daytime peak. Moving it might not change a peak-based charge. Under another contract, the answer could differ.

**[tag ③]** The fall from nine hundred and fifty to eight hundred and thirty-five units is a **scenario calculation**, about twelve percent. To claim a real reduction, I would measure the relevant SMF data and translate it through the contract.

**[tag ④]** I would compare mainframe capacity and billing data before and after each slice, with seasonality and other workloads accounted for.

**[tag ⑤]** A migration only creates removable cost when old programs, jobs and licences can be retired safely. Residual work may serve other domains, so decommissioning needs an estate and dependency review.

**[tag ⑥]** Savings may arrive later than technical cutover because of contract dates or minimum commitments. Finance and Procurement should model both the technical change and the cash effect. I would call a saving realised only when the bill confirms it.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Budgets, Anomalies, Cost in CI

**[tag ①]** A Terraform cost estimate can reveal a design trade-off before deployment. The nine-hundred-euro Kafka increase on the slide is **illustrative**; real estimates need the bank's prices, discounts and expected utilisation.

**[tag ②]** A higher cost may be justified by resilience or throughput. The budget owner should see and approve that trade-off under the bank's policy.

**[tag ③]** The Friday debug-logging spike is a **synthetic anomaly scenario**. Four-times cost, a six-hour alert and a same-day fix are test values, not operational results. The lesson is to connect anomaly alerts to an owner who can investigate quickly.

**[tag ④]** Squad budgets and alerts at eighty and one hundred percent are sample governance settings. Finance and engineering would set useful thresholds, including how forecasts handle seasonal peaks.

**[tag ⑤]** If unit cost stays above an agreed range, the FinOps lead and product owner investigate the driver. Two weeks is an example review window; rightsizing is one possible response, not the automatic answer.

**[tag ⑥]** AI could summarise billing and usage signals and draft a possible fix. A person checks the cause, tests the change and approves it. An explanation from AI is not proof of cost impact.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · From Numbers to Decisions

**[tag ①]** FinOps works as a **rhythm**. I would propose a weekly view of each team's main cost changes, adjusted to the organisation's decision cycle.

**[tag ②]** A monthly Finance, engineering and product review can use one agreed dataset to decide which changes are worth making.

**[tag ③]** A quarterly leadership page could show unit cost, mainframe billing driver, realised savings, forecast and unallocated spend. The plan from episode nine is a hypothesis until Finance reconciles it to actual invoices.

**[tag ④]** Contract reviews should follow actual renewal and commitment dates, not a generic annual calendar.

**[tag ⑤]** A consistent definition makes the trend comparable. Automated reporting can reduce manual errors, but Finance still checks source and allocation quality.

**[tag ⑥]** If verified savings appear, leaders may use them to fund the next slice. Chargeback is a separate governance choice. The final episode looks at keeping the platform current after any migration.
<!-- /slide -->

---

## Presenter notes

- All cost curves, unit prices, MIPS changes and savings are synthetic. Obtain billing and contract data before any commercial claim.
- Keep delivery focused on decisions and evidence, not an offline exercise.
