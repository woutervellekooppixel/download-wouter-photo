import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

const filePath = path.join(process.cwd(), "app", "data", "data.json");

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  delete data[params.slug];

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  return NextResponse.json({ success: true });
}
