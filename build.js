const { build } = require('esbuild');

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'esnext',
  format: 'cjs',
  outfile: 'dist/index.js',
}).catch(() => process.exit(1));
