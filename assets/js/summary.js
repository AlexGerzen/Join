let tasks;
let users;
let valueJson;


/**
 * This function will initialize the page
 */
async function initSummary() {
    await init()
    includeUser();
    await getData();
    if (checkForAnimation()) {
        openMobileGreeting();
    }
}


/**
 * This function will add the hover effect to the div
 * 
 * @param {*} id This is the id where the hover effect will be added
 */
function addHoverEffect(id) {
    if (id == 'todoPicture') {
        document.getElementById(id).src = 'assets/img/pen_hover.png';
    }
    if (id == 'donePicture') {
        document.getElementById(id).src = 'assets/img/tick_hover.png';
    }
}


/**
 * This function will remove the hover effect from the div
 * 
 * @param {*} id This is the id where the hover effect will be removed
 */
function removeHoverEffect(id) {
    if (id == 'todoPicture') {
        document.getElementById(id).src = 'assets/img/pen.png';
    }
    if (id == 'donePicture') {
        document.getElementById(id).src = 'assets/img/tick.png';
    }
}


/**
 * This function will get the data from the backend
 */
async function getData() {
    tasks = database['tasks'];
    users = database['users'];
    switchHtml();
}


/**
 * This function will include all the info from the backend
 */
function switchHtml() {
    document.getElementById('nameOfUser').innerHTML = currentUsername;
    document.getElementById('tasksInProgress').innerHTML = getInfo('progress', 'in-progress');
    document.getElementById('awaitingFeedback').innerHTML = getInfo('progress', 'awaiting-feedback');
    document.getElementById('todo').innerHTML = getInfo('progress', 'todo')
    document.getElementById('done').innerHTML = getInfo('progress', 'done')
    document.getElementById('urgent').innerHTML = getInfo('prio', 'high')
    document.getElementById('tasksInBoard').innerHTML = tasks.length;
    document.getElementById('greeting').innerHTML = getTimeOfDay();
    document.getElementById('upcomingDeadline').innerHTML = getUpcomingDeadline();
}


/**
 * This function get all the data from the database
 * 
 * @param {string} category This is the category we want to search in 
 * @param {string} searchFor this is what we are looking for 
 * @returns 
 */
function getInfo(category, searchFor) {
    let info = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i][category] == searchFor) {
            info++;
        }
    }
    return info;
}


/**
 * This function is used to get the upcoming Deadline
 * 
 * @returns If there is an upcoming Date then it will be returned, if not 'No' will be returned
 */
function getUpcomingDeadline() {
    let dateArray = [];

    for (let i = 0; i < tasks.length; i++) {
        dateArray.push(tasks[i]['due_date'])
    }
    if (findUpcomingDate(dateArray) == 'No') {
        return 'No'
    }
    else {
        return formateDate(findUpcomingDate(dateArray));
    }
}


/**
 * This function is used to get the next upcoming task
 * 
 * @param {Array} dateArray This Array contains the due dates of the tasks
 * @returns it returns the upcoming Task
 */
function findUpcomingDate(dateArray) {
    // Check if the array is empty or zero
    if (!dateArray || dateArray.length === 0) {
        return 'No';
    }

    // get current date
    const today = new Date();

    // get rid of past dates
    const futureDates = dateArray.filter((date) => new Date(date) > today);

    // sort the upcoming dates
    futureDates.sort((a, b) => new Date(a) - new Date(b));

    // return the next date (if available)
    return futureDates.length > 0 ? futureDates[0] : 'No';
}


/**
 * This function is used to change the format of the date
 * 
 * @param {date} date This is the date in the wrong way
 * @returns It returns the date in the right format
 */
function formateDate(date) {
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    const [year, month, day] = date.split("-").map(Number);
    const formatedDate = `${months[month - 1]} ${day}, ${year}`;

    return formatedDate;
}


/**
 * This function will get the current time of the day
 * 
 * @returns it returns the greeting for each part of the day
 */
function getTimeOfDay() {
    let currentTime = new Date();
    let currentHour = currentTime.getHours();

    if (currentHour >= 0 && currentHour <= 8) {
        return "Good morning,";
    } else if (currentHour > 8 && currentHour <= 16) {
        return "Good day,";
    } else {
        return "Good evening,";
    }
}


/**
 * This function checks if the mobile animation has to appear
 * 
 * @returns It returns true if the animation has to appear
 */
function checkForAnimation() {
    var previousPage = document.referrer;
    var pageURL = "login.html";
    return animation = previousPage.includes(pageURL);
}


/**
 * This function is used to show the mobile greeting
 */
function openMobileGreeting() {
    const screenWidth = window.innerWidth;

    if (screenWidth < 900) {
        document.getElementById('headerContainer').style = 'display: none;';
        document.getElementById('mainLeftContainer').style = 'display: none;';
        document.getElementById('mainRightContainer').style = 'display: flex;';
        document.getElementById('main').style = 'height: inherit;';
        document.getElementById('summaryContainer').style = 'height: 100%; top: 0;'
        setTimeout(() => {
            document.getElementById('headerContainer').style = '';
            document.getElementById('mainLeftContainer').style = '';
            document.getElementById('mainRightContainer').style = '';
            document.getElementById('main').style = '';
            document.getElementById('summaryContainer').style = '';
        }, 2000);
    }
}

