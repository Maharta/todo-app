import todoModel from './todoModel';
import EventManager from '../utils/EventManager';
import Todo from '../model/Todo';

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
      const categoriesContainer = document.getElementById(
        'categories_container'
      );
      categoriesContainer.setAttribute('data-selected', e.category);
      renderTodos(e.category);
    });
  }

  function initializeDomEvents() {
    const todoEventManager = EventManager.getInstance();
    const categoryButtons = document.querySelectorAll('.category_button');
    categoryButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        todoEventManager.triggerEvent('changeTab', { category });
      });
    });

    const fab = document.getElementById('fab');
    fab.addEventListener('click', () => {
      const modalOverlay = document.getElementById('overlay');
      modalOverlay.classList.add('visible');
    });

    const modalOverlay = document.getElementById('overlay');
    modalOverlay.addEventListener('click', (e) => {
      e.target.classList.remove('visible');
    });

    const addTodoButton = document.getElementById('addTodoButton');
    addTodoButton.addEventListener('click', (e) => {
      e.preventDefault();
      const currentCategory = document.getElementById('categories_container')
        .dataset.selected;
      console.log(currentCategory);
      const title = document.querySelector('input[type="text"]#title').value;
      const description = document.querySelector('textarea#description').value;
      const dueDateString = document.querySelector(
        'input[type="date"]#date'
      ).value;
      const dueDate = new Date(dueDateString);
      const priority = document.querySelector(
        'input[type="radio"][name="priority"]:checked'
      ).value;
      if (!priority) return;

      const todo = new Todo({
        title,
        description,
        dueDate,
        priority,
      });

      todoEventManager.triggerEvent('addTodo', {
        category: currentCategory,
        todo,
      });
    });
  }

  return {
    initializeEvents,
    initializeDomEvents,
  };
})();

export default todoView;
