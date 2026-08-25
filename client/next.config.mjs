/** @type {import('next').NextConfig} */

const API_UPSTREAM =
     process.env.API_UPSTREAM_URL?.replace(/\/+$/, "") ||
     "https://smartrepresentative.onrender.com";

const nextConfig = {
     experimental: {
          proxyTimeout: 120000,
     },
     async rewrites() {
          return [
               {
                    source: "/api/:path*",
                    destination: `${API_UPSTREAM}/api/:path*`,
               },
          ];
     },
};

export default nextConfig;
