// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ["http://192.168.11.1:9002"],
  },
};

module.exports = nextConfig;
