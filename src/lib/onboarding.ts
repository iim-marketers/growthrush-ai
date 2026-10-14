import {
  categories,
  goals,
  googleListings,
  monthlyBudgets,
  notListed,
} from "@/lib/app-data";

export type Answers = {
  business: string;
  category: string;
  city: string;
  listing: string;
  goal: string;
  budget: string;
  plan: string;
};

export const emptyAnswers: Answers = {
  business: "",
  category: "",
  city: "",
  listing: "",
  goal: "",
  budget: "",
  plan: "",
};

const oneOf = (allowed: readonly string[]) => (value: string) =>
  allowed.includes(value) ? value : "";

const text = (max: number) => (value: string) =>
  value.replace(/\s+/g, " ").trim().slice(0, max);

const cleaners: Record<
  Exclude<keyof Answers, "plan">,
  (value: string) => string
> = {
  business: text(120),
  category: oneOf(categories),
  city: text(80),
  listing: oneOf([...googleListings.map((l) => l.id), notListed.id]),
  goal: oneOf(goals.filter((g) => !g.comingSoon).map((g) => g.id)),
  budget: oneOf(monthlyBudgets.map((b) => b.id)),
};

export function cleanAnswers(input: unknown, planIds: string[]): Answers {
  const raw = (typeof input === "object" && input) || {};
  const value = (key: keyof Answers) => {
    const v = (raw as Record<string, unknown>)[key];
    return typeof v === "string" ? v : "";
  };
  const out = { ...emptyAnswers };
  for (const key of Object.keys(cleaners) as (keyof typeof cleaners)[]) {
    out[key] = cleaners[key](value(key));
  }
  out.plan = oneOf(planIds)(value("plan"));
  return out;
}

export function isComplete(a: Answers) {
  return (
    a.business.length > 1 &&
    a.category !== "" &&
    a.city.length > 1 &&
    /* a.listing !== "" && — back once the "confirm" step returns. */
    a.goal !== "" &&
    a.budget !== "" &&
    a.plan !== ""
  );
}

export function personalise(
  copy: string,
  a: Pick<Answers, "business" | "city">,
) {
  return copy
    .replaceAll("{business}", a.business.trim() || "your business")
    .replaceAll("{city}", a.city.trim() || "your area");
}
