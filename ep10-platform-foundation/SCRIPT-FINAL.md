# EP 10 · Platform Foundation: Final Script

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
| 1 · Build the Road Once | 208 | 01:45 | 00:00 – 01:45 |
| 2 · The Landing Zone | 220 | 01:50 | 01:45 – 03:35 |
| 3 · Private by Default | 182 | 01:35 | 03:35 – 05:10 |
| 4 · The Payment Runtime | 217 | 01:50 | 05:10 – 07:00 |
| 5 · Everything as Code | 191 | 01:40 | 07:00 – 08:40 |
| 6 · Reference Test Stack | 185 | 01:35 | 08:40 – 10:15 |
| 7 · The Golden Path for Squads | 216 | 01:50 | 10:15 – 12:05 |
| **Total** | **1419** | **12:05** | at 125 words per minute, plus 6 s per slide for drawing |

---

<!-- slide:1 -->
## Slide 1 · Build the Road Once

**[tag ①]** The payment sandbox now enters the build stage. I start with a shared **platform** before scaling feature teams. This pattern applies to many large enterprise systems: separate pipelines and security setups create repeated work and make controls harder to review. The diagram contrasts that fragmentation with a common delivery path. Bank teams would confirm their own rules and targets.

**[tag ②]** A platform team can provide one **paved road**: network patterns, security controls, pipelines, runtime, and monitoring. Squads can then focus on their services, while the bank reviews one repeatable set of controls.

**[tag ③]** The choices here come from **example** NFRs: three zones, two regions, and a five-thousand-payments-per-second design target. Encryption, least privilege, auditability, EKS, MSK, and Aurora are candidate responses. Load, recovery, and security tests must show whether they meet a real bank's requirements.

**[tag ④]** In this operating model, a platform team builds and runs the shared road. Delivery squads are its **customers**, with feedback and service levels.

**[tag ⑤]** The road has five building blocks: landing zone, network, runtime, pipelines, and a local engineering stack. I would validate each block against security, resilience and delivery requirements before a team relies on it.

**[validation plan]** Terraform plans and a local Docker Compose stack would be the technical evidence to review, alongside security and failure tests.
<!-- /slide -->

---

<!-- slide:2 -->
## Slide 2 · The Landing Zone

**[tag ①]** The first proposed building block is an AWS **landing zone**. AWS Organizations and Control Tower provide account governance. Account separation can limit blast radius, but permissions and shared services still need review; an account boundary is not a guarantee that one mistake cannot affect another.

**[tag ②]** The diagram separates log storage from security tooling such as GuardDuty and Security Hub. The goal is to make logs harder to alter and give the security team independent visibility. I would test retention and access against the bank's policy.

**[tag ③]** Infrastructure accounts hold a network hub and shared services, such as build runners and a container registry. Their permissions need the same scrutiny as production workloads.

**[tag ④]** The reference design uses **separate** development, test, and production accounts, with stronger production controls. Sandboxes can have budget alarms and expiry policies. The bank decides retention and exception rules.

**[tag ⑤]** Organisation guardrails can restrict regions, protect logging, require encryption, and enforce owner, cost, and data tags. The EU-only policy shown is an assumption for this example; the bank sets its real residency rules. I would verify the guardrails with policy tests and exception reviews.

**[tag ⑥]** Access would use the bank's identity system, short-lived credentials, and task-based production approval. A break-glass path needs monitoring, an alert, and regular drills. These are controls to implement and test, not just boxes on a diagram.
<!-- /slide -->

---

<!-- slide:3 -->
## Slide 3 · Private by Default

**[tag ①]** Now the proposed network between a legacy data centre and AWS. Direct Connect gives a **private** path. Two locations and a VPN backup reduce single points of failure, but failover time and routing behavior must be tested with the bank's network team.

**[tag ②]** A Transit Gateway hub can connect the network segments and centralise route policy. The bank's network and security teams decide where segmentation and inspection boundaries belong.

**[tag ③]** The diagram routes selected traffic through an inspection network and controlled egress. I would verify actual traffic paths; a drawn firewall does not mean every packet crosses it.

**[tag ④]** The candidate workload spans three availability zones with **private** application and data subnets. Public exposure is limited to approved edges, subject to a security review.

**[tag ⑤]** VPC endpoints can keep calls to services such as S3, KMS, and Secrets Manager on private AWS paths. I would inspect DNS and routing to verify the path used in practice.

**[tag ⑥]** A second region is a recovery option. Connectivity, replication, and failover need separate tests against the bank's recovery objectives; copying data does not by itself provide a working recovery service.
<!-- /slide -->

---

<!-- slide:4 -->
## Slide 4 · The Payment Runtime

**[tag ①]** This is the candidate runtime. Amazon EKS could run initiation, orchestration, screening, scheme, and ledger adapters across three zones. Karpenter can add capacity, but scale-up speed and limits must be measured under the expected load.

