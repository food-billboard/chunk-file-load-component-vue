import Upload from './src/index.js';
import { get, noop, set } from 'lodash'

console.log(get, noop, set)

// import { install, uninstall } from './src/utils'

Upload.install = function(Vue) {
  Vue.component(Upload.name, Upload);
};

// Upload.plugins = {
//   install,
//   uninstall
// }

export default Upload;