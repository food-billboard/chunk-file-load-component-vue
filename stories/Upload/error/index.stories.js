import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { sleep, exitDataFn, uploadFn, completeFn } from '../../utils'

let errorMap = {}

export const Error = () => ({
  components: {
    UploadComponent,
  },
  methods: {
    customUploadFn(formData, name) {
      if(!errorMap[name]) return { data: -1 }
      errorMap[name] = true 
      return uploadFn(formData, name)
    }
  },
  render() {
    return (
      <div>
        <p>文件首次上传会出错</p>
        <upload-component
          immediately={false}
          viewType="list"
          request={{
            exitDataFn,
            uploadFn: this.customUploadFn,
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

Error.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}