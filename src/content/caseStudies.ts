import type { WorkKind } from "@/components/WorkVisual";

// SAMPLE CONTENT — placeholder projects for layout and review only.
// Replace with verified OP DEV case studies; per the brief, quantified results
// must only be published when verified, so outcomes here stay qualitative.

export type CaseStudy = {
  slug: string;
  title: string;
  client: string; // anonymized until the client approves naming
  service: string; // filter label
  industry: string; // industry slug (content/industries.ts)
  projectType: string;
  visual: WorkKind;
  challenge: string;
  role: string;
  outcome: string;
  // Detail page, per brief 4.5 "Case Study Structure"
  overview: string;
  background: string;
  objectives: string[];
  approach: string[];
  solutions: string[];
  tools: string[];
  results: string[];
  services: string[]; // service category ids
};

export const SAMPLE_NOTICE = "Sample project shown for layout — to be replaced with a verified OP DEV case study.";

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "online-giving-platform",
    title: "Online giving platform for a regional charity",
    client: "Regional charity",
    service: "Web",
    industry: "ngos-charities-social-impact",
    projectType: "Platform",
    visual: "giving",
    challenge: "Donations relied on offline channels with no recurring giving.",
    role: "UX, platform build and payment integration.",
    outcome: "A complete online and recurring donation journey.",
    overview: "A charity with strong community roots wanted supporters to be able to give online — once or every month.",
    background:
      "Most donations arrived through events and bank transfers, which made giving slow, hard to track and almost impossible to make recurring.",
    objectives: ["Make online giving simple and trustworthy", "Introduce monthly giving", "Give the team clear donation reporting"],
    approach: [
      "Mapped donor journeys and drop-off points with the fundraising team",
      "Designed a mobile-first giving flow with clear impact messaging",
      "Built and tested payment and receipt flows end to end",
    ],
    solutions: ["Donation website with campaign pages", "One-off and monthly giving", "Automated receipts and thank-you emails", "Donation reporting dashboard"],
    tools: ["UX/UI design", "Web platform", "Payment gateway", "Email automation"],
    results: ["Online and recurring giving available for the first time", "One place to see every donation", "Faster donor acknowledgement"],
    services: ["web-development", "marketing-communications"],
  },
  {
    slug: "operations-erp-manufacturing",
    title: "Operations ERP for a manufacturing group",
    client: "Manufacturing group",
    service: "Software",
    industry: "manufacturing-industrial",
    projectType: "System",
    visual: "erp",
    challenge: "Production, inventory and finance ran on disconnected sheets.",
    role: "Process mapping, custom ERP and BI dashboards.",
    outcome: "One system of record with live operational reporting.",
    overview: "A growing manufacturer needed its departments to work from the same numbers.",
    background:
      "Each department kept its own spreadsheets. Month-end reconciliation took days and managers lacked a live view of stock and production.",
    objectives: ["Connect production, inventory and finance", "Reduce manual reconciliation", "Give leadership live reporting"],
    approach: [
      "Mapped current processes and data flows with each department",
      "Designed modules around real workflows rather than generic templates",
      "Rolled out in phases with training for each team",
    ],
    solutions: ["Custom ERP modules", "Role-based access", "Inventory and production tracking", "BI dashboards for management"],
    tools: ["Workflow analysis", "Custom ERP", "BI reporting", "Systems integration"],
    results: ["A single system of record", "Less manual reconciliation", "Live operational visibility for managers"],
    services: ["software-solutions", "foundation-development"],
  },
  {
    slug: "health-awareness-campaign",
    title: "Awareness campaign for a health initiative",
    client: "Health initiative",
    service: "Marketing",
    industry: "healthcare-wellness",
    projectType: "Campaign",
    visual: "reach",
    challenge: "Low public awareness of a preventive programme.",
    role: "Campaign strategy, creative and paid media.",
    outcome: "An always-on awareness system across channels.",
    overview: "A preventive health programme needed to reach people before they needed treatment.",
    background: "The programme was effective but little known, and earlier communication had been sporadic and inconsistent.",
    objectives: ["Raise awareness among priority audiences", "Create consistent, credible messaging", "Build an always-on campaign rhythm"],
    approach: ["Audience research and message testing", "A campaign platform adaptable to each channel", "Paid media optimized against agreed KPIs"],
    solutions: ["Campaign identity and key messages", "Social and paid media plan", "Video and short-form content", "Monthly performance reporting"],
    tools: ["Social media", "Paid media", "Video production", "Analytics"],
    results: ["Consistent presence across channels", "Clear reporting against campaign KPIs", "A reusable campaign toolkit"],
    services: ["marketing-communications", "media-production"],
  },
  {
    slug: "market-entry-consumer-brand",
    title: "Market-entry study for a consumer brand",
    client: "Consumer brand",
    service: "Growth",
    industry: "retail-ecommerce-consumer",
    projectType: "Strategy",
    visual: "market",
    challenge: "Evaluating expansion into a new regional market.",
    role: "Market research, feasibility and entry roadmap.",
    outcome: "A go / no-go case with a phased expansion plan.",
    overview: "A consumer brand wanted to know whether — and how — to enter a new regional market.",
    background: "Leadership saw an opportunity but lacked reliable data on demand, competition and the right entry route.",
    objectives: ["Assess market demand and competition", "Evaluate entry options", "Produce an actionable expansion roadmap"],
    approach: ["Desk and field research", "Competitor and channel mapping", "Scenario-based feasibility assessment"],
    solutions: ["Market assessment report", "Entry-option comparison", "Go-to-market strategy", "Phased expansion roadmap"],
    tools: ["Market research", "Feasibility modelling", "Go-to-market planning"],
    results: ["A clear go / no-go recommendation", "A prioritized entry route", "A phased plan with KPIs"],
    services: ["market-intelligence", "market-entry", "growth-strategy"],
  },
  {
    slug: "annual-summit",
    title: "Annual summit — identity, stage and live coverage",
    client: "Corporate organizer",
    service: "Events",
    industry: "corporate-enterprise",
    projectType: "Event",
    visual: "event",
    challenge: "A flagship event needed one coherent experience.",
    role: "Event branding, stage design and social coverage.",
    outcome: "A unified on-ground and online event presence.",
    overview: "An annual flagship summit needed to feel like one experience from invitation to recap.",
    background: "Branding, stage, print and social had been handled by different suppliers, and the event felt fragmented.",
    objectives: ["Create one event identity", "Design a memorable stage experience", "Extend the event online in real time"],
    approach: ["One creative concept across all touchpoints", "Stage and booth design built from the identity", "A live coverage plan with fast turnaround"],
    solutions: ["Event identity", "Stage and backdrop design", "Print and on-ground materials", "Photography, video and live social coverage"],
    tools: ["Event branding", "Stage design", "Photography & video", "Social media"],
    results: ["A consistent experience on the ground", "Live content across social channels", "A post-event content library"],
    services: ["events-experiential", "media-production"],
  },
  {
    slug: "impact-documentary-series",
    title: "Impact documentary series",
    client: "Development NGO",
    service: "Media",
    industry: "ngos-charities-social-impact",
    projectType: "Content",
    visual: "story",
    challenge: "Field impact was hard to communicate to donors.",
    role: "Story development, filming and post-production.",
    outcome: "A reusable library of impact stories.",
    overview: "An NGO wanted donors to see the people and places behind its numbers.",
    background: "Reports were data-heavy and rarely read; the organization lacked visual stories that showed real change.",
    objectives: ["Show impact through real stories", "Create content usable across channels", "Support fundraising appeals"],
    approach: ["Story research with field teams", "Respectful, consent-led filming", "Edits for long-form, social and appeal use"],
    solutions: ["Documentary episodes", "Short-form reels", "Testimonial interviews", "Photography library"],
    tools: ["Documentary production", "Interviews", "Post-production", "Photography"],
    results: ["A library of impact stories", "Content ready for appeals and reports", "Stronger emotional connection with donors"],
    services: ["media-production", "marketing-communications"],
  },
];

export const caseBySlug = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug);
