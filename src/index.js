import './assets/reset.css';
import './assets/styles.css';
import Todo from './model/Todo';
import todoView from './todos/todoView';
import todoModel from './todos/todoModel';
import EventManager from './utils/EventManager';

const todoEventManager = EventManager.getInstance();

todoModel.initializeEvents();
todoView.initializeEvents();
todoView.initializeDomEvents();

todoEventManager.triggerEvent('addTodo', {
  category: 'pepega',
  todo: new Todo({
    title: 'ngawur',
    dueDate: new Date('10 Feb 2023'),
    description: 'pipiga',
    priority: 'medium',
  }),
});
