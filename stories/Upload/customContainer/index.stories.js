import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { exitDataFn, uploadFn, completeFn } from '../../utils'

export const ContainerRender = () => ({
  components: {
    UploadComponent,
  },
  methods: {
    containerRender({
      isDragAccept,
      isDragActive,
      isDragReject,
      isFocused,
      isFileDialogActive,
      isLimit,
      locale,
    }) {
      return <button>点击上传</button>;
    }
  },
  render() {
    return (
      <div>
        <p>自定义上传容器</p>
        <upload-component
          containerRender={this.containerRender}
          viewType="list"
          request={{
            exitDataFn,
            uploadFn,
            completeFn,
            callback(err, value) {
              console.log(err, value);
              if (!err) {
                console.log('Upload Done!!');
              }
            },
          }}
        ></upload-component>
      </div>
    )
  }

})

ContainerRender.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}