<script>
  import classnames from 'classnames'
  import { Progress } from 'element-ui'
  import { omit } from 'lodash'
  import { getProcessStatusLocale } from './utils'
  import { isNill } from '../../../utils'

  export default {
    components: {
      ElProgress: Progress
    },
    props: {
      file: Object,
      onChange: Function,
      fixed: {
        type: Number,
        default: 0
      },
      progress: Array,
      className: String,
      strokeWidth: Number,
      styleProps: Object,
      textInside: Boolean,
      format: Function
    },
    inject: [
      "locale"
    ],
    computed: {
      percent() {
        const [, , , progress, origin] = this.progress
        const { step } = origin || {};
        if (step === 2) {
          return progress / 2;
        }
        if (step === 3) {
          return 50 + progress / 2;
        }
        return progress || 0
      },
      realValue() {
        return parseFloat(this.percent.toFixed(this.fixed));
      },
      status() {
        const status = this.file.getStatus()
        const realStatsu = isNill(status) ? 1 : status 
        return getProcessStatusLocale(realStatsu, this.locale)
      }
    },
    watch: {
      progress: {
        deep: true,
        handler(value, prevValue) {
          const [, , , , origin] = value 
          const [, , , , prevOrigin] = prevValue
          if(origin !== prevOrigin) this.onChange(origin)
        }
      }
    },
    render() {
      const { error } = this.file 
      const [, , , , origin] = this.progress

      const progressProps = {
        props: {
          percentage: this.realValue,
          status: error ? 'exception' : undefined,
          ...omit(this.$props, [
            "file",
            "className",
            "style",
            "onChange",
            "fixed",
            "progress"
          ])
        }
      }

      return (
        <div
          class={classnames(
            'chunk-upload-list-progress',
            {
              'chunk-upload-list-progress-error': !!error,
            },
            this.className,
          )}
          style={this.styleProps}
        >
          <el-progress
            {...progressProps}
          ></el-progress>
          <span
            class="chunk-upload-list-progress-status"
            title={(origin && origin.step) || ""}
          >
            {this.status}
          </span>
        </div>
      )
    }

  }
</script>
<style>
.chunk-upload-list-progress {
  display: flex;
  align-items: center;
  line-height: 2em;
}
.chunk-upload-list-progress-status {
  white-space: nowrap;
  text-indent: 1em;
  width: 8em;
  text-overflow: ellipsis;
  overflow: hidden;
}
.chunk-upload-list-progress.chunk-upload-list-progress-error > .chunk-upload-list-progress-status {
  color: red;
}
</style>
