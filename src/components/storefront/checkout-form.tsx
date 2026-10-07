"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "@/lib/i18n-client";
import { PAKISTAN_CITIES, CITY_AREAS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { placeOrder, sendCodOtp } from "@/actions/checkout";

export function CheckoutForm({
  bank,
  loyalty,
  address,
  defaultName,
  defaultEmail,
  defaultPhone,
}: {
  bank: { bankName: string; bankIban: string; bankAccount: string };
  loyalty: number;
  address: { fullName: string; phone: string; city: string; area: string; address: string } | null;
  defaultName: string;
  defaultEmail: string;
  defaultPhone: string;
}) {
  const t = useTranslations("checkout");
  const [method, setMethod] = useState("cod");
  const [city, setCity] = useState(address?.city ?? "Lahore");
  const [otpSent, setOtpSent] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const areas = CITY_AREAS[city] ?? ["City centre", "Other"];

  return (
    <form
      className="space-y-8"
      action={(form) => {
        start(async () => {
          const res = await placeOrder(form);
          if (res && "ok" in res && !res.ok) setError(res.message || "Could not place order");
        });
      }}
    >
      {error && <p className="rounded-2xl bg-error/10 p-3 text-sm text-error">{error}</p>}
      <section>
        <h2 className="font-serif text-2xl">{t("contact")}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="fullName" required defaultValue={address?.fullName || defaultName} placeholder={t("name")} className="h-12 rounded-2xl border px-4" />
          <input name="phone" required defaultValue={address?.phone || defaultPhone} placeholder={t("phone")} className="h-12 rounded-2xl border px-4" />
          <input name="email" type="email" defaultValue={defaultEmail} placeholder={t("email")} className="h-12 rounded-2xl border px-4 md:col-span-2" />
        </div>
      </section>
      <section>
        <h2 className="font-serif text-2xl">{t("shipping")}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <select name="city" value={city} onChange={(e) => setCity(e.target.value)} className="h-12 rounded-2xl border px-4">
            {PAKISTAN_CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select name="area" defaultValue={address?.area} className="h-12 rounded-2xl border px-4">
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <input name="address" required defaultValue={address?.address} placeholder={t("address")} className="h-12 rounded-2xl border px-4 md:col-span-2" />
          <input name="postal" placeholder={t("postal")} className="h-12 rounded-2xl border px-4" />
          <input name="landmark" placeholder={t("landmark")} className="h-12 rounded-2xl border px-4" />
        </div>
      </section>
      <section>
        <h2 className="font-serif text-2xl">{t("payment")}</h2>
        <div className="mt-4 space-y-2">
          {["cod", "bank_transfer", "jazzcash", "easypaisa", "card"].map((id) => (
            <label key={id} className="flex items-center gap-2 rounded-2xl bg-white p-3">
              <input type="radio" name="paymentMethod" value={id} checked={method === id} onChange={() => setMethod(id)} />
              {t(id === "bank_transfer" ? "bank" : id)}
            </label>
          ))}
        </div>
        {method === "cod" && (
          <div className="mt-4 rounded-2xl bg-sky/40 p-4">
            <p className="text-sm">{t("otp")}</p>
            <div className="mt-2 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const phone = (document.querySelector('input[name="phone"]') as HTMLInputElement)?.value;
                  start(async () => {
                    const r = await sendCodOtp(phone);
                    setOtpSent(r.devCode || "sent");
                  });
                }}
              >
                {t("sendOtp")}
              </Button>
              <input name="otp" placeholder="6-digit code" className="h-11 flex-1 rounded-full border px-4" />
            </div>
            {otpSent && otpSent !== "sent" && <p className="mt-2 text-xs text-muted">Dev code: {otpSent}</p>}
          </div>
        )}
        {method === "bank_transfer" && (
          <div className="mt-4 rounded-2xl bg-white p-4 text-sm">
            <p>
              {bank.bankName} · {bank.bankAccount}
              <br />
              {bank.bankIban}
            </p>
            <label className="mt-3 block">
              {t("receipt")}
              <input type="file" name="receipt" accept="image/*,.pdf" className="mt-1 block" />
            </label>
          </div>
        )}
      </section>
      {loyalty > 0 && (
        <label className="block text-sm">
          Redeem loyalty points (you have {loyalty})
          <input name="loyalty" type="number" min={0} max={loyalty} defaultValue={0} className="mt-1 h-11 w-full rounded-2xl border px-4" />
        </label>
      )}
      <input name="giftCard" placeholder="Gift card code" className="h-12 w-full rounded-2xl border px-4" />
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" required className="mt-1" />
        {t("terms")}
      </label>
      <Button type="submit" disabled={pending} className="w-full">
        {t("place")}
      </Button>
    </form>
  );
}
