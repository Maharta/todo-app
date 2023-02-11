import EventManager from '../utils/EventManager';
import Todo from '../model/Todo';

const exampleTodo = new Todo({
  title: 'AdmiralBullcock',
  dueDate: new Date('12 Feb 2023'),
  description: 'I love admiralbullcock',
  priority: 'high',
});

const todoStorage = new Map([['default', [exampleTodo]]]);

const todoModel = ((todoStorage) => {
  function getTodosByCategory(category) {
    const todos = todoStorage.get(category);
    return todos;
  }
  function getTodo(todoId, category) {
    const todos = getTodosByCategory(category);
    return todos.find((todo) => todo.id === todoId);
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

  function editTodo(todoId, category, params) {
    const todos = todoModel.getTodosByCategory(category);
    const todoToEdit = todos.find((todo) => todo.id === todoId);
    todoToEdit._dueDate = params.dueDate;
    todoToEdit.title = params.title;
    todoToEdit.priority = params.priority;
    todoToEdit.description = params.description;

    return todoToEdit;
  }

  function initializeEvents() {
    const todoEventManager = EventManager.getInstance();
    todoEventManager.subscribe('addTodo', (todoObject) => {
      addTodo(todoObject);
    });

    todoEventManager.subscribe('deleteTodo', (todoObject) => {
      removeTodo(todoObject);
    });

    todoEventManager.subscribe('editTodo', ({ category, todo }) => {
      const todoToBeEdited = getTodo(todo.id, category);
      todoToBeEdited.title = todo.title;
      todoToBeEdited.dueDate = todo.dueDate;
      todoToBeEdited.description = todo.description;
      todoToBeEdited.priority = todo.priority;
    });
  }
  return {
    addTodo,
    getTodo,
    removeTodo,
    initializeEvents,
    getTodosByCategory,
    editTodo,
  };
})(todoStorage);

export default todoModel;
