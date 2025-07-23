import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, title, client, date, downloadUrl, heroImage } = body;

    const DATA_URL = "https://cdn.wouter.photo/photos/data.json";

    // 1. Haal bestaande data op
    const currentRes = await fetch(DATA_URL, { cache: "no-store" });
    const currentData: Record<string, any> = await currentRes.json();

    // 2. Voeg nieuwe entry toe
    currentData[slug] = {
      title,
      client,
      date,
      downloadUrl,
      heroImage,
    };

    // 3. Upload de bijgewerkte JSON terug naar R2
    const uploadRes = await fetch("https://YOUR-R2-ENDPOINT/photos/data.json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.R2_WRITE_KEY}`,
      },
      body: JSON.stringify(currentData, null, 2),
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Fout in /api/add:", error);
    return NextResponse.json({ error: "Fout bij toevoegen" }, { status: 500 });
  }
}