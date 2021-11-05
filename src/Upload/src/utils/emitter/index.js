class Emitter {

  constructor() {
    this.events = new Map()
  }

  on(name, action) {
    if (typeof name === 'symbol') {
      let result = this.events.get(name);
      if (!result) result = new Set();
      result.add(action);
      this.events.set(name, result);
    }
  }

  emit(name, ...args) {
    const action = this.events.get(name);
    if(action) action.forEach((action) => {
      action && action(name, ...args);
    });
  }

  off(name) {
    this.events.delete(name);
  }
}

export default Emitter;
