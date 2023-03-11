const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('./src/database/database.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the disk SQlite database.');
});
//Table deletion commands
/*
db.run('DROP TABLE users');
db.run('DROP TABLE bookmark');
*/
/*
db.all('SELECT * FROM users WHERE name=?', "boo", (error, qres) => {
    console.log(qres[0].uid)
})
*/
//Table creation commands
/*
db.run('CREATE TABLE users(uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, name TEXT, password TEXT)');
db.run('CREATE TABLE bookmarks(bid INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT)');
db.run('CREATE TABLE followers(uidfollower INTEGER, uidfollowed INTEGER, FOREIGN KEY(uidfollower) REFERENCES users(uid), FOREIGN KEY(uidfollowed) REFERENCES users(uid))');
db.run('CREATE TABLE userbookmarks(bid INTEGER, uid INTEGER, FOREIGN KEY(uid) REFERENCES users(uid), FOREIGN KEY(bid) REFERENCES bookmarks(bid))');
*/

// close the database connection
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
});