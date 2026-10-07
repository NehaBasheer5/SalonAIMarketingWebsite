import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Section imagery is chosen by an admin in the CMS, so the optimiser has to
    // be able to pull from whichever host the image lives on.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    // In local dev the CMS (admin) runs on http://localhost:3001, which resolves
    // to a private IP. Next's optimiser refuses to fetch those unless this is on.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;
