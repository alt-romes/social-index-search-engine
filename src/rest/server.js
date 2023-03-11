//const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
//meilisearch
const { MeiliSearch } = require('meilisearch')
//test
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./src/database/database.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the disk SQlite database at ./src/database/database.db');
});
const cheerio = require('cheerio')
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

app.post('/user', (req, res) => {
    let username = req.query.username
    let email = req.query.email
    db.run('INSERT INTO users (?,?)', username, email);
    res.send('User created succesfully');
})

app.post('/bookmark', (req, res) => {
    let userID = req.body.userID
    console.log("userID: " + userID)
    let link = req.body.link
    let last_row = -1;
    fetch(link).then(resp => resp.text()).then(data => {
        let htmlParser = cheerio.load(data)
        let title = htmlParser("head title").text()
        let description = htmlParser("meta[name='description']").attr().content
        console.log("Title: " + title + "\nDesc: " + description)
        if (title == null || description == null) { res.send("Invalid website");return; }
        db.all('SELECT * FROM bookmarks WHERE url =?', link, (error, qres) => {
            if(error != null){
                console.log(error)
            }
            if (qres.length == 0) {
                db.run('INSERT INTO bookmarks (url) VALUES (?)', link, (err) => {
                    if (err != null) {
                        res.send("Insert failed")
                        return;
                    }
                    db.all("SELECT last_insert_rowid() FROM bookmarks", (row_err,row_id) =>{addContentLine(row_id[0]["last_insert_rowid()"],link,title,description,res)})
                })
            }
            else {
                addContentLine(qres[0].bid,link,title,description,res)
            }
            db.all('SELECT * FROM userbookmarks WHERE bid=?',last_row,(err,rows)=>{
                if(err != null){
                    res.send("userbookmarks failed")
                }
                if(rows.length == 0){
                    db.run('INSERT INTO userbookmarks (bid,uid) VALUES (?,?)',last_row,userID)
                }
                console.log(rows)
            })
        })
    })

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
    db.all('SELECT uidfollowed FROM followers WHERE uidfollower =?',user,(err1,rows1) =>{
        rows1.push(user)
        let id_string = "("
        rows1.forEach((el) =>{id_string = id_string.concat(el + ",")})
        id_string = id_string.concat(")")
        id_string = id_string.replace(",)" , ")")
        db.all('SELECT bid FROM userbookmarks WHERE uid IN '+id_string,(err2,rows2) =>{
            rows2 = rows2.map(el => el.bid)
            rows2 = rows2.filter(el => el!=null)
            client.index('pagecontents').search(query).then((result) => res.send(result))
        })
    })
})

app.listen(localport, () => {
    console.log(`Example app listening on port ${localport}`)
})

function addContentLine(last_row,link,title,description,res){
    client.index('pagecontents').addDocuments([{
        id: last_row,
        url: link,
        content: title + " " + description
    }]).then(task => res.send(task.status))
}
