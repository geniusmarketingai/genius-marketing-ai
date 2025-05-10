module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Adiciona o plugin do Prettier e desativa regras conflitantes
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  settings: {
    react: {
      version: 'detect', // Detecta automaticamente a versão do React
    },
  },
  rules: {
    'prettier/prettier': 'error', // Mostra erros do Prettier como erros do ESLint
    'no-unused-vars': 'warn', // Adverte sobre variáveis não utilizadas
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Permite não declarar tipos de retorno explicitamente
    'react/prop-types': 'off', // Desabilitado pois usamos TypeScript para tipos de props
    'react/react-in-jsx-scope': 'off', // Não é necessário importar React em escopo com as novas versões
    // Adicione aqui outras regras que desejar ou que estejam nas regras-vibecoding.md
    // Exemplo de regra para seguir DRY (Don't Repeat Yourself) - pode ser complexo de automatizar apenas com ESLint
    // 'no-duplicate-imports': 'error', // Já coberto por @typescript-eslint
    // Regras de SOLID seriam mais a nível de design arquitetural e code review
  },
  ignorePatterns: ['node_modules/', 'dist/', '.replit/', '.vscode/'],
}; 