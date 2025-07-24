import { NextRequest, NextResponse } from "next/server";
import { R2Client } from "@/lib/r2-client";
import { generateSlugFromTitle } from "@/utils/slugify";
import { updateDataJson } from "@/utils/updateDataJson";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const zipFile = formData.get("zip") as File;
    const heroFile = formData.get("hero") as File;
    const title = formData.get("title") as string;

    if (!zipFile || !heroFile || !title) {
      return NextResponse.json({ success: false, error: "Ontbrekende gegevens" });
    }

    const slug = generateSlugFromTitle(title);
    const r2 = new R2Client(slug);

    // Upload ZIP
    await r2.uploadFile(zipFile, "zip");

    // Upload hero
    await r2.uploadFile(heroFile, "hero");

    // Update data.json
    await updateDataJson(slug, {
      slug,
      title,
      downloadUrl: r2.getPublicUrl("zip"),
      heroImage: r2.getPublicUrl("hero"),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}