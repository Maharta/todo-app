import EventManager from '../utils/EventManager';

const todoStorage = new Map([['default', []]]);
console.log(todoStorage);

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

  function addToLocalStorage({ category, todo }) {
    const todoObj = {
      ...todo,
      dueDate: todo.dueDate,
      category,
    };
    console.log(todoObj);
    localStorage.setItem(`todo-${todo.id}`, JSON.stringify(todoObj));
  }

  function deleteTodo({ category, todo }) {
    if (!todoStorage.has(category)) {
      throw new Error('Something went wrong');
    }
    const filteredTodos = todoStorage
      .get(category)
      .filter((existingTodo) => existingTodo.id !== todo.id);
    todoStorage.set(category, filteredTodos);

    localStorage.removeItem(`todo-${todo.id}`);
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
    todoEventManager.subscribe('addTodo', ({ category, todo }) => {
      addTodo({ category, todo });
      addToLocalStorage({ category, todo });
    });

    todoEventManager.subscribe('deleteTodo', ({ category, todo }) => {
      deleteTodo({ category, todo });
      console.log(todoStorage);
    });

    todoEventManager.subscribe('editTodo', ({ category, todo }) => {
      const todoToBeEdited = getTodo(todo.id, category);
      todoToBeEdited.title = todo.title;
      todoToBeEdited.dueDate = todo.dueDate;
      todoToBeEdited.description = todo.description;
      todoToBeEdited.priority = todo.priority;
    });

    todoEventManager.subscribe('loadTodo', ({ category, todo }) => {
      addTodo({ category, todo });
    });
  }
  return {
    addTodo,
    getTodo,
    removeTodo: deleteTodo,
    initializeEvents,
    getTodosByCategory,
    editTodo,
  };
})(todoStorage);

export default todoModel;
