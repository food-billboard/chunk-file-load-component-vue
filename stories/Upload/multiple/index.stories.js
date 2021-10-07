import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { exitDataFn, uploadFn, completeFn } from '../../utils'

export const Multiple = () => ({
  components: {
    UploadComponent,
  },
  render() {
    return (
      <div>
        <p>可同时选择多个文件</p>
        <upload-component
          viewType="list"
          multiple
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

Multiple.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}