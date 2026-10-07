import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { savePost } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <form action={savePost} className="max-w-2xl space-y-3 rounded-3xl bg-white p-6">
      <input type="hidden" name="id" value={post.id} />
      <h1 className="font-serif text-3xl">Edit post</h1>
      <input name="title" defaultValue={post.title} className="h-11 w-full rounded-2xl border px-3" />
      <input name="slug" defaultValue={post.slug} className="h-11 w-full rounded-2xl border px-3" />
      <input name="excerpt" defaultValue={post.excerpt} className="h-11 w-full rounded-2xl border px-3" />
      <input name="cover" defaultValue={post.cover} className="h-11 w-full rounded-2xl border px-3" />
      <textarea name="body" defaultValue={post.body} rows={12} className="w-full rounded-2xl border p-3" />
      <select name="status" defaultValue={post.status} className="h-11 rounded-2xl border px-3">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <Button type="submit">Save</Button>
    </form>
  );
}
