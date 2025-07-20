import { NextResponse } from "next/server";
import { listOneDriveFolder } from "@/lib/microsoftGraph";

export async function GET() {
  try {
    const items = await listOneDriveFolder("/002 Werkmappen/04 Client folder");

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error("❌ Fout bij ophalen van OneDrive-folder:");
    console.error(error.response?.data || error.message || error);

    return NextResponse.json(
      {
        success: false,
        error: error.response?.data || error.message || "Onbekende fout",
      },
      { status: 500 }
    );
  }
}