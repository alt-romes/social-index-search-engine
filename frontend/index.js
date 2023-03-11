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

