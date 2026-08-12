import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root: C:\Users\marwen has an unrelated package.json
  // that would otherwise confuse Turbopack's root auto-detection.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
