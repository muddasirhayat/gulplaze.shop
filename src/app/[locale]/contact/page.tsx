import { getStoreInfo } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function ContactPage() {
  const info = await getStoreInfo();
  async function send(form: FormData) {
    "use server";
    await prisma.contactMessage.create({
      data: {
        name: String(form.get("name")),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
        message: String(form.get("message")),
      },
    });
    await prisma.notificationInbox.create({
      data: { type: "contact", title: "New contact message", body: String(form.get("name")) },
    });
    redirect("/contact?sent=1");
  }
  return (
    <div className="container-gp grid gap-12 py-16 md:grid-cols-2">
      <div>
        <h1 className="font-serif text-4xl">Contact</h1>
        <p className="mt-3 text-muted">A small team in Lahore. We reply on working days, usually within a few hours.</p>
        <p className="mt-6">
          {info.phone}
          <br />
          {info.email}
          <br />
          {info.address}
        </p>
        <a className="mt-4 inline-block underline" href={`https://wa.me/${info.whatsapp}`}>
          WhatsApp
        </a>
        <div className="mt-8 h-56 overflow-hidden rounded-3xl bg-sky/50">
          <iframe
            title="Map"
            className="h-full w-full border-0"
            src="https://maps.google.com/maps?q=DHA%20Lahore&t=&z=13&ie=UTF8&iwloc=&output=embed"
          />
        </div>
      </div>
      <form action={send} className="space-y-3 rounded-3xl bg-white p-6 card-shadow">
        <input name="name" required placeholder="Name" className="h-12 w-full rounded-2xl border px-4" />
        <input name="email" placeholder="Email" className="h-12 w-full rounded-2xl border px-4" />
        <input name="phone" placeholder="Phone" className="h-12 w-full rounded-2xl border px-4" />
        <textarea name="message" required rows={5} placeholder="Message" className="w-full rounded-2xl border p-4" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
