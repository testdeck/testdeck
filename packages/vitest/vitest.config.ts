/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig({
  clearScreen: false,
  test: {
    allowOnly: true,
    coverage: {
      provider: 'istanbul',
      include: [
        "index.ts"
      ],
      perFile: true,
      lines: 100,
      branches: 100,
      functions: 100,
      statements: 100,
    },
    reporters: 'verbose',
    include: ['test.ts']
  },
});