**[tag ②]** Events go to Amazon MSK, managed Kafka. The diagram shows three brokers across three zones with a target replication factor of **three**. Durability still depends on producer settings, acknowledgement, retention, and failure testing.

**[tag ③]** The proposed services own separate Aurora PostgreSQL stores. I would verify backup, replication, and failover behavior rather than infer it from the number of zones.

**[tag ④]** KMS and Secrets Manager are candidate controls for keys and secrets, with rotation designed and tested. API Gateway and a web application firewall are the proposed public **edge**. The bank's security team validates other entry points and trust boundaries.

**[tag ⑤]** OpenTelemetry would connect traces, metrics, and logs across services. Correlation IDs help follow a payment through the platform, subject to masking and retention rules. I would test that traces survive retries and partial failures.

**[tag ⑥]** Each building block should trace to an **NFR**. Three zones and Karpenter do not prove five thousand payments per second; only a representative load test can. Aurora replication does not prove recovery time, and Kafka replication does not guarantee no lost events. These are hypotheses to test with production-like failure cases.
<!-- /slide -->

---

<!-- slide:5 -->
## Slide 5 · Everything as Code

**[tag ①]** I would express this platform as **code** with Terraform modules for the landing zone, network, EKS, Kafka, databases, observability, and service template. Versions give squads a controlled way to adopt changes. The diagram shows the module map I would build and validate.

**[tag ②]** AI can draft modules from confirmed decisions and AGENTS.md rules. In this model, AI cannot apply production changes, disable guardrails, or insert secrets. Named engineers review every suggestion.

**[tag ③]** The proposed pull-request pipeline runs format, validation, linting, and policy checks. Checkov can block a database resource without encryption. I would also test the policy rules so a passing pipeline has real meaning.

**[tag ④]** Terraform plan previews intended changes before apply. Engineers still review the plan for dependencies and unexpected replacements.

**[tag ⑤]** Production plans require the bank's named platform and security approvals.

**[tag ⑥]** A controlled pipeline can apply approved plans. The desired state is no routine personal admin access. Terraform state needs encryption, versioning, access control, and locking, all verified in the actual setup.

**[tag ⑦]** A scheduled plan can detect some **drift** between code and infrastructure. It needs alerts and a response owner; we should not assume every manual change will be visible by morning.
<!-- /slide -->

---

<!-- slide:6 -->
## Slide 6 · Reference Test Stack

**[tag ①]** The **local stack** makes engineering tests repeatable. I would reuse contracts, topic definitions, schemas, and database migrations where possible, with different endpoints and infrastructure. Bank integration and capacity tests remain separate gates.

**[tag ②]** Local stand-ins could include Kind, Kafka in Docker, PostgreSQL, Debezium, Unleash, and LocalStack. They make failure cases repeatable, but cannot prove AWS service behavior or production capacity.

**[tag ③]** WireMock can simulate scheme and legacy responses: accept, reject, timeout, or late reply. The bank's specialists must validate the scenarios and messages the simulator represents.

**[tag ④]** OpenTelemetry gives a common trace format locally and on AWS. Local traces could go to Grafana, cloud traces to CloudWatch and X-Ray. Correlation is something to verify in integration tests.

**[tag ⑤]** A target developer experience is one command, **make up**, to start the test stack with synthetic data and dashboards. Without a runnable artifact, I present that as a design goal, not a live demonstration.

**[tag ⑥]** Temporary AWS environments could test real service behavior on selected pull requests. Terraform would create and remove them under budget and expiry controls. Their cost and teardown reliability need measurement; the twenty-four-hour limit is an example policy.
<!-- /slide -->

---

<!-- slide:7 -->
## Slide 7 · The Golden Path for Squads

**[tag ①]** The proposed **golden path** lets a squad create a service from one reviewed template. The purpose is consistent controls and faster setup, measured in real usage.

**[tag ②]** The template would include a pipeline, Dockerfile, Helm chart, OpenTelemetry, outbox support, ArchUnit tests, and AGENTS.md rules. Each component is still versioned and maintained by an owner.

**[tag ③]** Services would use a common pipeline for tests, security scans, a software bill of materials, and policy checks, with exceptions reviewed explicitly.

**[tag ④]** A service would pass contract and golden tests before a controlled release. Canary and rollback are options where the change is reversible. **One day** from idea to production is a sandbox stretch target for suitable changes; a real release follows the bank's approval path.

**[tag ⑤]** I would measure the platform like a product: time to first deployment, infrastructure coverage in code, policy exceptions, environment cost, and squad feedback. These numbers show whether the paved road actually helps.

**[tag ⑥]** Before production use, the bank's security and risk teams review the baseline, including relevant operational-resilience requirements and cloud exit planning. The platform owner confirms runbooks and support coverage. The actual approval path varies by institution.

**[tag ⑦]** Episode eleven applies this reference road to payment initiation, then orchestration and routing. The point is my **execution approach**: turn requirements into reusable controls and tests before a high-risk release.
<!-- /slide -->

