const express = require('express')
const cors = require('cors')
const status = require('./functions/status')
const streamTitle = require('stream-title');

const app = express();

app.use(cors())
app.use(express.json())

app.get('/', async (req, resp) => {
    const response = await status(req.query.url, req.query.type)
    resp.send(response)
})

app.get('/test', (req, resp) => {
    streamTitle({
        url: 'https://sonic.dedicado.stream:7011',
        type: 'icecast',
        mount: 'stream'
    }).then(function (title) {
        resp.send(title)
    }).catch(function (err) {
        console.log(err)
    })
})

app.listen('3001', () => console.log('Server on port 3001'))