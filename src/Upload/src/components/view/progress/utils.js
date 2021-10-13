
const STATUS_MAP = {
  0: 'pending',
  1: 'waiting',
  2: 'reading',
  3: 'uploading',
  4: 'fulfilled',
  '-3': 'rejected',
  '-2': 'cancel',
  '-1': 'stopping',
};

const DEFAULT_STATUS_LOCALE = {
  pending: '队列中',
  waiting: '等待中',
  reading: '解析中',
  uploading: '上传中',
  fulfilled: '上传完成',
  rejected: '上传失败',
  cancel: '上传取消',
  stopping: '上传暂停',
};

export function getProcessStatusLocale(step, locale) {
  const status = STATUS_MAP[step];
  return (
    (locale?.progress)?.[status] ||
    (DEFAULT_STATUS_LOCALE)[status]
  );
};
