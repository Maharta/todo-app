import './assets/reset.css';
import './assets/styles.css';
import { todoEventManager } from './todoEvents';
import Todo from './model/Todo';
import todoView from './todos/todoView';

todoEventManager.triggerEvent('addTodo', {
  category: 'pepega',
  todo: new Todo({
    title: 'ngawur',
    date: new Date('10 Feb 2023'),
    description: 'pipiga',
    priority: 'medium',
  }),
});

todoView.initializeEvents();

const categoryButtons = document.querySelectorAll('.category_button');
categoryButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    const category = e.target.dataset.category;
    todoEventManager.triggerEvent('changeTab', { category });
  });
});
