<script>
  import classnames from 'classnames'
  import { nanoid } from 'nanoid'
  import { get, merge } from 'lodash'
  import Drag from './components/drag'
  import Container from './components/container'
  import ViewList from './components/view'
  import PreviewModal from './components/preview'
  import { 
    PropsValidator, 
    emitter, 
    propsValueFormat, 
    UploadInstance, 
    getInstallMap, 
    createPreview 
  } from './utils'

  const releaseEmitter = (name) => {
    emitter.off(name)
  }

  export default {
    name: 'uploac-component',
    components: {
      Container,
      Drag,
      ViewList,
      PreviewModal
    },
    props: {
      value: {
        type: String | Array | Object,
        required: false,
        validator: PropsValidator.value 
      },
      defaultValue: {
        type: String | Array | Object,
        required: false,
        validator: PropsValidator.defaultValue 
      },
      onChange: {
        type: Function,
        required: false,
      },
      onRemove: {
        type: Function,
        default() {
          return function() {
            return true 
          }
        }
      },
      onValidator: {
        type: Function,
        required: false,
      },
      onError: {
        type: Function,
        required: false,
      },
      containerStyle: Object,
      containerClass: String | Object,
      viewStyle: {
        type: Object,
        default() {
          return {}
        }
      },
      viewClassName: String,
      viewType: {
        type: String,
        required: false,
        default: "list",
        validator: PropsValidator.viewType 
      },
      request: {
        type: Object,
        default() {
          return {}
        },
      },
      lifecycle: Object,
      iconRender: Function,
      itemRender: Function,
      previewFile: Function,
      onPreviewFile: {
        type: Function,
        default() {
          return function() {
            return true  
          }
        }
      },
      showUploadList: {
        type: [Boolean, Object],
        default: true 
      },
      containerRender: Function,
      immediately: Boolean,
      limit: Number,
      actionUrl: String | Array,
      method: Array,
      headers: Object | Array,
      withCredentials: Boolean,
      locale: {
        type: Object,
        default() {
          return {}
        }
      },
      accept: String,
      minSize: Number,
      maxSize: Number,
      maxFiles: Number,
      disabled: Boolean,
      validator: Function,
      multiple: Boolean
    },
    data() {
      const stateFiles = propsValueFormat(this.defaultValue || this.value || [])
      return {
        stateFiles,
      }
    },
    provide() {
      return {
        instance: UploadInstance,
        emitter,
        setValue: this.setFiles,
        locale: this.locale 
      }
    },
    methods: {
      setFiles(value) {
        if(!this.value) {
          this.stateFiles = value
        } 
        this.onChange?.(value)
      },
      selectFiles() {
        this.$refs["chunk-file-load-ref"].selectFiles()
      },
      onDrop(resolveFiles, rejectFiles) {
        const { wrapperFiles, errorFiles } = this.addTask(resolveFiles);
        this.onValidator?.([
            ...errorFiles.map((item) => {
              return {
                file: item,
                errors: [
                  {
                    message: 'task add error',
                    code: 'task add error',
                  },
                ],
              };
            }),
            ...rejectFiles,
          ],
          wrapperFiles.map((item) => item.originFile)
        )
        this.setFiles([...this.files, ...wrapperFiles]);
      },
      callbackWrapper(callback, error, value) {
        if (!!error) {
          let errorFiles;
          let dealError = false;
          const result = this.formatFiles.map((item) => {
            const isStop = get(item.task, "tool.file.isStop")
            if (item.name !== value || (isStop?.call(item.task.tool.file))) {
              return item;
            }
            dealError = true;
            errorFiles = merge({}, item, {
              error,
            });
            return errorFiles;
          })
          this.setFiles(result)
          dealError && this.onError?.(error, errorFiles);
        }

        // release emitter 
        if(!error) releaseEmitter(value)
        callback?.(error, value);
      },
      onInternalError(request) {
        const { callback, ...nextRequest } = request;
        return {
          ...nextRequest,
          callback: this.callbackWrapper.bind(this, callback),
        };
      },
      taskGenerate(file) {
        const actionRequest = getInstallMap('request');
        if (this.actionUrl && !!actionRequest && !Object.keys(this.request).length) {
          const { request, ...nextAction } = actionRequest({
            url: this.actionUrl,
            instance: UploadInstance,
            withCredentials: !!this.withCredentials,
            headers: this.headers,
            method: this.method,
          });
          return {
            request: this.onInternalError(request),
            ...nextAction,
            file: {
              file,
            },
            lifecycle: this.lifecycle,
          };
        }
        return {
          request: this.onInternalError(this.request),
          file: {
            file,
          },
          lifecycle: this.lifecycle,
        };
      },
      addTask(files) {
        const realFiles = Array.isArray(files) ? files : [files];
        const wrapperFiles = realFiles.reduce(
          (acc, file) => {
            const tasks = UploadInstance.add(this.taskGenerate(file));
            if (Array.isArray(tasks) && tasks.length === 1) {
              const [name] = tasks;
              const task = UploadInstance.getTask(name);
              const id = nanoid();
              const wrapperTask = {
                originFile: file,
                name,
                id,
                get task() {
                  return UploadInstance.getTask(name) || task || undefined;
                },
                local: {
                  type: 'local',
                  value: {
                    preview: createPreview(file),
                    fileId: id,
                    fileSize: file.size,
                    filename: file.name,
                  },
                },
                getStatus() {
                  return task.status;
                },
                getProgress() {
                  return task.process
                }
              };
              acc.wrapperFiles.push(wrapperTask);
              if (this.immediately) UploadInstance.deal(name);
            } else {
              acc.errorFiles.push(file);
            }
            return acc;
          },
          {
            wrapperFiles: [],
            errorFiles: [],
          },
        );
        return wrapperFiles;
      },
      releasePreviewCache(files) {
        const realFiles = Array.isArray(files) ? files : [files];
        realFiles.forEach((file) => {
          try {
            URL.revokeObjectURL(file.local?.value?.preview)
          } catch (err) {}
        });
      },
      onPreview(value) {
        return this.$refs["previewModalRef"].open({
          value,
        });
      },
      onInputFileChange(e) {
        this.$refs["chunk-file-load-drag"].closeDialog()
        const { resolve, reject } = this.$refs["chunk-file-load-drag"].customValidator(e.target.files)
        this.onDrop(resolve, reject)
        e.target.value = ""
      },
    },
    computed: {
      formatFiles() {
        return propsValueFormat(this.files)
      },
      files() {
        return this.value || this.stateFiles
      },
      inputProps() {
        const that = this 
        return {
          attrs: {
            id: "chunk-file-load-component-input",
            type: "file",
            multiple: !!this.multiple,
            accept: this.accept,
            disabled: this.disabled
          },
          on: {
            change: this.onInputFileChange,
            focus() {
              that.$refs["chunk-file-load-drag"].focus()
            },
            blur() {
              that.$refs["chunk-file-load-drag"].blur()
            }
          },
        }
      },
      rootProps() {
        return {
          on: {
            click: this.selectFiles,
          }
        }
      },
      customValidator() {
        return this.validator || getInstallMap("validator")
      }
    },
    render() {

      const previewProps = {
        props: {
          previewFile: this.previewFile,
          viewType: this.viewType,
          "on-preview-file": this.onPreviewFile
        },
        ref: "previewModalRef"
      }

      const domListProps = {
        props: {
          viewStyle: this.viewStyle,
          className: this.viewClassName,
          viewType: this.viewType,
          showUploadList: this.showUploadList,
          "on-remove": this.onRemove,
          iconRender: this.iconRender,
          itemRender: this.itemRender,
          previewFile: this.previewFile,
          "on-cancel": this.releasePreviewCache,
          getValue: this.formatFiles,
          "on-preview": this.onPreview,
          containerProps: {
            class: classnames('chunk-upload-container', {
              ['chunk-upload-container-list']:
                this.viewType === 'list' && !this.containerRender,
              ['chunk-upload-container-card']:
                this.viewType === 'card' && !this.containerRender,
            })
          }
        }
      }

      return (
        <view-list
          {...domListProps}
        >
          <drag
            accept={this.accept}
            disabled={this.disabled}
            drop={this.onDrop}
            validator={this.customValidator}
            multiple={this.multiple}
            minSize={this.minSize}
            maxSize={this.maxSize}
            maxFiles={this.maxFiles}
            ref={"chunk-file-load-drag"}
          >
            <container
              ref={"chunk-file-load-ref"}
              viewType={this.viewType}
              inputProps={this.inputProps}
              rootProps={this.rootProps}
              containerStyle={this.containerStyle}
              containerClass={this.containerClass}
              containerRender={this.containerRender}
              currentFiles={this.stateFiles.length || 0}
              limit={this.limit}
            >
            </container>
          </drag>
          <preview-modal
            {...previewProps}
          ></preview-modal>
        </view-list>
      )

    }
  }
</script>

<style>
.chunk-upload-container {
  font-family: sans-serif;
}
.chunk-upload-container-list {
  flex-direction: column;
  display: flex;
}
.chunk-upload-container-card {
  flex-wrap: wrap;
  display: flex;
}
#chunk-file-load-component-input {
  display: none;
}
</style>