/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/jeunecine",
  assetPrefix: "/jeunecine/",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
