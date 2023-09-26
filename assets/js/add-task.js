let collectedContact = [];
let taskContactList = [];
let contactPosition;
let initials = [];
let selectedCategory;
let prio;
let subtasks = [];
let subtaskStatus = [];
let contacts = [];
let categories = [];
let category = [];
let tasks = [];
let task = {
    "title": "",
    "description": "",
    "category": "",
    "assigned_to": [],
    "due_date": "",
    "prio": "",
    "subtasks": {
        "name": [],
        "status": []
    },
    "progress": "todo"
};
let newCategory;
let colorForNewCategory;
let colorForNewCategoryID;
let required = '';
let initialsRenderd = false;


/**
 * This function starts all important functions at onload.
 */
async function initTask() {
    await init();
    tasks = database.tasks;
    contacts = database.contacts;
    categories = database.categories;
    renderCategorys();
    renderContacts();
    datePicker();
    renderloggedInUserinContactList();
    startEventListener();
}


/**
 * This function renders the actual user in 'Assigned to'.
 */
function renderloggedInUserinContactList() {
    document.getElementById('loggedInUserAddTask').innerHTML = `
    <div class="dd-placeholder gray-hover" onclick="selectedForTask(contacts[${searchContactwithEmail()}], 'contacts[${searchContactwithEmail()}]')">
        <div>You</div>
        <div class="task-select-box center">
            <div id="contacts[${searchContactwithEmail()}]"></div>
        </div>
    </div>
`
}


/**
 * This function searches for a user with the email address.
 * @returns - Index number
 */
function searchContactwithEmail() {
    for (let i = 0; i < database.contacts.length; i++) {
        let contact = database.contacts[i];
        if (currentEmail == contact.email) {
            return contacts.indexOf(contact);
        }
    }
}


/**
 * This function renders the list of categories.
 */
function renderCategorys() {
    categoryContainer = document.getElementById('loadedCategorys');
    categoryContainer.innerHTML = '';
    for (let i = 0; i < categories.length; i++) {
        let category = categories[i].name;
        let categoryColor = categories[i].color;
        categoryContainer.innerHTML += `
        <div class="dd-placeholder gray-hover" onclick="selectCategory('${category}', '${categoryColor}')">
            <div class="center">
                <div class="padding-17-right">${category}</div>
                <div class="task-category-color" style="background-color: ${categoryColor}"></div>
            </div>
        </div>`;
    }
}


/**
 * This function renders the list of contacts.
 */
function renderContacts() {
    contactContainer = document.getElementById('loadedContacts');
    contactContainer.innerHTML = '';
    for (let i = 0; i < contacts.length;) {
        if (contacts[i].email == currentEmail) {
            i++
        } else {
            contactContainer.innerHTML += `
            <div class="dd-placeholder gray-hover" onclick="selectedForTask(contacts[${i}], 'contacts[${i}]')">
                <div>${contacts[i].firstname} ${contacts[i].lastname}</div>
                <div class="task-select-box center">
                    <div id="contacts[${i}]"></div>
                </div>
            </div>`;
            i++
        }
    }
}


/**
 * In this function, the selected category is rendered using the 2 strings and the drop down menu is closed.
 * @param {string} category - Category that was selected.
 * @param {string} categoryColor - Category color in rgb.
 */
function selectCategory(category, categoryColor) {
    document.getElementById('chosenCategory').innerHTML = `
            <div class="center">
                <div class="padding-17-right">${category}</div>
                <div class="task-category-color" style="background-color: ${categoryColor};"></div>
            </div>`
    selectedCategory = category;
    let classStatus = document.getElementById('category').classList
    if (classStatus.contains('dropdown-category-open')) {
        pullDownMenu('category', 'assingedTo', 'moreCategorys', 'moreContacts');
    }
}


/**
 * In this function contacts are pushed into an array.
 * If the contact was already selected and is in the array, it will be deleted from the array.
 * @param {Object} selected - The complete contact information.
 * @param {string} id - ID of the contact's select box.
 */
function selectedForTask(selected, id) {
    if (taskContactList.includes(selected) == false) {
        taskContactList.push(selected);
        addSelectedPoint(id);
        switchContactIcons(selected);
    } else {
        removeContactsForTask(selected);
        removeSelectedPoint(id);
        switchContactIcons();
    }
}


/**
 * This function removes a contact form the array.
 * @param {object} selected - Contact to remove.
 */
function removeContactsForTask(selected) {
    let index = taskContactList.indexOf(selected);
    taskContactList.splice(index, 1);
}


/**
 * This function add a CSS property.
 * @param {string} id - ID of the contact's select box.
 */
function addSelectedPoint(id) {
    document.getElementById(id).classList.add('selection-point');
}


/**
 * This function remove a CSS property
 * @param {string} id - ID of the contact's select box.
 */
function removeSelectedPoint(id) {
    document.getElementById(id).classList.remove('selection-point');
}


/**
 * This function creates initials from the first and last name.
 */
function createInitials() {
    initials = [];
    taskContactList.forEach(currentContact => {
        let initial = getFirstLetters(currentContact);
        initials.push(initial);
    });
}


/**
 * This function creates initials from the first and last name.
 * @param {Object} contact - The complete contact information.
 * @returns - The first letter of the first and last name.
 */
function getFirstLetters(contact) {
    let firstLetters = contact.firstname.charAt(0) + contact.lastname.charAt(0);;
    return firstLetters;
}


/**
 * This function removes all selected contacts, initials,
 * closes the drop down menu and re-renders the contacts.
 */
