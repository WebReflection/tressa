import {terser} from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';

function getConfig ({format = 'cjs', min = false}) {
  return {
    input: 'core.js',
    // comments: =/Giammarchi.*Claudio/
    plugins: [
      resolve(),
      min ? terser() : undefined
    ],
    output: {
      format,
      file: {
        cjs: `cjs/index${min ? '.min' : ''}.js`,
        es: `esm/index${min ? '.min' : ''}.js`,
        iife: min ? 'min.js' : 'index.js'
      }[format],
      name: 'tressa'
    }
  };
}

export default [
  getConfig({format: 'cjs', min: true}),
  getConfig({format: 'cjs', min: false}),
  getConfig({format: 'es', min: true}),
  getConfig({format: 'es', min: false})
];
