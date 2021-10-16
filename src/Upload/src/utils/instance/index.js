import { Upload } from 'chunk-file-upload'
import Emitter from '../emitter'
import { LIFE_CYCLE_ENUM } from '../constants'

function lifecycleFormat(lifecycle) {
  return LIFE_CYCLE_ENUM.reduce(function (acc, cycle) {
    const action = lifecycle[cycle];
    acc[cycle] = function (params, response) {
      emitter.emit(params.name, params, response, this);
      return action?.(params);
    };
    return acc;
  }, {});
}

export const emitter = new Emitter();

export const UploadInstance = new Upload({
  lifecycle: lifecycleFormat({}),
});