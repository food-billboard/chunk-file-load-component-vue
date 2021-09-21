module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    ["@babel/preset-env"],
  ],
  plugins: [
    // ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
    [
      'babel-plugin-import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false, // default: true
      },
      'lodash',
    ],
    [
      'babel-plugin-import',
      {
        libraryName: 'element-ui',
        libraryDirectory: 'lib',
        styleLibraryName: "theme-chalk"
      },
      'element-ui',
    ],
  ]
};
