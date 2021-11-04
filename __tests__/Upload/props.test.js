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
  deleteTask,
  stopTask,
  previewTask,
  createVue,
  destroyVM
} from './utils';
import {
  MOCK_COMPLETE_STRING_FILE,
  MOCK_COMPLETE_OBJECT_FILE,
} from './utils/constants';

const DEFAULT_REQUEST = {
  exitDataFn,
  uploadFn,
  completeFn,
  callback: () => {},
};

const isValidUrlFile = (files, partial, another) => {
  const realFiles = Array.isArray(files) ? files : [files];
  realFiles.forEach((file) => {
    if (typeof file === 'string') return;
    partial && !!file.id && expect(typeof file.id).toEqual('string');
    partial && !!file.local && expect(typeof file.local).toEqual('object');
    partial &&
      !!file.local &&
      !!file.local.type &&
      expect(file.local.type).toEqual('url');
    partial &&
      !!file.local &&
      !!file.local.value &&
      expect(typeof file.local.value).toEqual('object');
    partial &&
      !!file.local &&
      !!file.local.value &&
      !!file.local.value.fileId &&
      expect(typeof file.local.value.fileId).toEqual('string');
    partial &&
      !!file.getStatus &&
      expect(file.getStatus).toBeInstanceOf(Function);
    partial &&
      !!file.getStatus &&
      expect(typeof file.getStatus()).toEqual('number');
    another && another(file);
  });
};

const isUploadValidFile = (files, another) => {
  const realFiles = Array.isArray(files) ? files : [files];
  realFiles.forEach((file) => {
    expect(file.originFile).toBeInstanceOf(File);
    expect(typeof file.id).toEqual('string');
    expect(typeof file.local).toEqual('object');
    expect(file.local.type).toEqual('local');
    expect(typeof file.local.value).toEqual('object');
    expect(typeof file.local.value.fileId).toEqual('string');
    expect(typeof file.local.value.filename).toEqual('string');
    expect(typeof file.local.value.fileSize).toEqual('number');
    expect(typeof file.task).toEqual('object');
    expect(typeof file.name).toEqual('symbol');
    if (file.originFile.type.startsWith('image')) {
      expect(file.local.value.preview).toBeDefined();
    }
    expect(file.getStatus).toBeInstanceOf(Function);
    expect(typeof file.getStatus()).toEqual('number');
    another && another(file);
  });
};

