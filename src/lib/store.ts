// Mock local persistence (replace with Firebase later)
export type RsvpEntry = { id: string; name: string; choice: "yes" | "maybe" | "no"; guests: number; ts: number };
export type MsgEntry = { id: string; name: string; text: string; color: string; ts: number };
export type DrawingEntry = { id: string; name: string; dataUrl: string; ts: number };
export type VoiceEntry = { id: string; name: string; dataUrl: string; duration: number; ts: number };

const KEYS = {
  rsvp: "marriage.rsvp",
  msg: "marriage.messages",
  draw: "marriage.drawings",
  voice: "marriage.voice",
} as const;

function read<T>(k: string): T[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(k) || "[]") as T[]; } catch { return []; }
}
function write<T>(k: string, v: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent("marriage-store-update", { detail: k }));
}

export const store = {
  rsvp: {
    list: () => read<RsvpEntry>(KEYS.rsvp),
    add: (e: Omit<RsvpEntry, "id" | "ts">) => {
      const all = read<RsvpEntry>(KEYS.rsvp);
      all.unshift({ ...e, id: crypto.randomUUID(), ts: Date.now() });
      write(KEYS.rsvp, all);
    },
  },
  msg: {
    list: () => read<MsgEntry>(KEYS.msg),
    add: (e: Omit<MsgEntry, "id" | "ts">) => {
      const all = read<MsgEntry>(KEYS.msg);
      all.unshift({ ...e, id: crypto.randomUUID(), ts: Date.now() });
      write(KEYS.msg, all);
    },
  },
  draw: {
    list: () => read<DrawingEntry>(KEYS.draw),
    add: (e: Omit<DrawingEntry, "id" | "ts">) => {
      const all = read<DrawingEntry>(KEYS.draw);
      all.unshift({ ...e, id: crypto.randomUUID(), ts: Date.now() });
      write(KEYS.draw, all);
    },
  },
  voice: {
    list: () => read<VoiceEntry>(KEYS.voice),
    add: (e: Omit<VoiceEntry, "id" | "ts">) => {
      const all = read<VoiceEntry>(KEYS.voice);
      all.unshift({ ...e, id: crypto.randomUUID(), ts: Date.now() });
      write(KEYS.voice, all);
    },
  },
  clearAll: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    window.dispatchEvent(new CustomEvent("marriage-store-update"));
  },
};

export function useStoreVersion() {
  // Trigger re-renders when store updates
  if (typeof window === "undefined") return 0;
  // light pattern
  return 0;
}
