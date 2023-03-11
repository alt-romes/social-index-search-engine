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

   // fetch(url).then(resp => {

   // })



app.get('/search', function (req, res) {
    let query = req.query.query
    let ids = req.query.ids
    client.index('pagecontents').search(query, { filter: 'id IN ' + ids }).then((result) => res.send(result))
})
app.post("/bookmark", function (req, res) {
    //Receives url in req.body
    let url = req.body.url
    let userID = req.body.userID
    let pagecontents;
    getJSON(url, (code, response) => {
        if (code == null) {
            pagecontents = response;
        }
        else{
            console.log(code)
            return;
        }
    })
    if(pagecontents != null){
        console.log(pagecontents)
    }
    //Go to DB, get follows of userID

})
app.listen(3000, () => {
    console.log('Server started on port 3000');
});




