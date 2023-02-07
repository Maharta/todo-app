import { nanoid } from 'nanoid';

export default class Todo {
  checked = false;
  #_dueDate;
  constructor({ title, description, date, priority }) {
    this.id = nanoid();
    this.title = title;
    this.description = description || '';
    this.dueDate = date;
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
}
