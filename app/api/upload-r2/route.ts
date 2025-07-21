// app/api/upload-r2/route.ts
import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  const uploaded: { name: string; url: string }[] = [];

  for (const file of files) {
    const key = file.name;
    const url = await uploadToR2(file, key);
    uploaded.push({ name: key, url });
  }

  return NextResponse.json({ uploaded });
}