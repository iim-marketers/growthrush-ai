import type { LegalDoc } from "./types";

/** Transcribed from src/policies/Privacy-Policy.pdf — keep the two in step. */
export const privacyPolicy: LegalDoc = {
  slug: "privacy",
  title: "Privacy Policy",
  description:
    "How Estrellingent Technology Private Limited collects, uses, stores, discloses, transfers and protects information in connection with the growthrush.ai Services.",
  updated: "11 August 2026",
  effective: "11 August 2026",
  pdf: "/policies/Privacy-Policy.pdf",
  sections: [
    {
      id: "introduction",
      number: "1",
      title: "Introduction",
      blocks: [
        {
          t: "p",
          text: "Estrellingent Technology Private Limited (“Estrellingent”, “Company”, “we”, “us”, “our”), a company incorporated under the Companies Act, 2013, having CIN U74909WB2023PTC265098 and its registered office at A-60 Brahmapur South, Kolkata, West Bengal 700096, India, provides:",
        },
        {
          t: "list",
          variant: "lettered",
          items: [
            "(a) **Business Intelligence Services** — financial analytics, reconciliation, inventory optimisation, buffer management and decision-support software that integrates with accounting and enterprise systems including Tally; and",
            "(b) **Advertising Technology Services** — campaign analytics, audience and targeting optimisation, bid and budget management, creative generation and performance reporting, integrating with advertising platforms including Google Ads, Meta, Amazon Ads, LinkedIn, TikTok, Snap, Pinterest and similar platforms;",
          ],
        },
        {
          t: "p",
          text: "together with our website, applications, APIs, connectors and documentation (collectively, the “Services”).",
        },
        {
          t: "p",
          text: "This Privacy Policy explains how we collect, use, store, disclose, transfer and protect information in connection with the Services.",
        },
        {
          t: "p",
          text: "This Policy is published in accordance with the Digital Personal Data Protection Act, 2023 (“DPDP Act”), the Information Technology Act, 2000 and rules made thereunder, and, where applicable, the EU/UK General Data Protection Regulation (“GDPR”), the Australian Privacy Act 1988, and applicable United States state privacy laws.",
        },
        {
          t: "p",
          text: "By accessing our website or using the Services, you acknowledge that you have read and understood this Policy.",
        },
      ],
    },
    {
      id: "our-role",
      number: "2",
      title: "Our Role: Controller and Processor",
      blocks: [
        {
          t: "p",
          text: "Our role differs depending on the data involved. This distinction is central to how we handle information.",
        },
        { t: "h", text: "2.1 Where we act as a Data Fiduciary / Controller" },
        {
          t: "p",
          text: "We determine the purposes and means of processing for:",
        },
        {
          t: "list",
          items: [
            "Information you provide when creating an account, subscribing or contacting us",
            "Billing and payment records",
            "Website usage and product analytics data",
            "Marketing and communication preferences",
            "Support correspondence",
          ],
        },
        { t: "h", text: "2.2 Where we act as a Data Processor" },
        {
          t: "p",
          text: "We process on your documented instructions, and you remain the Data Fiduciary / Controller for:",
        },
        {
          t: "list",
          items: [
            "**Business Data** — all data synchronised from your Tally installation or other accounting, ERP or inventory systems, including ledgers, vouchers, stock records, purchase and sales registers, tax filings, and customer, vendor and employee master records",
            "**Advertising Data** — all data accessed through your advertising accounts, including campaign structures, spend, performance metrics, audience and segment definitions, conversion and pixel data, customer lists you upload to platforms, and creative assets",
          ],
        },
        { t: "p", text: "(together, “Customer Data”)" },
        {
          t: "p",
          text: "We do not determine the purpose of Customer Data. We process it solely to deliver the Services you have subscribed to.",
        },
        {
          t: "callout",
          text: "**You are responsible for ensuring you have a lawful basis to share Customer Data with us**, including any notice, consent or opt-out required from your own customers, vendors, employees and website or app users.",
        },
      ],
    },
    {
      id: "information-we-collect",
      number: "3",
      title: "Information We Collect",
      blocks: [
        { t: "h", text: "3.1 Information you provide directly" },
        {
          t: "list",
          items: [
            "Name, designation, business email address, telephone number",
            "Company name, GSTIN, PAN, registered address, business type and sector",
            "Login credentials (passwords stored only in salted, hashed form)",
            "Billing details, GST registration details and transaction records",
            "Content of support tickets, emails and communications with us",
          ],
        },
        {
          t: "h",
          text: "3.2 Business Data ingested from accounting and enterprise systems",
        },
        {
          t: "p",
          text: "Where you authorise a connection to Tally or a comparable system, we may ingest:",
        },
        {
          t: "list",
          items: [
            "Ledger masters, groups and cost centres",
            "Sales, purchase, payment, receipt, journal, contra, debit note and credit note vouchers",
            "Bill-wise details, outstanding receivables and payables",
            "Stock items, batches, godowns, movements and valuations",
            "Purchase orders, sales orders and delivery notes",
            "GST return and reconciliation data",
            "Bank ledger balances and reconciliation entries",
            "Payroll cost heads present in accounting data",
          ],
        },
        {
          t: "h",
          text: "3.3 Advertising Data ingested from advertising platforms",
        },
        {
          t: "p",
          text: "Where you authorise a connection to an advertising account, we may access:",
        },
        {
          t: "list",
          items: [
            "Account, campaign, ad set and ad structures and settings",
            "Spend, impressions, clicks, conversions, revenue and attribution data",
            "Bid strategies, budgets, schedules and placement settings",
            "Audience definitions, segments, lookalike and remarketing lists",
            "Creative assets, ad copy, landing page URLs and associated metadata",
            "Conversion tracking, pixel and server-side event data",
            "Product feeds and catalogue data",
          ],
        },
        {
          t: "callout",
          text: "**Important:** Advertising platforms generally provide aggregated and pseudonymised data. Where any customer list, hashed identifier, conversion event or pixel data you have uploaded or configured contains or derives from personal data, you remain the controller of that data and are responsible for the lawful basis, notices and consents supporting it.",
        },
        { t: "h", text: "3.4 Information collected automatically" },
        {
          t: "list",
          items: [
            "IP address, device identifiers, browser type and version, operating system",
            "Pages accessed, features used, session duration, timestamps",
            "Log data, error reports, crash diagnostics and performance metrics",
            "Cookies and similar technologies (see Section 12)",
          ],
        },
        { t: "h", text: "3.5 Information from third parties" },
        {
          t: "list",
          items: [
            "Payment status from payment gateways",
            "Authentication data from identity providers where you use single sign-on",
            "Data from integrated third-party systems you authorise",
          ],
        },
        { t: "h", text: "3.6 Information we do not collect" },
        {
          t: "p",
          text: "We do not knowingly collect data from children or knowingly permit the Services to be used to target advertising to children. We do not collect biometric data, health data, or data relating to sexual orientation, political affiliation or religious belief. We do not store full payment card numbers, CVV codes or banking passwords — payment processing is handled by PCI-DSS compliant gateways.",
        },
      ],
    },
    {
      id: "purposes",
      number: "4",
      title: "Purposes of Processing",
      blocks: [
        {
          t: "table",
          head: ["Purpose", "Categories used"],
          rows: [
            ["Creating and administering your account", "Account and contact data"],
            [
              "Delivering Business Intelligence Services — analytics, reconciliation, alerts, buffer status, recommendations",
              "Business Data",
            ],
            [
              "Delivering Advertising Technology Services — targeting, bid and budget optimisation, creative generation, reporting",
              "Advertising Data",
            ],
            [
              "Maintaining the audit and activity log of changes made and value identified",
              "Customer Data, usage data",
            ],
            [
              "Providing technical support and resolving issues",
              "Account data, logs, Customer Data on request",
            ],
            [
              "Billing, invoicing, tax compliance and collections",
              "Account and billing data",
            ],
            [
              "Improving reliability, performance and accuracy of the Services",
              "Usage data, aggregated and de-identified data",
            ],
            [
              "Security monitoring, fraud prevention and abuse detection",
              "Log and usage data",
            ],
            ["Communicating service updates, outages and changes", "Contact data"],
            [
              "Marketing communications, where permitted",
              "Contact data, subject to opt-out",
            ],
            [
              "Complying with legal, regulatory and statutory obligations",
              "As required by law",
            ],
          ],
        },
        {
          t: "h",
          text: "4.1 Legal bases (where GDPR or comparable law applies)",
        },
        {
          t: "list",
          items: [
            "**Performance of a contract** — providing the Services you have subscribed to",
            "**Legitimate interests** — security, service improvement, fraud prevention, direct marketing to business contacts",
            "**Legal obligation** — tax, accounting and statutory retention requirements",
            "**Consent** — non-essential cookies, and marketing where consent is required",
          ],
        },
        {
          t: "p",
          text: "Where processing relies on consent, you may withdraw it at any time without affecting the lawfulness of prior processing.",
        },
      ],
    },
    {
      id: "model-training",
      number: "5",
      title: "Use of Data for Model Training and Benchmarking",
      blocks: [
        {
          t: "p",
          text: "We state our position explicitly because we consider it material.",
        },
        {
          t: "p",
          text: "**5.1** We do **not** use identifiable Customer Data to train models deployed for any customer other than you. Your financial data, campaign performance, audience definitions and creative assets are not used to improve outcomes for your competitors.",
        },
        {
          t: "p",
          text: "**5.2** We may use aggregated, anonymised and de-identified data derived from the Services to develop industry benchmarks, improve algorithms and publish research. Such data is stripped of company names, account identifiers, GSTINs, PANs, contact details and individual transaction or campaign identifiers, and is aggregated across a minimum of twenty-five (25) distinct customers before use.",
        },
        {
          t: "p",
          text: "**5.3** You may opt out of inclusion in aggregated benchmarking by written notice to [Hello@growthrush.ai](mailto:Hello@growthrush.ai), without affecting your access to the Services.",
        },
        {
          t: "p",
          text: "**5.4** We do not sell Customer Data. We do not share Customer Data with advertisers, data brokers, or your competitors.",
        },
        {
          t: "p",
          text: "**5.5 Generative features.** Where the Services generate advertising creative, copy or recommendations using machine learning models, prompts and inputs derived from your Customer Data are not used to train third-party foundation models except where a sub-processor is contractually bound not to train on customer inputs. Current generative sub-processors are listed at growthrush.ai/legal/subprocessors.",
        },
      ],
    },
    {
      id: "platform-data",
      number: "6",
      title: "Advertising Platform Data and Platform Terms",
      blocks: [
        {
          t: "p",
          text: "**6.1** Access to advertising platform data is governed by the terms of the relevant platform in addition to this Policy — including the Google Ads API Terms, Meta Platform Terms, and equivalent terms of other platforms.",
        },
        {
          t: "p",
          text: "**6.2** We handle platform data in accordance with those terms, which may impose restrictions on retention, aggregation, onward transfer and use that are stricter than those in this Policy. Where a platform’s terms conflict with this Policy in relation to that platform’s data, the platform’s terms prevail.",
        },
        {
          t: "p",
          text: "**6.3** You are responsible for compliance with platform policies applicable to you as an advertiser, including policies on prohibited content, sensitive categories, customer list uploads, consent for tracking, and restricted targeting.",
        },
        {
          t: "p",
          text: "**6.4** We do not create, sell or license audience segments derived from one customer’s data for use by another customer.",
        },
      ],
    },
    {
      id: "disclosure",
      number: "7",
      title: "Disclosure of Information",
      blocks: [
        {
          t: "p",
          text: "**7.1 Sub-processors and service providers** — cloud hosting, database, monitoring, email delivery, payment processing, machine learning inference and customer support providers, each bound by written agreements imposing confidentiality and security obligations no less protective than this Policy. A current list is available at growthrush.ai/legal/subprocessors or on written request.",
        },
        {
          t: "p",
          text: "**7.2 Advertising platforms** — where you instruct us to apply changes to your advertising accounts, relevant data is transmitted to the applicable platform under your account credentials and subject to that platform’s own privacy terms.",
        },
        {
          t: "p",
          text: "**7.3 Professional advisers** — auditors, lawyers and accountants under duties of confidentiality.",
        },
        {
          t: "p",
          text: "**7.4 Legal and regulatory disclosure** — where required by applicable law, court order, or a lawful government or regulatory request. Where legally permitted, we will notify you before disclosing Customer Data so that you may seek protective relief.",
        },
        {
          t: "p",
          text: "**7.5 Corporate transactions** — in connection with a merger, acquisition, financing, reorganisation or sale of assets, subject to the recipient being bound by terms consistent with this Policy. You will be notified of any change in the controlling entity.",
        },
        {
          t: "p",
          text: "**7.6 With your instruction** — where you direct us to share data with a third party, including your own advisers, agencies or integration partners.",
        },
        {
          t: "p",
          text: "We do not otherwise disclose Customer Data to third parties.",
        },
      ],
    },
    {
      id: "cross-border",
      number: "8",
      title: "Cross-Border Transfers",
      blocks: [
        {
          t: "p",
          text: "Our infrastructure may be hosted in India and in other jurisdictions including India and the United States. Where we transfer personal data outside the country of collection, we do so subject to appropriate safeguards, which may include Standard Contractual Clauses, adequacy determinations, or equivalent contractual protections.",
        },
        {
          t: "p",
          text: "Transfers from India are made in accordance with Section 16 of the DPDP Act and any restrictions notified by the Central Government.",
        },
        {
          t: "p",
          text: "Advertising platforms are themselves global and will process data in their own jurisdictions under their own terms.",
        },
        {
          t: "p",
          text: "Customers may request that Customer Data be hosted exclusively within a specified region, subject to availability and commercial terms.",
        },
      ],
    },
    {
      id: "retention",
      number: "9",
      title: "Data Retention",
      blocks: [
        {
          t: "table",
          head: ["Data category", "Retention period"],
          rows: [
            ["Account and contact data", "Duration of the relationship, plus 3 years"],
            [
              "Business Data",
              "Duration of the subscription, plus 30 days for retrieval, then deleted",
            ],
            [
              "Advertising Data",
              "Duration of the subscription, plus 30 days, subject to shorter periods required by platform terms",
            ],
            ["Generated creative assets", "Duration of the subscription, plus 30 days"],
            [
              "Billing, invoicing and tax records",
              "8 years, as required under Indian tax and companies law",
            ],
            ["Security and access logs", "12 months"],
            ["Change and audit logs for actions taken in your accounts", "24 months"],
            ["Support correspondence", "3 years"],
            ["Aggregated anonymised data", "Retained indefinitely; not personal data"],
            [
              "Backups",
              "Purged on the rolling backup cycle, not exceeding 90 days",
            ],
          ],
        },
        {
          t: "p",
          text: "On termination, Customer Data is available for export for 30 days, after which it is deleted from active systems within 30 days and from backups within 90 days. Deletion certificates are available on request.",
        },
        {
          t: "p",
          text: "We may retain data beyond these periods where required to comply with a legal obligation, resolve a dispute, or enforce our agreements.",
        },
      ],
    },
    {
      id: "security",
      number: "10",
      title: "Security",
      blocks: [
        {
          t: "p",
          text: "We maintain reasonable security practices and procedures as required under the IT Act and the DPDP Act, including:",
        },
        {
          t: "list",
          items: [
            "Encryption in transit (TLS 1.2 or above) and at rest (AES-256 or equivalent)",
            "Role-based access control and least privilege",
            "Multi-factor authentication for administrative access",
            "Logical segregation of each customer’s data",
            "Encrypted storage of OAuth tokens and platform credentials, with scope limited to what each feature requires",
            "Audit logging of all access to Customer Data and of all changes made to connected accounts",
            "Periodic vulnerability assessment and penetration testing",
            "Background verification of personnel with access to production systems",
            "Documented incident response and business continuity procedures",
            "Contractual confidentiality obligations binding all employees and contractors",
          ],
        },
        {
          t: "p",
          text: "**10.1 Accounting connector.** Where the Services connect to an on-premise Tally installation, the connection operates on a **read-only** basis. We do not write to, alter or delete data in your accounting system.",
        },
        {
          t: "p",
          text: "**10.2 Advertising connector.** Advertising platform connections may operate on a **read-and-write** basis where you enable optimisation features. Changes are logged, attributable and reversible where the platform supports rollback. You control the scope of authorisation and may revoke it at any time through the platform’s own permission settings.",
        },
        {
          t: "p",
          text: "**10.3** You are responsible for the security of your own network, servers, accounting installation, advertising accounts and the credentials used to authorise any connection.",
        },
        {
          t: "p",
          text: "**10.4 Breach notification.** In the event of a personal data breach we will notify the Data Protection Board of India and affected Data Principals in the manner and within the timelines prescribed under the DPDP Act, and will notify affected customers without undue delay.",
        },
        {
          t: "p",
          text: "**10.5** No system is entirely secure. We do not warrant absolute security, and you acknowledge the inherent risks of transmitting data over the internet.",
        },
      ],
    },
    {
      id: "your-rights",
      number: "11",
      title: "Your Rights",
      blocks: [
        {
          t: "p",
          text: "Subject to applicable law and verification of identity, you have the right to:",
        },
        {
          t: "list",
          items: [
            "**Access** — confirmation of processing and a summary of personal data processed",
            "**Correction** — correction of inaccurate or incomplete data",
            "**Erasure** — deletion where data is no longer necessary and no legal obligation requires retention",
            "**Portability** — receipt of your data in a structured, commonly used, machine-readable format",
            "**Withdraw consent** — where processing is based on consent",
            "**Object or restrict** — where processing is based on legitimate interests",
            "**Grievance redressal** — complaint to us and, if unresolved, to the Data Protection Board of India",
            "**Nominate** — nomination of an individual to exercise your rights in the event of death or incapacity, as provided under the DPDP Act",
          ],
        },
        {
          t: "p",
          text: "**11.1 Requests concerning Customer Data.** Where a request relates to personal data within Customer Data, we act as a Processor. Please direct such requests to the customer organisation that holds the relationship with you. If a request reaches us directly, we will forward it to the relevant customer and assist them in responding, but will not act on it independently.",
        },
        {
          t: "p",
          text: "**11.2 Advertising opt-outs.** If you are an individual seeking to opt out of advertising served by one of our customers, the opt-out is exercised through the relevant advertising platform’s own controls or through the advertiser directly. We do not serve advertisements and cannot suppress delivery on any platform.",
        },
        {
          t: "p",
          text: "To exercise any right, contact [Hello@growthrush.ai](mailto:Hello@growthrush.ai). We will respond within the timelines prescribed by applicable law, and in any event within 30 days.",
        },
      ],
    },
    {
      id: "cookies",
      number: "12",
      title: "Cookies",
      blocks: [
        { t: "p", text: "We use cookies and similar technologies:" },
        {
          t: "list",
          items: [
            "**Strictly necessary** — authentication, session management, security. These cannot be disabled.",
            "**Functional** — remembering preferences and settings.",
            "**Analytics** — understanding feature usage and improving the product.",
          ],
        },
        {
          t: "p",
          text: "Where required by law, we obtain consent before setting non-essential cookies. You may manage cookies through your browser settings; disabling strictly necessary cookies will prevent the Services from functioning.",
        },
        {
          t: "p",
          text: "This Policy covers cookies set by **our** website and application. It does not cover pixels, tags or trackers deployed on **your** website or app, for which you are responsible.",
        },
      ],
    },
    {
      id: "third-party",
      number: "13",
      title: "Third-Party Links and Integrations",
      blocks: [
        {
          t: "p",
          text: "The Services may link to or integrate with third-party systems, including accounting platforms, advertising platforms, banks, government portals and payment gateways. We are not responsible for the privacy practices of those third parties. Their handling of data is governed by their own policies, which you should review.",
        },
        {
          t: "p",
          text: "Our integrations do not imply endorsement by, or affiliation with, Tally Solutions Private Limited, Google LLC, Meta Platforms, Inc. or any other platform provider.",
        },
      ],
    },
    {
      id: "changes",
      number: "14",
      title: "Changes to this Policy",
      blocks: [
        {
          t: "p",
          text: "We may update this Policy from time to time. Material changes will be notified by email to registered account holders and by prominent notice on the Services at least 15 days before taking effect. Continued use after the effective date constitutes acceptance.",
        },
        {
          t: "p",
          text: "Version history is available at growthrush.ai/legal/versions.",
        },
      ],
    },
    {
      id: "grievance",
      number: "15",
      title: "Grievance Officer",
      blocks: [
        {
          t: "p",
          text: "In accordance with the Information Technology Act, 2000 and the DPDP Act, 2023:",
        },
        {
          t: "contact",
          title: "Grievance Officer",
          lines: [
            "Name: [INSERT NAME]",
            "Designation: [INSERT DESIGNATION]",
            "Estrellingent Technology Private Limited",
            "A-60 Brahmapur South, Kolkata, West Bengal 700096, India",
            "Email: [Hello@growthrush.ai](mailto:Hello@growthrush.ai)",
            "Telephone: [INSERT NUMBER]",
            "Hours: 10:00 to 18:00 IST, Monday to Friday, excluding public holidays",
          ],
        },
        {
          t: "p",
          text: "Grievances will be acknowledged within 24 hours and resolved within 15 days of receipt.",
        },
        {
          t: "contact",
          title: "Data Protection Officer (where appointed)",
          lines: [
            "Name: [INSERT NAME]",
            "Email: [Hello@growthrush.ai](mailto:Hello@growthrush.ai)",
          ],
        },
      ],
    },
    {
      id: "contact",
      number: "16",
      title: "Contact",
      blocks: [
        {
          t: "contact",
          lines: [
            "Estrellingent Technology Private Limited",
            "A-60 Brahmapur South, Kolkata, West Bengal 700096, India",
            "CIN: U74909WB2023PTC265098",
            "Email: [Hello@growthrush.ai](mailto:Hello@growthrush.ai)",
            "Website: [growthrush.ai](https://growthrush.ai)",
          ],
        },
      ],
    },
  ],
  note: "This document is a template prepared for Estrellingent Technology Private Limited and requires review and adaptation by qualified legal counsel before publication. It does not constitute legal advice.",
};
