# Cross-Platform `dev:all` Command

## The Solution

```json
"dev:all": "npx nx run-many --target=dev --projects=api,web --parallel=2"
```

This command now works consistently across **Windows, macOS, and Linux** by using Nx's built-in parallel execution instead of shell operators.

## Why It's Cross-Platform

- **No shell operators**: Avoids `&`, `&&`, or other shell-specific syntax that behaves differently across platforms
- **Nx process management**: Nx handles starting and managing both processes internally
- **Consistent behavior**: Same execution flow on Windows CMD, PowerShell, bash, and zsh

## Server URLs

When running `npm run dev:all`, both servers start simultaneously:

- **Web (Next.js)**: http://localhost:3000
- **API (NestJS)**: http://localhost:3333/api (note: the `/api` prefix is required)

## What Was Changed

To make this work, three files were updated:

### 1. Root `package.json`

Changed the `dev:all` script from shell-based to Nx-based:

```json
"dev:all": "npx nx run-many --target=dev --projects=api,web --parallel=2"
```

### 2. `apps/api/project.json`

Added a `dev` target to match the web project's target name:

```json
"dev": {
  "executor": "@nx/webpack:dev-server",
  "defaultConfiguration": "development",
  "options": {
    "buildTarget": "api:build",
    "port": 4200
  },
  "configurations": {
    "development": {},
    "production": {
      "buildTarget": "api:build:production"
    }
  }
}
```

### 3. `apps/api/package.json`

Updated the `build` target to use the webpack executor:

```json
"build": {
  "executor": "@nx/webpack:webpack",
  "outputs": ["{options.outputPath}"],
  "defaultConfiguration": "production",
  "options": {
    "target": "node",
    "compiler": "tsc",
    "outputPath": "apps/api/dist",
    "main": "apps/api/src/main.ts",
    "tsConfig": "apps/api/tsconfig.app.json",
    "assets": ["apps/api/src/assets"],
    "webpackConfig": "apps/api/webpack.config.js"
  },
  "configurations": {
    "development": {},
    "production": {}
  }
}
```

## How to Run

```bash
npm run dev:all
```

Both servers will start in parallel with their output displayed in the terminal. Press `Ctrl+C` to stop both servers.

## How It Works

1. **Nx parses the command**: Identifies that it needs to run the `dev` target for both `api` and `web` projects
2. **Parallel execution**: Starts both processes simultaneously (up to 2 at once due to `--parallel=2`)
3. **Process management**: Nx manages both processes internally, handling output and lifecycle
4. **Clean shutdown**: When you stop the command, Nx ensures both processes are terminated properly

## Benefits

- ✅ **Cross-platform**: Works on Windows, macOS, and Linux
- ✅ **Simple**: Single command to start both servers
- ✅ **Reliable**: Nx handles process management and cleanup
- ✅ **Fast**: Both servers start in parallel, not sequentially
- ✅ **Integrated**: Uses Nx's built-in capabilities, no additional dependencies
