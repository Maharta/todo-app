class EventManager {
  events = [];

  static getInstance() {
    if (!EventManager._instance) {
      EventManager._instance = new EventManager();
    }
    return EventManager._instance;
  }

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
