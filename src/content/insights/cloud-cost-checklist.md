---
title: "A 15-point cloud cost checklist"
summary: Fifteen checks for AWS, Azure and Google Cloud estates that find wasted spend quickly, from idle resources and oversized compute to missing budgets and untagged assets.
seoDescription: "Fifteen checks for AWS, Azure and Google Cloud estates that find wasted spend quickly: idle resources, oversized compute, missing budgets, untagged assets."
date: 2026-10-15
updated: 2026-10-15
draft: false
relatedService: cloud-cost-optimization
sources:
  - label: "Flexera: The new era of cloud, what 2026 data tells us about spend, scale and strategy"
    url: https://www.flexera.com/blog/finops/the-new-era-of-cloud-what-2026-data-tells-us-about-spend-scale-and-strategy/
  - label: "AWS: Using cost allocation tags"
    url: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html
  - label: "Microsoft Learn: Group and allocate costs using tag inheritance"
    url: https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/enable-tag-inheritance
  - label: "Google Cloud: Create and manage labels"
    url: https://docs.cloud.google.com/resource-manager/docs/creating-managing-labels
  - label: "AWS: Analyzing your costs with AWS Cost Explorer"
    url: https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html
  - label: "Microsoft Learn: Quickstart, start using Cost analysis"
    url: https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/quick-acm-cost-analysis
  - label: "Google Cloud: View your Cloud Billing reports and cost trends"
    url: https://docs.cloud.google.com/billing/docs/how-to/reports
  - label: "AWS: Managing your costs with AWS Budgets"
    url: https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html
  - label: "Microsoft Learn: Create and manage budgets"
    url: https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets
  - label: "Google Cloud: Create, edit or delete budgets and budget alerts"
    url: https://docs.cloud.google.com/billing/docs/how-to/budgets
  - label: "AWS News Blog: New AWS public IPv4 address charge"
    url: https://aws.amazon.com/blogs/aws/new-aws-public-ipv4-address-charge-public-ip-insights/
  - label: "Microsoft Azure: IP addresses pricing (FAQ)"
    url: https://azure.microsoft.com/en-us/pricing/details/ip-addresses/
  - label: "Google Cloud: Reserve a static external IP address"
    url: https://docs.cloud.google.com/vpc/docs/reserve-static-external-ip-address
  - label: "AWS Compute Optimizer"
    url: https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html
  - label: "Microsoft Learn: Azure Advisor cost recommendations"
    url: https://learn.microsoft.com/en-us/azure/advisor/advisor-cost-recommendations
  - label: "Google Cloud: Apply machine type recommendations for VMs"
    url: https://docs.cloud.google.com/compute/docs/instances/apply-machine-type-recommendations-for-instances
  - label: "AWS: What are Savings Plans?"
    url: https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html
  - label: "Microsoft Learn: What are Azure Reservations?"
    url: https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations
  - label: "Microsoft Learn: What is Azure savings plans for compute?"
    url: https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-compute-overview
  - label: "Google Cloud: Committed use discounts"
    url: https://docs.cloud.google.com/docs/cuds
  - label: "AWS: Amazon EC2 Spot Instances"
    url: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html
  - label: "Microsoft Learn: Azure Spot Virtual Machines"
    url: https://learn.microsoft.com/en-us/azure/virtual-machines/spot-vms
  - label: "Google Cloud: Spot VMs"
    url: https://docs.cloud.google.com/compute/docs/instances/spot
  - label: "AWS: Managing the lifecycle of objects (Amazon S3)"
    url: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html
  - label: "Microsoft Learn: Azure Blob Storage lifecycle management"
    url: https://learn.microsoft.com/en-us/azure/storage/blobs/lifecycle-management-overview
  - label: "Google Cloud: Object Lifecycle Management"
    url: https://docs.cloud.google.com/storage/docs/lifecycle
---

