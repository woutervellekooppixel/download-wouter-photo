"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  title: string;
  images: string[];
};

export default function GallerySection({ title, images }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              width={1000}
              height={1000}
              className="object-cover w-full h-auto rounded-lg"
            />

            {/* Overlay download button (desktop only) */}
            <a
              href={src}
              download
              className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            >
              <button className="bg-white text-black px-4 py-2 rounded text-sm font-semibold">
                Download
              </button>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}