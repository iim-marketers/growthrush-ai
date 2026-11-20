import { Inbox, ListFilter, PhoneCall } from "lucide-react";
import { Logo, LogoMark } from "@/components/logo";

const highlights = [
  {
    icon: Inbox,
    title: "Every lead, in one list",
    body: "See leads the moment they're added to your account.",
  },
  {
    icon: PhoneCall,
    title: "Tap to call",
    body: "Reach a lead straight from your phone, no copying numbers.",
  },
  {
    icon: ListFilter,
    title: "Know what to chase",
    body: "Filter by status, date or city to plan your follow-ups.",
  },
];

export function PortalLoginShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-light-portals
      className="theme-light grid min-h-dvh w-full bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
    >
      <aside className="relative isolate hidden overflow-hidden bg-[#0b1220] p-12 text-white lg:flex lg:flex-col xl:p-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_100%_0%,rgba(64,89,232,0.55)_0%,rgba(126,34,206,0.25)_45%,transparent_75%)]"
        />
        <LogoMark
          decorative
          className="absolute -right-24 -bottom-24 -z-10 size-96 -rotate-12 opacity-[0.07] brightness-0 invert"
        />

        <Logo size="md" tone="light" eager />

        <div className="my-auto max-w-md">
          <h2 className="mt-6 text-[clamp(2rem,1.4rem+1.6vw,2.75rem)] leading-[1.1] text-white">
            Your leads, ready when you are.
          </h2>
          <ul className="mt-10 flex flex-col gap-6">
            {highlights.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                  <item.icon className="size-5" />
                </span>
                <span>
                  <span className="block font-semibold text-white">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-white/65">
                    {item.body}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-white/45">
          Need access? Ask your growthrush.ai account manager.
        </p>
      </aside>

      <main className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <Logo
            size="md"
            tone="dark"
            className="mb-8 justify-center lg:hidden"
            eager
          />
          {children}
        </div>
      </main>
    </div>
  );
}

export function PortalFormError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg bg-danger/8 px-3 py-2 text-[0.85rem] font-medium text-danger"
    >
      {message}
    </p>
  );
}
