import Upload from './src/index.vue';
import { install, uninstall } from './src/utils'

Upload.install = function(Vue) {
  Vue.component(Upload.name, Upload);
};

Upload.plugins = {
  install,
  uninstall
}

export default Upload;