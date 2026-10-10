import ExcelJS from "exceljs";
import fs from "node:fs";
import path from "node:path";
import { env } from "./env";
import { REGISTRATION_STATUSES, type RegistrationInput } from "@contracts/types";

export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export type RegistrationRow = {
  id: number;
  submittedAt: Date;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
  preferredContact: string;
  message: string;
  status: RegistrationStatus;
  assignedHandler: string;
  notes: string;
};

const SHEET = "Registrations";

const COLUMNS: { header: string; key: keyof RegistrationRow; width: number }[] = [
  { header: "ID", key: "id", width: 7 },
  { header: "Submitted At", key: "submittedAt", width: 20 },
  { header: "Full Name", key: "fullName", width: 24 },
  { header: "Email", key: "email", width: 30 },
  { header: "Phone / WhatsApp", key: "phone", width: 20 },
  { header: "Country", key: "country", width: 18 },
  { header: "Interest", key: "interest", width: 16 },
  { header: "Preferred Contact", key: "preferredContact", width: 18 },
  { header: "Message", key: "message", width: 40 },
  { header: "Status", key: "status", width: 18 },
  { header: "Assigned Handler", key: "assignedHandler", width: 22 },
  { header: "Notes", key: "notes", width: 40 },
];

const filePath = path.resolve(env.dataDir, "registrations.xlsx");

let rows: RegistrationRow[] = [];
let loadedMtime = -1;
// Serialises every read-modify-write so concurrent requests can't corrupt the file.
let queue: Promise<unknown> = Promise.resolve();

function text(v: ExcelJS.CellValue): string {
  if (v == null) return "";
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "object") {
    if ("text" in v && typeof v.text === "string") return v.text;
    if ("result" in v && v.result != null) return String(v.result);
    return "";
  }
  return String(v);
}

function asStatus(v: string): RegistrationStatus {
  return (REGISTRATION_STATUSES as readonly string[]).includes(v)
    ? (v as RegistrationStatus)
    : "new";
}

async function loadFromDisk() {
  if (!fs.existsSync(filePath)) {
    rows = [];
    loadedMtime = -1;
    return;
  }
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);
  const ws = wb.getWorksheet(SHEET) ?? wb.worksheets[0];
  const out: RegistrationRow[] = [];
  if (ws) {
    ws.eachRow((row, n) => {
      if (n === 1) return; // header
      const get = (i: number) => text(row.getCell(i).value).trim();
      const id = Number(get(1));
      if (!Number.isFinite(id) || id <= 0) return;
      const rawDate = row.getCell(2).value;
      const submittedAt = rawDate instanceof Date ? rawDate : new Date(text(rawDate));
      out.push({
        id,
        submittedAt: Number.isNaN(submittedAt.getTime()) ? new Date(0) : submittedAt,
        fullName: get(3),
        email: get(4),
        phone: get(5),
        country: get(6),
        interest: get(7),
        preferredContact: get(8),
        message: get(9),
        status: asStatus(get(10)),
        assignedHandler: get(11),
        notes: get(12),
      });
    });
  }
  rows = out;
  loadedMtime = fs.statSync(filePath).mtimeMs;
}

/** Re-read the file if it was edited outside the server (e.g. in Excel). */
async function sync() {
  const mtime = fs.existsSync(filePath) ? fs.statSync(filePath).mtimeMs : -1;
  if (mtime !== loadedMtime) await loadFromDisk();
}

function buildWorkbook(): ExcelJS.Workbook {
  const wb = new ExcelJS.Workbook();
  wb.created = new Date();
  const ws = wb.addWorksheet(SHEET, { views: [{ state: "frozen", ySplit: 1 }] });
  ws.columns = COLUMNS.map((c) => ({ header: c.header, key: c.key, width: c.width }));
  const head = ws.getRow(1);
  head.font = { bold: true, color: { argb: "FFFFFFFF" } };
  head.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F3D2F" } };
  head.alignment = { vertical: "middle" };
  for (const r of rows) ws.addRow(r);
  ws.getColumn("submittedAt").numFmt = "yyyy-mm-dd hh:mm";
  ws.getColumn("message").alignment = { wrapText: true, vertical: "top" };
  ws.getColumn("notes").alignment = { wrapText: true, vertical: "top" };
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: COLUMNS.length } };
  return wb;
}

async function persist() {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.${process.pid}.tmp`;
  await buildWorkbook().xlsx.writeFile(tmp);
  fs.renameSync(tmp, filePath); // atomic replace, never leaves a half-written file
  loadedMtime = fs.statSync(filePath).mtimeMs;
}

function exclusive<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    await sync();
    return fn();
  });
  queue = run.catch(() => undefined);
  return run;
}

export function addRegistration(input: RegistrationInput) {
  return exclusive(async () => {
    const id = rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;
    rows.push({
      id,
      submittedAt: new Date(),
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      country: input.country,
      interest: input.interest,
      preferredContact: input.preferredContact,
      message: input.message ?? "",
      status: "new",
      assignedHandler: "",
      notes: "",
    });
    await persist();
    return { ok: true as const };
  });
}

export function listRegistrations() {
  return exclusive(async () =>
    [...rows].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()),
  );
}

export function updateRegistration(
  id: number,
  patch: Partial<Pick<RegistrationRow, "status" | "assignedHandler" | "notes">>,
) {
  return exclusive(async () => {
    const row = rows.find((r) => r.id === id);
    if (!row) return false;
    Object.assign(row, patch);
    await persist();
    return true;
  });
}

export function deleteRegistration(id: number) {
  return exclusive(async () => {
    const before = rows.length;
    rows = rows.filter((r) => r.id !== id);
    if (rows.length === before) return false;
    await persist();
    return true;
  });
}

/** Aggregate-only data for the public "someone just registered" toast. */
export function getActivity() {
  return exclusive(async () => {
    const since = Date.now() - 24 * 60 * 60 * 1000;
    const latest = rows.reduce<Date | null>(
      (m, r) => (!m || r.submittedAt > m ? r.submittedAt : m),
      null,
    );
    return {
      last24h: rows.filter((r) => r.submittedAt.getTime() >= since).length,
      total: rows.length,
      latestAt: latest,
    };
  });
}

export function exportWorkbookBuffer() {
  return exclusive(async () => Buffer.from(await buildWorkbook().xlsx.writeBuffer()));
}
