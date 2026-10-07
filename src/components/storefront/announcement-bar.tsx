"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function AnnouncementBar({ messages }: { messages: string[] }) {
  const [i, setI] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (messages.length < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % messages.length), 4000);
    return () => clearInterval(t);
  }, [messages.length]);

  if (hidden || !messages.length) return null;

  return (
    <div className="relative bg-primary text-center text-sm text-text">
      <p className="px-10 py-2">{messages[i]}</p>
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
        onClick={() => setHidden(true)}
        aria-label="Close announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
