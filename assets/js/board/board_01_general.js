let boardDropTargetColumn = '';
let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
let taskCountPerColumn = [];
let tasksInColumn = [[], [], [], []];
let boardDropTargetContainer = '';
let tasksInCurrentColumn;
let draggedOverTask;
let currentlyDragging = false;
let boardMaximumDescriptionLength = 35;
let boardCurrentTaskInDetailView = '';
let searchResults = {};
const columnIds = ['board-kanban-column-todo', 'board-kanban-column-in-progress', 'board-kanban-column-awaiting-feedback', 'board-kanban-column-done'];
let boardActiveSearch = false;
let taskEditorSelectedPrio = '';
let searchResultsDatabaseIndexes = [];
let maximumScrollY;


/**
 * Initializes the board subpage.
 */
async function boardInit() {
    await init();

    window.addEventListener('resize', boardHandleWindowResize);
    boardHandleWindowResize();

    tasks = database.tasks;
    contacts = database.contacts;
    categories = database.categories;
    datePicker();
}


/**
 * Sets the global variable boardMaximumDescriptionLength to a ideal value according to the current browser window with.
 */
function boardSetMaximumDescriptionLength() {

    const windowWidth = window.innerWidth;

    if (windowWidth > 1500 || (windowWidth < 700 && windowWidth > 370)) {
        boardMaximumDescriptionLength = 90;

    } else if ((windowWidth < 1100 && windowWidth > 900) || (windowWidth < 750 && windowWidth > 700)) {
        boardMaximumDescriptionLength = 25;

    } else if (windowWidth > 280) {
        boardMaximumDescriptionLength = 40;

    } else {
        boardMaximumDescriptionLength = 25;
    }
}


/**
 * Handles a full re-rendering of the board columns.
 * @param {boolean} newBoardSearch true = the function should target tasks that are in the searchResults array; false = the function should target all tasks in the database
 */
function renderAllTaskCards(newBoardSearch) {

    boardSetMaximumDescriptionLength();
    const dataForBoard = boardUseSearchResults(newBoardSearch);
    tasksInColumn = [[], [], [], []];
    taskCountPerColumn = [];

    renderBoardColumn('board-kanban-column-todo', 'todo', newBoardSearch, dataForBoard, 0);
    renderBoardColumn('board-kanban-column-in-progress', 'in-progress', newBoardSearch, dataForBoard, 1);
    renderBoardColumn('board-kanban-column-awaiting-feedback', 'awaiting-feedback', newBoardSearch, dataForBoard, 2);
    renderBoardColumn('board-kanban-column-done', 'done', newBoardSearch, dataForBoard, 3);
    setMaximumScrollY();
}


/**
 * Handles resizing of the browser window.
 */
function boardHandleWindowResize() {
    renderAllTaskCards();
    boardSwitchResponsiveMode();
    columnSetOffsetY();
    boardCreateAllEventListeners();
}


/**
 * Sets the maximum y position to which the page should scroll to when a task is dragged.
 */
function setMaximumScrollY() {

    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
    );

    const windowHeight = window.innerHeight;
    maximumScrollY = documentHeight - windowHeight;
}


/**
 * Shows the "No tasks to do" Placeholder in the column that is passed as a parameter.
 * @param {string} columnId the html id of the column in which the placeholder should be shown
 */
function boardShowPlaceholder(columnId) {

    try {
        const id = `${columnId}-placeholder`;
        let placeholder = document.getElementById(id);
        placeholder.classList.remove('board-display-none');

    } catch (error) { }
}


/**
 * Hides the "No tasks to do" Placeholder in the column that is passed as a parameter.
 * @param {string} columnId the html id of the column in which the placeholder should be hidden
 */
function boardHidePlaceholder(columnId) {

    try {
        const id = `${columnId}-placeholder`;
        let placeholder = document.getElementById(id);
        placeholder.classList.add('board-display-none');

    } catch (error) { }
}


