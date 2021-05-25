// Inspired by https://github.com/airbnb/javascript but less opinionated.

// We use eslint-loader so even warnings are very visible.
// This is why we only use "WARNING" level for potential errors,
// and we don't use "ERROR" level at all.

// In the future, we might create a separate list of rules for production.
// It would probably be more strict.

// The ESLint browser environment defines all browser globals as valid,
// even though most people don't know some of them exist (e.g. `name` or `status`).
// This is dangerous as it hides accidentally undefined variables.
// We blacklist the globals that we deem potentially confusing.
// To use them, explicitly reference them, e.g. `window.name` or `window.status`.
var restrictedGlobals = require('confusing-browser-globals');

module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended', 'prettier/react'],
  parser: 'babel-eslint',
  plugins: ['filenames', 'import', 'jsx-a11y', 'react', 'prettier'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    {
      files: ['*.js'],
      excludedFiles: 'index.js',
      rules: {
        'filenames/match-exported': [0, ['camel']]
      }
    }
  ],
  rules: {
    'array-callback-return': 'warn',
    'default-case': ['warn', { commentPattern: '^no default$' }], //Include `// no default` when no default case
    'dot-location': ['error', 'property'],
    eqeqeq: ['error', 'smart'],
    'no-unused-expressions': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-throw-literal': 0,
    'no-undef': 0,
    'no-use-before-define': 0,
    'array-callback-return': 0,
    'no-prototype-builtins': 0,
    'no-param-reassign': 0,
    'no-fallthrough': 0,
    'no-shadow': 0,
    'no-case-declarations': 0,
    'no-underscore-dangle': 0,
    'no-return-assign': 0,
    'no-var': 0,
    'vars-on-top': 0,
    'no-await-in-loop': 0,
    'no-console': 0,
    'no-useless-escape': 0,
    'no-nested-ternary': 0,
    'no-useless-constructor': 0,
    'no-sequences': 0,
    'guard-for-in': 0,
    'no-dupe-keys': 0,
    'prefer-spread': 0,
    'no-unreachable': 0,
    'class-methods-use-this': 0,
    'no-cond-assign': 0,
    'no-lone-blocks': 0,
    radix: 0,
    'no-unused-vars': [
      'off',
      {
        args: 'none',
        ignoreRestSiblings: true
      }
    ],
    'no-restricted-globals': ['error'].concat(restrictedGlobals),
    // 'filenames/match-exported': [2, ['pascal']],
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'import/no-named-as-default': 0,
    'react/prop-types': 0,
    //'react/forbid-foreign-prop-types': ['warn', { allowInPropTypes: true }],
    'react/destructuring-assignment': 0,
    // 'react/jsx-filename-extension': [2, { extensions: ['.jsx'] }],
    'react/no-access-state-in-setstate': 0,
    'react/no-unused-state': 0,
    'react/sort-comp': 0,
    'react/button-has-type': 0,
    'react/no-unused-prop-types': 0,
    'react/no-unescaped-entities': 0,
    'react/prefer-stateless-function': 0,
    'react/no-array-index-key': 0,
    'react/no-find-dom-node': 0,
    'react/jsx-no-duplicate-props': 0,
    'react/no-array-index-key': 0,
    'react/forbid-prop-types': 0,
    'react/default-props-match-prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-did-update-set-state': 0,
    'jsx-a11y/alt-text': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/label-has-associated-control': 0
  }
};
