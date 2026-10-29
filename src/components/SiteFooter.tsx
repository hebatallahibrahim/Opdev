import Link from "next/link";
import Logo from "./Logo";

// Footer for inner pages (the home page closes with its own CTA + footer).
export default function SiteFooter() {
  return (
    <footer className="relative z-10 px-5 pb-8 pt-20 text-paper md:px-10">
      <div className="grid gap-10 border-t border-paper/10 pt-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-paper/55">
            Building Capabilities. <span className="accent text-brand-soft">Enabling Growth.</span>
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-8 text-[14px] md:col-span-7 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <span className="eyebrow text-paper/40">Services</span>
            <Link href="/services/outsourcing" className="text-paper/75 hover:text-paper">Outsourcing</Link>
            <Link href="/services/investment-business-growth" className="text-paper/75 hover:text-paper">Business Growth</Link>
            <Link href="/services" className="text-paper/75 hover:text-paper">All services</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="eyebrow text-paper/40">Company</span>
            <Link href="/industries" className="text-paper/75 hover:text-paper">Industries</Link>
            <Link href="/case-studies" className="text-paper/75 hover:text-paper">Case Studies</Link>
            <Link href="/about" className="text-paper/75 hover:text-paper">About</Link>
            <Link href="/contact" className="text-paper/75 hover:text-paper">Contact</Link>
            <Link href="/insights" className="text-paper/75 hover:text-paper">Insights</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="eyebrow text-paper/40">Follow</span>
            <a href="#" className="text-paper/75 hover:text-paper">LinkedIn</a>
            <a href="#" className="text-paper/75 hover:text-paper">Instagram</a>
            <a href="#" className="text-paper/75 hover:text-paper">Behance</a>
          </div>
        </nav>
      </div>
      <p className="mt-14 text-[12px] text-paper/40">© {new Date().getFullYear()} OP Dev. All rights reserved.</p>
    </footer>
  );
}
