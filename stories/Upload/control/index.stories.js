import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { sleep, exitDataFn, uploadFn, completeFn } from '../../utils'

export const Control = () => ({
  components: {
    UploadComponent,
  },
  data() {
    return {
      value: ["自定义文件"]
    }
  },
  methods: {
    onValueChange(value) {
      this.value = value 
      console.log("value changed: ", this.value)
    }
  },
  render() {

    const props = {
      props: {
        value: this.value,
        "on-remove": sleep.bind(null, 1000),
        viewType: "list",
        "on-change": this.onValueChange,
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
        <p>上传受控</p>
        <upload-component
          {...props}
        ></upload-component>
      </div>
    )
  }

})

Control.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}