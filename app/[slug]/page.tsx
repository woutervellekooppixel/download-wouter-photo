import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import { transformToDirectLink } from "@/scripts/transformToDirectLink";
import DownloadCard from "@/components/DownloadCard";

type DownloadInfo = {
  title: string;
  client: string;
  date: string;
  originalUrl: string;
  heroImage?: string;
};

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  return Object.keys(data).map((slug) => ({ slug }));
}

export default function DownloadPage({ params }: PageProps) {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data: Record<string, DownloadInfo> = JSON.parse(jsonData);

  const download = data[params.slug];
  if (!download) notFound();

  const { title, client, date, originalUrl, heroImage } = download;
  const downloadUrl = transformToDirectLink(originalUrl);
  const heroImageUrl = heroImage ? transformToDirectLink(heroImage) : "/hero.jpg";

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div
        className="flex-1 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url("${heroImageUrl}")` }}
      >
        <DownloadCard
          title={title}
          client={client}
          date={date}
          downloadUrl={downloadUrl}
        />
      </div>
    </div>
  );
}