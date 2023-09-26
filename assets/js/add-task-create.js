/**
 * The function collects information from various input fields and assigns them to a task object. 
 * The function also includes some additional actions such as disabling a button,
 * reactivating the button after a delay if any input is missing and saving everything to the database.
 */
function collectAllInfos() {
    disableAddTaskButton();
    task.title = getValue('tileInput', 'titleReport')
    task.description = getValue('descriptionInput', 'descriptionReport')
    task.category = getCategory();
    task.assigned_to = getName();
    task.due_date = getDate();
    task.prio = getPrio();
    collectUnnecessaryInfors();
}


/**
 * This function checks whether all the required information is available and adds the optional information.
 */
function collectUnnecessaryInfors() {
    setTimeout(() => {
        if (required == '') {
            pushSubtask();
            pushStatus();
            saveDatabase()
        } else {
            activateAddTaskButton();
            required = ''
        }
    }, 300)
}


/**
 * This function disables the hover effect and the onclick on the add task button.
 */
function disableAddTaskButton() {
    document.getElementById('mobileCreateTask').removeAttribute("onclick");
    document.getElementById('desktopCreateTask').removeAttribute("onclick");
    document.getElementById('desktopCreateTask').classList.remove("create-hover");
}


/**
 * This function aktivates the hover effect and the onclick on the add task button.
 */
function activateAddTaskButton() {
    document.getElementById('mobileCreateTask').setAttribute("onclick", `collectAllInfos()`);
    document.getElementById('desktopCreateTask').setAttribute("onclick", `collectAllInfos()`);
    document.getElementById('desktopCreateTask').classList.add("create-hover");
}


/**
 * This function pushes all the names of the selected contacts in an array.
 */
function getName() {
    taskContactList.forEach((ContactName) => {
        if (ContactName.lastname == '') {
            fullName = ContactName.firstname
        } else {
            fullName = ContactName.firstname + ' ' + ContactName.lastname;
        }
        collectedContact.push(fullName);
    })
    return collectedContact;
}


/**
 * This function gets the value from the input field,
 * checks if it is empty and warns the user that this input field cannot be empty.
 * @param {string} valueId - Input field ID.
 * @param {string} reportID - Alert Message ID.
 * @returns value from input field.
 */
function getValue(valueId, reportID) {
    let description = document.getElementById(valueId).value;
    if (description == '' || containsBrackets(description)) {
        document.getElementById(reportID).classList.remove('d-none');
        required = true;
    } else {
        return description;
    }
}


/**
 * This function checks the variable selectedCategory if it is empty and
 * warns the user if no category is selected.
 * @returns selected category
 */
function getCategory() {
    if (selectedCategory == false || selectedCategory == '' || selectedCategory == undefined) {
        document.getElementById('categoryReport').classList.remove('d-none');
        document.getElementById('categoryReport').innerHTML = `This field is required`
        required = true;
    } else {
        return selectedCategory;
    }
}


/**
 * This function gets the value from the input field,
 * checks if it is empty and warns the user that this input field cannot be empty.
 * @returns value from input field.
 */
function getDate() {
    let date_regex = /^(?:19|20)\d{2}-(?:0?[1-9]|1[0-2])-(?:0?[1-9]|[1-2][0-9]|3[0-1])$/;
    let chosenDate = document.getElementById('date').value;
    if (chosenDate == '' || !(date_regex.test(chosenDate))) {
        document.getElementById('dateReport').classList.remove('d-none');
        required = true;
    } else {
        return chosenDate;
    }
}


/**
 * This function checks the variable prio if it is empty and
 * warns the user if no priority is selected.
 * @returns 'urgent', 'medium' or 'low'
 */
function getPrio() {
    if (prio == undefined) {
        document.getElementById('prioReport').classList.remove('d-none');
        required = true;
    } else {
        return prio;
    }
}


/**
 * This function pushes all subtasks into a JSON.
 */
function pushSubtask() {
    for (let i = 0; i < subtasks.length; i++) {
        task.subtasks.name.push(subtasks[i]) || [];
    }
}


/**
 * This function pushes all subtask status into a JSON.
 */
function pushStatus() {
    for (let i = 0; i < subtaskStatus.length; i++) {
        task.subtasks.status.push(subtaskStatus[i]);
    }
}


/**
 * This function pushes the created task into the database.
 * Starts the upload on the remote server and redirects the user to the summary page.
 */
