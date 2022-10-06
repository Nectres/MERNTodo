/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: async () => [
    {
      source: "/express/:path*",
      destination: "http://localhost:6040/:path*" 
    }
  ],
  
}

module.exports = nextConfig
