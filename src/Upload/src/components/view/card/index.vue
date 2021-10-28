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
      previewFile: Function,
      className: String,
      getValue: Array,
    },
    components: {
      ViewItem,
    },
    inject: [
      "instance",
      "setValue",
    ],
    render() {
      const value = this.getValue
      return (
        <template style={{display: "block"}}>
          {
            value.map((item) => {
              const result = itemRender(this.$props, item, value);
              return (
                <view-item
                  value={item}
                  key={item.id}
                  showUploadList={this.showUploadList}
                  onCancel={this.onCancel}
                  onUpload={this.onUpload}
                  onStop={this.onStop}
                  iconRender={this.iconRender}
                  viewType={this.viewType}
                  viewStyle={this.viewStyle}
                  itemRender={result}
                  onPreview={this.onPreview}
                  getValue={this.getValue}
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