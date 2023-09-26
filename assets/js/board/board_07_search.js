/**
 * Decides on whether to use the search results or the full database to render the tasks.
 * @param {boolean} newBoardSearch true = return search results; false = return database
 * @returns JSON containing tasks
 */
function boardUseSearchResults(newBoardSearch) {

    if (newBoardSearch == true || boardActiveSearch == true) {

        return searchResults;
    }
    return database;
}


/**
 * Removes start and end whitespace from the search input string. If the string then contains characters, it passes the input to the search function. Otherwise it re-renders the default board.
 */
function boardValidateSearchInput() {

    let inputField;
    searchResultsDatabaseIndexes = [];

    if (window.innerWidth > 700) {inputField = document.getElementById('board-search-input-desktop');} else {
        inputField = document.getElementById('board-search-input-mobile');
    }
    const userInput = inputField.value.trim();

    if (userInput.length == 0) {
        boardActiveSearch = false;
        renderAllTaskCards();
        boardCreateAllEventListeners();

    } else {
        boardActiveSearch = true;
        boardSearch(userInput);
    }
}


/**
 * Iterates through the database and calls for every task the boardSearchTask function which creates the search results array. Then it calls functions to re-render the board using the search results.
 * @param {string} userInput validated search input string typed by the user
 */
function boardSearch(userInput) {

    searchResults = { "tasks": [] };

    for (let i = 0; i < database.tasks.length; i++) {
        const task = database.tasks[i];

        boardSearchTask(task, userInput, i);
    }
    renderAllTaskCards(true);
    boardCreateAllEventListeners(true);
}


/**
 * Checks if the input string is found in the title, description, category or assignees of the inputted task.
 * @param {object} task task that is checked for fitting the search input
 * @param {string} userInput validated search input string typed by the user
 * @param {number} databaseIndex the index of the examined task in the database array
 * @returns as soon as the task is found to fit the search input to decrease function run-time
 */
function boardSearchTask(task, userInput, databaseIndex) {

    if (boardFieldIncludes(task.title, userInput) ||
        boardFieldIncludes(task.description, userInput) ||
        boardFieldIncludes(task.category, userInput)) {

        boardSaveSearchResults(task);
        searchResultsDatabaseIndexes.push(databaseIndex);
        return;
    }

    for (let i = 0; i < task.assigned_to.length; i++) {
        const assignee = task.assigned_to[i];

        if (boardFieldIncludes(assignee, userInput)) {

            boardSaveSearchResults(task);
            searchResultsDatabaseIndexes.push(databaseIndex);
            return;
        }
    }
}


/**
 * Checks if a specific input string matches the user search input. The test ignores capitalisation.
 * @param {string} field value of a specific field in the task data 
 * @param {*} userInput validated search input string typed by the user
 * @returns true, when the field includes the user input
 */
function boardFieldIncludes(field, userInput) {
    const fieldLowerCase = field.toLowerCase();
    const userInputLowerCase = userInput.toLowerCase();

    if (fieldLowerCase.includes(userInputLowerCase)) {
        return true;
    }
}


/**
 * Saves a task in the search results JSON.
 * @param {object} task task that is saved
 */
function boardSaveSearchResults(task) {

    const taskAsString = JSON.stringify(task);
    let searchResultsAsString = JSON.stringify(searchResults);

    searchResultsAsString = searchResultsAsString.slice(0, -2);

    if (searchResultsAsString.length > 20) {
        searchResultsAsString = searchResultsAsString + ',' + taskAsString;

    } else {
        searchResultsAsString = searchResultsAsString + taskAsString;
    }
    searchResultsAsString = searchResultsAsString + ']}';
    searchResults = JSON.parse(searchResultsAsString);
}