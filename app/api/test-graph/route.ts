// app/api/test-graph/route.ts
import { NextResponse } from "next/server";
import { listOneDriveFolder } from "@/lib/microsoftGraph";

export async function GET() {
  const items = await listOneDriveFolder("/002 Werkmappen/04 Client folder");
  return NextResponse.json(items);
}