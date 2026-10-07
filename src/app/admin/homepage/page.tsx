import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { toggleSection } from "@/actions/admin";

export default async function HomepageEditor() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const sections = await prisma.homepageSection.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div>
      <h1 className="font-serif text-3xl">Homepage sections</h1>
      <p className="mt-1 text-sm text-muted">Show, hide and keep the calm order. Drag-equivalent: toggle visibility.</p>
      <ul className="mt-6 space-y-2">
        {sections.map((s) => (
          <li key={s.id} className="flex items-center justify-between rounded-2xl bg-white p-4">
            <div>
              <p className="font-medium">{s.title}</p>
              <p className="text-xs text-muted">{s.type}</p>
            </div>
            <form action={toggleSection.bind(null, s.id, !s.visible)}>
              <button className="rounded-full bg-[#fff9f3] px-3 py-1 text-sm">{s.visible ? "Hide" : "Show"}</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