/**
 * Renders a single board column by comparing the task progress to the inputted progress. If they are the same, a html template for the task is added to the columns inner html.
 * @param {string} id html id of the column that the function should render
 * @param {string} progress progress value associated with the column
 * @param {boolean} newBoardSearch true = the function should target tasks that are in the searchResults array; false = the function should target all tasks in the database
 * @param {JSON} dataForBoard data that should be used for rendering the column
 * @param {number} columnPosition the index of the column in the columnIds array, which contains the four html ids of the board columns
 */
function renderBoardColumn(id, progress, newBoardSearch, dataForBoard, columnPosition) {

    let currentColumnTaskCount = 0;
    let container = document.getElementById(id);
    container.innerHTML = '';
    let columnEmpty = true;

    for (let i = 0; i < dataForBoard.tasks.length; i++) {

        if (dataForBoard.tasks[i].progress == progress) {
            columnEmpty = false;
            container.innerHTML += htmlTemplateTaskCard(i, dataForBoard.tasks[i], currentColumnTaskCount);
            currentColumnTaskCount++;
            tasksInColumn[columnPosition].push(i);
        }
    }
    container.innerHTML += returnTemplateForDropContainers(id, currentColumnTaskCount);
    boardRenderColumnPlaceholder(id, container, columnEmpty, newBoardSearch);
    taskCountPerColumn.push(currentColumnTaskCount);
}


/**
 * Switches from horizontal to vertical organisation of the board columns when the screen width falls below 700 pixels and the other way round. 
 */
function boardSwitchResponsiveMode() {
    const windowWidth = window.innerWidth;
    let columnStyle = '';

    if (windowWidth <= 700) {
        document.getElementById('board-kanban').style = 'position: relative';
        columnStyle = 'position: absolute';

    } else {

        document.getElementById('board-kanban').style = 'display: flex';
    }

    for (let i = 0; i < columnIds.length; i++) {
        const column = columnIds[i];
        document.getElementById(column).parentNode.style = `${columnStyle}`;
    }
}


/**
 * Moves the absolutely positioned columns down by the height of the previous columns.
 */
function columnSetOffsetY() {

    let offsetY = 0;

    for (let i = 0; i < columnIds.length; i++) {
        const columnId = columnIds[i];

        const column = document.getElementById(columnId).parentNode;

        column.style = `top: ${offsetY}px`;

        offsetY = boardComputeOffsetY(offsetY, i);
    }
}


/**
 * Calculates the bottom coordinate of the inputted column. This is done by adding the height of the column based on its number of tasks and the height of previous columns.
 * @param {number} offsetY height of previous columns
 * @param {number} i the index of the column in the columnIds array, which contains the four html ids of the board columns
 * @returns top position for the next column
 */
function boardComputeOffsetY(offsetY, i) {

    if (taskCountPerColumn[i] === 0) {
        return offsetY + 264;

    } else {
        return offsetY + (260 * (taskCountPerColumn[i] - 1)) + 253;
    }
}


/**
 * Returns the correct priority text for display as they differ from the ones used in the database.
 * @param {object} task the task whose information should be rendered
 * @returns priority text for display
 */
function getTaskPrioBoard(task) {

    if (task.prio == 'low') {
        return 'Low';

    } else if (task.prio == 'medium') {
        return 'Medium';

    } else {
        return 'Urgent';
    }
}


/**
 * Finds the category of the task in the database and returns its color rgb code.
 * @param {string} taskCategory category of the task that should be rendered
 * @returns rgb color code of the category
 */
function getCategoryColor(taskCategory) {

    for (let i = 0; i < database.categories.length; i++) {
        const category = database.categories[i];

        if (category.name == taskCategory) {
            return category.color;
        }
    }
}


/**
 * Inspects how many assignees the inputted task has and returns the according template (showing all assignees or only the first two).
 * @param {object} task the task whose information should be rendered
 * @returns the html template for the assignees in the task card footer
 */
