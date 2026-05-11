/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // async rewrites() {
  //    return [
  //      {
  //        source: '/api/external/:path*',
  //        destination: 'https://external-service.com*', // The real API URL
  //      },
  //    ];
  //  },
  reactCompiler: true,
  // eslint: {
  //   dirs: ["app", "lib"], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
  // },
  allowedDevOrigins: ["reprise-spied-retold.ngrok-free.dev"],
  cacheComponents: true,
  experimental: {
    // serverComponentsHmrCache: false,
    // defaults to true
    serverActions: {
      bodySizeLimit: "10mb",
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
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
    ],
  },
  // images: {
  //   domains: ["res.cloudinary.com"],
  // },
};

export default nextConfig;
