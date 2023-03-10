
window.onload = e => {

    let main = document.getElementById("main")

    for (let i = 0; i<20; i++) {
        fetch(`https://dummyjson.com/products/${i}`)
          .then((response) => response.json())
          .then((data) => addEntry(main, data));
    }

}

function addEntry(main, entry) {
        let e = createEntry(entry.title, entry.description);
        console.log(e);
        main.appendChild(e);
}

function createEntry(title, description) {

    let titl = document.createElement("p");
    titl.classList.add("title");
    titl.innerHTML = title;

    let desc = document.createElement("p");
    desc.classList.add("description");
    desc.innerHTML = description;

    let entry = document.createElement("div");
    entry.classList.add("entry");
    entry.appendChild(titl);
    entry.appendChild(desc);

    return entry;
}

function search() {
    let val = document.getElementById("input").value;
    console.log("searched " + val)
    postData("", val).then(data => _)
}

function follow() {

}


// Example POST method implementation:
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
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
  return response.json(); // parses JSON response into native JavaScript objects
}

