"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("gp_popup")) return;
    const t = setTimeout(() => setOpen(true), 8000);
    return () => clearTimeout(t);
  }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-4 sm:items-center">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 card-shadow">
        <button className="absolute right-4 top-4" onClick={() => { setOpen(false); localStorage.setItem("gp_popup", "1"); }}>
          <X className="h-4 w-4" />
        </button>
        <h3 className="font-serif text-2xl">A little welcome</h3>
        <p className="mt-2 text-muted">10% off your first order with BLOOM10. Soft notes, never noisy.</p>
        <form
          className="mt-4 flex gap-2"
          action="/api/newsletter"
          method="post"
          onSubmit={() => {
            setOpen(false);
            localStorage.setItem("gp_popup", "1");
          }}
        >
          <input name="email" type="email" required placeholder="Email" className="h-11 flex-1 rounded-full border px-4" />
          <Button type="submit">Join</Button>
        </form>
      </div>
    </div>
  );
}
