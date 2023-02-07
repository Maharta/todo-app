class EventManager {
  events = [];

  subscribe(type, callback) {
    if (this.events[type]) {
      this.events[type].push(callback);
    } else {
      this.events[type] = [callback];
    }
  }

  triggerEvent(type, ...args) {
    if (this.events[type]) {
      this.events[type].forEach((callback) => callback(...args));
    }
  }
}

export default EventManager;
