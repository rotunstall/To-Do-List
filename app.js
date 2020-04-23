// DEFINE UI Vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');
const addTaskBtn = document.querySelector('.addTask-btn');


// LOAD all event listeners
loadEventListeners();

// LOAD all event listeners
function loadEventListeners() {
    // DOM load event
    document.addEventListener('DOMContentLoaded', getTasks);
    form.addEventListener('submit', addTask);
    clearBtn.addEventListener('click', clearTasks);
    filter.addEventListener('keyup', filterTasks);
}

let origTextEdit;
let origTextUpdate;
let currentLiIcons;
let currentLiUpdate;



// -------------------------------------------------------------
// -------------------------------------------------------------
function disableAllExceptLi() {
    taskInput.disabled = true;
    addTaskBtn.disabled = true;
    filter.disabled = true;
    clearBtn.classList.add('disabled');
}


function undisableAllExceptLi() {
    taskInput.disabled = false;
    addTaskBtn.disabled = false;
    filter.disabled = false;
    clearBtn.classList.remove('disabled');
}


// VALIDATE entry, CREATE task in the UI(called) and STORE task in Local Storage(called)
function addTask(e) {
    if (taskInput.value === '') {
        alert('Add a task, please.');
    } else {
        let addOn = "addOn";
        createTaskListItem(false, taskInput.value, addOn);

        // Clear input field
        taskInput.value = '';
    }
    e.preventDefault();
}


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


function createTaskListItem(checkboxStatus, textSource, placementMethod, origLiLocation) {

    const newLi = document.createElement('li');
    newLi.className = 'collection-item';

    const label = document.createElement('label');
    label.className = 'checkbox-wrapper';

    const span = document.createElement('span');
    span.className = 'checkbox-helper';

    const inputCheck = document.createElement('input');
    inputCheck.type = 'checkbox';
    inputCheck.className = 'completed filled-in';
    inputCheck.checked = checkboxStatus;
    inputCheck.onclick = checkBoxAction;

    label.appendChild(inputCheck);
    label.appendChild(span);
    newLi.appendChild(label);

    const para = document.createElement('p');
    para.className = 'task-text';
    para.appendChild(document.createTextNode(textSource));
    newLi.appendChild(para);


    const editLink = document.createElement('a');
    editLink.className = 'edit-item';
    editLink.innerHTML = '<i class="small material-icons">edit</i>';
    editLink.onclick = editLinkAction;

    newLi.appendChild(editLink);


    const deleteLink = document.createElement('a');
    deleteLink.className = 'delete-item';
    deleteLink.innerHTML = '<i class="small material-icons">delete</i>';
    deleteLink.onclick = deleteLinkAction;
    newLi.appendChild(deleteLink);

    // APPEND the li in the ul
    if (placementMethod === 'addOn') {
        taskList.appendChild(newLi)
    } else {
        //replaceCurrentListItem
        origLiLocation.parentElement.replaceChild(newLi, origLiLocation)
    }


    let updatedLiArr = [...taskList.children];
    updatedLiArr = createArrObjFromUi(updatedLiArr);
    storeTaskInLocalStorage(updatedLiArr);
}


function createArrObjFromUi(newLiArr) {

    let newArrObj = [];

    newLiArr.forEach(function(newTask, index) {
        checkedResult = newTask.firstElementChild.firstElementChild.checked;
        newTask = newTask.firstElementChild.nextElementSibling.textContent;
        let taskObj = {};
        taskObj.id = index;
        taskObj.text = newTask;
        taskObj.checked = checkedResult;
        newArrObj.push(taskObj);
    })
    return newArrObj;
}


function getTasks() {
    let tasks;

    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));

        let addOn = 'addOn';
        tasks.forEach(function(task) {
            checked = task.checked;
            text = task.text;
            createTaskListItem(checked, text, addOn);
        });
    }
}


function storeTaskInLocalStorage(newLSArrOfObjects) {
    localStorage.setItem('tasks', JSON.stringify(newLSArrOfObjects));
}


// UPDATE checkBox status
function checkBoxAction(e) {
    if (e.target.checked === true) {
        e.target.parentElement.nextElementSibling.classList.add("line-through");
    }
    // UPDATE in Local Storage
    let updatedLiArr = [...taskList.children];
    updatedLiArr = createArrObjFromUi(updatedLiArr);
    storeTaskInLocalStorage(updatedLiArr);
}


