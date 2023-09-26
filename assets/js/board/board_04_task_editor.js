/**
 * Shows the task editor on the board.
 */
function boardShowTaskEditor() {

    const task = database.tasks[boardCurrentTaskInDetailView];
    taskEditorSelectedPrio = task.prio;

    taskEditorRenderPrioButtons(task.prio);
    taskEditorRenderData();
    boardIncludeAssignePickerOnTaskEditor();
    document.getElementById('board-detail-view-subtasks').innerHTML = '';
    document.getElementById('board-task-editor-subtasks').innerHTML = boardTaskEditorTemplateSubtasks();

    taskEditorInitAssigneePicker(task.assigned_to);
    boardRenderSubtasks(task.subtasks, 'addetSubtasks');

    clickOutsideDropdownMenu();
    boardTaskEditorSubtaskEnter();

    document.getElementById('board-detail-view').classList.add('board-display-none');
    document.getElementById('board-task-editor').classList.remove('board-display-none');
}


/**
 * Initializes the task assignee picker in the task editor.
 * @param {Array} assignees all assignees of the task 
 */
function taskEditorInitAssigneePicker(assignees) {

    renderContacts();
    taskContactList = [];

    for (let i = 0; i < assignees.length; i++) {
        const assignee = assignees[i];

        taskEditorSetAssigneeAsSelected(assignee);
    }

    addContacts();
    pullDownMenu('assingedTo', 'category', 'moreContacts', 'moreCategorys');
    document.getElementById('ddArrow').classList.remove('d-none');
    document.getElementById('clearAddButtons').classList.add('d-none');
}


/**
 * Accepts an assigned person as a parameter. Imitates the process of selecting this person as assignee as it would happen on the add task subpage. This results in all assignees already being marked as selected when the user opens the task editor.
 * @param {*} assignee an already assigned person with first- and lastname
 */
function taskEditorSetAssigneeAsSelected(assignee) {

    const firstname = assignee.substring(0, assignee.indexOf(' '));
    const lastname = assignee.substring(assignee.indexOf(' ') + 1);

    for (let j = 0; j < database.contacts.length; j++) {
        const contact = database.contacts[j];

        if (firstname == contact.firstname && lastname == contact.lastname) {
            const id = `contacts[${j}]`;
            selectedForTask(contact, id);
        }
    }
}


/**
 * Hides the task editor on the board.
 */
function boardHideTaskEditor() {

    document.removeEventListener('click', closeMenuIfClickedOutside);

    taskContactList = [];
    document.getElementById('board-detail-view-subtasks').innerHTML = '';
    document.getElementById('board-task-editor').parentNode.classList.add('board-display-none');
    document.getElementById('board-task-editor').classList.add('board-display-none');
    document.getElementById('board-kanban').classList.remove('board-display-none-700px');
    document.getElementById('board-task-editor-assignee-picker').innerHTML = '';
    document.getElementById('board-task-editor-subtasks').innerHTML = '';
    boardCreateAllEventListeners();
}


/**
 * Saves the changes made in the editor to the database, fetches it to the backend and hides the overlay.
 */
async function boardConfirmEditorChanges() {

    const taskEditorTitle = replaceForbiddenCharacters(document.getElementById('task-editor-title').value);
    const taskEditorDescription = replaceForbiddenCharacters(document.getElementById('task-editor-description').value);
    const taskEditorDueDate = document.getElementById('task-editor-date').value;

    database.tasks[boardCurrentTaskInDetailView].prio = taskEditorSelectedPrio;
    database.tasks[boardCurrentTaskInDetailView].title = taskEditorTitle;
    database.tasks[boardCurrentTaskInDetailView].description = taskEditorDescription;
    database.tasks[boardCurrentTaskInDetailView].due_date = taskEditorDueDate;

    taskEditorSaveContacts();
    boardHideTaskEditor();
    renderAllTaskCards();
    boardCreateAllEventListeners();
    await setItem('database', database);
}


/**
 * Saves all assignees of the task in the database.
 */
function taskEditorSaveContacts() {
    let newAssignees = [];

    for (let i = 0; i < taskContactList.length; i++) {
        const contact = taskContactList[i];
        const name = contact.firstname + ' ' + contact.lastname;

        newAssignees.push(name);
    }
    database.tasks[boardCurrentTaskInDetailView].assigned_to = newAssignees;
}


/**
 * Sets the priority buttons on the task editor to the current selection.
 * @param {string} selectedPrio the task's current priority 
 */
function taskEditorRenderPrioButtons(selectedPrio) {

    taskEditorSelectedPrio = selectedPrio;

    let prios = ['high', 'medium', 'low'];

    const selectedIconId = `task-editor-prio-icon-${selectedPrio}`;

    const index = prios.indexOf(selectedPrio);
    prios.splice(index, 1);

    for (let i = 0; i < prios.length; i++) {

        const unselectedPrio = prios[i];

        const iconId = `task-editor-prio-icon-${unselectedPrio}`;

        stylePrioButton(iconId, 'background-color:rgb(255, 255, 255)', false, unselectedPrio);
    }

    stylePrioButton(selectedIconId, 'color:rgb(255, 255, 255)', true, selectedPrio);
}


