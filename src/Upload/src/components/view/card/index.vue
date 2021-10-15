<script>
    import { Fragment } from 'vue-fragment'
  import ViewItem from './item.vue'

  export default {
    props: {
      onCancel: Function,
      onUpload: Function,
      onStop: Function,
      onPreview: Function,
      viewType: String,
      showUploadList: Boolean | Object,
      iconRender: Function,
      itemRender: Function,
      previewFile: Function,
      className: String,
      style: Object
    },
    components: {
      ViewItem,
      Fragment
    },
    inject: [
      "instance",
      "setValue",
      "getValue"
    ],
    render() {
      const value = this.getValue
      return (
        <fragment>
          {
            value.map((item) => {
              const result = this.itemRender(this.$props, item, value);
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
                  itemRender={result}
                  onPreview={this.onPreview}
                ></view-item>
              );
            })
          }
        </fragment>
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