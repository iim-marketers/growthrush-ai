import {
  categories,
  goals,
  googleListings,
  monthlyBudgets,
  notListed,
} from "@/lib/app-data";
import { plans } from "@/lib/landing-data";

/** What the onboarding wizard collects. Empty string means "not answered". */
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
  plan: plans[0].id,
};

const oneOf = (allowed: readonly string[]) => (value: string) =>
  allowed.includes(value) ? value : "";

const text = (max: number) => (value: string) =>
  value.replace(/\s+/g, " ").trim().slice(0, max);

/* Choices must be one of the options on screen; free text is tidied and
   capped. Anything else becomes "not answered" rather than being stored. */
const cleaners: Record<keyof Answers, (value: string) => string> = {
  business: text(120),
  category: oneOf(categories),
  city: text(80),
  listing: oneOf([...googleListings.map((l) => l.id), notListed.id]),
  goal: oneOf(goals.filter((g) => !g.comingSoon).map((g) => g.id)),
  budget: oneOf(monthlyBudgets.map((b) => b.id)),
  plan: oneOf(plans.map((p) => p.id)),
};

export function cleanAnswers(input: unknown): Answers {
  const raw = (typeof input === "object" && input) || {};
  const out = { ...emptyAnswers };
  for (const key of Object.keys(cleaners) as (keyof Answers)[]) {
    const value = (raw as Record<string, unknown>)[key];
    out[key] = typeof value === "string" ? cleaners[key](value) : "";
  }
  return out;
}

/** The same bar the wizard's steps hold the customer to. */
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

/** Fills {business} and {city} in wizard copy from the customer's answers. */
export function personalise(
  copy: string,
  a: Pick<Answers, "business" | "city">,
) {
  return copy
    .replaceAll("{business}", a.business.trim() || "your business")
    .replaceAll("{city}", a.city.trim() || "your area");
}
