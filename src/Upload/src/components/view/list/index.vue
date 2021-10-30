<script>
  import { itemRender } from '../../../utils'
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
      containerProps: Object 
    },
    render() {
      const value = this.getValue
      return (
        <div {...this.containerProps}>
          {this.$slots.default}
          {
            !!this.showUploadList && value.map((item) => {
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
                <div>1111</div>
              );
            })
          }
        </div>
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