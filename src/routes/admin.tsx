import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LangProvider } from "@/lib/i18n";
import {
  store,
  type RsvpEntry,
  type MsgEntry,
  type DrawingEntry,
  type VoiceEntry,
} from "@/lib/store";
import { EVENT } from "@/lib/event";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: `Admin · ${EVENT.bride.en} & ${EVENT.groom.en}` }] }),
  component: () => (
    <LangProvider>
      <Admin />
    </LangProvider>
  ),
});

function useStore() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const handler = () => setV((x) => x + 1);
    window.addEventListener("wedding-store-update", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("wedding-store-update", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return v;
}

function Admin() {
  useStore();
  const [tab, setTab] = useState<"overview" | "rsvp" | "messages" | "drawings" | "voice">(
    "overview",
  );
  const rsvps = store.rsvp.list();
  const msgs = store.msg.list();
  const draws = store.draw.list();
  const voices = store.voice.list();

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
              className="rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.3em] text-gold"
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
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition-all ${tab === t.k ? "bg-gradient-to-r from-gold-deep to-gold text-onyx" : "glass text-foreground/60 hover:text-gold"}`}
            >
              {t.label}
              {t.count ? ` · ${t.count}` : ""}
            </button>
          ))}
        </div>

        <div className="mt-8">
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
              head={["Name", "Choice", "Guests", "When"]}
              rows={rsvps.map((r: RsvpEntry) => [
                r.name,
                r.choice,
                String(r.guests),
                new Date(r.ts).toLocaleString(),
              ])}
            />
          )}

          {tab === "messages" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {msgs.length === 0 && <Empty />}
              {msgs.map((m: MsgEntry) => (
                <div key={m.id} className="glass rounded-2xl p-5">
                  <p className="font-display italic" style={{ color: m.color, fontSize: "1.1rem" }}>
                    "{m.text}"
                  </p>
                  <p className="mt-3 text-xs text-foreground/60">
                    — {m.name} · {new Date(m.ts).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === "drawings" && (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
              {draws.length === 0 && <Empty />}
              {draws.map((d: DrawingEntry) => (
                <div key={d.id} className="glass rounded-2xl p-3">
                  <img
                    src={d.dataUrl}
                    alt={`Sketch by ${d.name}`}
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                  <p className="mt-2 text-xs text-foreground/60">{d.name}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "voice" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {voices.length === 0 && <Empty />}
              {voices.map((v: VoiceEntry) => (
                <div key={v.id} className="glass rounded-2xl p-5">
                  <p className="text-xs text-foreground/60">
                    {v.name} · {v.duration}s · {new Date(v.ts).toLocaleString()}
                  </p>
                  <audio src={v.dataUrl} controls className="mt-2 w-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
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
