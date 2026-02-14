/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'out',
    images: {
        unoptimized: true,
    },
    // Ensure paths work on subfolder deployments
    basePath: '/Archshield',
    assetPrefix: '/Archshield/',
};

export default nextConfig;
