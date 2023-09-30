module.exports = {
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'all',
  importOrder: ['<TYPES>^fastify', '<TYPES>', '<TYPES>^@', '<BUILTIN_MODULES>', '^fastify$', '^@fastify', '^[.]', '<THIRD_PARTY_MODULES>'],
  importOrderTypeScriptVersion: '5.0.0',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
};
