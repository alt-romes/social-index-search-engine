const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const express = require('express')
const app = express()
const localport = 3000
const meiliport = 7700

app.post('/bookmark', (req, res) => {
    res.send('Hello World!')
    fetch('http://localhost:' + meiliport + '/bookmark', {
        method: 'POST',
        body: JSON.stringify({
            title: 'foo',
            body: 'bar',
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch(error => {
            console.log(error)
        })
})

app.post('/follow', (req, res) => {
    res.send('followed user!')
})

app.get('/search', (req, res) => {
    res.send('Hello World!')
})

app.listen(localport, () => {
    console.log(`Example app listening on port ${localport}`)
})
