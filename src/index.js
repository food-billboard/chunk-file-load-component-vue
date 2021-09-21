
import Upload from './Upload';

const components = [
  Upload
]

const install = function(Vue, opts = {}) {

  components.forEach(component => {
    Vue.component(component.name, component);
  })

};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Upload
};
