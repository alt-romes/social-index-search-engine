
function login(username, password) {
    putData("/login?username=" + username + "&password=" + password, {}).then(data => { return data; })
}

function signUpForm(event){
    let username = event.target.elements.signup.value
    let email = event.target.elements.email.value
    let password = event.target.elements.password.value
    if(username == "" || email == "" || password == ""){
        return;
    }
    console.log("Sign Up done with: " + username + " " + email + " " + password)
    signUp(username,email,password)
}
function loginForm(event){
    let username = event.target.elements.login.value
    let password = event.target.elements.password.value
    if(username == "" || password == ""){
        return;
    }
    console.log("Login done with: " + username + " " + password)
    login(username,password)
}


function putData(url = "", data = {}) {
    // Default options are marked with *
    return fetch(url, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
}
function postData(url = "", data = {}) {
    let cookies = document.cookie.split("; ")
    let auth_cookie = ""
    cookies.forEach(el => { let s = el.split("="); if (s[0] == "authcookie") { auth_cookie = s[1] } })

    // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            "Authentication": `Bearer ${auth_cookie}`
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
}
function signUp(username, email, password) {
    postData("/user?username=" + username + "&email=" + email + "&password=" + password).then(login("/login", username, password))
}

const signUpButton = document.getElementById("sign-up-button");
const loginButton = document.getElementById("login-button");
const loginButtonA = document.querySelector("#login-button > a");
const signUpButtonA = document.querySelector("#sign-up-button > a");

loginButtonA.onclick = e => {
    loginButton.dataset.active = loginButton.dataset.active == "true" ? "false" : "true";
    if(loginButton.dataset.active == "true"){
        signUpButton.dataset.active = "false"
    } 
}

signUpButtonA.onclick = e => {
    signUpButton.dataset.active = signUpButton.dataset.active == "true" ? "false" : "true";
    if(signUpButton.dataset.active == "true"){
        loginButton.dataset.active = "false"
    } 
}

