import { prisma } from "@/lib/prisma";
import { getStaffSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { moderateReview } from "@/actions/admin";

export default async function ReviewsAdmin() {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");
  const reviews = await prisma.review.findMany({ include: { product: true }, orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-serif text-3xl">Reviews</h1>
      <ul className="mt-6 space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-2xl bg-white p-4">
            <p className="font-medium">
              {r.authorName} on {r.product.title} · {r.rating}★ · {r.status}
            </p>
            <p className="text-sm text-muted">{r.body}</p>
            <div className="mt-2 flex gap-2">
              <form action={moderateReview.bind(null, r.id, "approved")}>
                <button className="text-sm underline">Approve</button>
              </form>
              <form action={moderateReview.bind(null, r.id, "hidden")}>
                <button className="text-sm underline">Hide</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