function editLinkAction(e) {

    origTextEdit = e.target.parentElement.previousElementSibling.textContent;
    currentLiIcons = e.target.parentElement.parentElement;

    const currentTaskElem = e.target.parentElement.previousElementSibling;
    currentTaskElem.contentEditable = true;
    e.target.parentElement.previousElementSibling.focus();


    const currentLi = e.target.parentElement.parentElement;
    currentLi.classList.add("active-li");


    let updatedLiArr = [...taskList.children];
    console.log(updatedLiArr.length);

    for (let i = 0; i < updatedLiArr.length; i++) {
        if (updatedLiArr[i].classList.contains('active-li')) { continue; }
        let completed = updatedLiArr[i].querySelector('.completed');
        let editItem = updatedLiArr[i].querySelector('.edit-item');
        let deleteItem = updatedLiArr[i].querySelector('.delete-item');
        completed.disabled = true;
        editItem.style.display = "none";
        deleteItem.style.display = "none";
    }
    updatedLiArr = createArrObjFromUi(updatedLiArr);

    // CHANGE the "EDIT" and "DELETE" buttons to "SAVE" and "CANCEL" buttons respectively
    const updateBtn = document.createElement('a');
    updateBtn.className = 'btn-floating btn-small waves-effect waves-light  update-btn';
    updateBtn.innerHTML = '<i class="material-icons">add</i>';
    updateBtn.onclick = updateBtnAction;
    const cancelBtn = document.createElement('a');
    cancelBtn.className = 'btn-floating btn-small waves-effect waves-light cancel-btn';
    cancelBtn.innerHTML = '<i class="material-icons">remove</i>';
    cancelBtn.onclick = cancelBtnAction;

    // HIDE "EDIT" and "DELETE" buttons
    currentLi.lastChild.previousElementSibling.style.display = "none";
    currentLi.lastChild.style.display = "none";

    // ADD "UPDATE" and "CANCEL" buttons to UI
    currentLi.appendChild(updateBtn);
    currentLi.appendChild(cancelBtn);

    disableAllExceptLi();

    e.preventDefault();
}


function deleteLinkAction(e) {
    if (confirm('Are you sure you want to delete this task?')) {

        e.target.parentElement.parentElement.remove();

        let updatedLiArr = [...taskList.children];
        storeTaskInLocalStorage(createArrObjFromUi(updatedLiArr));
    }
    e.preventDefault();
}


function updateBtnAction(e) {

    origTextUpdate = e.target.parentElement.parentElement.firstElementChild.nextElementSibling.textContent;
    currentLiUpdate = e.target.parentElement.parentElement;

    // MAKE task-text not editable, not focused remove inline style attribute from "Edit"and "Delete" buttons immediately after clicking "UPDATE" button
    const currentTaskElem = e.target.parentElement.parentElement.firstElementChild.nextElementSibling;
    currentTaskElem.contentEditable = false;
    currentTaskElem.blur();
    e.target.parentElement.previousElementSibling.removeAttribute('style');
    e.target.parentElement.previousElementSibling.previousElementSibling.removeAttribute('style');

    let updatedLiArr = [...taskList.children];
    storeTaskInLocalStorage(createArrObjFromUi(updatedLiArr));

    undisableAllExceptLi();

    // UNDISABLE non-active li(s)
    for (let i = 0; i < updatedLiArr.length; i++) {
        if (updatedLiArr[i].classList.contains('active-li')) { continue; }
        let completed = updatedLiArr[i].querySelector('.completed');
        let editItem = updatedLiArr[i].querySelector('.edit-item');
        let deleteItem = updatedLiArr[i].querySelector('.delete-item');
        completed.disabled = false;
        editItem.removeAttribute('style');
        deleteItem.removeAttribute('style');
    }

    const currentLi = e.target.parentElement.parentElement;
    currentLi.classList.remove("active-li");

    // REMOVE "UPDATE" and "CANCEL" buttons from UI
    e.target.parentElement.nextElementSibling.remove();
    e.target.parentElement.remove();

    e.preventDefault();
}


function cancelBtnAction(e) {

    let updatedLiArr = [...taskList.children];
    let taskObj;
    let activeLiPara = document.querySelector('.active-li').firstElementChild.nextElementSibling;
    let tasks;
    let origText;
    // GET the index of the li in the UI that is to be canceled
    updatedLiArr.forEach(function(newTask, index) {
            if (newTask.classList.contains('active-li')) {
                taskObj = index;
            }
        })
        // GET the id of the corresponding object in LocalStorage and replace the text
    tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks.forEach(function(origTask) {
        if (origTask.id === taskObj) {
            origText = origTask.text;
        }
    })
    activeLiPara.textContent = origText;

    activeLiPara.contentEditable = false;
    activeLiPara.blur();
    e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.removeAttribute('style');
    e.target.parentElement.previousElementSibling.previousElementSibling.removeAttribute('style');

    undisableAllExceptLi();
    // UNDISABLE non-active li(s)
    for (let i = 0; i < updatedLiArr.length; i++) {
        if (updatedLiArr[i].classList.contains('active-li')) { continue; }
        console.log(updatedLiArr[i]);
        let completed = updatedLiArr[i].querySelector('.completed');
        let editItem = updatedLiArr[i].querySelector('.edit-item');
        let deleteItem = updatedLiArr[i].querySelector('.delete-item');
        completed.disabled = false;
        editItem.removeAttribute('style');
        deleteItem.removeAttribute('style');
    }

    const currentLi = e.target.parentElement.parentElement;
    currentLi.classList.remove("active-li");

    // REMOVE "UPDATE" and "CANCEL" buttons from UI
    e.target.parentElement.previousElementSibling.remove();
    e.target.parentElement.remove();
}


function clearTasks() {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
    clearTasksFromLocalStorage();

    function clearTasksFromLocalStorage() {
        localStorage.clear();
    }
}


/* SUDO CODE
When checkBox is check for completed --- text color red and strikethrough


*/