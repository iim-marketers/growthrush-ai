"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { importAccountLeads } from "@/app/admin/actions";
import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { keepOpenOnToast } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LeadFileError,
  leadTemplateCsv,
  readLeadFile,
  type PreviewRow,
} from "@/lib/admin/lead-import";
import {
  IMPORT_BATCH_SIZE,
  phoneKey,
  type ImportLeadRow,
} from "@/lib/admin/leads";
import { cn } from "@/lib/utils";

const PREVIEW_LIMIT = 200;
const fmt = (n: number) => n.toLocaleString("en-IN");

type Parsed = { fileName: string; rows: PreviewRow[] };

export function ImportLeadsDialog({
  accountId,
  existingPhones,
}: {
  accountId: string;
  existingPhones: string[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [reading, setReading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [onlySkipped, setOnlySkipped] = useState(false);
  const [progress, setProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const existing = useMemo(
    () => new Set(existingPhones.map(phoneKey)),
    [existingPhones],
  );

  const summary = useMemo(() => {
    const valid = parsed?.rows.filter((row) => !row.error) ?? [];
    const updates = valid.filter((row) =>
      existing.has(phoneKey(row.phone)),
    ).length;
    return {
      valid,
      added: valid.length - updates,
      updates,
      skipped: (parsed?.rows.length ?? 0) - valid.length,
    };
  }, [parsed, existing]);

  const importing = progress !== null;

  const reset = () => {
    setParsed(null);
    setOnlySkipped(false);
    setProgress(null);
    if (input.current) input.current.value = "";
  };

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setReading(true);
    try {
      setParsed({ fileName: file.name, rows: await readLeadFile(file) });
    } catch (error) {
      toast.error(
        error instanceof LeadFileError
          ? error.message
          : "Couldn't read this file. Try again.",
      );
      if (input.current) input.current.value = "";
    } finally {
      setReading(false);
    }
  };

  const downloadTemplate = () => {
    const url = URL.createObjectURL(
      new Blob([leadTemplateCsv()], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "leads-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const runImport = async () => {
    const rows: ImportLeadRow[] = summary.valid.map(
      ({ name, phone, city, comment, status }) => ({
        name,
        phone,
        city,
        comment,
        status,
      }),
    );
    const totals = { added: 0, updated: 0 };
    setProgress({ done: 0, total: rows.length });

    for (let start = 0; start < rows.length; start += IMPORT_BATCH_SIZE) {
      const batch = rows.slice(start, start + IMPORT_BATCH_SIZE);
      let result: Awaited<ReturnType<typeof importAccountLeads>>;
      try {
        result = await importAccountLeads(accountId, batch);
      } catch {
        result = { ok: false, error: "The connection dropped." };
      }

      if (!result.ok) {
        toast.error(
          start === 0
            ? `Import failed: ${result.error}`
            : `Import stopped after ${fmt(start)} rows: ${result.error} Uploading the same file again is safe: existing phone numbers are updated, not duplicated.`,
          { duration: 12_000 },
        );
        setProgress(null);
        router.refresh();
        return;
      }

      totals.added += result.added;
      totals.updated += result.updated;
      setProgress({ done: start + batch.length, total: rows.length });
    }

    const parts = [
      totals.added && `${fmt(totals.added)} added`,
      totals.updated && `${fmt(totals.updated)} updated`,
      summary.skipped && `${fmt(summary.skipped)} skipped`,
    ].filter(Boolean);
    toast.success("Leads imported", { description: parts.join(" · ") });
    router.refresh();
    setOpen(false);
    reset();
  };

  const shown =
    (onlySkipped ? parsed?.rows.filter((row) => row.error) : parsed?.rows) ??
    [];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (importing) return;
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-lg font-semibold">
          <Upload data-icon="inline-start" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn("gap-5", parsed ? "sm:max-w-3xl" : "sm:max-w-lg")}
        showCloseButton={!importing}
        onInteractOutside={keepOpenOnToast}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold text-ink">
            Import leads
          </DialogTitle>
          <DialogDescription>
            Leads whose phone number is already in this account are updated, the
            rest are added. Blank cells keep the existing value.
          </DialogDescription>
        </DialogHeader>

        {!parsed ? (
          <>
            <label
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                pick(event.dataTransfer.files[0]);
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-hairline px-6 py-10 text-center transition-colors",
                "hover:border-line-strong has-focus-visible:ring-3 has-focus-visible:ring-brand/20",
                dragging && "border-brand bg-brand/5",
                reading && "pointer-events-none opacity-60",
              )}
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                {reading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <FileSpreadsheet className="size-5" />
                )}
              </span>
              <span className="font-semibold text-ink">
                {reading
                  ? "Reading file…"
                  : "Drop your Excel file here, or click to browse"}
              </span>
              <span className="text-xs text-faint">
                .xlsx or .csv · up to 5 MB
              </span>
              <input
                ref={input}
                type="file"
                accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                className="sr-only"
                onChange={(event) => pick(event.target.files?.[0])}
              />
            </label>

            <div className="flex flex-col gap-3 rounded-xl bg-surface-mute px-4 py-3 text-xs leading-relaxed text-subtle sm:flex-row sm:items-center sm:justify-between">
              <p>
                <span className="font-semibold text-ink">Name</span> and{" "}
                <span className="font-semibold text-ink">Phone</span> columns
                are required. City, Status (Valid, Invalid, Follow-up) and
                Comment are optional.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={downloadTemplate}
              >
                <Download data-icon="inline-start" />
                Template
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="flex min-w-0 items-center gap-2 text-sm font-medium text-ink">
                <FileSpreadsheet className="size-4 shrink-0 text-brand" />
                <span className="truncate">{parsed.fileName}</span>
                <span className="shrink-0 text-faint">
                  · {fmt(parsed.rows.length)} rows
                </span>
              </p>
              {!importing && (
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  onClick={reset}
                  className="cursor-pointer"
                >
                  Choose another file
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Stat label="New leads" value={summary.added} dot="bg-success" />
              <Stat label="Updates" value={summary.updates} dot="bg-brand" />
              <Stat
                label="Skipped"
                value={summary.skipped}
                dot="bg-danger"
                active={onlySkipped}
                onClick={
                  summary.skipped
                    ? () => setOnlySkipped((current) => !current)
                    : undefined
                }
              />
            </div>

            <div className="max-h-80 overflow-auto rounded-xl border border-hairline">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-card">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-14 pl-4">Row</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="hidden sm:table-cell">City</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="pr-4">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.slice(0, PREVIEW_LIMIT).map((row) => (
                    <TableRow
                      key={row.line}
                      className={cn(row.error && "bg-danger/4")}
                    >
                      <TableCell className="pl-4 text-xs text-faint tabular-nums">
                        {row.line}
                      </TableCell>
                      <TableCell className="max-w-40 truncate font-medium text-ink">
                        {row.name || "—"}
                      </TableCell>
                      <TableCell className="text-subtle tabular-nums">
                        {row.phone || "—"}
                      </TableCell>
                      <TableCell className="hidden max-w-32 truncate text-subtle sm:table-cell">
                        {row.city || "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {row.status ? (
                          <LeadStatusBadge status={row.status} />
                        ) : (
                          <span className="text-faint">—</span>
                        )}
                      </TableCell>
                      <TableCell className="pr-4 text-xs whitespace-normal">
                        {row.error ? (
                          <span className="text-danger">{row.error}</span>
                        ) : existing.has(phoneKey(row.phone)) ? (
                          <span className="font-semibold text-brand">
                            Update
                          </span>
                        ) : (
                          <span className="font-semibold text-success">
                            New
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {shown.length > PREVIEW_LIMIT && (
                <p className="border-t border-hairline px-4 py-2.5 text-center text-xs text-faint">
                  Showing the first {PREVIEW_LIMIT} of {fmt(shown.length)} rows.
                  All of them will be imported.
                </p>
              )}
            </div>

            {progress && (
              <div className="flex flex-col gap-2" aria-live="polite">
                <Progress
                  value={(progress.done / progress.total) * 100}
                  className="h-1.5"
                />
                <p className="text-xs text-subtle">
                  Importing {fmt(progress.done)} of {fmt(progress.total)}…
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={importing}
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={importing || summary.valid.length === 0}
                onClick={runImport}
                className="font-semibold cursor-pointer"
              >
                {importing
                  ? "Importing…"
                  : `Import ${fmt(summary.valid.length)} ${summary.valid.length === 1 ? "lead" : "leads"}`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Stat({
  label,
  value,
  dot,
  active,
  onClick,
}: {
  label: string;
  value: number;
  dot: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const className = cn(
    "flex flex-col items-start gap-1 rounded-xl border border-hairline bg-card px-4 py-3 text-left",
    onClick && "transition-colors hover:border-line-strong",
    active && "border-brand bg-brand/5",
  );
  const content = (
    <>
      <span className="flex items-center gap-2 text-xs font-medium text-subtle">
        <span aria-hidden className={cn("size-2 rounded-full", dot)} />
        {label}
      </span>
      <span className="font-display text-2xl font-extrabold text-ink tabular-nums">
        {fmt(value)}
      </span>
    </>
  );

  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={className}
    >
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  );
}
