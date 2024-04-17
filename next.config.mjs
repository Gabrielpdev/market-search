/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  },
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
