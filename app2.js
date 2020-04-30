const taskInput = document.querySelector("#task");
const taskCollection = document.querySelector(".collection");
const taskForm = document.querySelector("#task-form");
const clearTasksButton = document.querySelector(".clear-tasks");
const filterInput = document.querySelector("#filter");

document.body.onload = renderTasks;
taskForm.onsubmit = addTask;
clearTasksButton.onclick = clearTasks;
filterInput.oninput = onFilterInput;

// Event handlers

/**
 * Wrapper for executing logic on creating a new task
 * @param {Event} e
 */
function addTask(e) {
  e.preventDefault();

  if (!taskInput || taskInput.value === "") {
    return;
  }

  addTaskInStorage(taskInput.value);
  renderTasks();
  clearTaskInput();
}

/**
 * Wrapper for executing logic on deleting a task
 * @param {Event} e
 */
function deleteTask(e) {
  e.preventDefault();

  const { id, text } = getTask(e.currentTarget.closest(".collection-item").id);

  if (id && text && confirm(`Are you sure you want to delete the task "${text}"?`)) {
    deleteTaskInStorage(id);

    clearTask(id);
  }
}

/**
 * Wrapper for executing logic on editing an existing task
 * @param {Event} e
 */
function editTask(e) {
  e.preventDefault();

  const taskToEdit = e.currentTarget.closest(".collection-item");

  taskToEdit.querySelector(".task-text").contentEditable = true;
  taskToEdit.querySelector(".task-text").focus();
  taskToEdit.querySelector(".edit-item").replaceWith(buildConfirmButton());
  taskToEdit.querySelector(".delete-item").replaceWith(buildCancelButton());
}

/**
 * Wrapper for executing logic on toggling checkbox on an existing task
 * @param {Event} e
 */
function toggleCheckbox(e) {
  const taskToEdit = e.currentTarget.closest(".collection-item");
  const isChecked = e.currentTarget.checked;

  editTaskInStorage(taskToEdit.id, undefined, isChecked);
}

/**
 * Wrapper for executing logic on cancelling an edit of a task
 * @param {Event} e
 */
function cancelEdit(e) {
  e.preventDefault();

  const taskToEdit = e.currentTarget.closest(".collection-item");
  const taskFromStorage = getTask(taskToEdit.id);

  taskToEdit.querySelector(".task-text").textContent = taskFromStorage.text;
  taskToEdit.querySelector(".task-text").contentEditable = false;
  taskToEdit.querySelector(".update-btn").replaceWith(buildEditItem());
  taskToEdit.querySelector(".cancel-btn").replaceWith(buildDeleteItem());
}

/**
 * Wrapper for executing logic on confirming an edit of a task
 * @param {Event} e
 */
function confirmEdit(e) {
  e.preventDefault();

  const taskToEdit = e.currentTarget.closest(".collection-item");
  const taskText = taskToEdit.querySelector(".task-text").textContent;

  editTaskInStorage(taskToEdit.id, taskText);

  taskToEdit.querySelector(".task-text").contentEditable = false;
  taskToEdit.querySelector(".update-btn").replaceWith(buildEditItem());
  taskToEdit.querySelector(".cancel-btn").replaceWith(buildDeleteItem());
}

/**
 * Appends tasks from localstorage to taskCollection wrapper
 */
function renderTasks() {
  const tasks = getTasks();

  tasks.forEach((taskData) => {
    const task = buildTask(taskData);
    const doesTaskExist = !!document.getElementById(taskData.id);

    if (!doesTaskExist) {
      taskCollection.appendChild(task);
    }
  });
}

/**
 * Wrapper for executing logic on filtering tasks on input value
 * @param {Event} e
 */
function onFilterInput(e) {
  const text = e.currentTarget.value;
  const [filteredTasks, otherTasks] = filterTasksByText(text);

  filteredTasks.forEach(({ id }) => {
    const taskToHide = document.getElementById(id);

    taskToHide.style.display = "grid";
  });
  otherTasks.forEach(({ id }) => {
    const taskToHide = document.getElementById(id);

    taskToHide.style.display = "none";
  });
}

/**
 *
 * @param {string} value compares against each tasks text value
 * @retuns [filteredTasks, otherTasks]
 */
function filterTasksByText(value) {
  return [getTasks().filter((task) => task.text.includes(value)), getTasks().filter((task) => !task.text.includes(value))];
}

// Storage actions

/**
 * Add new task to localstorage 'tasks'
 * @param {string} text
 * @param {boolean} [checked=false]
 */
function addTaskInStorage(text, checked = false) {
  const newTask = {
    id: generateUniqueId(),
    text: text,
    checked: checked,
  };

  const currentTasks = getTasks();
  localStorage.setItem("tasks", JSON.stringify([...currentTasks, newTask]));
}

/**
 * Edit existing task in localstorage 'tasks'
 * @param {string} id
 * @param {string} text
 * @param {boolean} checked
 */
