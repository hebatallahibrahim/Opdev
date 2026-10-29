// Lead notifications by email, sent through Resend's HTTP API (no SDK needed).
// Configure in .env.local — see .env.example. Without RESEND_API_KEY the lead is
// only logged, so local development works without credentials.

type Lead = Record<string, string | string[]>;

const LABELS: Record<string, string> = {
  kind: "Form",
  line: "Service line",
  name: "Name",
  email: "Email",
  company: "Company / organization",
  website: "Website",
  orgType: "Organization type",
  category: "Division / area of interest",
  services: "Services",
  market: "Target market / industry",
  details: "Details",
  budget: "Budget range",
  stage: "Current stage",
  contact: "Preferred contact method",
  receivedAt: "Received",
};

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function leadSubject(lead: Lead) {
  const what = lead.kind === "business" ? "Business inquiry" : lead.kind === "contact" ? "Contact request" : "Service request";
  return `${what}: ${lead.category || "General"} — ${lead.company || lead.name}`;
}

// Human-readable values for the internal codes the forms send.
const FORM_NAMES: Record<string, string> = { service: "Service request", business: "Business inquiry", contact: "Contact page" };
const LINE_NAMES: Record<string, string> = { outsourcing: "Outsourcing Services", "investment-business-growth": "Investment & Business Growth" };

function display(key: string, lead: Lead): string {
  const v = lead[key];
  if (Array.isArray(v)) return v.join(", ");
  if (key === "kind") return FORM_NAMES[v] ?? v;
  if (key === "line") return LINE_NAMES[v] ?? "";
  if (key === "receivedAt") {
    return new Date(v).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC";
  }
  return v;
}

function leadHtml(lead: Lead) {
  const rows = Object.entries(LABELS)
    .filter(([k]) => display(k, lead))
    .map(([k, label]) => {
      const v = display(k, lead);
      return `<tr><td style="padding:8px 16px 8px 0;color:#6b6b78;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:8px 0;color:#181822">${escape(v).replace(/\n/g, "<br>")}</td></tr>`;
    })
    .join("");
  return `<div style="font-family:Arial,sans-serif;font-size:14px"><h2 style="color:#007ffd;margin:0 0 16px">${escape(leadSubject(lead))}</h2><table>${rows}</table></div>`;
}

export async function sendLead(lead: Lead): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.INQUIRY_FROM ?? "OP Dev. Website <website@opdev.ai>",
      to: (process.env.INQUIRY_TO ?? "info@opdev.ai").split(",").map((s) => s.trim()),
      reply_to: lead.email,
      subject: leadSubject(lead),
      html: leadHtml(lead),
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  return { sent: true };
}
