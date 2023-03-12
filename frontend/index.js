window.addEventListener("load", e => {

    const input = document.querySelector('input[type="file"]'); // select the input element with type="file"
    input.addEventListener('change', function () {
        const file = this.files[0]; // get the selected file
        const reader = new FileReader();

        reader.addEventListener('load', function () {
            // do something with the loaded data
            console.log(reader.result);
            let regArray = reader.result.match(/HREF="(.*?)"/gm)
            regArray = regArray.map((el) =>{return el.substring(5).replaceAll("\"","")})
            regArray.forEach((el) =>{
                if (el.startsWith("https://"))
                    addBookmark(el);
            })
            //regArray.forEach()
        });

        reader.readAsText(file); // read the file as text
    });

    let main = document.getElementById("history")
    let books = [
        {
            title: "Haskell for all: Why free monads matter",
            url: "https://www.haskellforall.com/2012/06/you-could-have-invented-free-monads.html",
            description: "Interpreters   Good programmers decompose data from the interpreter that processes that data.  Compilers exemplify this approach, where they..."
        },
        {
            title: "Building A Virtual Machine inside ChatGPT",
            url: "https://www.engraved.blog/building-a-virtual-machine-inside/",
            description: "Unless you have been living under a rock, you have heard of this new ChatGPT assistant made by OpenAI..."
        },
        {
            title: "How do non-euclidean games work?",
            url: "https://www.youtube.com/watch?v=lFEIUcXCEvI",
            description: "I'm a professional programmer who works on games, web and VR/AR applications."
        },
        {
            title: "Núcleo de Informática | AEFCT UNL",
            url: "https://ae.fct.unl.pt/n-inf/",
            description: "Site do Núcleo de Informática da SST-UNL"
        },
    ]

    for (let i = 0; i < 4; i++) {
        addEntry(main, books[i])
    }

})

function addEntry(main, entry) {
    let e = createEntry(entry.title, entry.description, entry.url);
    console.log(e);
    main.appendChild(e);
}

function createEntry(title, description, link) {

    let domain = parseDomain(link);

    let header = document.createElement("div");
    header.classList.add("header");

    let ico = document.createElement("img");
    ico.src = "https://" + domain + "/favicon.ico"
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
    

