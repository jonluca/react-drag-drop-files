import esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
import browserslist from 'browserslist';
import glob from 'glob';
import { resolveToEsbuildTarget } from 'esbuild-plugin-browserslist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const target = resolveToEsbuildTarget(
  browserslist(pkg.browserslist.production),
  {
    printUnknownTargets: false
  }
);
const options = {
  entryPoints: glob.sync(path.join(__dirname, './src/**/*.*')),
  target: target,
  outdir: path.parse(path.join(__dirname, pkg.module)).dir,
  watch: process.env.BUILD_WATCH === 'true',
  format: 'esm',
  sourcemap: 'linked',
  color: true,
  logLevel: 'debug'
};
await esbuild.build(options);
await esbuild.build({
  ...options,
  outdir: path.parse(path.join(__dirname, pkg.main)).dir,
  format: 'cjs'
});
