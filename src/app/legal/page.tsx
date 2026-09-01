import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { legalDocs, legalNav } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "The terms, privacy policy and refund policy governing your use of growthrush.ai.",
  alternates: { canonical: "/legal" },
};

export default function LegalIndexPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <h1 className="text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">
        Legal
      </h1>
      <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-subtle">
        The documents below govern your use of growthrush.ai, operated by
        Estrellingent Technology Private Limited. Each is also available as a
        PDF.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {legalNav.map((entry) => {
          const doc = legalDocs[entry.slug];
          return (
            <li key={entry.slug}>
              <Link
                href={`/legal/${entry.slug}`}
                className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/2 p-6 transition-colors hover:border-brand/40 hover:bg-white/4"
              >
                <h2 className="font-display text-lg font-bold text-ink">
                  {entry.label}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-subtle">
                  {entry.blurb}
                </p>
                <span className="mt-5 flex items-center justify-between text-xs text-faint">
                  Updated {doc.updated}
                  <ArrowRight
                    size={15}
                    aria-hidden
                    className="text-brand transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
