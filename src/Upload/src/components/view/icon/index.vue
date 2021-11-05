<script>
import classnames from 'classnames'
import { merge } from 'lodash'
import DefaultIconMap, { DEFAULT_SET_ICON } from './default'
import IconListMap, { formatType as listFormatType, DEFAULT_ICON as DEFAULT_LIST_ICON } from './iconListMap'
import IconCardMap, { DEFAULT_ICON as DEFAULT_CARD_ICON } from './iconCardMap'

export default {
  props: {
    iconStyle: Object,
    className: String,
    file: Object,
    viewType: String,
    onClick: Function,
    iconRender: Function
  },
  computed: {
    fileType() {
      let type = ""
      try {
        type = this.file.task.tool.file.getFileType(this.file.task);
      }catch(err) {
        type = ""
      }
      return listFormatType(type)
      
    },
    IconMap() {
      switch (this.viewType) {
        case 'card':
          return merge({}, DefaultIconMap, IconCardMap);
        case 'list':
        default:
          return merge({}, DefaultIconMap, IconListMap);
      }
    },
    DEFAULT_ICON() {
      switch (this.viewType) {
        case 'card':
          return DEFAULT_CARD_ICON || DEFAULT_SET_ICON;
        case 'list':
        default:
          return DEFAULT_LIST_ICON || DEFAULT_SET_ICON;
      }
    }
  },
  render() {
    const Icon = this.IconMap[this.fileType] || this.DEFAULT_ICON;
    const icon = (
      <Icon
        iconStyle={this.iconStyle}
        className={classnames(
          {
            ['chunk-upload-view-list-icon']: this.viewType === 'list',
            ['chunk-upload-view-card-icon']: this.viewType === 'card',
          },
          this.className,
        )}
        file={this.file}
      />
    );
    if(this.iconRender) {
      return this.iconRender(this.file, this.viewType, icon)
    }

    return icon;
  }
}
</script>
<style>
.chunk-upload-view-list-icon {
  font-size: 1.5em;
}
.chunk-upload-view-card-icon {
  font-size: 1.5em;
}
</style>
