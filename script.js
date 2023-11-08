const STORAGE_TOKEN = 'T3ZM12M138IJKXCYJV1DA8PMVRJBHNPB4BD5OV43';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


let database = [];
let data = [];
let currentEmail;
let currentUsername;
let remember;


/**
 * General onload function for all subpages.
 */
async function init() {
    includeUser();
    checkForLogin();
    await includeHTML();
    await getItem('database');
    sideMenuColor();
    showInitialsOnTopBar();
    userMenuEventListener();
}


/**
 * This function fetches a JSON and uploads it.
 * @param {string} key - The name of the key.
 * @param {boolean} value - JSON array.
 * @returns - Status
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload).replaceAll(`'`, `$`) })
        .then(res => res.json());
}


/**
 * This function downloads a JSON and parses it.
 * @param {string} key - Name of the item you want to download.
 * @returns - JSON array, database.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json())
        .then(value => {
            data = value.data.value;
            dataJSON = data.replace(/'/g, '"').replaceAll(`$`, `'`);
            database = JSON.parse(dataJSON);
        }).catch(err => {
            console.log(err);
        });
}


/**
 * This function gets the data from the localstorage.
 * @param {string} key - Name of the item you want to download. 
 * @returns It returns the JSON from the localstorage.
 */
function getItemLocalStorage(key) {
    let value = localStorage.getItem(key);
    return JSON.parse(value);
}


/**
 * This function will get the email of the logged in user from the link of the page.
 */
function includeUser() {
    let localStorageData = getItemLocalStorage('loggedInUser');
    if (localStorageData !== null) {
        currentEmail = localStorageData['email'];
        currentUsername = localStorageData['username'];
        remember = localStorageData['remember'];
    }
}


/**
 * This function renders the initials in the circle of the topbar.
 */
function showInitialsOnTopBar() {
    loggedInUserName = searchContactInfo(false, 'firstname', currentEmail, 'email', 'contacts') + ' ' + searchContactInfo(false, 'lastname', currentEmail, 'email', 'contacts');
    initialLetters = loggedInUserName
        .split(' ')
        .map(word => word.charAt(0))
        .join('');
    let topbarCircle = document.getElementById('loggedInUserInitials');
    topbarCircle.innerHTML = `${initialLetters}`;
    topbarCircle.style.color = `${searchContactInfo(false, 'color', currentEmail, 'email', 'contacts')}`;
}


/**
 * This function is for searching information based on different keywords.
 * @param {boolean} index - You are looking for the index of an object = true. For everything else false
 * @param {string} yoursearchResult - The information you are looking for. (color, contact, firstname, lastname, email,...). If the index is searched, just enter a placeholder here.
 * @param {string} keyword - The keyword you use to search for the information. (an e-mail address, a first name, a surname, ...)
 * @param {string} searchFilter - The searchFilter is related to the keyword. if you search with an email address of a contact, the search filter must be email.
 * @param {string} searchPath - The place where to search. There are only 4 possibilities. (categories, contacts, tasks, users)
 * @returns - The information you're looking for.
 */
function searchContactInfo(index, yoursearchResult, keyword, searchFilter, searchPath) {
    for (let i = 0; i < database[searchPath].length; i++) {
        currentSearch = database[searchPath][i];
        if (keyword == database[searchPath][i][searchFilter]) {
            if (index) {
                return database[searchPath].indexOf(currentSearch);
            } else {
                return currentSearch[yoursearchResult];
            }
        }

        

    }
}


/**
 * This function monitors where was clicked and shows or hides the user menu.
 * @param {boolean} e - The e parameter contains information about the position of the click,
 * the item clicked, or other properties of the event.
 */
function userMenuEventListener() {
    window.onclick = function (e) {
        if (window.location.pathname !== '/login.html') {
            if (!e.target.matches('.user-menu', '.user-initials', '#navID') &&
                !document.getElementById('userMenu').classList.contains('d-none')) {
                document.getElementById('userMenu').classList.add('d-none');
            } else if (e.target.matches('.user-initials')) {
                document.getElementById('userMenu').classList.remove('d-none');
            }
        }
    }
}


/**
 * This function checks whether a string contains { } [ ].
 * @param {string} input - Text from an input field.
 * @returns true or false.
             */
function containsBrackets(input) {
    return /[{}[\]"]/.test(input);
}


/**
 * This function logs the user out.
 */
function logOut() {
    if (!remember) {
        localStorage.clear();
    }
    window.location.replace('login.html')
}


/**
 * This function checks whether you come from an external website.
 */
function checkForLogin() {
    var previousPage = document.referrer;
    var pageURL = window.location.hostname;
    if (previousPage.search(pageURL) == -1 || currentEmail == undefined) {
        window.location.replace('login.html')
    }
}