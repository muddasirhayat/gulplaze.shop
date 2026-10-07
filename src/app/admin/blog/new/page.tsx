import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { savePost } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export default async function NewPost() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  return (
    <form action={savePost} className="max-w-2xl space-y-3 rounded-3xl bg-white p-6">
      <h1 className="font-serif text-3xl">New post</h1>
      <input name="title" required placeholder="Title" className="h-11 w-full rounded-2xl border px-3" />
      <input name="slug" placeholder="slug" className="h-11 w-full rounded-2xl border px-3" />
      <input name="excerpt" placeholder="Excerpt" className="h-11 w-full rounded-2xl border px-3" />
      <input name="cover" placeholder="Cover image URL" className="h-11 w-full rounded-2xl border px-3" />
      <textarea name="body" rows={12} className="w-full rounded-2xl border p-3" placeholder="HTML or rich text" />
      <select name="status" className="h-11 rounded-2xl border px-3">
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
      <Button type="submit">Save</Button>
    </form>
  );
}