async function saveDatabase() {
    document.getElementById('addetToBoard').classList.add('addet-to-board-position-animate')
    database.tasks.push(task);
    await setItem('database', database);
    setTimeout(() => {
        window.location.replace('board.html')
    }, 1500)
}


/**
 * This function opens an input field and a div with selectable random colors.
 */
function openCreateCategory() {
    document.getElementById('newCategoryContainer').classList.remove('d-none');
    document.getElementById('color-picker').classList.remove('d-none');
    pullDownMenu('category', 'assingedTo', 'moreCategorys', 'moreContacts');
    getRandomColor();
    document.getElementById('category').classList.add('d-none');
}


/**
 * This function removes an input field and a div with selectable random colors.
 */
function closeCreateCategory() {
    document.getElementById('category').classList.remove('d-none');
    document.getElementById('categoryPlaceholder').classList.remove('d-none');
    document.getElementById('newCategoryContainer').classList.add('d-none');
    document.getElementById('color-picker').classList.add('d-none');
    document.getElementById('categoryReport').classList.add('d-none');
    document.getElementById('categoryInput').value = '';
    // pullDownMenu('category', 'assingedTo', 'moreCategorys', 'moreContacts');
    removeSelectedColor();
}


/**
 * This function adds a rgb background color to div's.
 */
function getRandomColor() {
    for (let index = 0; index < 6; index++) {
        generatedColor = generateRandomColor();
        colorCircle = document.getElementById('colorPickCircle' + index);
        colorCircle.style = `background-color: ${generatedColor}`;
        setOnclickForColorpicker(colorCircle, generatedColor, index);
    }
}


/**
 * This function creates random colors.
 * @returns random rgb numbers.
 */
function generateRandomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}


/**
 * This function set a oncklick.
 * @param {string} colorCircle - The ID of a div.
 * @param {string} generatedColor - rgb code.
 * @param {number} index - index of a div.
 */
function setOnclickForColorpicker(colorCircle, generatedColor, index) {
    colorCircle.setAttribute("onclick", `selectedColor('${generatedColor}', 'colorPickCircle${index}')`);
}


/**
 * This function gives an rgb code to one variable and an ID to another variable.
 * Adds a class to the corresponding div to show the user what he clicked.
 * @param {string} color - rgb code
 * @param {string} id - The ID of the clicked div.
 */
function selectedColor(color, id) {
    colorForNewCategory = `${color}`;
    colorForNewCategoryID = id;
    removeSelectedColor();
    document.getElementById(id).classList.add('task-selected-category-color');
}


/**
 * This function removes the CSS class 'task-selected-category-color'.
 */
function removeSelectedColor() {
    for (let i = 0; i < 6; i++) {
        document.getElementById('colorPickCircle' + i).classList.remove('task-selected-category-color');
    }
}


/**
 * This function checks if an input field is empty and if a color has been selected.
 * If both exist, a function is started.
 */
function addCategory() {
    categoryInputFiled = document.getElementById('categoryInput');
    newCategory = categoryInputFiled.value;
    if (newCategory == '') {
        document.getElementById('categoryReport').classList.remove('d-none');
        document.getElementById('categoryReport').innerHTML = `Please enter a new category name`;
    } else if (newCategory.length > 20) {
        document.getElementById('categoryReport').classList.remove('d-none');
        document.getElementById('categoryReport').innerHTML = `Maximum 20 characters allowed`;
    } else if (colorForNewCategory == undefined) {
        document.getElementById('categoryReport').classList.remove('d-none');
        document.getElementById('categoryReport').innerHTML = `Please choose a color`;
    } else {
        createCategory(categoryInputFiled);
    }
}


/**
 * This function saves a new category, empty and close an input field,
 * select and shows the new category.
 */
function createCategory(categoryInputFiled) {
    saveNewCategory();
    categoryInputFiled.value = '';
    closeCreateCategory();
    selectCategory(newCategory, colorForNewCategory);
}


/**
 * This function prepares a new category to be pushed into a JSON.
 */
function saveNewCategory() {
    category = {
        "name": `${newCategory}`,
        "color": `${colorForNewCategory}`
    };
    pushCategoryInCategorys();
}


/**
 * This function pushes a new category into the database array.
 */
async function pushCategoryInCategorys() {
    categories.push(category);
    renderCategorys();
}