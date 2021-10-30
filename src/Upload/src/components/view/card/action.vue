<script>
import { Button } from 'element-ui'
import classnames from 'classnames'
import { actionIconPerformance } from '../utils'

export default {
  components: {
    ElButton: Button
  },
  props: {
    actionStyle: Object,
    className: String,
    onStop: Function,
    onCancel: Function,
    onUpload: Function,
    onPreview: Function,
    isDealing: Boolean,
    isComplete: Boolean,
    value: Object,
    previewFile: Function,
    showUploadList: Boolean | Object,
    viewType: String 
  },
  data() {
    return {
      cancelLoading: false
    }
  },
  methods: {
    uploadButtonAction(uploadIcon, stopIcon) {
      if (this.isComplete) return null;
      const { error } = this.value
      if (this.isDealing && !error) {
        return (
          <el-button
            onClick={this.onStop}
            icon={stopIcon || "bi bi-stop-circle"}
            loading={this.cancelLoading}
            type="text"
          ></el-button>
        );
      }
      return (
        <el-button
          onClick={this.onUpload}
          icon={uploadIcon || "bi bi-play-circle"}
          loading={this.cancelLoading}
          type="text"
        ></el-button>
      );
    },
    handlePreview() {
      return this.onPreview?.(this.value);
    },
    async handleCancel() {
      this.cancelLoading = true 
      const result = await this.onCancel?.(this.value);
      this.cancelLoading = false 
    }
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
              disabled={!this.value.local?.value?.preview && !this.previewFile}
            />
          )
        )
      ]
    }
  },
  render() {
    return (
      <div style={this.actionStyle} class={classnames('chunk-upload-action-modal', this.className)}>
        {this.actionRender}
      </div>
    )
  }
}
</script>
<style>
.chunk-upload-action-modal {
  width: 100%;
  height: 100%;
  position: absolute;
  visibility: hidden;
  transition: visibility 0.5s, opacity 0.5s;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  z-index: 1;
}
.chunk-upload-action-modal .el-button.is-loading:before {
  background-color: transparent;
}
</style>
