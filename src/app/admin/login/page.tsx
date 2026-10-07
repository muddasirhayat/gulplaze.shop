"use client";

import { useState } from "react";
import { signIn, authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [twoFa, setTwoFa] = useState(false);

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <form
        className="w-full rounded-3xl bg-white p-8 shadow-sm"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          if (twoFa) {
            const code = String(form.get("code"));
            const res = await authClient.twoFactor.verifyTotp({ code });
            if (res.error) setError(res.error.message || "Invalid code");
            else window.location.href = "/admin";
            return;
          }
          const res = await signIn.email({
            email: String(form.get("email")),
            password: String(form.get("password")),
          });
          if (res.error) {
            setError(res.error.message || "Sign in failed");
            return;
          }
          if (res.data && "twoFactorRedirect" in res.data && res.data.twoFactorRedirect) {
            setTwoFa(true);
            return;
          }
          window.location.href = "/admin";
        }}
      >
        <h1 className="font-serif text-3xl">Staff login</h1>
        <p className="mt-1 text-sm text-muted">Two-step verification is available after you enable TOTP.</p>
        {error && <p className="mt-3 text-sm text-error">{error}</p>}
        {!twoFa ? (
          <>
            <input name="email" type="email" required defaultValue="admin@gulplaze.shop" className="mt-6 h-12 w-full rounded-2xl border px-4" />
            <input name="password" type="password" required className="mt-3 h-12 w-full rounded-2xl border px-4" placeholder="Password" />
          </>
        ) : (
          <input name="code" required placeholder="Authenticator code" className="mt-6 h-12 w-full rounded-2xl border px-4" />
        )}
        <Button type="submit" className="mt-4 w-full">
          Continue
        </Button>
      </form>
    </div>
  );
}
