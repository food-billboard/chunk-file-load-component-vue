<script>
import { get } from 'lodash'
import classnames from 'classnames'
import { IMAGE_FALLBACK, className } from '../../../../utils'

const PREFIX = 'chunk-upload-icon-card'

export default {
  props: {
    className: String,
    style: Object,
    iconRender: Function,
    file: Object
  },
  render() {
    const { className: propsClassName, style, file } = this.$props
    const viewUrl = get(file, 'local.value.preview');
    return (
      <div
        style={style}
        class={classnames(className(PREFIX, 'image'), propsClassName)}
      >
        <i class="el-icon-picture-outline"></i>
        <img
          src={viewUrl || IMAGE_FALLBACK}
          class={classnames(className(PREFIX, 'image', 'cover'))}
        />
      </div>
    );
  }
}
</script>
<style>
.chunk-upload-icon-card-image {
  font-size: 1.2em;
}
.chunk-upload-icon-card-image-cover {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.7;
}
</style>
