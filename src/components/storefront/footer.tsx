import { createT } from "@/lib/i18n-server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/storefront/logo";
import { getStoreInfo } from "@/lib/settings";

export async function Footer() {
  const t = await createT("footer");
  const info = await getStoreInfo();
  return (
    <footer className="mt-auto border-t border-black/5 bg-white">
      <div className="container-gp grid gap-10 py-16 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">{t("about")}</p>
        </div>
        <div>
          <h3 className="font-serif text-lg">{t("quick")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/shop">Shop all</Link></li>
            <li><Link href="/category/newborn">Newborn</Link></li>
            <li><Link href="/gifts">Gifts</Link></li>
            <li><Link href="/sale">Sale</Link></li>
            <li><Link href="/brands">Brands</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg">{t("care")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/size-guide">Size guides</Link></li>
            <li><Link href="/order/track">Track order</Link></li>
            <li><Link href="/blog">Journal</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg">{t("policies")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link href="/policies/shipping">Shipping</Link></li>
            <li><Link href="/policies/returns">Returns</Link></li>
            <li><Link href="/policies/hygiene">Hygiene</Link></li>
            <li><Link href="/policies/privacy">Privacy</Link></li>
            <li><Link href="/policies/terms">Terms</Link></li>
          </ul>
          <p className="mt-4 text-sm">
            {info.phone}
            <br />
            {info.email}
          </p>
        </div>
      </div>
      <div className="border-t border-black/5 py-4 text-center text-xs text-muted">
        <p>
          © {new Date().getFullYear()} GulPlaze. {t("rights")} COD · JazzCash · Easypaisa · Bank · Card
        </p>
      </div>
    </footer>
  );
}
