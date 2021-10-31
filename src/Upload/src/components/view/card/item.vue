<script>
  import classnames from 'classnames'
  import Icon from '../icon'
  import ActionModal from './action.vue'
  import Progress from '../progress'
  import ProgressWrapper from '../progress/wrapper'

 export default {
   components: {
     ElIcon: Icon,
     ActionModal,
     CusProgress: Progress,
   },
    props: {
      value: Object,
      onCancel: Function,
      onUpload: Function,
      onStop: Function,
      onPreview: Function,
      itemRender: Function | Boolean,
      showUploadList: Object | Boolean,
      iconRender: Function,
      viewType: String,
      previewFile: Object,
      viewStyle: Object,
      className: String,
      getValue: Array 
    },
    data() {
      return {
        isDealing: false,
        isComplete: false,
        progress: undefined,
        progressInfo: new Array(3).fill(0)
      }
    },
    inject: [
      "instance",
      "emitter"
    ],
    methods: {
      handleStop() {
        this.onStop(this.value)
      },
      async handleUpload() {
        await this.onUpload(this.value);
      },
      onProgressChange() {
        const { task, local } = this.value
        if(!task && local?.type === "url") {
          this.isDealing = false 
          this.isComplete = true 
        }else {
          this.isDealing = !!task?.tool.file.isTaskDealing(task);
          this.isComplete = !!task?.tool.file.isTaskComplete(task);
        }
      },
      onStatusChange(_, progressInfo) {
        this.progressInfo = progressInfo
      }
    },
    created() {
      const { task } = this.value 
      this.progress = new ProgressWrapper({
        name: task?.symbol,
        getValue: this.getValue,
        emitter: this.emitter,
        instance: this.instance,
        onChange: this.onStatusChange.bind(this)
      })
      this.onProgressChange()
    },
    render() {
      const { local, id, task } = this.value 
      const [ complete, total, current ] = this.progressInfo

      const actionProps = {
        props: {
          "on-cancel": this.onCancel,
          "on-stop": this.handleStop,
          "on-upload": this.handleUpload,
          isDealing: this.isDealing,
          isComplete: this.isComplete,
          value: this.value,
          previewFile: this.previewFile,
          showUploadList: this.showUploadList,
          viewType: this.viewType,
          "on-preview": this.onPreview,
        }
      }

      const progressProps = {
        props: {
          file:this.value,
          "on-change": this.onProgressChange,
          className: "chunk-upload-card-item-progress",
          showInfo: false,
          strokeWidth: 5,
          progress: this.progressInfo,
          styleProps: {
            visibility: this.isComplete ? 'hidden' : 'visible'
          },
          textInside: true,
          format() { return "" }
        }
      }

      const node = (
        <div class={classnames('chunk-upload-card-item', this.className)} style={this.viewStyle}>
          <el-icon 
            iconRender={this.iconRender} 
            file={this.value} 
            viewType={this.viewType} 
          ></el-icon>
          <cus-progress
            {...progressProps}
          ></cus-progress>
          <div class="chunk-upload-card-item-info">
            <span>{local?.value?.filename || local?.value?.fileId || id}</span>
          </div>
          <action-modal
            {
              ...actionProps
            }
          />
        </div>
      )

      if(this.itemRender) {
        return this.itemRender(node, {
          complete,
          current,
          total,
          status: task?.status,
        })
      }

      return node 

    }

  }
</script>
<style>
.chunk-upload-card-item {
  width: 104px;
  height: 104px;
  padding: 2px;
  cursor: pointer;
  border-color: #eeeeee;
  border-style: solid;
  background-color: #fafafa;
  border-width: 1px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  margin: 8px;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
.chunk-upload-card-item:hover .chunk-upload-action-modal {
  visibility: visible;
  opacity: 1;
}
.chunk-upload-card-item-progress {
  position: relative;
  flex-direction: column;
  width: 100%;
  display: flex;
}
.chunk-upload-card-item-progress .el-progress {
  width: 100%;
}
.chunk-upload-card-item-progress .chunk-upload-list-progress-status {
  width: 100%;
  text-indent: 0;
  text-align: center;
  font-size: 0.6em;
  color: gray;
}
.chunk-upload-card-item-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  position: relative;
}
.chunk-upload-card-item-info > span {
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-align: center;
  font-size: 0.8em;
}
</style>
