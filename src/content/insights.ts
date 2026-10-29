import type { VisualConfig, WorkKind } from "@/components/WorkVisual";

// Insights & Resources, per brief section 4.6. Articles are first drafts written
// for decision-makers — practical, not promotional — and should be reviewed by
// the OP DEV team before launch. Kept as data so they can move to the CMS as-is.

export const CATEGORIES = [
  "Business Strategy & Growth",
  "Marketing & Communications",
  "Digital Transformation",
  "Web & Software Development",
  "Systems, Automation & Operational Efficiency",
  "Media & Creative Insights",
  "Events & Brand Experiences",
  "Market Intelligence & Industry Perspectives",
  "Practical Guides & Frameworks",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Format = "Article" | "Guide" | "Checklist" | "Framework" | "Industry perspective" | "Expert commentary";

export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string };

export type Post = {
  slug: string;
  title: string;
  dek: string; // one-sentence summary
  category: Category;
  format: Format;
  minutes: number;
  visual: { kind: WorkKind; config?: VisualConfig };
  takeaways: string[];
  body: Block[];
};

export const AUTHOR = "OP DEV Team";

export const POSTS: Post[] = [
  {
    slug: "outsource-or-build-in-house",
    title: "Outsource or build in-house? A decision framework for growing organizations",
    dek: "A simple way to decide which capabilities to own, which to partner on, and which to hand over entirely.",
    category: "Business Strategy & Growth",
    format: "Guide",
    minutes: 7,
    visual: { kind: "decide" },
    takeaways: [
      "Decide per capability, not for the whole organization at once.",
      "Two questions do most of the work: how strategic is it, and how strong are you at it today?",
      "Revisit the decision as you grow — today's outsourced function can be tomorrow's in-house team.",
    ],
    body: [
      { type: "p", text: "Every growing organization hits the same question sooner or later: should we hire for this, or bring in a partner? Answered capability by capability, it becomes much easier — and much less emotional." },
      { type: "h2", text: "Two questions that do most of the work" },
      { type: "p", text: "For each capability — marketing, software, events, finance operations — ask two things. How strategically important is it to how you win? And how strong is your in-house capability today?" },
      { type: "list", items: ["High importance, strong capability: build and invest in-house.", "High importance, weak capability: partner while you build — or for good.", "Low importance, weak capability: outsource fully and focus elsewhere.", "Low importance, strong capability: consider a hybrid that frees your people for higher-value work."] },
      { type: "h2", text: "Look at the hidden costs on both sides" },
      { type: "p", text: "In-house teams carry hiring time, management attention, training and tools. Outsourcing carries onboarding, coordination and the risk of misalignment. Compare total cost and time-to-impact, not salaries against invoices." },
      { type: "h2", text: "Make outsourcing work like an in-house team" },
      { type: "list", items: ["Agree objectives and KPIs before work starts.", "Name one owner on each side.", "Share context generously — strategy, audiences, constraints.", "Review results on a fixed rhythm, not only when something goes wrong."] },
      { type: "quote", text: "The best outsourcing relationships feel less like buying a service and more like adding a team." },
      { type: "h2", text: "Revisit as you grow" },
      { type: "p", text: "The right answer changes with scale. Many organizations outsource a capability to move fast, then bring parts of it in-house once they understand it well — keeping a partner for peaks and specialist work." },
    ],
  },
  {
    slug: "what-a-crm-should-do-for-an-ngo",
    title: "What a CRM should actually do for an NGO",
    dek: "Beyond a contact list: how the right system supports every stage of the donor journey.",
    category: "Digital Transformation",
    format: "Article",
    minutes: 5,
    visual: { kind: "crm" },
    takeaways: [
      "Design the CRM around the donor journey, not around your departments.",
      "Automate acknowledgement — speed of thanks drives repeat giving.",
      "Reporting for donors and boards should take minutes, not days.",
    ],
    body: [
      { type: "p", text: "Many NGOs buy a CRM and end up with an expensive address book. The difference between the two is whether the system is built around how supporters actually move from first contact to lifelong advocate." },
      { type: "h2", text: "Start from the donor journey" },
      { type: "list", ordered: true, items: ["Visitor — capture interest and segment by cause or campaign.", "First gift — instant receipt and a genuine thank-you.", "Monthly donor — retention journeys and impact updates.", "Advocate — tools to fundraise and spread the word for you."] },
      { type: "h2", text: "Automate the moments that matter" },
      { type: "p", text: "The time between a first gift and the first thank-you is one of the strongest predictors of a second gift. Receipts, welcome sequences and anniversary messages should run automatically, so your team's time goes to relationships." },
      { type: "h2", text: "Connect programmes to fundraising" },
      { type: "p", text: "When project data lives in the same system — or is connected to it — impact reporting stops being a quarterly scramble. Donors see results, and boards get consistent numbers." },
      { type: "h2", text: "Keep it simple enough to be used" },
      { type: "p", text: "A CRM only works if the team uses it every day. Start with the few workflows that matter most, train properly, and add complexity only when the basics are habits." },
    ],
  },
  {
    slug: "entering-a-new-market-seven-questions",
    title: "Entering a new market: seven questions to answer first",
    dek: "Before you invest in expansion, make sure you can answer these with evidence rather than optimism.",
    category: "Market Intelligence & Industry Perspectives",
    format: "Framework",
    minutes: 8,
    visual: { kind: "checklist" },
    takeaways: [
      "Demand and competition come first — everything else depends on them.",
      "Regulation and channels are where expansions most often stall.",
      "Decide your exit criteria before you enter.",
    ],
    body: [
      { type: "p", text: "Expansion is one of the most expensive decisions a business makes, and one of the hardest to reverse. These seven questions turn a promising idea into a decision you can defend." },
      { type: "h2", text: "The seven questions" },
      { type: "list", ordered: true, items: ["Demand — is there real, reachable demand for what you offer?", "Competition — who already serves it, and why would customers switch?", "Regulation — what licences, rules or restrictions apply?", "Pricing — can you price competitively and still make a margin?", "Channels — how will you reach and serve customers there?", "Partners — who could accelerate entry or reduce risk?", "Risk — what could go wrong, and what would make you stop?"] },
      { type: "h2", text: "Evidence over enthusiasm" },
      { type: "p", text: "Desk research, customer conversations, competitor mapping and small pilots each answer different questions. Combine them before committing large budgets." },
      { type: "h2", text: "Phase the entry" },
      { type: "p", text: "A phased roadmap — test, establish, scale — lets you learn cheaply, keep options open and tie each investment to a milestone." },
      { type: "quote", text: "Agree what would make you stop before you start. It is much harder to decide once money is spent." },
    ],
  },
  {
    slug: "awareness-campaigns-that-move-people",
    title: "Awareness campaigns that actually move people",
    dek: "Why most awareness campaigns fade — and the five ingredients of the ones that change behaviour.",
    category: "Marketing & Communications",
    format: "Guide",
    minutes: 6,
    visual: { kind: "channels" },
    takeaways: [
      "Awareness is a means; define the behaviour you want to change.",
      "One clear message, repeated consistently, beats many clever ones.",
      "Always-on beats one-off bursts.",
    ],
    body: [
      { type: "p", text: "Awareness campaigns are easy to launch and hard to make matter. The ones that work share a handful of ingredients." },
      { type: "h2", text: "Five ingredients" },
      { type: "list", ordered: true, items: ["A specific audience — not 'the public'.", "One behaviour you want them to adopt.", "A single, memorable message.", "Credible messengers the audience already trusts.", "Consistency over time across every channel."] },
      { type: "h2", text: "Measure what matters" },
      { type: "p", text: "Reach and impressions show that people saw something. Track the step after that too — visits, sign-ups, enquiries or reported behaviour — so you know whether the campaign is doing its real job." },
      { type: "h2", text: "Build a system, not a moment" },
      { type: "p", text: "A campaign toolkit — key messages, visual identity, content formats and a publishing rhythm — keeps the message alive long after launch week." },
    ],
  },
  {
    slug: "automate-before-you-hire",
    title: "Automate before you hire: finding the hidden capacity in your operations",
    dek: "Many teams are short of time, not people. Here is how to find the work a system should be doing.",
    category: "Systems, Automation & Operational Efficiency",
    format: "Article",
    minutes: 6,
    visual: { kind: "workflow" },
    takeaways: [
      "Map the work before choosing the tool.",
      "Repetitive, rule-based tasks are the first candidates.",
      "Connect systems so data is entered once.",
    ],
    body: [
      { type: "p", text: "When a team is overloaded, the instinct is to hire. Often the faster, cheaper answer is to remove the work that shouldn't need a person at all." },
      { type: "h2", text: "Map the work first" },
      { type: "p", text: "List the recurring tasks in a process, who does them, how long they take and where information is re-typed. The bottlenecks usually become obvious within a day." },
      { type: "h2", text: "What to automate first" },
      { type: "list", items: ["Data entered in more than one place.", "Approvals that wait on email threads.", "Reports assembled by hand every week or month.", "Follow-ups and reminders that depend on memory."] },
      { type: "h2", text: "Connect, don't just digitize" },
      { type: "p", text: "Digitizing a broken process makes it faster but not better. Integrating systems — so a sale updates inventory, invoicing and reporting at once — is where the real capacity appears." },
      { type: "h2", text: "Then decide on headcount" },
      { type: "p", text: "Once the routine is automated, you can see what genuinely needs more people — and hire for judgement, not for copy-and-paste." },
    ],
  },
  {
    slug: "events-that-outlive-the-day",
    title: "Events that outlive the day: a checklist for lasting impact",
    dek: "Plan the content, follow-up and measurement before the doors open.",
    category: "Events & Brand Experiences",
    format: "Checklist",
    minutes: 4,
    visual: { kind: "timeline" },
    takeaways: [
      "Decide what the event should change before deciding how it looks.",
      "Plan the content capture as carefully as the stage.",
      "Follow up within days, not weeks.",
    ],
    body: [
      { type: "p", text: "An event is a big investment for a few hours. These steps make sure its value lasts for months." },
      { type: "h2", text: "Before" },
      { type: "list", items: ["Define the objective and how you'll measure it.", "Create one identity used across invitations, stage, print and social.", "Plan the content you want to capture — talks, interviews, moments."] },
      { type: "h2", text: "During" },
      { type: "list", items: ["Cover the event live for people who aren't in the room.", "Capture short interviews and testimonials on site.", "Make it easy for attendees to share and connect."] },
      { type: "h2", text: "After" },
      { type: "list", items: ["Send a recap and next steps within days.", "Turn talks into articles, reels and presentations.", "Review results against the objective you set."] },
    ],
  },
  {
    slug: "impact-stories-donors-remember",
    title: "Impact stories donors remember",
    dek: "How to turn field results into stories that are honest, respectful and moving.",
    category: "Media & Creative Insights",
    format: "Expert commentary",
    minutes: 5,
    visual: { kind: "portrait" },
    takeaways: [
      "One person's story is more memorable than any statistic — use both together.",
      "Consent and dignity come before the shot.",
      "Film once, edit for many channels.",
    ],
    body: [
      { type: "p", text: "Numbers prove impact; stories make people feel it. The strongest communication pairs one human story with the evidence behind it." },
      { type: "h2", text: "Find the right story" },
      { type: "p", text: "Work with field teams to find stories that represent the programme fairly — not only the most dramatic ones. Change over time is often more powerful than a single moment." },
      { type: "h2", text: "Respect comes first" },
      { type: "list", items: ["Informed consent from everyone featured.", "Let people tell their own story in their own words.", "Avoid images that reduce people to their circumstances."] },
      { type: "h2", text: "Plan for every channel" },
      { type: "p", text: "A single shoot can produce a documentary, short reels, appeal videos, quotes and photography — if the edit plan exists before filming starts." },
    ],
  },
  {
    slug: "restructure-or-rebuild-your-website",
    title: "Restructure or rebuild? How to decide what your website needs",
    dek: "Not every underperforming website needs to start again. Here is how to tell.",
    category: "Web & Software Development",
    format: "Guide",
    minutes: 6,
    visual: { kind: "wireframe" },
    takeaways: [
      "Diagnose before you redesign — data first, opinions second.",
      "Structure and content problems can often be fixed without a rebuild.",
      "Rebuild when the platform itself blocks what the business needs.",
    ],
    body: [
      { type: "p", text: "A website that isn't working is frustrating, and starting over is tempting. Sometimes it's right; often a focused restructure delivers more, sooner." },
      { type: "h2", text: "Signs a restructure is enough" },
      { type: "list", items: ["Visitors arrive but can't find what they need.", "Key pages lack clear calls to action.", "Content is outdated but the design still works.", "Search visibility suffers from fixable technical issues."] },
      { type: "h2", text: "Signs you need a rebuild" },
      { type: "list", items: ["The platform is slow, insecure or hard to update.", "You can't add the features the business now needs.", "The brand has changed and the site no longer reflects it."] },
      { type: "h2", text: "Either way, start with the journey" },
      { type: "p", text: "Map what visitors come to do and what you want them to do next. Design every page around that path — it is the difference between a site that looks good and one that performs." },
    ],
  },
  {
    slug: "kpis-that-mean-something",
    title: "A five-step framework for KPIs that mean something",
    dek: "Turn vague goals into a handful of measures your team can actually steer by.",
    category: "Practical Guides & Frameworks",
    format: "Framework",
    minutes: 4,
    visual: { kind: "kpis" },
    takeaways: [
      "Fewer KPIs, clearly owned, beat long dashboards nobody reads.",
      "No baseline, no target — measure where you are first.",
      "Every KPI needs a named owner and a review rhythm.",
    ],
    body: [
      { type: "p", text: "Most organizations measure plenty and steer by little. This framework turns objectives into a short list of KPIs that drive decisions." },
      { type: "h2", text: "The five steps" },
      { type: "list", ordered: true, items: ["Objective — what outcome are you trying to achieve?", "Metric — which number best shows progress toward it?", "Baseline — where are you today?", "Target — where should you be, and by when?", "Owner — who is accountable for moving it?"] },
      { type: "h2", text: "Keep the list short" },
      { type: "p", text: "Three to five KPIs per objective is usually enough. If a number wouldn't change a decision, it belongs in a report, not on the KPI list." },
      { type: "h2", text: "Review on a rhythm" },
      { type: "p", text: "Monthly reviews with the owners present turn KPIs from a reporting exercise into a management tool." },
    ],
  },
];

export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug);

// Stable anchor ids for article headings (used by the table of contents).
export const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
