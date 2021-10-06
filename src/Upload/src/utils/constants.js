import { noop } from 'lodash';

export const DEFAULT_UN_COMPLETE_FILE = {
  name: Symbol(Date.now().toString()),
  getStatus: noop,
};

export const DEFAULT_COMPLETE_FILE = {
  getStatus: () => 4,
};

export const ERRORS_MAP = {
  maxSize: "file-too-large",
  minSize: "file-too-small", 
  maxFiles: "too-many-files",
  accept: "file-invalid-type"
}

export const LIFE_CYCLE_ENUM = [
  'beforeRead',
  'reading',
  'beforeCheck',
  'afterCheck',
  'uploading',
  'afterStop',
  'afterCancel',
  'beforeComplete',
  'afterComplete',
  'retry',
];
