"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { ServiceLine } from "@/content/services";
import { industryBySlug } from "@/content/industries";

// Copy and fields follow the brief: "Service Request Form" (4.2.1) and
// "Business Inquiry Form" (4.2.2).
const COPY = {
  service: {
    heading: ["Let's Discuss", "Your Project"],
    body: "Tell us what you need, and our team will get in touch to understand your requirements and explore the right solution for your organization.",
    submit: "Submit Service Request",
    categoryLabel: "Service division",
    itemsLabel: "Services required",
    detailsLabel: "Project overview",
    detailsHint: "Goals, scope, timeline — whatever helps us understand the project.",
  },
  business: {
    heading: ["Let's Explore Your", "Next Opportunity"],
    body: "Tell us about your business, your objectives, or the opportunity you're exploring. Our team will review your inquiry and contact you to discuss potential next steps.",
    submit: "Submit Business Inquiry",
    categoryLabel: "Area of interest",
    itemsLabel: "Specific services (optional)",
    detailsLabel: "Business challenge or opportunity",
    detailsHint: "What you're trying to achieve, and where you are today.",
  },
  contact: {
    heading: ["Schedule a", "Consultation"],
    body: "Tell us a little about your organization and what you need. We'll route your request to the right team and get back to you.",
    submit: "Schedule a Consultation",
    categoryLabel: "Area of interest",
    itemsLabel: "Topics (optional)",
    detailsLabel: "Brief description of your requirements",
    detailsHint: "What you need, what you're aiming for, and any timing.",
  },
} as const;

const ORG_TYPES = ["Corporate", "Startup", "NGO / Charity", "Government", "Other"];

const BUDGETS = ["Under $5k", "$5k – $15k", "$15k – $50k", "$50k+", "Not sure yet"];
const STAGES = ["Idea", "Early stage", "Growing", "Established", "Expanding"];
const CONTACT = ["Email", "Phone", "WhatsApp"];

type Status = "idle" | "sending" | "sent" | "error";

