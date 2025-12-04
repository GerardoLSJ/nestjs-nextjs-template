import { execa } from 'execa';
import { waitForPortOpen } from '@nx/node/utils';

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  // Start the API service required for E2E tests
  console.log('\nSetting up API Server...\n');

  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3333;

  // Set the PORT environment variable for the API server
  const env = { ...process.env, PORT: port.toString() };

  // Run the built API directly with node instead of using nx serve
  // This avoids the debugger port conflict that occurs with nx serve
  globalThis.apiProcess = execa('node', ['apps/api/dist/main.js'], {
    cwd: process.cwd(),
    stdio: 'pipe',
    detached: true,
    env,
  });

  // Wait for the server to be ready
  await waitForPortOpen(port, { host });

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};