describe(`Upload Component test`, () => {
  describe('defaultValue test', () => {
    it(`defaultValue set string`, () => {
      const props = {
        propsData: {
          viewType: 'list',
          defaultValue: MOCK_COMPLETE_STRING_FILE,
          request: DEFAULT_REQUEST,
        }
      };

      const wrapper = mount(Upload, props);

      const files = wrapper.vm.stateFiles;
      expect(files.length).toEqual(1);
      isValidUrlFile(files);
    });

    it(`defaultValue set string[]`, () => {
      const props = {
        propsData: {
          viewType: 'list',
          defaultValue: [MOCK_COMPLETE_STRING_FILE],
          request: DEFAULT_REQUEST,
        }
      };

      const wrapper = mount(Upload, props);

      const files = wrapper.vm.stateFiles
      expect(files.length).toEqual(1);
      isValidUrlFile(files);
    });

    it(`defaultValue set PartialWrapperFile`, () => {
      const name = MOCK_COMPLETE_OBJECT_FILE.name;
      const testName = MOCK_COMPLETE_OBJECT_FILE.local.value.filename;

      const props = {
        propsData: {
          viewType: 'list',
          defaultValue: [MOCK_COMPLETE_OBJECT_FILE],
          request: DEFAULT_REQUEST,
        }
      };

      const wrapper = mount(Upload, props);

      const files = wrapper.vm.stateFiles
      expect(files.length).toEqual(1);
      isValidUrlFile(files, false, (file) => {
        expect(file.name).toEqual(name);
        expect(file.local.value.filename).toEqual(testName);
      });
    });
  });

  describe('value test', () => {
    it(`value set string`, async () => {
      await new Promise(async (resolve, reject) => {
        let changeValue = [MOCK_COMPLETE_STRING_FILE];
        let wrapper 

        const props = {
          propsData: {
            viewType: 'list',
            "on-change": (value) => {
              const files = wrapper.vm.stateFiles
              expect(files.length).toEqual(1);
              const [formatCompleteFile] = files;
              expect(typeof formatCompleteFile).toEqual('object');
              isValidUrlFile(formatCompleteFile);
              if (value.length === 2) {
                expect(value).toBeInstanceOf(Array);
                expect(value.length).toEqual(2);
                const [completeFile, uploadFile] = value;
                isValidUrlFile(completeFile);
                isUploadValidFile(uploadFile);
                resolve();
              }
            },
            value: changeValue,
            request: {
              exitDataFn,
              uploadFn,
              completeFn,
            },
          }
        };

        wrapper = mount(Upload, props);

        wrapper.vm.onDrop([
          ChunkUpload.arraybuffer2file(
            new ArrayBuffer(FILE_SIZE),
            FILE_NAME,
            {
              type: FILE_TYPE,
            },
          ),
        ], [])

      });
    });

    it(`value set PartialWrapperFile`, async () => {
      await new Promise(async (resolve, reject) => {
        let changeValue = [MOCK_COMPLETE_OBJECT_FILE];
        let wrapper 

        const props = {
          propsData: {
            viewType: 'list',
            "on-change": (value) => {
              const files = wrapper.vm.stateFiles
              expect(files.length).toEqual(1);
              const [formatCompleteFile] = files;
              expect(typeof formatCompleteFile).toEqual('object');
              isValidUrlFile(formatCompleteFile);
              if (value.length === 2) {
                expect(value).toBeInstanceOf(Array);
                expect(value.length).toEqual(2);
                const [completeFile, uploadFile] = value;
                isValidUrlFile(completeFile, true);
                isUploadValidFile(uploadFile);
                resolve();
              }
            },
            value: changeValue,
            request: {
              exitDataFn,
              uploadFn,
              completeFn,
            },
          }
        };

        wrapper = mount(Upload, props);

        wrapper.vm.onDrop([
          ChunkUpload.arraybuffer2file(
            new ArrayBuffer(FILE_SIZE),
            FILE_NAME,
            {
              type: FILE_TYPE,
            },
          )
        ], [])

      });
    });
  });

  describe('onChange test', () => {
    it(`onChange set`, async () => {
      await new Promise(async (resolve, reject) => {

        const props = {
          propsData: {
            viewType: 'list',
            "on-change": (value) => {
              try {
                expect(value).toBeInstanceOf(Array);
                expect(value.length).toEqual(1);
                isUploadValidFile(value);
              } catch (err) {
                reject(err);
              }
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

        wrapper.vm.onDrop([
          ChunkUpload.arraybuffer2file(
            new ArrayBuffer(FILE_SIZE),
            FILE_NAME,
            {
              type: FILE_TYPE,
            },
          )
        ], [])
      });
    });
  });

  describe('onValidator test', () => {
    it(`onValidator fulfilled test`, async () => {
      await new Promise(async (resolve, reject) => {
        const message = 'message-error';

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
            validator: (file) => {
              const type = file.type;
              return type.startsWith('image')
                ? null
                : {
                    message,
                    code: 'file-invalid-type',
                  };
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
              )
            ]
          }
        })

      });
    });

    it(`onValidator rejected test`, async () => {
      await new Promise(async (resolve, reject) => {
        const message = 'message-error';

        const props = {
          propsData: {
            viewType: 'list',
            "on-validator": function(errorFile, fulFile) {
              expect(errorFile).toBeInstanceOf(Array);
              expect(errorFile.length).toEqual(1);
              errorFile.forEach((item) => {
                expect(typeof item).toEqual('object');
                expect(item.file).toBeInstanceOf(File);
                expect(item.errors).toBeInstanceOf(Array);
                expect(item.errors.length).not.toBe(0);
                expect(
                  item.errors.some((error) => {
                    expect(typeof error).toEqual('object');
                    return (
                      error.message === message &&
                      error.code === 'file-invalid-type'
                    );
                  }),
                ).toBeTruthy();
              });
              expect(fulFile).toBeInstanceOf(Array);
              expect(fulFile.length).toEqual(0);
              resolve();
            },
            validator: (file) => {
              const type = file.type;
              return type.startsWith('video')
                ? null
                : {
                    message,
                    code: 'file-invalid-type',
                  };
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
              )
            ]
          }
        })

      });
    });
  });

  describe('onRemove test', () => {
    it(`onRemove return false test`, async () => {
      await new Promise(async (resolve, reject) => {

        const props = {
          propsData: {
            viewType: 'list',
            "on-remove": function() {
              return false;
            },
            request: {
              exitDataFn,
              uploadFn,
              completeFn,
            },
            immediately: false,
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
          }
        })

        await sleep(1000)

        uploadTask(wrapper);
        deleteTask(wrapper);

        await sleep(100)

        const files = wrapper.vm.stateFiles
        expect(files.length).toEqual(1);
        resolve()

      });
    });

    it(`onRemove and use card viewType test`, async () => {
      await new Promise(async (resolve, reject) => {

        const props = {
          propsData: {
            viewType: 'card',
            "on-remove": function() {
              return true;
            },
            request: {
              exitDataFn,
              uploadFn,
              completeFn,
            },
            immediately: false,
          }
        };

        let wrapper = mount(Upload, props);

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

        await sleep(100)

        uploadTask(wrapper, 0, false);

        await sleep(100);

        deleteTask(wrapper, 0, false);
        
        await sleep(100);

        const files = wrapper.vm.stateFiles
        expect(files.length).toEqual(0);

        await sleep(1500);

        resolve();

      });
    });

    it(`onRemove return true test`, async () => {
      await new Promise(async (resolve, reject) => {

        const props = {
          propsData: {
            viewType: 'list',
            "on-remove": function() {
              return true;
            },
            request: {
              exitDataFn,
              uploadFn,
              completeFn,
            },
            immediately: false,
          }
        };

        let wrapper = mount(Upload, props);

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

        await sleep(100);

        uploadTask(wrapper);

        await sleep(100);

        deleteTask(wrapper);

        await sleep(100);

        const files = wrapper.vm.stateFiles;
        expect(files.length).toEqual(0);

        await sleep(1500);

        resolve();

      });
    });

    it(`onRemove delete unupload task test`, async () => {
      await new Promise(async (resolve, reject) => {

        const props = {
          propsData: {
            viewType: 'list',
            "on-remove": function() {
              return true;
            },
            request: {
              exitDataFn,
              uploadFn,
              completeFn,
            },
            immediately: false,
          }
        };

        let wrapper = mount(Upload, props);

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

        deleteTask(wrapper);

        await sleep(100);

        const files = wrapper.vm.stateFiles
        expect(files.length).toEqual(0);

        await sleep(1500);

        resolve();

      });
    });

    it(`onRemove return Promise boolean test`, async () => {
      await new Promise(async (resolve) => {

        const props = {
          propsData: {
            viewType: 'list',
            "on-remove": async () => {
              await sleep(100);
              return true;
            },
            request: {
              exitDataFn,
              uploadFn,
              completeFn,
            },
            immediately: false,
          }
        };

        let wrapper = mount(Upload, props);

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

        deleteTask(wrapper);

        await sleep(50);

        expect(wrapper.vm.stateFiles.length).toEqual(1);

        await sleep(1500);

        expect(wrapper.vm.stateFiles.length).toEqual(0);

        await sleep(100);

        resolve();

      });
    });

    it(`onRemove return unValid value test`, async () => {
      await new Promise(async (resolve) => {

        const props = {
          propsData: {
            viewType: 'list',
            "on-remove": async () => {
              await sleep(100);
              return null;
            },
            request: {
              exitDataFn,
              uploadFn,
              completeFn,
            },
            immediately: false,
          }
        };

        let wrapper = mount(Upload, props);

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

        deleteTask(wrapper);

        await sleep(50);

        expect(wrapper.vm.stateFiles.length).toEqual(1);

        await sleep(1500);

        expect(wrapper.vm.stateFiles.length).toEqual(0);

        await sleep(100);

        resolve();


      });
    });

    it(`onRemove return reject test`, async () => {
      await new Promise(async (resolve) => {

        const props = {
          propsData: {
            viewType: 'list',
            "on-remove": async () => {
              await sleep(100);
              return Promise.reject('test error');
            },
            request: {
              exitDataFn,
              uploadFn,
              completeFn,
            },
            immediately: false,
          }
        };

        let wrapper = mount(Upload, props);

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

        deleteTask(wrapper);

        await sleep(100);

        expect(wrapper.vm.stateFiles.length).toEqual(1);

        await sleep(1500);

        expect(wrapper.vm.stateFiles.length).toEqual(1);

        await sleep(100);

        resolve();

      });
    });
  });

  describe('itemRender test', () => {

    it(`itemRender return newElement test`, async () => {
      const defineItemNodeClass = 'defineItemNodeClass';

      let removeDone = false;
      let previewDone = false;
      let readIndex = 0;
      let uploadIndex = 0;

      const UploadWrapper = createVue({
        components: {
          Upload
        },
        render() {
          const props = {
            props: {
              viewType: 'list',
              immediately: false,
              "on-remove": function() {
                removeDone = true;
                return false;
              },
              "on-preview-file": function() {
                previewDone = true;
                return true;
              },
              itemRender: (originNode, file, fileList, action, info) => {
                const { preview, upload, cancel, stop } = action;
                const { complete, status, total } = info;
                expect(originNode).toBeDefined();
                expect(typeof file).toEqual('object');
                expect(Array.isArray(fileList)).toBeTruthy();
                expect(fileList.length).toEqual(1);
                expect(typeof preview).toEqual('function');
                expect(typeof upload).toEqual('function');
                expect(typeof cancel).toEqual('function');
                expect(typeof stop).toEqual('function');
                expect(file.task.status).toEqual(status);
                if (file.task.status === 2) {
                  expect(total).toEqual(FILE_SIZE);
                  expect(complete).toEqual(readIndex * file.task.config.chunkSize);
                  readIndex++;
                } else if (file.task.status === 3) {
                  expect(total).toEqual(
                    Math.ceil(FILE_SIZE / file.task.config.chunkSize),
                  );
                  expect(complete).toEqual(uploadIndex);
                  uploadIndex++;
                }
                return (
                  <div class={defineItemNodeClass}>
                    <span onClick={preview} class="item-render-preview">
                      预览
                    </span>
                    <span onClick={upload} class="item-render-upload">
                      上传
                    </span>
                    <span onClick={cancel} class="item-render-cancel">
                      取消
                    </span>
                    <span onClick={stop} class="item-render-stop">
                      停止
                    </span>
                  </div>
                );
              },
            }
          };
          return (
            <upload
              ref="upload-ref"
              {...props}
            ></upload>
          )
        }
      }, true)

      const wrapper = UploadWrapper.$refs["upload-ref"]

      wrapper.onInputFileChange({
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

      expect(!!wrapper.$el.querySelector(`.${defineItemNodeClass}`)).toBeTruthy();

      //上传
      wrapper.$el.querySelector('.item-render-upload').click()

      const [file] = wrapper.stateFiles
      expect(file.task.status > 0).toBeTruthy();

      //暂停
      wrapper.$el.querySelector('.item-render-stop').click()
      expect(file.task.status == -1).toBeTruthy();

      //取消
      wrapper.$el.querySelector('.item-render-cancel').click()
      expect(removeDone).toBeTruthy();

      //预览
      wrapper.$el.querySelector('.item-render-preview').click()
      expect(previewDone).toBeTruthy();

      destroyVM(wrapper)

    });

    it(`itemRender return originElement test`, () => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        propsData: {
          viewType: 'list',
          value: changeValue,
          immediately: false,
          itemRender: (originNode) => {
            return originNode;
          },
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find(`.chunk-upload-list-item`).exists()).toBeTruthy();
    });
  });

  describe('showUploadList test', () => {
    it(`showUploadList return false`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        propsData: {
          viewType: 'list',
          value: changeValue,
          immediately: false,
          showUploadList: false,
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find(`.chunk-upload-list-item`).exists()).toBeFalsy();

      done();
    });

    it(`showUploadList return true`, async () => {

      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          showUploadList: true,
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
          ]
        }
      })

      await sleep(100)

      expect(wrapper.find(`.chunk-upload-list-item`).exists()).toBeTruthy();
      const buttons = wrapper.findAll('.chunk-upload-list-item button');
      expect(buttons.length >= 3).toBeTruthy();

      //upload
      const upload = buttons.at(0).find('i');
      expect(upload.classes('bi-play-circle')).toBeTruthy();

      //remove
      const remove = buttons.at(1).find('i');
      expect(remove.classes('bi-trash')).toBeTruthy();

      //preview
      const preview = buttons.at(2).find('i');
      expect(preview.classes('bi-eye')).toBeTruthy();


    });

    it(`showUploadList return set previewIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        propsData: {
          viewType: 'list',
          value: changeValue,
          immediately: false,
          showUploadList: {
            showPreviewIcon: true,
          },
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find(`.chunk-upload-list-item`).exists()).toBeTruthy();
      const buttons = wrapper.findAll('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //preview
      const preview = buttons.at(0).find('i');
      expect(preview.classes('bi-eye')).toBeTruthy();

      done();
    });

    it(`showUploadList return set custom previewIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testPreviewIconClass = 'testPreviewIconClass';

      const UploadWrapper = createVue({
        components: {
          Upload
        },
        render() {
          const props = {
            props: {
              viewType: 'list',
              value: changeValue,
              immediately: false,
              showUploadList: {
                previewIcon: () => testPreviewIconClass
              },
            }
          };
          return (
            <upload
              ref="upload-ref"
              {...props}
            ></upload>
          )
        }
      }, true)

      const wrapper = UploadWrapper.$refs["upload-ref"]

      expect(!!wrapper.$el.querySelector(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.$el.querySelectorAll('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //preview
      const preview = buttons[0].querySelector(`.${testPreviewIconClass}`);

      expect(!!preview).toBeTruthy();

      destroyVM(wrapper)

      done();
    });

    it(`showUploadList return set custom function previewIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testPreviewIconClass = 'testPreviewIconClass';

      const UploadWrapper = createVue({
        components: {
          Upload
        },
        render() {
          const props = {
            props: {
              viewType: 'list',
              value: changeValue,
              immediately: false,
              showUploadList: {
                previewIcon: (file) => {
                  expect(typeof file).toBeDefined();
                  return testPreviewIconClass
                }
              },
            }
          };
          return (
            <upload
              ref="upload-ref"
              {...props}
            ></upload>
          )
        }
      }, true)

      const wrapper = UploadWrapper.$refs["upload-ref"]

      expect(!!wrapper.$el.querySelector(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.$el.querySelectorAll('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //preview
      const preview = buttons[0].querySelector(`.${testPreviewIconClass}`);
      expect(!!preview).toBeTruthy();

      destroyVM(wrapper)

      done();
    });

    it(`showUploadList return set uploadIcon show`, async () => {

      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          showUploadList: {
            showUploadIcon: true,
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
          ]
        }
      })

      await sleep(100)

      expect(wrapper.find(`.chunk-upload-list-item`).exists()).toBeTruthy();
      const buttons = wrapper.findAll('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //upload
      const preview = buttons.at(0).find('i');
      expect(preview.classes('bi-play-circle')).toBeTruthy();

    });

    it(`showUploadList return set custom uploadIcon show`, async () => {
      const testPreviewIconClass = 'testPreviewIconClassUpload';

      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          showUploadList: {
            uploadIcon: testPreviewIconClass
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
          ]
        }
      })
      
      await sleep(100)

      expect(wrapper.find(`.chunk-upload-list-item`).exists()).toBeTruthy();
      const buttons = wrapper.findAll('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //upload
      const preview = buttons.at(0).find('i');
      expect(preview.classes(testPreviewIconClass)).toBeTruthy();

    });

    it(`showUploadList return set custom function uploadIcon show`, async () => {
      const testPreviewIconClass = 'testPreviewIconClassUploadFunction';

      const UploadWrapper = createVue({
        components: {
          Upload
        },
        render() {
          const props = {
            props: {
              viewType: 'list',
              immediately: false,
              showUploadList: {
                uploadIcon: (file) => {
                  expect(typeof file).toBeDefined();
                  return testPreviewIconClass
                },
              },
            }
          };
          return (
            <upload
              ref="upload-ref"
              {...props}
            ></upload>
          )
        }
      }, true)

      const wrapper = UploadWrapper.$refs["upload-ref"]

      wrapper.onInputFileChange({
        target: {
          files: [
            ChunkUpload.arraybuffer2file(
              new ArrayBuffer(FILE_SIZE),
              FILE_NAME,
              {
                type: FILE_TYPE,
              },
            ),
          ]
        }
      })

      await sleep(100)

      expect(!!wrapper.$el.querySelector(`.chunk-upload-list-item`)).toBeTruthy();
      const buttons = wrapper.$el.querySelectorAll('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //preview
      const preview = buttons[0].querySelector(`.${testPreviewIconClass}`);
      console.log(buttons[0].innerHTML, 2222222)
      expect(!!preview).toBeTruthy();

    });

    it(`showUploadList return set removeIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        propsData: {
          viewType: 'list',
          value: changeValue,
          immediately: false,
          showUploadList: {
            showRemoveIcon: true,
          },
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find(`.chunk-upload-list-item`).exists()).toBeTruthy();
      const buttons = wrapper.findAll('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //upload
      const preview = buttons.at(0).find('i');
      expect(preview.classes('bi-trash')).toBeTruthy();

      done();
    });

    it(`showUploadList return set custom removeIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testPreviewIconClass = 'testPreviewIconClassUploadRemove';

      const props = {
        propsData: {
          viewType: 'list',
          value: changeValue,
          immediately: false,
          showUploadList: {
            removeIcon: testPreviewIconClass
          },
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find(`.chunk-upload-list-item`).exists()).toBeTruthy();
      const buttons = wrapper.findAll('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //upload
      const preview = buttons.at(0).find('i');
      expect(preview.classes(testPreviewIconClass)).toBeTruthy();

      done();
    });

    it(`showUploadList return set custom function removeIcon show`, (done) => {
      const changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testPreviewIconClass = 'testPreviewIconClassRemoveFunction';

      const props = {
        propsData: {
          viewType: 'list',
          value: changeValue,
          immediately: false,
          showUploadList: {
            removeIcon: (file) => {
              expect(typeof file).toBeDefined();
              return testPreviewIconClass
            },
          },
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find(`.chunk-upload-list-item`).exists()).toBeTruthy();
      const buttons = wrapper.findAll('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //preview
      const preview = buttons.at(0).find('i');
      expect(preview.classes(testPreviewIconClass)).toBeTruthy();

      done();
    });

    it(`showUploadList return set custom stopIcon show`, async () => {
      
      const testPreviewIconClass = 'testPreviewIconClassStop';

      const props = {
        propsData: {
          viewType: 'list',
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
          showUploadList: {
            uploadIcon: testPreviewIconClass
          },
          immediately: false,
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

      await sleep(100)

      uploadTask(wrapper);

      const buttons = wrapper.findAll('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //stop
      const stop = buttons.at(0).find('i');
      expect(stop.classes(testPreviewIconClass)).toBeTruthy();

    });

    it(`showUploadList return set custom function stopIcon show`, async () => {
      const testPreviewIconClass = 'testPreviewIconClassStop';

      const props = {
        propsData: {
          viewType: 'list',
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
          },
          showUploadList: {
            uploadIcon: (file) => {
              expect(file).toBeDefined();
              return testPreviewIconClass
            },
          },
          immediately: false,
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

      await sleep(100);

      uploadTask(wrapper);

      const buttons = wrapper.findAll('.chunk-upload-list-item button');
      expect(buttons.length >= 1).toBeTruthy();

      //stop
      const stop = buttons.at(0).find('i');
      expect(stop.classes(testPreviewIconClass)).toBeTruthy();

    });
  });

  describe('previewFile test', () => {
    it(`previewFile return false that use the default preview`, async () => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          "on-preview-file": function() {
            return true;
          },
          previewFile: async (file, viewType) => {
            await sleep(100);
            expect(file).toBeDefined();
            expect(viewType).toEqual('list');
            return false;
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

      //预览
      previewTask(wrapper);

      await sleep(1000);

      const modal = wrapper.find(`.el-dialog__wrapper`);
      const style = modal.attributes('style');
      expect(!style || !style.includes('display')).toBeTruthy();

    });

    it(`previewFile return false that use the default preview and use card viewType`, async () => {
      const props = {
        propsData: {
          viewType: 'card',
          immediately: false,
          "on-preview-file": function() {
            return true;
          },
          previewFile: async (file, viewType) => {
            await sleep(100);
            expect(file).toBeDefined();
            expect(viewType).toEqual('card');
            return false;
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

      //预览
      previewTask(wrapper, 0, false);

      await sleep(1000);

      const modal = wrapper.find(`.el-dialog__wrapper`);
      const style = modal.attributes('style');
      expect(!style || !style.includes('display')).toBeTruthy();

    });

    it(`previewFile return ReactNode that use newElement`, async () => {
      const defineItemNodeClass = 'definePreviewFileClass';

      let previewDone = false;

      const UploadWrapper = createVue({
        components: {
          Upload
        },
        render() {
          const props = {
            props: {
              viewType: 'card',
              immediately: false,
              onPreviewFile() {
                previewDone = true;
                return true;
              },
              previewFile: async (file, viewType) => {
                await sleep(100);
                expect(file).toBeDefined();
                expect(viewType).toEqual('card');
                return <span class={defineItemNodeClass}></span>;
              },
            }
          };
          return (
            <upload
              ref="upload-ref"
              {...props}
            ></upload>
          )
        }
      }, true)

      const wrapper = UploadWrapper.$refs["upload-ref"]

      wrapper.onInputFileChange({
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

      //预览
      const target = wrapper.$el.querySelectorAll('.chunk-upload-action-modal')
      const button = target[0].querySelectorAll('button');
      button[2].click()
      await sleep(1000);

      expect(!!wrapper.$el.querySelector(`.${defineItemNodeClass}`)).toBeTruthy();
      expect(previewDone).toBeTruthy();

      destroyVM(wrapper)

    });
  });

  describe('onPreviewFile test', () => {
    it(`onPreviewFile return false and that not show the preview`, async () => {
      let previewDone = false;
      let previewFileDone = false;

      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          onPreviewFile() {
            previewDone = true;
            return false;
          },
          previewFile: () => {
            previewFileDone = true;
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

      //预览
      previewTask(wrapper);
      await sleep(1000);

      expect(previewFileDone).toBeFalsy();
      expect(previewDone).toBeTruthy();

    });

    it(`onPreviewFile return false and that not show the custom preview`, async () => {
      const defineItemNodeClass = 'definePreviewFileClass';

      let previewDone = false;

      const UploadWrapper = createVue({
        components: {
          Upload
        },
        render() {
          const props = {
            props: {
              viewType: 'list',
              immediately: false,
              "on-preview-file": function() {
                previewDone = true;
                return false;
              },
              previewFile: async (file, viewType) => {
                await sleep(100);
                expect(file).toBeDefined();
                expect(viewType).toEqual('list');
                return <span class={defineItemNodeClass}></span>;
              },
            }
          };
          return (
            <upload
              ref="upload-ref"
              {...props}
            ></upload>
          )
        }
      }, true)

      const wrapper = UploadWrapper.$refs["upload-ref"]

      wrapper.onInputFileChange({
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

      //预览
      const target = wrapper.$el.querySelectorAll('.chunk-upload-list-item')
      const button = target[0].querySelectorAll('button');
      button[2].click()
      await sleep(1000);

      expect(!!wrapper.$el.querySelector(`.${defineItemNodeClass}`)).toBeFalsy();
      expect(previewDone).toBeTruthy();

    });

    
  });

  describe('containerRender test', () => {
    it(`containerRender return list viewType container`, async () => {
      const testClassName = 'testClassName-container';

      const UploadWrapper = createVue({
        components: {
          Upload
        },
        render() {
          const props = {
            props: {
              viewType: 'list',
              request: DEFAULT_REQUEST,
              immediately: false,
              locale: {
                container: '你好',
              },
              containerRender: (params) => {
                const {
                  isDragAccept,
                  isDragActive,
                  isDragReject,
                  isFocused,
                  isFileDialogActive,
                  isLimit,
                  locale,
                } = params 
                expect(typeof isDragAccept).toEqual('boolean');
                expect(typeof isDragActive).toEqual('boolean');
                expect(typeof isDragReject).toEqual('boolean');
                expect(typeof isFocused).toEqual('boolean');
                expect(typeof isFileDialogActive).toEqual('boolean');
                expect(typeof isLimit).toEqual('boolean');
                expect(typeof locale).toEqual('object');
                expect(locale.container).toEqual('你好');
                return <span class={testClassName}>hello</span>;
              },
            }
          };
          return (
            <upload
              ref="upload-ref"
              {...props}
            ></upload>
          )
        }
      }, true)

      const wrapper = UploadWrapper.$refs["upload-ref"]

      wrapper.onInputFileChange({
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

      const files = wrapper.stateFiles
      expect(files.length).toEqual(1);

      expect(!!wrapper.$el.querySelector(`.${testClassName}`)).toBeTruthy();
    });
  });

  describe('immediately test', () => {
    it(`immediately set true will upload immediately`, async () => {

      const props = {
        propsData: {
          viewType: 'list',
          immediately: true,
          request: DEFAULT_REQUEST,
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

      const files = wrapper.vm.stateFiles;
      expect(files.length).toEqual(1);
      expect(files[0].getStatus() != 0).toBeTruthy();

    });

    it(`immediately set false need click button to upload`, async () => {

      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          request: DEFAULT_REQUEST,
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

      const files = wrapper.vm.stateFiles;
      expect(files.length).toEqual(1);
      expect(files[0].getStatus() == 0).toBeTruthy();

    });
  });

  describe('lifecycle test', () => {
    it(`normal lifecycle test`, async () => {
      await new Promise(async (resolve, reject) => {

        const lifecycle = {
          beforeRead: 0,
          reading: 0,
          beforeCheck: 0,
          afterCheck: 0,
          uploading: 0,
          beforeComplete: 0,
          afterComplete: 0,
        };

        const props = {
          propsData: {
            viewType: 'list',
            immediately: true,
            request: {
              ...DEFAULT_REQUEST,
              callback: (error, value) => {
                let realError = error;
                try {
                  expect(
                    Object.values(lifecycle).every((item) => !!item),
                  ).toBeTruthy();
                } catch (err) {
                  realError = err;
                }
                if (realError) {
                  reject(error);
                } else {
                  resolve();
                }
              },
            },
            lifecycle: {
              beforeRead() {
                lifecycle.beforeRead++;
              },
              reading() {
                lifecycle.reading++;
              },
              beforeCheck() {
                lifecycle.beforeCheck++;
              },
              afterCheck() {
                lifecycle.afterCheck++;
              },
              uploading() {
                lifecycle.uploading++;
              },
              beforeComplete() {
                lifecycle.beforeComplete++;
              },
              afterComplete() {
                lifecycle.afterComplete++;
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

        const files = wrapper.vm.stateFiles
        expect(files.length).toEqual(1);

      });
    });

    it(`rejected lifecycle test`, async () => {
      await new Promise(async (resolve, reject) => {

        const lifecycle = {
          beforeRead: 0,
          reading: 0,
          beforeCheck: 0,
          afterCheck: 0,
          uploading: 0,
          beforeComplete: 0,
          afterComplete: 0,
        };

        const props = {
          propsData: {
            viewType: 'list',
            immediately: true,
            request: {
              ...DEFAULT_REQUEST,
              completeFn: () => {
                throw new Error();
              },
              callback: (error) => {
                try {
                  const { afterComplete, ...nextLifecycle } = lifecycle;
                  expect(!!error).toBeTruthy();
                  expect(
                    Object.values(nextLifecycle).every((item) => !!item),
                  ).toBeTruthy();
                  expect(afterComplete).toEqual(0);
                } catch (err) {
                  reject(err);
                }
                resolve();
              },
            },
            lifecycle: {
              beforeRead() {
                lifecycle.beforeRead++;
              },
              reading() {
                lifecycle.reading++;
              },
              beforeCheck() {
                lifecycle.beforeCheck++;
              },
              afterCheck() {
                lifecycle.afterCheck++;
              },
              uploading() {
                lifecycle.uploading++;
              },
              beforeComplete() {
                lifecycle.beforeComplete++;
              },
              afterComplete() {
                lifecycle.afterComplete++;
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

        const files = wrapper.vm.stateFiles
        expect(files.length).toEqual(1);
      });
    });

    it(`stop lifecycle test`, async () => {
      await new Promise(async (resolve, reject) => {
        let changed = false;
        let wrapper 

        const lifecycle = {
          beforeRead: 0,
          reading: 0,
          beforeCheck: 0,
          afterCheck: 0,
          uploading: 0,
          beforeComplete: 0,
          afterComplete: 0,
          afterStop: 0,
        };

        const props = {
          propsData: {
            viewType: 'list',
            immediately: true,
            onChange(value) {
              if (value.length == 1) {
                changed = true;
              }
            },
            request: {
              ...DEFAULT_REQUEST,
              callback: (error) => {
                try {
                  const { afterComplete, ...nextLifecycle } = lifecycle;
                  expect(!!error).toBeTruthy();
                  expect(
                    Object.values(nextLifecycle).every((item) => !!item),
                  ).toBeTruthy();
                  expect(afterComplete).toEqual(0);
                  expect(changed).toBeTruthy;
                  const files = wrapper.vm.stateFiles
                  expect(files[0].getStatus()).toEqual(-1);
                } catch (err) {
                  reject(err);
                }
                resolve();
              },
            },
            lifecycle: {
              afterStop() {
                lifecycle.afterStop++;
              },
              beforeRead() {
                lifecycle.beforeRead++;
              },
              reading() {
                lifecycle.reading++;
              },
              beforeCheck() {
                lifecycle.beforeCheck++;
              },
              afterCheck() {
                lifecycle.afterCheck++;
              },
              uploading() {
                lifecycle.uploading++;
              },
              beforeComplete() {
                lifecycle.beforeComplete++;
                stopTask(wrapper);
              },
              afterComplete() {
                lifecycle.afterComplete++;
              },
            },
          }
        };

        wrapper = mount(Upload, props);

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

    it(`cancel lifecycle test`, async () => {
      await new Promise(async (resolve, reject) => {
        let changed = false;
        let wrapper 

        const lifecycle = {
          beforeRead: 0,
          reading: 0,
          beforeCheck: 0,
          afterCheck: 0,
          uploading: 0,
          beforeComplete: 0,
          afterComplete: 0,
          afterCancel: 0,
        };

        const props = {
          propsData: {
            viewType: 'list',
            immediately: true,
            onChange(value) {
              if (value.length == 1) {
                changed = true;
              }
            },
            request: {
              ...DEFAULT_REQUEST,
              callback: (error) => {
                try {
                  const { afterComplete, ...nextLifecycle } = lifecycle;
                  expect(!!error).toBeTruthy();
                  expect(
                    Object.values(nextLifecycle).every((item) => !!item),
                  ).toBeTruthy();
                  expect(afterComplete).toEqual(0);
                  expect(changed).toBeTruthy;
                  const files = wrapper.vm.stateFiles
                  expect(files.length).toEqual(0);
                } catch (err) {
                  reject(err);
                }
                resolve();
              },
            },
            lifecycle: {
              afterCancel() {
                lifecycle.afterCancel++;
              },
              beforeRead() {
                lifecycle.beforeRead++;
              },
              reading() {
                lifecycle.reading++;
              },
              beforeCheck() {
                lifecycle.beforeCheck++;
              },
              afterCheck() {
                lifecycle.afterCheck++;
              },
              uploading() {
                lifecycle.uploading++;
              },
              beforeComplete() {
                lifecycle.beforeComplete++;
                deleteTask(wrapper);
              },
              afterComplete() {
                lifecycle.afterComplete++;
              },
            },
          }
        };

        wrapper = mount(Upload, props);

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

  describe('accept test', () => {
    it(`accept video set test`, (done) => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          "on-change": function(value) {
            expect(value.length).toEqual(0);
            done();
          },
          "on-validator": function(error, value) {
            expect(error.length).toEqual(1);
          },
          accept: 'video/*',
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

    });
  });

  describe('minSize test', () => {
    it(`set minSize limit the fileSize`, (done) => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          "on-change": function(value) {
            expect(value.length).toEqual(0);
            done();
          },
          "on-validator": function(error) {
            expect(error.length).toEqual(1);
          },
          minSize: FILE_SIZE + 100,
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

    });
  });

  describe('maxSize test', () => {
    it(`set maxSize limit the fileSize`, (done) => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          "on-change": function(value) {
            expect(value.length).toEqual(0);
            done();
          },
          "on-validator": function(error) {
            expect(error.length).toEqual(1);
          },
          maxSize: FILE_SIZE - 100,
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

    });
  });

  describe('maxFiles test', () => {
    it(`set maxFiles limit the file length`, (done) => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          "on-change": function(value) {
            expect(value.length).toEqual(0);
            done();
          },
          "on-validator": function(error) {
            expect(error.length).toEqual(2);
          },
          maxFiles: 1,
          multiple: true,
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

    });

    it(`set maxFiles for 0 to not limit the file length`, (done) => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          "on-change": function(value) {
            expect(value.length).toEqual(2);
            done();
          },
          "on-validator": function(error) {
            expect(error.length).toEqual(0);
          },
          maxFiles: 0,
          multiple: true,
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
    
    });

    it(`not set maxFiles to not limit the file length`, (done) => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          "on-change": function(value) {
            expect(value.length).toEqual(2);
            done();
          },
          "on-validator": function(error) {
            expect(error.length).toEqual(0);
          },
          multiple: true,
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

    });
  });

  describe('limit test', () => {
    it(`set limit the file length`, () => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          limit: 1,
          value: [MOCK_COMPLETE_STRING_FILE],
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find('.chunk-upload-dropzone-list').exists()).toBeFalsy();
    });

    it(`set limit the file length and the custom container params isLimit is true`, () => {

      const UploadWrapper = createVue({
        components: {
          Upload
        },
        render() {
          const props = {
            props: {
                viewType: 'list',
              immediately: false,
              limit: 1,
              value: [MOCK_COMPLETE_STRING_FILE],
              containerRender: ({ isLimit }) => {
                expect(isLimit).toBeTruthy();
                return <span></span>;
              },
            }
          };
          return (
            <upload
              {...props}
            />
          )
        }
      })
    
      destroyVM(UploadWrapper)

    });

    it(`not set limit the file length`, () => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          value: [MOCK_COMPLETE_STRING_FILE],
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find('.chunk-upload-dropzone-list').exists()).toBeTruthy();
    });

    it(`set limit value for -1`, () => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          value: [MOCK_COMPLETE_STRING_FILE],
          limit: -1,
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find('.chunk-upload-dropzone-list').exists()).toBeTruthy();
    });
  });

  describe('disabled test', () => {
    it.skip(`set disabled to disable click upload`, async () => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          disabled: true,
        }
      };

      const wrapper = mount(Upload, props);

      wrapper.vm.selectFiles()

      await sleep(100);

      expect(wrapper.vm.stateFiles.length).toEqual(0);

    });

    it(`set disabled to disable drop upload`, async () => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          disabled: true,
        }
      };

      const wrapper = mount(Upload, props);

      wrapper.vm.$refs["chunk-file-load-drag"].onInternalDrop({
        dataTransfer: {
          files: [
            ChunkUpload.arraybuffer2file(
              new ArrayBuffer(FILE_SIZE),
              FILE_NAME,
              {
                type: FILE_TYPE,
              },
            ),
          ],
        }
      })

      await sleep(100);

      expect(wrapper.vm.stateFiles.length).toEqual(0);

    });
  });

  describe('multiple test', () => {
    it(`can select multiple file`, (done) => {
      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          "on-change": function(value) {
            expect(value.length).toEqual(2);
            done();
          },
          multiple: true,
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

    });
  });

  describe('locale test', () => {
    const valid = (value, wrapper, find) => {
      const wrapperProgress = wrapper.find(find);
      expect(wrapperProgress.element.innerHTML.includes(value)).toBeTruthy()
    };

    it(`set locale list`, async () => {
      await new Promise(async (resolve, reject) => {

        let wrapper 

        const locale = {
          container: 'testLocaleListContainer',
          containerIcon: 'testLocaleListContainerIcon',
          progress: {
            pending: 'testLocaleListPending',
            waiting: 'testLocaleListWaiting',
            reading: 'testLocaleListReading',
            uploading: 'testLocaleListUploading',
            fulfilled: 'testLocaleListFulfilled',
          },
        };

        const props = {
          propsData: {
            viewType: 'list',
            immediately: false,
            request: {
              ...DEFAULT_REQUEST,
              callback: (error, value) => {
                valid(
                  locale.progress.fulfilled,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              },
            },
            locale: locale,
            lifecycle: {
              async beforeRead() {
                await sleep(100)
                valid(
                  locale.progress.reading,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
              reading() {
                valid(
                  locale.progress.reading,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
              beforeCheck() {
                valid(
                  locale.progress.uploading,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
              afterCheck() {
                valid(
                  locale.progress.uploading,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
              uploading() {
                valid(
                  locale.progress.uploading,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
              beforeComplete() {
                valid(
                  locale.progress.uploading,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
              afterComplete() {
                valid(
                  locale.progress.fulfilled,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
            },
          }
        };

        wrapper = mount(Upload, props);
        const wrapperIcon = wrapper.find('.chunk-upload-container-icon');
        expect(wrapperIcon.element.innerHTML.includes(locale.containerIcon)).toBeTruthy();
        const wrapperContainer = wrapper.find('.chunk-upload-dropzone-list');
        expect(wrapperContainer.element.innerHTML.includes(locale.container)).toBeTruthy();

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

        const files = wrapper.vm.stateFiles
        expect(files.length).toEqual(1);
        expect(files[0].getStatus() == 0).toBeTruthy();

        uploadTask(wrapper);

      });
    });

    it(`set locale card`, async () => {
      await new Promise(async (resolve, reject) => {

        const locale = {
          container: 'testLocaleCardContainer',
          containerIcon: 'testLocaleCardContainerIcon',
          progress: {
            pending: 'testLocaleCardPending',
            waiting: 'testLocaleCardWaiting',
            reading: 'testLocaleCardReading',
            uploading: 'testLocaleCardUploading',
            fulfilled: 'testLocaleCardFulfilled',
          },
        };

        const props = {
          propsData: {
            viewType: 'card',
            immediately: false,
            request: {
              ...DEFAULT_REQUEST,
              callback: (error, value) => {
                valid(
                  locale.progress.fulfilled,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              },
            },
            locale: locale,
            lifecycle: {
              async beforeRead() {
                await sleep(100)
                valid(
                  locale.progress.reading,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
              reading() {
                valid(
                  locale.progress.reading,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
              beforeCheck() {
                valid(
                  locale.progress.uploading,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
              afterCheck() {
                valid(
                  locale.progress.uploading,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
              uploading() {
                valid(
                  locale.progress.uploading,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
              beforeComplete() {
                valid(
                  locale.progress.uploading,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
              afterComplete() {
                valid(
                  locale.progress.fulfilled,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
              },
            },
          }
        };

        const wrapper = mount(Upload, props);
        const wrapperIcon = wrapper.find(
          '.chunk-upload-dropzone-card-content-icon-content',
        );
        expect(wrapperIcon.element.innerHTML.includes(locale.containerIcon)).toBeTruthy();
        const wrapperContainer = wrapper.find(
          '.chunk-upload-dropzone-card-content',
        );
        expect(wrapperContainer.element.innerHTML.includes(locale.container)).toBeTruthy();

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

        const files = wrapper.vm.stateFiles
        expect(files.length).toEqual(1);
        expect(files[0].getStatus() == 0).toBeTruthy();

        uploadTask(wrapper, 0, false);

        await sleep(1000);

      });
    });

    it(`set locale on stop locale`, async () => {
      await new Promise(async (resolve, reject) => {
        let stopDone = false;

        const locale = {
          progress: {
            stopping: 'testLocaleListStopStopping',
          },
        };

        const props = {
          propsData: {
            viewType: 'list',
            immediately: false,
            request: {
              ...DEFAULT_REQUEST,
              uploadFn: () => {
                stopTask(wrapper);
              },
              callback: (error, value) => {
                expect(stopDone).toBeTruthy();
                if (error) {
                  resolve();
                } else {
                  reject();
                }
              },
            },
            locale: locale,
            lifecycle: {
              afterStop: () => {
                stopDone = true;
                valid(
                  locale.progress.stopping,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
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

        const files = wrapper.vm.stateFiles
        expect(files.length).toEqual(1);
        expect(files[0].getStatus() == 0).toBeTruthy();

        uploadTask(wrapper);

        await sleep(1000);

      });
    });

    it(`set locale on reject locale`, async () => {
      await new Promise(async (resolve, reject) => {

        const locale = {
          progress: {
            rejected: 'testLocaleListRejectRejected',
          },
        };

        const props = {
          propsData: {
            viewType: 'list',
            immediately: false,
            request: {
              ...DEFAULT_REQUEST,
              uploadFn: () => {
                throw new Error();
              },
              callback: (error, value) => {
                valid(
                  locale.progress.rejected,
                  wrapper,
                  '.chunk-upload-list-progress-status',
                );
                if (error) {
                  resolve();
                } else {
                  reject();
                }
              },
            },
            locale: locale,
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

        const files = wrapper.vm.stateFiles
        expect(files.length).toEqual(1);
        expect(files[0].getStatus() == 0).toBeTruthy();

        uploadTask(wrapper);

        await sleep(1000);

      });
    });
  });

  describe('onError test', () => {
    it('upload error deal the onError', async () => {
      await new Promise(async (resolve, reject) => {
        let errorDone = false;

        const props = {
          propsData: {
            viewType: 'list',
            immediately: true,
            "on-error": (error, files) => {
              errorDone = true;
              expect(!!error).toBeTruthy();
              expect(files.error === error).toBeTruthy();
            },
            request: {
              ...DEFAULT_REQUEST,
              completeFn: () => {
                throw new Error();
              },
              callback: (error) => {
                try {
                  expect(!!error).toBeTruthy();
                  expect(errorDone).toBeTruthy();
                } catch (err) {
                  reject(err);
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

        const files = wrapper.vm.stateFiles
        expect(files.length).toEqual(1);
      });

    });
  });

  describe('viewStyle test', () => {
    it(`viewStyle test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testStyle = {
        color: 'red',
      };

      const props = {
        propsData: {
          viewType: 'list',
          value: changeValue,
          immediately: false,
          viewStyle: testStyle,
          request: DEFAULT_REQUEST
        }
      };

      const wrapper = mount(Upload, props);

      const aside = wrapper.find('aside');

      const asideProps = aside.attributes();

      expect(asideProps.style).toBeDefined();
      const realStyle = asideProps.style.split(";").filter(item => !!item).map(item => item.trim()).reduce((acc, item) => {
        const [ key, value ] = item.split(":").map(item => item.trim()).filter(item => !!item)
        acc[key] = value 
        return acc 
      }, {})
      const isEqual = Object.entries(testStyle).every((item) => {
        const [key, value] = item;
        return realStyle[key] === value;
      });

      expect(isEqual).toBeTruthy();

      done();
    });
  });

  describe('viewClassName test', () => {
    it(`viewClassName test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];
      const testClassName = 'testClassName';

      const props = {
        propsData: {
          viewType: 'list',
          value: changeValue,
          immediately: false,
          viewClassName: testClassName,
        }
      };

      const wrapper = mount(Upload, props);

      const aside = wrapper.find('aside');

      expect(aside.attributes().class.includes(testClassName)).toBeTruthy();

      done();
    });
  });

  describe('viewType test', () => {
    it(`set list viewType test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        propsData: {
          viewType: 'list',
          value: changeValue,
          immediately: false,
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find('.chunk-upload-list-item').exists()).toBeTruthy();

      done();
    });

    it(`set card viewType test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        propsData: {
          viewType: 'card',
          value: changeValue,
          immediately: false,
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find('.chunk-upload-card-item').exists()).toBeTruthy();

      done();
    });

    it(`not set viewType test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        propsData: {
          value: changeValue,
          immediately: false,
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find('.chunk-upload-list-item').exists()).toBeTruthy();

      done();
    });
  });

  describe('iconRender test', () => {
    it(`iconRender return newElement test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];
      const defineIconNodeClass = 'defineIconNodeClass';

      const UploadWrapper = createVue({
        components: {
          Upload 
        },
        render() {
          const props = {
            props: {
              viewType: 'list',
              value: changeValue,
              immediately: false,
              iconRender: (file, viewType, originNode) => {
                expect(file).toBeDefined();
                expect(viewType).toEqual('list');
                expect(originNode).toBeDefined();
                return <span class={defineIconNodeClass}></span>;
              },
            }
          };
          return (
            <upload
              {...props}
              ref="upload-ref"
            />
          )
        }
      }, true)

      const wrapper = UploadWrapper.$refs["upload-ref"]

      expect(!!wrapper.$el.querySelector(`.${defineIconNodeClass}`)).toBeTruthy();

      done();
    });

    it(`iconRender return originElement test`, (done) => {
      let changeValue = [MOCK_COMPLETE_STRING_FILE];

      const props = {
        propsData: {
          viewType: 'list',
          value: changeValue,
          immediately: false,
          iconRender: (file, viewType, originNode) => {
            expect(file).toBeDefined();
            expect(viewType).toEqual('list');
            expect(originNode).toBeDefined();
            return originNode;
          },
        }
      };

      const wrapper = mount(Upload, props);

      expect(wrapper.find(`.chunk-upload-view-list-icon`).exists()).toBeTruthy();

      done();
    });

  });
});
