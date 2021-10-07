const path = require("path")
// const { addDecorator } = require('@storybook/vue');
// const { addReadme, configureReadme } = require('storybook-readme')

// configureReadme({
//   /**
//    * Wrapper for story. Usually used to set some styles
//    * React: React.ReactNode
//    * Vue: Vue component
//    */
//   // 组件区域的预处理，相当于在组件展示的时候外面套上一层div，组件作为插槽插入到这个div里面，在这里可以设置div的样式，如果是使用vue的话可以以vue组件格式插入，下面同理
//   StoryPreview,

//   /**
//    * Wrapper for content and sidebar docs. Usually used to set some styles
//    * React: React.ReactNode
//    * Vue: Vue component
//    */
//   // 文档部分的样式，即插件里面的content
//   DocPreview,
//   /**
//    * Wrapper for header docs. Usually used to set some styles
//    * React: React.ReactNode
//    * Vue: Vue component
//    */
//   HeaderPreview,
//   /**
//    * Wrapper for footer docs. Usually used to set some styles
//    * React: React.ReactNode
//    * Vue: Vue component
//    */
//   FooterPreview,

//   /**
//    * Header docs in markdown format
//    */
//   header: '',

//   /**
//    * Footer docs in markdown format
//    */
//   footer: '',
// });

module.exports = {
  stories: [
    '../stories/**/*.stories.@(js|ts|jsx|tsx|mdx)', 
    '../stories/*.stories.@(js|ts|jsx|tsx|mdx)'
  ],
  addons: [
    "@storybook/addons",
    "@storybook/addon-notes/register-panel",
    {
      name: "@storybook/addon-storysource",
      options: {
        rule: {
          include: [
            path.resolve(__dirname, "../stories")
          ]
        },
        loaderOptions: {
          prettierConfig: {
            printWidth: 80,
            singleQuote: false,
          }
        }
      }
    },
    // "storybook-readme/register",
  ]
};