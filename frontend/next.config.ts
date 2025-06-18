import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "202.10.47.102",
        port: "4000",
        pathname: "/files/**",
      },
    ],
  },
};

export default nextConfig;
