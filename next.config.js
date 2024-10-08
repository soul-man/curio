/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "api.microlink.io", 'assets.aceternity.com' // Microlink Image Preview
    ],
  },
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: false,
  },
  env: {
    NEXT_HOST_BASE_URL: process.env.NEXT_HOST_BASE_URL,
    NEXT_CURIO_PROVIDER: process.env.NEXT_CURIO_PROVIDER,
    NEXT_INFURA_API_KEY: process.env.NEXT_INFURA_API_KEY,
    NEXT_MORALIS_API_KEY: process.env.NEXT_MORALIS_API_KEY,
    NEXT_TONCENTER_RPC_API_KEY: process.env.NEXT_TONCENTER_RPC_API_KEY,
  },
  reactStrictMode: true,
  swcMinify: true,
  // Uncoment to add domain whitelist
  // images: {
  //   domains: [
  //     'res.cloudinary.com',
  //   ],
  // },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: { not: /\.(css|scss|sass)$/ },
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        loader: '@svgr/webpack',
        options: {
          dimensions: false,
          titleProp: true,
        },
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

module.exports = nextConfig;
