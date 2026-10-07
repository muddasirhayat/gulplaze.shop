"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ForgotPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="container-gp max-w-md py-16">
      <h1 className="font-serif text-4xl">Reset password</h1>
      {sent ? (
        <p className="mt-4 text-muted">If that email exists, we sent a reset link (check server logs in development).</p>
      ) : (
        <form
          className="mt-6 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const email = String(new FormData(e.currentTarget).get("email"));
            await authClient.requestPasswordReset({ email, redirectTo: "/account/login" });
            setSent(true);
          }}
        >
          <input name="email" type="email" required className="h-12 w-full rounded-2xl border px-4" placeholder="Email" />
          <Button type="submit">Send link</Button>
        </form>
      )}
    </div>
  );
}
