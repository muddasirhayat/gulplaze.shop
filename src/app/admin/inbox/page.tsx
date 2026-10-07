import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function InboxPage() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const notes = await prisma.notificationInbox.findMany({ orderBy: { createdAt: "desc" }, take: 40 });
  return (
    <div>
      <h1 className="font-serif text-3xl">Inbox</h1>
      <ul className="mt-6 space-y-2">
        {notes.map((n) => (
          <li key={n.id} className="rounded-2xl bg-white p-4">
            <p className="font-medium">{n.title}</p>
            <p className="text-sm text-muted">{n.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
