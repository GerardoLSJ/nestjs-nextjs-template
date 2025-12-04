import { killPort } from '@nx/node/utils';
/* eslint-disable */

module.exports = async function () {
  // Stop the spawned API service if it exists
  if (globalThis.apiProcess) {
    try {
      // Kill the process and cancel the execa promise to avoid uncaught exceptions
      globalThis.apiProcess.kill();
      await globalThis.apiProcess.catch(() => {
        // Ignore errors from killed process
      });
    } catch (e) {
      // ignore
    }
  }

  // Fallback cleanup using killPort (in case process.kill fails or service was running externally)
  const port = process.env.PORT ? Number(process.env.PORT) : 3333;
  await killPort(port);

  console.log(globalThis.__TEARDOWN_MESSAGE__);
};
