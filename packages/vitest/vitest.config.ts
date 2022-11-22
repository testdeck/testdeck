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
      reporter: ['lcov', 'html', 'text'],
      perFile: true,
      lines: 80,
      branches: 70,
      functions: 100,
      statements: 80,
    },
    reporters: 'verbose',
    include: ['test.ts']
  },
});
