import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function DELETE(req: Request) {
  const { slug } = await req.json();
  const filePath = path.join(process.cwd(), "data", "data.json");

  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  if (!data[slug]) {
    return NextResponse.json({ error: "Slug not found" }, { status: 404 });
  }

  delete data[slug];
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return NextResponse.json({ success: true });
}