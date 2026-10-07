import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { saveMenu } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export default async function MenusPage() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const menus = await prisma.menu.findMany();
  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl">Menus</h1>
      {menus.map((m) => (
        <form
          key={m.id}
          action={async (form) => {
            "use server";
            await saveMenu(m.handle, String(form.get("items") || "[]"));
          }}
          className="rounded-3xl bg-white p-6"
        >
          <h2 className="font-medium">{m.handle}</h2>
          <textarea name="items" defaultValue={JSON.stringify(JSON.parse(m.items), null, 2)} rows={8} className="mt-2 w-full rounded-2xl border p-3 font-mono text-xs" />
          <Button type="submit" className="mt-3" size="sm">
            Save
          </Button>
        </form>
      ))}
    </div>
  );
}
