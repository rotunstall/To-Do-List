// DEFINE UI Vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');
const editItem = document.querySelector('.edit-item');
const completed = document.querySelector('.completed');

// LOAD all event listeners
loadEventListeners();

// LOAD all event listeners
function loadEventListeners() {
    // DOM load event
    document.addEventListener('DOMContentLoaded', getTasks);
    // ADD task event
    form.addEventListener('submit', addTask);
    // All click events on the li
    taskList.addEventListener('click', whenTaskItemLiIsClicked);
    // CLEAR task event  
    clearBtn.addEventListener('click', clearTasks);
    // FILTER task event
    filter.addEventListener('keyup', filterTasks);

}


function whenTaskItemLiIsClicked(e) {
    //const target = e.target;
    //delete --- edit-- - completed


    if (e.target.parentElement.classList.contains('edit-item')) {
        // MAKE task-text editable and focused immediately
        const currentText = e.target.parentElement.previousElementSibling;
        currentText.contentEditable = true;
        e.target.parentElement.previousElementSibling.focus();





        // CHANGE the "EDIT" and "DELETE" buttons to "SAVE" and "CANCEL" buttons respectively
        const currentLi = e.target.parentElement.parentElement;
        //const currentEditA = e.target.parentElement;
        //const currentDeleteA = e.target.parentElement.nextElementSibling;
        const updateBtn = document.createElement('a');
        updateBtn.className = 'btn-floating btn-small waves-effect waves-light  update-btn';
        updateBtn.innerHTML = '<i class="material-icons">add</i>';
        //currentLi.replaceChild(updateBtn, currentEditA);
        currentLi.lastChild.style.display = "none";
        currentLi.lastChild.previousElementSibling.style.display = "none";
        currentLi.appendChild(updateBtn);

        const cancelBtn = document.createElement('a');
        cancelBtn.className = 'btn-floating btn-small waves-effect waves-light cancel-btn';
        cancelBtn.innerHTML = '<i class="material-icons">remove</i>';
        //currentLi.replaceChild(cancelBtn, currentDeleteA);
        currentLi.appendChild(cancelBtn);
    }

    // STORE the original text in a variable
    const originalText = (((e.target.parentElement.previousElementSibling.classList.contains('task-text')) && (e.target.parentElement.previousElementSibling.contentEditable === "true")) || (e.target.parentElement.classList.contains('cancel-btn'))) ? e.target.parentElement.previousElementSibling.textContent : '';


    // UNDO changes when the "CANCEL button" is clicked
    if (e.target.parentElement.classList.contains('cancel-btn')) {
        createTaskListItem(originalText);

    }

    // if (e.target.parentElement.classList.contains('edit-item')) {
    //     e.target.parentElement.previousElementSibling.focus();

    // }
    // disable all clicking except currentsave, currentcancel, currenttask-text until currentsave or currentcancel has been clicked


    //let originalText = e.target.textContent;
    console.log(originalText);
    // if ((e.target.classList.contains('task-text')) && (e.target.contentEditable === "true")) {


    // }

    // REMOVE list item when "delete" icon is clicked
    if (e.target.parentElement.classList.contains('delete-item')) {
        if (confirm('Are you sure you want to delete this task?')) {
            e.target.parentElement.parentElement.remove();

            // Remove from Local Storage
            removeTaskFromLocalStorage(e.target.parentElement.parentElement.firstElementChild.nextElementSibling);
        }
        // } else if (e.target.parentElement.classList.contains('edit-item')) {
        //     const currentText = e.target.parentElement.previousElementSibling;
        //     currentText.contentEditable = true;
        //     const currentLi = e.target.parentElement.parentElement;
        //     const currentEditA = e.target.parentElement;
        //     const currentDeleteA = e.target.parentElement.nextElementSibling;

        //     currentText.addEventListener('click', function(e) {
        //         const updateBtn = document.createElement('a');
        //         updateBtn.className = 'btn-floating btn-small waves-effect waves-light  update-btn';
        //         updateBtn.innerHTML = '<i class="material-icons">add</i>';
        //         currentLi.replaceChild(updateBtn, currentEditA);

        //         const cancelBtn = document.createElement('a');
        //         cancelBtn.className = 'btn-floating btn-small waves-effect waves-light cancel-btn';
        //         cancelBtn.innerHTML = '<i class="material-icons">remove</i>';
        //         currentLi.replaceChild(cancelBtn, currentDeleteA);
        //     });
        // change icons to "save" and "cancel"
    } else if ((e.target.classList.contains('completed')) && (e.target.checked === true)) {
        // Add checked to item in Local Storage
    } else if (e.target.classList.contains('save')) {
        // replace old text with new text in UI and in Local Storage
    } else if (e.target.classList.contains('cancel')) {
        // keep old text in UI and in Local Storage
    }
}


function createTaskListItem(textSource) {
    // CREATE li element, label element, span element, input:checkbox element, and Append to li
    const li = document.createElement('li');
    li.className = 'collection-item';

    const label = document.createElement('label');
    label.className = 'checkbox-wrapper';

    const span = document.createElement('span');
    span.className = 'checkbox-helper';

    const inputCheck = document.createElement('input');
    inputCheck.type = 'checkbox';
    inputCheck.className = 'completed filled-in';

    label.appendChild(inputCheck);
    label.appendChild(span);
    li.appendChild(label);

    // CREATE text node in a paragraph element with text content and append to label
    const para = document.createElement('p');
    para.className = 'task-text';
    para.appendChild(document.createTextNode(textSource));
    li.appendChild(para);

    // CREATE  "edit" link element
    const editLink = document.createElement('a');
    editLink.className = 'edit-item';
    editLink.innerHTML = '<i class="small material-icons">edit</i>';
    li.appendChild(editLink);

    // CREATE "delete" link element
    const link = document.createElement('a');
    link.className = 'delete-item';
    link.innerHTML = '<i class="small material-icons">delete</i>';
    li.appendChild(link);

    // APPEND the li to ul
    taskList.appendChild(li);


}




// GET task from Local Storage(function) and CREATE task in the UI(called)
function getTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task) {
        createTaskListItem(task);
    });
}

// VALIDATE entry, CREATE task in the UI(called) and STORE task in Local Storage(called)
function addTask(e) {
    if (taskInput.value === '') {
        alert('Add a task, please.');
    } else {
        createTaskListItem(taskInput.value);
        // Store in Local Storage
        storeTaskInLocalStorage(taskInput.value);
        // Clear input field
        taskInput.value = '';
    }
    e.preventDefault();
}
// STORE task to Local Storage(function)
function storeTaskInLocalStorage(task) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


// REMOVE task from Local Storage(function)
function removeTaskFromLocalStorage(taskItem) {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task, index) {
        if (taskItem.textContent === task) {
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// CLEAR all tasks from UI(function) and Local Storage(function & call)
function clearTasks() {
    // taskList.innerHTML = '';

    // Or this is faster
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    // Clear from Local Storage
    clearTasksFromLocalStorage();

    // Clear Tasks from Local Storage
    function clearTasksFromLocalStorage() {
        localStorage.clear();
    }

    // https://jsperf.com/innerhtml-vs-removechild
}

// FILTER tasks(function)
function filterTasks(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll('.collection-item').forEach(function(task) {
        const item = task.firstChild.nextElementSibling.textContent;
        if (item.toLowerCase().indexOf(text) != -1) {
            task.style.display = 'grid';
        } else {
            task.style.display = 'none';
        }
    });
}





/*



*/