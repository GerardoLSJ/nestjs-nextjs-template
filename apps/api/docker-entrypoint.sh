#!/bin/sh
set -e

echo "🚀 Starting NestJS API container..."

# Run database migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy --schema=prisma/schema.prisma

if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully"
else
  echo "❌ Migration failed"
  exit 1
fi

# Start the application
echo "🎯 Starting application..."
exec node dist/main.js
