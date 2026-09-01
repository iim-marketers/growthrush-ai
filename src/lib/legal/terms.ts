import type { LegalDoc } from "./types";

/** Transcribed from src/policies/Terms-and-Conditions.pdf — keep the two in step. */
export const termsAndConditions: LegalDoc = {
  slug: "terms",
  title: "Terms and Conditions",
  description:
    "The terms governing access to and use of the growthrush.ai software, platform, applications, connectors, APIs, documentation and related services.",
  updated: "11 August 2026",
  effective: "11 August 2026",
  pdf: "/policies/Terms-and-Conditions.pdf",
  sections: [
    {
      id: "agreement",
      number: "1",
      title: "Agreement",
      blocks: [
        {
          t: "p",
          text: "These Terms and Conditions (“Terms”) govern access to and use of the software, platform, applications, connectors, APIs, documentation and related services (collectively, the “Services”) provided by **Estrellingent Technology Private Limited**, CIN U74909WB2023PTC265098, registered office at A-60 Brahmapur South, Kolkata, West Bengal 700096, India (“Estrellingent”, “we”, “us”).",
        },
        {
          t: "p",
          text: "By subscribing to, accessing or using the Services, or by executing an Order Form referencing these Terms, you (“Customer”, “you”) agree to be bound by these Terms. If you are entering into these Terms on behalf of an entity, you represent that you have authority to bind that entity.",
        },
        {
          t: "callout",
          text: "**The Services are provided for business use only.** They are not offered to consumers, and you confirm that you are subscribing in the course of a business, trade or profession.",
        },
        {
          t: "p",
          text: "Where an Order Form, Master Services Agreement or Enterprise Agreement is executed between the parties, that document prevails over these Terms to the extent of any conflict.",
        },
      ],
    },
    {
      id: "services",
      number: "2",
      title: "Description of the Services",
      blocks: [
        {
          t: "p",
          text: "Estrellingent provides two categories of Services. You may subscribe to either or both.",
        },
        { t: "h", text: "2.1 Business Intelligence Services" },
        {
          t: "p",
          text: "Analytics, reconciliation, alerting and decision-support software connecting to accounting, inventory and enterprise systems including Tally, generating insights across financial, operational, supply chain and inventory buffer management functions.",
        },
        {
          t: "p",
          text: "**Read-only operation.** These Services operate on a read-only basis with respect to your accounting system. We do not write to, modify or delete records in it unless a write-back feature is expressly enabled by you in writing.",
        },
        { t: "h", text: "2.2 Advertising Technology Services" },
        {
          t: "p",
          text: "Campaign analytics, audience and targeting optimisation, bid and budget management, creative generation, and performance reporting, connecting to advertising platforms including Google Ads, Meta, Amazon Ads, LinkedIn, TikTok and similar platforms.",
        },
        {
          t: "p",
          text: "**Read-and-write operation.** Where you enable optimisation features, these Services may make changes within your advertising accounts, including adjusting bids, budgets, targeting parameters, schedules, and pausing or activating campaigns, ad sets and ads. **Such changes affect the amount and allocation of your advertising expenditure.** Section 4 governs this.",
        },
        {
          t: "p",
          text: "**Definition — “Ad Spend”.** For the purposes of these Terms and any Order, “Ad Spend” means the total of all amounts budgeted, committed or included across all of your connected advertising accounts during the relevant period, **regardless of actual utilisation or delivery of such amounts**, as reported by the applicable advertising platform.",
        },
        { t: "h", text: "2.3 Decision support, not decision making" },
        {
          t: "p",
          text: "Except where you expressly enable automated changes under Section 4, the Services produce recommendations, flags, alerts, classifications and quantified opportunities. **All decisions, actions, filings, payments, purchases, disposals, publications and communications remain yours.**",
        },
        { t: "h", text: "2.4 Not professional advice" },
        {
          t: "p",
          text: "The Services do not constitute accounting, audit, taxation, legal, statutory, investment or regulatory advice. Outputs relating to GST, input tax credit, TDS, statutory deadlines or tax classification are informational and must be independently verified by your qualified chartered accountant or tax adviser before any filing, claim or reliance. Estrellingent is not a registered tax practitioner and does not act as one.",
        },
      ],
    },
    {
      id: "accounts",
      number: "3",
      title: "Accounts and Access",
      blocks: [
        {
          t: "p",
          text: "**3.1** You must provide accurate registration information and keep it current.",
        },
        {
          t: "p",
          text: "**3.2** You are responsible for all activity under your account, for maintaining the confidentiality of credentials, and for the acts and omissions of your Authorised Users.",
        },
        {
          t: "p",
          text: "**3.3** Access is licensed per named user, per entity, or per connected account as specified in your Order Form. Credentials may not be shared, resold, or used concurrently by multiple individuals.",
        },
        {
          t: "p",
          text: "**3.4** You must notify us immediately at [Hello@growthrush.ai](mailto:Hello@growthrush.ai) of any suspected unauthorised access.",
        },
        {
          t: "p",
          text: "**3.5** We may suspend access without notice where we reasonably believe there is a security risk, unlawful use, or a breach of Section 6.",
        },
      ],
    },
    {
      id: "ad-authorisation",
      number: "4",
      title: "Advertising Account Authorisation and Spend",
      blocks: [
        {
          t: "callout",
          text: "**This Section is material. Please read it carefully.**",
        },
        {
          t: "p",
          text: "**4.1 Authorisation.** By connecting an advertising account and enabling optimisation features, you authorise Estrellingent to make changes within that account of the type and within the limits you configure.",
        },
        {
          t: "p",
          text: "**4.2 Controls are yours.** You are responsible for configuring and maintaining:",
        },
        {
          t: "list",
          variant: "lettered",
          items: [
            "(a) maximum daily and total budget caps at platform level;",
            "(b) the scope of permissions granted through the platform’s own authorisation flow;",
            "(c) any approval or manual-review requirements you wish to apply;",
            "(d) alerts and monitoring on your own account.",
          ],
        },
        {
          t: "p",
          text: "We provide configurable limits within the Services, but **platform-level budget caps remain the definitive control, and you must set them independently.**",
        },
        {
          t: "p",
          text: "**4.3 You bear the spend.** All advertising expenditure is incurred by you, billed by the platform directly to you, and payable by you. **Estrellingent does not hold, disburse or become liable for your advertising spend under any circumstances**, including where spend results from a change made by the Services, from an error, malfunction, misconfiguration or defect, or from an unintended interaction with platform automation.",
        },
        {
          t: "p",
          text: "**4.4 Monitoring obligation.** You remain responsible for monitoring your advertising accounts and spend. You agree to review account activity at reasonable intervals and to notify us promptly of any anomaly. Automation does not transfer the obligation to supervise your own expenditure.",
        },
        {
          t: "p",
          text: "**4.5 Revocation.** You may revoke authorisation at any time through the platform’s permission settings or by disconnecting the account within the Services. Revocation takes effect on the platform’s own timescale and does not reverse changes already made.",
        },
        {
          t: "p",
          text: "**4.6 Audit log.** All changes made by the Services are logged and available to you, including timestamp, entity affected, prior value and new value.",
        },
        {
          t: "p",
          text: "**4.7 Platform compliance.** You are responsible for compliance with the policies of each advertising platform applicable to you as an advertiser, including policies on prohibited and restricted content, sensitive categories, targeting restrictions, consent for tracking, and customer list uploads. **Estrellingent is not responsible for account suspension, disapproval, restriction or termination by any platform.**",
        },
      ],
    },
    {
      id: "creative",
      number: "5",
      title: "Creative and Generated Content",
      blocks: [
        {
          t: "p",
          text: "**5.1 Ownership.** Subject to payment, you own the advertising creative, copy and assets generated for you through the Services, to the extent such material is capable of ownership under applicable law.",
        },
        { t: "p", text: "**5.2 Limits of ownership.** You acknowledge that:" },
        {
          t: "list",
          variant: "lettered",
          items: [
            "(a) material generated by machine learning models may not attract copyright protection in some jurisdictions;",
            "(b) similar or identical output may be generated for other customers, and we grant no exclusivity;",
            "(c) we make no warranty that generated material is original or does not resemble existing works.",
          ],
        },
        {
          t: "p",
          text: "**5.3 Your inputs.** You warrant that any brand assets, images, footage, logos, product data, trade marks, endorsements, likenesses or text you supply are lawfully yours to use, and that their use does not infringe third-party rights.",
        },
        {
          t: "p",
          text: "**5.4 Your review obligation.** **You are solely responsible for reviewing all generated material before publication**, including for factual accuracy, regulatory compliance, advertising standards, claim substantiation, intellectual property clearance, and suitability for the intended audience and market. Generated material may contain errors, unsupported claims, or content unsuitable for your sector or jurisdiction.",
        },
        {
          t: "p",
          text: "**5.5 Prohibited use.** Generated material must not be used to create content that is unlawful, deceptive, defamatory, infringing, or that depicts real individuals without consent.",
        },
      ],
    },
    {
      id: "acceptable-use",
      number: "6",
      title: "Acceptable Use",
      blocks: [
        { t: "p", text: "You shall not, and shall not permit any person to:" },
        {
          t: "list",
          variant: "lettered",
          items: [
            "(a) reverse engineer, decompile, disassemble or attempt to derive the source code, algorithms, models or logic of the Services;",
            "(b) copy, modify, adapt, translate or create derivative works of the Services;",
            "(c) resell, sublicense, rent, lease, distribute or provide the Services as a service bureau to third parties, except under a written reseller or agency agreement with us;",
            "(d) use the Services to build, train or improve a competing product;",
            "(e) circumvent usage limits, rate limits, access controls or licensing restrictions;",
            "(f) upload malicious code, or attempt to gain unauthorised access to our systems or those of other customers;",
            "(g) conduct penetration testing, load testing or vulnerability scanning without prior written consent;",
            "(h) upload or connect data you do not have the lawful right to process, or that infringes third-party rights;",
            "(i) use the Services to conceal, facilitate or effect any unlawful transaction, tax evasion, money laundering, click fraud, impression fraud, or falsification of records or performance data;",
            "(j) use the Services to advertise products or services prohibited under applicable law, or to target advertising in breach of applicable law or platform policy;",
            "(k) use the Services to target advertising to children in breach of applicable law;",
            "(l) remove or obscure proprietary notices;",
            "(m) use the Services in violation of applicable law or applicable export control and sanctions regimes.",
          ],
        },
        {
          t: "p",
          text: "Breach of this Section is a material breach permitting immediate suspension or termination.",
        },
      ],
    },
    {
      id: "licence",
      number: "7",
      title: "Licence",
      blocks: [
        {
          t: "p",
          text: "**7.1 Grant.** Subject to payment and compliance with these Terms, Estrellingent grants you a non-exclusive, non-transferable, non-sublicensable, revocable licence to access and use the Services during the Subscription Term, solely for your internal business purposes.",
        },
        {
          t: "p",
          text: "**7.2 Agencies.** Where you use the Services to manage advertising accounts on behalf of your own clients, you may do so provided you have authority from each client, you remain responsible for their compliance with these Terms, and you do not present the Services as your own proprietary technology without a written agreement permitting it.",
        },
        {
          t: "p",
          text: "**7.3 Reservation.** All rights not expressly granted are reserved. This is a licence to use, not a sale.",
        },
      ],
    },
    {
      id: "customer-data",
      number: "8",
      title: "Customer Data",
      blocks: [
        {
          t: "p",
          text: "**8.1 Ownership.** You retain all right, title and interest in Customer Data. Nothing in these Terms transfers ownership to us.",
        },
        {
          t: "p",
          text: "**8.2 Licence to us.** You grant Estrellingent a limited, non-exclusive licence to host, copy, process, transmit and display Customer Data solely as necessary to provide, maintain, secure and support the Services, and to comply with law.",
        },
        {
          t: "p",
          text: "**8.3 Your warranties.** You warrant that you have all rights, consents and lawful bases necessary to provide Customer Data to us; that Customer Data does not infringe third-party rights; and that you have given any notices and obtained any consents required from your employees, customers, vendors and website or app users, including consent for tracking and for the upload of customer lists to advertising platforms.",
        },
        {
          t: "p",
          text: "**8.4 Aggregated data.** We may generate and use aggregated, anonymised and de-identified data derived from use of the Services for benchmarking, product improvement and research, as described in our [Privacy Policy](/legal/privacy). Such data does not identify you and is not Customer Data.",
        },
        {
          t: "p",
          text: "**8.5 Accuracy.** The Services depend entirely on the completeness and accuracy of data in your source systems and advertising accounts. We do not audit, verify or validate underlying data, and we are not responsible for outputs that are incorrect because the input data was incorrect, incomplete, misclassified, delayed, backdated, manipulated, or affected by attribution modelling, tracking loss, consent-mode restrictions, or platform reporting changes.",
        },
        {
          t: "callout",
          text: "**8.6 No Sensitive Information.** YOU ACKNOWLEDGE THAT THE SERVICES ARE NOT DESIGNED TO PROCESS OR MANAGE SENSITIVE INFORMATION, AND YOU AGREE NOT TO USE THE SERVICES TO UPLOAD, COLLECT, MANAGE OR PROCESS SENSITIVE INFORMATION. “Sensitive Information” means payment card numbers, financial account numbers or wire instructions, government-issued identification numbers of natural persons, biometric information, health information, personal data of children, and any special category of personal data under applicable Data Protection Laws. We specifically disclaim any liability arising from your use of the Services to upload, collect, manage or process Sensitive Information.",
        },
        {
          t: "p",
          text: "**8.7 Platform compliance is essential.** You acknowledge that strict compliance with the terms, policies and instructions of each advertising platform is an **essential term** of this Agreement. **You are responsible for any loss or damage caused to Estrellingent or to our other customers by your breach of any platform’s terms**, including loss, suspension, restriction or revocation of our API access, developer status or platform partnership arising from your conduct.",
        },
        {
          t: "p",
          text: "**8.8 Export and deletion.** During the Subscription Term and for 30 days after termination, you may export Customer Data in a machine-readable format. Thereafter it is deleted in accordance with our [Privacy Policy](/legal/privacy).",
        },
      ],
    },
    {
      id: "fees",
      number: "9",
      title: "Fees, Invoicing and Taxes",
      blocks: [
        {
          t: "p",
          text: "**9.1** Fees are as set out in your Order Form or on our published pricing page, exclusive of taxes.",
        },
        {
          t: "p",
          text: "**9.2** Where fees are calculated as a percentage of advertising spend or on any usage basis, the calculation method, the source of spend data, and the reconciliation process shall be specified in the Order Form. Platform-reported spend for the relevant period is the reference figure.",
        },
        {
          t: "p",
          text: "**9.3** Goods and Services Tax and all other applicable taxes, duties, levies and cesses are payable by you in addition. Where required, you shall provide a valid GSTIN. Where withholding tax applies, you shall furnish a TDS certificate within statutory timelines.",
        },
        {
          t: "p",
          text: "**9.4 Payment in advance.** **All fees are payable in advance.** Invoices are raised before the commencement of each subscription period and are due on receipt.",
        },
        {
          t: "p",
          text: "**9.5 Service commences on payment.** **Access to the Services will be provisioned, and the Subscription Term will commence, only upon receipt and realisation of cleared funds in full.** We are under no obligation to provide, continue or restore the Services before payment has been received and realised. Where payment is made by an instrument that is subsequently dishonoured, reversed or charged back, access may be suspended immediately without notice.",
        },
        {
          t: "p",
          text: "**9.6 Renewal periods.** Each renewal period is invoiced in advance and payable before that period begins. Where payment for a renewal period is not received before the current period expires, access will lapse at the end of the paid period. Restoration of access following lapse is subject to payment in full and may require reconnection or reconfiguration, for which additional fees may apply.",
        },
        {
          t: "p",
          text: "**9.7 Implementation and professional services.** Implementation, onboarding, integration, training and professional services fees are payable in advance, or against milestones as specified in the Order Form. Work will not commence until the applicable fee has been received.",
        },
        {
          t: "p",
          text: "**9.8 Fees billed in arrears.** Notwithstanding Section 9.4, where fees are calculated by reference to advertising spend or usage under Section 9.2, such fees are necessarily determined after the relevant period and will be invoiced in arrears. Such invoices are due within fifteen (15) days of the invoice date. Overdue amounts accrue interest at 1.5% per month or the maximum permitted by law, whichever is lower.",
        },
        {
          t: "p",
          text: "**9.9 Suspension for non-payment.** We may suspend or terminate the Services immediately where any fee payable in advance has not been received, and on 7 days’ written notice where an undisputed invoice raised in arrears remains unpaid for 15 days.",
        },
        {
          t: "p",
          text: "**9.10 No set-off.** All amounts are payable in full without set-off, counterclaim, deduction or withholding, except as required by law in respect of withholding tax under Section 9.3.",
        },
        {
          t: "p",
          text: "**9.11 Price changes.** We may revise fees on renewal with at least 30 days’ written notice before the end of the current term. Fees for a committed term will not increase during that term.",
        },
        {
          t: "p",
          text: "**9.12 Auto-renewal.** Subscriptions renew automatically for successive periods equal to the prior term unless either party gives written notice of non-renewal at least 30 days before the end of the current term.",
        },
      ],
    },
    {
      id: "trials",
      number: "10",
      title: "Trials, Pilots and Evaluations",
      blocks: [
        {
          t: "p",
          text: "**10.1** We may offer free trials, paid pilots or evaluation engagements on terms set out in a separate Pilot Order.",
        },
        {
          t: "p",
          text: "**10.2 No outcome commitment.** Pilots and evaluations are engagements to provide access to the Services and, where agreed, implementation support. **They are not commitments to achieve any result, saving, recovery, return, reduction in cost, or improvement in any metric.** No fee is contingent on any outcome, and no refund arises from a pilot failing to produce a particular result. Any figures discussed before or during a pilot are illustrative and non-binding.",
        },
        {
          t: "p",
          text: "**10.3** Where a pilot includes reporting on value identified, such reporting is a description of what the Services have flagged. It is not a representation that any amount will be recovered, realised, allowed by any authority, or accepted by any counterparty.",
        },
        {
          t: "p",
          text: "**10.4** Trials and pilots are provided **as is**, without warranty. Our total liability in connection with any trial or pilot shall not exceed the fees actually paid for it.",
        },
        {
          t: "p",
          text: "**10.5** We may modify or discontinue free trials at any time.",
        },
      ],
    },
    {
      id: "ip",
      number: "11",
      title: "Intellectual Property",
      blocks: [
        {
          t: "p",
          text: "**11.1** The Services, including all software, source code, models, algorithms, buffer logic, optimisation logic, scoring methodologies, user interfaces, documentation, trade marks and know-how, are and remain the exclusive property of Estrellingent and its licensors.",
        },
        {
          t: "p",
          text: "**11.2** You may provide feedback, suggestions or improvement requests. You grant us a perpetual, irrevocable, worldwide, royalty-free licence to use such feedback without restriction or obligation.",
        },
        {
          t: "p",
          text: "**11.3** Tally, Google, Meta and other third-party marks referenced in the Services belong to their respective owners. Estrellingent is an independent company and is not affiliated with, endorsed by, or sponsored by Tally Solutions Private Limited, Google LLC, Meta Platforms, Inc. or any other platform provider unless expressly stated.",
        },
      ],
    },
    {
      id: "third-party-systems",
      number: "12",
      title: "Third-Party Systems and Dependencies",
      blocks: [
        {
          t: "p",
          text: "**12.1** The Services depend on third-party systems including your accounting software, advertising platforms, operating systems, network infrastructure, cloud providers and government portals.",
        },
        {
          t: "p",
          text: "**12.2** We are not responsible for: changes to third-party APIs, data formats, attribution models, reporting methodologies, auction dynamics, algorithms or policies; downtime, throttling, rate limiting, deprecation or discontinuation of third-party services; suspension, restriction or termination of your accounts by any platform; failures in your on-premise infrastructure, network or accounting installation; or unavailability of government portals used for reconciliation.",
        },
        {
          t: "p",
          text: "**12.3** Advertising platforms change frequently and unilaterally. Features dependent on a platform capability may be modified or withdrawn without notice by that platform.",
        },
        {
          t: "p",
          text: "**12.4** Where a third-party dependency materially changes such that a feature can no longer be provided, we will notify you and may modify or discontinue that feature. Where a discontinued feature was material to your subscription, you may terminate the affected subscription on a pro-rata refund basis.",
        },
      ],
    },
    {
      id: "service-levels",
      number: "13",
      title: "Service Levels and Support",
      blocks: [
        {
          t: "p",
          text: "**13.1** Target availability, support hours, response times and escalation paths are as set out in the Service Level Agreement at growthrush.ai/legal/sla or in your Order Form.",
        },
        {
          t: "p",
          text: "**13.2** Availability targets exclude scheduled maintenance (notified at least 48 hours in advance), emergency maintenance, force majeure, and unavailability caused by your systems, network, or third-party dependencies including advertising platform APIs.",
        },
        {
          t: "p",
          text: "**13.3** Where an SLA credit regime applies, service credits are your sole and exclusive remedy for failure to meet availability targets.",
        },
      ],
    },
    {
      id: "confidentiality",
      number: "14",
      title: "Confidentiality",
      blocks: [
        {
          t: "p",
          text: "**14.1** Each party shall keep confidential all non-public information disclosed by the other and use it solely for purposes of these Terms.",
        },
        {
          t: "p",
          text: "**14.2** Obligations do not apply to information that is public through no breach, independently developed, rightfully received from a third party, or required to be disclosed by law — provided the disclosing party is given notice where legally permitted.",
        },
        {
          t: "p",
          text: "**14.3** These obligations survive termination for 5 years, and indefinitely with respect to trade secrets.",
        },
      ],
    },
    {
      id: "warranties",
      number: "15",
      title: "Warranties and Disclaimers",
      blocks: [
        {
          t: "p",
          text: "**15.1 Our warranty.** We warrant that the Services will perform materially in accordance with the documentation, and that we will provide them with reasonable skill and care.",
        },
        {
          t: "callout",
          text: "**15.2 Disclaimer.** EXCEPT AS EXPRESSLY STATED, THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE”. TO THE MAXIMUM EXTENT PERMITTED BY LAW, ESTRELLINGENT DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, AND NON-INFRINGEMENT.",
        },
        { t: "h", text: "15.3 No performance or outcome guarantee" },
        {
          t: "callout",
          text: "ESTRELLINGENT MAKES NO GUARANTEE, WARRANTY OR REPRESENTATION AS TO ANY RESULT, OUTCOME, RETURN OR PERFORMANCE ARISING FROM USE OF THE SERVICES.",
        },
        { t: "p", text: "Without limitation, we do **not** guarantee:" },
        {
          t: "list",
          variant: "lettered",
          items: [
            "(a) any improvement in return on ad spend, cost per acquisition, cost per click, cost per mille, click-through rate, conversion rate, reach, impressions, revenue, or any other advertising metric;",
            "(b) any reduction in advertising cost, or any increase in advertising efficiency, sales or profitability;",
            "(c) any saving, recovery, cash release, margin improvement, working capital release or return of any kind;",
            "(d) that any identified input tax credit, duplicate payment, discount, rebate, variance or claim will be allowed, recovered, or accepted by any authority or counterparty;",
            "(e) that any recommendation regarding stock, buffers, purchase orders, credit limits, pricing, bids, budgets, audiences or creative will produce a favourable commercial result;",
            "(f) that the Services will identify every error, leakage, risk, inefficiency or opportunity present in your data;",
            "(g) that generated creative will perform, comply with any standard, or be free of resemblance to existing works;",
            "(h) approval, continued availability, or non-suspension of your accounts by any advertising platform;",
            "(i) that the Services will be uninterrupted, timely, secure or error-free.",
          ],
        },
        {
          t: "p",
          text: "**15.4** Outputs are probabilistic and derived from historical data. Advertising and commercial outcomes depend on numerous factors outside our control, including market conditions, competitor activity, platform algorithm changes, auction dynamics, seasonality, pricing, product quality, creative appeal, landing page experience, and your own operations. Past performance does not indicate future results.",
        },
        {
          t: "p",
          text: "**15.5 Illustrative figures.** Case studies, benchmarks, projections, estimates and results achieved by other customers are illustrative only. They are not a representation, warranty or guarantee that you will achieve comparable results, and shall not form part of any agreement between us. No statement made by any employee, agent or representative of Estrellingent creates a guarantee unless expressly set out in a signed Order Form.",
        },
        {
          t: "p",
          text: "**15.6** You confirm that you have not relied on any representation, statement, projection or illustration not expressly set out in these Terms or your Order Form in deciding to subscribe.",
        },
      ],
    },
    {
      id: "liability",
      number: "16",
      title: "Limitation of Liability",
      blocks: [
        {
          t: "p",
          text: "**16.1** Neither party excludes liability for death or personal injury caused by negligence, fraud, fraudulent misrepresentation, or any liability that cannot be excluded under applicable law.",
        },
        {
          t: "callout",
          text: "**16.2** Subject to 16.1, Estrellingent’s aggregate liability arising out of or in connection with these Terms, whether in contract, tort (including negligence), breach of statutory duty or otherwise, shall not exceed the total fees paid by you to Estrellingent in the twelve (12) months immediately preceding the event giving rise to the claim.",
        },
        {
          t: "p",
          text: "**16.3** For the avoidance of doubt, “fees paid to Estrellingent” excludes advertising expenditure paid by you to any advertising platform, which does not count towards the liability cap under any circumstances.",
        },
        {
          t: "p",
          text: "**16.4** Neither party shall be liable for indirect, incidental, special, punitive or consequential loss, or for loss of profit, revenue, anticipated savings, business, goodwill, opportunity, reputation, or data, however arising.",
        },
        {
          t: "p",
          text: "**16.5** Without limiting the above, Estrellingent shall not be liable for:",
        },
        {
          t: "list",
          variant: "lettered",
          items: [
            "(a) advertising expenditure of any kind, including spend incurred through error, malfunction, misconfiguration or defect;",
            "(b) wasted ad spend, overspend, budget overrun, or spend on underperforming campaigns;",
            "(c) suspension, restriction, disapproval or termination of your accounts by any advertising platform;",
            "(d) claims arising from published advertising creative, including regulatory action, advertising standards complaints, defamation, or intellectual property claims;",
            "(e) tax penalties, interest, disallowances or assessments arising from reliance on outputs of the Services;",
            "(f) losses arising from purchase, disposal, pricing, credit or inventory decisions taken on the basis of recommendations;",
            "(g) stockouts, excess inventory, write-offs or lost sales;",
            "(h) bad debts, or losses arising from extending or withholding credit;",
            "(i) inaccuracy in outputs caused by inaccurate, incomplete, delayed or manipulated source data, or by platform attribution and reporting limitations;",
            "(j) any act or omission of a third-party platform, integration or government portal.",
          ],
        },
        {
          t: "p",
          text: "**16.6** You acknowledge that the fees reflect this allocation of risk, and that we would not provide the Services on these commercial terms without it.",
        },
      ],
    },
    {
      id: "indemnity",
      number: "17",
      title: "Indemnity",
      blocks: [
        {
          t: "p",
          text: "**17.1 By us.** We shall indemnify you against third-party claims that the Services, as provided by us and used in accordance with these Terms, infringe that party’s intellectual property rights, provided you notify us promptly, give us sole control of the defence, and cooperate reasonably. This does not apply where the claim arises from Customer Data, your inputs, generated creative published by you, your modifications, or use in combination with materials not supplied by us. Our liability under this clause is subject to Section 16.2.",
        },
        {
          t: "p",
          text: "**17.2 By you.** You shall indemnify us against claims arising from: Customer Data, including any claim that its provision to us was unlawful or infringing; advertising creative and campaigns published by you, including regulatory, consumer protection, advertising standards and intellectual property claims; your breach of Section 6; breach of any advertising platform’s terms; and your use of outputs in violation of applicable law.",
        },
      ],
    },
    {
      id: "term",
      number: "18",
      title: "Term, Termination and Suspension",
      blocks: [
        {
          t: "p",
          text: "**18.1** These Terms commence on the earlier of your first access to the Services or the Order Form effective date, and continue for the Subscription Term.",
        },
        {
          t: "p",
          text: "**18.2 Termination for cause.** Either party may terminate immediately on written notice if the other commits a material breach not remedied within 30 days of notice, or becomes insolvent, enters liquidation, or has a receiver appointed.",
        },
        {
          t: "p",
          text: "**18.3 Termination for convenience.** You may terminate at the end of the current Subscription Term by giving 30 days’ written notice. Termination mid-term does not entitle you to a refund except as set out in the [Return and Refund Policy](/legal/refunds).",
        },
        {
          t: "p",
          text: "**18.4 Termination or suspension on platform request.** We may suspend or terminate the Services, or disconnect any advertising account, immediately and without liability where:",
        },
        {
          t: "list",
          variant: "lettered",
          items: [
            "(a) you have breached the terms or policies of any advertising platform; or",
            "(b) an advertising platform requests in writing that we cease providing the Services to you, or restricts or revokes access in respect of your accounts.",
          ],
        },
        {
          t: "p",
          text: "**18.5 Suspension.** We may suspend the Services immediately where required by law, where there is a security threat, where use breaches Section 6, or where fees are overdue in accordance with Section 9.9.",
        },
        {
          t: "p",
          text: "**18.6 Effect of termination.** On termination: your licence ends; you must cease use; accrued fees become immediately payable; automated changes to advertising accounts cease, though prior changes remain in place until you alter them; each party returns or destroys the other’s confidential information; and Customer Data is handled in accordance with Section 8.8.",
        },
        {
          t: "p",
          text: "**18.7 Post-termination advertising accounts.** You are responsible for reviewing and adjusting your advertising accounts following termination. Campaigns, budgets and bids remain as last configured and will continue to spend until you change them.",
        },
        {
          t: "p",
          text: "**18.8 Survival.** Sections 4.3, 8.1, 8.4, 8.6, 8.7, 11, 14, 15, 16, 17, 18.6, 18.7, 18.8, 19 and 20 survive termination.",
        },
      ],
    },
    {
      id: "force-majeure",
      number: "19",
      title: "Force Majeure",
      blocks: [
        {
          t: "p",
          text: "Neither party shall be liable for failure or delay in performance caused by events beyond its reasonable control, including act of God, flood, fire, earthquake, pandemic, epidemic, war, terrorism, civil unrest, strike, governmental action, change in law, failure of telecommunications or internet infrastructure, cyber-attack on national infrastructure, or failure of a utility or platform provider. Payment obligations are not excused. If such an event continues beyond 60 days, either party may terminate on written notice.",
        },
      ],
    },
    {
      id: "general",
      number: "20",
      title: "General",
      blocks: [
        {
          t: "p",
          text: "**20.1 Governing law.** These Terms are governed by the laws of India.",
        },
        {
          t: "p",
          text: "**20.2 Jurisdiction and dispute resolution.** The parties shall first attempt resolution through good faith discussion between senior representatives within 30 days. Failing resolution, disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996, before a sole arbitrator appointed by mutual agreement. The seat and venue shall be Kolkata, and proceedings shall be in English. The courts at Kolkata shall have exclusive jurisdiction over matters not subject to arbitration.",
        },
        {
          t: "p",
          text: "**20.3 Assignment.** You may not assign these Terms without our prior written consent. We may assign to an affiliate or in connection with a merger, acquisition or sale of assets.",
        },
        {
          t: "p",
          text: "**20.4 Entire agreement.** These Terms, together with the Order Form, [Privacy Policy](/legal/privacy), [Return and Refund Policy](/legal/refunds) and any SLA, constitute the entire agreement and supersede all prior understandings, proposals, presentations and representations.",
        },
        {
          t: "p",
          text: "**20.5 Amendment.** We may amend these Terms by posting a revised version and notifying you by email or in-product notification. The revised version takes effect 30 days after notice.",
        },
        {
          t: "p",
          text: "If you object to an amendment, you must notify us in writing within 30 days of our notice. Where you do so, your subscription continues to be governed by the version of these Terms in force before the amendment until your next renewal date, after which the current version applies. Where we can no longer reasonably provide the Services under the pre-amendment version — for example because the amendment is required by law or arises from a change to the Services or to a platform’s terms — the affected Services may be terminated on notice to you, and we will refund any prepaid but unused fees for the period after termination.",
        },
        {
          t: "p",
          text: "Continued use after the effective date without objection constitutes acceptance.",
        },
        {
          t: "p",
          text: "**20.6 Severability.** If any provision is held invalid, the remainder continues in force and the invalid provision shall be replaced by one that most closely reflects the original intent.",
        },
        {
          t: "p",
          text: "**20.7 Waiver.** No failure or delay in exercising a right constitutes a waiver.",
        },
        {
          t: "p",
          text: "**20.8 No partnership.** Nothing creates a partnership, joint venture, agency or employment relationship. We do not act as your agent in dealings with any advertising platform.",
        },
        {
          t: "p",
          text: "**20.9 Notices.** Notices shall be in writing and sent to the registered address or the email address on the account, and are deemed received on delivery or 24 hours after email transmission.",
        },
        {
          t: "p",
          text: "**20.10 Publicity.** Neither party may use the other’s name or logo publicly without prior written consent, except that we may list you as a customer on our website and in sales materials unless you notify us otherwise in writing.",
        },
        {
          t: "p",
          text: "**20.11 Language.** These Terms are executed in English, which governs in the event of any translation.",
        },
      ],
    },
    {
      id: "contact",
      number: "21",
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
          ],
        },
      ],
    },
  ],
  note: "This document is a template prepared for Estrellingent Technology Private Limited and requires review and adaptation by qualified legal counsel before publication. It does not constitute legal advice.",
};
