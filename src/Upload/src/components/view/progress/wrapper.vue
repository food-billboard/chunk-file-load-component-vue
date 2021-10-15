
<script>
import { merge } from 'lodash';
export default {
  props: {
    name: {
      type: Symbol
    }
  },
  methods: {
    action(instance, name, params, response) {
      const progress = response?.process;
      const status = instance.getStatus(name);
      this.progress = merge({}, this.progress, progress, { step: status ?? -3 })
    },
    progressInfo() {
      let { complete, total, current } = this.progress;
      complete ||= 0;
      total ||= 0;

      return [complete, total, current, (complete / total) * 100 || 0, this.progress];
    }
  },
  watch: {
    getValue() {
      if(!this.isFirstInject || !this.instance) return 
      this.isFirstInject = true 
      const files = this.getValue
      const target = files.find(item => item.name === this.name)
      if(!target) return 
      const status = target.getStatus()
      const progress = target.task?.process
      this.progress = merge({}, this.progress, progress, { step: status ?? -3 })
    }
  },
  inject: [
    "emitter",
    "instance",
    "getValue"
  ],
  created() {
    this.emitter.on(this.name, this.action.bind(this, this.instance))
  },
  data() {
    return {
      progress: {
        current: 0,
        total: 0,
        complete: 0,
        step: 0,
      },
      isFirstInject: true 
    }
  },
  render() {
    return this.$slots.default 
  }

}
</script>
