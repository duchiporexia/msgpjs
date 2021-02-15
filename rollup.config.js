import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const packageJson = require('./package.json');

export default {
  input: 'src/index.ts',
  output: {
    file: packageJson.mainall,
    name: 'msgpjs',
    format: 'umd', // commonJS
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: { compilerOptions: { module: 'es2015' } },
    }),
  ],
};
