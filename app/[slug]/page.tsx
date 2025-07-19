import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import DownloadCard from "@/components/DownloadCard";
import { transformToDirectLink } from "@/scripts/transformToDirectLink";

type DownloadInfo = {
  title: string;
  client: string;
  date: string;
  downloadUrl: string;
  heroImage?: string;
};

export default async function DownloadPage({
  params,
}: {
  params: { slug: string };
}) {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data: Record<string, DownloadInfo> = JSON.parse(jsonData);

  const download = data[params.slug];
  if (!download) notFound();

  const { title, client, date, downloadUrl, heroImage } = download;
  const transformedUrl = transformToDirectLink(downloadUrl);
  const heroImageUrl = heroImage
    ? transformToDirectLink(heroImage)
    : "/hero.jpg";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div
        className="flex-1 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('${heroImageUrl}')` }}
      >
        <DownloadCard
          title={title}
          client={client}
          date={date}
          downloadUrl={transformedUrl}
        />
      </div>
    </div>
  );
}
