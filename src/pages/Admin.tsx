import { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ChevronDown,
  Download,
  ExternalLink,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Logo } from "@/components/Logo";
import { ApiError, adminToken, callApi } from "@/lib/api";
import { REGISTRATION_STATUSES } from "@contracts/types";

type Status = (typeof REGISTRATION_STATUSES)[number];

type Row = {
  id: number;
  submittedAt: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
  preferredContact: string;
  message: string;
  status: Status;
  assignedHandler: string;
  notes: string;
};

const STATUS_LABEL: Record<Status, string> = {
  new: "New",
  contacted: "Contacted",
  handler_assigned: "Handler assigned",
  onboarding: "Onboarding",
  completed: "Completed",
  closed: "Closed",
};

const STATUS_STYLE: Record<Status, string> = {
  new: "bg-amber-50 text-amber-800",
  contacted: "bg-sky-50 text-sky-800",
  handler_assigned: "bg-violet-50 text-violet-800",
  onboarding: "bg-indigo-50 text-indigo-800",
  completed: "bg-forest-soft text-forest-deep",
  closed: "bg-black/5 text-ink/55",
};

const INTEREST_LABEL: Record<string, string> = {
  ai_training: "AI Training",
  outlier: "Outlier",
  handshake: "Handshake",
  not_sure: "Not sure yet",
};

const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 outline-none transition-all focus:border-forest/60 focus:ring-4 focus:ring-forest/10";

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ───────────────────────── login ───────────────────────── */

function Login({ onAuthed }: { onAuthed: () => void }) {
  const [password, setPassword] = useState("");
  const login = useMutation({
    mutationFn: (pw: string) => callApi<{ token: string }>("login", { password: pw }),
    onSuccess: ({ token }) => {
      adminToken.set(token);
      onAuthed();
    },
  });

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login.mutate(password);
        }}
        className="w-full max-w-sm rounded-[28px] border border-black/8 bg-white p-8 shadow-float"
      >
        <Logo />
        <h1 className="mt-7 font-serif-display text-3xl text-ink">Admin sign in</h1>
        <p className="mt-2 text-sm text-ink/55">
          Enter the admin password to manage registrations.
        </p>
        <input
          type="password"
          autoFocus
          className={`${inputCls} mt-6`}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {login.error && (
          <p className="mt-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            {login.error.message}
          </p>
        )}
        <button
          type="submit"
          disabled={login.isPending || !password}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
        >
          {login.isPending && <Loader2 size={16} className="animate-spin" />}
          Sign in
        </button>
        <Link to="/" className="mt-5 block text-center text-xs text-ink/45 hover:text-ink">
          ← Back to site
        </Link>
      </form>
    </div>
  );
}

