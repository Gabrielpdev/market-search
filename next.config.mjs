/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.superkoch.com.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "giassi.vtexassets.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
