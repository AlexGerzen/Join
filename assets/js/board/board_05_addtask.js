/**
 * Shows the addtask overlay on the board.
 * @param {string} progress progress that the newly created task should have
 */
function boardShowAddtaskOverlay(progress) {

    task.progress = progress;
    subtasks = [];
    subtaskStatus = [];

    boardIncludeAssignePickerOnAddTask();
    document.getElementById('board-add-task-subtasks').innerHTML = boardAddTaskTemplateSubtasks();

    renderCategorys();
    renderContacts();
    startEventListener();

    clearAllFields();
    document.getElementById('board-add-task').classList.remove('board-display-none');
    document.getElementById('board-add-task').parentNode.classList.remove('board-display-none');
    document.getElementById('board-kanban').classList.add('board-display-none-700px');
    document.getElementById('mobileCreateTask').classList.remove('board-display-none');
}


/**
 * Hides the addtask overlay on the board.
 */
function boardHideAddtaskOverlay() {

    document.removeEventListener('click', closeMenuIfClickedOutside);
 
    document.getElementById('board-add-task').classList.add('board-display-none');
    document.getElementById('board-add-task').parentNode.classList.add('board-display-none');
    document.getElementById('board-kanban').classList.remove('board-display-none-700px');
    document.getElementById('mobileCreateTask').classList.add('board-display-none');

    document.getElementById('board-add-task-assignee-picker').innerHTML = '';
    document.getElementById('board-add-task-subtasks').innerHTML = '';
}


/**
 * Includes the assignee picker in the add task overlay.
 */
function boardIncludeAssignePickerOnAddTask() {

    let container = document.getElementById('board-add-task-assignee-picker');

    container.innerHTML = boardTemplateAssigneePicker();
}