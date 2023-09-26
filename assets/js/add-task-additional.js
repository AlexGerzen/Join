/**
 * This function starts all eventListener.
 */
function startEventListener() {
    subtaskEventListener();
    clickOutsideDropdownMenu();
}


/**
 * This function starts an event listener that checks whether enter is pressed in the subtask input field.
 */
function subtaskEventListener() {
    setTimeout(() => {
        let subTaskInputField = document.getElementById('subtaskInput');
        subTaskInputField.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                addSubtask();
            }
        });
    }, 150)
}


/**
 * This function shows a datepicker.
 * Source: https://github.com/qodesmith/datepicker
 */
function datePicker() {
    const picker = datepicker('#date', {
        startDay: 1,
        minDate: new Date(),
        formatter: (input, date, instance) => {
            const dateObject = new Date(date);
            const year = dateObject.getFullYear();
            const month = String(dateObject.getMonth() + 1).padStart(2, '0');
            const day = String(dateObject.getDate()).padStart(2, '0');
            const isoDate = `${year}-${month}-${day}`;
            input.value = isoDate;
        }
    })
}


/**
 * This function is used to change the height of a div and display its contents
 * if the height of a div was previously changed and you click on another,
 * the previous div is reduced again and the content is hidden. 
 * The height of the clicked div is increased and the content is displayed
 * 
 * @param {string} clicked - This is the id where a classlist should be changed
 * @param {string} notClicked - This is the id where a classlist should be changed
 * @param {string} visible - This is the id where the classlist "d-none" will removed
 * @param {string} notVisible - This is the id where the classlist "d-none" will added
 */
function pullDownMenu(clicked, notClicked, visible, notVisible) {
    let openMenu = document.getElementById(clicked).classList;
    if (openMenu == 'dropdown-category-closed') {
        openDropDownMenu(clicked, notClicked, visible, notVisible);
    } else {
        closeDropDownMenu(clicked, visible, notVisible);
    } if (clicked == 'assingedTo') {
        switchContactIcons();
        renderInitials();
        initialsRenderd = false;
    }
}


/**
 * This function adds and removes CSS classes
 */
function openDropDownMenu(clicked, notClicked, visible, notVisible) {
    document.getElementById(clicked).classList.add('dropdown-category-open');
    document.getElementById(notClicked).classList.remove('dropdown-category-open');
    document.getElementById(visible).classList.remove('d-none');
    document.getElementById(notVisible).classList.add('d-none');
    document.getElementById('initialsContainer').classList.add('d-none');
}


/**
 * This function adds and removes CSS classes
 */
function closeDropDownMenu(clicked, visible, notVisible) {
    document.getElementById(clicked).classList.remove('dropdown-category-open');
    document.getElementById(visible).classList.add('d-none');
    document.getElementById(notVisible).classList.add('d-none');
    document.getElementById('initialsContainer').classList.remove('d-none');
}


/**
 * This function checks whether you have clicked.
 */
function clickOutsideDropdownMenu() {
    document.addEventListener('click', closeMenuIfClickedOutside);
}


/**
 * This function checks whether a dropdown menu is open, close it and restore the default.
 * @param {boolean} event - Click event.
 */
function closeMenuIfClickedOutside(event) {
    const categoryMenu = document.getElementById('category');
    const assignedToMenu = document.getElementById('assingedTo');

    if (!categoryMenu.contains(event.target) &&
        categoryMenu.classList.contains('dropdown-category-open')) {
        pullDownMenu('category', 'assingedTo', 'moreCategorys', 'moreContacts')
    }

    if (!assignedToMenu.contains(event.target) &&
        assignedToMenu.classList.contains('dropdown-category-open')) {
        pullDownMenu('assingedTo', 'category', 'moreContacts', 'moreCategorys');
        initialsRenderd = true;
        switchContactIcons();
        setTimeout(() => {
            initialsRenderd = false;
        }, 20)
    }
}


/**
 * This function changes the class of the input field.
 * If you click in the input field, add a subtask or press cancel,
 * you will switch between 2 different views on the right side of the input field.
 */
