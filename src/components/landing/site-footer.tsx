import Link from "next/link";
import { Logo } from "@/components/logo";
import { footer } from "@/lib/landing-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-white/2">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <div>
            <Logo size="sm" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-subtle">
              {footer.tagline}
            </p>
          </div>

          {/* Inline, not stacked: three links do not need a titled column. */}
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:pt-1"
          >
            {footer.legal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-subtle transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-sm text-faint">
            © {new Date().getFullYear()} growthrush.ai — Estrellingent
            Technology Private Limited
          </p>
          <Link
            href="/login"
            className="hidden md:inline-block text-sm font-semibold text-brand transition-colors hover:text-brand-soft"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </footer>
  );
}
