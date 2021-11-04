<script>
import { Dialog } from 'element-ui'
import { get } from 'lodash'
import { withTry, IMAGE_FALLBACK } from '../../utils'

export default {
  props: {
    onPreviewFile: Function,
    previewFile: Function,
    viewType: String 
  },
  components: {
    ElDialog: Dialog
  },
  data() {
    return {
      value: null,
      visible: false,
      customPreview: false 
    }
  },
  methods: {
    async open({ value }) {
      const [, result] = this.onPreviewFile
          ? await withTry(this.onPreviewFile)(this.value)
          : [, true];
      if (result) {
        this.value = value 
        this.visible = true 
        await this.fetchPreviewFile(this.value, this.previewFile, this.viewType)
      }
    },
    async fetchPreviewFile(value, previewFile, viewType) {
      let result = false;
      if (previewFile) {
        result = await previewFile?.(value, viewType)
      }
      this.customPreview = result 
    },
    beforeClose() {
      this.visible = false 
    }
  },
  computed: {
    preview() {
      return get(this.value, 'local.value.preview')
    }
  },
  render() {
    return (
      <el-dialog
        visible={this.visible}
        beforeClose={this.beforeClose}
        customClass="chunk-upload-preview-modal"
      >
        {
          this.customPreview !== false && this.customPreview !== undefined ? (
            this.customPreview
          )
          :
          (
            <img  
              class="chunk-upload-preview-image"
              src={this.preview || IMAGE_FALLBACK}
            />
          )
        }
      </el-dialog>
    )
  }

}
</script>
<style>
.chunk-upload-preview-modal {
  max-width: 500px;
  text-align: center;
}
.chunk-upload-preview-modal .el-dialog__header,
.chunk-upload-preview-modal .el-dialog__body {
  padding: 0;
}
.chunk-upload-preview-image {
  width: 100%;
  max-width: 500px;
  vertical-align: middle;
}
</style>
