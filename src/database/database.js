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
//db.run('DROP TABLE *')
//Table creation commands
/*
db.run('CREATE TABLE users(uid INT PRIMARY KEY, email TEXT, name TEXT)');
db.run('CREATE TABLE bookmark(bid INT PRIMARY KEY, url TEXT)');
*/
db.run('CREATE TABLE followers(uidfollower INT, uidfollowed INT, FOREIGN KEY(uidfollower) REFERENCES users(uid), FOREIGN KEY(uidfollowed) REFERENCES users(uid)');
db.run('CREATE TABLE userbookmarks(bid INT, uid INT, FOREIGN KEY(uid) REFERENCES users(uid), FOREIGN KEY(bid) REFERENCES bookmarks(bid)');
db.



    // close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });