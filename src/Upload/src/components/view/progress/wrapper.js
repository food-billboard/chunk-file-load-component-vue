
import { merge } from 'lodash'

export default class {

  constructor({
    name,
    getValue,
    emitter,
    instance
  }) {
    this.name = name 
    this.getValue = getValue
    this.emitter = emitter
    this.instance = instance

    this.created()
  }

  name 
  getValue 
  emitter 
  instance 

  progress = {
    current: 0,
    total: 0,
    complete: 0,
    step: 0,
  }

  isFirstInject = true 

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
    const progress = target.task?.process
    this.progress = merge({}, this.progress, progress, { step: status ?? -3 })
  }

  progressInfo() {
    let { complete, total, current } = this.progress;
    complete ||= 0;
    total ||= 0;

    return [complete, total, current, (complete / total) * 100 || 0, this.progress];
  }

  action(instance, name, params, response) {
    const progress = response?.process;
    const status = instance.getStatus(name);
    this.progress = merge({}, this.progress, progress, { step: status ?? -3 })
  }

}
