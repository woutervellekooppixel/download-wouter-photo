import fs from "fs/promises";
import path from "path";
import { redirect } from "next/navigation"; // <-- aangepast
import type { Metadata } from "next";
import Header from "@/components/Header";
import DownloadCard from "@/components/DownloadCard";
import { transformToDirectLink } from "@/scripts/transformToDirectLink";
import type { JSX } from "react";

type DownloadInfo = {
  title: string;
  client: string;
  date: string;
  downloadUrl: string;
  heroImage?: string;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data: Record<string, DownloadInfo> = JSON.parse(jsonData);

  const download = data[params.slug];
  if (!download) {
    return { title: "downloads.wouter.photo" };
  }

  return {
    title: `${download.title} | downloads.wouter.photo`,
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data: Record<string, DownloadInfo> = JSON.parse(jsonData);

  return Object.keys(data).map((slug) => ({ slug }));
}

export default async function Page({
  params,
}: {
  params: { slug: string };
}): Promise<JSX.Element> {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data: Record<string, DownloadInfo> = JSON.parse(jsonData);

  const download = data[params.slug];

  // ✅ Redirect als slug niet bestaat
  if (!download) {
    redirect("https://wouter.photo");
  }

  const { title, client, date, downloadUrl, heroImage } = download;
  const transformedUrl = transformToDirectLink(downloadUrl);
  const heroImageUrl = heroImage
    ? transformToDirectLink(heroImage)
    : "/hero.jpg";

  return (
    <div className="bg-black text-white">
      <Header />

      <div
        className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('${heroImageUrl}')` }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <DownloadCard
            title={title}
            client={client}
            date={date}
            downloadUrl={transformedUrl}
          />
        </div>
      </div>
    </div>
  );
}
