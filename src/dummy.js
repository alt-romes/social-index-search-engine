const { MeiliSearch } = require('meilisearch')
const express = require('express')
const cheerio = require('cheerio')
const dummy = require('./dummy.json')
const app = express()
app.use(express.json())

const client = new MeiliSearch({ host: 'http://localhost:7700' })
client.index('pagecontents').addDocuments(dummy)
    .then((res) => { console.log(res) })
client.index('pagecontents')
    .updateFilterableAttributes([
        'id',
    ])

app.get('/search', function (req, res) {
    let query = req.query.query
    let ids = req.query.ids
    client.index('pagecontents').search(query, { filter: 'id IN ' + ids }).then((result) => res.send(result))
})
app.post("/bookmark", function (req, res) {
    //Receives url in req.body
    let url = req.body.url
    let userID = req.body.userID

    fetch(url).then(resp => resp.text()).then(data => {
        let htmlParser =cheerio.load(data)
        let title = htmlParser("head title").text()
        let description = htmlParser("meta[name='description']").attr().content
        console.log("Title: " + title + "\nDesc: " + description)
        if(title == null || description == null){return}
        client.index('pagecontents').addDocuments([{
            //TODO: THIS ID IS FROM THE DB
            id: 4,
            url: url,
            content: title + " " + description
        }]).then(task => res.send(task.status))
        
    })
    //Go to DB, get follows of userID

})
app.listen(3000, () => {
    console.log('Server started on port 3000');
});




