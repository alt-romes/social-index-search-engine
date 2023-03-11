const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
//meilisearch
const { MeiliSearch } = require('meilisearch')
//test
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
    let user = req.query.user
    let link = req.body.link
    //parse HTML
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
