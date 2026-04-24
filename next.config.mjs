/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        stream: false,
        buffer: false, // এটি node:buffer এররটি সমাধান করবে
      };
    }
    return config;
  },
};

export default nextConfig;
