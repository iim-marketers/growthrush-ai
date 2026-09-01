import { Check } from "lucide-react";
import { Logo } from "@/components/logo";
import { pitch } from "@/lib/data";

/**
 * The two-column auth screen: value proposition on the left from `lg` up, and
 * whatever card the route supplies on the right. Lifted out of the login page
 * so `/login/verify` inherits the same glows, spacing and breakpoints instead
 * of a copy that drifts.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-light relative min-h-dvh w-full bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="glow glow-brand top-[-15%] right-[-10%]" />
        <div className="glow glow-warm bottom-[-15%] left-[-10%]" />
      </div>

      <div className="relative z-1 mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center screen-pad-y gap-10 px-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-10 xl:gap-24">
        <PitchPanel />
        {children}
      </div>
    </div>
  );
}

/** The card the auth screens sit in. Same panel, different contents. */
export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-panel glass-panel-roomy animate-slide-up w-full max-w-104 shrink-0 sm:max-w-108 lg:mx-0">
      <Logo
        size="md"
        tone="dark"
        className="hide-on-short rhythm-lg justify-center lg:hidden"
      />
      {children}
    </div>
  );
}

/** The value proposition. Only rendered from lg up, where there is room for it. */
function PitchPanel() {
  return (
    <section className="hidden max-w-xl flex-col lg:flex">
      <Logo size="lg" tone="dark" />

      <h2 className="mt-8 text-[clamp(2rem,1.4rem+1.8vw,3rem)] leading-[1.1]">
        {pitch.headline}{" "}
        <span className="text-brand">{pitch.headlineAccent}</span>.
      </h2>

      <p className="mt-5 max-w-lg text-lg leading-relaxed text-subtle">
        {pitch.body}
      </p>

      <ul className="mt-8 flex flex-col gap-3">
        {pitch.points.map((point) => (
          <li key={point} className="flex items-center gap-3 text-subtle">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <Check size={14} strokeWidth={3} />
            </span>
            {point}
          </li>
        ))}
      </ul>
    </section>
  );
}
