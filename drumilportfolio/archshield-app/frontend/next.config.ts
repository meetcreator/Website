import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/archshield",
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
