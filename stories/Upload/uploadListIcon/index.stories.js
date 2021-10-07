import { Radio, RadioGroup } from 'element-ui'
import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { exitDataFn, uploadFn, completeFn } from '../../utils'

export const UploadListIcon = () => ({
  components: {
    UploadComponent,
    ElRadio: Radio,
    ElRadioGroup: RadioGroup
  },
  data() {
    return {
      removeIcon: "true"
    }
  },
  methods: {
    onRadioChange(value) {
      this.removeIcon = value 
    }
  },
  computed: {
    showUploadList() {
      switch (this.removeIcon) {
        case 'true':
          return { showRemoveIcon: true };
        case 'false':
          return { showRemoveIcon: false };
        case 'custom':
          return {
            removeIcon: () => <span>delete</span>,
          };
      }
    }
  },
  render() {
    return (
      <div>
        <p>控制上传列表相关图标</p>
        <el-radio-group value={this.removeIcon}>
          <el-radio key="true" label="true" value="true" onChange={this.onRadioChange.bind(this, "true")}>显示默认删除图标</el-radio>
          <el-radio key="false" label="false" value="false" onChange={this.onRadioChange.bind(this, "false")}>不显示删除图标</el-radio>
          <el-radio key="custom" label="custom" value="custom" onChange={this.onRadioChange.bind(this, "custom")}>自定义删除图标</el-radio>
        </el-radio-group>
        <upload-component
          viewType="list"
          showUploadList={this.showUploadList}
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

UploadListIcon.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}