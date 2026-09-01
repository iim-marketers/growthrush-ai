"use client";

import { useEffect, useMemo, useState } from "react";
import type { LegalDoc } from "@/lib/legal/types";

const OFFSET = 96;

/** Id of the section the reader is currently level with. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(ids[ids.length - 1] ?? "");
        return;
      }

      let current = ids[0] ?? "";
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= OFFSET + 1) current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}

/** Jump list rendered beside the document on wide screens. */
export function LegalToc({ doc }: { doc: LegalDoc }) {
  const ids = useMemo(
    () => doc.sections.map((section) => section.id),
    [doc.sections],
  );
  const active = useActiveSection(ids);

  return (
    <nav aria-label={`${doc.title} contents`} className="text-sm">
      <p className="text-xs font-bold tracking-[0.14em] text-faint uppercase">
        On this page
      </p>
      <ol className="mt-4 flex flex-col gap-2.5 border-l border-white/10">
        {doc.sections.map((section) => {
          const current = section.id === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={current ? "location" : undefined}
                className={`-ml-px flex gap-2 border-l-2 pl-4 leading-snug transition-colors ${
                  current
                    ? "border-brand font-semibold text-ink"
                    : "border-transparent text-subtle hover:border-white/25 hover:text-ink"
                }`}
              >
                <span className={current ? "text-brand" : "text-faint"}>
                  {section.number}.
                </span>
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
