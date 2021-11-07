const fs = require("fs");
const path = require("path");
const lodashModuleReplace = require('lodash-webpack-plugin')

function resolve(dir) {
  return path.resolve(__dirname, dir);
}

const join = path.join;
function getEntries(path) {
  let files = fs.readdirSync(resolve(path));
  const entries = files.reduce((ret, item) => {
    const itemPath = join(path, item)
    const isDir = fs.statSync(itemPath).isDirectory();
    if (isDir) {
      ret[item] = resolve(join(itemPath, 'index.js'))
    } else {
      const [name] = item.split('.')
      ret[name] = resolve(`${itemPath}`)
    }
    return ret
  }, {})
  return entries
}

module.exports = {
  outputDir: "dist",
  productionSourceMap: false,
  css: {
    sourceMap: true,
    extract: {
      filename: "style/[name].css"
    }
  },
  configureWebpack: {
    entry: {
      ...getEntries("src")
    },
    output: {
      filename: "[name].js",
      libraryTarget: "commonjs2"
    },
    externals: {
      lodash : {
        commonjs: 'lodash',
        amd: 'lodash',
        root: '_' // 指向全局变量
      },
      vue: {
        root: "Vue",   //通过 script 标签引入，此时全局变量中可以访问的是 Vue
        commonjs: "vue",  //可以将vue作为一个 CommonJS 模块访问
        commonjs2: "vue",  //和上面的类似，但导出的是 module.exports.default
        amd: "vue"   //类似于 commonjs，但使用 AMD 模块系统
      }
    }
  },
  chainWebpack: config => {
    config.plugin("webpack-bundle-analyzer").use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin)

    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true
      return args
    })

    // lodash 
    config.plugin('loadshReplace')
      .use(new lodashModuleReplace())

    // config.optimization.delete("splitChunks");
    config.plugins.delete("copy");
    config.plugins.delete("html");
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
    config.plugins.delete("hmr");
    config.entryPoints.delete("app");
  }
};