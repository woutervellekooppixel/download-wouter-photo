import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
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

// Metadata voor browser-tab en SEO
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

// Alle beschikbare pagina's (slugs) genereren op build
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data: Record<string, DownloadInfo> = JSON.parse(jsonData);

  return Object.keys(data).map((slug) => ({ slug }));
}

// De downloadpagina zelf
export default async function Page({
  params,
}: {
  params: { slug: string };
}): Promise<JSX.Element> {
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
      {/* Header (optioneel met achtergrond transparantie aanpassen in Header.tsx) */}
      <Header />

      {/* Hero achtergrond met overlay */}
      <div
        className="relative grow flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('${heroImageUrl}')` }}
      >
        {/* Donkere overlay voor leesbaarheid */}
        <div className="absolute inset-0 bg-black/50 z-0" />

        {/* DownloadCard gecentreerd */}
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