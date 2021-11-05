
import { merge, get } from 'lodash'
import { isNill } from '../../../utils/tool'

export default class {

  constructor({
    name,
    getValue,
    emitter,
    instance,
    onChange,
  }) {
    this.name = name 
    this.getValue = getValue
    this.emitter = emitter
    this.instance = instance
    this.onChange = onChange

    this.progress = {
      current: 0,
      total: 0,
      complete: 0,
      step: 0,
    }

    this.isFirstInject = true 

    this.created()
  }

  created() {
    this.emitter.on(this.name, this.action.bind(this, this.instance))
  }

  onGetValue() {
    if(!this.isFirstInject || !this.instance) return 
    this.isFirstInject = true 
    const files = this.getValue
    const target = files.find(item => item.name === this.name)
    if(!target) return 
    const status = target.getStatus()
    const progress = get(target, "task.process")
    this.progress = merge({}, this.progress, progress, { step: isNill(status) ? -3 : status })
    this.onChange && this.onChange(this.progress, this.progressInfo())
  }

  progressInfo() {
    let { complete, total, current } = this.progress;
    complete = complete || 0;
    total = total || 0;

    return [complete, total, current, (complete / total) * 100 || 0, this.progress];
  }

  action(instance, name, params, response) {
    const progress = response && response.process;
    const status = instance.getStatus(name);
    this.progress = merge({}, this.progress, progress, { step: isNill(status) ? -3 : status })
    this.onChange && this.onChange(this.progress, this.progressInfo())
  }

}
