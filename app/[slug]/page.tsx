export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Header from "@/components/Header";
import DownloadCard from "@/components/DownloadCard";
import GallerySection from "@/components/GallerySection";
import { transformToDirectLink } from "@/scripts/transformToDirectLink";

type DownloadInfo = {
  title: string;
  client: string;
  date: string;
  downloadUrl: string;
  heroImage?: string;
  gallery?: Record<string, string[]>;
};

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const DATA_URL = "https://cdn.wouter.photo/photos/data.json";

  let data: Record<string, DownloadInfo> = {};

  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    data = await res.json();
  } catch (e) {
    console.error("❌ Fout bij ophalen data.json:", e);
    redirect("https://wouter.photo");
  }

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