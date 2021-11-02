import Vue from 'vue'
import { mount } from '@vue/test-utils'
import { Upload as ChunkUpload } from 'chunk-file-upload';
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
  DEFAULT_REQUEST
} from './utils';

describe.skip(`error test`, () => {

  it(`remove file when the file is uploading`, async () => {
    await new Promise(async (resolve, reject) => {

      let first = true;

      const props = {
        propsData: {
          viewType: 'list',
          "on-change": (value) => {
            try {
              if (first) {
                expect(value.length).toEqual(1);
                first = false;
              } else {
                expect(value.length).toEqual(0);
              }
            }catch(err) {
              reject(err)
            }
          },
          request: {
            exitDataFn,
            uploadFn,
            completeFn,
            callback(error) {
              expect(!!error).toBeTruthy()
              resolve()
            }
          },
          immediately: false,
        }
      };

      let wrapper = mount(Upload, props);

      wrapper.vm.onDrop([ChunkUpload.arraybuffer2file(
        new ArrayBuffer(FILE_SIZE),
        FILE_NAME,
        {
          type: FILE_TYPE,
        },
      )], [])

      await sleep(100)

      await uploadTask(wrapper);

      await sleep(100)

      await deleteTask(wrapper);

    });
  });

  it(`remove many file in little times and file is uploading`, async () => {
    await new Promise(async (resolve, reject) => {

      let index = 0;
      let wrapper 

      const props = {
        propsData: {
          viewType: 'list',
          "on-remove": async () => {
            await sleep(300);
            index++
            if (index == 3) {
              sleep(1000)
              .then((_) => {
                const value = wrapper.vm.stateFiles
                expect(value.length).toEqual(0);
                resolve();
              })
              .catch(err => {
                reject(err)
              })
            }
            return true;
          },
          request: {
            exitDataFn: async (...args) => {
              await sleep(300);
              return exitDataFn(...args);
            },
            uploadFn,
            completeFn,
          },
          immediately: false,
          multiple: true,
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
      ], [])

      await sleep(1000);

      for (let i = 0; i < 3; i++) {
        uploadTask(wrapper, i);
        await sleep(60);
      }

      for (let i = 0; i < 3; i++) {
        deleteTask(wrapper, i);
        await sleep(60);
      }

    });
  });

  it(`use the callback style setState on onChange`, async () => {
    await new Promise(async (resolve, reject) => {
      let errorDone = false;

      const props = {
        propsData: {
          viewType: 'list',
          immediately: true,
          "on-error": (error, files) => {
            errorDone = true;
            expect(!!error).toBeTruthy();
          },
          "on-change": (value) => {
            expect(value).toBeInstanceOf(Array);
          },
          request: {
            exitDataFn,
            uploadFn,
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

      wrapper.vm.onDrop([ChunkUpload.arraybuffer2file(
        new ArrayBuffer(FILE_SIZE),
        FILE_NAME,
        {
          type: FILE_TYPE,
        },
      ),], [])

      await sleep(1000);

      expect(wrapper.vm.stateFiles.length).toEqual(1);

    });
  });

  it(`change the viewType when uploading`, async () => {

    await new Promise(async (resolve, reject) => {

      const props = {
        propsData: {
          viewType: "list",
          immediately: false,
          request: {
            uploadFn: (...args) => {
              return uploadFn(...args);
            },
            exitDataFn: (...args) => {
              return exitDataFn(...args);
            },
            callback: (error, value) => {
              if(error) {
                reject(error)
              }else {
                resolve()
              }
            },
          }
        }
      }

      const wrapper = mount(Upload, props);

      wrapper.vm.onDrop([ChunkUpload.arraybuffer2file(
        new ArrayBuffer(FILE_SIZE),
        FILE_NAME,
        {
          type: FILE_TYPE,
        },
      ),], [])

      await sleep(1000);

      uploadTask(wrapper);

      const prevFiles = wrapper.vm.stateFiles
      expect(prevFiles.length).toEqual(1);

      const [ prevFile ] = prevFiles
      const prevStatus = prevFile.getStatus() 
      const { current: prevCurrent } = prevFile.getProgress()

      await wrapper.setProps({
        viewType: "card"
      })

      expect(wrapper.props().viewType).toEqual("card")

      await sleep(10)

      const files = wrapper.vm.stateFiles
      expect(files.length).toEqual(1);

      const [ file ] = files
      const status = file.getStatus() 
      const { current } = file.getProgress()

      expect(status >= prevStatus).toBeTruthy()
      expect(current >= prevCurrent).toBeTruthy()

    });

  })

  it(`change the viewType when uploaded`, async () => {

    await new Promise(async (resolve, reject) => {

      let wrapper 

      const props = {
        propsData: {
          viewType: "list",
          immediately: false,
          request: {
            uploadFn,
            exitDataFn,
            callback: async (error, value) => {
              const prevFiles = wrapper.vm.stateFiles;
              expect(prevFiles.length).toEqual(1);
      
              const [ prevFile ] = prevFiles
              const prevStatus = prevFile.getStatus() 
              const { current: prevCurrent } = prevFile.getProgress()
      
              await wrapper.setProps({ viewType: "card" })

              expect(wrapper.props().viewType).toEqual("card")
      
              const files = wrapper.vm.stateFiles;
              expect(files.length).toEqual(1);
      
              const [ file ] = files
              const status = file.getStatus() 
              const { current } = file.getProgress()
      
              expect(status == prevStatus).toBeTruthy()
              expect(current == prevCurrent).toBeTruthy()
              if(error) {
                reject(error)
              }else {
                resolve()
              }
            },
          }
        }
      }

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

      await sleep(1000);

      uploadTask(wrapper);

      const prevFiles = wrapper.vm.stateFiles;
      expect(prevFiles.length).toEqual(1);

    });

  })

  it(`continue the task when the task stop before`, async () => {

    await new Promise(async (resolve, reject) => {
      let stopDone = false;
      let wrapper 

      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          request: {
            ...DEFAULT_REQUEST,
            exitDataFn,
            uploadFn,
            callback: (error) => {
              if(stopDone) {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              }else {
                stopDone = true 
                sleep(100)
                .then(_ => {
                  uploadTask(wrapper)
                })
              }
            },
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

      await sleep(1000);

      const files = wrapper.vm.stateFiles;
      expect(files.length).toEqual(1);
      expect(files[0].getStatus() == 0).toBeTruthy();

      uploadTask(wrapper);

      await sleep(100)

      stopTask(wrapper)

    });

  })

  it(`retry the task when the task error before`, async () => {

    await new Promise(async (resolve, reject) => {
      let errorDone = false;
      let wrapper 

      const props = {
        propsData: {
          viewType: 'list',
          immediately: false,
          request: {
            ...DEFAULT_REQUEST,
            exitDataFn,
            uploadFn: (...args) => {
              if(!errorDone) {
                throw new Error()
              }
              return uploadFn(...args)
            },
            callback: (error, value) => {
              if(errorDone) {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                }
              }else {
                errorDone = true 
                sleep(100)
                .then(_ => uploadTask(wrapper))
              }
            },
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

      await sleep(1000);

      const files = wrapper.vm.stateFiles;
      expect(files.length).toEqual(1);
      expect(files[0].getStatus() == 0).toBeTruthy();

      uploadTask(wrapper);

    });

  })

});