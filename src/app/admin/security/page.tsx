"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function SecurityPage() {
  const [uri, setUri] = useState("");
  const [msg, setMsg] = useState("");
  return (
    <div className="max-w-md rounded-3xl bg-white p-6">
      <h1 className="font-serif text-3xl">Two-step verification</h1>
      <p className="mt-2 text-sm text-muted">Enable an authenticator app for staff accounts.</p>
      <Button
        className="mt-4"
        type="button"
        onClick={async () => {
          const res = await authClient.twoFactor.enable({ password: prompt("Confirm password") || "" });
          if (res.data && "totpURI" in res.data) setUri(String(res.data.totpURI));
          if (res.error) setMsg(res.error.message || "Could not enable");
        }}
      >
        Enable TOTP
      </Button>
      {uri && <p className="mt-4 break-all text-xs">{uri}</p>}
      {msg && <p className="mt-2 text-sm text-error">{msg}</p>}
    </div>
  );
}
