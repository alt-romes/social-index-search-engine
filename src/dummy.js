const { MeiliSearch } = require('meilisearch')
const express = require('express')
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

app.get("/", function (req, res) {
    console.log("ok")
    res.send("ok")
})
app.get('/search', function (req, res) {
    console.log("ok")
    console.log(req.body)
    let query = req.body.query
    let ids = req.body.ids
    client.index('pagecontents').search(query, { filter: 'id IN ' + ids }).then((result) => res.send(result))
})
app.listen(3000, () => {
    console.log('Server started on port 3000');
});


