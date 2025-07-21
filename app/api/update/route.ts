import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PUT(req: Request) {
  const { slug, title, downloadUrl, heroImage } = await req.json();
  const filePath = path.join(process.cwd(), "data", "data.json");

  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  if (!data[slug]) {
    return NextResponse.json({ error: "Slug not found" }, { status: 404 });
  }

  data[slug] = { title, downloadUrl, heroImage };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: true });
}