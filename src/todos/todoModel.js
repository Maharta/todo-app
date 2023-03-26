import Todo from '../model/Todo.js';
import EventManager from '../utils/EventManager.js';

const todoStorage = new Map([
  [
    'Home',
    [
      new Todo({
        title: 'Do My Homework',
        description:
          'Do my math homework by Mrs. Vida before March 28th, else she will get angry :(',
        priority: 'high',
        checked: false,
        dueDate: new Date('2023-03-28T00:00:00.000Z'),
      }),
      new Todo({
        title: 'Wash My Dishes',
        description:
          "Wash my dishes before dad come back from the supermarket, he said he's buying some milk",
        priority: 'medium',
        checked: true,
        dueDate: new Date('2023-03-15T00:00:00.000Z'),
      }),
      new Todo({
        title: 'Buy Some Milk',
        description:
          'Buy milk for a long period of time when i become a dad, just like my dad',
        priority: 'low',
        checked: false,
        dueDate: new Date('2023-10-28T00:00:00.000Z'),
      }),
    ],
  ],
]);

const todoModel = ((todoStorage) => {
  function getTodosByCategory(category) {
    console.log(category);

    const todos = todoStorage.get(category);
    return todos;
  }

  function getAllCategories() {
    return Array.from(todoStorage.keys());
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

  function subscribeToPublisher() {
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

    todoEventManager.subscribe('addCategory', ({ category }) => {
      if (todoStorage.get(category) != undefined) {
        alert('A category with the same name already exist!');
        return;
      }
      todoStorage.set(category, []);
      todoEventManager.triggerEvent('reloadCategories', {
        categories: getAllCategories(),
      });
    });
  }
  return {
    addTodo,
    getTodo,
    removeTodo: deleteTodo,
    subscribeToPublisher,
    getTodosByCategory,
    editTodo,
  };
})(todoStorage);

export default todoModel;
