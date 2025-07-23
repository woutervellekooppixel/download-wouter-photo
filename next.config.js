/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "pub-0259df1e2f8a4519882e857eebaab6fa.r2.dev", // Cloudflare R2 public URL
      "cdn.wouter.photo", // ⚠️ voeg deze toe
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;