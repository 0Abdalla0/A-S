import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LangProvider } from "@/lib/i18n";
import { IntroEnvelope } from "@/components/IntroEnvelope";
import { Hero } from "@/components/Hero";
import { Countdown } from "@/components/Countdown";
import { Story } from "@/components/Story";
import { Rings3D } from "@/components/Rings3D";
import { Gallery } from "@/components/Gallery";
import { EventDetails } from "@/components/EventDetails";
import { RSVP } from "@/components/RSVP";
import { Messages } from "@/components/Messages";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { VoiceNote } from "@/components/VoiceNote";
import { InvitationCard } from "@/components/InvitationCard";
import { FloatingHearts } from "@/components/FloatingHearts";
import { LangToggle, FloatingRSVP } from "@/components/Chrome";
import { EVENT } from "@/lib/event";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${EVENT.bride.en} & ${EVENT.groom.en} — Engagement Invitation` },
      { name: "description", content: `Join us in celebrating the engagement of ${EVENT.bride.en} & ${EVENT.groom.en}.` },
      { property: "og:title", content: `${EVENT.bride.en} & ${EVENT.groom.en}` },
      { property: "og:description", content: `We're getting engaged. Save the date.` },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <LangProvider>
      <App />
    </LangProvider>
  );
}

function App() {
  const [opened, setOpened] = useState(false);
  const [hearts, setHearts] = useState(0);

  const triggerHearts = () => setHearts((h) => h + 1);

  return (
    <>
      {!opened && <IntroEnvelope onOpen={() => setOpened(true)} />}
      {opened && (
        <>
          <LangToggle />
          <main className="relative">
            <Hero />
            <Countdown />
            <Story />
            <Gallery />
            <EventDetails />
            <RSVP onSubmit={triggerHearts} />
            <Messages onSent={triggerHearts} />
            <footer className="px-6 py-16 text-center">
              <div className="divider-gold mx-auto w-32" />
              <p className="mt-6 font-script text-3xl text-gradient-gold">
                {EVENT.bride.en} & {EVENT.groom.en}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.4em] text-foreground/40">
                {EVENT.hashtag}
              </p>
            </footer>
          </main>
          <FloatingRSVP />
          <FloatingHearts trigger={hearts} />
        </>
      )}
    </>
  );
}
