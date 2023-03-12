window.addEventListener("load", e => {

    let main = document.getElementById("history")

    for (let i = 1; i<6; i++) {
        fetch(`https://dummyjson.com/products/${i}`)
          .then((response) => response.json())
          .then((data) => addEntry(main, data));
    }

})

function addEntry(main, entry) {
    let e = createEntry(entry.title, entry.description, "https://github.com");
        console.log(e);
        main.appendChild(e);
}

function createEntry(title, description, link) {

    let domain = parseDomain(link);

    let header = document.createElement("div");
    header.classList.add("header");

    let ico = document.createElement("img");
    ico.src = domain + "/favicon.ico" // "https://" +
    ico.style.width = "18px";
    ico.style.height = "18px";
    ico.classList.add("title");
    ico.innerHTML = title;

    let titl = document.createElement("a");
    titl.href = link
    titl.classList.add("title");
    titl.innerHTML = title;

    let url_span = document.createElement("span");
    url_span.classList.add("domain");
    url_span.innerHTML = "("

    let url = document.createElement("a");
    url.href = link
    url.innerHTML = domain;

    url_span.appendChild(url)
    url_span.innerHTML += ")"

    header.appendChild(ico);
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

function parseDomain(url) {
    let matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    let domain = matches && matches[1];  // domain will be null if no match is found
    return domain
}

