import type { Metadata } from "next";
import Header from "@/components/Header";
import PageIntro from "@/components/PageIntro";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SiteFooter from "@/components/SiteFooter";
import InquiryForm from "@/components/services/InquiryForm";
import { CONTACT_LINE } from "@/content/services";

export const metadata: Metadata = {
  title: "Contact & Strategy Consultation — OP Dev.",
  description: "Schedule a consultation or tell us about your project — OP DEV will route your request to the right team.",
};

const EMAIL = "info@opdev.ai";
// Set NEXT_PUBLIC_BOOKING_URL (Cal.com / Calendly) to enable direct booking.
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL;

export default function ContactPage() {
  return (
    <>
      <PageIntro />
      <Header />
      <main className="relative">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
          title="Let's Build"
          accent="What's Next."
          description="Whether you're strengthening your organization, developing new capabilities, or exploring your next growth opportunity, OP DEV is ready to help you move forward."
        />

        <Reveal className="relative z-10 rounded-t-[2rem] bg-paper px-5 pb-10 pt-16 text-ink md:rounded-t-[3.5rem] md:px-10 md:pt-24">
          <div data-stagger className="grid gap-4 md:grid-cols-3">
            <a
              href={`mailto:${EMAIL}`}
              className="group flex flex-col justify-between rounded-[1.5rem] border border-ink/10 bg-paper-2/60 p-7 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <span className="eyebrow text-ink/45 group-hover:text-paper/50">Email</span>
              <span className="mt-10 text-2xl font-semibold tracking-[-0.02em]">{EMAIL}</span>
            </a>

            {BOOKING_URL ? (
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-[1.5rem] bg-brand p-7 text-white"
              >
                <span className="eyebrow text-white/70">Consultation</span>
                <span className="mt-10 flex items-center justify-between text-2xl font-semibold tracking-[-0.02em]">
                  Book a time
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-base transition-transform duration-500 group-hover:rotate-45">
                    ↗
                  </span>
                </span>
              </a>
            ) : (
              <a href="#request" className="group flex flex-col justify-between rounded-[1.5rem] bg-brand p-7 text-white">
                <span className="eyebrow text-white/70">Consultation</span>
                <span className="mt-10 flex items-center justify-between text-2xl font-semibold tracking-[-0.02em]">
                  Request a consultation
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-base transition-transform duration-500 group-hover:translate-y-1">
                    ↓
                  </span>
                </span>
              </a>
            )}

            <div className="flex flex-col justify-between rounded-[1.5rem] border border-ink/10 bg-paper-2/60 p-7">
              <span className="eyebrow text-ink/45">Routing</span>
              <p className="mt-10 text-[16px] leading-relaxed text-ink/65">
                Tell us your area of interest and your request goes straight to the right team — outsourcing or business growth.
              </p>
            </div>
          </div>
        </Reveal>

        <InquiryForm line={CONTACT_LINE} />
      </main>
      <SiteFooter />
    </>
  );
}
