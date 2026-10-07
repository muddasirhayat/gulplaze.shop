"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(!localStorage.getItem("gp_cookies"));
  }, []);
  if (!open) return null;
  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm rounded-2xl bg-white p-4 text-sm card-shadow">
      <p>We use gentle analytics cookies after you agree. See our privacy policy.</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => { localStorage.setItem("gp_cookies", "1"); setOpen(false); }}>
          Agree
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { localStorage.setItem("gp_cookies", "0"); setOpen(false); }}>
          Decline
        </Button>
      </div>
    </div>
  );
}
