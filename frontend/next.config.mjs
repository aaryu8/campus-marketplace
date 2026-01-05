/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "o*********ota.supabase.co",
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
