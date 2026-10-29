import { NextResponse } from "next/server";
import { sendLead } from "@/lib/mail";

// Receives service requests, business inquiries and contact requests, validates
// them, and emails the team (info@opdev.ai by default — see src/lib/mail.ts).

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KINDS = ["service", "business", "contact"];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Bots fill the hidden field; accept silently so they don't retry.
  if (typeof body.company_site === "string" && body.company_site.trim()) {
    return NextResponse.json({ ok: true });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const missing = ["name", "email", "company", "details", "category"].filter((k) => !str(k));
  if (missing.length || !EMAIL.test(str("email")) || !KINDS.includes(str("kind"))) {
    return NextResponse.json({ ok: false, error: "Missing or invalid fields", missing }, { status: 422 });
  }

  const lead = {
    receivedAt: new Date().toISOString(),
    kind: str("kind"),
    line: str("line"),
    name: str("name"),
    email: str("email"),
    company: str("company"),
    website: str("website"),
    orgType: str("orgType"),
    category: str("category"),
    services: Array.isArray(body.services) ? body.services.filter((s): s is string => typeof s === "string") : [],
    market: str("market"),
    details: str("details").slice(0, 5000),
    budget: str("budget"),
    stage: str("stage"),
    contact: str("contact"),
  };

  try {
    const { sent } = await sendLead(lead);
    if (!sent) console.info("[inquiry] email not configured (RESEND_API_KEY missing):", JSON.stringify(lead));
  } catch (err) {
    console.error("[inquiry] email failed", err, JSON.stringify(lead));
    return NextResponse.json({ ok: false, error: "Could not deliver the request" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
