import Reveal from "./Reveal";
import { PillLink } from "./PageHero";

// Closing call-to-action used at the end of inner pages.
export default function CtaBand({
  eyebrow = "Start a conversation",
  title,
  accent,
  body,
  href = "/contact",
  cta = "Schedule a Consultation",
}: {
  eyebrow?: string;
  title: string;
  accent: string;
  body: string;
  href?: string;
  cta?: string;
}) {
  return (
    <Reveal className="relative z-10 bg-paper px-2 pb-2 md:px-4 md:pb-4">
      <div className="relative overflow-clip rounded-[2rem] bg-brand px-6 py-20 text-white md:rounded-[3rem] md:px-14 md:py-28">
        <div className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-white/15 blur-[100px]" />
        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p data-fade className="eyebrow text-white/70">
              {eyebrow}
            </p>
            <h2 className="mt-6 t-h2 font-bold">
              <span className="mask">
                <span data-rise>{title}</span>
              </span>
              <span className="mask">
                <span data-rise className="accent text-ink">
                  {accent}
                </span>
              </span>
            </h2>
          </div>
          <div data-fade className="lg:col-span-4">
            <p className="text-[16px] leading-relaxed text-white/80">{body}</p>
            <div className="mt-8 [&_a]:bg-ink [&_a>span]:bg-brand">
              <PillLink href={href}>{cta}</PillLink>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
