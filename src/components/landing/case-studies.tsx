"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";
import { MapPin, X } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { Frame } from "./frame";
import { SectionLabel } from "./how-it-works";
import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { caseStudies } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

type CaseStudy = (typeof caseStudies)[number];

const pad = (n: number) => String(n + 1).padStart(2, "0");

const railScroller =
  "-mx-4 snap-x snap-mandatory overflow-x-auto scroll-px-4 px-4 pt-2 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0 lg:pt-0 lg:pb-0";
const railTrack =
  "flex gap-4 after:block after:w-0 after:shrink-0 after:content-[''] sm:after:w-2 lg:grid lg:grid-cols-3 lg:gap-5 lg:after:hidden";
const railItem =
  "w-[84%] shrink-0 snap-start sm:w-[56%] md:w-[42%] lg:w-auto lg:shrink";

export function CaseStudies() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(0);

  const cardAt = (i: number) =>
    railRef.current?.firstElementChild?.children[i] as HTMLElement | undefined;

  const onRailScroll = () => {
    const el = railRef.current;
    const first = cardAt(0);
    if (!el || !first) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setVisible(
      atEnd
        ? caseStudies.length - 1
        : Math.round(el.scrollLeft / (first.offsetWidth + 16)),
    );
  };

  const scrollToCard = (i: number) => {
    const el = railRef.current;
    const card = cardAt(i);
    if (!el || !card) return;
    const offset =
      card.getBoundingClientRect().left - el.getBoundingClientRect().left;
    el.scrollBy({
      left: offset - parseFloat(getComputedStyle(el).paddingLeft),
      behavior: "smooth",
    });
  };

  return (
    <Frame id="results">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionLabel>Results</SectionLabel>
        <h2 className="mt-3 text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] leading-tight sm:mt-4">
          Real businesses, real growth
        </h2>
        <p className="mt-3 text-base text-subtle sm:mt-4 sm:text-lg">
          Not impressions. Not reach. Revenue, orders and enquiries you can
          count.
        </p>
      </Reveal>

      <div
        ref={railRef}
        onScroll={onRailScroll}
        className={cn("mt-6 sm:mt-8", railScroller)}
      >
        <Stagger className={railTrack}>
          {caseStudies.map((study, i) => (
            <StaggerItem key={study.business} className={railItem}>
              <CaseCard
                study={study}
                index={i}
                onOpen={() => {
                  setActive(i);
                  setOpen(true);
                }}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <div className="mt-1 flex justify-center gap-2 lg:hidden">
        {caseStudies.map((study, i) => (
          <button
            key={study.business}
            type="button"
            onClick={() => scrollToCard(i)}
            aria-label={`Show ${study.business}`}
            aria-current={visible === i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              visible === i
                ? "w-6 bg-brand"
                : "w-1.5 bg-white/20 hover:bg-white/40",
            )}
          />
        ))}
      </div>

      <CaseStudyDialog
        open={open}
        index={active}
        onIndexChange={setActive}
        onOpenChange={setOpen}
      />
    </Frame>
  );
}

function CaseCard({
  study,
  index,
  onOpen,
}: {
  study: CaseStudy;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`Read the ${study.business} case study`}
      className="group relative flex h-full cursor-pointer w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/60 text-left backdrop-blur-sm outline-none transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_24px_60px_-28px_rgba(91,127,255,0.55)] focus-visible:ring-3 focus-visible:ring-brand/40"
    >
      <div className="relative bg-linear-to-br from-brand/25 via-card to-card p-4">
        <div className="flex aspect-16/7 items-center justify-center rounded-xl bg-white px-6 py-4">
          <Image
            src={study.logo}
            alt={study.business}
            width={320}
            height={128}
            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
        <div className="flex flex-col">
          <span className="font-display text-4xl leading-none font-extrabold tracking-tight text-brand-soft">
            {study.metric}
          </span>
          <span className="mt-1.5 text-[11px] font-semibold tracking-[0.12em] text-faint uppercase">
            {study.metricLabel}
          </span>
        </div>
        <h3 className="mt-3 text-lg leading-snug font-bold text-ink">
          {study.headline}
        </h3>
        {/* Clamp inside a growing wrapper: clamping the flex-1 element itself leaks a partial fourth line. */}
        <div className="mt-2 flex-1">
          <p className="line-clamp-3 text-sm leading-relaxed text-subtle">
            {study.summary}
          </p>
        </div>

        <div className="-mx-4 mt-4 flex items-center justify-between gap-3 border-t border-white/10 px-4 pt-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink">{study.business}</p>
            <p className="flex items-center gap-1 text-xs text-faint">
              <MapPin size={11} className="shrink-0" aria-hidden />
              <span className="truncate">{study.market}</span>
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-subtle transition-colors group-hover:text-ink">
            Read story
          </span>
        </div>
      </div>
    </button>
  );
}

