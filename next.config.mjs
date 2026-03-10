import { withPayload } from '@payloadcms/next/withPayload';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      ...[process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000']
        .filter(Boolean)
        .map((item) => {
          const url = new URL(item);
          return {
            hostname: url.hostname,
            protocol: url.protocol.replace(':', ''),
          };
        }),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };
    return webpackConfig;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
