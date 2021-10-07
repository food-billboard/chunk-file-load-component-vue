import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { exitDataFn, uploadFn, completeFn } from '../../utils'

export const Lifecycle = () => ({
  components: {
    UploadComponent,
  },
  render() {
    return (
      <div>
        <p>在生命周期中获取更详细的信息</p>
        <upload-component
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
          lifecycle={{
            uploading() {
              console.log("uploading")
            }
          }}
        ></upload-component>
      </div>
    )
  }

})

Lifecycle.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}