//Other functions

/**
 * This function will set and reset the tick in the "Remember me" box
 */
function setTick() {
    if (tickCount == 0) {
        document.getElementById('tick').classList.remove('d-none');
        rememberMe = true;
    }
    else {
        document.getElementById('tick').classList.add('d-none');
        rememberMe = false;
    }
    tickCount++;
    if (tickCount >= 2) {
        tickCount = 0;
    }
}


/**
 * This function is used to fill in the login data if the remember me tick is set
 */
function fillInData() {
    document.getElementById('email').value = currentEmail;
    document.getElementById('password').value = currentPassword;
    setTick();
}


/**
 * This function is used to check the width of the screen
 * 
 * @returns it returns true when the screen is smaller than 900px
 */
function checkScreenSize() {
    return window.innerWidth <= 900;
}


/**
 * This function is switching the image next to the passwort inputfield onkeyup
 */
function switchPasswordPicture() {
    let passwordInput = document.getElementById("password").value;
    let passwordInputType = document.getElementById("password");

    if (passwordInput == '') {
        document.getElementById('lock').classList.remove('d-none');
        document.getElementById('showPassword').classList.add('d-none');
        document.getElementById('hidePassword').classList.add('d-none');
    }
    else {
        if (passwordInputType.type == "password") {
            document.getElementById('lock').classList.add('d-none');
            document.getElementById('showPassword').classList.add('d-none')
            document.getElementById('hidePassword').classList.remove('d-none');
        }
        else {
            document.getElementById('lock').classList.add('d-none');
            document.getElementById('showPassword').classList.remove('d-none')
            document.getElementById('hidePassword').classList.add('d-none');
        }
    }

}


/**
 * This function is used to switch the password inputfield image onclick
 */
function showPassword1() {
    let passwordInput = document.getElementById("password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        document.getElementById('showPassword').classList.remove('d-none');
        document.getElementById('hidePassword').classList.add('d-none');

    } else {
        passwordInput.type = "password";
        document.getElementById('showPassword').classList.add('d-none');
        document.getElementById('hidePassword').classList.remove('d-none');
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
 * This function is used to change the border of the parent-element of the inputfield
 * 
 * @param {string} event This is the active event
 */
function activeInputfield(event) {
    // Hole das aktuell aktive Element
    const activeInput = event.target;

    // Überprüfe, ob das aktive Element ein Input-Feld ist
    if (activeInput.tagName === "INPUT") {
        if (event.type === "focus") {
            // Das Input-Feld hat den Fokus erhalten
            const activeInputfieldId = activeInput.id;
            document.getElementById(activeInputfieldId).parentNode.style = "border: 1px solid #29ABE2;"
        } else if (event.type === "blur") {
            // Das Input-Feld hat den Fokus verloren
            const activeInputfieldId = activeInput.id;
            document.getElementById(activeInputfieldId).parentNode.style = ""
        }
    }
}


/**
 * This function is used to restart the animation when the screen is resized
 */
function handleResize() {
    let screenWidth = window.innerWidth;
    if (screenWidth == 900) {
        waitForAnimation();
    }
}


/**
 * This function is used to disable a button after clicking it
 * 
 * @param {string} buttonId The id of the button which will be disabled
 */
function disableButton(buttonId) {
    const button = document.getElementById(buttonId);

    button.disabled = true;

    setTimeout(() => {
        button.disabled = false;
    }, 2000);
}

//HTML functions

/**
 * This function will open the window to register a user
 */
function openRegister() {
    document.getElementById('signUp').classList.add('d-none');
    document.getElementById('loginContainer').classList.add('d-none');
    document.getElementById('resetPwContainer').classList.add('d-none');
    document.getElementById('signUpContainer').classList.remove('d-none');
}


/**
 * This function will open the window to login
 */
function openLogin() {
    document.getElementById('signUp').classList.remove('d-none');
    document.getElementById('loginContainer').classList.remove('d-none');
    document.getElementById('signUpContainer').classList.add('d-none');
    document.getElementById('resetPwContainer').classList.add('d-none');
    document.getElementById('forgotPwContainer').classList.add('d-none');
}


/**
 * This function will open the window to request a passwort change
 */
function openForgotPw() {
    document.getElementById('signUp').classList.add('d-none');
    document.getElementById('loginContainer').classList.add('d-none');
    document.getElementById('resetPwContainer').classList.add('d-none');
    document.getElementById('forgotPwContainer').classList.remove('d-none');
    document.getElementById('signUpContainer').classList.add('d-none');
}


/**
 * This function will open the window to change the password
 */
function openResetPw() {
    document.getElementById('signUp').classList.add('d-none');
    document.getElementById('loginContainer').classList.add('d-none');
    document.getElementById('resetPwContainer').classList.remove('d-none');
    document.getElementById('forgotPwContainer').classList.add('d-none');
    document.getElementById('signUpContainer').classList.add('d-none');
}


/**
 * This function waits till the animation is done and shows then the login windows
 */
function waitForAnimation() {
    if (checkScreenSize()) {
        // Der Code für den Fall, dass die Bildschirmbreite kleiner oder gleich 900px ist
        document.getElementById('mobileStartScreen').classList.remove('d-none');
        document.getElementById('loginContainer').classList.add('d-none');
        document.getElementById('signUp').classList.add('d-none');
        setTimeout(() => { document.getElementById('mobileStartScreen').classList.add('d-none'); document.getElementById('joinPic').style = 'display: block'; }, 300);
        setTimeout(() => { document.getElementById('loginContainer').classList.remove('d-none'); document.getElementById('signUp').classList.remove('d-none'); }, 1300);
    }
    else {
        // Der Code für den Fall, dass die Bildschirmbreite größer als 900px ist
        setTimeout(() => { document.getElementById('loginContainer').classList.remove('d-none'); document.getElementById('signUp').classList.remove('d-none'); }, 1000);
    }
}


/**
 * Will start the animation that the email was sent
 */
function emailSentAnimation() {
    document.getElementById('emailSent').classList.remove('d-none');
    setTimeout(() => { document.getElementById('emailSent').classList.add('d-none'); }, 1000); // Lets the EmailSent-Container vanish after 3 seconds
}


/**
 * Will start the animation that an account has been created
 */
function accountCreatedAnimation() {
    document.getElementById('accountCreated').classList.remove('d-none');
    setTimeout(() => { document.getElementById('accountCreated').classList.add('d-none'); }, 1000); // Lets the EmailSent-Container vanish after 3 seconds
}

//Eventlistener

document.addEventListener("focus", activeInputfield, true); // gets the inputfield which is in focus
document.addEventListener("blur", activeInputfield, true); // get the inputfield which looses the focus
window.addEventListener('resize', handleResize); // checks if the screen is resizing