/* ───────────────────────── dashboard ───────────────────────── */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin-list"] });
  const list = useQuery({
    queryKey: ["admin-list"],
    queryFn: () =>
      callApi<{ rows: Row[]; sheetUrl: string }>("list", {}, { auth: true }),
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [open, setOpen] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, { handler: string; notes: string }>>({});

  // Expired / invalid token → back to login.
  useEffect(() => {
    if (list.error instanceof ApiError && list.error.code === "UNAUTHORIZED") onLogout();
  }, [list.error, onLogout]);

  const update = useMutation({
    mutationFn: (v: {
      id: number;
      status?: Status;
      assignedHandler?: string;
      notes?: string;
    }) => callApi("update", v, { auth: true }),
    onSuccess: refresh,
    onError: (e) => {
      if (e instanceof ApiError && e.code === "UNAUTHORIZED") onLogout();
    },
  });
  const remove = useMutation({
    mutationFn: (v: { id: number }) => callApi("remove", v, { auth: true }),
    onSuccess: refresh,
  });

  const rows = useMemo(() => list.data?.rows ?? [], [list.data]);

  const stats = useMemo(() => {
    const day = Date.now() - 24 * 60 * 60 * 1000;
    return {
      total: rows.length,
      fresh: rows.filter((r) => r.status === "new").length,
      last24h: rows.filter((r) => new Date(r.submittedAt).getTime() >= day).length,
      completed: rows.filter((r) => r.status === "completed").length,
    };
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return [r.fullName, r.email, r.phone, r.country, r.assignedHandler, r.notes]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, query, filter]);

  const draftFor = (id: number, handler: string, notes: string) =>
    drafts[id] ?? { handler, notes };

  function downloadCsv() {
    const esc = (v: string) => {
      // stop spreadsheet apps from running cells that start like formulas
      const safe = /^[=@]|^[+-](?![\d\s()-]+$)/.test(v) ? `'${v}` : v;
      return `"${safe.replace(/"/g, '""')}"`;
    };
    const head = [
      "ID", "Submitted At", "Full Name", "Email", "Phone / WhatsApp", "Country",
      "Interest", "Preferred Contact", "Message", "Status", "Assigned Handler", "Notes",
    ];
    const lines = rows.map((r) =>
      [
        String(r.id), r.submittedAt, r.fullName, r.email, r.phone, r.country,
        r.interest, r.preferredContact, r.message, r.status, r.assignedHandler, r.notes,
      ]
        .map(esc)
        .join(","),
    );
    const csv = "\uFEFF" + [head.map(esc).join(","), ...lines].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-black/8 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="rounded-full bg-forest-soft px-3 py-1 text-xs font-medium text-forest-deep">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            {list.data?.sheetUrl && (
              <a
                href={list.data.sheetUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-all hover:-translate-y-0.5"
              >
                <ExternalLink size={15} /> Open Google Sheet
              </a>
            )}
            <button
              onClick={downloadCsv}
              disabled={rows.length === 0}
              className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm text-ink/70 hover:text-ink disabled:opacity-40"
            >
              <Download size={15} /> CSV
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-sm text-ink/70 hover:text-ink"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total registrations", value: stats.total },
            { label: "Awaiting contact", value: stats.fresh },
            { label: "Last 24 hours", value: stats.last24h },
            { label: "Completed", value: stats.completed },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-black/8 bg-white p-5">
              <p className="text-xs text-ink/50">{s.label}</p>
              <p className="mt-1.5 font-serif-display text-4xl text-ink">{s.value}</p>
            </div>
          ))}
        </div>

        {/* toolbar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              className={`${inputCls} pl-10`}
              placeholder="Search name, email, phone, country, handler, notes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            className={`${inputCls} sm:w-52`}
            value={filter}
            onChange={(e) => setFilter(e.target.value as Status | "all")}
          >
            <option value="all">All statuses</option>
            {REGISTRATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <button
            onClick={() => list.refetch()}
            className="flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-ink/70 hover:text-ink"
          >
            <RefreshCw size={15} className={list.isFetching ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* table */}
        <div className="mt-4 overflow-x-auto rounded-2xl border border-black/8 bg-white">
          {list.isLoading ? (
            <p className="p-10 text-center text-sm text-ink/50">Loading registrations…</p>
          ) : list.isError ? (
            <p className="p-10 text-center text-sm text-red-600">
              Couldn't load registrations: {list.error.message}
            </p>
          ) : visible.length === 0 ? (
            <p className="p-10 text-center text-sm text-ink/50">
              {rows.length === 0 ? "No registrations yet." : "No registrations match your filters."}
            </p>
          ) : (
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/8 text-xs uppercase tracking-wider text-ink/45">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Interest</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="w-10 px-2 py-3" />
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => {
                  const isOpen = open === r.id;
                  const d = draftFor(r.id, r.assignedHandler, r.notes);
                  const dirty = d.handler !== r.assignedHandler || d.notes !== r.notes;
                  return (
                    <Fragment key={r.id}>
                      <tr
                        className="cursor-pointer border-b border-black/5 hover:bg-black/[0.015]"
                        onClick={() => setOpen(isOpen ? null : r.id)}
                      >
                        <td className="px-4 py-3.5 font-medium text-ink">{r.fullName}</td>
                        <td className="px-4 py-3.5 text-ink/70">
                          <div>{r.email}</div>
                          <div className="text-xs text-ink/45">
                            {r.phone} · prefers {r.preferredContact}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-ink/70">{r.country}</td>
                        <td className="px-4 py-3.5 text-ink/70">
                          {INTEREST_LABEL[r.interest] ?? r.interest}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-ink/60">
                          {fmtDate(r.submittedAt)}
                        </td>
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={r.status}
                            onChange={(e) =>
                              update.mutate({ id: r.id, status: e.target.value as Status })
                            }
                            className={`cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-medium outline-none ${STATUS_STYLE[r.status]}`}
                          >
                            {REGISTRATION_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {STATUS_LABEL[s]}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-3.5 text-ink/40">
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="border-b border-black/5 bg-black/[0.02]">
                          <td colSpan={7} className="px-4 py-5">
                            <div className="grid gap-5 lg:grid-cols-2">
                              <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-ink/45">
                                  Their message
                                </p>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink/75">
                                  {r.message || "— none —"}
                                </p>
                              </div>
                              <div className="space-y-3">
                                <input
                                  className={inputCls}
                                  placeholder="Assigned handler"
                                  value={d.handler}
                                  onChange={(e) =>
                                    setDrafts((x) => ({
                                      ...x,
                                      [r.id]: { ...d, handler: e.target.value },
                                    }))
                                  }
                                />
                                <textarea
                                  rows={3}
                                  className={`${inputCls} resize-none`}
                                  placeholder="Internal notes"
                                  value={d.notes}
                                  onChange={(e) =>
                                    setDrafts((x) => ({
                                      ...x,
                                      [r.id]: { ...d, notes: e.target.value },
                                    }))
                                  }
                                />
                                <div className="flex items-center justify-between">
                                  <button
                                    disabled={!dirty || update.isPending}
                                    onClick={() =>
                                      update.mutate(
                                        { id: r.id, assignedHandler: d.handler, notes: d.notes },
                                        {
                                          onSuccess: () =>
                                            setDrafts((x) => {
                                              const next = { ...x };
                                              delete next[r.id];
                                              return next;
                                            }),
                                        },
                                      )
                                    }
                                    className="rounded-full bg-forest-deep px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
                                  >
                                    Save changes
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `Delete ${r.fullName}'s registration? This can't be undone.`,
                                        )
                                      ) {
                                        remove.mutate({ id: r.id });
                                      }
                                    }}
                                    className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 size={15} /> Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <p className="mt-3 text-xs text-ink/40">
          Showing {visible.length} of {rows.length}. Changes here are written straight to your
          Google Sheet.
        </p>
      </main>
    </div>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function Admin() {
  const [authed, setAuthed] = useState(() => !!adminToken.get());

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const logout = () => {
    adminToken.clear();
    setAuthed(false);
  };

  return authed ? <Dashboard onLogout={logout} /> : <Login onAuthed={() => setAuthed(true)} />;
}