function CaseStudyDialog({
  open,
  index,
  onIndexChange,
  onOpenChange,
}: {
  open: boolean;
  index: number;
  onIndexChange: (index: number) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const study = caseStudies[index];
  const count = caseStudies.length;

  const go = (step: 1 | -1) => {
    onIndexChange((index + step + count) % count);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 supports-backdrop-filter:backdrop-blur-sm" />
        <DialogPrimitive.Content
          onKeyDown={onKeyDown}
          className={cn(
            "fixed z-50 flex flex-col overflow-hidden border border-white/10 bg-popover text-ink outline-none",
            "shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] duration-200",
            "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
            "inset-x-0 bottom-0 max-h-[92dvh] rounded-t-[28px] data-open:slide-in-from-bottom-8 data-closed:slide-out-to-bottom-8",
            "sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-h-[88dvh] lg:max-h-[94dvh] sm:w-[calc(100%-3rem)] sm:max-w-3xl sm:-translate-x-1/2 lg:max-w-5xl sm:-translate-y-1/2 sm:rounded-3xl sm:data-open:slide-in-from-bottom-0 sm:data-open:zoom-in-95 sm:data-closed:slide-out-to-bottom-0 sm:data-closed:zoom-out-95",
          )}
        >
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/20 text-subtle outline-none transition-colors hover:border-white/25 hover:text-ink focus-visible:ring-3 focus-visible:ring-brand/40 sm:top-6 sm:right-6"
          >
            <X size={18} aria-hidden />
          </DialogPrimitive.Close>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
          >
            <div
              key={study.business}
              className="relative grid grid-cols-1 overflow-hidden animate-in px-5 pt-5 pb-6 duration-300 fade-in-0 slide-in-from-bottom-2 sm:px-8 sm:pt-7 sm:pb-8 lg:pt-6 lg:pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-linear-to-b from-brand/25 via-brand/5 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-brand/20 blur-3xl"
              />

              <header className="relative lg:col-start-1 lg:row-start-1">
                <div className="flex min-w-0 items-center gap-3 pr-12 sm:gap-4 lg:pr-0">
                  <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-xl bg-white p-2 sm:h-16 sm:w-32">
                    <Image
                      src={study.logo}
                      alt=""
                      width={200}
                      height={80}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="mt-0.5 truncate font-display text-lg font-extrabold">
                      {study.business}
                    </p>
                    <p className="flex flex-wrap items-center gap-x-1 text-xs text-faint">
                      {study.category}
                      <span aria-hidden>·</span>
                      <MapPin size={11} aria-hidden />
                      {study.market}
                    </p>
                  </div>
                </div>

                <DialogTitle className="mt-6 max-w-[24ch] font-display text-[clamp(1.5rem,1.1rem+1.6vw,2.125rem)] leading-tight font-extrabold text-balance text-ink">
                  {study.headline}
                </DialogTitle>
                <DialogDescription className="mt-3 max-w-[60ch] text-sm leading-relaxed text-subtle sm:text-base">
                  {study.summary}
                </DialogDescription>
              </header>

              <ul className="relative mt-6 grid grid-cols-3 gap-2 sm:gap-3 lg:col-start-1 lg:row-start-2">
                {study.results.map((result, i) => (
                  <li
                    key={result.label}
                    className={cn(
                      "flex flex-col rounded-2xl border p-3 sm:p-4",
                      i === 0
                        ? "border-brand/50 bg-brand/15"
                        : "border-white/10 bg-surface-subtle",
                    )}
                  >
                    <span
                      className={cn(
                        "font-display text-2xl font-extrabold tracking-tight sm:text-3xl",
                        i === 0 ? "text-brand-soft" : "text-ink",
                      )}
                    >
                      {result.value}
                    </span>
                    <span className="mt-1 text-[11px] leading-snug text-subtle sm:text-xs">
                      {result.label}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="relative mt-8 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:pt-11">
                <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-1 lg:gap-4">
                  <StoryBlock label="The client">{study.overview}</StoryBlock>
                  <StoryBlock label="The challenge">
                    {study.challenge}
                  </StoryBlock>
                </div>

                <section className="mt-8 lg:mt-5">
                  <h4 className="font-display text-[11px] font-bold tracking-[0.18em] text-faint uppercase">
                    What we did
                  </h4>
                  <ol className="relative mt-4 space-y-5 lg:space-y-4">
                    <span
                      aria-hidden
                      className="absolute top-4 bottom-4 left-4 w-px bg-linear-to-b from-brand/60 via-white/15 to-transparent"
                    />
                    {study.solution.map((step, i) => (
                      <li key={step.title} className="relative flex gap-4">
                        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand/50 bg-popover font-display text-xs font-bold text-brand-soft">
                          {pad(i)}
                        </span>
                        <div className="pt-1">
                          <p className="font-bold text-ink">{step.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-subtle">
                            {step.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>

              <p className="relative mt-8 self-start rounded-2xl border-l-2 border-brand bg-brand/10 px-4 py-3.5 text-sm leading-relaxed text-ink sm:text-base lg:col-start-1 lg:row-start-3 lg:mt-6">
                {study.outcome}
              </p>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

function StoryBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h4 className="font-display text-[11px] font-bold tracking-[0.18em] text-faint uppercase">
        {label}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-subtle">{children}</p>
    </section>
  );
}
