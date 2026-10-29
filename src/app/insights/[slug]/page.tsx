import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PageIntro from "@/components/PageIntro";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import SiteFooter from "@/components/SiteFooter";
import WorkVisual from "@/components/WorkVisual";
import { ArticleToc, ReadingProgress } from "@/components/insights/ArticleChrome";
import { AUTHOR, POSTS, headingId, postBySlug, type Block } from "@/content/insights";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  return post ? { title: `${post.title} — OP Dev. Insights`, description: post.dek } : {};
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={headingId(block.text)} className="scroll-mt-32 pt-6 text-[1.75rem] font-bold leading-tight tracking-[-0.03em] text-ink md:text-[2.1rem]">
          {block.text}
        </h2>
      );
    case "p":
      return <p className="text-[17px] leading-[1.8] text-ink/75 md:text-[18px]">{block.text}</p>;
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className="space-y-3">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-4 text-[17px] leading-[1.7] text-ink/80">
              {block.ordered ? (
                <span className="accent mt-0.5 w-6 shrink-0 text-brand">{String(i + 1).padStart(2, "0")}</span>
              ) : (
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
              )}
              <span>{item}</span>
            </li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote className="my-4 border-l-4 border-brand py-2 pl-6 text-2xl font-semibold leading-snug tracking-[-0.02em] text-ink md:text-[1.75rem]">
          {block.text}
        </blockquote>
      );
  }
}

export default async function ArticlePage({ params }: Props) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();

  const headings = post.body.filter((b) => b.type === "h2").map((b) => ({ id: headingId(b.text), text: b.text }));
  // Related: same topic first, then the most recent of the rest.
  const related = [
    ...POSTS.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 3);

  return (
    <>
      <PageIntro />
      <ReadingProgress target="article-body" />
      <Header />
      <main className="relative">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: post.category }]}
          title={post.title}
          description={post.dek}
          actions={
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-paper/70">
              <span className="rounded-full bg-brand px-3 py-1 text-[12px] font-semibold text-white">{post.format}</span>
              <span>{post.minutes} min read</span>
              <span className="h-1 w-1 rounded-full bg-paper/30" />
              <span>By {AUTHOR}</span>
            </div>
          }
          visual={
            <div className="aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-paper/10 shadow-2xl shadow-black/40">
              <WorkVisual kind={post.visual.kind} config={post.visual.config} label={post.title} />
            </div>
          }
        />

        <section className="relative z-10 rounded-t-[2rem] bg-paper px-5 py-16 text-ink md:rounded-t-[3.5rem] md:px-10 md:py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-28">
                <ArticleToc headings={headings} />
              </div>
            </aside>

            <article id="article-body" className="lg:col-span-7">
              <div className="mb-12 rounded-[1.5rem] bg-ink p-7 text-paper md:p-9">
                <p className="eyebrow text-[11px] text-brand-soft">Key takeaways</p>
                <ul className="mt-5 space-y-3">
                  {post.takeaways.map((t) => (
                    <li key={t} className="flex gap-3 text-[16px] leading-relaxed">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[11px] text-white">✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                {post.body.map((block, i) => (
                  <BlockView key={i} block={block} />
                ))}
              </div>

              <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-8">
                <span className="text-[13px] text-ink/50">
                  Filed under <span className="font-semibold text-ink">{post.category}</span>
                </span>
                <Link href="/insights" className="text-[13px] font-semibold text-brand">
                  ← All insights
                </Link>
              </div>
            </article>
          </div>
        </section>

        <Reveal className="relative z-10 bg-paper px-5 pb-20 text-ink md:px-10 md:pb-28">
          <div className="border-t border-ink/10 pt-16 md:pt-20">
            <p data-fade className="eyebrow text-ink/45">
              Keep reading
            </p>
            <div data-stagger className="mt-8 grid gap-x-5 gap-y-12 md:grid-cols-3">
              {related.map((p) => (
                <Link key={p.slug} href={`/insights/${p.slug}`} data-cursor="Read" className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-[1.25rem]">
                    <WorkVisual kind={p.visual.kind} config={p.visual.config} label={p.title} />
                  </div>
                  <p className="mt-4 text-[11px] text-ink/50">
                    <span className="eyebrow text-[10px] text-brand">{p.format}</span> · {p.minutes} min read
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug tracking-[-0.02em] group-hover:text-brand">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>

        <CtaBand
          eyebrow={post.category}
          title="Want to apply this"
          accent="to your organization?"
          body="Talk to the OP DEV team about your situation — we'll help you turn the ideas into a plan."
        />
      </main>
      <SiteFooter />
    </>
  );
}
