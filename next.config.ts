import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  experimental: {
    // Vercel restores .next/cache from earlier builds, and the cached compile of
    // globals.css (Tailwind via PostCSS) survived changes to the file, shipping
    // the previous stylesheet. Build from scratch; this site builds in seconds.
    // The dev cache has the same problem across restarts.
    turbopackFileSystemCacheForBuild: false,
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
