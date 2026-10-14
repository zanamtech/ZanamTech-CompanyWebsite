---
title: "Sample: Monthly service report"
summary: A sample of the monthly service report Managed Cloud & DevOps clients receive, covering platform health, changes, incidents, backups, cost and risks.
date: 2026-10-12
draft: false
sample: true
---

> **SAMPLE.** Illustrative layout only. Every value below is a placeholder, not real client data.

## Monthly service report

**Client:** Example Company · **Platform:** Production and non-production environments on Azure · **Period:** one calendar month

### 1. Summary

A short narrative: overall platform health this month, the most important changes, anything that needs a decision,
and the priorities for next month.

### 2. Platform health

| Area | Status | Notes |
| --- | --- | --- |
| Availability | Healthy / Watch / Action | Summary of any service degradation and its cause |
| Performance | Healthy / Watch / Action | Response trends and notable changes |
| Security | Healthy / Watch / Action | Patching status, WAF activity, findings |
| Backups | Healthy / Watch / Action | Backup success and restore-test result |

### 3. Changes delivered

| Change | Environment | Reference | Outcome |
| --- | --- | --- | --- |
| Example: pipeline approval gate added for production | Prod | Change ticket | Completed |
| Example: App Service plan right-sized in QA | QA | Change ticket | Completed |

### 4. Incidents

| Severity | Summary | Impact | Root cause | Follow-up |
| --- | --- | --- | --- | --- |
| P2 (example) | Degraded API performance | Slower responses for some users | Database index missing | Index added; monitoring alert tuned |

### 5. Backup and recovery

- Backup jobs: summary of successes and any failures, with remediation.
- Restore test: which system was restored, into which environment, and whether it met the agreed recovery objectives.

### 6. Cost

| Item | This month | Trend | Comment |
| --- | --- | --- | --- |
| Total cloud spend | Placeholder | Up / Down / Flat | Main drivers |
| Savings actions taken | Placeholder |   | What was changed |
| Opportunities | |   | Recommended next steps |

### 7. Governance

- Access review: changes made to repository and cloud access.
- SOP updates: procedures added or revised.
- Policy compliance: tagging, region and security baseline status.

### 8. Risks and recommendations

| Risk | Likelihood | Impact | Recommendation |
| --- | --- | --- | --- |
| Example: single database region | Medium | High | Agree recovery objectives and evaluate a standby option |

### 9. Next month

The planned improvements and changes, in priority order.
