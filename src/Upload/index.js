import Upload from './src';

Upload.install = function(Vue) {
  Vue.component(Upload.name, Upload);
};

export default Upload;