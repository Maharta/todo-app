import './assets/reset.css';
import './assets/styles.css';
import Todo from './model/Todo.js';
import todoView from './todos/todoView.js';
import todoModel from './todos/todoModel.js';
import EventManager from './utils/EventManager.js';

const todoEventManager = EventManager.getInstance();

todoModel.subscribeToPublisher();
todoView.subscribeToPublisher();
todoView.initializeDomEvents();

// load todos from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const keys = Object.keys(localStorage);
  const todoKeys = keys.filter((key) => key.startsWith('todo-'));
  const categorySet = new Set();

  for (const key of todoKeys) {
    const rawTodo = JSON.parse(localStorage.getItem(key));
    categorySet.add(rawTodo.category);

    const todo = new Todo({
      id: key.substring(5),
      title: rawTodo.title,
      description: rawTodo.description,
      dueDate: new Date(rawTodo.dueDate),
      priority: rawTodo.priority,
      checked: rawTodo.checked,
    });

    todoEventManager.triggerEvent('loadTodo', {
      todo,
      category: rawTodo.category,
    });
  }

  todoEventManager.triggerEvent('loadCategories', {
    categories: categorySet,
  });

  // Home default category will be loaded
  todoEventManager.triggerEvent('changeTab', { category: 'Home' });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('hidden');
  }
});
