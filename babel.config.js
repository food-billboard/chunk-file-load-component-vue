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
      "modules": false,
      "useBuiltIns": "usage",
      "corejs": "2.6.10",
      "targets": {
        "ie": 10
      }
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
  ],
  ignore: [
    "node_modules/**"
  ]
};
