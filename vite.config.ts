import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/shared/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
      exclude: [
        'node_modules/',
        'src/shared/test/**',
        'src/**/__tests__/**',
        '**/*.d.ts',
        'src/main.tsx',
        'vite.config.ts',
        // Barrel re-export files — no executable logic
        'src/shared/design-system/index.ts',
        'src/shared/design-system/tokens/index.ts',
        'src/shared/components/skeleton/index.ts',
      ],
    },
  },
});
