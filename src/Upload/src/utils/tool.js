import { merge } from 'lodash';
import { nanoid } from 'nanoid';
import { DEFAULT_COMPLETE_FILE, DEFAULT_UN_COMPLETE_FILE } from './constants'

export const mergeDefaultTask = (task) => {
  if (task.local?.type === 'url') {
    return merge({}, DEFAULT_COMPLETE_FILE, task, {
      id: nanoid(),
    });
  }

  return {
    getTask: () => task.task?.status,
    ...DEFAULT_UN_COMPLETE_FILE,
    id: nanoid(),
    get task() {
      return task.task || undefined;
    },
    ...task,
  };
};

export const generateRemoteTask = (url) => {
  return {
    ...DEFAULT_COMPLETE_FILE,
    id: nanoid(),
    local: {
      type: 'url',
      value: {
        fileId: url,
      },
    },
  };
};

export const propsValueFormat = (value) => {
  let formatValue = [];
  if (!value) return [];
  if (!Array.isArray(value)) {
    formatValue = [value];
  } else {
    formatValue = value;
  }
  return formatValue.map((item) => {
    if (typeof item === 'string') {
      return generateRemoteTask(item);
    }
    return mergeDefaultTask(item);
  });
};

export const createPreview = (file, task) => {
  const type = file.type;
  if (type && type.startsWith('image/')) return URL.createObjectURL(file);
  return '';
};

export const isUploaded = (task) => {
  return (
    task.local?.type === 'url' ||
    !task.task ||
    task.task.tool.file.isTaskComplete(task.task)
  );
};

export function withTry(func) {
  return async function(...args) {
    try {
      const data = await func(...args)
      return [null, data]
    }catch(err) {
      return [err, null]
    }
  }
}