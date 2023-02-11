import { nanoid } from 'nanoid';

export default class Todo {
  checked = false;
  #id;
  #dueDate;
  constructor({ title, description, dueDate, priority, id }) {
    this.#id = id || nanoid();
    this.title = title;
    this.description = description || '';
    this.dueDate = dueDate;
    this.priority = priority;
  }

  toggleDone() {
    this.checked = !this.checked;
  }

  set dueDate(value) {
    if (new Date() > value) {
      throw new Error("You can't set the date earlier than today.");
    }
    this.#dueDate = value;
  }

  get dueDate() {
    return this.#dueDate;
  }

  get id() {
    return this.#id;
  }
}
