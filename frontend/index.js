
window.onload = e => {

    let main = document.getElementById("history")

    for (let i = 1; i<6; i++) {
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

    let header = document.createElement("div");
    header.classList.add("header");

    let titl = document.createElement("a");
    titl.href = "https://alt-romes.github.io"
    titl.classList.add("title");
    titl.innerHTML = title;

    let url_span = document.createElement("span");
    url_span.classList.add("domain");
    url_span.innerHTML = "("

    let url = document.createElement("a");
    url.href = "https://alt-romes.github.io"
    url.innerHTML = "alt-romes.github.io";

    url_span.appendChild(url)
    url_span.innerHTML += ")"

    header.appendChild(titl);
    header.appendChild(url_span);

    let desc = document.createElement("p");
    desc.classList.add("description");
    desc.innerHTML = description;

    let entry = document.createElement("li");
    entry.classList.add("entry");
    entry.appendChild(header);
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

