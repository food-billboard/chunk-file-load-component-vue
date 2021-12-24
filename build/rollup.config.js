import vue from 'rollup-plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss'
import postcssImport from 'postcss-import';
import { terser } from 'rollup-plugin-terser'
import { name } from '../package.json'

const file = type => `dist/${name}.${type}.js`

export { 
  name, 
  file 
}

export default {
  input: 'src/index.js',
  plugins: [
    nodeResolve(),
    babel({
      babelHelpers: "runtime",
    }),
    vue(),
    commonjs({
      include: [
        "node_modules/**",
        "node_modules/**/*"
      ],
      exclude: [
        "src/**",
        "src/**/*"
      ]
    }),
    // postcss({
    //   extensions: [".css"],
    //   extract: true,
    //   plugins: [postcssImport()]
    // }),
    // terser()
  ],
  external: ['vue', 'lodash', 'element-ui']
}  