function htmlTemplateAllAssignees(task) {

    if (task.assigned_to.length < 4) {

        return htmlTemplateUpTo3Assignees(task);

    } else {
        return htmlTemplateMoreThan3Assignees(task);
    }
}


/**
 * Creates and returns the html template for up to three assignees in the task card footer.
 * @param {object} task the task whose information should be rendered
 * @returns html template for up to three assignees
 */
function htmlTemplateUpTo3Assignees(task) {
    let html = '';

    for (let i = 0; i < task.assigned_to.length; i++) {

        const assignee = task.assigned_to[i];

        html += htmlTemplateAssigneeIcon(assignee);
    }
    return html;
}


/**
 * Creates and returns the html template for more than three assignees in the task card footer.
 * @param {object} task the task whose information should be rendered
 * @returns html template for more than three assignees 
 */
function htmlTemplateMoreThan3Assignees(task) {
    let html = '';

    for (let i = 0; i < 2; i++) {

        const assignee = task.assigned_to[i];

        html += htmlTemplateAssigneeIcon(assignee);
    }

    html += /*html*/ `
    <div style="background-color:rgb(42, 54, 71)">+${task.assigned_to.length - 2}</div> `;

    return html;
}


/**
 * Searches and returns the personal rgb color code of the assignee from the contact database.
 * @param {string} assignee assignee with firstname and lastname
 * @returns the personal rgb color code of the assignee 
 */
function getAssigneeColor(assignee) {

    const assigneeTrimmed = assignee.trim();
    const firstname = assigneeTrimmed.substring(0, assigneeTrimmed.indexOf(' '));
    const lastname = assigneeTrimmed.substring(assigneeTrimmed.indexOf(' ') + 1);

    for (let i = 0; i < database.contacts.length; i++) {
        const contact = database.contacts[i];

        if ((firstname == contact.firstname && lastname == contact.lastname) ||
            (assignee == contact.firstname)) {
            return contact.color;
        }
    }
}


/**
 * Shortens the description to a size that can be displayed in relation to the current screen with.
 * @param {string} description unshortened description of a task
 * @returns shortened description
 */
function boardGetShortenedDescription(description) {

    if (description.length > boardMaximumDescriptionLength) {

        let shortened = description.substring(0, boardMaximumDescriptionLength);
        const lastWhitespace = shortened.lastIndexOf(' ');

        shortened = description.substring(0, lastWhitespace).trim() + '...';
        return shortened;
    }

    return description;
}


/**
 * Returns display:none when there a no subtask in the current task.
 * @param {object} task the task whose information should be rendered
 * @returns display:none as inline style
 */
function boardCheckForSubtasks(task) {

    if (task.subtasks.name.length == 0) {
        return "display:none;";
    }
}


/**
 * Returns the html template for the progress bar on the task card.
 * @param {object} task the task whose information should be rendered
 * @returns the html template for the progress bar on the task card
 */
function boardSubtasksProgress(task) {
    const subtasksCount = task.subtasks.name.length;
    const subtasksProgress = determineSubtasksProgress(task);
    const subtasksProgressAsFraction = subtasksProgress / subtasksCount;

    return /*html*/ `
        <div class="board-kanban-task-card-progress-bar-grey" style="${boardCheckForSubtasks(task)}"></div>
        <div class="board-kanban-task-card-progress-bar-blue" style="width:calc((100% - 40px) * ${subtasksProgressAsFraction}); ${boardCheckForSubtasks(task)}"></div>
        <p style="${boardCheckForSubtasks(task)}">${subtasksProgress}/${subtasksCount}</p> `;
}


/**
 * Calculates how many subtask have the status "done".
 * @param {object} task the task whose information should be rendered
 * @returns count of done subtasks
 */
function determineSubtasksProgress(task) {
    let subtasksProgress = 0;

    for (let i = 0; i < task.subtasks.status.length; i++) {
        const subtask = task.subtasks.status[i];

        if (subtask == "true") {
            subtasksProgress++;
        }
    }
    return subtasksProgress;
}