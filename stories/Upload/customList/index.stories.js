import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { exitDataFn, uploadFn, completeFn } from '../../utils'

export const ItemRender = () => ({
  components: {
    UploadComponent,
  },
  methods: {
    itemRender(
      originNode,
      file,
      fileList,
      { preview, upload, cancel, stop },
      { complete, status, total },
    ) {
      const fileName = file.task.file.name;
      return (
        <div>
          {fileName}- 进度: {(complete / total) * 100 || 0}- 状态: {status}-
          <span onClick={upload}>上传</span>-<span onClick={cancel}>取消</span>
        </div>
      );
    }
  },
  render() {
    return (
      <div>
        <p>自定义上传列表</p>
        <upload-component
          itemRender={this.itemRender}
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

ItemRender.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}