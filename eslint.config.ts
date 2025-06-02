import { readFileSync } from 'node:fs'

import { FlatCompat } from '@eslint/eslintrc'
import eslintJS from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import eslintTS from 'typescript-eslint'

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

function createAutoImportedGlobals() {
  // Read the content of the files synchronously
  const componentsContent = readFileSync('./types/components.d.ts', 'utf8')
  const importsContent = readFileSync('./types/imports.d.ts', 'utf8')

  // Extract keys from GlobalComponents in components.d.ts
  const globalComponentsMatch = componentsContent.match(
    /GlobalComponents\s*{([^}]*)}/s,
  )
  const globalComponentKeys = globalComponentsMatch
    ? globalComponentsMatch[1]
        .split('\n')
        .map((line) => line.trim().split(':')[0])
        .filter(Boolean)
    : []

  // Extract constants and exports in imports.d.ts
  const globalDeclarationsMatch = importsContent.match(
    /declare global\s*{([^}]*)}/s,
  )
  const globalDeclarationKeys = globalDeclarationsMatch
    ? globalDeclarationsMatch[1]
        .split('\n')
        .map((line) => line.trim().split(':')[0].replace('const ', ''))
        .filter(Boolean)
    : []

  return [...globalComponentKeys, ...globalDeclarationKeys].map((value) => [
    value,
    'readonly',
  ])
}

export default [
  eslintJS.configs.recommended,
  ...compat.extends('plugin:prettier/recommended'),
  {
    ignores: ['./dist/**', './node_modules/**', './*.d.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...Object.fromEntries(createAutoImportedGlobals()),
      },
    },
    rules: {
      'prefer-destructuring': 'error',
      curly: 'error',
      eqeqeq: 'error',
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
        },
      ],
      'object-shorthand': 'error',
      'prefer-template': 'warn',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-empty': 'off',
      'spaced-comment': ['error', 'always'],
    },
  },
  ...eslintTS.configs.recommended,
  ...eslintTS.configs.recommendedTypeChecked,
  // eslintFunctional.configs.externalTypescriptRecommended,
  ...pluginVue.configs['flat/recommended'],
  {
    plugins: {
      'simple-import-sort': eslintPluginSimpleImportSort,
      'unused-imports': eslintPluginUnusedImports,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        parser: '@typescript-eslint/parser',
        tsconfigRootDir: './',
        ecmaVersion: 2024,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/consistent-indexed-object-style': 'error',
      '@typescript-eslint/consistent-type-definitions': 'warn',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
      ],
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-floating-promises': [
        'error',
        { ignoreIIFE: true, ignoreVoid: true },
      ],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-for-in-array': 'error',
      '@typescript-eslint/no-implied-eval': 'off',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-qualifier': 'warn',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-useless-constructor': 'warn',
      '@typescript-eslint/no-useless-empty-export': 'warn',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/prefer-as-const': 'warn',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/prefer-includes': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'warn',
      '@typescript-eslint/unbound-method': 'off',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
    },
  },
  // {
  //   files: [
  //     '**/*.{spec,test}.{ts,tsx}',
  //     '**/{tests,test,__tests__,__mock__,__mocks__}/*.{ts,tsx}',
  //   ],
  //   rules: {
  //     // Only include rules that are not set to "off" in the general configuration
  //     '@typescript-eslint/no-unused-expressions': 'off', // Changed to "off" for tests
  //     '@typescript-eslint/no-useless-constructor': 'off', // Changed to "off" for tests
  //   },
  // },
  eslintConfigPrettier,
]
