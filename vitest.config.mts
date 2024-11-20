import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths'; // only if you are using custom tsconfig paths
export default defineConfig({
   plugins: [tsconfigPaths()],
   test: {
      globals: true,
      environment: 'node',
      include: ['src/**/*.{test,spec}.{js,ts}'],
      coverage: {
         reporter: ['text', 'json', 'html'],
      },
      //vitest uses default tsconfig which includes all src files for unit testing
   },
});
