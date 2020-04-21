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

let origTextEdit;
let origTextCheck;
let origTextUpdate;

let currentLiIcons;
let currentLiUpdate;
let currentLiPara;
let currentLiCheck;


function whenTaskItemLiIsClicked(e) {
    // ASSIGN value to needed variables
    (function() {

        if (e.target.parentElement.classList.contains('edit-item')) {
            return (origTextEdit = e.target.parentElement.previousElementSibling.textContent);
        }

        if (e.target.parentElement.classList.contains('update-btn')) {
            return (origTextUpdate = e.target.parentElement.parentElement.firstElementChild.nextElementSibling.textContent);
        }

        if (e.target.classList.contains('completed')) {
            return (origTextCheck = e.target.parentElement.nextElementSibling.textContent);
        }
    })();

    // ASSIGN value to needed variables
    (function() {

        if (e.target.parentElement.classList.contains('edit-item')) {
            return (currentLiIcons = e.target.parentElement.parentElement);
        }

        if (e.target.parentElement.classList.contains('update-btn')) {
            return (currentLiUpdate = e.target.parentElement.parentElement);

        }

        if (e.target.classList.contains('task-text')) {
            return (currentLiPara = e.target.parentElement);
        }

        if (e.target.parentElement.classList.contains('completed')) {
            return (currentLiCheck = e.target.parentElement.parentElement);
        }
    })();


    if (e.target.parentElement.classList.contains('edit-item')) {
        // MAKE task-text editable and focused immediately after clicking "EDIT" button
        const currentTaskElem = e.target.parentElement.previousElementSibling;
        currentTaskElem.contentEditable = true;
        e.target.parentElement.previousElementSibling.focus();

        // CHANGE the "EDIT" and "DELETE" buttons to "SAVE" and "CANCEL" buttons respectively
        const currentLi = e.target.parentElement.parentElement;

        // CREATE "UPDATE" and "CANCEL" buttons
        const updateBtn = document.createElement('a');
        updateBtn.className = 'btn-floating btn-small waves-effect waves-light  update-btn';
        updateBtn.innerHTML = '<i class="material-icons">add</i>';
        const cancelBtn = document.createElement('a');
        cancelBtn.className = 'btn-floating btn-small waves-effect waves-light cancel-btn';
        cancelBtn.innerHTML = '<i class="material-icons">remove</i>';

        // HIDE "EDIT" and "DELETE" buttons
        currentLi.lastChild.previousElementSibling.style.display = "none";
        currentLi.lastChild.style.display = "none";

        // ADD "UPDATE" and "CANCEL" buttons to UI
        currentLi.appendChild(updateBtn);
        currentLi.appendChild(cancelBtn);

    } else if (e.target.parentElement.classList.contains('cancel-btn')) {
        // UNDO changes when the "CANCEL button" is clicked
        let replaceLi = 'replaceLi';
        createTaskListItem(origTextEdit, replaceLi, currentLiIcons);

    } else if (e.target.parentElement.classList.contains('update-btn')) {
        // MAKE task-text not editable, not focused remove inline style attribute from "Edit"and "Delete" buttons immediately after clicking "UPDATE" button

        const currentTaskElem = e.target.parentElement.parentElement.firstElementChild.nextElementSibling;
        currentTaskElem.contentEditable = false;
        currentTaskElem.blur();
        e.target.parentElement.previousElementSibling.removeAttribute('style');
        e.target.parentElement.previousElementSibling.previousElementSibling.removeAttribute('style');

        // UPDATE Local Storage after clicking "UPDATE" button
        let newLiArr = [...taskList.children];
        let newLocalStorageArr = [];
        for (let i = 0; i < newLiArr.length; i++) {
            let newerTask = newLiArr[i].firstElementChild.nextElementSibling.textContent;
            newLocalStorageArr.push(newerTask);
        }
        localStorage.setItem('tasks', JSON.stringify(newLocalStorageArr));


        // REMOVE "UPDATE" and "CANCEL" buttons from UI
        // DO THIS LAST!!!!!! after clicking on "UPDATE" button
        e.target.parentElement.nextElementSibling.remove();
        e.target.parentElement.remove();
    }

    // -------------------------------------------------------------
    // -------------------------------------------------------------

    // disable all clicking except currentsave, currentcancel, currenttask-text until currentsave or currentcancel has been clicked

    // Add checked to item in Local Storage

    // -------------------------------------------------------------
    // -------------------------------------------------------------

    // REMOVE list item when "delete" icon is clicked
    if (e.target.parentElement.classList.contains('delete-item')) {
        if (confirm('Are you sure you want to delete this task?')) {
            e.target.parentElement.parentElement.remove();

            // Remove from Local Storage
            removeTaskFromLocalStorage(e.target.parentElement.parentElement.firstElementChild.nextElementSibling);
        }
    }
}




function createTaskListItem(textSource, placementMethod, origLiLocation) {
    // CREATE li element, label element, span element, input:checkbox element, and Append to li
    const newLi = document.createElement('li');
    newLi.className = 'collection-item';

    const label = document.createElement('label');
    label.className = 'checkbox-wrapper';

    const span = document.createElement('span');
    span.className = 'checkbox-helper';

    const inputCheck = document.createElement('input');
    inputCheck.type = 'checkbox';
    inputCheck.className = 'completed filled-in';

    label.appendChild(inputCheck);
    label.appendChild(span);
    newLi.appendChild(label);

    // CREATE text node in a paragraph element with text content and append to label
    const para = document.createElement('p');
    para.className = 'task-text';
    para.appendChild(document.createTextNode(textSource));
    newLi.appendChild(para);

    // CREATE  "edit" link element
    const editLink = document.createElement('a');
    editLink.className = 'edit-item';
    editLink.innerHTML = '<i class="small material-icons">edit</i>';
    newLi.appendChild(editLink);

    // CREATE "delete" link element
    const link = document.createElement('a');
    link.className = 'delete-item';
    link.innerHTML = '<i class="small material-icons">delete</i>';
    newLi.appendChild(link);

    // APPEND the li in the ul
    if (placementMethod === 'addOn') {
        taskList.appendChild(newLi)
    } else {
        //replaceCurrentListItem
        origLiLocation.parentElement.replaceChild(newLi, origLiLocation)
    }
}


// GET task from Local Storage(function) and CREATE task in the UI(called)
function getTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    let addOn = 'addOn';
    tasks.forEach(function(task) {
        createTaskListItem(task, addOn);
    });
}

// VALIDATE entry, CREATE task in the UI(called) and STORE task in Local Storage(called)
function addTask(e) {
    if (taskInput.value === '') {
        alert('Add a task, please.');
    } else {
        let addOn = "addOn";
        createTaskListItem(taskInput.value, addOn);
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



// https://jsperf.com/innerhtml-vs-removechild
/* SUDO CODE




*/