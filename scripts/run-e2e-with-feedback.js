#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');

console.log(chalk.blue.bold('\n🚀 Starting E2E tests...\n'));
console.log(chalk.gray('Note: The web:dev server will be automatically started and stopped for testing.\n'));

try {
  execSync('npx nx run-many --target=e2e --all', {
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  console.log(chalk.green.bold('\n✅ All E2E tests completed successfully!'));
  console.log(chalk.gray('(The web:dev server was terminated normally after tests)\n'));
} catch (error) {
  console.error(chalk.red.bold('\n❌ E2E tests failed!'));
  process.exit(1);
}