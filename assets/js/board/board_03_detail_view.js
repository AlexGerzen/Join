/**
 * A onclick function that shows the detail view for the task that the user clicked.
 * @param {number} i the index of the clicked on task in the database or searchResults array
 */
function boardShowTaskDetails(i) {

    boardRenderDetailView(i);
    document.getElementById('board-detail-view').parentNode.classList.remove('board-display-none');
    document.getElementById('board-detail-view').classList.remove('board-display-none');
    boardCurrentTaskInDetailView = i;

    document.getElementById('board-kanban').classList.add('board-display-none-700px');
}


/**
 * A onclick function that hides the detail view.
 */
function boardHideTaskDetails() {
    document.getElementById('board-detail-view').parentNode.classList.add('board-display-none');
    document.getElementById('board-detail-view').classList.add('board-display-none');
    document.getElementById('board-kanban').classList.remove('board-display-none-700px');
    renderAllTaskCards();
    boardCreateAllEventListeners();
}


/**
 * Renders all sections of the detail view.
 * @param {number} i the index of the clicked on task in the database or searchResults array
 */
function boardRenderDetailView(i) {
    const task = database.tasks[i];

    boardDetailViewCategory(task);
    boardDetailViewTitle(task);
    boardDetailViewDescription(task);
    boardDetailViewDueDate(task);
    boardDetailViewPriorityTag(task);
    boardDetailViewAssignees(task);
    boardRenderSubtasks(task.subtasks, 'board-detail-view-subtasks');
}


/**
 * Renders the category in the detail view.
 * @param {object} task the task whose information should be rendered
 */
function boardDetailViewCategory(task) {

    let container = document.getElementById('board-detail-view-category-tag');

    container.innerHTML = /*html*/ `${task.category}`;
    container.style.backgroundColor = `${getCategoryColor(task.category)}`;
}


/**
 * Renders the title in the detail view.
 * @param {object} task the task whose information should be rendered
 */
function boardDetailViewTitle(task) {
    let container = document.getElementById('board-detail-view-title');
    container.innerHTML = `${task.title}`;
}


/**
 * Renders the description in the detail view.
 * @param {object} task the task whose information should be rendered
 */
function boardDetailViewDescription(task) {
    let container = document.getElementById('board-detail-view-description');
    container.innerHTML = `${task.description}`;
}


/**
 * Renders the due date in the detail view.
 * @param {object} task the task whose information should be rendered
 */
function boardDetailViewDueDate(task) {
    let container = document.getElementById('board-detail-view-due-date');
    container.innerHTML = /*html*/ `
    Due date: <div>${task.due_date}</div>`;
}


/**
 * Renders the priority tag in the detail view.
 * @param {object} task the task whose information should be rendered
 */
function boardDetailViewPriorityTag(task) {

    let container = document.getElementById('board-detail-view-priority-tag');
    container.innerHTML = /*html*/ `
    ${getTaskPrioBoard(task)} <img src="./assets/img/board/prio_${task.prio}_white.svg" alt="prio-icon">`;

    container.style.backgroundColor = `${boardGetPrioColor(task.prio)}`;
}


/**
 * Renders the already existing subtasks in the detail view.
 * @param {object} task the task whose information should be rendered
 */
function boardDetailViewSubtasks(task) {

    if (task.subtasks.name) {

        const container = document.getElementById('board-detail-view-subtasks');
        
        let html = /*html*/ `Subtasks: <ul>`;

        for (let i = 0; i < task.subtasks.name.length; i++) {
            const subtaskName = task.subtasks.name[i];

            html += `<li>${subtaskName}</li>`;
        }
        html += '</ul>';
        container.innerHTML = html;
    }
}


/**
 * Returns the colour associated with the priority of the task.
 * @param {string} taskPrio the priority of the task as string: 'low', 'medium' or 'high'
 * @returns rgba color code for the priority
 */
function boardGetPrioColor(taskPrio) {

    if (taskPrio == 'low') {
        return 'rgba(122, 226, 41, 1)';

    } else if (taskPrio == 'medium') {
        return 'rgba(255, 168, 0, 1)';

    } else {
        return 'rgba(255, 61, 0, 1)';
    }
}


/**
 * Renders the assignees in the detail view.
 * @param {object} task the task whose information should be rendered
 */
function boardDetailViewAssignees(task) {

    let container = document.getElementById('board-detail-view-assignees');
    container.innerHTML = 'Assigned to:';

    for (let i = 0; i < task.assigned_to.length; i++) {
        const assignee = task.assigned_to[i];

        container.innerHTML += /*html*/ `
        
        <div>
            ${htmlTemplateAssigneeIcon(assignee)}
            ${assignee}
        </div> `;
    }
}


/**
 * Deletes a task from the board by splicing it from the database. Then the board is re-rendered and the database is fetched to the backend.
 */
async function boardDeleteTask() {
 
    database.tasks.splice(boardCurrentTaskInDetailView, 1);

    boardHideTaskDetails();
    renderAllTaskCards();
    boardCreateAllEventListeners();
    await setItem('database', database);  
}


/**
 * Deletes subtask by removing it from the database. Then the board is re-rendered and the database is fetched to the backend.
 * @param {number} i index of the subtask within the task
 * @param {string} containerId html id of the container where the subtask is rendered
 */
async function boardRemoveSubtask(i, containerId) {

    database.tasks[boardCurrentTaskInDetailView].subtasks.name.splice(i, 1);
    database.tasks[boardCurrentTaskInDetailView].subtasks.status.splice(i, 1);

    boardRenderSubtasks(database.tasks[boardCurrentTaskInDetailView].subtasks, containerId);
    renderAllTaskCards();
    boardCreateAllEventListeners();
    await setItem('database', database);
}