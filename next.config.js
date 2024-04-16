/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      bufferutil: require.resolve('bufferutil'),
      net: require.resolve('net'),
      request: require.resolve('request'),
      tls: require.resolve('tls'),
      'utf-8-validate': require.resolve('utf-8-validate'),
    };
    return config;
  },
};

module.exports = nextConfig;
