/**
 * Creates drag-and-drop event listeners for mouse and touch applications for every task card rendered on the board.
 * @param {boolean} newBoardSearch true = the function should target tasks that are in the searchResults array; false = the function should target all tasks in the database
 */
function boardCreateAllEventListeners(newBoardSearch) {

    let dataForBoard = boardUseSearchResults(newBoardSearch);

    for (let i = 0; i < dataForBoard.tasks.length; i++) {

        const taskId = `task${i}`;
        let boardDragElement = document.getElementById(taskId);

        boardCreateEventListenerMouse(boardDragElement, i);
        boardCreateEventListenerTouch(boardDragElement, i);
    }
}


/**
 * Creates event listeners for a drag-and-drop function on a click device for the boardDragElement.
 * @param {object} boardDragElement the html task card that is currently dragged
 * @param {number} i the index of the dragged task in the database or searchResults array
 */
function boardCreateEventListenerMouse(boardDragElement, i) {
    boardDragElement.onmousedown = function (e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = function () {
            handleDropping(i);
        }

        document.onmousemove = function (e) {
            e.preventDefault();

            boardUpdateCoordinates(e);
            boardHandleDragging(boardDragElement, i);
        }
    }
}


/**
 * Updates the position coordinates of the dragging element.
 * @param {object} e a mousemove or touchmove event
 */
function boardUpdateCoordinates(e) {
    currentlyDragging = true;

    pos1 = pos3 - e.clientX;
    pos3 = e.clientX;
    pos2 = pos4 - e.clientY;
    pos4 = e.clientY;
}


/**
 * Creates event listeners for a drag-and-drop function on a touch device for the boardDragElement.
 * @param {object} boardDragElement the html task card that is currently dragged
 * @param {number} i the index of the dragged task in the database or searchResults array
 */
function boardCreateEventListenerTouch(boardDragElement, i) {
    boardDragElement.addEventListener('touchstart', handleStart, { passive: false });

    function handleStart(e) {
        e.preventDefault();
        e = e.changedTouches[0];
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.addEventListener('touchend', handleEnd);
        document.addEventListener('touchmove', handleMove, { passive: false });

        function handleEnd() {
            handleDropping(i);
            document.removeEventListener('touchend', handleEnd);
            document.removeEventListener('touchmove', handleMove);
        }

        function handleMove(e) {
            e.preventDefault();
            e = e.changedTouches[0];
            boardUpdateCoordinates(e);
            boardHandleDragging(boardDragElement, i);
        }
    }
}


/**
 * Handles all process that need to be done, when a currently dragging task card is moved. This includes setting the position coordinates of the boardDragElement as its style.
 * @param {object} boardDragElement the html task card that is currently dragged
 * @param {number} i the index of the dragged task in the database or searchResults array
 */
function boardHandleDragging(boardDragElement, i) {

    boardResetVariablesForDragging();

    rotateTaskCard(boardDragElement, true);

    boardDragElement.style.top = (boardDragElement.offsetTop - pos2) + "px";
    boardDragElement.style.left = (boardDragElement.offsetLeft - pos1) + "px";

    checkDragOverlapping(boardDragElement, i);
    boardSetDropTargets();

    resetAllGapsInColumns(i);
    openGapInTaskColumn(i);
    boardScrollPage(boardDragElement);
}


/**
 * This function is called when a task is dragged. It resets variables that contain information about where the task is currently dragged over to their default value.
 */
function boardResetVariablesForDragging() {

    boardDropTargetColumn = '';
    boardDropTargetContainer = '';
    tasksInCurrentColumn = [];
    draggedOverTask = -1;
}


/**
 * Sets all dashed drop targets to their default state (display: none) except for the drop target over which the dragged task is currently located.
 */
function boardSetDropTargets() {

    for (let i = 0; i < columnIds.length; i++) {
        const columnId = columnIds[i];

        for (let j = 0; j < (taskCountPerColumn[i] + 1); j++) {

            const targetId = `${columnId}-drop-target-${j}`;

            if (boardDropTargetContainer != targetId) {

                try {
                    document.getElementById(targetId).classList.add('board-display-none');
                } catch (error) { }
            }
        }
    }

    if (boardDropTargetContainer) {
        document.getElementById(boardDropTargetContainer).classList.remove('board-display-none');
    }
}


