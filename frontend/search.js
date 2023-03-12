const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("keyup", event => {

    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }

    switch (event.key) {
        case "Enter":
            console.log("Enter: " + searchBar.value)
            if (searchBar.value.startsWith("https://")) {
                addBookmark(searchBar.value).then(r => {
                    searchBar.placeholder = "Successfully added bookmark"
                });
                searchBar.value = ""
            }
            else if (searchBar.value.startsWith("follow:")) {
                console.log("Trying to follow user " + searchBar.value)
                follow(searchBar.value.substring(7)).then(r => {
                    searchBar.placeholder = `Successfully followed user ${searchBar.value.split(":")[1]}!`
                    searchBar.value = ""
                }).catch(e => {
                    searchBar.placeholder = `Failed to follow user ${searchBar.value.split(":")[1]}!`
                    console.error(e);
                    searchBar.value = ""
                })
            }
            else {
                search(searchBar.value);
            }
            break;
    }

    event.preventDefault();
}, true)


function search(val) {
    window.location.href = `${window.location.protocol}//${window.location.host}/search?query=${encodeURIComponent(val)}`;
}

function follow(val) {
    if (parseInt(val) == undefined) { return }
    return postData("/follow?targetuser=" + val, {})
}

function addBookmark(url) {
    return postData("/bookmark", { link: url }).then(data => { console.log(data) })
}

