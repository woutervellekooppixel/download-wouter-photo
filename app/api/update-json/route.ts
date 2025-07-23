// app/api/update-json/route.ts

import { basicAuthCheck } from "@/lib/auth";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { generateDataFromR2 } from "@/scripts/r2"; // deze moet bestaan!

export async function POST(request: Request) {
  if (!basicAuthCheck(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const data = await generateDataFromR2();
    const filePath = path.join(process.cwd(), "public", "data.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "✅ Succesvol bijgewerkt" });
  } catch (err) {
    console.error("Fout bij updaten van data.json:", err);
    return new NextResponse("Fout bij verwerken", { status: 500 });
  }
}