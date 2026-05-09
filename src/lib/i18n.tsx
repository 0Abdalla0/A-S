import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

export const dict: Dict = {
  open: { en: "Open Invitation", ar: "افتح الدعوة" },
  weAre: { en: "We're getting engaged", ar: "نعلن خطوبتنا" },
  saveDate: { en: "Save the Date", ar: "احفظ الموعد" },
  countdown: { en: "Counting the moments", ar: "نعدّ اللحظات" },
  days: { en: "Days", ar: "أيام" },
  hours: { en: "Hours", ar: "ساعات" },
  minutes: { en: "Minutes", ar: "دقائق" },
  seconds: { en: "Seconds", ar: "ثوانٍ" },
  ourStory: { en: "Our Story", ar: "قصتنا" },
  storySub: { en: "Every great love begins with a single moment.", ar: "كل حب عظيم يبدأ بلحظة واحدة." },
  story1Title: { en: "First Glance", ar: "نظرة أولى" },
  story1Body: { en: "A quiet evening, a shared smile — and everything changed.", ar: "أمسية هادئة، وابتسامة جمعتنا، فتغيّر كل شيء." },
  story1Date: { en: "Spring 2022", ar: "ربيع ٢٠٢٢" },
  story2Title: { en: "The Promise", ar: "الوعد" },
  story2Body: { en: "Under a sky of soft gold, he asked. She said yes.", ar: "تحت سماء ذهبية، سألها فأجابت بنعم." },
  story2Date: { en: "Winter 2025", ar: "شتاء ٢٠٢٥" },
  story3Title: { en: "Engagement", ar: "الخطوبة" },
  story3Body: { en: "Tonight, we celebrate the beginning of forever.", ar: "الليلة، نحتفل ببداية الأبد." },
  story3Date: { en: "Coming Soon", ar: "قريبًا" },
  gallery: { en: "Moments", ar: "لحظات" },
  gallerySub: { en: "Fragments of a love still being written.", ar: "شذرات من حب لا يزال يُكتب." },
  details: { en: "The Celebration", ar: "الحفل" },
  detailsSub: { en: "Join us for an evening of love and light.", ar: "شاركونا أمسية من المحبة والنور." },
  addCalendar: { en: "Add to Calendar", ar: "أضف إلى التقويم" },
  directions: { en: "Get Directions", ar: "الاتجاهات" },
  rsvp: { en: "Will you join us?", ar: "هل ستنضمون إلينا؟" },
  rsvpSub: { en: "Your presence would mean the world.", ar: "حضوركم يعني لنا الكثير." },
  attending: { en: "Joyfully Attending", ar: "سأحضر بكل سعادة" },
  maybe: { en: "Tentative", ar: "ربما" },
  decline: { en: "Sends Love", ar: "أرسل محبتي" },
  rsvpThanks: { en: "Thank you — we can't wait.", ar: "شكرًا لكم — لا نطيق الانتظار." },
  guests: { en: "Guests", ar: "ضيوف" },
  messages: { en: "Wishes from Loved Ones", ar: "كلمات من الأحبّة" },
  messagesSub: { en: "Leave a note we'll cherish forever.", ar: "اتركوا كلمة نحفظها للأبد." },
  yourName: { en: "Your name", ar: "اسمك" },
  yourMessage: { en: "Your message...", ar: "رسالتك..." },
  send: { en: "Send Wishes", ar: "أرسل التهاني" },
  sent: { en: "Sent with love", ar: "أُرسلت بكل حب" },
  rsvpFloat: { en: "RSVP", ar: "أكّد الحضور" },
  language: { en: "العربية", ar: "English" },
  music: { en: "Music", ar: "موسيقى" },
};

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict[k]?.en ?? String(k),
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (k: keyof typeof dict) => dict[k]?.[lang] ?? String(k);
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