Cloud waste is common, and it is growing again. Flexera's 2026 State of the Cloud research reports that, after five
years of decline, [wasted cloud spend on IaaS and PaaS increased to 29%](https://www.flexera.com/blog/finops/the-new-era-of-cloud-what-2026-data-tells-us-about-spend-scale-and-strategy/).
The usual suspects are not exotic: resources nobody owns, capacity sized for a peak that never comes,
and environments that run when nobody is using them.

The fifteen checks below find that waste on AWS, Azure and Google Cloud alike. Work through them in order: visibility
first, because you cannot cut what you cannot attribute.

<aside class="key-takeaways" aria-labelledby="key-takeaways">
<p id="key-takeaways"><strong>Key takeaways</strong></p>

- Tag and label everything first; untagged spend has no owner and no one to fix it.
- Remove idle and orphaned resources before you resize anything else.
- Right-size from measured utilisation, then commit only to the steady baseline.
- Make cost a monthly routine with budgets and alerts, not a one-off clean-up.

</aside>

## Visibility

1. **Tag everything.** Every resource should carry environment, owner, application and cost-centre tags (labels on
   Google Cloud). On AWS, activate the tags as cost allocation tags so they appear in billing; on Azure, tag
   inheritance can apply subscription and resource group tags to usage records; on Google Cloud, labels flow into the
   billing export. Enforce the tags with policy in your
   [landing zone](/services/infrastructure-as-code-landing-zones), so untagged resources cannot be created.
2. **Break spend down by environment.** If Dev and QA cost almost as much as production, they are probably oversized
   or running when nobody uses them. Separate accounts, subscriptions or projects per environment make this view
   trivial.
3. **Set budgets and alerts.** Use AWS Budgets, Azure Cost Management budgets or Google Cloud budgets for each account,
   subscription or project and for each major application. Send alerts to the people who own the spend, not to a
   shared mailbox nobody reads, and alert on forecast as well as actual cost.

## Idle and orphaned resources

4. **Unattached disks and volumes.** Disks left behind after a VM or instance was deleted keep charging. Search for
   volumes in an unattached state, snapshot them if in doubt, then delete them.
5. **Unused public IP addresses.** All three providers bill for public IPv4 addresses that are not attached to
   anything: AWS charges for every public IPv4 address, attached or idle; Azure charges for a static public IP
   whatever it is associated with; Google Cloud charges a higher rate for a reserved static address that is not in use.
6. **Old snapshots and backups.** Keep what your retention policy requires and delete the rest automatically. Snapshot
   policies without an expiry rule grow forever.
7. **Forgotten environments.** Temporary test or demo environments often outlive their purpose. Give them an expiry
   tag when they are created and review anything past its date.

## Right-sizing

8. **Check compute utilisation.** VMs, instances and App Service plans running at low average CPU and memory are
   candidates for a smaller size. AWS Compute Optimizer, Azure Advisor and Google Cloud's machine type recommendations
   all suggest sizes from observed usage; treat them as a shortlist to verify, not as instructions.
9. **Review database tiers.** Managed databases are often provisioned for a peak load that never arrives. Look at real
   CPU, memory, storage and connection usage before the next change window, and plan the change with a tested
   rollback.
10. **Use autoscaling.** Scale out for demand and back in afterwards, instead of sizing for the busiest moment all the
    time. Check that scale-in actually happens; a minimum instance count set during an incident and never reverted is
    a common source of waste.

## Scheduling

11. **Stop non-production outside working periods.** Dev and QA environments rarely need to run overnight or at
    weekends. Automated start and stop schedules are one of the quickest savings available, and they need no change
    to the application. Agree the schedule with the people who use the environments, and give them a simple way to
    start one on demand.

## Commitments

12. **Reservations and savings plans.** For steady, predictable workloads, AWS Savings Plans, Azure Reservations and
    Azure savings plans for compute, or Google Cloud committed use discounts reduce the cost of capacity you would run
    anyway. Commit only to the baseline you are confident about after right-sizing, not to today's oversized estate.
13. **Spot capacity for interruptible work.** Batch jobs, build agents and test workloads can often run on AWS Spot
    Instances, Azure Spot Virtual Machines or Google Cloud Spot VMs at a lower price. The provider can reclaim that
    capacity at short notice, so use it only for work that can stop and restart safely.

## Architecture

14. **Storage tiers and lifecycle rules.** Move infrequently accessed data to cooler tiers automatically, and expire
    data you no longer need, with Amazon S3 lifecycle rules, Azure Blob Storage lifecycle management or Google Cloud
    Storage Object Lifecycle Management. Check retrieval and early-deletion charges on the colder tiers before you move
    data that is read often.
15. **Data transfer.** Cross-region and internet egress charges add up. Keep chatty services in the same region, use
    private connectivity between services where it fits, and put caching or a CDN in front of content that is served
    repeatedly.

## Running the checklist

A first pass does not need special tooling. In practice:

1. **Export the last three months of cost data** from AWS Cost Explorer, Azure Cost Management or the Google Cloud
   billing reports, grouped by service and by tag.
2. **Sort by cost, not by count.** Start with the ten most expensive services or resources; a long tail of small items
   can wait.
3. **Give every finding an owner and a decision:** delete, resize, schedule, commit or keep with a reason.
4. **Change one thing at a time** in production, and compare the next month's figures against the baseline you
   exported.

## Common mistakes

- **Buying commitments before right-sizing.** You lock in the waste for the length of the term.
- **Deleting without an owner check.** An "idle" resource can be a disaster recovery standby. Tags and an owner
  conversation come before deletion.
- **One-off clean-ups.** Waste returns if nobody owns the numbers.
- **Alerts to nobody.** A budget alert that goes to a shared inbox is not a control.

## Make it continuous

A one-off clean-up helps, but waste returns without ownership. Review spend every month by environment and by
application, track the actions you take and their effect, and keep budgets, tags and schedules current as the
platform changes. Our [Cloud Cost Optimisation](/services/cloud-cost-optimization) service runs this review as a
structured engagement, and [Managed Cloud & DevOps](/services/managed-cloud-devops) keeps it going as part of the
monthly service report.