/**
 * Adds a 2.5° rotation effect to a dragged task and removes it when the dragging ends.
 * @param {object} boardDragElement the html task card that is currently dragged
 * @param {boolean} rotate true for drag start, false for drag end
 */
function rotateTaskCard(boardDragElement, rotate) {

    if (rotate) {
        boardDragElement.classList.add('board-task-card-rotated');

    } else {
        boardDragElement.classList.remove('board-task-card-rotated');
    }
}


/**
 * Tests for every board column, if the dragged task is dragged over it. If so, it saves the columnId in a global variable for later use and calls another function for hiding the "No tasks to do"-Placeholder in the specific column.
 * @param {object} boardDragElement the html task card that is currently dragged
 * @param {number} taskNumber the index of the dragged task in the database or searchResults array
 */
function checkDragOverlapping(boardDragElement, taskNumber) {

    for (let i = 0; i < columnIds.length; i++) {
        const columnId = columnIds[i];

        if (isDraggedElementOverBoardColumn(columnId, boardDragElement, i, taskNumber)) {

            boardDropTargetColumn = columnId;

            boardHidePlaceholder(columnId);

        } else {
            boardShowPlaceholder(columnId);
        }
    }
}


/**
 * Compares the bounding client of a specific column with the bounding client of the dragged task. If they overlap, another function is called for identifying over which task card the dragged task is located exactly.
 * @param {string} columnId the html id of the column that the function should check for overlap with the dragged task
 * @param {object} boardDragElement the html task card that is currently dragged
 * @param {number} i the index of the column in the columnIds array, which contains the four html ids of the board columns
 * @param {number} taskNumber the index of the dragged task in the database or searchResults array
 * @returns true = the dragged task overlaps somewhere with the checked column, false = there is no overlap with the checked column
 */
function isDraggedElementOverBoardColumn(columnId, boardDragElement, i, taskNumber) {

    const containerRect = document.getElementById(columnId).getBoundingClientRect();
    const { left, top, width, height } = boardDragElement.getBoundingClientRect();
    const centerX = left + (width / 2);
    const centerY = top + (height / 2);

    if (coordinatesOverlap(centerX, centerY, containerRect)) {

        checkDraggingOverDropContainer(columnId, centerX, centerY, i, taskNumber);
        return true;
    } else {
        return false;
    }
}


/**
 * Compares the bounding client of all drop containers within a specific column with the bounding client of the dragged task. If an overlapping container is found, the function saves this containers html id in the global variable boardDropTargetContainer and returns. If no overlapping container is found, the last drop container in the column is saved as drop target.
 * @param {string} columnId the html id of the column, in which the drop containers are checked for overlap with the dragged task
 * @param {number} centerX current x-axis coordinate of the center of the dragged task
 * @param {number} centerY current y-axis coordinate of the center of the dragged task
 * @param {number} index the index of the column in the columnIds array, which contains the four html ids of the board columns
 * @param {number} taskNumber the index of the dragged task in the database or searchResults array
 * @returns returns as soon as a overlap is found to reduce function run time
 */
function checkDraggingOverDropContainer(columnId, centerX, centerY, index, taskNumber) {

    tasksInCurrentColumn = tasksInColumn[index];
    let stopCheckingForDropContainers = tasksInCurrentColumn.length + 1;
    let numberOfLastDropContainer = tasksInCurrentColumn.length;

    if (tasksInCurrentColumn.includes(taskNumber)) {
        stopCheckingForDropContainers--;
        numberOfLastDropContainer--;
    }

    for (let i = 0; i < stopCheckingForDropContainers; i++) {
        const id = `${columnId}-drop-container-${i}`;
        const containerRect = document.getElementById(id).getBoundingClientRect();

        if (coordinatesOverlap(centerX, centerY, containerRect)) {
            boardDropTargetContainer = `${columnId}-drop-target-${i}`;
            draggedOverTask = tasksInCurrentColumn[i];
            return;
        }
    }
    boardDropTargetContainer = `${columnId}-drop-target-${numberOfLastDropContainer}`;
}


/**
 * This function checks for overlap in bounding client coordinates.
 * @param {number} centerX x-coordinate of the center of the dragged task
 * @param {number} centerY y-coordinate of the center of the dragged task
 * @param {object} containerRect bounding client coordinates of the drop column or drop container
 * @returns true when there is overlap
 */
