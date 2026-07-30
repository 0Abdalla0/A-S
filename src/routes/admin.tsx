import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LangProvider } from "@/lib/i18n";
import {
  InvitationDataProvider,
  type RsvpEntry,
  type MsgEntry,
  type DrawingEntry,
  type VoiceEntry,
  useInvitationData,
} from "@/lib/invitation-data";
import { EVENT } from "@/lib/event";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: `Admin Â· ${EVENT.bride.en} & ${EVENT.groom.en}` }] }),
  component: () => (
    <LangProvider>
      <InvitationDataProvider>
        <Admin />
      </InvitationDataProvider>
    </LangProvider>
  ),
});
function Admin() {
  const {
    loading,
    error,
    rsvps,
    msgs,
    draws,
    voices,
    deleteRsvp,
    deleteMessage,
    deleteDrawing,
    deleteVoice,
  } = useInvitationData();

  const [tab, setTab] = useState<"overview" | "rsvp" | "messages" | "drawings" | "voice">(
    "overview",
  );
  const [selectedDrawing, setSelectedDrawing] = useState<DrawingEntry | null>(null);

  // Password protection state
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    setIsMounted(true);
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "loay##menna") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect password");
    }
  };

  const yes = rsvps.filter((r) => r.choice === "yes").reduce((s, r) => s + r.guests, 0);
  const maybe = rsvps.filter((r) => r.choice === "maybe").length;
  const no = rsvps.filter((r) => r.choice === "no").length;

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ rsvps, msgs, draws, voices }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { k: typeof tab; label: string; count: number }[] = [
    { k: "overview", label: "Overview", count: 0 },
    { k: "rsvp", label: "RSVPs", count: rsvps.length },
    { k: "messages", label: "Messages", count: msgs.length },
    { k: "drawings", label: "Sketches", count: draws.length },
    { k: "voice", label: "Voice notes", count: voices.length },
  ];

  if (!isMounted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground/60">Loading...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md rounded-3xl glass-gold p-8 sm:p-10 text-center animate-fade-up">
          <p className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80">
            Protected Dashboard
          </p>
          <h1 className="mt-2 font-display text-4xl italic text-gradient-gold">
            {EVENT.bride.en} & {EVENT.groom.en}
          </h1>
          <div className="divider-gold mx-auto my-6 w-24" />

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full rounded-xl border border-border/40 bg-onyx/40 px-4 py-3 text-sm text-center text-ivory outline-none placeholder:text-foreground/40 focus:border-gold/60"
                autoFocus
              />
              {authError && <p className="mt-2 text-xs text-destructive">{authError}</p>}
            </div>

            <div className="flex gap-3">
              <Link
                to="/"
                className="flex-1 rounded-full glass px-5 py-3 text-xs uppercase tracking-[0.3em] text-foreground/70 hover:text-gold flex items-center justify-center"
              >
                Back
              </Link>
              <button
                type="submit"
                className="flex-1 rounded-full bg-gradient-to-r from-gold-deep to-gold px-6 py-3 text-xs uppercase tracking-[0.3em] text-onyx shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02] cursor-pointer"
              >
                Access
              </button>
            </div>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold-soft/80">Dashboard</p>
            <h1 className="mt-2 font-display text-4xl italic text-gradient-gold">
              {EVENT.bride.en} & {EVENT.groom.en}
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportJSON}
              className="rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.3em] text-gold cursor-pointer"
            >
              Export
            </button>
            <Link
              to="/"
              className="rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.3em] text-foreground/70 hover:text-gold"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition-all cursor-pointer ${tab === t.k ? "bg-gradient-to-r from-gold-deep to-gold text-onyx" : "glass text-foreground/60 hover:text-gold"}`}
            >
              {t.label}
              {t.count ? ` · ${t.count}` : ""}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {loading && (
            <p className="rounded-2xl glass p-6 text-sm text-foreground/60">
              Loading shared data...
            </p>
          )}
          {error && <p className="rounded-2xl glass p-6 text-sm text-destructive">{error}</p>}

          {tab === "overview" && (
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Attending (guests)" value={yes} accent />
              <Stat label="Tentative" value={maybe} />
              <Stat label="Cannot attend" value={no} />
              <Stat label="Messages" value={msgs.length} />
              <Stat label="Sketches" value={draws.length} />
              <Stat label="Voice notes" value={voices.length} />
            </div>
          )}

          {tab === "rsvp" && (
            <Table
              head={["Name", "Choice", "Guests", "When", "Actions"]}
              rows={rsvps.map((r: RsvpEntry) => [
                r.name,
                r.choice,
                String(r.guests),
                new Date(r.ts).toLocaleString(),
                <button
                  key={r.id}
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete RSVP for ${r.name}?`)) {
                      void deleteRsvp(r.id);
                    }
                  }}
                  className="rounded-full bg-destructive/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-destructive hover:bg-destructive/20 transition-all cursor-pointer"
                >
                  Delete
                </button>,
              ])}
            />
          )}

          {tab === "messages" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {msgs.length === 0 && <Empty />}
              {msgs.map((m: MsgEntry) => (
                <div key={m.id} className="glass rounded-2xl p-5 relative group">
                  <p className="font-display italic" style={{ color: m.color, fontSize: "1.1rem" }}>
                    "{m.text}"
                  </p>
                  <p className="mt-3 text-xs text-foreground/60">
                    — {m.name} · {new Date(m.ts).toLocaleString()}
                  </p>
                  <button
                    onClick={() => {
                      if (confirm(`Delete message from ${m.name}?`)) {
                        void deleteMessage(m.id);
                      }
                    }}
                    className="absolute top-4 right-4 rounded-full bg-destructive/10 p-2 text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-destructive/20 cursor-pointer"
                    aria-label="Delete message"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "drawings" && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {draws.length === 0 && <Empty />}
              {draws.map((d: DrawingEntry) => (
                <div key={d.id} className="glass rounded-2xl p-3 relative group">
                  <img
                    src={d.dataUrl}
                    alt={`Sketch by ${d.name}`}
                    className="aspect-square w-full rounded-xl object-cover cursor-pointer hover:scale-[1.02] transition-transform"
                    onClick={() => setSelectedDrawing(d)}
                  />
                  <p className="mt-2 text-xs text-foreground/60">{d.name}</p>
                  <button
                    onClick={() => {
                      if (confirm(`Delete sketch by ${d.name}?`)) {
                        void deleteDrawing(d.id);
                      }
                    }}
                    className="absolute top-3 right-3 rounded-full bg-destructive/10 p-2 text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-destructive/20 cursor-pointer"
                    aria-label="Delete drawing"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "voice" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {voices.length === 0 && <Empty />}
              {voices.map((v: VoiceEntry) => (
                <div key={v.id} className="glass rounded-2xl p-5 relative group">
                  <p className="text-xs text-foreground/60">
                    {v.name} · {v.duration}s · {new Date(v.ts).toLocaleString()}
                  </p>
                  <audio src={v.dataUrl} controls className="mt-2 w-full" />
                  <button
                    onClick={() => {
                      if (confirm(`Delete voice note from ${v.name}?`)) {
                        void deleteVoice(v.id);
                      }
                    }}
                    className="absolute top-4 right-4 rounded-full bg-destructive/10 p-2 text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-destructive/20 cursor-pointer"
                    aria-label="Delete voice note"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedDrawing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-pointer"
          onClick={() => setSelectedDrawing(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl glass-gold p-4 sm:p-6 text-center cursor-default animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDrawing(null)}
              className="absolute top-4 right-4 rounded-full bg-foreground/10 p-2 text-foreground/80 hover:text-foreground hover:bg-foreground/20 cursor-pointer transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="mt-6 border border-gold/20 rounded-2xl overflow-hidden bg-white p-2">
              <img
                src={selectedDrawing.dataUrl}
                alt={`Sketch by ${selectedDrawing.name}`}
                className="max-h-[70vh] w-full object-contain mx-auto rounded-xl"
              />
            </div>
            <p className="mt-4 font-display text-gradient-gold text-lg italic">
              Sketch by {selectedDrawing.name}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-6 ${accent ? "glass-gold" : "glass"}`}>
      <p className="font-display text-5xl text-gradient-gold">{value}</p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-foreground/60">{label}</p>
    </div>
  );
}

function Empty() {
  return (
    <p className="col-span-full rounded-2xl glass p-10 text-center text-sm text-foreground/50">
      Nothing here yet.
    </p>
  );
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  if (!rows.length) return <Empty />;
  return (
    <div className="overflow-x-auto rounded-2xl glass">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border/40">
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="px-5 py-3 text-[10px] uppercase tracking-[0.3em] text-foreground/60"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border/20 last:border-0">
              {r.map((c, j) => (
                <td key={j} className="px-5 py-3 text-foreground/80">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
