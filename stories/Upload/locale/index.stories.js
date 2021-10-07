import { Radio, RadioGroup } from 'element-ui'
import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { exitDataFn, uploadFn, completeFn } from '../../utils'

export const Locale = () => ({
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
    return (
      <div>
        <p>自定义文案</p>
        <el-radio-group value={this.viewType}>
          <el-radio key="list" label="list" value="list" onChange={this.onRadioChange.bind(this, "list")}>列表</el-radio>
          <el-radio key="card" label="card" value="card" onChange={this.onRadioChange.bind(this, "card")}>卡片</el-radio>
        </el-radio-group>
        <upload-component
          locale={{
            container: '自定义容器文案',
            progress: {
              pending: '队列',
              waiting: '等待',
              reading: '解析',
              uploading: '上传',
              fulfilled: '完成',
              rejected: '失败',
              cancel: '取消',
              stopping: '暂停',
            },
          }}
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

Locale.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}