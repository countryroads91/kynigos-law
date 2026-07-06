import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The blog index moved to /insights; article pages at /blog/[slug] remain.
      {
        source: "/blog",
        destination: "/insights",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
