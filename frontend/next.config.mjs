/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://campus-marketplace-production-c93f.up.railway.app/api/:path*',
      },
    ];
  },
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
// ```

// Then in **Vercel dashboard → your project → Settings → Environment Variables**, change:
// ```
// NEXT_PUBLIC_BACKEND_URL = https://dormdeal-tau.vercel.app