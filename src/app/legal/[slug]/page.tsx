import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalDocument, LegalToc } from "@/components/legal/legal-doc";
import { legalDocs, legalNav, type LegalSlug } from "@/lib/legal";

function isLegalSlug(value: string): value is LegalSlug {
  return value in legalDocs;
}

/** Prerender all three documents at build time — they never change per request. */
export function generateStaticParams() {
  return legalNav.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata(
  props: PageProps<"/legal/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  if (!isLegalSlug(slug)) return {};

  const doc = legalDocs[slug];
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/legal/${slug}` },
    openGraph: { title: doc.title, description: doc.description },
  };
}

export default async function LegalDocPage(props: PageProps<"/legal/[slug]">) {
  const { slug } = await props.params;
  if (!isLegalSlug(slug)) notFound();

  const doc = legalDocs[slug];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Sibling documents, so a reader can move between them without going back. */}
      <nav aria-label="Legal documents" className="mb-10 flex flex-wrap gap-2">
        {legalNav.map((entry) => {
          const current = entry.slug === slug;
          return (
            <Link
              key={entry.slug}
              href={`/legal/${entry.slug}`}
              aria-current={current ? "page" : undefined}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                current
                  ? "border-brand/40 bg-brand/10 font-semibold text-ink"
                  : "border-white/10 text-subtle hover:border-white/20 hover:text-ink"
              }`}
            >
              {entry.label}
            </Link>
          );
        })}
      </nav>

      {/* The contents list only earns its space once there is a sidebar to put it in. */}
      <div className="lg:grid lg:grid-cols-[1fr_16rem] lg:gap-12">
        <LegalDocument doc={doc} />
        <aside className="mt-14 hidden lg:sticky lg:top-24 lg:mt-0 lg:block lg:self-start">
          <LegalToc doc={doc} />
        </aside>
      </div>
    </main>
  );
}
