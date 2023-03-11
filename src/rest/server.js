const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
//meilisearch
const { MeiliSearch } = require('meilisearch')
//test
let db = new sqlite3.Database('./src/database/database.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the disk SQlite database at ./src/database/database.db');
});
const sqlite3 = require('sqlite3').verbose();
const dummy = require('../dummy.json')
const express = require('express')
const app = express()
const localport = 3000
app.use(express.json())

const client = new MeiliSearch({ host: 'http://localhost:7700' })
client.index('pagecontents').addDocuments(dummy)
    .then((res) => { console.log(res) })
client.index('pagecontents')
    .updateFilterableAttributes([
        'id',
    ])

app.post('/bookmark', (req, res) => {
    res.send('Hello World!')
    let userid = req.query.user
    let link = req.body.link
    fetch(link).then(resp => resp.text()).then(data => {
        let htmlParser = cheerio.load(data)
        let title = htmlParser("head title").text()
        let description = htmlParser("meta[name='description']").attr().content
        console.log("Title: " + title + "\nDesc: " + description)
        if (title == null || description == null) { return }
    })
    db.all('SELECT * FROM bookmarks WHERE url =?' + link, (error, res) => {
        if (res.length == 0) {
            db.run('INSERT INTO bookmarks (?,?,?)', link, b, c)

        }
        res.forEach(element => {

        });
        db.run('INSERT INTO userbookmarks(?' + userid + ', ?' + ')')
    })
    client.index('pagecontents').addDocuments([{
        //TODO: THIS ID IS FROM THE DB

        id: 4,
        url: url,
        content: title + " " + description
    }]).then(task => res.send(task.status))

    let pagebody = req.body
    client.index('pagecontents').addDocuments(dummy)
        .then((res) => { console.log(res) })
    client.index('pagecontents')
        .updateFilterableAttributes([
            'id',
        ])

})

app.post('/follow', (req, res) => {
    user = req.query.user
    targetuser = req.query.targetuser

    //Add target user to followlist in DB
    //if no target user then return 404
    res.send('followed user! ' + targetuser)

})

app.get('/search', (req, res) => {
    let query = req.query.query
    let user = req.query.user
    let ids = req.query.id //temporary
    client.index('pagecontents').search(query, { filter: 'id IN ' + ids }).then((result) => res.send(result))
})

app.listen(localport, () => {
    console.log(`Example app listening on port ${localport}`)
})
