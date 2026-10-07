"use client";

import { useMemo, useState } from "react";

const FAQS = [
  { q: "Do you offer Cash on Delivery?", a: "Yes, across Pakistan. We send a short confirmation code to your phone to keep fake orders down." },
  { q: "How long does delivery take?", a: "Karachi, Lahore, Islamabad and Rawalpindi usually 1–3 working days. Other cities 3–5." },
  { q: "Can I exchange baby clothes?", a: "Unused clothing with tags can be exchanged within 7 days. Opened feeding, bath and skincare cannot come back for hygiene." },
  { q: "How do I choose size?", a: "Use Shop by Age plus the size guide. If you are between sizes, we usually suggest the larger one for growing room." },
  { q: "Do you wrap gifts?", a: "Yes. Add gift wrap in the basket and a short message. We keep it simple and tidy." },
];

export default function FaqPage() {
  const [q, setQ] = useState("");
  const items = useMemo(
    () => FAQS.filter((f) => (f.q + f.a).toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  return (
    <div className="container-gp max-w-3xl py-16">
      <h1 className="font-serif text-4xl">FAQ</h1>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" className="mt-6 h-12 w-full rounded-full border px-5" />
      <div className="mt-8 space-y-3">
        {items.map((f) => (
          <details key={f.q} className="rounded-3xl bg-white p-5">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-2 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
