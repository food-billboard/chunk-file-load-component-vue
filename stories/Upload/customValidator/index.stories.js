import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { exitDataFn, uploadFn, completeFn } from '../../utils'

export const CustomValidator = () => ({
  components: {
    UploadComponent,
  },
  methods: {
    validator(file) {
      const type = file.type;
      if (type.startsWith('image/')) return null;
      return {
        message: 'file-invalid-type',
        code: 'file-invalid-type',
      };
    },
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
        validator: this.validator,
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
        <p>自定义上传验证</p>
        <p>只能上传图片</p>
        <upload-component
          {...props}
        ></upload-component>
      </div>
    )
  }

})

CustomValidator.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}