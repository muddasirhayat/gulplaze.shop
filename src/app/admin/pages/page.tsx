import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PagesAdmin() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const pages = await prisma.page.findMany({ orderBy: { title: "asc" } });
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-serif text-3xl">Pages</h1>
        <Link href="/admin/pages/new" className="rounded-full bg-[#f2836b] px-4 py-2 text-sm text-white">
          New page
        </Link>
      </div>
      <ul className="mt-6 space-y-2">
        {pages.map((p) => (
          <li key={p.id} className="rounded-2xl bg-white p-4">
            <Link href={`/admin/pages/${p.id}`} className="underline">
              {p.title}
            </Link>
            <span className="text-sm text-muted"> /{p.slug}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
