<script>
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
      getValue: Array 
    },
    watch: {
      value() {
        this.isComplete = this.value.local?.type === 'url'
      }
    },
    data() {
      return {
        isDealing: false,
        isComplete: false,
        progress: undefined
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
        const { task } = this.value
        this.isDealing = !!task?.tool.file.isTaskDealing(task);
        this.isComplete = !!task?.tool.file.isTaskComplete(task);
      }
    },
    computed: {
      progressInfo() {
        if(!this.progress) return []
        return this.progress.progressInfo()
      }
    },
    created() {
      const { task } = this.value 
      this.progress = new ProgressWrapper({
        name: task.symbol,
        getValue: this.getValue,
        emitter: this.emitter,
        instance: this.instance
      })
    },
    render() {
      const { local, id, task } = this.value 
      const [ complete, total, current ] = this.progressInfo

      const node = (
        <div class={'chunk-upload-card-item'} style={this.viewStyle}>
          <el-icon 
            iconRender={this.iconRender} 
            file={this.value} 
            viewType={this.viewType} 
          ></el-icon>
          <cus-progress
            file={this.value}
            onChange={this.onProgressChange}
            class="chunk-upload-card-item-progress"
            showInfo={false}
            strokeWidth={5}
            progress={this.progressInfo}
            style={{
              visibility: this.isComplete ? 'hidden' : 'visible'
            }}
          ></cus-progress>
          <div class="chunk-upload-card-item-info">
            <span>{local?.value?.filename || local?.value?.fileId || id}</span>
          </div>
          <action-modal
            onCancel={this.onCancel}
            onStop={this.handleStop}
            onUpload={this.handleUpload}
            isDealing={this.isDealing}
            isComplete={this.isComplete}
            value={this.value}
            previewFile={this.previewFile}
            showUploadList={this.showUploadList}
            viewType={this.viewType}
            onPreview={this.onPreview}
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
.chunk-upload-list-progress-status {
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
