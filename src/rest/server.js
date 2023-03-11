const path = require('node:path');
const jwt = require("jsonwebtoken");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
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
const dummy = require('../database/mielidb.json')
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
    let password = req.query.password
    db.run('INSERT INTO users (name, email, password) VALUES (?,?)', username, email);
    res.send('User created succesfully');
})
app.put('/login', (req, res) => {
    let username = req.query.username
    let password = req.query.password
    db.all('SELECT * FROM users WHERE username =?', username, (error1, qres1) => {
        if (qres.values == 0) {
            res.send('No user called ' + username + ' exists')
        } else {
            db.all('SELECT * FROM ? WHERE password=?', qres, password, (error2, qres2) => {
                if (qres2) {
                    res.send({ "userid": userid })
                } else {
                    res.send('Wrong password')
                }
            })
        }
    })

})
app.post('/bookmark', (req, res) => {
    let userid = req.query.user
    let link = req.body.link
    let last_row = -1;
    fetch(link).then(resp => resp.text()).then(data => {
        let htmlParser = cheerio.load(data)
        let title = htmlParser("head title").text()
        let description = htmlParser("meta[name='description']").attr().content
        console.log("Title: " + title + "\nDesc: " + description)
        if (title == null || description == null) { res.send("400"); return; }
        db.all('SELECT * FROM bookmarks WHERE url =?', link, (error, qres) => {
            if (qres.length == 0) {
                db.run('INSERT INTO bookmarks (link) VALUES (?)', link, (err) => {
                    if (err != null) {
                        res.send("400")
                        return;
                    }
                    last_row = this.lastID
                })
            }
            else {
                last_row = qres[0].bid
            }
            db.run('INSERT INTO userbookmarks (bid, uid) VALUES (?,?)', last_row, userid)
        })
        client.index('pagecontents').addDocuments([{
            id: last_row,
            url: link,
            content: title + " " + description
        }]).then(task => res.send(task.status))
    })

})

app.post('/follow', (req, res) => {
    user = req.query.user
    targetuser = req.query.targetuser
    db.all('SELECT * FROM users WHERE uid=?', user, (err, qres1) => {
        if (qres.values == 0) {
            res.send('You do not exist')
        } else {
            db.all('SELECT * FROM users WHERE uid=?', user, (err, qres2) => {
                if (qres.values == 0) {
                    res.send('Target user does not exist')
                } else {
                    db.run('INSERT INTO followers (uidfollower, uidfollowed) VALUES  (?, ?)', user, targetuser)
                }
            })
        }
    })
    //Add target user to followlist in DB
    //if no target user then return 404
    res.send('followed user! ' + targetuser)
})

app.get('/search', (req, res) => {
    let query = req.query.query
    let user = req.query.user
    let ids = req.query.id //temporary
    client.index('pagecontents').search(query, { filter: 'id IN ' + ids }).then((result) => res.send(result))

    res.sendFile(path.join(__dirname, '../../frontend/search.html'));
})

app.listen(localport, () => {
    console.log(`Example app listening on port ${localport}`)
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
})

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/style.css'));
})

app.get('/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.js'));
})

app.get('/search.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/search.js'));
})