function coordinatesOverlap(centerX, centerY, containerRect) {

    return (centerX <= containerRect.right &&
        centerX >= containerRect.left &&
        centerY <= containerRect.bottom &&
        centerY >= containerRect.top);
}


/**
 * Resets the top position of all task cards except the dragged task to their default value and thereby closes all gaps in the columns that were opened while dragging.
 * @param {number} draggingTask the index of the dragged task in the database or searchResults array
 */
function resetAllGapsInColumns(draggingTask) {

    for (let i = 0; i < 4; i++) {
        const column = tasksInColumn[i];

        for (let j = 0; j < column.length; j++) {

            if (draggingTask != column[j]) {

                const taskId = `task${column[j]}`;
                const topPosition = 260 * j;

                const task = document.getElementById(taskId);
                task.style = `top:${topPosition}px`;
            }
        }
    }
}


/**
 * Opens a gap for the dragged task in the column where the dragged task is currently dragged over.
 * @param {number} draggingTask the index of the dragged task in the database or searchResults array
 */
function openGapInTaskColumn(draggingTask) {

    const positionOfDraggedOverTask = tasksInCurrentColumn.indexOf(draggedOverTask);

    if (draggedOverTask >= 0 && draggedOverTask != draggingTask) {

        ignoreDraggedTaskWhenSettingGaps(draggingTask);

        for (let i = 0; i < tasksInCurrentColumn.length; i++) {

            const taskId = `task${tasksInCurrentColumn[i]}`;
            let newTopPosition = 260 * i;

            if (i >= positionOfDraggedOverTask) {
                newTopPosition = newTopPosition + 260;
            }
            document.getElementById(taskId).style = `top:${newTopPosition}px`;
        }
    }
}


/**
 * This function removes  the dragged task from the tasksInCurrentColumn array, so that there its position is not influenced by the openGapInTaskColumn function.
 * @param {number} draggingTask the index of the dragged task in the database or searchResults array
 */
function ignoreDraggedTaskWhenSettingGaps(draggingTask) {

    const taskNumberPositionCurrentColumn = tasksInCurrentColumn.indexOf(draggingTask);

    if (taskNumberPositionCurrentColumn != -1) {
        tasksInCurrentColumn.splice(taskNumberPositionCurrentColumn, 1);
    }
}


/**
 * Handles various processes that need to be executed when a dragged task is dropped.
 * @param {number} i the index of the dragged task in the database or searchResults array
 */
function handleDropping(i) {

    document.onmouseup = null;
    document.onmousemove = null;
    let index = i;

    if (boardActiveSearch) {
        index = searchResultsDatabaseIndexes[i];
    }

    if (!currentlyDragging) {
        boardShowTaskDetails(index);
    }

    boardSetAndSaveProgress(index);
    boardValidateSearchInput();
    boardDropTargetColumn = '';
    currentlyDragging = false;
}


/**
 * This function assigns the new progress to the dragged task in the database calls the function for posting the database to the backend.
 * @param {*} index 
 */
function boardSetAndSaveProgress(index) {

    const newProgress = boardColumnRouter();

    if (newProgress) {
        database.tasks[index].progress = newProgress;
        setItem('database', database);
    }
}


/**
 * Function with which the corresponding value for the progress field is read from the html id in which the dragged task was dropped.
 * @returns new value for task progress
 */
function boardColumnRouter() {

    if (boardDropTargetColumn) {

        return boardDropTargetColumn.substring(20);
    }
}


/**
 * This function scrolls the page up or down when the user drags the task to the top or bottom of the page.
 * @param {object} boardDragElement the html task card that is currently dragged
 */
function boardScrollPage(boardDragElement) {

    const scrollBorderTop = 200;
    const scrollBorderBottom = window.innerHeight - 400;

    if (pos4 < scrollBorderTop && window.scrollY !== 0) {

        window.scrollTo({ top: window.scrollY - 10 });
        boardDragElement.style.top = (boardDragElement.offsetTop - 10) + "px";

    } else if (pos4 > scrollBorderBottom && (window.scrollY < (maximumScrollY - 300))) {

        window.scrollTo({ top: window.scrollY + 10, });
        boardDragElement.style.top = (boardDragElement.offsetTop + 10) + "px";
    }
}