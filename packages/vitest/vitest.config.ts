/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig({
  clearScreen: false,
  test: {
    include: ['test.ts']
  },
});

