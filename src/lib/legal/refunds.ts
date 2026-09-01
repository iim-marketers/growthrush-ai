import type { LegalDoc } from "./types";

/** Transcribed from src/policies/Return-and-Refund-Policy.pdf — keep the two in step. */
export const refundPolicy: LegalDoc = {
  slug: "refunds",
  title: "Return and Refund Policy",
  description:
    "When refunds are and are not available on growthrush.ai subscriptions, licences, implementation services, pilots and professional services, and how to request one.",
  updated: "11 August 2026",
  effective: "11 August 2026",
  pdf: "/policies/Return-and-Refund-Policy.pdf",
  sections: [
    {
      id: "scope",
      number: "1",
      title: "Scope",
      blocks: [
        {
          t: "p",
          text: "This Return and Refund Policy applies to all subscriptions, licences, implementation services, pilot engagements and professional services purchased from **Estrellingent Technology Private Limited** (“Estrellingent”, “we”, “us”), CIN U74909WB2023PTC265098, registered office at A-60 Brahmapur South, Kolkata, West Bengal 700096, India, across both:",
        },
        {
          t: "list",
          items: [
            "**Business Intelligence Services** — financial, operational, supply chain and inventory analytics integrating with accounting systems including Tally; and",
            "**Advertising Technology Services** — campaign analytics, targeting, bid and budget optimisation, creative generation and performance reporting.",
          ],
        },
        {
          t: "p",
          text: "This Policy forms part of, and must be read together with, our [Terms and Conditions](/legal/terms). Capitalised terms have the meanings given in those Terms.",
        },
        {
          t: "p",
          text: "**1.1 Nature of the Services.** Estrellingent supplies software as a service and related professional services. **No physical goods are shipped, delivered or returned.** References to “return” mean cancellation of a subscription and cessation of access, not the return of any tangible item.",
        },
        {
          t: "p",
          text: "**1.2 Meaning of “refund”.** Except where expressly stated otherwise, a “refund” under this Policy means the return of the amount paid **less a 5% institutional transaction charge**, and less any deductions permitted under Section 12.3. Refunds of billing errors under Section 6.5 are made in full without deduction.",
        },
        {
          t: "p",
          text: "**1.3 Business customers.** The Services are supplied on a business-to-business basis. Statutory consumer cancellation and cooling-off rights applicable to consumer contracts do not apply. Where you are nonetheless entitled to such rights under mandatory applicable law, nothing in this Policy limits them.",
        },
      ],
    },
    {
      id: "no-performance-refunds",
      number: "2",
      title: "No Performance-Based Refunds",
      blocks: [
        {
          t: "callout",
          text: "**This Section governs and prevails over any other provision of this Policy.**",
        },
        {
          t: "p",
          text: "**2.1** Fees are charged for **access to and provision of the Services**. They are not contingent on, and are not refundable by reference to, any result achieved.",
        },
        {
          t: "p",
          text: "**2.2** **No refund, credit, rebate or fee adjustment arises from:**",
        },
        {
          t: "list",
          variant: "lettered",
          items: [
            "(a) failure to achieve any improvement in return on ad spend, cost per acquisition, cost per click, cost per mille, click-through rate, conversion rate, reach, revenue or any other advertising metric;",
            "(b) advertising campaigns performing below expectation, below prior periods, or below any figure discussed, modelled or illustrated at any time;",
            "(c) failure to identify or recover any input tax credit, duplicate payment, discount, rebate, price variance, dead stock value, working capital release or other amount;",
            "(d) an identified amount not being recovered, realised, allowed by any authority, or accepted by any counterparty;",
            "(e) failure to achieve any saving, margin improvement, cost reduction, cash release or return of any kind;",
            "(f) recommendations regarding stock, buffers, purchase orders, credit, pricing, bids, budgets, audiences or creative not producing a favourable commercial result;",
            "(g) the Services not identifying every error, leakage, inefficiency, risk or opportunity in your data;",
            "(h) dissatisfaction with the quality, relevance, volume or usefulness of insights, alerts, recommendations or generated creative;",
            "(i) advertising expenditure incurred, including expenditure you consider wasted, excessive or misallocated;",
            "(j) suspension, restriction, disapproval or termination of your accounts by any advertising platform.",
          ],
        },
        {
          t: "p",
          text: "**2.3** Any figure, benchmark, projection, case study, model or illustration presented before or during your subscription is **illustrative and non-binding**, does not form part of any agreement, and creates no entitlement to a refund.",
        },
        {
          t: "p",
          text: "**2.4** Refunds are available only in the circumstances expressly set out in Sections 4, 5 and 6 below, each of which concerns **our failure to deliver the Services**, not the results you obtain from them.",
        },
      ],
    },
    {
      id: "principles",
      number: "3",
      title: "Refund Principles",
      blocks: [
        {
          t: "p",
          text: "**3.1 Advance payment.** All fees are payable in advance and the Services commence only upon receipt of cleared funds. Accordingly, every refund under this Policy is a refund of fees already paid for a period of access that has been provided or made available to you. Where payment has been made but access has not yet been provisioned, the amount paid is refundable in full on written request, less the transaction charge under Section 1.2.",
        },
        { t: "p", text: "**3.2 General approach.**" },
        {
          t: "list",
          items: [
            "Refunds are considered where **we** have failed to deliver what was contracted.",
            "Refunds are not given for change of mind, internal reorganisation, budget change, strategy change, or failure to use a service that was made available.",
            "Where a refund is not available, we may consider a credit or an extension of term as an alternative, at our discretion.",
            "Every refund decision is issued in writing with reasons.",
          ],
        },
      ],
    },
    {
      id: "trials",
      number: "4",
      title: "Free Trials and Evaluations",
      blocks: [
        {
          t: "p",
          text: "**4.1** Free trials incur no charge and require no cancellation to avoid billing, unless expressly stated otherwise at signup.",
        },
        {
          t: "p",
          text: "**4.2** Where a trial converts automatically into a paid subscription, we will notify you by email at least 7 days before conversion, and you may cancel at any time before conversion without charge.",
        },
        {
          t: "p",
          text: "**4.3** No refund is due in respect of a free trial, as no consideration is paid.",
        },
        {
          t: "p",
          text: "**4.4** Advertising expenditure incurred during a free trial is payable by you to the relevant platform and is not refundable by us under any circumstances.",
        },
      ],
    },
    {
      id: "subscription-refunds",
      number: "5",
      title: "Subscription Refunds",
      blocks: [
        { t: "h", text: "5.1 Initial subscription — 14-day window" },
        {
          t: "p",
          text: "For a **first-time** subscription, you may request a full refund of subscription fees within **14 days** of the subscription start date, provided that:",
        },
        {
          t: "list",
          variant: "lettered",
          items: [
            "(a) the request is made in writing to [Hello@growthrush.ai](mailto:Hello@growthrush.ai) within the window;",
            "(b) you have not previously received a refund under this clause; and",
            "(c) the subscription is not an Enterprise or custom-priced agreement, which is governed by its own Order Form.",
          ],
        },
        {
          t: "p",
          text: "This window does not apply to renewals, upgrades, add-on modules, repeat subscriptions, or advertising expenditure.",
        },
        { t: "h", text: "5.2 Monthly subscriptions" },
        {
          t: "p",
          text: "Monthly subscriptions may be cancelled at any time, effective at the end of the current billing month. **Fees for the current month are not refunded pro-rata.** Access continues until the end of the paid period.",
        },
        { t: "h", text: "5.3 Annual and multi-year subscriptions" },
        {
          t: "p",
          text: "Annual and multi-year subscriptions are **non-refundable** once the 14-day window under Section 5.1 has passed, except where a refund is due under Section 6.",
        },
        {
          t: "p",
          text: "Where you cancel mid-term, access continues until the end of the paid term and no refund is issued. At our discretion we may offer a credit against a future subscription.",
        },
        { t: "h", text: "5.4 Spend-based and usage-based fees" },
        {
          t: "p",
          text: "Where fees are calculated as a percentage of advertising spend or on a usage basis, fees are earned as the underlying spend or usage occurs and are **not refundable** once incurred. Reconciliation of billing errors is governed by Section 6.5.",
        },
        { t: "h", text: "5.5 Renewals" },
        {
          t: "p",
          text: "Subscriptions renew automatically as set out in the Terms. We will send a renewal reminder at least **30 days** before each renewal date.",
        },
        {
          t: "p",
          text: "If a renewal charge is applied and you notify us within **7 days** of the charge that you had intended not to renew, and you have not accessed the Services during that period, we will refund the renewal charge in full.",
        },
        { t: "h", text: "5.6 Downgrades and reduction in users or accounts" },
        {
          t: "p",
          text: "Downgrades take effect from the next billing period. Fees already paid for the current period are not refunded. No refund is due for unused user licences or disconnected accounts within a paid period.",
        },
      ],
    },
    {
      id: "service-failure",
      number: "6",
      title: "Refunds for Service Failure",
      blocks: [
        {
          t: "p",
          text: "You are entitled to a **pro-rata refund** for the affected period where:",
        },
        {
          t: "p",
          text: "**6.1** The Services are unavailable for a continuous period exceeding forty-eight (48) hours, or cumulatively exceeding the availability commitment in the applicable SLA, for reasons within our control.",
        },
        {
          t: "p",
          text: "**6.2** A material feature specified in your Order Form is not delivered, or is withdrawn during a paid term without an equivalent replacement, and you terminate the affected subscription under Section 12.4 of the Terms.",
        },
        {
          t: "p",
          text: "**6.3** We fail to remedy a material breach within 30 days of written notice, and you terminate for cause. In this case you receive a pro-rata refund of prepaid fees for the unexpired term.",
        },
        {
          t: "p",
          text: "**6.4 Exclusions.** No refund is due under this Section where the failure is caused by:",
        },
        {
          t: "list",
          items: [
            "your source systems, network, hardware or accounting installation;",
            "your failure to maintain a working connector, valid platform authorisation, or data access;",
            "suspension, restriction or termination of your advertising accounts by any platform;",
            "a third-party platform, API or government portal outage, deprecation, rate limit or policy change;",
            "scheduled or emergency maintenance notified in accordance with the SLA;",
            "force majeure;",
            "suspension arising from your breach or non-payment.",
          ],
        },
        {
          t: "p",
          text: "**6.5 Billing errors.** Where you are charged incorrectly — including miscalculation of spend-based fees, duplicate charges, or charges after valid cancellation — the error will be corrected and the excess refunded in full, irrespective of any other provision of this Policy. Billing disputes must be raised within 60 days of the invoice date.",
        },
        {
          t: "p",
          text: "**6.6** Where an SLA service credit regime applies, service credits are the sole and exclusive remedy for availability failures, and Section 6.1 does not apply in addition.",
        },
      ],
    },
    {
      id: "ad-spend",
      number: "7",
      title: "Advertising Expenditure",
      blocks: [
        {
          t: "callout",
          text: "**7.1 Not refundable by us.** Advertising expenditure is incurred by you, billed directly to you by the advertising platform, and is **never refundable by Estrellingent**. This applies without exception, including where expenditure results from:",
        },
        {
          t: "list",
          items: [
            "a change made by the Services;",
            "an error, malfunction, defect or misconfiguration;",
            "an unintended interaction with platform automation;",
            "a delay in the Services applying an intended change.",
          ],
        },
        {
          t: "p",
          text: "**7.2 Platform refunds.** Claims relating to advertising expenditure — including invalid traffic, click fraud, billing errors or platform credits — must be pursued with the relevant advertising platform under its own policies. We will provide reasonable assistance and supporting data on request, but we do not guarantee any outcome and make no payment in respect of such claims.",
        },
        {
          t: "p",
          text: "**7.3 Your controls.** You are responsible for setting and maintaining platform-level budget caps and for monitoring your accounts, as set out in Section 4 of the [Terms](/legal/terms#ad-authorisation).",
        },
      ],
    },
    {
      id: "implementation",
      number: "8",
      title: "Implementation, Onboarding and Professional Services",
      blocks: [
        {
          t: "p",
          text: "**8.1** Implementation, integration, data migration, account setup, training, configuration, creative production and consulting services are charged separately and are **non-refundable once performed**.",
        },
        {
          t: "p",
          text: "**8.2** Where such services are cancelled before commencement, fees are refunded in full less documented costs already incurred.",
        },
        {
          t: "p",
          text: "**8.3** Where cancelled after commencement but before completion, fees are refunded pro-rata for work not performed, calculated on hours or milestones delivered.",
        },
        {
          t: "p",
          text: "**8.4** Where implementation fails to complete because of our inability to establish a working integration within the agreed timeline, and no workaround is available, implementation fees are refunded in full and prepaid subscription fees are refunded pro-rata.",
        },
        {
          t: "p",
          text: "**8.5** Where implementation is delayed or fails because of factors within your control — including unavailability of your personnel, refusal of data or account access, incomplete or corrupt source data, platform authorisation not granted, or infrastructure not meeting documented minimum requirements — no refund is due.",
        },
      ],
    },
    {
      id: "pilots",
      number: "9",
      title: "Pilots and Evaluations",
      blocks: [
        {
          t: "p",
          text: "**9.1** Pilots and evaluation engagements provide access to the Services and, where agreed, implementation support, for a defined period.",
        },
        {
          t: "p",
          text: "**9.2 No outcome contingency.** Pilot fees are **not contingent on any outcome, result or metric**, and no refund arises from a pilot failing to produce a particular result. Section 2 applies in full to pilots.",
        },
        {
          t: "p",
          text: "**9.3** Where a pilot includes reporting on value identified, such reporting describes what the Services have flagged. It is not a representation that any amount will be recovered or realised, and creates no refund entitlement.",
        },
        {
          t: "p",
          text: "**9.4** Where a pilot is cancelled before commencement, fees are refunded in full. Where cancelled after commencement, Section 8.3 applies.",
        },
      ],
    },
    {
      id: "non-refundable",
      number: "10",
      title: "Non-Refundable Items",
      blocks: [
        {
          t: "p",
          text: "The following are non-refundable in all circumstances:",
        },
        {
          t: "list",
          variant: "lettered",
          items: [
            "(a) fees for subscription periods already elapsed and during which access was available;",
            "(b) advertising expenditure of any kind;",
            "(c) implementation, onboarding and professional services already performed;",
            "(d) spend-based or usage-based fees already earned;",
            "(e) third-party costs incurred on your behalf and disclosed in advance;",
            "(f) payment gateway, bank or foreign exchange charges;",
            "(g) taxes already remitted to the authorities, except to the extent recoverable by us under law;",
            "(h) subscriptions terminated by us for your material breach, non-payment, or breach of the Acceptable Use provisions of the Terms;",
            "(i) fees for custom development, bespoke reports, creative production or client-specific features, once delivered and accepted.",
          ],
        },
      ],
    },
    {
      id: "how-to-request",
      number: "11",
      title: "How to Request a Refund",
      blocks: [
        {
          t: "p",
          text: "**11.1** Submit a written request to [Hello@growthrush.ai](mailto:Hello@growthrush.ai) with the subject line “Refund Request”, including:",
        },
        {
          t: "list",
          items: [
            "registered account name and registered email",
            "invoice number and payment date",
            "amount claimed",
            "the clause of this Policy relied upon",
            "description of the issue and supporting evidence",
          ],
        },
        {
          t: "p",
          text: "**11.2 Acknowledgement** — within **2 business days**.",
        },
        {
          t: "p",
          text: "**11.3 Decision** — within **10 business days** of receiving all information reasonably required. We may request further information, which pauses the clock.",
        },
        {
          t: "p",
          text: "**11.4 Outcome** — communicated in writing with reasons. Where declined, we will state the basis and, where appropriate, offer an alternative remedy.",
        },
        {
          t: "p",
          text: "**11.5 Escalation** — to the Grievance Officer named in Section 14. Grievances are resolved within **15 days** of receipt.",
        },
      ],
    },
    {
      id: "processing",
      number: "12",
      title: "Processing of Approved Refunds",
      blocks: [
        {
          t: "p",
          text: "**12.1 Method.** Refunds are made to the original payment instrument and in the original currency of payment. We do not refund to a different account except where the original instrument is closed, subject to documentary verification.",
        },
        {
          t: "p",
          text: "**12.2 Timeline.** Refunds are initiated within **7 business days** of approval. Credit depends on your bank or card issuer and typically takes a further:",
        },
        {
          t: "list",
          items: [
            "Credit and debit cards: 5–10 business days",
            "UPI and net banking: 3–7 business days",
            "Bank transfer / NEFT / RTGS: 3–5 business days",
            "International payments: 10–21 business days",
          ],
        },
        {
          t: "p",
          text: "**12.3 Deductions.** We may deduct non-refundable items under Section 10, any outstanding amounts owed to us, and, for international transactions, irrecoverable foreign exchange and gateway charges.",
        },
        {
          t: "p",
          text: "**12.4 Taxes.** GST on a refunded amount will be adjusted by credit note under Section 34 of the CGST Act, 2017. Where you have already claimed input tax credit on the original invoice, you are responsible for reversing it.",
        },
        {
          t: "p",
          text: "**12.5 Access.** On approval of a refund, access to the Services ceases and automated changes to advertising accounts stop. Prior changes remain in place until you alter them, and campaigns will continue to spend until you change them. Customer Data may be exported within **30 days**, after which it is deleted in accordance with our [Privacy Policy](/legal/privacy).",
        },
      ],
    },
    {
      id: "chargebacks",
      number: "13",
      title: "Chargebacks",
      blocks: [
        {
          t: "p",
          text: "**13.1** Please contact us before initiating a chargeback. Most disputes are resolved faster directly.",
        },
        {
          t: "p",
          text: "**13.2** Where a chargeback is initiated, we may suspend the account pending resolution and will submit evidence of service delivery to the issuer.",
        },
        {
          t: "p",
          text: "**13.3** Where a chargeback is determined in our favour, associated fees and administrative costs may be recovered from you, and we may require prepayment as a condition of restoring access.",
        },
      ],
    },
    {
      id: "grievance",
      number: "14",
      title: "Grievance Redressal",
      blocks: [
        {
          t: "contact",
          title: "Grievance Officer",
          lines: [
            "Name: [INSERT NAME]",
            "Estrellingent Technology Private Limited",
            "A-60 Brahmapur South, Kolkata, West Bengal 700096, India",
            "Email: [Hello@growthrush.ai](mailto:Hello@growthrush.ai)",
            "Telephone: [INSERT NUMBER]",
            "Hours: 10:00 to 18:00 IST, Monday to Friday",
          ],
        },
        {
          t: "p",
          text: "Grievances are acknowledged within 24 hours and resolved within 15 days.",
        },
      ],
    },
    {
      id: "changes",
      number: "15",
      title: "Changes to this Policy",
      blocks: [
        {
          t: "p",
          text: "We may amend this Policy from time to time. The version in effect on the date of your purchase governs that purchase. Material changes will be notified by email to registered account holders at least 15 days before taking effect.",
        },
      ],
    },
    {
      id: "governing-law",
      number: "16",
      title: "Governing Law",
      blocks: [
        {
          t: "p",
          text: "This Policy is governed by the laws of India and subject to the dispute resolution provisions of our [Terms and Conditions](/legal/terms#general).",
        },
      ],
    },
    {
      id: "contact",
      number: "17",
      title: "Contact",
      blocks: [
        {
          t: "contact",
          lines: [
            "Estrellingent Technology Private Limited",
            "A-60 Brahmapur South, Kolkata, West Bengal 700096, India",
            "CIN: U74909WB2023PTC265098",
            "GSTIN: 19AAHCE7862Q1ZN",
            "Email: [Hello@growthrush.ai](mailto:Hello@growthrush.ai)",
            "Website: [growthrush.ai](https://www.growthrush.ai)",
          ],
        },
      ],
    },
  ],
  note: "This document is a template prepared for Estrellingent Technology Private Limited and requires review and adaptation by qualified legal counsel before publication. It does not constitute legal advice.",
};
