import { listFoldersWithFiles } from "@/scripts/r2";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

console.log("🛠️ update-json aangeroepen");

export async function POST() {
  try {
    const downloads = await listFoldersWithFiles();
    console.log("📁 Gevonden items:", downloads);
    console.log("📤 data.json wordt overschreven");

    const filePath = path.join(process.cwd(), "public", "data.json");
    await fs.writeFile(filePath, JSON.stringify(downloads, null, 2), "utf-8");

    return NextResponse.json({
      status: "success",
      count: Object.keys(downloads).length,
    });
  } catch (error) {
    console.error("Update failed", error);
    return NextResponse.json({ status: "error", error: String(error) }, { status: 500 });
  }
}