import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { hero, heroStats } from "@/lib/landing-data";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-16">
      {/* Ambient light, clipped by the section so it never drives scroll. */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute -top-1/3 left-1/2 h-[70vw] max-h-[760px] w-[70vw] max-w-[760px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(91,127,255,0.20) 0%, rgba(91,127,255,0.05) 45%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <Logo size="sm" className="animate-slide-up mb-12 justify-center" />

        <a
          href="#how-it-works"
          style={{ animationDelay: "0s" }}
          className="animate-slide-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-subtle backdrop-blur-sm transition-colors hover:border-white/20 hover:text-ink sm:text-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          {hero.eyebrow}
        </a>

        <h1
          style={{ animationDelay: "0.06s" }}
          className="animate-slide-up mx-auto mt-6 max-w-4xl text-[clamp(2.25rem,1.3rem+4.2vw,4.5rem)] leading-[1.05] tracking-tight"
        >
          {hero.title}
          <br className="hidden sm:block" />{" "}
          <span className="bg-gradient-to-r from-brand to-brand-soft bg-clip-text text-transparent">
            {hero.titleAccent}
          </span>
        </h1>

        <p
          style={{ animationDelay: "0.14s" }}
          className="animate-slide-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-subtle sm:text-lg"
        >
          {hero.subtitle}
        </p>

        <div
          style={{ animationDelay: "0.22s" }}
          className="animate-slide-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/login"
            className="btn-glow group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-7 py-4 font-display text-base font-bold text-white transition-transform hover:-translate-y-0.5 sm:w-auto sm:text-lg"
          >
            {hero.primaryCta}
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-7 py-4 font-display text-base font-bold text-ink transition-colors hover:border-white/25 hover:bg-white/10 sm:w-auto sm:text-lg"
          >
            {hero.secondaryCta}
          </a>
        </div>

        <p
          style={{ animationDelay: "0.3s" }}
          className="animate-slide-up mt-4 text-sm text-faint"
        >
          {hero.note}
        </p>

        {/* Product glimpse: the lead notification this whole thing produces. */}
        <div
          style={{ animationDelay: "0.36s" }}
          className="animate-slide-up mx-auto mt-14 max-w-md"
        >
          <div className="relative rounded-2xl border border-white/10 bg-card/70 p-4 text-left shadow-[0_24px_70px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <MessageCircle size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink">
                  New lead · WhatsApp
                </p>
                <p className="truncate text-sm text-subtle">
                  &ldquo;Hi, is the weekend batch still open?&rdquo;
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-bold text-success">
                now
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-faint">
              <span>Cost per lead</span>
              <span className="font-bold text-ink">₹128</span>
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 border-t border-white/10 pt-10 sm:mt-20 sm:grid-cols-3">
          {heroStats.map((stat, i) => (
            <div
              key={stat.label}
              className="animate-slide-up"
              style={{ animationDelay: `${0.45 + i * 0.08}s` }}
            >
              <div className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-subtle">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
