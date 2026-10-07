"use client";

import { useTransition } from "react";
import { Link } from "@/i18n/navigation";
import { formatPkr } from "@/lib/money";
import { removeCartItem, updateCartItem } from "@/actions/cart";

export function CartLineControls({
  items,
}: {
  items: {
    id: string;
    quantity: number;
    product: { title: string; slug: string; price: number; images: { url: string }[] };
    variant: { name: string; price: number | null } | null;
  }[];
}) {
  const [, start] = useTransition();
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex gap-4 rounded-3xl bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.product.images[0]?.url} alt="" className="h-28 w-24 rounded-2xl object-cover" />
          <div className="flex-1">
            <Link href={`/product/${item.product.slug}`} className="font-medium">
              {item.product.title}
            </Link>
            <p className="text-sm text-muted">{item.variant?.name}</p>
            <p className="mt-1">{formatPkr(item.variant?.price ?? item.product.price)}</p>
            <div className="mt-2 flex gap-2">
              <button className="h-8 w-8 rounded-full border" onClick={() => start(() => updateCartItem(item.id, item.quantity - 1))}>
                −
              </button>
              <span>{item.quantity}</span>
              <button className="h-8 w-8 rounded-full border" onClick={() => start(() => updateCartItem(item.id, item.quantity + 1))}>
                +
              </button>
              <button className="ml-4 text-sm text-muted" onClick={() => start(() => removeCartItem(item.id))}>
                Remove
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
