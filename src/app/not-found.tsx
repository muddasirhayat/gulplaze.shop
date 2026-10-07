import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF9F3] p-8 text-center">
      <h1 className="font-serif text-4xl">This page wandered off</h1>
      <Link href="/" className="mt-6 rounded-full bg-[#F2836B] px-6 py-3 font-semibold text-white">
        Back home
      </Link>
    </div>
  );
}
