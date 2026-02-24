import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/archshield',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
