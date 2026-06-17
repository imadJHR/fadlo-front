import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "5rzu4vcf27py33lvqrazxzyygu0qwoho.lambda-url.eu-north-1.on.aws",
      },
    ],
  },
};

export default nextConfig;
