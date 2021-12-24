module.exports = {
  presets: [
    "@vue/cli-plugin-babel/preset",
    [
      '@vue/babel-preset-jsx',
      {
        injectH: false
      }
    ],
    ["@babel/preset-env", {
      // "modules": false,
      // "useBuiltIns": "usage",
      // "corejs": "3.6.5",
      // "targets": {
      //   "ie": 10
      // }
    }],
  ],
  plugins: [
    ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    ["@babel/plugin-proposal-private-methods", { "loose": true }],
    ["@babel/plugin-transform-runtime"],
    "lodash",
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: "theme-chalk"
      }
    ],
  ]
};
