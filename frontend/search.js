const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("keyup", event => {

    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (event.key) {
        case "Enter":
            console.log("Enter: " + searchBar.value)
            search(searchBar.value)
            break;
    }

    event.preventDefault();
}, true)


function search(val) {
    window.location.href = `${window.location.protocol}//${window.location.host}/search?user=1&query=${encodeURIComponent(val)}`;
}

function follow() {

}
function addBookmark(url){
  postData("/bookmark",{link:url}).then(data =>{console.log(data)})
}


// Example POST method implementation:
function postData(url = "", data = {}) {
  console.log(auth_token["jwt"])
  // Default options are marked with *
  return fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      "Authentication": `Bearer ${auth_token["jwt"]}`
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
}

