import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function BlogAdmin() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="font-serif text-3xl">Journal</h1>
        <Link href="/admin/blog/new" className="rounded-full bg-[#f2836b] px-4 py-2 text-sm text-white">
          New post
        </Link>
      </div>
      <ul className="mt-6 space-y-2">
        {posts.map((p) => (
          <li key={p.id} className="rounded-2xl bg-white p-4">
            <Link href={`/admin/blog/${p.id}`} className="underline">
              {p.title}
            </Link>{" "}
            <span className="text-sm text-muted">{p.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
