import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { savePage } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id }, include: { revisions: { take: 5, orderBy: { createdAt: "desc" } } } });
  if (!page) notFound();
  return (
    <form action={savePage} className="max-w-2xl space-y-3 rounded-3xl bg-white p-6">
      <input type="hidden" name="id" value={page.id} />
      <h1 className="font-serif text-3xl">Edit page</h1>
      <input name="title" defaultValue={page.title} className="h-11 w-full rounded-2xl border px-3" />
      <input name="slug" defaultValue={page.slug} className="h-11 w-full rounded-2xl border px-3" />
      <textarea name="body" defaultValue={page.body} rows={14} className="w-full rounded-2xl border p-3" />
      <Button type="submit">Save</Button>
      <p className="text-xs text-muted">{page.revisions.length} revisions stored</p>
    </form>
  );
}
