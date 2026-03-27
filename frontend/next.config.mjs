/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode : false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oncagxvtwnskgijucota.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "scontent.xx.fbcdn.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
