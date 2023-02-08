import EventManager from '../utils/EventManager';
import Todo from '../model/Todo';

const exampleTodo = new Todo({
  title: 'AdmiralBullcock',
  dueDate: new Date('12 Feb 2023'),
  description: 'I love admiralbullcock',
  priority: 'High',
});

const todoStorage = new Map([['default', [exampleTodo]]]);

const todoModel = ((todoStorage) => {
  function getTodosByCategory(category) {
    const todos = todoStorage.get(category);
    return todos;
  }
  function addTodo({ category, todo }) {
    if (!todoStorage.has(category)) {
      todoStorage.set(category, [todo]);
    } else {
      todoStorage.get(category).push(todo);
    }
    console.log(todoStorage);
  }

  function removeTodo({ category, todo }) {
    if (!todoStorage.has(category)) {
      throw new Error('Something went wrong');
    }
    const filteredTodos = todoStorage
      .get(category)
      .filter((existingTodo) => existingTodo.id !== todo.id);
    todoStorage.set(category, filteredTodos);
  }

  function initializeEvents() {
    const todoEventManager = EventManager.getInstance();
    todoEventManager.subscribe('addTodo', (todoObject) => {
      addTodo(todoObject);
    });

    todoEventManager.subscribe('deleteTodo', (todoObject) => {
      removeTodo(todoObject);
    });
  }
  return {
    addTodo,
    removeTodo,
    initializeEvents,
    getTodosByCategory,
  };
})(todoStorage);

export default todoModel;
