import { Radio, RadioGroup } from 'element-ui'
import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { exitDataFn, uploadFn, completeFn } from '../../utils'

export const Disabled = () => ({
  components: {
    UploadComponent,
    ElRadio: Radio,
    ElRadioGroup: RadioGroup
  },
  data() {
    return {
      viewType: "list"
    }
  },  
  methods: {
    onRadioChange(value) {
      this.viewType = value 
    }
  },
  render() {
    const props = {
      props: {
        immediately: false,
        disabled: true,
        viewType: this.viewType,
        request: {
          exitDataFn,
          uploadFn,
          completeFn,
          callback(err, value) {
            console.log(err, value);
            if (!err) {
              console.log('Upload Done!!');
            }
          }
        }
      }
    }
    return (
      <div>
        <el-radio-group value={this.viewType}>
          <el-radio key="list" label="list" value="list" onChange={this.onRadioChange.bind(this, "list")}>列表</el-radio>
          <el-radio key="card" label="card" value="card" onChange={this.onRadioChange.bind(this, "card")}>卡片</el-radio>
        </el-radio-group>
        <upload-component
          {
            ...props
          }
        ></upload-component>
      </div>
    )
  }

})

Disabled.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}