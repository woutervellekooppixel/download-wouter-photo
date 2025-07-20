// scripts/generateDataJson.ts
import fs from "fs";
import path from "path";
import { listOneDriveFolder } from "@/lib/microsoftGraph";

type DataJson = Record<
  string,
  {
    title: string;
    downloadUrl: string;
    heroImage?: string;
  }
>;

function parseFilename(name: string) {
  const base = name.replace(".zip", "");
  const parts = base.split("__");

  if (parts.length !== 4) {
    throw new Error(`❌ Ongeldig bestandsformaat: ${name}`);
  }

  const [slug, title, client, date] = parts;
  return { slug, title: `${title} – ${client}`, date };
}

async function run() {
  const folderPath = "/002 Werkmappen/04 Client folder";
  const items = await listOneDriveFolder(folderPath);

  const zipFiles = items.filter((item) => item.name.endsWith(".zip"));
  const heroImages = items.filter((item) => item.name === "hero.jpg");

  const data: DataJson = {};

  for (const zip of zipFiles) {
    try {
      const { slug, title } = parseFilename(zip.name);

      const hero = heroImages.find(
        (img) =>
          img.parentReference?.id === zip.parentReference?.id &&
          img.name === "hero.jpg"
      );

      data[slug] = {
        title,
        downloadUrl: zip["@microsoft.graph.downloadUrl"],
        ...(hero && { heroImage: hero["@microsoft.graph.downloadUrl"] }),
      };
    } catch (e) {
      console.warn(`⚠️  Bestand overgeslagen (${zip.name}): ${(e as Error).message}`);
    }
  }

  const outputPath = path.join(process.cwd(), "public", "data.json");
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`✅ data.json aangemaakt met ${Object.keys(data).length} items`);
}

run().catch((err) => {
  console.error("❌ Fout bij genereren van data.json:");
  console.error(err);
  process.exit(1);
});