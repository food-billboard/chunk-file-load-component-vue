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
        }
    },
    async fetchPreviewFile(value, previewFile, viewType) {
      let result = false;
      if (previewFile) result = await previewFile?.(value, viewType);
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
  watch: {
    value() {
      if(this.visible && !!this.value) this.fetchPreviewFile(this.value, this.previewFile, this.viewType)
    },
    previewFile() {
      if(this.visible && !!this.value) this.fetchPreviewFile(this.value, this.previewFile, this.viewType)
    },
    viewType() {
      if(this.visible && !!this.value) this.fetchPreviewFile(this.value, this.previewFile, this.viewType)
    }
  },
  render() {
    if(this.customPreview !== false && this.customPreview !== undefined && visible) {
      return this.customPreview
    }
    return (
      <el-dialog
        visible={this.visible}
        beforeClose={this.beforeClose}
      >
        <img  
          className="chunk-upload-preview-image"
          src={this.preview || IMAGE_FALLBACK}
        />
      </el-dialog>
    )
  }

}
</script>
<style>
.chunk-upload-preview-image {
  width: 100%;
  max-width: 500px;
}
</style>
