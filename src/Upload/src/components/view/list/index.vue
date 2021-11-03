<script>
  import ViewItem from './item.vue'
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
    components: {
      ViewItem
    },
    render() {
      const value = this.getValue
      return (
        <div {...this.containerProps}>
          {this.$slots.default}
          {
            !!this.showUploadList && (
              <aside style={this.viewStyle} class={this.className}>
                <ul class={'chunk-upload-list'}>
                {
                  value.map((item) => {
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
                      itemRender: this.itemRender,
                      getValue: this.getValue
                    }
                    const result = itemRender(props, item, value);
                    const itemProps = {
                      props: {
                        ...props,
                        itemRender: result
                      }
                    }
                    return (
                      <view-item {...itemProps}></view-item>
                    );
                  })
                }
                </ul>
              </aside>
            )
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