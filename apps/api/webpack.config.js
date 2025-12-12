const { join } = require('path');

const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');

const outputPath = join(__dirname, '../../dist/apps/api');
const isProduction = process.env.NODE_ENV === 'production';

console.log('[Webpack Config] Loading webpack config...');
console.log('[Webpack Config] NODE_ENV:', process.env.NODE_ENV);
console.log('[Webpack Config] isProduction:', isProduction);
console.log('[Webpack Config] Output path:', outputPath);

module.exports = {
  output: {
    path: outputPath,
    clean: true,
  },
  externals: {
    // External packages - not bundled, loaded from node_modules at runtime
    bcryptjs: 'commonjs bcryptjs',
    '@prisma/client': 'commonjs @prisma/client',
    '@prisma/adapter-pg': 'commonjs @prisma/adapter-pg',
    '@prisma/client-runtime-utils': 'commonjs @prisma/client-runtime-utils',
    pg: 'commonjs pg',
  },
  watchOptions: {
    ignored: ['**/node_modules/**', '**/dist/**', '**/out-tsc/**'],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'swc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: isProduction,
      outputHashing: isProduction ? 'all' : 'none',
      generatePackageJson: false,
    }),
  ],
};
