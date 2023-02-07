import PubSub from './utils/EventManager';
import Todo from './model/Todo';

const exampleTodo = new Todo({
  title: 'AdmiralBullcock',
  date: new Date('12 Feb 2023'),
  description: 'I love admiralbullcock',
  priority: 'High',
});

const todoStorage = new Map([['default', [exampleTodo]]]);

const todoEventManager = new PubSub();

todoEventManager.subscribe('addTodo', (e) => {
  const category = e.category;

  if (!todoStorage.has(category)) {
    todoStorage.set(category, [e.todo]);
  } else {
    todoStorage.get(category).push(e.todo);
  }
});

todoEventManager.subscribe('toggleDone', (e) => {
  e.todo.toggleDone();
});

todoEventManager.subscribe('deleteTodo', (e) => {
  if (!todoStorage.has(e.category)) {
    throw new Error('Something went wrong');
  }
  const filteredTodos = todoStorage
    .get(e.category)
    .filter((todo) => todo.id !== e.todo.id);

  todoStorage.set(e.category, filteredTodos);
});

export { todoEventManager, todoStorage };
