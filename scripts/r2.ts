import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function listFoldersWithFiles() {
  const result = await s3.send(
    new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET,
      Delimiter: "/",
    })
  );

  const folders = result.CommonPrefixes?.map((prefix) => prefix.Prefix?.replace(/\/$/, "")) || [];
  const allDownloads: {
    [slug: string]: {
      title: string;
      downloadUrl: string;
      heroImage: string;
    };
  } = {};

  for (const folder of folders) {
    const objects = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET,
        Prefix: `${folder}/`,
      })
    );

    const files = objects.Contents || [];
    const zip = files.find((f) => f.Key?.endsWith(".zip"));
    const jpg = files.find((f) => f.Key?.endsWith(".jpg") || f.Key?.endsWith(".jpeg"));

    if (!zip || !jpg || !folder) continue;

    const slug = folder;
    allDownloads[slug] = {
      title: folder.replace(/[-_]/g, " "),
      downloadUrl: `${process.env.R2_PUBLIC_URL}/${zip.Key}`,
      heroImage: `${process.env.R2_PUBLIC_URL}/${jpg.Key}`,
    };
  }

  return allDownloads;
}