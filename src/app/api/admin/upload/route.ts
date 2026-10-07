import { NextRequest, NextResponse } from "next/server";
import { getStaffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const session = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.redirect(new URL("/admin/media", req.url));
  const bytes = Buffer.from(await file.arrayBuffer());
  const safe = file.name.replace(/[^\w.\-]+/g, "_");
  const dir = path.join(process.cwd(), "public/uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safe), bytes);
  const url = `/uploads/${safe}`;
  await prisma.mediaAsset.create({
    data: {
      url,
      filename: safe,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      alt: "",
    },
  });
  return NextResponse.redirect(new URL("/admin/media", req.url));
}
