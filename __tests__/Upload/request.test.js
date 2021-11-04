import { Upload as ChunkUpload } from 'chunk-file-upload';
import { mount } from '@vue/test-utils'
import Upload from '@/Upload';
import {
  exitDataFn,
  uploadFn,
  completeFn,
  sleep,
  uploadTask,
  FILE_SIZE,
  FILE_NAME,
  FILE_TYPE,
} from './utils';

const customRequest = (callback) => (params) => {
  callback.params && callback.params(params);

  return {
    request: {
      completeFn: (...args) => {
        callback.completeFn(...args);
        return completeFn(...args);
      },
      uploadFn: (...args) => {
        callback.uploadFn(...args);
        return uploadFn(...args);
      },
      exitDataFn: (...args) => {
        callback.exitDataFn(...args);
        return exitDataFn(...args);
      },
      callback: (error, value) => {
        callback.callback(error, value);
      },
    },
  };
};

describe(`request about`, () => {
  it(`set actionUrl success`, async () => {
    let doneNote = {
      completeFn: false,
      uploadFn: false,
      callback: false,
      exitDataFn: false,
    };

    await new Promise(async (resolve, reject) => {
      const customParams = {
        actionUrl: 'testActionUrlActionUrl',
        method: [
          'testActionUrlExitDataFn',
          'testActionUrlUpload',
          'testActionUrlComplete',
        ],
        headers: [
          {
            'Content-Type': 'testActionUrlExitHeaders',
          },
          {
            'Content-Type': 'testActionUrlUploadHeaders',
          },
          {
            'Content-Type': 'testActionUrlCompleteHeaders',
          },
        ],
        withCredentials: false,
      };

      Upload.plugins.install(
        'request',
        customRequest({
          params: (params) => {
            const { url, instance, method, headers, withCredentials } = params;
            expect(customParams.actionUrl).toEqual(url);
            expect(instance).toBeDefined();
            expect(JSON.stringify(customParams.method)).toEqual(
              JSON.stringify(method),
            );
            expect(JSON.stringify(customParams.headers)).toEqual(
              JSON.stringify(headers),
            );
            expect(customParams.withCredentials).toEqual(withCredentials);
          },
          completeFn: () => {
            doneNote.completeFn = true;
          },
          uploadFn: () => {
            doneNote.uploadFn = true;
          },
          exitDataFn: () => {
            doneNote.exitDataFn = true;
          },
          callback: (error) => {
            doneNote.callback = true;
            expect(
              Object.values(doneNote).every((item) => !!item),
            ).toBeTruthy();
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          },
        }),
      );

      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          ...customParams,
        }
      };

      const wrapper = mount(Upload, props);

      
      wrapper.vm.onInputFileChange({
        target: {
          files: [
            ChunkUpload.arraybuffer2file(
              new ArrayBuffer(FILE_SIZE),
              FILE_NAME,
              {
                type: FILE_TYPE,
              },
            ),
          ],
        },
      });

      await sleep(1000);

      uploadTask(wrapper);

      const files = wrapper.vm.stateFiles
      expect(files.length).toEqual(1);

    });

    Upload.plugins.uninstall('request');
  });

  it(`set actionUrl and not the customRequest`, async () => {
    await new Promise(async (resolve, reject) => {

      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          "on-error": (error) => {
            expect(error).toBeDefined();
            resolve();
          },
        }
      };

      const wrapper = mount(Upload, props);

      wrapper.vm.onInputFileChange({
        target: {
          files: [
            ChunkUpload.arraybuffer2file(
              new ArrayBuffer(FILE_SIZE),
              FILE_NAME,
              {
                type: FILE_TYPE,
              },
            ),
          ],
        },
      });

      await sleep(1000);

      uploadTask(wrapper);

      const files = wrapper.vm.stateFiles
      expect(files.length).toEqual(1);

    });
  });

  it(`set actionUrl and request error`, async () => {
    let doneNote = {
      completeFn: false,
      uploadFn: false,
      callback: false,
      exitDataFn: false,
    };

    await new Promise(async (resolve, reject) => {
      const customParams = {
        actionUrl: 'testActionUrlActionUrl',
        method: [
          'testActionUrlExitDataFn',
          'testActionUrlUpload',
          'testActionUrlComplete',
        ],
        headers: [
          {
            'Content-Type': 'testActionUrlExitHeaders',
          },
          {
            'Content-Type': 'testActionUrlUploadHeaders',
          },
          {
            'Content-Type': 'testActionUrlCompleteHeaders',
          },
        ],
        withCredentials: false,
      };

      Upload.plugins.install(
        'request',
        customRequest({
          params: (params) => {
            const { url, instance, method, headers, withCredentials } = params;
            expect(customParams.actionUrl).toEqual(url);
            expect(instance).toBeDefined();
            expect(JSON.stringify(customParams.method)).toEqual(
              JSON.stringify(method),
            );
            expect(JSON.stringify(customParams.headers)).toEqual(
              JSON.stringify(headers),
            );
            expect(customParams.withCredentials).toEqual(withCredentials);
          },
          completeFn: () => {
            doneNote.completeFn = true;
            throw new Error();
          },
          uploadFn: () => {
            doneNote.uploadFn = true;
          },
          exitDataFn: () => {
            doneNote.exitDataFn = true;
          },
          callback: (error) => {
            doneNote.callback = true;
            expect(
              Object.values(doneNote).every((item) => !!item),
            ).toBeTruthy();
            if (error) {
              resolve();
            } else {
              reject();
            }
          },
        }),
      );

      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          ...customParams,
        }
      };

      const wrapper = mount(Upload, props);

      wrapper.vm.onInputFileChange({
        target: {
          files: [
            ChunkUpload.arraybuffer2file(
              new ArrayBuffer(FILE_SIZE),
              FILE_NAME,
              {
                type: FILE_TYPE,
              },
            ),
          ],
        },
      });

      await sleep(1000);

      uploadTask(wrapper);

      const files = wrapper.vm.stateFiles
      expect(files.length).toEqual(1);

    });

    Upload.plugins.uninstall('request');
  });

  it(`set actionUrl and custom request`, async () => {
    let doneNote = {
      completeFn: false,
      uploadFn: false,
      callback: false,
      exitDataFn: false,
    };

    await new Promise(async (resolve, reject) => {
      const customParams = {
        actionUrl: 'testActionUrlActionUrl',
        method: [
          'testActionUrlExitDataFn',
          'testActionUrlUpload',
          'testActionUrlComplete',
        ],
        headers: [
          {
            'Content-Type': 'testActionUrlExitHeaders',
          },
          {
            'Content-Type': 'testActionUrlUploadHeaders',
          },
          {
            'Content-Type': 'testActionUrlCompleteHeaders',
          },
        ],
        withCredentials: false,
      };

      Upload.plugins.install(
        'request',
        customRequest({
          params: () => {
            reject();
          },
          completeFn: () => {
            doneNote.completeFn = true;
            reject();
          },
          uploadFn: () => {
            doneNote.uploadFn = true;
            reject();
          },
          exitDataFn: () => {
            doneNote.exitDataFn = true;
            reject();
          },
          callback: (error) => {
            reject(error);
          },
        }),
      );

      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          ...customParams,
          request: {
            exitDataFn,
            completeFn,
            uploadFn,
            callback: (error) => {
              expect(Object.values(doneNote).every((item) => !item)).toBeTruthy();
              if (error) {
                reject(error);
              }
              resolve();
            },
          },
        }
      };

      const wrapper = mount(Upload, props);

      wrapper.vm.onInputFileChange({
        target: {
          files: [
            ChunkUpload.arraybuffer2file(
              new ArrayBuffer(FILE_SIZE),
              FILE_NAME,
              {
                type: FILE_TYPE,
              },
            ),
          ],
        },
      });

      await sleep(1000);

      uploadTask(wrapper);

      const files = wrapper.vm.stateFiles
      expect(files.length).toEqual(1);

    });

    Upload.plugins.uninstall('request');
  });
});
