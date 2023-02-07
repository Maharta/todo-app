import todoModel from './todoModel';
import EventManager from '../utils/EventManager';

const todoView = (() => {
  function makeTodoElement(todo) {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');
    todoDiv.setAttribute('data-id', todo.id);

    // left part
    const left = document.createElement('div');
    left.classList.add('left_section');
    const checkboxDiv = document.createElement('div');
    checkboxDiv.classList.add('checkbox');
    const todoText = document.createElement('p');
    todoText.textContent = todo.title;
    left.append(checkboxDiv, todoText);

    // right part
    const right = document.createElement('div');
    right.classList.add('right_section');
    const detailButton = document.createElement('button');
    detailButton.textContent = 'DETAIL';
    const dueDateText = document.createElement('p');
    dueDateText.textContent = todo.dueDate.toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric',
    });
    const editButton = document.createElement('button');
    editButton.textContent = 'EDIT';
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'DELETE';
    right.append(detailButton, dueDateText, editButton, deleteButton);

    // append left and right to container div
    todoDiv.append(left, right);

    return todoDiv;
  }

  function renderTodos(category) {
    const todosContainer = document.getElementById('todos_container');
    todosContainer.innerHTML = '';
    const todos = todoModel.getTodosByCategory(category);
    if (!todos) {
      throw Error('Category not found');
    }
    todos.forEach((todo) => {
      const todoElement = makeTodoElement(todo);
      todosContainer.appendChild(todoElement);
    });
  }

  function initializeEvents() {
    const todoEventManager = EventManager.getInstance();
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
})();

export default todoView;