function switchSubtaskIcons() {
    let addSubtask = document.getElementById('addSubtask');
    let createSubtask = document.getElementById('createSubtask');
    let subtaskInput = document.getElementById('subtaskInput');
    let createSubtaskClass = createSubtask.classList.value;
    if (createSubtaskClass.includes('d-none') == true) {
        showAddClearIcons(addSubtask, createSubtask, subtaskInput);
    } else {
        removeAddClearIcons(addSubtask, createSubtask, subtaskInput);
    }
}


/**
 * This function changes the classes of the input field, 
 * focuses the input field and removes onclick.
 * @param {string} addSubtask - ID of a button.
 * @param {string} createSubtask - ID of a button container.
 * @param {string} subtaskInput - ID of an input field.
 */
function showAddClearIcons(addSubtask, createSubtask, subtaskInput) {
    subtaskInput.removeAttribute("onclick");
    createSubtask.classList.remove('d-none');
    addSubtask.classList.add('d-none');
    subtaskInput.focus();
}


/**
 * This function changes the classes of the input field,
 * clears the value of the input field and removes the focus from the input field
 * @param {string} addSubtask - ID of a button.
 * @param {string} createSubtask - ID of a button container.
 * @param {string} subtaskInput - ID of an input field.
 */
function removeAddClearIcons(addSubtask, createSubtask, subtaskInput) {
    subtaskInput.setAttribute("onclick", "switchSubtaskIcons()");
    createSubtask.classList.add('d-none');
    addSubtask.classList.remove('d-none');
    subtaskInput.blur();
    subtaskInput.value = '';
}


/**
 * This function adds and/or removes css classes to create a drop down menu.
 */
function switchContactIcons() {
    if (taskContactList.length == false || initialsRenderd == true) {
        document.getElementById('clearAddButtons').classList.add('d-none');
        document.getElementById('ddArrow').classList.remove('d-none');
        setTimeout(setAttribute, 200)
    } else {
        document.getElementById('clearAddButtons').classList.remove('d-none');
        document.getElementById('ddArrow').classList.add('d-none');
        document.getElementById('contactsToAssingContainer').removeAttribute("onclick");
    }
}


/**
 * This function adds an onclick.
 */
function setAttribute() {
    document.getElementById('contactsToAssingContainer').setAttribute("onclick", "pullDownMenu('assingedTo', 'category', 'moreContacts', 'moreCategorys')");
}


/**
 * This function clears all input fields and selected fields.
 */
function clearAllFields() {
    document.getElementById('tileInput').value = '';
    document.getElementById('descriptionInput').value = '';
    clearCreateCategory();
    clearContacts();
    document.getElementById('date').value = '';
    resetPrioButtom();
    resetSubTasks();
    resetWarnings();
}


/**
 * This function resets the input field under new category in the category dropdown menu.
 */
function clearCreateCategory() {
    document.getElementById('chosenCategory').innerHTML = `Select task category`
    selectedCategory = category;
    let classStatus = document.getElementById('category').classList
    if (classStatus.contains('dropdown-category-open')) {
        pullDownMenu('category', 'assingedTo', 'moreCategorys', 'moreContacts');
    }
}


/**
 * This function deletes all subtasks that have just been created.
 */
function resetSubTasks() {
    document.getElementById('subTaskReport').classList.add('d-none');
    subtasks = [];
    subtaskStatus = [];
    renderSubtasks();
}


/**
 * This function opens the add contact overlay. 
 */
function openAddContact() {
    openNewContactForm();
    clearContacts();
    renderContactsAfterCreate();
}


/**
 * This function renders the contacts after creating a new contact.
 */
function renderContactsAfterCreate() {
    document.getElementById("create-contact").addEventListener("click", function () {
        setTimeout(clearContacts, 300);
    });
}


/**
 * This function clears the warnings.
 */
function resetWarnings() {
    document.getElementById('titleReport').classList.add('d-none');
    document.getElementById('descriptionReport').classList.add('d-none');
    document.getElementById('categoryReport').classList.add('d-none');
    document.getElementById('dateReport').classList.add('d-none');
    document.getElementById('prioReport').classList.add('d-none');
}