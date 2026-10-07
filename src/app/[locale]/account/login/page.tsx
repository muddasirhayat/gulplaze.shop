"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");

  return (
    <div className="container-gp max-w-md py-16">
      <h1 className="font-serif text-4xl">{mode === "login" ? "Sign in" : "Create account"}</h1>
      <p className="mt-2 text-muted">Email or phone, whichever you prefer. Guest checkout is always available.</p>
      {error && <p className="mt-4 text-sm text-error">{error}</p>}
      <form
        className="mt-6 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const email = String(form.get("email"));
          const password = String(form.get("password"));
          const name = String(form.get("name") || "");
          const phone = String(form.get("phone") || "");
          if (mode === "register") {
            const res = await signUp.email({ email, password, name });
            if (res.error) setError(res.error.message || "Could not register");
            else {
              if (phone) {
                await fetch("/api/profile-phone", {
                  method: "POST",
                  body: JSON.stringify({ phone }),
                });
              }
              window.location.href = "/account";
            }
          } else {
            const res = await signIn.email({ email, password });
            if (res.error) setError(res.error.message || "Could not sign in");
            else window.location.href = "/account";
          }
        }}
      >
        {mode === "register" && (
          <input name="name" required placeholder="Name" className="h-12 w-full rounded-2xl border px-4" />
        )}
        <input name="email" type="email" required placeholder="Email" className="h-12 w-full rounded-2xl border px-4" />
        {mode === "register" && (
          <input name="phone" placeholder="Phone" className="h-12 w-full rounded-2xl border px-4" />
        )}
        <input name="password" type="password" required minLength={8} placeholder="Password" className="h-12 w-full rounded-2xl border px-4" />
        <Button type="submit" className="w-full">
          {mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>
      <Button
        type="button"
        variant="secondary"
        className="mt-3 w-full"
        onClick={() => signIn.social({ provider: "google", callbackURL: "/account" })}
      >
        Continue with Google
      </Button>
      <p className="mt-4 text-sm">
        <button className="underline" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Need an account?" : "Already have one?"}
        </button>
        {" · "}
        <Link href="/account/forgot" className="underline">
          Forgot password
        </Link>
      </p>
    </div>
  );
}
