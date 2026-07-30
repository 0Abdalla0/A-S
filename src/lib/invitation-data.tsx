import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EVENT } from "@/lib/event";

export type RsvpChoice = "yes" | "maybe" | "no";

export type RsvpEntry = {
  id: string;
  name: string;
  choice: RsvpChoice;
  guests: number;
  ts: number;
};

export type MsgEntry = { id: string; name: string; text: string; color: string; ts: number };
export type DrawingEntry = { id: string; name: string; dataUrl: string; ts: number };
export type VoiceEntry = {
  id: string;
  name: string;
  dataUrl: string;
  duration: number;
  ts: number;
};

type InvitationContextValue = {
  loading: boolean;
  error: string | null;
  ready: boolean;
  rsvps: RsvpEntry[];
  msgs: MsgEntry[];
  draws: DrawingEntry[];
  voices: VoiceEntry[];
  refresh: () => Promise<void>;
  submitRsvp: (input: {
    name: string;
    choice: RsvpChoice;
    guests: number;
    language: "en" | "ar";
  }) => Promise<void>;
  submitMessage: (input: {
    name: string;
    text: string;
    color: string;
    language: "en" | "ar";
  }) => Promise<void>;
  submitDrawing: (input: { name: string; dataUrl: string }) => Promise<void>;
  submitVoice: (input: {
    name: string;
    dataUrl: string;
    duration: number;
    language: "en" | "ar";
  }) => Promise<void>;
  deleteRsvp: (id: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  deleteDrawing: (id: string) => Promise<void>;
  deleteVoice: (id: string) => Promise<void>;
};

type InvitationContextState = {
  coupleId: string;
  eventId: string | null;
};

const POLL_MS = 15000;

const InvitationDataCtx = createContext<InvitationContextValue | null>(null);

function toTs(value: string | null | undefined) {
  return value ? new Date(value).getTime() : Date.now();
}

function statusToChoice(status: string): RsvpChoice {
  switch (status) {
    case "attending":
      return "yes";
    case "tentative":
    case "pending":
      return "maybe";
    case "declined":
      return "no";
    default:
      return "maybe";
  }
}

function choiceToStatus(choice: RsvpChoice): "attending" | "tentative" | "declined" {
  switch (choice) {
    case "yes":
      return "attending";
    case "maybe":
      return "tentative";
    case "no":
      return "declined";
  }
}

async function resolveInvitationContext(): Promise<InvitationContextState> {
  const hashtag = EVENT.hashtag.trim();
  const brideName = EVENT.bride.en.trim();
  const groomName = EVENT.groom.en.trim();

  let coupleId: string | null = null;

  if (hashtag) {
    const { data, error } = await supabase
      .from("couples")
      .select("id")
      .eq("hashtag", hashtag)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    coupleId = data?.id ?? null;
  }

  if (!coupleId) {
    const { data, error } = await supabase
      .from("couples")
      .select("id")
      .eq("bride_first_name_en", brideName)
      .eq("groom_first_name_en", groomName)
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    coupleId = data?.id ?? null;
  }

  if (!coupleId) {
    const { data, error } = await supabase
      .from("couples")
      .select("id, slug, hashtag, bride_first_name_en, groom_first_name_en")
      .eq("is_published", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    coupleId = data?.id ?? null;

    if (!coupleId) {
      throw new Error(
        "Could not resolve the current couple in Supabase. Match the couple names or hashtag in src/lib/event.ts, or ensure at least one published couple exists.",
      );
    }

    console.warn(
      `[Invitation] Falling back to published couple because no exact match was found for bride="${brideName}", groom="${groomName}", hashtag="${hashtag}".`,
    );
  }

  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id")
    .eq("couple_id", coupleId)
    .eq("requires_rsvp", true)
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (eventError) throw eventError;

  return { coupleId, eventId: event?.id ?? null };
}

async function loadInvitationData(context: InvitationContextState) {
  const [
    { data: rsvps, error: rsvpError },
    { data: msgs, error: msgError },
    { data: draws, error: drawError },
    { data: voices, error: voiceError },
  ] = await Promise.all([
    supabase
      .from("rsvp_responses")
      .select("id, display_name, status, party_size, responded_at, created_at")
      .eq("couple_id", context.coupleId)
      .order("responded_at", { ascending: false }),
    supabase
      .from("guest_messages")
      .select("id, author_name, body, color, created_at")
      .eq("couple_id", context.coupleId)
      .order("created_at", { ascending: false }),
    supabase
      .from("guest_drawings")
      .select("id, author_name, image_url, created_at")
      .eq("couple_id", context.coupleId)
      .order("created_at", { ascending: false }),
    supabase
      .from("voice_notes")
      .select("id, author_name, audio_url, duration_seconds, created_at")
      .eq("couple_id", context.coupleId)
      .order("created_at", { ascending: false }),
  ]);

  if (rsvpError) throw rsvpError;
  if (msgError) throw msgError;
  if (drawError) throw drawError;
  if (voiceError) throw voiceError;

  return {
    rsvps:
      rsvps?.map((row) => ({
        id: row.id,
        name: row.display_name,
        choice: statusToChoice(row.status),
        guests: row.party_size,
        ts: toTs(row.responded_at ?? row.created_at),
      })) ?? [],
    msgs:
      msgs?.map((row) => ({
        id: row.id,
        name: row.author_name,
        text: row.body,
        color: row.color,
        ts: toTs(row.created_at),
      })) ?? [],
    draws:
      draws?.map((row) => ({
        id: row.id,
        name: row.author_name,
        dataUrl: row.image_url,
        ts: toTs(row.created_at),
      })) ?? [],
    voices:
      voices?.map((row) => ({
        id: row.id,
        name: row.author_name,
        dataUrl: row.audio_url,
        duration: row.duration_seconds,
        ts: toTs(row.created_at),
      })) ?? [],
  };
}

export function InvitationDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [msgs, setMsgs] = useState<MsgEntry[]>([]);
  const [draws, setDraws] = useState<DrawingEntry[]>([]);
  const [voices, setVoices] = useState<VoiceEntry[]>([]);
  const contextRef = useRef<InvitationContextState | null>(null);

  const refresh = async () => {
    const context = contextRef.current;
    if (!context) return;

    const next = await loadInvitationData(context);
    setRsvps(next.rsvps);
    setMsgs(next.msgs);
    setDraws(next.draws);
    setVoices(next.voices);
  };

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      try {
        setLoading(true);
        setError(null);
        const context = await resolveInvitationContext();
        if (cancelled) return;
        contextRef.current = context;
        const next = await loadInvitationData(context);
        if (cancelled) return;
        setRsvps(next.rsvps);
        setMsgs(next.msgs);
        setDraws(next.draws);
        setVoices(next.voices);
        setReady(true);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load invitation data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void boot();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => {
      void refresh().catch((err) => {
        console.error(err);
      });
    }, POLL_MS);

    return () => window.clearInterval(id);
  }, [ready]);

  const submitRsvp = async (input: {
    name: string;
    choice: RsvpChoice;
    guests: number;
    language: "en" | "ar";
  }) => {
    const context = contextRef.current;
    if (!context) throw new Error("Invitation context is not ready yet.");

    const { error: insertError } = await supabase.from("rsvp_responses").insert({
      couple_id: context.coupleId,
      event_id: context.eventId,
      display_name: input.name,
      status: choiceToStatus(input.choice),
      party_size: input.guests,
      source: "website",
      language: input.language,
      responded_at: new Date().toISOString(),
    });

    if (insertError) throw insertError;
    await refresh();
  };

  const submitMessage = async (input: {
    name: string;
    text: string;
    color: string;
    language: "en" | "ar";
  }) => {
    const context = contextRef.current;
    if (!context) throw new Error("Invitation context is not ready yet.");

    const { error: insertError } = await supabase.from("guest_messages").insert({
      couple_id: context.coupleId,
      author_name: input.name,
      body: input.text,
      color: input.color,
      language: input.language,
      moderation: "approved",
      is_pinned: false,
    });

    if (insertError) throw insertError;
    await refresh();
  };

  const submitDrawing = async (input: { name: string; dataUrl: string }) => {
    const context = contextRef.current;
    if (!context) throw new Error("Invitation context is not ready yet.");

    const { error: insertError } = await supabase.from("guest_drawings").insert({
      couple_id: context.coupleId,
      author_name: input.name,
      image_url: input.dataUrl,
      moderation: "approved",
    });

    if (insertError) throw insertError;
    await refresh();
  };

  const submitVoice = async (input: {
    name: string;
    dataUrl: string;
    duration: number;
    language: "en" | "ar";
  }) => {
    const context = contextRef.current;
    if (!context) throw new Error("Invitation context is not ready yet.");

    const { error: insertError } = await supabase.from("voice_notes").insert({
      couple_id: context.coupleId,
      author_name: input.name,
      audio_url: input.dataUrl,
      duration_seconds: input.duration,
      language: input.language,
      moderation: "approved",
    });

    if (insertError) throw insertError;
    await refresh();
  };

  const deleteRsvp = async (id: string) => {
    const { error: deleteError } = await supabase.from("rsvp_responses").delete().eq("id", id);
    if (deleteError) throw deleteError;
    await refresh();
  };

  const deleteMessage = async (id: string) => {
    const { error: deleteError } = await supabase.from("guest_messages").delete().eq("id", id);
    if (deleteError) throw deleteError;
    await refresh();
  };

  const deleteDrawing = async (id: string) => {
    const { error: deleteError } = await supabase.from("guest_drawings").delete().eq("id", id);
    if (deleteError) throw deleteError;
    await refresh();
  };

  const deleteVoice = async (id: string) => {
    const { error: deleteError } = await supabase.from("voice_notes").delete().eq("id", id);
    if (deleteError) throw deleteError;
    await refresh();
  };

  return (
    <InvitationDataCtx.Provider
      value={{
        loading,
        error,
        ready,
        rsvps,
        msgs,
        draws,
        voices,
        refresh,
        submitRsvp,
        submitMessage,
        submitDrawing,
        submitVoice,
        deleteRsvp,
        deleteMessage,
        deleteDrawing,
        deleteVoice,
      }}
    >
      {children}
    </InvitationDataCtx.Provider>
  );
}

export function useInvitationData() {
  const value = useContext(InvitationDataCtx);
  if (!value) {
    throw new Error("useInvitationData must be used inside InvitationDataProvider.");
  }
  return value;
}
