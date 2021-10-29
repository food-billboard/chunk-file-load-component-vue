import { Dialog } from 'element-ui'
import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { exitDataFn, uploadFn, completeFn } from '../../utils'

export const PreviewFile = () => ({
  components: {
    UploadComponent,
    ElDialog: Dialog
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    previewFile(file) {
      console.log('wrapperFile', file);
      return (
        <el-dialog
          footer={null}
          onClose={function() { this.previewVisible = false }}
          visible={this.previewVisible}
        >
          自定义预览
        </el-dialog>
      );
    },
    onPreview() {
      this.previewVisible = true 
      return true;
    }
  },
  render() {

    const props = {
      props: {
        previewFile: this.previewFile,
        "on-previewFile": this.onPreview,
        viewType: "list",
        request: {
          exitDataFn,
          uploadFn,
          completeFn,
          callback(err, value) {
            console.log(err, value);
            if (!err) {
              console.log('Upload Done!!');
            }
          },
        }
      }
    }

    return (
      <div>
        <p>自定义文件预览</p>
        <upload-component
          {...props}
        ></upload-component>
      </div>
    )
  }

})

PreviewFile.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}