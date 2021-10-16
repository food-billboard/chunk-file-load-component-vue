<script>
  import { noop } from 'lodash'
  import Card from './card'
  import List from './list'
  import { isUploaded, withTry } from '../../utils'
  export default {
    props: {
      className: String,
      viewStyle: Object,
      onCancel: Function,
      viewType: String,
      showUploadList: Object | Boolean,
      iconRender: Function,
      itemRender: Function,
      onRemove: Function,
      previewFile: Function,
      onPreviewFile: Function,
      onPreview: Function,
      getValue: Array 
    },
    inject: [
      "instance",
      "setValue"
    ],
    components: {
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
          const prevValue = this.getValue
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
            const prevValue = this.getValue
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
    },
    render() {
      const {
        viewType,
        onRemove,
        previewFile,
        onPreviewFile,
        ...nextProps
      } = this.$props
      const props = {
        props: {
          ...nextProps,
          viewType,
          "on-cancel": this.onInternalCancel,
          "on-stop": this.onStop,
          "on-upload": this.onUpload,
          "on-preview": this.onPreview,
        }
      };

      if(viewType == "list") return <list {...props} />
      if(viewType == "card") return <card {...props} />
      
    }

  }
</script>
