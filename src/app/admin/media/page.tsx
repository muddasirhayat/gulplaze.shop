import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MediaPage() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 60 });
  return (
    <div>
      <h1 className="font-serif text-3xl">Media library</h1>
      <form action="/api/admin/upload" method="post" encType="multipart/form-data" className="mt-4 rounded-3xl bg-white p-6">
        <input type="file" name="file" accept="image/*,video/*,.pdf" />
        <button className="ml-3 rounded-full bg-[#f2836b] px-4 py-2 text-sm text-white">Upload</button>
        <p className="mt-2 text-xs text-muted">Images are stored in /uploads. Add alt text after upload in the grid.</p>
      </form>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {assets.map((a) => (
          <figure key={a.id} className="rounded-2xl bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.url} alt={a.alt} className="aspect-square w-full rounded-xl object-cover" />
            <figcaption className="truncate pt-1 text-xs">{a.filename}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
