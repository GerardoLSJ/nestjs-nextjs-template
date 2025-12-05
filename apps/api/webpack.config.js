const { join } = require('path');

console.log('[Webpack Config] Loading webpack config...');
console.log('[Webpack Config] NODE_ENV:', process.env.NODE_ENV);
console.log('[Webpack Config] CWD:', process.cwd());

const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');

const outputPath = join(__dirname, '../../dist/apps/api');
console.log('[Webpack Config] Output path:', outputPath);
console.log('[Webpack Config] Resolved absolute path:', require('path').resolve(outputPath));

const watchOptions = {
  ignored: ['**/node_modules/**', '**/dist/**', '**/out-tsc/**'],
};
console.log('[Webpack Config] Watch options:', JSON.stringify(watchOptions, null, 2));

module.exports = {
  output: {
    path: outputPath,
    clean: false,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  watchOptions,
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMaps: true,
    }),
  ],
};
