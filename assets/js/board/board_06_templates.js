/**
 * HTML Template for a task card on the kanban board.
 * @param {number} i the index of the task that the function should render in the database or searchResults array
 * @param {object} task the task whose information should be rendered
 * @param {number} currentColumnTaskCount count of tasks in the current column
 * @returns HTML Template for a task card on the kanban board.
 */
function htmlTemplateTaskCard(i, task, currentColumnTaskCount) {

    let topPosition = 260 * currentColumnTaskCount;

    let html = /*html*/ `

        <div id="task${i}" class="board-kanban-task-card board-cursor-pointer board-draggable" style="top:${topPosition}px">

            <div class="board-department-tag" style="background-color:${getCategoryColor(task.category)}">${task.category}</div>
            <h4>${task.title}</h4>
            <p class="board-task-description">${boardGetShortenedDescription(task.description)}</p>

                <div class="board-kanban-task-card-progress-bar">
                    ${boardSubtasksProgress(task)}
                </div>

                <div class="board-kanban-task-card-footer">
                    <div id="task${i}-assignees" class="board-kanban-task-card-footer-assignees">

                        ${htmlTemplateAllAssignees(task)}
                    </div>
                    <img src="./assets/img/board/prio_${task.prio}.svg" alt="prio-icon">
                </div>

            </div>
        `;
    return html;
}


/**
 * HTML Template for the subtask editor on the add task overlay.
 * @returns HTML Template
 */
function boardAddTaskTemplateSubtasks() {

    return /*html*/ `

        <div class="padding-36-bottom">
        <div class="display-flex">
            <div class="padding-10-bottom padding-17-right">Subtasks</div>
            <div id="subTaskReport" class="report d-none">The following characters are not allowed { } [
                ] "</div>
        </div>
        <div class="task-white-box task-subtask-container" id="subtask">
            <input type="text" placeholder="Add new subtask" id="subtaskInput"
                class="input-cat-sub no-outline" onclick="switchSubtaskIcons()">
            <div class="center" id="addSubtask">
                <img onclick="switchSubtaskIcons()" class="padding-17-right pointer"
                    src="assets/img/add_subtask.png">
            </div>
            <div class="center spcae-between clear-add-button-container padding-17-right d-none"
                id="createSubtask">
                <img class="clear-input pointer" onclick="switchSubtaskIcons()"
                    src="./assets/img/Clear_task_input.png">
                <div>|</div>
                <img id="board-button-submit-new-subtask" onclick="addSubtask()" class="pointer" src="./assets/img/create_subtask.png">
            </div>
        </div>
        <div id="addetSubtasks"></div>
        </div>
    `;
}


/**
 * HTML Template for the subtask editor on the task editor overlay.
 * @returns HTML Template
 */
function boardTaskEditorTemplateSubtasks() {

    return /*html*/ `

        <div class="padding-36-bottom">
        <div class="display-flex">
            <div class="padding-10-bottom padding-17-right">Subtasks</div>
            <div id="subTaskReport" class="report d-none">The following characters are not allowed { } [
                ] "</div>
        </div>
        <div class="task-white-box task-subtask-container" id="subtask">
            <input type="text" placeholder="Add new subtask" id="subtaskInput"
                class="input-cat-sub no-outline" onclick="switchSubtaskIcons()">
            <div class="center" id="addSubtask">
                <img onclick="switchSubtaskIcons()" class="padding-17-right pointer"
                    src="assets/img/add_subtask.png">
            </div>
            <div class="center spcae-between clear-add-button-container padding-17-right d-none"
                id="createSubtask">
                <img class="clear-input pointer" onclick="switchSubtaskIcons()"
                    src="./assets/img/Clear_task_input.png">
                <div>|</div>
                <img id="board-button-submit-new-subtask" onclick="taskEditorAddSubtask()" class="pointer" src="./assets/img/create_subtask.png">
            </div>
        </div>
        <div id="addetSubtasks"></div>
        </div>
    `;
}


/**
 * Returns the html template for the assignee picker.
 * @returns HTML template
 */
function boardTemplateAssigneePicker() {

    return /*html*/ `
        <div>
            <div class="display-flex">
                <div class="padding-10-bottom padding-17-right">Assigned to</div>
                <div id="contactReport" class="report d-none">This field is required</div>
            </div>

            <div class="dropdown-category-closed" id="assingedTo">

                <div onclick="pullDownMenu('assingedTo', 'category', 'moreContacts', 'moreCategorys')" class="dd-placeholder" id="contactsToAssingContainer">
                    <div>Contacts to assign</div>
                    <img id="ddArrow" src="assets/img/drop_down.png">

                    <div class="center spcae-between clear-add-button-container d-none" id="clearAddButtons">
                        <img class="clear-input pointer" onclick="clearContacts()" src="./assets/img/Clear_task_input.png">
                        <div>|</div>
                        <img onclick="addContacts()" class="pointer" src="./assets/img/create_subtask.png">
                    </div>
                </div>

                <div class="d-none task-more-content overflow-auto" id="moreContacts">
                    <div id="loggedInUserAddTask"></div>
                    <div id="loadedContacts"></div>

                </div>

            </div>
        </div>
        <div class="task-initials-container" id="initialsContainer"></div>
    `;
}


