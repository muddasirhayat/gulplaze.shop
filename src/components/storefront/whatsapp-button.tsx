import { getStoreInfo } from "@/lib/settings";

export async function WhatsAppButton() {
  const info = await getStoreInfo();
  const href = `https://wa.me/${info.whatsapp}?text=${encodeURIComponent("Hello GulPlaze, I have a question.")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
        <path d="M20.5 3.5A11 11 0 0 0 2.1 16.7L1 23l6.5-1.7A11 11 0 0 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-3.9 1 1-3.8-.2-.3A9 9 0 1 1 12 20.5Zm5-6.7c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.1 8.1 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.3-.4c.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3s-1 1-1 2.4 1 2.8 1.2 3a10.3 10.3 0 0 0 4 3.5c.6.3 1 .4 1.4.3.4-.1 1.3-.5 1.5-1s.2-.9.1-1-.3-.2-.6-.3Z" />
      </svg>
    </a>
  );
}
