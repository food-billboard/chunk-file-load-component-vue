import Upload from './src/index.vue';

Upload.install = function(Vue) {
  Vue.component(Upload.name, Upload);
};

export default Upload;