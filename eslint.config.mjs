import js from '@eslint/js';
import globals from 'globals';
import parser from '@typescript-eslint/parser';
import pluginTs from '@typescript-eslint/eslint-plugin';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReactNative from 'eslint-plugin-react-native';

export default [
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        'react-native/react-native': true, 
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
      prettier: pluginPrettier,
      'react-native': pluginReactNative,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginTs.configs.recommended.rules,
      'prettier/prettier': ['error', { semi: true }],
      'no-console': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off',
      quotes: [2, 'single', { avoidEscape: true }],
      'react-native/split-platform-components': 'off',
      'react-native/no-raw-text': 'off',
      'react-native/no-single-element-style-arrays': 'off',
      'react-native/no-inline-styles': 'off',
      'react-native/no-color-literals': 'error',
      'react-native/no-unused-styles': 'error',
      'react-native/sort-styles': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-unresolved': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/no-unstable-nested-components': 'off',
    },
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
];