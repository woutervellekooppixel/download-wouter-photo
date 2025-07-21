import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const body = await req.json(); // { slug, title, downloadUrl, heroImage }
  const filePath = path.join(process.cwd(), "data", "data.json");

  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  if (data[body.slug]) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
  }

  data[body.slug] = {
    title: body.title,
    downloadUrl: body.downloadUrl,
    heroImage: body.heroImage,
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: true });
}