/**
 * Styles a priority button as selected or unselected.
 * @param {string} id html id of the button
 * @param {string} style button style: selected = font color is white; unselected = background color is white
 * @param {boolean} selected true = button is selected; false = button is unselected
 * @param {string} prioName name of the priority (high / medium / low) for the icon file path
 */
function stylePrioButton(id, style, selected, prioName) {

    let button = document.getElementById(id);
    let src;

    if (selected) {
        src = `./assets/img/board/prio_${prioName}_white.svg`;
        button.parentNode.classList.remove('board-cursor-pointer');

    } else {
        src = `./assets/img/board/prio_${prioName}.svg`;
        button.parentNode.classList.add('board-cursor-pointer');
    }

    button.parentNode.style = style;
    button.src = src;
}


/**
 * Renders data into the input fields in the task editor.
 */
function taskEditorRenderData() {

    const task = database.tasks[boardCurrentTaskInDetailView];

    document.getElementById('task-editor-title').value = task.title;
    document.getElementById('task-editor-description').value = task.description;
    document.getElementById('task-editor-date').value = task.due_date;
}


/**
 * Renders subtasks into the detail view and task editor overlay.
 * @param {string} subtasks subtasks of the task whose information should be rendered
 * @param {string} containerId html id of the container where the subtasks should be rendered
 */
function boardRenderSubtasks(subtasks, containerId) {

    let html = '';
    let container = document.getElementById(containerId);

    if (subtasks.name.length == 0) {
        html = 'No subtasks';

    } else {
        for (let i = 0; i < subtasks.name.length; i++) {

            html += taskEditorSubtaskTemplate(i, subtasks.name[i], subtasks.status[i], containerId);
        }
    }
    container.innerHTML = html;
}


/**
 * HTML Template for a subtask in the detail view or task editor.
 * @param {number} i index of the subtask within the task
 * @param {string} name name of the subtask
 * @param {string} status "false" = not done, "true" = done
 * @param {string} containerId html id of the container where the subtask is rendered
 * @returns HTML Template for a subtask
 */
function taskEditorSubtaskTemplate(i, name, status, containerId) {
    const html = /*html*/ `
    
            <div class="sub-task">
            <div onclick="taskEditorSetCheckbox(${i})" class="selectbox-subtask pointer">
            <img class="subtaskDone ${taskEditorGetSubtaskStatus(status)}" id="taskEditorCheckmark${i}" src="./assets/img/create_subtask.png">
            </div>
            <div class="board-detail-view-subtask">${name}
            <img class="board-cursor-pointer" src="./assets/img/board/close.svg"
            onclick="boardRemoveSubtask(${i}, '${containerId}')" alt="delete-icon"></div>

            
            </div>`;

    return html;
}


/**
 * Includes the assignee picker in the task editor overlay.
 */
function boardIncludeAssignePickerOnTaskEditor() {

    let container = document.getElementById('board-task-editor-assignee-picker');

    container.innerHTML = boardTemplateAssigneePicker();
}


/**
 * Function for checking off subtasks in the task editor. The subtask status is changed to either "true" or "false", then the board is re-rendered and the database is fetched to the backend. 
 * @param {number} i index of the subtask within the task
 */
async function taskEditorSetCheckbox(i) {

    const id = `taskEditorCheckmark${i}`;

    if (database.tasks[boardCurrentTaskInDetailView].subtasks.status[i] == 'false') {

        document.getElementById(id).classList.remove('d-none');
        database.tasks[boardCurrentTaskInDetailView].subtasks.status[i] = 'true';

    } else {
        document.getElementById(id).classList.add('d-none');
        database.tasks[boardCurrentTaskInDetailView].subtasks.status[i] = 'false';
    }
    renderAllTaskCards();
    await setItem('database', database);
}


/**
 * Hides the subtask checkmark by returning 'd-none' if the subtask status is false.
 * @param {string} status subtask status
 * @returns 'd-none' if the subtask status is false
 */
function taskEditorGetSubtaskStatus(status) {

    if (status != 'true') {
        return 'd-none';
    }
}


/**
 * Adds a subtask in the task editor overlay.
 */
function taskEditorAddSubtask() {

    const subtaskInput = replaceForbiddenCharacters(document.getElementById('subtaskInput').value);

    if (subtaskInput) {
        database.tasks[boardCurrentTaskInDetailView].subtasks.name.push(subtaskInput);
        database.tasks[boardCurrentTaskInDetailView].subtasks.status.push('false');
        boardRenderSubtasks(database.tasks[boardCurrentTaskInDetailView].subtasks, 'addetSubtasks');
        document.getElementById('subtaskInput').value = '';
        renderAllTaskCards();
        boardCreateAllEventListeners();
        setItem('database', database);
    }
}


/**
 * Replaces [] and {} brackets in the input string (they are used for formatting the JSON database) with () brackets. 
 * @param {string} string string that the function should validate 
 * @returns validated string
 */
function replaceForbiddenCharacters(string) {

    let validatedString = string.replace(/[\[{]/g, '(');
    validatedString = validatedString.replace(/[\]}]/g, ')');
    return validatedString;
}


/**
 * This function starts an event listener that checks whether enter is pressed in the subtask input field.
 */
function boardTaskEditorSubtaskEnter() {
    setTimeout(() => {
        let subTaskInputField = document.getElementById('subtaskInput');
        subTaskInputField.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                taskEditorAddSubtask();
            }
        });
    }, 150);
}