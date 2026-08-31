import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { legalNav } from "@/lib/legal";

/** Shared chrome for every document under /legal. */
export default function LegalLayout({ children }: LayoutProps<"/legal">) {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" aria-label="growthrush.ai home">
            <Logo size="sm" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-subtle transition-colors hover:text-ink"
          >
            <ArrowLeft size={15} aria-hidden />
            Back to site
          </Link>
        </div>
      </header>

      {children}

      <footer className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {legalNav.map((entry) => (
              <Link
                key={entry.slug}
                href={`/legal/${entry.slug}`}
                className="text-sm text-subtle transition-colors hover:text-ink"
              >
                {entry.label}
              </Link>
            ))}
          </nav>
          <p className="mt-6 text-sm text-faint">
            © {new Date().getFullYear()} growthrush.ai — Estrellingent
            Technology Private Limited. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
