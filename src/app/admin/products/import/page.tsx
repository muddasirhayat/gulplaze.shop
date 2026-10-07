import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ImportPage() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  return (
    <div>
      <h1 className="font-serif text-3xl">CSV import</h1>
      <p className="mt-2 text-sm text-muted">
        Columns: title, slug, price, compareAt, sku, description, category, brand, ages, stock, image, tags
      </p>
      <form action="/api/admin/import" method="post" encType="multipart/form-data" className="mt-6 rounded-3xl bg-white p-6">
        <input type="file" name="file" accept=".csv" required />
        <button className="ml-3 rounded-full bg-[#f2836b] px-4 py-2 text-sm text-white">Import</button>
      </form>
    </div>
  );
}
