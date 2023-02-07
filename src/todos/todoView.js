import { todoEventManager, todoStorage } from '../todoEvents';

const todoView = ((todoEventManager) => {
  function renderTodos(category) {
    const todosContainer = document.getElementById('todos_container');
    todosContainer.innerHTML = '';
    const todos = todoStorage.get(category);
    if (!todos) {
      throw Error('Category not found');
    }
    todos.forEach((todo) => {
      const p = document.createElement('p');
      const button = document.createElement('button');
      p.textContent = todo.title;
      button.textContent = todo.checked ? 'v' : 'x';
      button.addEventListener('click', () => {
        todo.toggleDone();
        button.textContent = todo.checked ? 'v' : 'x';
        console.log(todoStorage);
      });
      todosContainer.append(p, button);
    });
  }

  function initializeEvents() {
    todoEventManager.subscribe('addTodo', (e) => {
      renderTodos(e.category);
    });
    todoEventManager.subscribe('changeTab', (e) => {
      renderTodos(e.category);
    });
  }

  return {
    initializeEvents,
  };
})(todoEventManager);

export default todoView;
