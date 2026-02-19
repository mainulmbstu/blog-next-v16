/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    // serverComponentsHmrCache: false,
    // defaults to true
    serverActions: {
      bodySizeLimit: "2mb",
      // allowedOrigins: ["my-proxy.com", "*.my-proxy.com"],
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // port: "",
        // pathname: "/**",
        // search: "",
      },
    ],
  },
  // images: {
  //   domains: ["res.cloudinary.com"],
  // },
};

export default nextConfig;
