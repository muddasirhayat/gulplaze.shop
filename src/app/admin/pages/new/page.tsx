import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { savePage } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export default async function NewPage() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  return (
    <form action={savePage} className="max-w-2xl space-y-3 rounded-3xl bg-white p-6">
      <h1 className="font-serif text-3xl">New page</h1>
      <input name="title" required placeholder="Title" className="h-11 w-full rounded-2xl border px-3" />
      <input name="slug" placeholder="slug" className="h-11 w-full rounded-2xl border px-3" />
      <textarea name="body" rows={12} className="w-full rounded-2xl border p-3" />
      <Button type="submit">Publish</Button>
    </form>
  );
}
