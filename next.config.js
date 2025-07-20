/** @type {import('next').NextConfig} */
const nextConfig = {
  // zet hier al je opties
  reactStrictMode: true, // bijvoorbeeld
  experimental: {
    appDir: true,
  },
  // geen 'matcher' hier! die hoort in middleware.ts
};

module.exports = nextConfig;