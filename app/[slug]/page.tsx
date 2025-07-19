import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import DownloadCard from "@/components/DownloadCard";
import { transformToDirectLink } from "@/scripts/transformToDirectLink";
import type { Metadata, ResolvingMetadata } from "next";

type DownloadInfo = {
  title: string;
  client: string;
  date: string;
  downloadUrl: string;
  heroImage?: string;
};

export async function generateMetadata(
  { params }: { params: { slug: string } },
  _parent?: ResolvingMetadata
): Promise<Metadata> {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data: Record<string, DownloadInfo> = JSON.parse(jsonData);

  const download = data[params.slug];
  if (!download) return { title: "downloads.wouter.photo" };

  return {
    title: `${download.title} | downloads.wouter.photo`,
  };
}

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data: Record<string, DownloadInfo> = JSON.parse(jsonData);

  return Object.keys(data).map((slug) => ({ slug }));
}

export default function DownloadPage({
  params,
}: {
  params: { slug: string };
}) {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
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