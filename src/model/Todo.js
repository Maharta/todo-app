import { nanoid } from 'nanoid';

export default class Todo {
  checked = false;
  #id = nanoid();
  constructor({ title, description, dueDate, priority }) {
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
    this._dueDate = value;
  }

  get dueDate() {
    return this._dueDate;
  }

  get id() {
    return this.#id;
  }
}
