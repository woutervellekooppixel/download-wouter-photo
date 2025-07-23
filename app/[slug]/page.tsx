import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import DownloadCard from "@/components/DownloadCard";
import GallerySection from "@/components/GallerySection";
import { transformToDirectLink } from "@/scripts/transformToDirectLink";
import type { JSX } from "react";

// 👇 Types
export type DownloadInfo = {
  title: string;
  client: string;
  date: string;
  downloadUrl: string;
  heroImage?: string;
  gallery?: Record<string, string[]>; // folderName -> [imagePaths]
};

// 📦 Link naar je gehoste JSON op R2
const DATA_URL = "https://cdn.wouter.photo/photos/data.json";

// 👇 Metadata voor SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  const data: Record<string, DownloadInfo> = await res.json();
  const download = data[params.slug];
  if (!download) return { title: "downloads.wouter.photo" };
  return { title: `${download.title} | downloads.wouter.photo` };
}

// 👇 Slug genereren voor static pages
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const res = await fetch(DATA_URL);
  const data: Record<string, DownloadInfo> = await res.json();
  return Object.keys(data).map((slug) => ({ slug }));
}

// 👇 Hoofdpagina per download
export default async function Page({
  params,
}: {
  params: { slug: string };
}): Promise<JSX.Element> {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  const data: Record<string, DownloadInfo> = await res.json();
  const download = data[params.slug];

  if (!download) redirect("https://wouter.photo");

  const { title, client, date, downloadUrl, heroImage, gallery } = download;
  const transformedUrl = transformToDirectLink(downloadUrl);
  const heroImageUrl = heroImage
    ? transformToDirectLink(heroImage)
    : "/hero.jpg";

  return (
    <div className="bg-black text-white">
      <Header />

      {/* Hero Background */}
      <div
        className="relative min-h-screen w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('${heroImageUrl}')` }}
      >
        <div className="absolute inset-0 bg-black/10 z-0" />
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <DownloadCard
            title={title}
            client={client}
            date={date}
            downloadUrl={transformedUrl}
          />
        </div>
      </div>

      {/* Gallery */}
      {gallery && (
        <div className="max-w-6xl mx-auto px-4 py-12">
          {Object.entries(gallery).map(([folderName, imageUrls]) => (
            <GallerySection
              key={folderName}
              title={folderName.replace(/_/g, " ")}
              images={imageUrls.map(transformToDirectLink)}
            />
          ))}
        </div>
      )}
    </div>
  );
}