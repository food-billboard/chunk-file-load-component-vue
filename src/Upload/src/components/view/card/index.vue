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
      containerProps: Object 
    },
    components: {
      ViewItem,
    },
    render() {
      const value = this.getValue
      return (
        <div {...this.containerProps}>
          {this.$slots.default}
          {
            !!this.showUploadList && value.map((item) => {
              const props = {
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
                getValue: this.getValue,
                className: this.className
              }
              const result = itemRender(props, item, value);
              const itemProps = {
                props
              }
              return (
                <view-item
                  {...itemProps}
                ></view-item>
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