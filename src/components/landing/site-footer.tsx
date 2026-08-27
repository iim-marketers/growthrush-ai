import Link from "next/link";
import { Logo } from "@/components/logo";
import { footer } from "@/lib/landing-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-white/[0.02]">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <Logo size="sm" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-subtle">
              {footer.tagline}
            </p>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-bold tracking-[0.14em] text-faint uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-subtle transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-faint">
            © {new Date().getFullYear()} growthrush.ai. All rights reserved.
          </p>
          <Link
            href="/login"
            className="text-sm font-semibold text-brand transition-colors hover:text-brand-soft"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </footer>
  );
}