function Chip({
  active,
  onClick,
  children,
  multi = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-300 ${
        active ? "border-brand bg-brand text-white" : "border-paper/15 text-paper/75 hover:border-paper/50 hover:text-paper"
      }`}
    >
      {multi && <span className="mr-1.5 inline-block w-3">{active ? "✓" : "+"}</span>}
      {children}
    </button>
  );
}

function Field({ label, error, children, wide = false }: { label: string; error?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="eyebrow text-[11px] text-paper/50">{label}</span>
      {children}
      {error && <span className="mt-2 block text-[12px] text-[#ff8a8a]">{error}</span>}
    </label>
  );
}

const inputCls =
  "mt-2 w-full border-b border-paper/20 bg-transparent py-3 text-[17px] text-paper outline-none transition-colors placeholder:text-paper/25 focus:border-brand";

export default function InquiryForm({ line }: { line: ServiceLine }) {
  const copy = COPY[line.form];
  const root = useRef<HTMLElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [items, setItems] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [contact, setContact] = useState("Email");
  const [orgType, setOrgType] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [industry, setIndustry] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  const selected = line.categories.find((c) => c.id === category);

  // Industry pages link here with ?industry=<slug>; prefill the sector name.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("industry");
    if (slug) setIndustry(industryBySlug(slug)?.name ?? "");
  }, []);

  // Preselect from "Request this service" buttons elsewhere on the page.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const { id, item } = (e as CustomEvent<{ id: string; item?: string }>).detail;
      setCategory(id);
      setItems(item ? [item] : []);
    };
    window.addEventListener("op:select-category", onSelect);
    return () => window.removeEventListener("op:select-category", onSelect);
  }, []);

  // The sub-services list grows open when a division is chosen.
  useEffect(() => {
    const el = itemsRef.current;
    if (!el || !selected) return;
    gsap.fromTo(el, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.6, ease: "expo.out" });
    gsap.fromTo(el.querySelectorAll("button"), { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.03, ease: "expo.out" });
  }, [selected]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-rise]", {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const toggleItem = (item: string) =>
    setItems((list) => (list.includes(item) ? list.filter((i) => i !== item) : [...list, item]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "")) next.email = "Please enter a valid business email.";
    if (!data.company?.trim()) next.company = "Please enter your company or organization.";
    if (!category) next.category = `Please choose a ${copy.categoryLabel.toLowerCase()}.`;
    if (!data.details?.trim()) next.details = "A short description helps us prepare.";
    if (line.form === "contact" && !consent) next.consent = "Please confirm we may contact you.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: line.form,
          line: line.slug,
          ...data,
          category: selected?.title,
          services: items,
          budget,
          stage,
          contact,
          orgType,
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section ref={root} id="request" className="relative z-10 scroll-mt-24 bg-paper px-2 pb-2 md:px-4 md:pb-4">
      <div className="relative overflow-clip rounded-[2rem] bg-ink px-5 py-20 text-paper md:rounded-[3rem] md:px-12 md:py-28">
        <div className="pointer-events-none absolute -right-32 top-0 h-[30rem] w-[30rem] rounded-full bg-brand/20 blur-[130px]" />

        <div className="relative grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-paper/45">
              {line.form === "service" ? "Service request" : line.form === "business" ? "Business inquiry" : "Contact"}
            </p>
            <h2 className="mt-6 t-h2 font-bold">
              <span className="mask">
                <span data-rise>{copy.heading[0]}</span>
              </span>
              <span className="mask">
                <span data-rise className="accent text-brand-soft">
                  {copy.heading[1]}
                </span>
              </span>
            </h2>
            <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-paper/70">{copy.body}</p>
          </div>

          <div className="lg:col-span-8">
            {status === "sent" ? (
              <div role="status" className="flex min-h-[24rem] flex-col items-start justify-center gap-5">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-2xl text-white">✓</span>
                <h3 className="text-3xl font-bold tracking-[-0.03em] md:text-4xl">Thank you — we&apos;ve received your request.</h3>
                <p className="max-w-lg text-[16px] leading-relaxed text-paper/70">
                  Our team will review it and get in touch by {contact.toLowerCase()} to discuss the next steps.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid gap-x-8 gap-y-9 md:grid-cols-2">
                <Field label="Full name" error={errors.name}>
                  <input name="name" autoComplete="name" className={inputCls} placeholder="Your name" />
                </Field>
                <Field label="Business email" error={errors.email}>
                  <input name="email" type="email" autoComplete="email" className={inputCls} placeholder="you@company.com" />
                </Field>
                <Field label="Company / organization" error={errors.company}>
                  <input name="company" autoComplete="organization" className={inputCls} placeholder="Organization name" />
                </Field>
                <Field label="Website (optional)">
                  <input name="website" type="url" autoComplete="url" className={inputCls} placeholder="https://" />
                </Field>

                <div className="md:col-span-2" role="radiogroup" aria-label={copy.categoryLabel}>
                  <span className="eyebrow text-[11px] text-paper/50">{copy.categoryLabel}</span>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {line.categories.map((c) => (
                      <Chip
                        key={c.id}
                        active={category === c.id}
                        onClick={() => {
                          setCategory(c.id);
                          setItems([]);
                        }}
                      >
                        {c.title}
                      </Chip>
                    ))}
                  </div>
                  {errors.category && <span className="mt-2 block text-[12px] text-[#ff8a8a]">{errors.category}</span>}
                </div>

                {selected && selected.items.length > 0 && (
                  <div ref={itemsRef} className="overflow-hidden md:col-span-2" role="group" aria-label={copy.itemsLabel}>
                    <div className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-5">
                      <span className="eyebrow text-[11px] text-brand-soft">
                        {copy.itemsLabel} · {selected.title}
                      </span>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selected.items.map((item) => (
                          <Chip key={item} multi active={items.includes(item)} onClick={() => toggleItem(item)}>
                            {item}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {line.form === "business" && (
                  <Field label="Target market or industry" wide>
                    <input name="market" className={inputCls} placeholder="e.g. Retail in KSA, NGOs in Egypt" />
                  </Field>
                )}

                {line.form === "contact" && (
                  <>
                    <div className="md:col-span-2" role="radiogroup" aria-label="Organization type">
                      <span className="eyebrow text-[11px] text-paper/50">Organization type</span>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {ORG_TYPES.map((o) => (
                          <Chip key={o} active={orgType === o} onClick={() => setOrgType(orgType === o ? null : o)}>
                            {o}
                          </Chip>
                        ))}
                      </div>
                    </div>
                    <Field label="Industry / sector (optional)" wide>
                      <input
                        name="market"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className={inputCls}
                        placeholder="e.g. Healthcare, Education, Retail"
                      />
                    </Field>
                  </>
                )}

                <Field label={copy.detailsLabel} error={errors.details} wide>
                  <textarea name="details" rows={4} className={`${inputCls} resize-none`} placeholder={copy.detailsHint} />
                </Field>

                {line.form === "service" ? (
                  <div className="md:col-span-2" role="radiogroup" aria-label="Budget range">
                    <span className="eyebrow text-[11px] text-paper/50">Budget range (optional)</span>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {BUDGETS.map((b) => (
                        <Chip key={b} active={budget === b} onClick={() => setBudget(budget === b ? null : b)}>
                          {b}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ) : line.form === "business" ? (
                  <div className="md:col-span-2" role="radiogroup" aria-label="Current stage">
                    <span className="eyebrow text-[11px] text-paper/50">Current stage</span>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {STAGES.map((st) => (
                        <Chip key={st} active={stage === st} onClick={() => setStage(stage === st ? null : st)}>
                          {st}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="md:col-span-2" role="radiogroup" aria-label="Preferred contact method">
                  <span className="eyebrow text-[11px] text-paper/50">Preferred contact method</span>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {CONTACT.map((c) => (
                      <Chip key={c} active={contact === c} onClick={() => setContact(c)}>
                        {c}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Honeypot: hidden from people, filled by bots. */}
                <input name="company_site" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

                <div className="flex flex-col gap-4 border-t border-paper/10 pt-8 md:col-span-2 md:flex-row md:items-center md:justify-between">
                  {line.form === "contact" ? (
                    <label className="flex max-w-sm cursor-pointer items-start gap-3 text-[12px] leading-relaxed text-paper/55">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#007ffd]"
                      />
                      <span>
                        I agree that OP Dev. may contact me about this request and process my details for that purpose only.
                        {errors.consent && <span className="mt-1 block text-[#ff8a8a]">{errors.consent}</span>}
                      </span>
                    </label>
                  ) : (
                    <p className="max-w-sm text-[12px] leading-relaxed text-paper/40">
                      By submitting, you agree that OP Dev. may contact you about this request. We never share your details.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-brand py-3.5 pl-7 pr-3.5 text-[14px] font-semibold text-white transition-opacity disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending…" : copy.submit}
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-ink transition-transform duration-500 group-hover:rotate-45">
                      ↗
                    </span>
                  </button>
                </div>
                {status === "error" && (
                  <p role="alert" className="text-[13px] text-[#ff8a8a] md:col-span-2">
                    Something went wrong sending your request. Please try again, or email us directly.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
