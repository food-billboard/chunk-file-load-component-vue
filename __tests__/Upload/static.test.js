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

describe(`Upload static method test`, () => {
  describe('install test', () => {
    it(`install request test`, async () => {
      let doneNote = {
        completeFn: false,
        uploadFn: false,
        callback: false,
        exitDataFn: false,
      };

      await new Promise(async (resolve, reject) => {
        Upload.plugins.install(
          'request',
          customRequest({
            params: (params) => {},
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
            actionUrl: 'testInstallActionUrl',
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

    it(`install validator test`, async () => {
      const message = 'message-error';
      Upload.plugins.install('validator', (file) => {
        const type = file.type;
        return type.startsWith('video')
          ? null
          : {
              message,
              code: 'file-invalid-type',
            };
      });

      await new Promise(async (resolve, reject) => {

        const props = {
          propsData: {
            viewType: 'list',
            "on-validator": function(errorFile, fulFile) {
              expect(errorFile).toBeInstanceOf(Array);
              expect(errorFile.length).toEqual(1);
              expect(fulFile).toBeInstanceOf(Array);
              expect(fulFile.length).toEqual(0);
              resolve();
            },
            request: {
              exitDataFn,
              uploadFn,
              completeFn,
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

      });

      Upload.plugins.uninstall('validator');
    });
  });

  describe('uninstall test', () => {
    it(`uninstall request test`, async () => {
      Upload.plugins.uninstall('request');

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

    it(`uninstall validator test`, async () => {
      Upload.plugins.uninstall('validator');
      await new Promise(async (resolve, reject) => {

        const props = {
          propsData: {
            viewType: 'list',
            "on-validator": function(errorFile, fulFile) {
              expect(errorFile).toBeInstanceOf(Array);
              expect(errorFile.length).toEqual(0);
              expect(fulFile).toBeInstanceOf(Array);
              expect(fulFile.length).toEqual(1);
              resolve();
            },
            request: {
              exitDataFn,
              uploadFn,
              completeFn,
            },
          }
        };

        const wrapper = mount(Upload, props);

        await sleep(100);
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

      });
    });
  });
});
