import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { exitDataFn, uploadFn, completeFn } from '../../utils'

export const FileSizeLimit = () => ({
  components: {
    UploadComponent,
  },
  methods: {
    onValidator(errorFiles, fulFiles) {
      if (errorFiles.length) {
        console.error('there file is error');
      }
      console.log('errorFiles: ', errorFiles, 'fulFiles: ', fulFiles);
    }
  },
  render() {

    const props = {
      props: {
        "on-validator": this.onValidator,
        viewType: "list",
        minSize: 10,
        maxSize: 100,
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
        <p>文件上传大小限制</p>
        <p>限制上传在10-100</p>
        <upload-component
          {...props}
        ></upload-component>
      </div>
    )
  }

})

FileSizeLimit.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}