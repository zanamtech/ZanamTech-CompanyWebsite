---
title: "A 15-point cloud cost checklist"
summary: Fifteen checks for Azure and AWS estates that find wasted spend quickly, from idle resources and oversized compute to missing budgets and untagged assets.
date: 2026-10-12
draft: true
sources:
  - label: "IT Brief: Flexera 2026 State of the Cloud report"
    url: https://itbrief.co.uk/story/ai-drives-wasted-cloud-spend-higher-despite-finops-gains
---

> **DRAFT: owner fact-check required.** Not published. Confirm the cited statistic against the source before setting
> `draft: false`.

Cloud waste is common. In Flexera's 2026 State of the Cloud research, respondents estimated that
[29% of their IaaS and PaaS spend is wasted](https://itbrief.co.uk/story/ai-drives-wasted-cloud-spend-higher-despite-finops-gains).
Most of that waste comes from a handful of predictable causes. Work through these fifteen checks on your Azure or
AWS estate.

## Visibility

1. **Tag everything.** Every resource should carry environment, owner, application and cost-centre tags. Untagged
   resources are the first place waste hides.
2. **Break spend down by environment.** If Dev and QA cost almost as much as production, they are probably oversized
   or running when nobody uses them.
3. **Set budgets and alerts.** Use Azure Cost Management budgets or AWS Budgets for each subscription, account and
   major application, with alerts going to the people who own the spend.

## Idle and orphaned resources

4. **Unattached disks and volumes.** Disks left behind after a VM or instance was deleted keep charging.
5. **Unused public IP addresses.** Reserved addresses that are not attached to anything still cost money.
6. **Old snapshots and backups.** Keep what your retention policy requires and delete the rest automatically.
7. **Forgotten environments.** Temporary test or demo environments often outlive their purpose. Give them an expiry
   tag and review them regularly.

## Right-sizing

8. **Check compute utilisation.** VMs, instances and App Service plans running at low average CPU and memory are
   candidates for a smaller size.
9. **Review database tiers.** Managed databases are often provisioned for peak load that never arrives. Look at real
   usage before the next renewal.
10. **Use autoscaling.** Scale out for demand and back in afterwards, instead of sizing for the busiest moment all
    the time.

## Scheduling

11. **Stop non-production outside working periods.** Dev and QA environments rarely need to run overnight or at
    weekends. Automated start and stop schedules are one of the quickest savings available.

## Commitments

12. **Reservations and savings plans.** For steady, predictable workloads, Azure Reservations, Azure savings plans or
    AWS Savings Plans reduce the cost of capacity you would run anyway.
13. **Spot capacity for interruptible work.** Batch jobs, build agents and test workloads can often run on spot
    capacity at a much lower price.

## Architecture

14. **Storage tiers and lifecycle rules.** Move infrequently accessed data to cooler tiers automatically, and expire
    data you no longer need.
15. **Data transfer.** Cross-region and internet egress charges add up. Keep chatty services in the same region and
    use caching or a CDN where it makes sense.

## Make it continuous

A one-off clean-up helps, but waste returns without ownership. Review spend monthly, track the actions you take and
keep budgets and alerts current as the platform changes.
