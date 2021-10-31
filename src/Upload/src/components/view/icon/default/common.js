import classnames from 'classnames'

export function generateBasicIconData(className) {
  return {
    props: {
      className: String,
      iconStyle: Object,
      file: Object
    },
    render() {
      const { className: propsClassName, iconStyle } = this.$props
      return (
        <i style={iconStyle} class={classnames(className, propsClassName)}></i>
      )
    }
  }
}