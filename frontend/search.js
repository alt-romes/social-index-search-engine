const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("keyup", event => {

    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (event.key) {
        case "Enter":
            console.log("Enter: " + searchBar.value)
            if (searchBar.value.startsWith("https://")) {
                addBookmark(searchBar.value);
            }
            else {
                search(searchBar.value);
            }
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



