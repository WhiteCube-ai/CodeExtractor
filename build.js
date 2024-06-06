const { build } = require('esbuild');
const { exec } = require('child_process');

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'esnext',
  format: 'cjs',
  outfile: 'dist/index.js',
}).catch(() => process.exit(1));
// Run tsc to generate declaration files
exec('tsc --emitDeclarationOnly --declaration --outDir dist', (err, stdout, stderr) => {
  if (err) {
    console.error(stderr);
    process.exit(1);
  } else {
    console.log(stdout);
  }
});
