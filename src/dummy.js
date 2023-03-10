const { MeiliSearch } = require('meilisearch')
const  express  = require('express')
const dummy = require('./dummy.json')
const app = express()
const client = new MeiliSearch({ host: 'http://localhost:7700' })
client.index('pagecontents').addDocuments(dummy)
    .then((res) => { console.log(res) })



app.get('/search', function (req, res) {
    console.log(req.body)
    let json = JSON.parse(req.body.trim())
    let query = json.query
    let ids = json.ids
    let ids_as_string = ids.map(id =>{id.toString()+","})
    ids_as_string = "[" + ids_as_string.slice(0,-1) + "]"
    client.index('pagecontents').search(query,{filter: 'id in '+ ids_as_string}).then((res) => console.log(res))
})
app.listen(3000, () => {
    console.log('Server started on port 3000');
  });