function clearContacts() {
    let classStatus = document.getElementById('assingedTo').classList
    if (classStatus.contains('dropdown-category-open')) {
        pullDownMenu('assingedTo', 'category', 'moreContacts', 'moreCategorys');
    }
    collectedContact = [];
    taskContactList = [];
    initials = [];
    switchContactIcons();
    renderContacts();
    renderloggedInUserinContactList();
    renderInitials();
}


/**
 * This function starts the function to create and render the initials,
 * closes the drop down menu and changes the icons.
 */
function addContacts() {
    initialsRenderd = true;
    createInitials();
    switchContactIcons();
    renderInitials();
    pullDownMenu('assingedTo', 'category', 'moreContacts', 'moreCategorys');
}


/**
 * This function renders the initials.
 */
function renderInitials() {
    initialsContainer = document.getElementById('initialsContainer');
    initialsContainer.innerHTML = '';
    if (taskContactList.length > 0) {
        for (let i = 0; i < initials.length; i++) {
            initialsContainer.innerHTML += `
            <div class="task-initials" style="background-color: ${contactColor(i)}" id="contactInitials${[i]}">${initials[i]}</div>`
        }
    }
}


/**
 * This function returns the color of the contact.
 * @param {number} i - Array position of the contact.
 * @returns  - The color of the contact (rgb).
 */
function contactColor(i) {
    return taskContactList[i].color
}


/**
 * This function sets the background color for the respective button and sets the priority of the task.
 * @param {string} clicked - The ID of the clicked button.
 * @param {string} img - The ID of the Image from the clicked button.
 */
function priority(clicked, img) {
    resetPrioButtom();
    element = document.getElementById(clicked);
    prioImg = document.getElementById(img);
    if (clicked == 'prioHigh') {
        setStyleforPrioButton(element, prioImg)
        element.style.backgroundColor = 'rgb(236, 85, 32)';
        prio = 'high';
    } if (clicked == 'prioMedium') {
        setStyleforPrioButton(element, prioImg)
        element.style.backgroundColor = 'rgb(243, 173, 50)';
        prio = 'medium';
    } if (clicked == 'prioLow') {
        setStyleforPrioButton(element, prioImg)
        element.style.backgroundColor = 'rgb(147, 222, 70)';
        prio = 'low';
    }
}


/**
 * This function sets style elements.
 * @param {boolean} element - ID element prio button.
 * @param {boolean} prioImg - ID element prio IMG.
 */
function setStyleforPrioButton(element, prioImg) {
    element.style.fontWeight = '700';
    element.style.color = 'white'
    prioImg.style.filter = 'brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(24%) hue-rotate(114deg) brightness(108%) contrast(108%)';
}


/**
 * This function resets the CSS classes and the images to default.
 * @param {string} notClicked - The ID of the button that was not clicked.
 * @param {string} alsoNotClicked - The ID of the button that was not clicked.
 */
function resetPrioButtom() {
    document.getElementById('prioHigh').style = ``;
    document.getElementById('prioMedium').style = ``;
    document.getElementById('prioLow').style = ``;
    document.getElementById('prioHighImg').style = ``;
    document.getElementById('prioMediumImg').style = ``;
    document.getElementById('prioLowImg').style = ``;
}


/**
 * This function create a subtask. It pushes the input value and status into an array.
 * Renders the subtask and changes the icons.
 */
function addSubtask() {
    let subtaskInput = document.getElementById('subtaskInput').value;
    if (containsBrackets(subtaskInput)) {
        document.getElementById('subTaskReport').classList.remove('d-none');
        document.getElementById('subTaskReport').innerHTML = 'The following characters are not allowed { } [ ] "'
    } else if (subtaskInput == '') {
        document.getElementById('subTaskReport').classList.remove('d-none');
        document.getElementById('subTaskReport').innerHTML = 'Empty subtasks are not allowed'
    } else {
        document.getElementById('subTaskReport').classList.add('d-none');
        subtasks.push(subtaskInput);
        subtaskStatus.push('false');
        renderSubtasks();
        switchSubtaskIcons();
    }
}


/**
 * This function removes a subtask and subtask status and re-renders the remaining ones.
 * @param {number} i - Index of subtask
 */
function removeSubtask(i) {
    subtasks.splice(i, 1);
    subtaskStatus.splice(i, 1);
    renderSubtasks();
}


/**
 * This function renders the subtasks.
 */
function renderSubtasks() {
    let subtaskContainer = document.getElementById('addetSubtasks');
    subtaskContainer.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        subtaskContainer.innerHTML += `<div class="sub-task">
            <div onclick="setStatus('selectboxSubtask${i}', ${i})" class="selectbox-subtask pointer">
            <img class="subtaskDone ${getClass(i)}" id="selectboxSubtask${i}" src="assets/img/create_subtask.png">
            </div>
            <div class="pointer" onclick="removeSubtask(${i}), ${i}">${subtasks[i]}</div>
            </div>`
    }
}


/**
 * This function checks whether a subtask is done or not and then returns the corresponding value.
 * @param {number} i - Index of the subtask.
 * @returns - CSS class or ''.
 */
function getClass(i) {
    if (subtaskStatus[i] == 'true') {
        return setClass = '';
    } else {
        return setClass = 'd-none';
    }
}


/**
 * If a subtask's checkbox is clicked,
 * the CSS class 'd-none' will be removed or added and
 * subTaskStatus is set to true or false at the correct index.
 * @param {string} divID - ID of an div.
 * @param {number} i - Index of the subtask.
 */
function setStatus(divID, i) {
    if (subtaskStatus[i] == 'false') {
        document.getElementById(divID).classList.remove('d-none');
        subtaskStatus.splice(i, 1, 'true');
    } else {
        document.getElementById(divID).classList.add('d-none')
        subtaskStatus.splice(i, 1, 'false');
    }
}