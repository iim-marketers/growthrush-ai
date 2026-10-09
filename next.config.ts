import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/:path*",
      has: [{ type: "host", value: "growthrush.ai" }],
      destination: "https://www.growthrush.ai/:path*",
      permanent: true,
    },
  ],
};

export default nextConfig;
