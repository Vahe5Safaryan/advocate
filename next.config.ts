import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: "/teams", destination: "/team", permanent: true },
      { source: "/teams/:slug", destination: "/team/:slug", permanent: true },
    ];
  },
};

export default nextConfig;