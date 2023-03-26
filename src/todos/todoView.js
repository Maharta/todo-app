import todoModel from './todoModel';
import EventManager from '../utils/EventManager';
import Todo from '../model/Todo';
import 'iconify-icon'; /* iconify-icon web component */

const iconifyIcon = 'iconify-icon';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const todoView = (() => {
  function makeTodoElement(todo) {
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo', todo.priority);
    todoDiv.setAttribute('data-id', todo.id);
    todoDiv.setAttribute('aria-role', 'button');

    // left part
    const left = document.createElement('div');
    left.classList.add('left_section');
    const checkbox = document.createElement('button');
    checkbox.classList.add('checkbox');
    if (todo.checked) {
      checkbox.classList.add('checked');
    }
    const todoText = document.createElement('p');
    todoText.textContent = todo.title;
    left.append(checkbox, todoText);

    todoDiv.addEventListener('click', () => {
      checkbox.click();
    });

    checkbox.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      todo.toggleDone();
      e.target.classList.toggle('checked');
    });

    // right part
    const right = document.createElement('div');
    right.classList.add('right_section');
    const detailButton = document.createElement('button');
    detailButton.classList.add('detail_button');
    detailButton.textContent = 'DETAILS';
    detailButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentCategory = document.getElementById('categories_container')
        .dataset.selected;
      const todoId = e.target.parentElement.parentElement.dataset.id;
      const todo = todoModel.getTodo(todoId, currentCategory);
      renderTodoDetails(todo, currentCategory);
    });
    const dueDateText = document.createElement('p');
    dueDateText.textContent = todo.dueDate.toLocaleDateString('en-us', {
      month: 'short',
      day: 'numeric',
    });
    const editButton = document.createElement('button');
    editButton.classList.add('icon_button');
    const editIcon = document.createElement(iconifyIcon);
    editIcon.setAttribute('icon', 'mdi:square-edit-outline');
    editIcon.setAttribute('height', '24px');
    editIcon.setAttribute('width', '24px');
    editIcon.style.verticalAlign = 'middle';
    editButton.appendChild(editIcon);
    editButton.addEventListener('click', (e) => {
      e.stopPropagation();
      renderTodoEditElement(todo);
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('icon_button');
    const trashIcon = document.createElement(iconifyIcon);
    trashIcon.setAttribute('icon', 'mdi:trash-can');
    trashIcon.setAttribute('height', '24px');
    trashIcon.setAttribute('width', '24px');
    trashIcon.style.verticalAlign = 'middle';
    deleteButton.appendChild(trashIcon);
    deleteButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentCategory = document.getElementById('categories_container')
        .dataset.selected;
      const todoEventManager = EventManager.getInstance();
      todoEventManager.triggerEvent('deleteTodo', {
        category: currentCategory,
        todo,
      });
    });
    right.append(detailButton, dueDateText, editButton, deleteButton);

    // append left and right to container div
    todoDiv.append(left, right);

    return todoDiv;
  }

  function makeTodoDetailsElement(todo, category) {
    const detailModal = document.createElement('div');
    detailModal.classList.add('detail_modal');
    detailModal.id = 'detail_modal';
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('detail_header');
    const h3 = document.createElement('h3');
    h3.textContent = todo.title;
    const closeButton = document.createElement('button');
    closeButton.textContent = 'x';
    closeButton.addEventListener('click', () => {
      document.getElementById('overlay').classList.add('hidden');
    });
    headerDiv.append(h3, closeButton);

    const categoryP = document.createElement('p');
    categoryP.textContent = `Category: ${capitalizeFirstLetter(category)}`;
    const priorityP = document.createElement('p');
    priorityP.textContent = `Priority: ${todo.priority}`;
    const dueDateP = document.createElement('p');
    dueDateP.textContent = `Date: ${todo.dueDate.toLocaleDateString()}`;
    const descriptionP = document.createElement('p');
    descriptionP.textContent = `Description: ${todo.description}`;
    detailModal.append(headerDiv, categoryP, priorityP, dueDateP, descriptionP);
    return detailModal;
  }

  function makeAddTodoFormElement() {
    const html = `
      <div class="modal" id="add_modal">
        <form>
          <div class="form-control">
            <label for="title">Title</label>
            <input
              required="true"
              type="text"
              name="title"
              id="title"
              placeholder="Work on my thesis"
            />
          </div>
          <div class="form-control">
            <label for="description">Description</label>
            <textarea
              required="true"
              name="description"
              id="description"
              cols="30"
              rows="7"
              placeholder="Work on my thesis instead of doing this project. Help mee!!"
            ></textarea>
          </div>
          <div class="form-control">
            <label for="date">Due Date</label>
            <input required="true" type="date" name="date" id="date" />
          </div>
          <fieldset>
            <legend>Priority</legend>
            <div class="priorities">
              <div class="priority_control low">
                <input
                  required="true"
                  type="radio"
                  name="priority"
                  id="low"
                  value="low"
                />
                <label for="low">LOW</label>
              </div>
              <div class="priority_control medium">
                <input
                  type="radio"
                  name="priority"
                  id="medium"
                  value="medium"
                />
                <label for="medium">MEDIUM</label>
              </div>
              <div class="priority_control high">
                <input type="radio" name="priority" id="high" value="high" />
                <label for="high">HIGH</label>
              </div>
            </div>
          </fieldset>
          <button id="addTodoButton" type="submit">Add Todo</button>
        </form>
      </div>
    `;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const modal = doc.body.firstChild;
    const form = modal.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const todoEventManager = EventManager.getInstance();
      const currentCategory = document.getElementById('categories_container')
        .dataset.selected;
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
      document.querySelector('#overlay').classList.add('hidden');
    });

    return modal;
  }

  function renderTodoEditElement(todo) {
    const date = todo.dueDate.toISOString().split('T')[0].replace('/', '-');
    const html = `
      <div class="modal" id="add_modal">
        <form>
          <div class="form-control">
            <label for="title">Title</label>
            <input
              required
              type="text"
              name="title"
              id="title"
              value="${todo.title}"
              placeholder="Work on my thesis"
            />
          </div>
          <div class="form-control">
            <label for="description">Description</label>
            <textarea
              required
              name="description"
              id="description"
              cols="30"
              rows="7"
              placeholder="Work on my thesis instead of doing this project. Help mee!!"
            >
${todo.description}</textarea
            >
          </div>
          <div class="form-control">
            <label for="date">Due Date</label>
            <input required value="${date}" type="date" name="date" id="date" />
          </div>
          <fieldset>
            <legend>Priority</legend>
            <div class="priorities">
              <div class="priority_control low">
                <input
                  required
                  ${todo.priority === 'low' ? 'checked' : null}
                  type="radio"
                  name="priority"
                  id="low"
                  value="low"
                />
                <label for="low">LOW</label>
              </div>
              <div class="priority_control medium">
                <input
                  ${todo.priority === 'medium' ? 'checked' : null}
                  type="radio"
                  name="priority"
                  id="medium"
                  value="medium"
                />
                <label for="medium">MEDIUM</label>
              </div>
              <div class="priority_control high">
                <input
                  ${todo.priority === 'high' ? 'checked' : null}
                  type="radio"
                  name="priority"
                  id="high"
                  value="high"
                />
                <label for="high">HIGH</label>
              </div>
            </div>
          </fieldset>
          <button id="editTodoButton" type="submit">Edit Todo</button>
        </form>
      </div>
    `;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const modal = doc.body.firstChild;
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = '';
    overlay.classList.remove('hidden');
    overlay.appendChild(modal);
    const form = modal.querySelector('form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const todoEventManager = EventManager.getInstance();
      const currentCategory = document.getElementById('categories_container')
        .dataset.selected;
      const title = form.querySelector('input[type="text"]#title').value;
      const description = form.querySelector('textarea#description').value;
      const dueDateString = form.querySelector('input[type="date"]#date').value;
      const dueDate = new Date(dueDateString);
      const priority = form.querySelector(
        'input[type="radio"][name="priority"]:checked'
      ).value;
      if (!priority) return;

      const newTodo = new Todo({
        title,
        description,
        dueDate,
        priority,
        id: todo.id,
      });

      todoEventManager.triggerEvent('editTodo', {
        category: currentCategory,
        todo: newTodo,
      });
      document.querySelector('#overlay').classList.add('hidden');
    });
  }

  function renderTodoDetails(todo, category) {
    const detailModal = makeTodoDetailsElement(todo, category);
    const overlay = document.getElementById('overlay');
    overlay.innerHTML = '';
    overlay.appendChild(detailModal);
    overlay.classList.remove('hidden');
  }

  function renderTodos(category) {
    const todosContainer = document.getElementById('todos_container');
    todosContainer.innerHTML = '';
    const todos = todoModel.getTodosByCategory(category);
    if (!todos) {
      todosContainer.innerHTML =
        '<i class="empty">No todo yet in this category.</i>';
      return;
    }
    todos.forEach((todo) => {
      const todoElement = makeTodoElement(todo);
      todosContainer.appendChild(todoElement);
    });
  }

  function appendTodos(todo) {
    const todosContainer = document.getElementById('todos_container');
    if (
      todosContainer.innerHTML ===
      '<i class="empty">No todo yet in this category.</i>'
    );
    {
      todosContainer.innerHTML = '';
    }
    const todoElement = makeTodoElement(todo);
    todosContainer.appendChild(todoElement);
  }

  function makeCategoryElement(category) {
    const todoEventManager = EventManager.getInstance();
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.dataset.category = category;
    button.innerText = category;
    button.addEventListener('click', () => {
      todoEventManager.triggerEvent('changeTab', { category });
    });
    button.classList.add('category_button');
    li.appendChild(button);
    return li;
  }

  function renderCategories(categories) {
    const categoriesUl = document.getElementById('categories');
    for (const category of categories) {
      const categoryEl = makeCategoryElement(category);
      console.log(categoryEl);
      categoriesUl.appendChild(categoryEl);
    }
  }

  function subscribeToPublisher() {
    const todoEventManager = EventManager.getInstance();
    const categoriesContainer = document.getElementById('categories_container');
    todoEventManager.subscribe('addTodo', (e) => {
      appendTodos(e.todo);
    });

    todoEventManager.subscribe('loadTodo', (e) => {
      if (categoriesContainer.dataset.selected === e.category) {
        appendTodos(e.todo);
      }
    });

    todoEventManager.subscribe('loadCategories', ({ categories }) => {
      renderCategories(categories);
    });

    todoEventManager.subscribe('changeTab', (e) => {
      categoriesContainer.setAttribute('data-selected', e.category);
      renderTodos(e.category);
    });
    todoEventManager.subscribe('editTodo', (e) => {
      const editedElement = document.querySelector(
        `div[data-id="${e.todo.id}"]`
      );
      const titleP = editedElement.querySelector('.left_section > p');
      titleP.textContent = e.todo.title;
      const dateP = editedElement.querySelector('.right_section > p');
      dateP.textContent = e.todo.dueDate.toLocaleDateString('en-us', {
        month: 'short',
        day: 'numeric',
      });
      editedElement.className = `todo ${e.todo.priority}`;
    });

    todoEventManager.subscribe('deleteTodo', (e) => {
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
      if (!modalOverlay.classList.contains('hidden')) return;
      modalOverlay.innerHTML = '';
      modalOverlay.appendChild(makeAddTodoFormElement());
      modalOverlay.classList.remove('hidden');
    });

    const modalOverlay = document.getElementById('overlay');
    modalOverlay.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.classList.contains('overlay')) {
        modalOverlay.classList.add('hidden');
      }
    });

    const categoryForm = document.getElementById('add_category__form');
    const addCategoryButton = document.getElementById('add-category');
    addCategoryButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.target.classList.add('hidden');
      categoryForm.classList.remove('hidden');
    });

    const submitCategoryButton = document.getElementById('submit_category');
    submitCategoryButton.addEventListener('click', () => {});

    const cancelCategoryButton = document.getElementById('cancel_submit');
    cancelCategoryButton.addEventListener('click', (e) => {
      categoryForm.classList.add('hidden');
      addCategoryButton.classList.remove('hidden');
    });
  }

  return {
    subscribeToPublisher,
    initializeDomEvents,
  };
})();

export default todoView;
