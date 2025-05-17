import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "backend",
        port: "4000",
        pathname: "/files/**",
      },
    ],
    domains: [
      "yucky-vonni-va5to-ccb92850.koyeb.app",
      "localhost"
    ]
  },
};

export default nextConfig;
