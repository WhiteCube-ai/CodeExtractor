const { build } = require('esbuild');
const ts = require('typescript');
const path = require('path');
const fs = require('fs');

// Run esbuild
build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'esnext',
  format: 'cjs',
  outfile: 'dist/index.js',
}).catch(() => process.exit(1));

// TypeScript Compiler Options
const tsConfigPath = path.resolve(__dirname, 'tsconfig.json');
const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
const compilerOptions = tsConfig.compilerOptions;
compilerOptions.declaration = true;
compilerOptions.emitDeclarationOnly = true;
compilerOptions.outDir = 'dist';

// Compile TypeScript to generate declaration files
const program = ts.createProgram(['src/index.ts'], compilerOptions);
const emitResult = program.emit();

const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

allDiagnostics.forEach(diagnostic => {
  if (diagnostic.file) {
    const { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
  } else {
    console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
  }
});

if (emitResult.emitSkipped) {
  process.exit(1);
}
