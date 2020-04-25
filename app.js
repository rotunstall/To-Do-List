// DEFINE UI Vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');
const addTaskBtn = document.querySelector('.addTask-btn');
const completedSorter = document.querySelector('.completed-sorter');
const incompletedSorter = document.querySelector('.incompleted-sorter');

// LOAD all event listeners
loadEventListeners();

// LOAD all event listeners
function loadEventListeners() {
    // DOM load event
    document.addEventListener('DOMContentLoaded', getTasks);
    form.addEventListener('submit', addTask);
    clearBtn.addEventListener('click', clearTasks);
    filter.addEventListener('keyup', filterTasks);
    completedSorter.addEventListener('click', filterCompletedTasks);
    incompletedSorter.addEventListener('click', filterIncompletedTasks);
}

let taskArr;
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
        let taskObj = {};
        taskObj.id = Date.now() + ((Math.random() * 100000).toFixed());
        taskObj.text = taskInput.value;
        taskObj.checked = false;
        taskArr.push(taskObj);

        createTaskListItem(taskObj.id, taskObj.checked, taskObj.text);
        createLsTaskArr(taskArr);

        // Clear input field
        taskInput.value = '';
    }

    e.preventDefault();
}


function createLsTaskArr(latestTaskArr) {
    let lsArrObj = [];

    latestTaskArr.forEach(function(task) {
        let taskObjLs = {};
        taskObjLs.id = task.id;
        taskObjLs.text = task.text;
        taskObjLs.checked = task.checked;
        lsArrObj.push(taskObjLs);
    })
    storeTaskInLocalStorage(lsArrObj);
}


function getTasks() {
    let tasks;

    if (localStorage.getItem('tasks') === null) {
        tasks = [];
        taskArr = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        taskArr = tasks;
        tasks.forEach(function(task) {
            id = task.id;
            checked = task.checked;
            text = task.text;

            //(idNumber, checkboxStatus, textSource)
            createTaskListItem(id, checked, text);
        });
    }
}


function updateTaskArr(currentTargetId, isLsUpdatedToo) {
    taskArr.forEach(function(origTask) {
        if (origTask.id === currentTargetId) {
            let updatedLiArr = [...taskList.children];
            updatedLiArr.forEach(function(updatedTask) {
                let updatedLiId = updatedTask.getAttribute('data-id-number');
                if (updatedLiId === currentTargetId) {
                    origTask.text = updatedTask.firstElementChild.nextElementSibling.textContent;
                    origTask.checked = updatedTask.firstElementChild.firstElementChild.checked;
                    if (isLsUpdatedToo === true) {
                        //updateLsArr(currentTargetId);
                        origLsTasks = JSON.parse(localStorage.getItem('tasks'));
                        origLsTasks.forEach(function(origLsTask) {
                            if (origLsTask.id === currentTargetId) {
                                origLsTask.text = origTask.text;
                                origLsTask.checked = origTask.checked;
                            }

                            storeTaskInLocalStorage(origLsTasks);
                        });
                    }
                }
            });
        };
    });
}


function storeTaskInLocalStorage(newLSArrOfObjects) {
    localStorage.setItem('tasks', JSON.stringify(newLSArrOfObjects));
}


function createTaskListItem(idNumber, checkboxStatus, textSource) {

    const newLi = document.createElement('li');
    newLi.className = 'collection-item';
    newLi.setAttribute("data-id-number", idNumber)


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
    taskList.appendChild(newLi);

    if (checkboxStatus === true) {
        para.classList.add("line-through");
    }
}


// UPDATE checkBox status
function checkBoxAction(e) {
    if (e.target.checked === true) {
        e.target.parentElement.nextElementSibling.classList.add("line-through");
    } else {
        e.target.parentElement.nextElementSibling.classList.remove("line-through");
    }

    let currentid = e.target.parentElement.parentElement.getAttribute('data-id-number');
    updateTaskArr(currentid, true);
}


function editLinkAction(e) {

    origTextEdit = e.target.parentElement.previousElementSibling.textContent;
    currentLiIcons = e.target.parentElement.parentElement;

    const currentTaskElem = e.target.parentElement.previousElementSibling;
    currentTaskElem.contentEditable = true;
    e.target.parentElement.previousElementSibling.focus();

    const currentLi = e.target.parentElement.parentElement;
    currentLi.classList.add("active-li");

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

    let updatedLiArr = [...taskList.children];

    for (let i = 0; i < updatedLiArr.length; i++) {
        if (updatedLiArr[i].classList.contains('active-li')) { continue; }
        let completed = updatedLiArr[i].querySelector('.completed');
        let editItem = updatedLiArr[i].querySelector('.edit-item');
        let deleteItem = updatedLiArr[i].querySelector('.delete-item');
        completed.disabled = true;
        editItem.style.display = "none";
        deleteItem.style.display = "none";
    }

    disableAllExceptLi();

    e.preventDefault();
}


