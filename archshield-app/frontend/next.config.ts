import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Archshield',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
