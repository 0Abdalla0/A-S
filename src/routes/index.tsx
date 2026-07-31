import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LangProvider } from "@/lib/i18n";
import { InvitationDataProvider } from "@/lib/invitation-data";
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
import { LangToggle, FloatingRSVP, FloatingInstagram } from "@/components/Chrome";
import { EVENT } from "@/lib/event";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${EVENT.bride.en} & ${EVENT.groom.en} Wedding Invitation` },
      {
        name: "description",
        content: `Join us in celebrating the wedding of ${EVENT.bride.en} & ${EVENT.groom.en}.`,
      },
      { property: "og:title", content: `${EVENT.bride.en} & ${EVENT.groom.en}` },
      { property: "og:description", content: `We're getting married. Save the date.` },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <LangProvider>
      <InvitationDataProvider>
        <App />
      </InvitationDataProvider>
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
            <Rings3D />
            <Gallery />
            <EventDetails />
            <RSVP onSubmit={triggerHearts} />
            <Messages onSent={triggerHearts} />
            <DrawingCanvas onSent={triggerHearts} />
            <VoiceNote onSent={triggerHearts} />
            <InvitationCard />
            <footer className="px-6 py-16 text-center">
              <div className="divider-gold mx-auto w-32" />
              <p className="mt-6 font-script text-3xl text-gradient-gold">
                {EVENT.bride.en} & {EVENT.groom.en}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.4em] text-foreground/40">
                {EVENT.hashtag}
              </p>
              <a
                href="https://www.instagram.com/invitra.eg"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-gold transition-all hover:scale-105 hover:text-gold-soft"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5Zm0 2h8.5A3.75 3.75 0 0 1 20 7.75v8.5A3.75 3.75 0 0 1 16.25 20h-8.5A3.75 3.75 0 0 1 4 16.25v-8.5A3.75 3.75 0 0 1 7.75 4Zm9.25 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
                </svg>

                <span className="text-sm tracking-[0.15em]">@invitra.eg</span>
              </a>
            </footer>
          </main>
          <FloatingRSVP />
          <FloatingInstagram />
          <FloatingHearts trigger={hearts} />
        </>
      )}
    </>
  );
}
