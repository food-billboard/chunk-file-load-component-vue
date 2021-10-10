import { useCallback, useContext, useEffect, useState } from 'react';
import { merge } from 'lodash';

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

function useProgress(name) {

  const { emitter, instance, getValue } = useContext();

  const [progress, setProgress] = useState<ProgressType>({
    current: 0,
    total: 0,
    complete: 0,
    step: 0,
  });

  let isFirstInject = true 

  const action = useCallback(
    (instance, name, params, response) => {
      const progress = response?.process;
      const status = instance.getStatus(name);
      setProgress((prev) => {
        return merge({}, prev, progress, { step: status ?? -3 });
      });
    },
    [],
  );

  useEffect(() => {
    emitter.on(name, action.bind(null, instance));
  }, [emitter, instance]);

  useEffect(() => {
    if(!isFirstInject || !instance) return 
    isFirstInject = true 
    const files = getValue()
    const target = files.find(item => item.name === name)
    if(!target) return 
    const status = target.getStatus()
    const progress = target.task?.process
    setProgress((prev) => {
      return merge({}, prev, progress, { step: status ?? -3 });
    });
  }, [getValue])

  let { complete, total, current } = progress;
  complete ||= 0;
  total ||= 0;

  return [complete, total, current, (complete / total) * 100 || 0, progress];
}

export default useProgress;
