import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const accessKeyId = process.env.R2_ACCESS_KEY_ID!;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY!;
const bucket = process.env.R2_BUCKET!;
const endpoint = process.env.R2_ENDPOINT!;
const publicUrl = process.env.R2_PUBLIC_URL!;

const client = new S3Client({
  region: "auto",
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

function isImage(fileName: string) {
  return /\.(jpe?g|png|webp)$/i.test(fileName);
}

function isZip(fileName: string) {
  return /\.zip$/i.test(fileName);
}

export async function GET() {
  try {
    const list = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: "photos/",
        Delimiter: "/",
      })
    );

    const folders = list.CommonPrefixes?.map((prefix) => prefix.Prefix!) || [];

    const data: Record<string, any> = {};

    for (const folder of folders) {
      const slug = folder.replace("photos/", "").replace("/", "");

      const contents = await client.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: folder,
        })
      );

      const files = contents.Contents?.map((f) => f.Key!) || [];

      const zip = files.find((f) => isZip(f));
      const hero = files.find((f) => isImage(f) && f.endsWith("hero.jpg"));

      // Verzamel submappen met images
      const galleryFolders = files
        .filter((f) => f !== hero && f !== zip && isImage(f))
        .reduce((acc, f) => {
          const parts = f.replace(folder, "").split("/");
          if (parts.length >= 2) {
            const [sub, filename] = parts;
            acc[sub] = acc[sub] || [];
            acc[sub].push(`${publicUrl}/${f}`);
          }
          return acc;
        }, {} as Record<string, string[]>);

      data[slug] = {
        title: slug.replace(/_/g, " "),
        client: "",
        date: "",
        downloadUrl: zip ? `${publicUrl}/${zip}` : "",
        heroImage: hero ? `${publicUrl}/${hero}` : "",
        gallery: Object.keys(galleryFolders).length > 0 ? galleryFolders : undefined,
      };
    }

    // Upload de JSON naar R2
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: "photos/data.json",
        Body: JSON.stringify(data, null, 2),
        ContentType: "application/json",
      })
    );

    return NextResponse.json({ success: true, updated: Object.keys(data).length });
  } catch (err) {
    console.error("❌ Error in /api/update-json:", err);
    return NextResponse.json({ error: "update-json failed" }, { status: 500 });
  }
}