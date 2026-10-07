import Link from "next/link";
import { getStaffSession } from "@/lib/auth";

const NAV = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Orders", "/admin/orders"],
  ["Customers", "/admin/customers"],
  ["Media", "/admin/media"],
  ["Homepage", "/admin/homepage"],
  ["Pages", "/admin/pages"],
  ["Blog", "/admin/blog"],
  ["Menus", "/admin/menus"],
  ["Discounts", "/admin/discounts"],
  ["Reviews", "/admin/reviews"],
  ["Reports", "/admin/reports"],
  ["Inbox", "/admin/inbox"],
  ["Settings", "/admin/settings"],
  ["Security", "/admin/security"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getStaffSession();
  if (!session) {
    return <div className="min-h-screen bg-[#f4f1ea] text-[#2b2b2b]">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#f4f1ea] text-[#2b2b2b]">
      <aside className="hidden w-56 shrink-0 border-r border-black/5 bg-white p-4 md:block">
        <Link href="/admin" className="font-serif text-xl lowercase">
          gulplaze
        </Link>
        <p className="text-xs text-muted">{(session.user as { role?: string }).role}</p>
        <nav className="mt-6 flex flex-col gap-1 text-sm">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-xl px-3 py-2 hover:bg-[#fff9f3]">
              {label}
            </Link>
          ))}
          <Link href="/" className="mt-6 px-3 text-xs text-muted">
            View store
          </Link>
        </nav>
      </aside>
      <div className="flex-1">
        <div className="flex gap-2 overflow-x-auto border-b bg-white p-3 text-sm md:hidden">
          {NAV.slice(0, 6).map(([label, href]) => (
            <Link key={href} href={href} className="whitespace-nowrap rounded-full bg-[#fff9f3] px-3 py-1">
              {label}
            </Link>
          ))}
        </div>
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
