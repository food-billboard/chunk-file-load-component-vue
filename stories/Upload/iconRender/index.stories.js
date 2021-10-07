import UploadComponent from '../../../src/Upload'
import UploadDocs from '../index.md'
import { exitDataFn, uploadFn, completeFn } from '../../utils'

export const IconRender = () => ({
  components: {
    UploadComponent,
  },
  methods: {
    iconRender(file, viewType, originNode) {
      console.log(file, viewType);
      const type = file.originFile.type;
      if (type.startsWith('image/')) {
        return <span>自定义图标</span>;
      }
      return originNode;
    }
  },
  render() {
    return (
      <div>
        <p>自定义图标</p>
        <upload-component
          iconRender={this.iconRender}
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

IconRender.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "Upload"
}