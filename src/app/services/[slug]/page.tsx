import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PageIntro from "@/components/PageIntro";
import SiteFooter from "@/components/SiteFooter";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceCategories from "@/components/services/ServiceCategories";
import InquiryForm from "@/components/services/InquiryForm";
import { SERVICE_LINES } from "@/content/services";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_LINES.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const line = SERVICE_LINES.find((l) => l.slug === slug);
  if (!line) return {};
  return { title: `${line.eyebrow} — OP Dev.`, description: line.description };
}

export default async function ServiceLinePage({ params }: Props) {
  const { slug } = await params;
  const line = SERVICE_LINES.find((l) => l.slug === slug);
  if (!line) notFound();

  return (
    <>
      <PageIntro />
      <Header />
      <main className="relative">
        <ServiceHero line={line} />
        <ServiceCategories line={line} />
        <InquiryForm line={line} />
      </main>
      <SiteFooter />
    </>
  );
}
