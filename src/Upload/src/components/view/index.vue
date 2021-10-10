<script>
  import { noop } from 'lodash'
  import PreviewModal from '../preview'
  import Card from './card'
  import List from './list'
  import { isUploaded, withTry } from '../../utils'
  export default {
    props: {
      className: String,
      style: Object,
      onCancel: Function,
      viewType: String,
      showUploadList: Object | Boolean,
      iconRender: Function,
      itemRender: Function,
      onRemove: Function,
      previewFile: Function,
      onPreviewFile: Function
    },
    inject: [
      "instance",
      "getValue",
      "setValue"
    ],
    components: {
      PreviewModal,
      Card,
      List
    },
    methods: {
      onStop(task) {
        if (!isUploaded(task)) {
          const fileTask = task.task;
          if (!fileTask) return;
          const result = this.instance.stop(fileTask.symbol);
          if (!result.length) {
            console.warn(
              'the task is not stop, please check whether this task is reasonable',
            );
          }
        }
      },
      stopActionWhenRequestCancel() {
        // TODO
        return {
          stop: noop,
          done: noop,
        };
      },
      getFileId(target) {
        try {
          return target.local.value.fileId
        }catch(err) { 
          return ""
        }
      },
      unCancelValue(target, origin) {
        const targetId = this.getFileId(target)
        const result = origin.filter((item) => {
          const originId = typeof item === "string" ? item : this.getFileId(item)
          return originId !== targetId
        });
        return result 
      },
      async onInternalCancel(task) {
        if (this.onRemove) {
          const { stop, done } = this.stopActionWhenRequestCancel();
          stop();
          const [cancel, isCancel] = await withTry(this.onRemove)(task);
          if (!!cancel || isCancel === false) return false;
          done();
        }
        const { error } = task;
        if (!isUploaded(task)) {
          const fileTask = task.task;
          let result = [];
          if (fileTask.tool.file.isFileUploadStart()) {
            result = this.instance.cancel(fileTask.symbol);
          } else {
            result = this.instance.cancelAdd(fileTask.symbol);
          }
          if (!result.length && !error) {
            console.warn(
              'the task is not cancel, please check whether this task is reasonable',
            );
          }
        }
        this.onCancel && this.onCancel(task);
        setTimeout(() => {
          const prevValue = this.getValue()
          const newValue = this.unCancelValue(task, prevValue)
          this.setValue(newValue)
        }, 10);
        return true;
      },
      async onUpload(task) {
        if (!isUploaded(task)) {
          const fileTask = task.task;
          let result = [];
          const { error } = task;
          if (task.task?.tool.file.isStop(task.task)) {
            result = instance.start(fileTask.symbol);
          } else if (!error) {
            result = instance.deal(fileTask.symbol);
          } else if (task.task) {
            const prevValue = this.getValue()
            const newValue = prevValue.map((item) => {
              if (item.id !== task.id) return item;
              result = this.instance.uploading(task.task);
              const [name] = result;
              const newTask = name ? this.instance.getTask(name) : item.task;
              return {
                ...item,
                get task() {
                  return newTask || item.task;
                },
                getStatus() {
                  return (newTask || item.task)?.status;
                },
                error: null,
              };
            })
            this.setValue(newValue);
          }
          if (!result.length) {
            console.warn(
              'the task is not start upload, please check whether this task is reasonable',
            );
          }
        }
      },
      onPreview(value) {
        return this.$refs["previewModalRef"].open({
          value,
        });
      }
    },
    computed: {
      container() {
        const {
          viewType,
          onRemove,
          previewFile,
          onPreviewFile,
          ...nextProps
        } = this.$props
        const props = {
          ...nextProps,
          viewType,
          onCancel: this.onInternalCancel,
          onStop: this.onStop,
          onUpload: this.onUpload,
          onPreview: this.onPreview,
        };
        switch (viewType) {
          case 'card':
            return <card {...props} />;
          case 'list':
            return <list {...props} />;
          default:
            return <span></span>;
        }
      }
    },
    render() {
      return [
        this.container,
        <preview-modal
          ref={"previewModalRef"}
          previewFile={this.previewFile}
          viewType={this.viewType}
          onPreviewFile={this.onPreviewFile}
        ></preview-modal>
      ]
    }

  }
</script>
