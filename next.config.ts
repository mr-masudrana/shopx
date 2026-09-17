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
  // Prisma's Rust-free ("no engine") mode ships a query_compiler_bg.wasm
  // file next to the generated client. Vercel's build normally traces
  // static imports to decide what to include in each serverless
  // function, but it doesn't discover this file (it's read at runtime
  // via a computed path, not a static import) — causing an ENOENT for
  // that .wasm file in production even though everything works
  // locally. `serverExternalPackages` stops webpack from touching
  // Prisma's files at all (so its internal relative-path lookups stay
  // intact), and `outputFileTracingIncludes` force-includes the .wasm
  // file for every route that might touch the database.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
  outputFileTracingIncludes: {
    "/**": ["./node_modules/.prisma/client/*.wasm"],
  },
};

export default nextConfig;