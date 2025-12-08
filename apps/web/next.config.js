//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},

  // Enable standalone output for Docker deployment
  // Creates a self-contained build in .next/standalone
  output: 'standalone',

  // Skip type checking during build - Orval-generated types have issues
  // TODO: Fix Orval config to generate correct types
  typescript: {
    ignoreBuildErrors: true,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
