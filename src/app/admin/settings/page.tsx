import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStoreInfo, getTheme } from "@/lib/settings";
import { addRedirect, saveStoreInfo, saveTheme } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const [info, theme, redirects, logs] = await Promise.all([
    getStoreInfo(),
    getTheme(),
    prisma.redirect.findMany(),
    prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 12 }),
  ]);
  return (
    <div className="space-y-10">
      <h1 className="font-serif text-3xl">Settings</h1>
      <form action={saveStoreInfo} className="grid gap-3 rounded-3xl bg-white p-6 md:grid-cols-2">
        <h2 className="font-serif text-xl md:col-span-2">Store</h2>
        <input name="name" defaultValue={info.name} className="h-11 rounded-2xl border px-3" />
        <input name="email" defaultValue={info.email} className="h-11 rounded-2xl border px-3" />
        <input name="phone" defaultValue={info.phone} className="h-11 rounded-2xl border px-3" />
        <input name="whatsapp" defaultValue={info.whatsapp} className="h-11 rounded-2xl border px-3" />
        <input name="address" defaultValue={info.address} className="h-11 rounded-2xl border px-3 md:col-span-2" />
        <input name="freeShippingThreshold" type="number" defaultValue={info.freeShippingThreshold} className="h-11 rounded-2xl border px-3" />
        <input name="giftWrapPrice" type="number" defaultValue={info.giftWrapPrice} className="h-11 rounded-2xl border px-3" />
        <Button type="submit" className="md:col-span-2">
          Save store
        </Button>
      </form>
      <form action={saveTheme} className="grid gap-3 rounded-3xl bg-white p-6 md:grid-cols-2">
        <h2 className="font-serif text-xl md:col-span-2">Theme</h2>
        <input name="logoText" defaultValue={theme.logoText} className="h-11 rounded-2xl border px-3" />
        <input name="background" defaultValue={theme.background} className="h-11 rounded-2xl border px-3" />
        <input name="primary" defaultValue={theme.primary} className="h-11 rounded-2xl border px-3" />
        <input name="cta" defaultValue={theme.cta} className="h-11 rounded-2xl border px-3" />
        <input name="radius" defaultValue={theme.radius} className="h-11 rounded-2xl border px-3" />
        <Button type="submit">Save theme</Button>
      </form>
      <form action={addRedirect} className="flex gap-2 rounded-3xl bg-white p-6">
        <input name="from" placeholder="/old" className="h-11 flex-1 rounded-2xl border px-3" />
        <input name="to" placeholder="/new" className="h-11 flex-1 rounded-2xl border px-3" />
        <Button type="submit">Add redirect</Button>
      </form>
      <ul className="text-sm">
        {redirects.map((r) => (
          <li key={r.id}>
            {r.from} → {r.to}
          </li>
        ))}
      </ul>
      <div>
        <h2 className="font-serif text-xl">Activity</h2>
        <ul className="mt-2 text-sm text-muted">
          {logs.map((l) => (
            <li key={l.id}>
              {l.action} {l.target} · {l.createdAt.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
