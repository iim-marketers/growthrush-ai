/**
 * Content model for the legal documents under /legal.
 *
 * The policies are authored as data rather than JSX so that all three render
 * through one component and stay visually identical. Text supports a minimal
 * inline syntax — `**bold**` and `[label](href)` — handled by `<Inline>` in
 * `components/legal/legal-doc.tsx`.
 */

export type Block =
  /** Body paragraph. */
  | { t: "p"; text: string }
  /** Sub-heading inside a section, e.g. "4.2 Controls are yours". */
  | { t: "h"; text: string }
  /** Bulleted list, or a lettered one where the source numbers its items. */
  | { t: "list"; variant?: "bullet" | "lettered"; items: string[] }
  /** Two-column reference table (purpose/retention grids). */
  | { t: "table"; head: [string, string]; rows: [string, string][] }
  /** Clause the source itself flags as material — rendered as a callout. */
  | { t: "callout"; text: string }
  /** Contact or officer block: a label plus lines. */
  | { t: "contact"; title?: string; lines: string[] };

export type Section = {
  /** Anchor id, also used by the table of contents. */
  id: string;
  /** Clause number as printed in the source, e.g. "4". */
  number: string;
  title: string;
  blocks: Block[];
};

export type LegalDoc = {
  slug: string;
  /** Full title as printed, e.g. "Privacy Policy". */
  title: string;
  /** One-line summary used for `<meta name="description">`. */
  description: string;
  updated: string;
  effective: string;
  /** Path to the signed PDF original in /public. */
  pdf: string;
  /** Text above the first numbered clause. */
  intro?: Block[];
  sections: Section[];
  /** Small print printed at the foot of the source document. */
  note?: string;
};
