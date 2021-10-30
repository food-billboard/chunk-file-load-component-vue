<script>
  import { itemRender } from '../../../utils'
  import ViewItem from './item.vue'

  export default {
    props: {
      onCancel: Function,
      onUpload: Function,
      onStop: Function,
      onPreview: Function,
      viewType: String,
      viewStyle: Object,
      showUploadList: Boolean | Object,
      iconRender: Function,
      itemRender: Function,
      previewFile: Function,
      className: String,
      getValue: Array,
    },
    components: {
      ViewItem,
    },
    render() {
      const value = this.getValue
      return (
        <template style={{display: "block"}}>
          {
            value.map((item) => {
              const result = itemRender(this.$props, item, value);
              const props = {
                props: {
                  value: item,
                  key: item.id,
                  showUploadList: this.showUploadList,
                  "on-cancel": this.onCancel,
                  "on-upload": this.onUpload,
                  "on-stop": this.onStop,
                  "on-preview": this.onPreview,
                  iconRender: this.iconRender,
                  viewType: this.viewType,
                  viewStyle: this.viewStyle,
                  itemRender: result,
                  getValue: this.getValue
                }
              }
              return (
                <view-item
                  {...props}
                ></view-item>
              );
            })
          }
        </template>
      )
    
    }

  }
</script>
<style>
ul {
  margin: 0;
  padding: 0;
}
</style>