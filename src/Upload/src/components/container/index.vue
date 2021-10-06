<script>
import { pick } from 'lodash'
import Card from './card'
import List from './list'

const injectProps = [
  "isDragAccept",
  'isDragActive',
  'isDragReject',
  'isFileDialogActive',
  'isFocused',
]

export default {
  components: {
    Card,
    List
  },
  props: {
    viewType: String,
    containerStyle: Object,
    containerClass: String,
    containerRender: Function,
    currentFiles: Number,
    limit: Number,
    inputProps: Object,
    rootProps: Object
  },
  inject: injectProps,
  methods: {
    selectFiles() {
      this.$refs["chunk-file-load-ref"].click()
    }
  },
  computed: {
    isLimit() {
      if (this.limit === undefined || !~this.limit) return false;
      return this.limit >= this.currentFiles;
    }
  },
  render() {

    const { viewType, containerRender, currentFiles, limit, inputProps, ...nextProps } = this.$props

    const inputContainer = (
      <input {...this.inputProps} ref={"chunk-file-load-ref"} />
    )

    if(this.containerRender) {
      let params = pick(this, injectProps)
      params = merge({}, params, {
        isLimit: this.isLimit,
      });
      return (
        <span {...nextProps.rootProps}>
          {inputContainer}
          {containerRender(params)}
        </span>
      );
    }

    if (this.isLimit) return <span></span>

    const props = {
      props: nextProps
    }
    switch(this.viewType) {
      case "list":
        return (
          <list {...props}>
            {inputContainer}
          </list>
        )
      case "card":
        return (
          <card {...props}>
            {inputContainer}
          </card>
        )
      default:
        return (
          <span></span>
        )
    }

  }
}
</script>

