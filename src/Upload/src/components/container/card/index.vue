<script>
import classnames from 'classnames'
export default {
  props: {
    containerClass: String,
    rootProps: Object,
    containerStyle: Object
  },
  inject: {
    locale: {
      default: {}
    }
  },
  computed: {
    dropzoneClassName() {
      return classnames('chunk-upload-dropzone-card', this.containerClass);
    },
    container() {
      const prefix = 'chunk-upload-dropzone-card-content';
      return (
        <div class={prefix}>
          <span class={`${prefix}-icon-content`}>
            {this.locale.containerIcon || (
              "默认图标"
              // <PlusOutlined className={`${prefix}-icon-content-main`} />
            )}
          </span>
          <span>{this.locale.container}</span>
        </div>
      )
    }
  },
  render() {

    return (
      <div {...this.rootProps} class={this.dropzoneClassName} style={this.containerStyle} >
        {this.container}
        {
          this.$slots.default
        }
      </div>
    )

  }
}
</script>
<style>
.chunk-upload-dropzone-card {
  width: 104px;
  height: 104px;
  padding: 2px;
  cursor: pointer;
  border-color: #eeeeee;
  border-style: dashed;
  background-color: #fafafa;
  border-width: 1px;
  border-radius: 2px;
  transition: border 0.3s;
  margin: 8px;
}
.chunk-upload-dropzone-card:hover,
.chunk-upload-dropzone-card:focus {
  border-color: #2196f3;
}
.chunk-upload-dropzone-card-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.chunk-upload-dropzone-card-content-icon-content {
  color: gray;
}
.chunk-upload-dropzone-card-content-icon-content-main {
  font-size: 3em;
}
</style>
