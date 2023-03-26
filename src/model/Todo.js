import { nanoid } from 'nanoid';

export default class Todo {
  #id;
  #dueDate;
  constructor({ title, description, dueDate, priority, id, checked = false }) {
    this.#id = id || nanoid();
    this.title = title;
    this.description = description || '';
    this.dueDate = dueDate;
    this.priority = priority;
    this.checked = checked;
  }

  toggleDone() {
    this.checked = !this.checked;
  }

  set dueDate(value) {
    this.#dueDate = value;
  }

  get dueDate() {
    return this.#dueDate;
  }

  get id() {
    return this.#id;
  }
}
