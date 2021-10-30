import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { exitDataFn, uploadFn, completeFn } from '../../utils'

export const PreviewFile = () => ({
  components: {
    UploadComponent,
  },
  methods: {
    previewFile(file) {
      console.log('wrapperFile', file);
      return (
        <div style={{padding: "20px"}}>
          自定义预览
        </div>
      )
    },
  },
  render() {

    const props = {
      props: {
        previewFile: this.previewFile,
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