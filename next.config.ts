import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "api.ieee-bub.org",
      "images.unsplash.com",
      "www.ieee-bub.org",
      "localhost",
    ],
  },

  //   for production
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

// export default nextConfig;
module.exports = nextConfig;
