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
//Table creation commands

db.run('CREATE TABLE users(uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, name TEXT)');
db.run('CREATE TABLE bookmark(bid INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT)');
db.run('CREATE TABLE followers(uidfollower INTEGER, uidfollowed INTEGER, FOREIGN KEY(uidfollower) REFERENCES users(uid), FOREIGN KEY(uidfollowed) REFERENCES users(uid))');
db.run('CREATE TABLE userbookmarks(bid INTEGER, uid INTEGER, FOREIGN KEY(uid) REFERENCES users(uid), FOREIGN KEY(bid) REFERENCES bookmarks(bid))');


// close the database connection
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
});