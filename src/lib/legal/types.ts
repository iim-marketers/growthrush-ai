export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "list"; variant?: "bullet" | "lettered"; items: string[] }
  | { t: "table"; head: [string, string]; rows: [string, string][] }
  | { t: "callout"; text: string }
  | { t: "contact"; title?: string; lines: string[] };

export type Section = {
  id: string;
  number: string;
  title: string;
  blocks: Block[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  updated: string;
  effective: string;
  pdf: string;
  intro?: Block[];
  sections: Section[];
  note?: string;
};
