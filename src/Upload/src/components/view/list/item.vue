<script>
  import { Button } from 'element-ui'
  import classnames from 'classnames'
  import Icon from '../icon'
  import Progress from '../progress'
  import ProgressWrapper from '../progress/wrapper'
  import { actionIconPerformance } from '../utils'

  export default {
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
      getValue: Array 
    },
    components: {
      ElIcon: Icon,
      CusProgress: Progress,
      ElButton: Button
    },
    data() {
      return {
        isDealing: false,
        isComplete: false,
        progress: undefined,
        progressInfo: new Array(3).fill(0),
        cancelLoading: false
      }
    },
    inject: [
      "instance",
      "emitter"
    ],
    methods: {
      async handleCancel() {
        this.cancelLoading = true 
        const result = await this.onCancel?.(this.value);
        this.cancelLoading = false 
      },
      handleStop() {
        this.onStop(this.value)
      },
      handlePreview() {
        return this.onPreview?.(this.value);
      },
      async handleUpload() {
        await this.onUpload(this.value);
      },
      uploadButtonAction(uploadIcon, stopIcon) {
        if (this.isComplete) return null;
        const { error } = this.value
        if (this.isDealing && !error) {
          return (
            <el-button
              onClick={this.handleStop}
              icon={stopIcon || "bi bi-stop-circle"}
              loading={this.cancelLoading}
              type="text"
            ></el-button>
          );
        }
        return (
          <el-button
            onClick={this.handleUpload}
            icon={uploadIcon || "bi bi-play-circle"}
            loading={this.cancelLoading}
            type="text"
          ></el-button>
        );
      },
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
    computed: {
      actionRender() {
        if (!this.showUploadList) return null;
        const {
          previewShow,
          previewIconNode,
          deleteIconNode,
          deleteShow,
          uploadShow,
          uploadIconNode,
          stopIconNode,
        } = actionIconPerformance(this.showUploadList, this.value);
        return [
          (uploadShow && this.uploadButtonAction(uploadIconNode, stopIconNode)),
          (
            deleteShow && (
              <el-button
                loading={this.cancelLoading}
                onClick={this.handleCancel}
                icon={deleteIconNode || "bi bi-trash"}
                type="text"
              />
            )
          ),
          (
            previewShow && (
              <el-button
                onClick={this.handlePreview}
                icon={previewIconNode || "bi bi-eye"}
                loading={this.cancelLoading}
                type="text"
                size="medium"
                disabled={!this.value.local?.value?.preview && !this.previewFile}
              />
            )
          )
        ]
      }
    },
    render() {
      const { local, id, task, error } = this.value 
      const [ complete, total, current ] = this.progressInfo

      const progressProps = {
        props: {
          file:this.value,
          "on-change": this.onProgressChange,
          progress: this.progressInfo,
          className: "chunk-upload-list-item-progress"
        }
      }

      const node = (
        <li key={id} class={'chunk-upload-list-item'}>
          <el-icon 
            className={'chunk-upload-list-item-icon'}
            iconRender={this.iconRender} 
            file={this.value} 
            viewType={this.viewType} 
          ></el-icon>
          <div
            class={classnames('chunk-upload-list-item-info', {
              'chunk-upload-list-item-info-error': !!error,
            })}
          >
            <cus-progress
              {...progressProps}
            ></cus-progress>
            <span>{local?.value?.filename || local?.value?.fileId || id}</span>
          </div>
          {this.actionRender}
        </li>
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
ul {
  margin: 0;
  padding: 0;
}
.chunk-upload-list-item {
  list-style: none;
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.chunk-upload-list-item-icon {
  margin-right: 14px;
  font-size: 2em;
}
.chunk-upload-list-item-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-right: 14px;
  flex: 1;
}
.chunk-upload-list-item-info > span {
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.chunk-upload-list-item-info.chunk-upload-list-item-info-error > span {
  color: red;
}
.chunk-upload-list-item-progress .el-progress {
  width: 100%;
}
</style>