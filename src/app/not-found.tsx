import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <Link href="/" aria-label="growthrush.ai home">
        <Logo size="md" />
      </Link>
      <h1 className="mt-10 text-[clamp(2rem,1.3rem+3vw,3rem)] leading-[1.1] tracking-tight">
        This page doesn&rsquo;t exist.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-subtle">
        The link may be broken or the page may have moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-display font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          Back to home
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
        <Link
          href="/legal"
          className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3 font-display font-bold text-white/80 transition-colors hover:text-white"
        >
          Legal documents
        </Link>
      </div>
    </main>
  );
}
