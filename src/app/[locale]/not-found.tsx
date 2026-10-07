import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-gp py-24 text-center">
      <p className="text-sm uppercase tracking-widest">404</p>
      <h1 className="mt-2 font-serif text-4xl">This page wandered off</h1>
      <p className="mt-3 text-muted">Try a search, or start from Shop by Age.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/shop">
          <Button>Shop all</Button>
        </Link>
        <Link href="/age/0-3m">
          <Button variant="secondary">Newborn</Button>
        </Link>
      </div>
    </div>
  );
}
