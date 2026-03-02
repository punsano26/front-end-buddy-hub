import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    stylistic: {
      flat: true,
      indent: 2,
      commaDangle: 'never',
      jsx: true,
      quotes: 'single',
      semi: false
    },
    typescript: true
  }
}).override('nuxt/javascript', {
  rules: {
    'default-case': ['error', { commentPattern: '^skip\\sdefault' }]
  }
}).override('nuxt/typescript/rules', {
  rules: {
    '@typescript-eslint/ban-ts-comment': ['error', {
      'ts-ignore': 'allow-with-description'
    }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/explicit-function-return-type': ['error', {
      allowTypedFunctionExpressions: false
    }],
    '@typescript-eslint/explicit-module-boundary-types': ['error', {
      allowArgumentsExplicitlyTypedAsAny: true
    }],
    '@typescript-eslint/typedef': [
      'error',
      {
        arrowParameter: true,
        variableDeclaration: false,
        parameter: true,
        objectDestructuring: false,
        memberVariableDeclaration: true,
        propertyDeclaration: true,
        variableDeclarationIgnoreFunction: true
      }
    ]
  }
}).override('nuxt/vue/rules', {
  rules: {
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        ['UNIQUE', 'SLOT'],
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'ATTR_DYNAMIC',
        'ATTR_STATIC',
        'ATTR_SHORTHAND_BOOL',
        'EVENTS',
        'CONTENT'
      ],
      alphabetical: true
    }],
    'vue/multi-word-component-names': 'off',
    'vue/html-closing-bracket-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'never',
        selfClosingTag: {
          singleline: 'never',
          multiline: 'never'
        }
      }
    ],
    'vue/max-len': ['error', {
      code: 150,
      tabWidth: 2,
      ignoreUrls: true,
      ignoreRegExpLiterals: true,
      ignoreComments: true,
      ignoreTrailingComments: true,
      ignoreStrings: true,
      ignoreHTMLTextContents: true,
      ignoreHTMLAttributeValues: true
    }]
  }
}).override('nuxt/stylistic', {
  rules: {
    '@stylistic/array-bracket-newline': ['error', 'consistent'],
    '@stylistic/array-bracket-spacing': 'error',
    '@stylistic/arrow-parens': 'error',
    '@stylistic/arrow-spacing': 'error',
    '@stylistic/block-spacing': 'error',
    '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
    '@stylistic/comma-spacing': 'error',
    '@stylistic/comma-style': 'error',
    '@stylistic/computed-property-spacing': 'error',
    '@stylistic/eol-last': 'error',
    '@stylistic/function-call-argument-newline': ['error', 'never'],
    '@stylistic/function-call-spacing': ['error', 'never'],
    '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
    '@stylistic/key-spacing': 'error',
    '@stylistic/keyword-spacing': 'error',
    '@stylistic/linebreak-style': ['error', 'unix'],
    '@stylistic/lines-between-class-members': ['error', 'always'],
    '@stylistic/no-extra-parens': 'error',
    '@stylistic/no-floating-decimal': 'error',
    '@stylistic/no-mixed-operators': 'error',
    '@stylistic/no-mixed-spaces-and-tabs': 'error',
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/no-multiple-empty-lines': ['error', {
      max: 2,
      maxEOF: 0
    }],
    '@stylistic/no-tabs': ['error', { allowIndentationTabs: true }],
    '@stylistic/object-curly-newline': 'off',
    '@stylistic/object-property-newline': ['error', {
      allowAllPropertiesOnSameLine: true
    }],
    '@stylistic/padded-blocks': ['error', 'never'],
    '@stylistic/rest-spread-spacing': ['error', 'never'],
    '@stylistic/space-before-function-paren': ['error', 'always'],
    '@stylistic/switch-colon-spacing': 'error',
    '@stylistic/template-curly-spacing': 'error',
    '@stylistic/wrap-regex': 'error'
  }
})
