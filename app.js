// Define UI Vars
const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#task');
const editItem = document.querySelector('.edit-item');
const completed = document.querySelector('.completed');

// Load all event listeners
loadEventListeners();

// Load all event listeners
function loadEventListeners() {
    // DOM load event
    document.addEventListener('DOMContentLoaded', getTasks);
    // Add task event
    form.addEventListener('submit', addTask);
    // Remove task event    removeTask
    taskList.addEventListener('click', taskItemClicked);
    // Clear task event  
    clearBtn.addEventListener('click', clearTasks);
    // Filter task event
    filter.addEventListener('keyup', filterTasks);
    // Edit task event
    // editItem.addEventListener('click', editTask);
}


function taskItemClicked(e) {
    // const target = e.target;
    //delete --- edit-- - completed
    // console.log(e);

    if (e.target.parentElement.classList.contains('delete-item')) {
        if (confirm('Are you sure you want to delete this task?')) {
            e.target.parentElement.parentElement.remove();

            // Remove from Local Storage
            removeTaskFromLocalStorage(e.target.parentElement.parentElement.firstElementChild.nextElementSibling);
        }
    } else if (e.target.parentElement.classList.contains('edit-item')) {

        const currentText = e.target.parentElement.previousElementSibling;
        currentText.contentEditable = true;
        const currentLi = e.target.parentElement.parentElement;
        const currentEditA = e.target.parentElement;
        const currentDeleteA = e.target.parentElement.nextElementSibling;
        console.log(currentText);
        currentText.addEventListener('click', function(e) {
            const updateBtn = document.createElement('a');
            updateBtn.className = 'waves-effect waves-light btn update-btn';
            updateBtn.textContent = 'UPDATE';
            console.log(updateBtn);
            currentLi.replaceChild(updateBtn, currentEditA);
        });
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
    // Create li element
    const li = document.createElement('li');
    li.className = 'collection-item';

    const label = document.createElement('label');
    label.className = 'checkbox-wrapper';

    const span = document.createElement('span');
    span.className = 'checkbox-helper';

    // Create new check box element and append to li
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.className = 'completed filled-in';

    label.appendChild(checkBox);
    label.appendChild(span);
    li.appendChild(label);

    // Create text node in a span element and append to label
    const para = document.createElement('p');
    para.className = 'task-text';
    para.appendChild(document.createTextNode(textSource));
    li.appendChild(para);

    // Create new edit link element
    const editLink = document.createElement('a');
    editLink.className = 'edit-item';
    editLink.innerHTML = '<i class="small material-icons">edit</i>';
    li.appendChild(editLink);

    // Create new link element
    const link = document.createElement('a');
    link.className = 'delete-item';
    link.innerHTML = '<i class="small material-icons">delete</i>';
    li.appendChild(link);

    // Append the li to ul
    taskList.appendChild(li);


}




// Get Task from Local Storage
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

//Add Task
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

//Edit Task
function editTask() {
    // let li = e.target.parentElement;
    //console.log(editItem);

    //  .contentEditable = true;
    const completed = document.querySelector('.completed');
    completed.setAttribute("checked", "checked");

    // e.preventDefault();
}

// Store Task
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

// Remove Task
function removeTask(e) {
    if (e.target.parentElement.classList.contains('delete-item')) {
        if (confirm('Are you sure you want to delete this task?')) {
            e.target.parentElement.parentElement.remove();

            // Remove from Local Storage
            removeTaskFromLocalStorage(e.target.parentElement.parentElement.firstElementChild.firstElementChild.nextElementSibling);
        }
    }
}

// Remove from localStorage
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

// Clear All Tasks
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

// Filter Tasks
function filterTasks(e) {
    const text = e.target.value.toLowerCase();

    document.querySelectorAll('.collection-item').forEach(function(task) {
        const item = task.firstChild.textContent;
        if (item.toLowerCase().indexOf(text) != -1) {
            task.style.display = 'block';
        } else {
            task.style.display = 'none';
        }
    });
}





/*
when item is checked add the attribute [checked="checked"]
if (document.querySelector('.completed').checked) {
    alert('checked - checked');
} else {
    alert('NOT CHECKED');
}



const myList = document.getElementById("myList");

myList.addEventListener("click", function (e) {
    const target = e.target;

    if(target.matches("li")) {
        target.style.backgroundColor = "red";
    }
})


if (e.target.parentElement.classList.contains('delete-item')) {
        if (confirm('Are you sure you want to delete this task?')) {
            e.target.parentElement.parentElement.remove();

            // Remove from Local Storage
            removeTaskFromLocalStorage(e.target.parentElement.parentElement.firstElementChild.firstElementChild.nextElementSibling);
        }
    } else if (e.target.parentElement.classList.contains('edit-item')) {
        e.target.parentElement.previousElementSibling.lastElementChild.contentEditable = true;
        // change icons to "save" and "cancel"
    } else if (e.target.classList.contains('completed') && e.target.checked === true ) {
        // Add checked to item in Local Storage
    } else if (e.target.classList.contains('save') {
        // replace old text with new text in UI and in Local Storage
    } else if (e.target.classList.contains('cancel') {
        // keep old text in UI and in Local Storage
    }


function taskItemClicked (e) {
    const target = e.target;
    delete --- edit --- completed

}







*/