// Service content, taken from the OP DEV website brief (sections 4.2 – 4.2.2).
// Kept as data so the pages can later be fed from the CMS without layout changes.

export type ServiceCategory = {
  id: string;
  short: string; // compact label for chips and the hero visual
  title: string;
  intro: string;
  items: string[];
};

export type ServiceLine = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  form: "service" | "business" | "contact";
  hub: string; // label at the centre of the hero visual
  categories: ServiceCategory[];
};

export const OUTSOURCING: ServiceLine = {
  slug: "outsourcing",
  eyebrow: "Outsourcing Services",
  title: "The Capabilities You Need. The Expertise to Deliver.",
  description:
    "OP DEV provides integrated outsourcing services that help businesses and organizations build strong foundations, strengthen their market presence, develop digital systems, and execute projects efficiently.",
  cta: "Request a Service",
  form: "service",
  hub: "OP",
  categories: [
    {
      id: "foundation-development",
      short: "Foundation",
      title: "Foundation Development",
      intro: "Business setup that gives your organization the structure, systems and plans to operate with clarity from day one.",
      items: [
        "Organizational Structure & Foundation",
        "Corporate Communication Systems",
        "Strategic Planning",
        "Digital Infrastructure Setup",
        "Process & Workflow Development",
      ],
    },
    {
      id: "marketing-communications",
      short: "Marketing",
      title: "Marketing & Communications",
      intro: "Strategy, brand and campaigns that build awareness, trust and demand — measured against clear objectives.",
      items: [
        "Marketing Strategy & Planning",
        "Brand Strategy & Identity Development",
        "Social Media Management",
        "Paid Media & Advertising",
        "Awareness & Advocacy Campaigns",
        "Content & Communication Strategy",
        "Email Marketing",
      ],
    },
    {
      id: "web-development",
      short: "Web",
      title: "Web Development",
      intro: "Websites and platforms designed to perform — fast, findable, and built around what your visitors need to do.",
      items: [
        "Website Design & Development",
        "Website Restructuring & Modernization",
        "UX/UI Design",
        "Donation & Fundraising Platforms",
        "Landing Page Development",
        "Technical SEO & Website Optimization",
      ],
    },
    {
      id: "software-solutions",
      short: "Software",
      title: "Software Solutions",
      intro: "Custom systems that connect your operations, automate the routine and turn data into decisions.",
      items: [
        "Custom CRM Systems",
        "Custom ERP Solutions",
        "Mobile App",
        "Workflow & Process Management Systems",
        "Dashboards & Business Intelligence Reporting",
        "Systems Integration & Automation",
        "Client-Specific Software Development",
      ],
    },
    {
      id: "media-production",
      short: "Media",
      title: "Media & Production",
      intro: "Stories told on camera and in sound — from brand films to the impact stories that move audiences to act.",
      items: [
        "Documentary & Brand Storytelling",
        "Campaign Video Production",
        "Reels & Short-Form Video",
        "Impact Stories & Case Narratives",
        "Testimonials & Interview Production",
        "Photography & Videography",
        "Voice-over & Audio Production",
      ],
    },
    {
      id: "events-experiential",
      short: "Events",
      title: "Events & Experiential Solutions",
      intro: "Events planned, branded and covered end to end, so every touchpoint on the ground and online feels like one experience.",
      items: [
        "Event Planning",
        "Event Branding & Visual Identity",
        "Booth & Exhibition Design",
        "Stage & Backdrop Design",
        "Print & On-ground Brand Materials",
        "Event Presentations",
        "Event Photography & Videography",
        "Social Media Event Coverage",
        "Tailored Event Solutions",
      ],
    },
  ],
};

