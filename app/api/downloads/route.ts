import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const filePath = path.join(process.cwd(), "app", "data", "data.json");

export async function GET() {
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(jsonData);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const newEntry = await request.json();
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  data[newEntry.slug] = {
    title: newEntry.title,
    downloadUrl: newEntry.downloadUrl,
    heroImage: newEntry.heroImage,
  };

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  return NextResponse.json({ success: true });
}
