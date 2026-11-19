import {
  cleanPhone,
  LEAD_PHONE,
  parseLeadStatus,
  phoneKey,
  type ImportLeadRow,
} from "./leads";

type Field = keyof ImportLeadRow;

export type PreviewRow = ImportLeadRow & {
  line: number;
  error?: string;
};

export const MAX_IMPORT_ROWS = 10_000;
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

const headerAliases: Record<Field, string[]> = {
  name: ["name", "fullname", "leadname", "customername", "clientname", "contactname"],
  phone: [
    "phone",
    "phoneno",
    "phonenumber",
    "mobile",
    "mobileno",
    "mobilenumber",
    "contact",
    "contactno",
    "contactnumber",
    "whatsapp",
    "whatsappnumber",
    "number",
  ],
  city: ["city", "location", "town"],
  comment: ["comment", "comments", "note", "notes", "remark", "remarks", "description"],
  status: ["status", "leadstatus"],
};

const normalizeHeader = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

function cellText(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

function findColumns(header: string[]) {
  const columns: Partial<Record<Field, number>> = {};
  header.forEach((cell, index) => {
    const key = normalizeHeader(cell);
    for (const [field, aliases] of Object.entries(headerAliases) as [Field, string[]][]) {
      if (columns[field] === undefined && aliases.includes(key)) columns[field] = index;
    }
  });
  return columns.name !== undefined && columns.phone !== undefined ? columns : null;
}

export function readLeadRows(cells: unknown[][]): PreviewRow[] | null {
  const table = cells.map((row) => row.map(cellText));
  const headerIndex = table.slice(0, 10).findIndex((row) => findColumns(row));
  if (headerIndex === -1) return null;
  const columns = findColumns(table[headerIndex])!;
  const at = (row: string[], field: Field) =>
    columns[field] === undefined ? "" : (row[columns[field]] ?? "");

  const rows: PreviewRow[] = [];
  const seen = new Map<string, PreviewRow>();

  table.slice(headerIndex + 1).forEach((row, offset) => {
    if (row.every((cell) => !cell)) return;

    const rawStatus = at(row, "status");
    const lead: PreviewRow = {
      line: headerIndex + offset + 2,
      name: at(row, "name").slice(0, 120),
      phone: cleanPhone(at(row, "phone")),
      city: at(row, "city").slice(0, 80),
      comment: at(row, "comment").slice(0, 1000),
      status: parseLeadStatus(rawStatus),
    };

    if (!lead.name) lead.error = "Name is missing";
    else if (!lead.phone) lead.error = "Phone number is missing";
    else if (!LEAD_PHONE.test(lead.phone)) lead.error = "Phone number isn't valid";
    else if (rawStatus && !lead.status) lead.error = `Unknown status “${rawStatus}”`;

    if (!lead.error) {
      const key = phoneKey(lead.phone);
      const earlier = seen.get(key);
      if (earlier) earlier.error = `Same phone as row ${lead.line}, which is used instead`;
      seen.set(key, lead);
    }

    rows.push(lead);
  });

  return rows;
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const input = text.replace(/^﻿/, "");

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch !== '"') cell += ch;
      else if (input[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = false;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && input[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

export class LeadFileError extends Error {}

export async function readLeadFile(file: File): Promise<PreviewRow[]> {
  const ext = file.name.toLowerCase().split(".").pop();
  if (file.size > MAX_IMPORT_BYTES) {
    throw new LeadFileError("This file is larger than 5 MB. Split it into smaller files.");
  }
  if (ext === "xls") {
    throw new LeadFileError(
      "Old .xls files aren't supported. Open it in Excel and save it as .xlsx or .csv.",
    );
  }

  let sheets: unknown[][][];
  if (ext === "csv") {
    sheets = [parseCsv(await file.text())];
  } else if (ext === "xlsx") {
    const { default: readXlsxFile } = await import("read-excel-file/browser");
    try {
      const all = await readXlsxFile(file, { parseNumber: (value) => value });
      sheets = all.map((sheet) => sheet.data);
    } catch {
      throw new LeadFileError("Couldn't read this Excel file. Is it a valid .xlsx file?");
    }
  } else {
    throw new LeadFileError("Upload an Excel (.xlsx) or CSV file.");
  }

  for (const cells of sheets) {
    const rows = readLeadRows(cells);
    if (!rows) continue;
    if (rows.length === 0) throw new LeadFileError("The file has headers but no lead rows.");
    if (rows.length > MAX_IMPORT_ROWS) {
      throw new LeadFileError(
        `This file has ${rows.length.toLocaleString("en-IN")} rows. The limit is ${MAX_IMPORT_ROWS.toLocaleString("en-IN")} per upload.`,
      );
    }
    return rows;
  }

  throw new LeadFileError(
    "Couldn't find “Name” and “Phone” column headers. Check the first row of your sheet, or use the template.",
  );
}

export function leadTemplateCsv() {
  return [
    "Name,Phone,City,Status,Comment",
    "Rahul Sharma,9876543210,Kolkata,Follow-up,Call back on Monday",
    "Priya Das,9123456780,Delhi,Valid,Interested in the premium plan",
  ].join("\r\n");
}
