/**
 * Polyfills for Jest Test Environment
 *
 * This file sets up polyfills that must be available before any tests run.
 * It's loaded via Jest's setupFiles option (runs before setupFilesAfterEnv).
 */

import 'whatwg-fetch';
import { ReadableStream, WritableStream, TransformStream } from 'stream/web';
import { TextEncoder, TextDecoder } from 'util';

// Mock BroadcastChannel for MSW (not needed in Node.js test environment)
class BroadcastChannelMock {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;

  constructor(name: string) {
    this.name = name;
  }

  postMessage(): void {
    // No-op in test environment
  }

  close(): void {
    // No-op in test environment
  }

  addEventListener(): void {
    // No-op in test environment
  }

  removeEventListener(): void {
    // No-op in test environment
  }

  dispatchEvent(): boolean {
    return true;
  }
}

// Set up Web API globals for MSW
Object.assign(global, {
  TextEncoder,
  TextDecoder,
  ReadableStream,
  WritableStream,
  TransformStream,
  BroadcastChannel: BroadcastChannelMock,
});
