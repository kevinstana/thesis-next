/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    development: {
      API_URL: process.env.API_URL,
    },
    production: {
      API_URL: process.env.API_URL,
    },
  },
};

export default nextConfig;
