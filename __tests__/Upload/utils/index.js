import Vue from 'vue'

let id = 0;

export const sleep = async (times = 1000) =>
  new Promise((resolve) => setTimeout(resolve, times));

//mock local server
let mockCache = {};

export const exitDataFn = async (params, name) => {
  mockCache[name] = {
    max: params.chunksLength,
    chunkSize: params.chunkSize,
    size: params.size,
    index: 0,
  };
  return {
    data: 0,
  };
};

export const uploadFn = async (data, name) => {
  const size = mockCache[name].size;
  mockCache[name].index++;
  const nextOffset = mockCache[name].index * mockCache[name].chunkSize;
  //Mock server response
  return {
    data: nextOffset >= size ? size : nextOffset,
  };
};

export const completeFn = async (data) => {
  mockCache[data.name] = {};
};

export const FILE_SIZE = 1024 * 1024 * 20;
export const FILE_NAME = 'test-file-name.png';
export const FILE_TYPE = 'image/png';
export const FILE_ID = Math.random().toString();

export const generateMockWrapperFile = (task) => {
  const file = task.file.file;
  return {
    originFile: file,
    id: FILE_ID,
    local: {
      type: 'local',
      value: {
        filename: file.name,
        fileId: FILE_ID,
        fileSize: file.size,
      },
    },
    name: task.symbol,
    task,
    getStatus: () => task.status,
    error: null,
  };
};

export const triggerUploadClick = (dom) => {
  const target = dom.find('input');
  target.simulate('click');
  return target;
};

export const uploadTask = (dom, index = 0, isList = true) => {
  const find = isList
    ? '.chunk-upload-list-item'
    : '.chunk-upload-action-modal';
  const target = dom.findAll(find);
  const button = target.at(index).findAll('button');
  button.at(0).trigger('click');
  return button;
};

export const stopTask = (dom, isList = true) => {
  const find = isList
    ? '.chunk-upload-list-item button'
    : '.chunk-upload-action-modal button';
  const target = dom.findAll(find);
  target.at(0).trigger('click');
  return target;
};

export const deleteTask = (dom, index = 0, isList = true) => {
  const find = isList
    ? '.chunk-upload-list-item'
    : '.chunk-upload-action-modal';
  const target = dom.findAll(find);
  const button = target.at(index).findAll('button');
  button.at(1).trigger('click');
  return button;
};

export const previewTask = (dom, index=0, isList=true) => {
  const find = isList
  ? '.chunk-upload-list-item'
  : '.chunk-upload-action-modal';
  const target = dom.findAll(find);
  const button = target.at(index).findAll('button');
  button.at(2).trigger('click');
  return button;
};

const createElm = function() {
  const elm = document.createElement('div');

  elm.id = 'app' + ++id;
  document.body.appendChild(elm);

  return elm;
};

export const createVue = function(Compo, mounted = false) {
  if (Object.prototype.toString.call(Compo) === '[object String]') {
    Compo = { template: Compo };
  }
  return new Vue(Compo).$mount(mounted === false ? null : createElm());
};

export const destroyVM = function(vm) {
  vm.$destroy && vm.$destroy();
  vm.$el &&
  vm.$el.parentNode &&
  vm.$el.parentNode.removeChild(vm.$el);
};
