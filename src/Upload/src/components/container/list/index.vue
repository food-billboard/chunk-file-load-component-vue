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
    },
    isDragAccept: "isDragAccept",
    isDragActive: "isDragActive",
    isDragReject: "isDragReject"
  },
  computed: {
    container() {
      return (
        <fragment>
          <span class={'chunk-upload-container-icon'}>
            {this.locale.containerIcon || (
              // <FileTwoTone className={'chunk-upload-container-icon-main'} />
              "默认图标"
            )}
          </span>
          <span>{this.locale.container || '点击或拖拽文件到此处'}</span>
        </fragment>
      )
    },
    dropzoneClassName() {
      return classnames(
        'chunk-upload-dropzone-list',
        {
          'chunk-upload-dropzone-accept': !!this.isDragAccept,
          'chunk-upload-dropzone-active': !!this.isDragActive,
          'chunk-upload-dropzone-reject': !!this.isDragReject,
        },
        this.containerClass,
      );
    },
  },
  render() {
    return (
      <div {...this.rootProps} class={this.dropzoneClassName} style={this.containerStyle}>
        {this.$slots.default}
        {this.container}
      </div>
    )
  }
}
</script>
<style>
.chunk-upload-dropzone-list:hover,
.chunk-upload-dropzone-list:focus {
  border-color: #2196f3;
}
.chunk-upload-container-icon {
  margin-bottom: 24px;
}
.chunk-upload-container-icon-main {
  font-size: 3em;
}
.chunk-upload-dropzone-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: #eeeeee;
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  margin-bottom: 24px;
}
</style>
