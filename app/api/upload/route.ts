import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

const R2 = new S3Client({
  region: process.env.R2_REGION!,
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const slug = formData.get("slug");
  const zip = formData.get("zip") as File;
  const hero = formData.get("hero") as File;
  const images = formData.getAll("images") as File[];

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ success: false, error: "Ontbrekende foldernaam." });
  }

  const folder = `photos/${slug}/`;

  async function uploadToR2(file: File, key: string) {
    const buffer = Buffer.from(await file.arrayBuffer());
    await R2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }));
  }

  try {
    // Upload zip en hero
    await uploadToR2(zip, `${folder}${uuidv4()}-${zip.name}`);
    await uploadToR2(hero, `${folder}hero.jpg`);

    // Upload foto's
    for (const img of images) {
      const parts = img.webkitRelativePath.split("/").slice(1); // skip root
      const key = `${folder}${parts.join("/")}`;
      await uploadToR2(img, key);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Uploadfout:", e);
    return NextResponse.json({ success: false, error: "Upload naar R2 mislukt." });
  }
}