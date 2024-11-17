import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
   {
      files: ['**/*.{ts}'],
      ignores: ['.dist/*', '**/node_modules/', '.git/'],
   },
   {
      languageOptions: { globals: globals.browser },
   },
   pluginJs.configs.recommended,
   ...tseslint.configs.recommended,
];