function editTaskInStorage(id, text, checked) {
  console.log(checked);
  if (!id) {
    alert("Please provide an 'id' value of the task to be edited.");
    return;
  }

  let tasksToMutate = getTasks();
  const taskFromStorage = getTask(id);
  const taskToEditIndex = tasksToMutate.findIndex((task) => task.id === id);

  tasksToMutate.splice(taskToEditIndex, 1, {
    ...taskFromStorage,
    text: text || taskFromStorage.text,
    checked: typeof checked !== "undefined" ? checked : taskFromStorage.checked,
  });

  localStorage.setItem("tasks", JSON.stringify(tasksToMutate));
}

/**
 * Delete existing task in localstrage 'tasks'
 * @param {string} id
 */
function deleteTaskInStorage(id) {
  const currentTasks = getTasks();
  const newTasks = currentTasks.filter((task) => task.id !== id);

  localStorage.setItem("tasks", JSON.stringify(newTasks));
}

// Build elements

/**
 * Build task HTML element
 * @param {object} param
 * @param {string} param.id
 * @param {string} param.text
 * @param {boolean} param.checked
 * @returns Element
 */
function buildTask({ id, text, checked }) {
  const task = buildTaskContainer(id);

  const checkboxWrapper = buildCheckboxWrapper();
  const checkboxHelper = buildCheckboxHelper();
  const checkbox = buildCheckbox(checked);

  checkboxWrapper.appendChild(checkbox);
  checkboxWrapper.appendChild(checkboxHelper);

  task.appendChild(checkboxWrapper);
  task.appendChild(buildTaskText(text));
  task.appendChild(buildEditItem());
  task.appendChild(buildDeleteItem());

  return task;
}

/**
 * Build task container HTML elements
 * @param {string} id
 * @returns Element
 */
function buildTaskContainer(id) {
  const taskContainer = document.createElement("li");
  taskContainer.className = "collection-item";
  taskContainer.setAttribute("id", id);

  return taskContainer;
}

/**
 * Build buildCheckboxHelper HTML elements
 * @returns Element
 */
function buildCheckboxHelper() {
  const checkboxHelper = document.createElement("span");
  checkboxHelper.className = "checkbox-helper";

  return checkboxHelper;
}

/**
 * Build buildCheckboxWrapper HTML elements
 * @returns Element
 */
function buildCheckboxWrapper() {
  const checkboxWrapper = document.createElement("label");

  checkboxWrapper.className = "checkbox-wrapper";

  return checkboxWrapper;
}

/**
 * Build buildCheckbox HTML elements
 * @param {boolean} checked initial checked value
 * @returns Element
 */
function buildCheckbox(checked) {
  const checkbox = document.createElement("input");

  checkbox.type = "checkbox";
  checkbox.className = "completed filled-in";
  checkbox.checked = checked;
  checkbox.onclick = toggleCheckbox;

  return checkbox;
}

/**
 * Build task text HTML elements
 * @param {string} text initial text value
 * @returns Element
 */
function buildTaskText(text) {
  const taskText = document.createElement("p");

  taskText.className = "task-text";
  taskText.appendChild(document.createTextNode(text));

  return taskText;
}

/**
 * Build edit button HTML elements
 * @returns Element
 */
function buildEditItem() {
  const editItem = document.createElement("a");

  editItem.className = "edit-item";
  editItem.innerHTML = '<i class="small material-icons">edit</i>';
  editItem.onclick = editTask;

  return editItem;
}

/**
 * Build delete button HTML elements
 * @returns Element
 */
function buildDeleteItem() {
  const deleteItem = document.createElement("a");

  deleteItem.className = "delete-item";
  deleteItem.innerHTML = '<i class="small material-icons">delete</i>';
  deleteItem.onclick = deleteTask;

  return deleteItem;
}

/**
 * Build edit confirm button HTML elements
 * @returns Element
 */
function buildConfirmButton() {
  const confirmButton = document.createElement("a");

  confirmButton.className = "btn-floating btn-small waves-effect waves-light update-btn";
  confirmButton.innerHTML = '<i class="material-icons">check</i>';
  confirmButton.onclick = confirmEdit;

  return confirmButton;
}

/**
 * Build edit cancel button HTML elements
 * @returns Element
 */
function buildCancelButton() {
  const cancelButton = document.createElement("a");

  cancelButton.className = "btn-floating btn-small waves-effect waves-light cancel-btn";
  cancelButton.innerHTML = '<i class="material-icons">clear</i>';
  cancelButton.onclick = cancelEdit;

  return cancelButton;
}

// Clear functions

/**
 * Remove task from DOM by id
 * @param {string} id
 */
function clearTask(id) {
  taskCollection.querySelector(`#${id}`).remove();
}

/**
 * Reset task input field value
 */
function clearTaskInput() {
  taskInput.value = "";
}

/**
 * Delete all tasks from localstorage and DOM
 */
function clearTasks() {
  localStorage.removeItem("tasks");
  taskCollection.querySelectorAll("*").forEach((child) => child.remove());

  renderTasks();
}

// get functions

/**
 * Get list of tasks from localstorage
 */
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

/**
 * Get a single task by id from localstorage
 * @param {string} id
 */
function getTask(id) {
  if (!id) {
    return;
  }

  return getTasks().find((task) => task.id === id);
}

// Helper functions

/**
 * Creates a unique string value (probably)
 */
function generateUniqueId() {
  return (
    Array(16)
      .fill(0)
      .map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
      .join("") + Date.now().toString(24)
  );
}
