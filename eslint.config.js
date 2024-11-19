import globals from 'globals';
import pluginJs from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default {
   files: ['**/*.ts'],
   ignores: ['.dist/*', '**/node_modules/', '.git/','src/error.ts','src/server.ts','src/app.ts'],
   languageOptions: {
      parser: tsParser,
      globals: globals.node,
   },
   plugins: {
      '@typescript-eslint': tsPlugin,
   },
   rules: {
      ...pluginJs.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'warn',
   },
};
