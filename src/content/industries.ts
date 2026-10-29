import type { VisualConfig, WorkKind } from "@/components/WorkVisual";

// Industry pages, per brief section 4.4. Each page: overview & challenges,
// relevant services, tailored applications, case studies, outcomes, CTA.

export type Industry = {
  slug: string;
  name: string;
  line: string; // one-line summary used in lists
  tags: string[];
  overview: string;
  challenges: string[];
  services: string[]; // service category ids (see content/services.ts)
  applications: { title: string; body: string }[];
  outcomes: string[];
  visual: { kind: WorkKind; config?: VisualConfig };
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "corporate-enterprise",
    name: "Corporate & Enterprise",
    line: "Structure, systems and communication for organizations operating at scale.",
    tags: ["ERP", "Corporate Comms", "Process"],
    overview:
      "Large organizations need structure that scales, systems that talk to each other, and communication that keeps every department aligned with strategy.",
    challenges: [
      "Disconnected departments and tools that slow decisions down",
      "Internal and external communication that doesn't speak with one voice",
      "Strategy that is hard to translate into measurable execution",
    ],
    services: ["foundation-development", "software-solutions", "marketing-communications", "growth-strategy", "business-advisory"],
    applications: [
      { title: "Connected operations", body: "Custom ERP, workflow systems and BI dashboards that give leadership one view of the business." },
      { title: "Corporate communication systems", body: "Brand, internal comms and stakeholder messaging aligned under one framework." },
      { title: "Strategy to execution", body: "Roadmaps, KPIs and progress monitoring that keep initiatives on track." },
    ],
    outcomes: ["Faster, better-informed decisions", "Consistent brand and communication", "Clear KPIs tied to strategy"],
    visual: { kind: "orgchart" },
  },
  {
    slug: "startups-technology",
    name: "Startups & Technology",
    line: "From foundations to go-to-market — built to move fast without breaking.",
    tags: ["Brand", "Product", "Go-to-Market"],
    overview:
      "Startups have to build foundations, launch products and find traction at the same time — usually with a small team. OP DEV supplies the capabilities you don't have in-house yet.",
    challenges: [
      "Building brand, product and operations in parallel with limited resources",
      "Getting a credible go-to-market in front of customers and investors",
      "Scaling processes before they break",
    ],
    services: ["foundation-development", "web-development", "software-solutions", "marketing-communications", "investment-opportunities"],
    applications: [
      { title: "Launch-ready foundations", body: "Brand identity, structure and digital infrastructure set up properly from the start." },
      { title: "Product & platform build", body: "Websites, apps and MVPs designed and developed to validate fast." },
      { title: "Investment readiness", body: "Business cases and proposals that make your opportunity clear to investors and partners." },
    ],
    outcomes: ["A faster, more credible launch", "Foundations that scale with growth", "Investor-ready materials"],
    visual: { kind: "launch" },
  },
  {
    slug: "ngos-charities-social-impact",
    name: "NGOs, Charities & Social Impact",
    line: "Donation platforms, advocacy campaigns, impact storytelling and reporting systems.",
    tags: ["Fundraising", "Advocacy", "Impact Stories"],
    overview:
      "Social-impact organizations need to raise funds, mobilize supporters and prove impact — often with lean teams. OP DEV builds the platforms, campaigns, stories and systems that make that work sustainable.",
    challenges: [
      "Donations that depend on offline channels and one-off giving",
      "Impact that happens in the field but is hard to show donors",
      "Project data and reporting scattered across spreadsheets",
    ],
    services: ["web-development", "marketing-communications", "media-production", "software-solutions", "events-experiential"],
    applications: [
      { title: "Donation & fundraising platforms", body: "Online and recurring giving journeys built for trust and conversion." },
      { title: "Awareness & advocacy campaigns", body: "Campaigns that mobilize supporters and move audiences to act." },
      { title: "Impact storytelling", body: "Documentaries, impact stories and testimonials that make results tangible for donors." },
      { title: "Project systems & reporting", body: "Project-related digital systems and dashboards that make donor and board reporting simple." },
    ],
    outcomes: ["More recurring and online giving", "Stronger donor trust through visible impact", "Faster, cleaner reporting"],
    visual: { kind: "impact" },
  },
  {
    slug: "healthcare-wellness",
    name: "Healthcare & Wellness",
    line: "Trusted communication and digital journeys for patients and providers.",
    tags: ["Awareness", "Web", "CRM"],
    overview:
      "In healthcare, trust is everything. Patients need clear information and easy journeys; providers need systems that let them focus on care.",
    challenges: [
      "Communicating sensitive topics clearly and credibly",
      "Patient journeys that are fragmented across channels",
      "Awareness programmes that struggle to reach the right audience",
    ],
    services: ["marketing-communications", "web-development", "software-solutions", "media-production"],
    applications: [
      { title: "Health awareness campaigns", body: "Campaigns that reach the right audiences with credible, accessible messages." },
      { title: "Patient-friendly digital journeys", body: "Websites and booking flows that make finding and accessing care easy." },
      { title: "CRM for providers", body: "Patient relationship and follow-up systems tailored to clinical operations." },
    ],
    outcomes: ["Greater reach for health programmes", "Smoother patient journeys", "More time for care, less for admin"],
    visual: { kind: "pulse" },
  },
  {
    slug: "education-training",
    name: "Education & Training",
    line: "Platforms, content and campaigns that grow enrolment and engagement.",
    tags: ["Platforms", "Content", "Events"],
    overview:
      "Schools, universities and training providers compete for attention and enrolments. OP DEV helps them reach the right learners and keep them engaged from enquiry to alumni.",
    challenges: [
      "Standing out in a crowded education market",
      "Converting enquiries into enrolments",
      "Keeping learners and alumni engaged",
    ],
    services: ["marketing-communications", "web-development", "software-solutions", "events-experiential", "media-production"],
    applications: [
      { title: "Enrolment campaigns", body: "Content and paid media that reach prospective learners at the right moment." },
      { title: "Learning & admissions platforms", body: "Websites, online applications and portals that make enrolment simple." },
      { title: "Open days & events", body: "Events planned, branded and covered end to end." },
    ],
    outcomes: ["More qualified enquiries", "Higher enquiry-to-enrolment conversion", "Stronger alumni community"],
    visual: { kind: "learning" },
  },
  {
    slug: "manufacturing-industrial",
    name: "Manufacturing & Industrial",
    line: "Operational systems, dashboards and B2B growth for industrial players.",
    tags: ["ERP", "BI Dashboards", "B2B"],
    overview:
      "Manufacturers win on efficiency and reliability. OP DEV connects operations through systems and data, and helps industrial companies grow their B2B markets.",
    challenges: [
      "Production, inventory and finance running on disconnected tools",
      "Limited real-time visibility for decision-makers",
      "B2B growth that relies on a handful of relationships",
    ],
    services: ["software-solutions", "foundation-development", "business-development", "market-entry"],
    applications: [
      { title: "Custom ERP & workflows", body: "One system of record for supply, production, quality and dispatch." },
      { title: "BI dashboards", body: "Live operational reporting for managers and leadership." },
      { title: "B2B market development", body: "Channel, account and market-entry strategies for industrial products." },
    ],
    outcomes: ["Operational visibility in real time", "Less manual work and error", "New B2B channels and markets"],
    visual: { kind: "factory" },
  },
  {
    slug: "retail-ecommerce-consumer",
    name: "Retail, E-commerce & Consumer Brands",
    line: "Brands, storefronts and campaigns engineered to convert.",
    tags: ["E-commerce", "Paid Media", "Brand"],
    overview:
      "Consumer brands live and die by attention and conversion. OP DEV builds the brand, the storefront and the customer journey that turns browsers into loyal buyers.",
    challenges: [
      "Rising acquisition costs across paid channels",
      "Drop-off between browsing, cart and checkout",
      "Turning first-time buyers into repeat customers",
    ],
    services: ["marketing-communications", "web-development", "software-solutions", "media-production", "market-entry"],
    applications: [
      { title: "Performance campaigns", body: "Paid media and content built around measurable conversion goals." },
      { title: "E-commerce experiences", body: "Fast storefronts and checkouts designed to convert." },
      { title: "Loyalty & CRM", body: "Retention journeys that bring customers back." },
    ],
    outcomes: ["Lower cost per acquisition", "Higher conversion rates", "More repeat purchases"],
    visual: { kind: "store" },
  },
  {
    slug: "real-estate-construction",
    name: "Real Estate & Construction",
    line: "Launch campaigns, sales tools and market-entry strategy for developments.",
    tags: ["Launches", "Sales CRM", "Market Entry"],
    overview:
      "Developments are sold long before they are built. OP DEV supports developers with launch campaigns, sales systems and the market intelligence behind where to build next.",
    challenges: [
      "Launching projects into competitive markets",
      "Managing leads from many channels through to sale",
      "Choosing the right locations and segments for new projects",
    ],
    services: ["marketing-communications", "software-solutions", "media-production", "market-intelligence", "market-entry"],
    applications: [
      { title: "Project launches", body: "Branding, campaigns and launch events for new developments." },
      { title: "Sales CRM", body: "Lead management and follow-up systems for sales teams." },
      { title: "Market & feasibility studies", body: "Research and feasibility assessments for new locations and segments." },
    ],
    outcomes: ["Stronger launch momentum", "No lead left behind", "Better-informed investment decisions"],
    visual: { kind: "skyline" },
  },
  {
    slug: "hospitality-food-lifestyle",
    name: "Hospitality, Food & Lifestyle",
    line: "Experiences, content and digital presence that fill rooms and tables.",
    tags: ["Content", "Events", "Social"],
    overview:
      "Hospitality brands sell experiences. OP DEV helps them show those experiences beautifully, fill venues, and keep guests coming back.",
    challenges: [
      "Standing out visually in feeds and booking platforms",
      "Seasonality and filling quieter periods",
      "Turning one-time guests into regulars",
    ],
    services: ["media-production", "marketing-communications", "events-experiential", "web-development"],
    applications: [
      { title: "Content & social", body: "Photography, video and social management that make the experience tangible." },
      { title: "Openings & events", body: "Launches and events planned, branded and covered." },
      { title: "Direct booking journeys", body: "Websites that drive bookings without relying only on third parties." },
    ],
    outcomes: ["More direct bookings", "Busier off-peak periods", "A recognizable brand experience"],
    visual: { kind: "tables" },
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    line: "Positioning, thought leadership and lead-generation systems.",
    tags: ["Positioning", "Insights", "Lead Gen"],
    overview:
      "Consultancies, law and accounting firms sell expertise. OP DEV helps them become known for what they do best — and turn that reputation into a steady flow of qualified leads.",
    challenges: [
      "Expertise that is invisible to the market",
      "Growth that depends on referrals alone",
      "Websites that don't generate enquiries",
    ],
    services: ["marketing-communications", "web-development", "software-solutions", "business-development"],
    applications: [
      { title: "Positioning & brand", body: "Clear positioning that differentiates your firm." },
      { title: "Thought leadership", body: "Insights, guides and content that build authority." },
      { title: "Lead-generation systems", body: "Websites, landing pages and CRM that turn interest into meetings." },
    ],
    outcomes: ["A clearer market position", "More inbound, qualified leads", "Less dependence on referrals"],
    visual: { kind: "authority" },
  },
  {
    slug: "entertainment-travel-tourism",
    name: "Entertainment, Travel & Tourism",
    line: "Destination storytelling, events and campaigns that travel.",
    tags: ["Media", "Events", "Campaigns"],
    overview:
      "Destinations, attractions and entertainment brands compete for imagination. OP DEV creates the stories, events and campaigns that make people want to go.",
    challenges: [
      "Capturing attention in a visual, global market",
      "Reaching travellers across many markets and languages",
      "Turning events into lasting audience growth",
    ],
    services: ["media-production", "marketing-communications", "events-experiential", "market-entry"],
    applications: [
      { title: "Destination storytelling", body: "Documentaries, campaign films and reels that sell the experience." },
      { title: "Multi-market campaigns", body: "Campaigns localized for the markets you want to reach." },
      { title: "Events & activations", body: "Experiences on the ground amplified online." },
    ],
    outcomes: ["Stronger destination appeal", "Reach in new source markets", "Events that grow audiences"],
    visual: { kind: "globe" },
  },
];

export const industryBySlug = (slug: string) => INDUSTRIES.find((i) => i.slug === slug);