export const GROWTH: ServiceLine = {
  slug: "investment-business-growth",
  eyebrow: "Investment & Business Growth",
  title: "Identify Opportunities. Build Growth.",
  description:
    "OP DEV helps businesses assess market potential, identify new opportunities, develop strategic partnerships, and create actionable plans for sustainable growth and expansion.",
  cta: "Discuss Your Growth Opportunities",
  form: "business",
  hub: "Growth",
  categories: [
    {
      id: "market-intelligence",
      short: "Intelligence",
      title: "Market Intelligence & Opportunity Assessment",
      intro: "Evidence before investment: understand the market, the competition and the real size of the opportunity.",
      items: [
        "Market Research & Industry Analysis",
        "Market Demand & Competitive Analysis",
        "Business Opportunity Identification",
        "Feasibility Studies & Opportunity Evaluation",
        "Market Potential Assessment",
        "Risk & Growth Potential Analysis",
      ],
    },
    {
      id: "business-development",
      short: "Biz Dev",
      title: "Business Development",
      intro: "Models, channels and accounts developed to turn strategy into revenue.",
      items: [
        "Business Development Strategy",
        "Business Model Development & Optimization",
        "Revenue Growth Strategy",
        "Client & Market Development",
        "Sales Channel Development",
        "Strategic Account Development",
      ],
    },
    {
      id: "investment-opportunities",
      short: "Investment",
      title: "Investment Opportunity Development",
      intro: "From identifying opportunities to presenting an investment-ready case.",
      items: [
        "Investment Opportunity Identification",
        "Investment Landscape Research",
        "Opportunity Screening & Assessment",
        "Business Case Development",
        "Investment Proposal Preparation",
        "Partnership & Investment Readiness",
      ],
    },
    {
      id: "market-entry",
      short: "Market Entry",
      title: "Market Entry & Expansion",
      intro: "Where to go next, how to enter, and how to position once you are there.",
      items: [
        "Market Entry Strategy",
        "Geographic Expansion Planning",
        "New Market & Segment Development",
        "Go-to-Market Strategy",
        "Market Positioning & Localization",
        "Expansion Roadmaps",
      ],
    },
    {
      id: "strategic-partnerships",
      short: "Partnerships",
      title: "Strategic Partnerships",
      intro: "The right partners, mapped, assessed and brought together around shared value.",
      items: [
        "Strategic Partner Identification",
        "Partnership Opportunity Assessment",
        "Stakeholder & Ecosystem Mapping",
        "Partnership Strategy Development",
        "Business Collaboration Models",
        "Partnership Development & Coordination",
      ],
    },
    {
      id: "growth-strategy",
      short: "Strategy",
      title: "Growth Strategy & Business Planning",
      intro: "Roadmaps and KPIs that make growth deliberate rather than accidental.",
      items: [
        "Corporate Growth Strategy",
        "Business Planning & Strategic Roadmaps",
        "Organizational Growth Planning",
        "New Business Development",
        "Service & Product Expansion Strategy",
        "Performance Objectives & Growth KPIs",
      ],
    },
    {
      id: "business-advisory",
      short: "Advisory",
      title: "Business Advisory & Growth Consulting",
      intro: "An outside view on performance, gaps and the actions that move the business forward.",
      items: [
        "Business Performance Assessment",
        "Operational & Commercial Improvement",
        "Business Structure & Capability Assessment",
        "Growth Challenges & Gap Analysis",
        "Strategic Recommendations & Action Plans",
        "Implementation Planning & Progress Monitoring",
      ],
    },
  ],
};

export const SERVICE_LINES = [OUTSOURCING, GROWTH];

// Find a category (and the service line it belongs to) by id.
export function categoryById(id: string) {
  for (const line of SERVICE_LINES) {
    const category = line.categories.find((c) => c.id === id);
    if (category) return { line, category };
  }
  return undefined;
}

// The contact page reuses the inquiry form with broader areas of interest (brief 4.8),
// including a dedicated option for market opportunities, expansion and partnerships.
export const CONTACT_LINE: ServiceLine = {
  slug: "contact",
  eyebrow: "Contact",
  title: "",
  description: "",
  cta: "",
  form: "contact",
  hub: "OP",
  categories: [
    { id: "outsourcing", short: "Outsourcing", title: "Outsourcing Services", intro: "", items: OUTSOURCING.categories.map((c) => c.title) },
    {
      id: "growth",
      short: "Growth",
      title: "Investment & Business Growth",
      intro: "",
      items: ["Market opportunities", "Market entry & expansion", "Strategic partnerships", "Investment readiness", "Growth strategy"],
    },
    { id: "general", short: "General", title: "Not sure yet / general inquiry", intro: "", items: [] },
  ],
};
