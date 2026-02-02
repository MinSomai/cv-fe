import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '**',
      },
    ],
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
};

export default withNextIntl(nextConfig);
