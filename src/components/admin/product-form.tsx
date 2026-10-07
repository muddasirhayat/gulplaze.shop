"use client";

import { useState } from "react";
import { AGE_RANGES } from "@/lib/constants";
import { saveProduct } from "@/actions/admin";
import { Button } from "@/components/ui/button";

type Cat = { id: string; name: string };
type Brand = { id: string; name: string };
type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAt: number | null;
  costPrice: number | null;
  sku: string | null;
  material: string;
  care: string;
  safety: string;
  status: string;
  gender: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  giftReady: boolean;
  featured: boolean;
  bestSeller: boolean;
  categoryId: string | null;
  brandId: string | null;
  ages: { ageKey: string }[];
  variants: { sku: string; stock: number; size: string; color: string }[];
  images: { url: string }[];
};

export function ProductForm({
  categories,
  brands,
  product,
}: {
  categories: Cat[];
  brands: Brand[];
  product?: Product;
}) {
  const [step, setStep] = useState(0);
  const steps = ["Info", "Media", "Pricing", "Variants", "Inventory", "Details", "SEO", "Status"];
  const v = product?.variants[0];

  return (
    <form action={saveProduct} className="mt-6 max-w-2xl space-y-4 rounded-3xl bg-white p-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="flex flex-wrap gap-2 text-xs">
        {steps.map((s, i) => (
          <button type="button" key={s} onClick={() => setStep(i)} className={`rounded-full px-3 py-1 ${step === i ? "bg-[#a8c3a0]" : "bg-[#fff9f3]"}`}>
            {i + 1}. {s}
          </button>
        ))}
      </div>
      {step === 0 && (
        <>
          <input name="title" required defaultValue={product?.title} placeholder="Title" className="h-11 w-full rounded-2xl border px-3" />
          <input name="slug" defaultValue={product?.slug} placeholder="URL slug" className="h-11 w-full rounded-2xl border px-3" />
          <textarea name="description" defaultValue={product?.description} rows={5} className="w-full rounded-2xl border p-3" placeholder="Description" />
          <select name="categoryId" defaultValue={product?.categoryId ?? ""} className="h-11 w-full rounded-2xl border px-3">
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select name="brandId" defaultValue={product?.brandId ?? ""} className="h-11 w-full rounded-2xl border px-3">
            <option value="">Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <input name="tags" defaultValue={product ? JSON.parse(product.tags || "[]").join(", ") : ""} placeholder="Tags" className="h-11 w-full rounded-2xl border px-3" />
        </>
      )}
      {step === 1 && (
        <input name="imageUrl" defaultValue={product?.images[0]?.url} placeholder="Image URL" className="h-11 w-full rounded-2xl border px-3" />
      )}
      {step === 2 && (
        <>
          <input name="price" type="number" required defaultValue={product?.price} placeholder="Price PKR" className="h-11 w-full rounded-2xl border px-3" />
          <input name="compareAt" type="number" defaultValue={product?.compareAt ?? ""} placeholder="Compare at" className="h-11 w-full rounded-2xl border px-3" />
          <input name="costPrice" type="number" defaultValue={product?.costPrice ?? ""} placeholder="Cost price" className="h-11 w-full rounded-2xl border px-3" />
        </>
      )}
      {step === 3 && (
        <>
          <input name="size" defaultValue={v?.size} placeholder="Size" className="h-11 w-full rounded-2xl border px-3" />
          <input name="color" defaultValue={v?.color} placeholder="Color" className="h-11 w-full rounded-2xl border px-3" />
          <p className="text-sm">Age ranges (comma keys)</p>
          <input
            name="ages"
            defaultValue={product?.ages.map((a) => a.ageKey).join(",") || "0-3m"}
            className="h-11 w-full rounded-2xl border px-3"
          />
          <p className="text-xs text-muted">{AGE_RANGES.map((a) => a.key).join(", ")}</p>
        </>
      )}
      {step === 4 && (
        <>
          <input name="sku" defaultValue={product?.sku ?? ""} placeholder="SKU" className="h-11 w-full rounded-2xl border px-3" />
          <input name="variantSku" defaultValue={v?.sku} placeholder="Variant SKU" className="h-11 w-full rounded-2xl border px-3" />
          <input name="stock" type="number" defaultValue={v?.stock ?? 10} className="h-11 w-full rounded-2xl border px-3" />
        </>
      )}
      {step === 5 && (
        <>
          <input name="material" defaultValue={product?.material} placeholder="Material" className="h-11 w-full rounded-2xl border px-3" />
          <textarea name="care" defaultValue={product?.care} placeholder="Care" className="w-full rounded-2xl border p-3" />
          <textarea name="safety" defaultValue={product?.safety} placeholder="Safety" className="w-full rounded-2xl border p-3" />
          <select name="gender" defaultValue={product?.gender} className="h-11 w-full rounded-2xl border px-3">
            <option value="unisex">Unisex</option>
            <option value="girl">Girl</option>
            <option value="boy">Boy</option>
          </select>
          <label className="flex gap-2 text-sm">
            <input type="checkbox" name="giftReady" defaultChecked={product?.giftReady} /> Gift ready
          </label>
          <label className="flex gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={product?.featured} /> Featured
          </label>
          <label className="flex gap-2 text-sm">
            <input type="checkbox" name="bestSeller" defaultChecked={product?.bestSeller} /> Best seller
          </label>
        </>
      )}
      {step === 6 && (
        <>
          <input name="metaTitle" defaultValue={product?.metaTitle} placeholder="Meta title" className="h-11 w-full rounded-2xl border px-3" />
          <textarea name="metaDescription" defaultValue={product?.metaDescription} placeholder="Meta description" className="w-full rounded-2xl border p-3" />
        </>
      )}
      {step === 7 && (
        <select name="status" defaultValue={product?.status ?? "draft"} className="h-11 w-full rounded-2xl border px-3">
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      )}
      <div className="flex gap-2">
        {step > 0 && (
          <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)}>
            Next
          </Button>
        ) : (
          <Button type="submit">Save product</Button>
        )}
      </div>
    </form>
  );
}