/**
 * HTML Template for the assignee bubble icon in the task card footer.
 * @param {string} assignee assignee with firstname and lastname
 * @returns HTML Template for the assignee bubble icon in the task card footer.
 */
function htmlTemplateAssigneeIcon(assignee) {

    const firstInitial = assignee.substring(0, assignee.indexOf(' ')).charAt(0);
    const secondInitial = assignee.substring(assignee.indexOf(' ') + 1).charAt(0);
    const initials = firstInitial + secondInitial;

    return /*html*/ `
    <div style="background-color:${getAssigneeColor(assignee)}">${initials}</div> `;
}


/**
 * Returns the html template for all drop containers in a specific column.
 * @param {string} columnId html id of the column in which the containers should be rendered
 * @param {number} currentColumnTaskCount count of tasks in the column in which the containers should be rendered
 * @returns the html template for all drop containers in a specific column
 */
function returnTemplateForDropContainers(columnId, currentColumnTaskCount) {
    const windowWidth = window.innerWidth;

    if (windowWidth > 700) {

        return htmlTemplateDropContainersDesktop(columnId, currentColumnTaskCount);
        
    } else {

        return htmlTemplateDropContainersMobile(columnId, currentColumnTaskCount);
    }
}


/**
 * Returns the desktop html template (for sreen widths above 700 pixels) for all drop containers in a specific column.
 * @param {string} columnId html id of the column in which the containers should be rendered
 * @param {number} currentColumnTaskCount count of tasks in the column in which the containers should be rendered
 * @returns the html template for all drop containers in a specific column
 */
function htmlTemplateDropContainersDesktop(columnId, currentColumnTaskCount) {

    let firstContainerSpecialStyle = ' style="height:253px"';
    let firstTargetSpecialStyle = ' style="margin:0"';
    let html = '';

    for (let i = 0; i < (currentColumnTaskCount + 1); i++) {

        const containerId = `${columnId}-drop-container-${i}`;
        const targetId = `${columnId}-drop-target-${i}`;

        html += /*html*/ `

        <div id="${containerId}" class="board-drop-container"${firstContainerSpecialStyle}>
            <div id="${targetId}" class="board-drop-target board-display-none"${firstTargetSpecialStyle}></div>
        </div>
        `;

        firstContainerSpecialStyle = '';
        firstTargetSpecialStyle = '';
    }
    return html;
}


/**
 * Returns the mobile html template (for sreen widths under 700 pixels) for all drop containers in a specific column.
 * @param {string} columnId html id of the column in which the containers should be rendered
 * @param {number} currentColumnTaskCount count of tasks in the column in which the containers should be rendered
 * @returns the html template for all drop containers in a specific column
 */
function htmlTemplateDropContainersMobile(columnId, currentColumnTaskCount) {

    let firstContainerSpecialStyle = ' style="height:253px"';
    let firstTargetSpecialStyle = 'margin:0;';
    let html = '';
    let containerId = `${columnId}-drop-container-0`;
    let targetId = `${columnId}-drop-target-0`;

    for (let i = 0; i < (currentColumnTaskCount); i++) {

        html += /*html*/ `
        <div id="${containerId}" class="board-drop-container"${firstContainerSpecialStyle}>
            <div id="${targetId}" class="board-drop-target board-display-none" style="${firstTargetSpecialStyle}"></div>
        </div>
        `;
        
        containerId = `${columnId}-drop-container-${i + 1}`;
        targetId = `${columnId}-drop-target-${i + 1}`;
        firstContainerSpecialStyle = '';
        firstTargetSpecialStyle = '';
    }

    html += /*html*/ `
    <div id="${containerId}" class="board-drop-container" style="height:80px">
        <div id="${targetId}" class="board-drop-target board-display-none" style="height:76px; ${firstTargetSpecialStyle}"></div>
    </div>
    `;
    return html;
}


/**
 * Renders the "No tasks" placeholder in a inputted column, if there are no tasks to show and no search is ongoing.
 * @param {string} id html id of the column in which the placeholder should be rendered
 * @param {object} container the html column in which the placeholder should be rendered
 * @param {boolean} columnEmpty true = there are no tasks to show (the column is empty)
 * @param {boolean} newBoardSearch true = the board renders search results and therefore no placeholder should be shown
 * @param {string} placeholderText column-specific text for the placeholder
 */
function boardRenderColumnPlaceholder(id, container, columnEmpty, newBoardSearch) {

    if (columnEmpty && !newBoardSearch) {

        container.innerHTML += /*html*/ `
        <div id="${id}-placeholder" class="board-kanban-column-placeholder">No tasks</div> `;
    }
}