import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
      {
        // Admin-added products can point at any HTTPS image host, since
        // there's no fixed CDN for user-supplied product photos.
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;