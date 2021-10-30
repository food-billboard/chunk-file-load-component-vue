<script>
import { get } from 'lodash'
import classnames from 'classnames'
import { IMAGE_FALLBACK, className } from '../../../../utils'

const PREFIX = 'chunk-upload-icon-card'

export default {
  props: {
    className: String,
    iconStyle: Object,
    iconRender: Function,
    file: Object
  },
  render() {
    const { className: propsClassName, iconStyle, file } = this.$props
    const viewUrl = get(file, 'local.value.preview');
    return (
      <div
        style={iconStyle}
        class={classnames(className(PREFIX, 'image'), propsClassName)}
      >
        <i class="bi bi-card-image"></i>
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
