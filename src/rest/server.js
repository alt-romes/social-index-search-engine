const path = require('node:path');
const { createHash } = require('crypto');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const TOKEN_KEY = "SampleText"
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cookieParser = require('cookie-parser')
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
const dummy = require('../database/mielidb.json')
const express = require('express')
const app = express()
const localport = 3000

const searchPage = cheerio.load(fs.readFileSync('./frontend/search.html'));

app.use(express.json())
app.use(cookieParser())

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

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
    let password = hash(req.query.password)
    db.all('SELECT * FROM users WHERE name=?', username, (err, qres) => {
        if (qres.length != 0) {
            res.status(400).send('Username is already in use')
        } else {
            db.run('INSERT INTO users (name, email, password) VALUES (?,?,?)', username, email, password);
            res.send('User created succesfully');
        }
    })
})
app.put('/login', (req, res) => {
    let username = req.query.username
    let password = hash(req.query.password)
    db.all('SELECT * FROM users WHERE name =?', username, (error1, qres1) => {
        if (qres1.length == 0) {
            res.status(400).send('No user called ' + username + ' exists')
        } else {
            console.log(qres1)
            //db.all('SELECT * FROM users WHERE password=?', password, (error2, qres2) => {
            if (qres1[0].password == password) {
                const token = jwt.sign(
                    { user_id: qres1[0].uid },
                    TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );
                db.run('INSERT INTO tokens (jwt, uid) VALUES (?,?)', token, qres1[0].uid)
                res.cookie('authcookie', token, { maxAge: 900000, httpOnly: false, sameSite: 'lax' })
                res.send({ "userid": qres1[0].uid, "jwt": token })
            } else {
                res.status(403).send('Wrong password')
            }
        }
    })

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
app.get('/login.js', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/login.js'))
})
app.get('/debug', (req, res) => {
    client.index('pagecontents').search("").then(data => { console.log("MEILI STATE:"); console.log(data) })
    db.all('SELECT * FROM users', (error, result) => { console.log("USERS: "); result.forEach(el => { console.log(el) }) })
    db.all('SELECT * FROM bookmarks', (error, result) => { console.log("BOOKMARKS "); result.forEach(el => console.log(el)) })
    db.all('SELECT * FROM userbookmarks', (error, result) => { console.log("USERBOOKMARKS: "); result.forEach(el => { console.log(el) }) })
    db.all('SELECT * FROM followers', (error, result) => { console.log("FOLLOWERS: "); result.forEach(el => { console.log(el) }) })

})
//WARNING everything after this function will require authentication
app.use(function (req, res, next) {
    console.log(req.cookies)
    if (!req.headers.authentication && !req.cookies.authcookie) {
        return res.status(403).json({ error: 'No credentials sent!' });
    } else {
        db.all('SELECT * FROM tokens WHERE jwt=?', req.headers.authentication?.split(" ")[1]??req.cookies.authcookie, (err, qres) => {
            if (qres.length == 0) {
                return res.status(401).json({ error: 'Invalid Token' });
            } else {
                var dateNow = new Date();
                //parse json
                let parsed = jwt.decode(qres[0].jwt, {
                    complete: true
                })
                if (parsed.payload.exp < dateNow.getTime() / 1000) {
                    //TODO remove token from database
                    console.log('user token exp')
                    return res.status(401).send('Token expired');
                } else {
                    next();

                }
            }
        })
    }
});

app.post('/bookmark', (req, res) => {
    let userID;

    db.all('SELECT * FROM tokens WHERE jwt=?', req.headers.authentication.split(" ")[1], (err, qres) => {
        userID = qres.user_id
        console.log("userID: " + userID)
        let link = req.body.link
        let last_row = -1;
        fetch(link).then(resp => resp.text()).then(data => {
            let htmlParser = cheerio.load(data)
            let title = htmlParser("head title").text()
            let description = htmlParser("meta[name='description']").attr().content
            console.log("Title: " + title + "\nDesc: " + description)
            if (title == null || description == null) { res.status(400).send("Invalid website"); return; }
            db.all('SELECT * FROM bookmarks WHERE url =?', link, (error, qres) => {
                if (error != null) {
                    console.log(error)
                }
                if (qres.length == 0) {
                    db.run('INSERT INTO bookmarks (url) VALUES (?)', link, (err) => {
                        if (err != null) {
                            res.status(400).send("Insert failed")
                            return;
                        }
                        db.all("SELECT last_insert_rowid() FROM bookmarks", (row_err, row_id) => { addContentLine(row_id[0]["last_insert_rowid()"], link, title, description, res, userID) })
                    })
                }
                else {
                    addContentLine(qres[0].bid, link, title, description, res, userID)
                }
            })
        })

    })
})

app.post('/follow', (req, res) => {

    let userID;
    db.all('SELECT * FROM tokens WHERE jwt=?', req.headers.authentication.split(" ")[1], (err, qres) => {
        if(qres.length == 0){
            res.status(403).send("AuthToken not found")
        }
        console.log(qres)
        userID = qres[0].uid
        targetuser = req.query.targetuser
        db.all('SELECT * FROM users WHERE uid=?', userID, (err, qres1) => {
            console.log(qres1,userID)
            if (qres1.length == 0) {
                res.status(400).send('You do not exist')
            } else {
                db.all('SELECT * FROM users WHERE uid=?', targetuser, (err, qres2) => {
                    if (qres2.length == 0) {
                        res.status(400).send('Target user does not exist')
                    } else {
                        db.run('INSERT INTO followers (uidfollower, uidfollowed) VALUES  (?, ?)', userID, targetuser)
                        res.send('followed user! ' + targetuser)
                    }
                })
            }
        })
    })
})

app.get('/search', (req, res) => {
    let userID;
    console.log(req.cookies)
    db.all('SELECT * FROM tokens WHERE jwt=?', req.cookies.authcookie, (err, qres) => {
        userID = qres[0].uid
        let query = req.query.query
        db.all('SELECT uidfollowed FROM followers WHERE uidfollower =?', userID, (err1, rows1) => {
            rows1.push(userID)
            let id_string = "("
            rows1.forEach((el) => { id_string = id_string.concat(el + ",") })
            id_string = id_string.concat(")")
            id_string = id_string.replace(",)", ")")
            db.all('SELECT bid FROM userbookmarks WHERE uid IN ' + id_string, (err2, rows2) => {
                rows2 = rows2.map(el => el.bid)
                rows2 = rows2.filter(el => el != null)
                client.index('pagecontents').search(query, { filter: "id IN [" + rows2 + "]" }).then((results) => {
                    let completePage = searchPage.root().clone()
                    results.hits.forEach(result => {
                        completePage('#search-results').append(createArticle(result));
                    })
                    console.log(completePage);
                    
                    res.set('Cache-control','no-store').send(completePage.html());
                })
            })
        })
    })
})

app.listen(localport, () => {
    console.log(`Example app listening on port ${localport}`)
})

function addContentLine(last_row, link, title, description, res, userID) {
    db.all('SELECT * FROM userbookmarks WHERE bid=?', last_row, (err, rows) => {
        if (err != null) {
            res.status(400).send("userbookmarks failed")
        }
        if (rows.length == 0) {
            db.run('INSERT INTO userbookmarks (bid,uid) VALUES (?,?)', last_row, userID)
        }
        console.log(rows)
    })
    client.index('pagecontents').addDocuments([{
        id: last_row,
        url: link,
        title: title,
        description: description
    }]).then(task => { console.log("Adding record to meili\nID: " + last_row + "\nURL: " + link); res.send(task.status) })
}


function createArticle(result) {
    let url = result.url
    let title = result.title
    let content = result.description
    let domain = parseDomain(url)
    return `
          <article class="entry">
              <div class="header">
                  <img style="width: 18px; height: 18px;" src="https://${domain}/favicon.ico" alt="">
                  <a class="header" href="${url}">${title}</a>
                  <span class="domain">
                      (
                    <a href="${url}">${domain}</a>
                      )
                  </span>
              </div>
              <p class="description">
                  ${content}
              </p>
          </article>
           `
}

function parseDomain(url) {
    let matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    let domain = matches && matches[1];  // domain will be null if no match is found
    return domain
}
