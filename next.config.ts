import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {

    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cjmsqadtqcqiydqawvvs.supabase.co',
        pathname: '**',
      },
    ],
  }
};

export default nextConfig;
