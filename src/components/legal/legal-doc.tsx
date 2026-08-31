import Link from "next/link";
import { Download } from "lucide-react";
import type { Block, LegalDoc, Section } from "@/lib/legal/types";

/**
 * Renders a policy from `lib/legal` as a server component. All three documents
 * go through here so they stay typographically identical.
 */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <article className="min-w-0">
      <header className="border-b border-white/10 pb-8">
        <h1 className="text-[clamp(1.75rem,1.4rem+1.6vw,2.5rem)] leading-tight">
          {doc.title}
        </h1>
        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm text-faint">
          <div className="flex gap-2">
            <dt>Last updated</dt>
            <dd className="text-subtle">{doc.updated}</dd>
          </div>
          <div className="flex gap-2">
            <dt>Effective from</dt>
            <dd className="text-subtle">{doc.effective}</dd>
          </div>
        </dl>
        <a
          href={doc.pdf}
          target="_blank"
          rel="noopener"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-subtle transition-colors hover:border-white/20 hover:text-ink"
        >
          <Download size={15} aria-hidden />
          Download the signed PDF
        </a>
      </header>

      {doc.intro ? (
        <div className="mt-8">
          <Blocks blocks={doc.intro} />
        </div>
      ) : null}

      {doc.sections.map((section) => (
        <SectionBody key={section.id} section={section} />
      ))}

      {doc.note ? (
        <p className="mt-14 border-t border-white/10 pt-6 text-xs leading-relaxed text-faint">
          {doc.note}
        </p>
      ) : null}
    </article>
  );
}

function SectionBody({ section }: { section: Section }) {
  return (
    <section
      id={section.id}
      /* Clears the sticky header when jumped to from the contents list. */
      className="scroll-mt-24 pt-12"
    >
      <h2 className="text-xl leading-snug sm:text-2xl">
        <span className="mr-2 text-brand">{section.number}.</span>
        {section.title}
      </h2>
      <Blocks blocks={section.blocks} />
    </section>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <BlockBody key={i} block={block} />
      ))}
    </>
  );
}

function BlockBody({ block }: { block: Block }) {
  switch (block.t) {
    case "p":
      return (
        <p className="mt-4 text-[0.95rem] leading-relaxed text-subtle">
          <Inline text={block.text} />
        </p>
      );

    case "h":
      return (
        <h3 className="mt-8 font-display text-base font-bold text-ink sm:text-lg">
          <Inline text={block.text} />
        </h3>
      );

    case "list":
      return (
        <ul className="mt-4 flex flex-col gap-2.5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 text-[0.95rem] leading-relaxed text-subtle"
            >
              {block.variant === "lettered" ? null : (
                <span
                  aria-hidden
                  className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60"
                />
              )}
              <span className="min-w-0">
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ul>
      );

    case "table":
      return (
        /* Legal tables are wide; let them scroll rather than the page body. */
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-white/[0.04]">
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="px-4 py-3 text-xs font-bold tracking-[0.1em] text-faint uppercase"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-white/10 align-top">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-4 py-3 leading-relaxed ${
                        j === 0 ? "text-ink" : "text-subtle"
                      }`}
                    >
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "callout":
      return (
        <p className="mt-6 rounded-xl border border-brand/25 bg-brand/[0.07] px-5 py-4 text-[0.95rem] leading-relaxed text-ink">
          <Inline text={block.text} />
        </p>
      );

    case "contact":
      return (
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4">
          {block.title ? (
            <p className="font-display text-sm font-bold text-ink">
              {block.title}
            </p>
          ) : null}
          <div className={block.title ? "mt-2" : undefined}>
            {block.lines.map((line, i) => (
              <p key={i} className="text-[0.9rem] leading-relaxed text-subtle">
                <Inline text={line} />
              </p>
            ))}
          </div>
        </div>
      );
  }
}

/**
 * Tiny inline formatter for the policy text: `**bold**` and `[label](href)`.
 * The source is our own content, so there is nothing to sanitise — this exists
 * to keep the data files readable, not to accept untrusted markdown.
 */
const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

export function Inline({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(INLINE)) {
    const at = match.index;
    if (at > last) nodes.push(text.slice(last, at));

    const [raw, bold, label, href] = match;
    if (bold !== undefined) {
      nodes.push(
        <strong key={at} className="font-semibold text-ink">
          {bold}
        </strong>,
      );
    } else if (href!.startsWith("/")) {
      nodes.push(
        <Link key={at} href={href!} className="text-brand hover:underline">
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a
          key={at}
          href={href!}
          className="text-brand hover:underline"
          {...(href!.startsWith("http")
            ? { target: "_blank", rel: "noopener" }
            : {})}
        >
          {label}
        </a>,
      );
    }
    last = at + raw.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

/** Jump list rendered beside the document on wide screens. */
export function LegalToc({ doc }: { doc: LegalDoc }) {
  return (
    <nav aria-label={`${doc.title} contents`} className="text-sm">
      <p className="text-xs font-bold tracking-[0.14em] text-faint uppercase">
        On this page
      </p>
      <ol className="mt-4 flex flex-col gap-2.5">
        {doc.sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="flex gap-2 leading-snug text-subtle transition-colors hover:text-ink"
            >
              <span className="text-faint">{section.number}.</span>
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
