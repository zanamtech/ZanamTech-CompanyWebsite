/** Home page FAQ (spec 002 User Story 1). Process wording only: no team structure, time figures or prices. */
export interface FaqItem {
  q: string;
  a: string;
}

export const homeFaq: FaqItem[] = [
  {
    q: 'How does an engagement start?',
    a: 'With a strategy consultation. If there is a fit, you receive a written proposal and a Statement of Work that fixes scope, deliverables, milestones and acceptance criteria. Many clients begin with a fixed-scope entry offer such as the Cloud & DevOps Health Check.',
  },
  {
    q: 'What contracts do you work under?',
    a: 'Every engagement runs on a written Statement of Work under a master services agreement. A mutual NDA is available before discovery, and a data processing agreement is available on request.',
  },
  {
    q: 'Who owns the work you deliver?',
    a: 'You do. Infrastructure code, pipelines, runbooks and documentation are delivered into your own accounts and repositories, with a full handover and no lock-in.',
  },
  {
    q: 'Do you work in our cloud accounts?',
    a: 'Yes. We work in your accounts and repositories with least-privilege access and MFA, starting read-only wherever possible. Access is reviewed and removed at the end of an engagement.',
  },
  {
    q: 'Can our data stay in a specific region?',
    a: 'Yes. Environments can be designed for the AWS, Azure or Google Cloud regions you choose, including UAE and Saudi Arabia regions where your chosen provider offers them, to support your data-residency requirements.',
  },
  {
    q: 'How do you use AI tools in delivery?',
    a: 'Only under business terms that exclude training on customer data. No client secrets, credentials or personal data are entered into AI tools, every AI-assisted change is reviewed before it reaches your environment, and you can opt out in your SOW.',
  },
];