function deleteLinkAction(e) {
    if (confirm('Are you sure you want to delete this task?')) {

        let currentid = e.target.parentElement.parentElement.getAttribute('data-id-number');
        // DELETE from Task Array
        taskArr.forEach(function(origTask) {
            if (origTask.id === currentid) {
                taskArr = taskArr.filter(li => li.id != currentid);
            }
            // DELETE from UI
            e.target.parentElement.parentElement.remove();
        });
        // DELETE from Local Storage Array
        origLsTasks = JSON.parse(localStorage.getItem('tasks'));
        origLsTasks.forEach(function(origLsTask) {
            if (origLsTask.id === currentid) {
                origLsTasks = origLsTasks.filter(li => li.id != currentid);
            }
        });
    }
    storeTaskInLocalStorage(origLsTasks);
    e.preventDefault();
}


function updateBtnAction(e) {

    // origTextUpdate = e.target.parentElement.parentElement.firstElementChild.nextElementSibling.textContent;
    currentLiUpdate = e.target.parentElement.parentElement;

    // MAKE task-text not editable, not focused remove inline style attribute from "Edit"and "Delete" buttons immediately after clicking "UPDATE" button
    const currentTaskElem = e.target.parentElement.parentElement.firstElementChild.nextElementSibling;
    currentTaskElem.contentEditable = false;
    currentTaskElem.blur();
    e.target.parentElement.previousElementSibling.removeAttribute('style');
    e.target.parentElement.previousElementSibling.previousElementSibling.removeAttribute('style');

    let updatedLiArr = [...taskList.children];
    // storeTaskInLocalStorage(createArrObjFromUi(updatedLiArr));

    let currentid = e.target.parentElement.parentElement.getAttribute('data-id-number');
    updateTaskArr(currentid, true);

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
    let activeLiPara = document.querySelector('.active-li').firstElementChild.nextElementSibling;
    let currentid = e.target.parentElement.parentElement.getAttribute('data-id-number');
    let tasks = JSON.parse(localStorage.getItem('tasks'));

    tasks.forEach(function(task) {
        if (task.id === currentid) {
            activeLiPara.textContent = task.text;
        }
    });

    activeLiPara.contentEditable = false;
    activeLiPara.blur();
    e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.removeAttribute('style');
    e.target.parentElement.previousElementSibling.previousElementSibling.removeAttribute('style');

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
    e.target.parentElement.previousElementSibling.remove();
    e.target.parentElement.remove();

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


function clearTasks() {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }
    taskArr = [];
    clearTasksFromLocalStorage();

    function clearTasksFromLocalStorage() {
        localStorage.clear();
    }
}


function filterCompletedTasks(e) {
    let checkBoxStatus = e.target.checked;
    let currentLis = document.querySelectorAll('.collection-item')
    let otherSorter = e.target.parentElement.nextElementSibling.firstElementChild;
    if (checkBoxStatus) {
        otherSorter.disabled = true;
    }
    currentLis.forEach(function(task) {
        if (checkBoxStatus) {
            const checkedResult = task.firstElementChild.firstElementChild.checked;
            if (checkedResult === true) {
                task.style.display = 'grid';
            } else {
                task.style.display = 'none';
            }
        } else {
            task.style.display = 'grid';
            otherSorter.disabled = false;
        }
    });
}

function filterIncompletedTasks(e) {
    let checkBoxStatus = e.target.checked;
    let currentLis = document.querySelectorAll('.collection-item')
    let otherSorter = e.target.parentElement.previousElementSibling.firstElementChild;
    if (checkBoxStatus) {
        otherSorter.disabled = true;
    }
    currentLis.forEach(function(task) {
        if (checkBoxStatus) {
            const checkedResult = task.firstElementChild.firstElementChild.checked;
            if (checkedResult === true) {
                task.style.display = 'none';
            } else {
                task.style.display = 'grid';
            }
        } else {
            task.style.display = 'grid';
            otherSorter.disabled = false;
        }
    });
}


/* SUDO CODE

which is better to use:
    let updatedLiArr = [...taskList.children];
        or
    let currentLis = document.querySelectorAll('.collection-item')



*/