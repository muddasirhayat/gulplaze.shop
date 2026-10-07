import { Link } from "@/i18n/navigation";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`} aria-label="GulPlaze home">
      <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden>
        <circle cx="32" cy="36" r="9" fill="#A8C3A0" />
        <circle cx="22" cy="22" r="9" fill="#F4C7C3" />
        <circle cx="42" cy="22" r="9" fill="#CFE3F1" />
        <circle cx="22" cy="42" r="9" fill="#CFE3F1" />
        <circle cx="42" cy="42" r="9" fill="#A8C3A0" />
        <circle cx="32" cy="32" r="7" fill="#F2836B" />
      </svg>
      <span className="font-serif text-2xl tracking-tight lowercase">gulplaze</span>
    </Link>
  );
}
