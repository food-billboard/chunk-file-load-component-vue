import UploadComponent from '../../src/Upload'
import UploadDocs from './index.md'

export const Upload = () => ({

  components: {
    UploadComponent
  },
  template: `
    <upload-component></upload-component>
  `

})

Upload.story = {
  parameters: {
    notes: {
      UploadDocs
    }
  }
}

export default {
  title: "222222"
}