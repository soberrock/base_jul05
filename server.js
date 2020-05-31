const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const fs = require('fs')
const path = require('path')
const config = require('./webpack.config.js')
const getFolderdata = require('./runScript')
const mapDir = require('./scripts/map')

const app = express()
const compiler = webpack(config)

const mime = {
  jpg: 'image/jpeg',
}

let currentFolder

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
}));

// hot module replacement
app.use(require('webpack-hot-middleware')(compiler))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post('/update-folder', (req, res) => {
  const { folderpath } = req.body
  mapDir()
  res.sendStatus(200)
})

app.post('/folder-info', async (req, res) => {
  const { folderPath } = req.body
  currentFolder = folderPath
  // currentFolder = decodeURIComponent(folderPath)
  const folderData = await getFolderdata(folderPath)
  res.json({ folderData })
})

app.get('/image/:filename', (req, res) => {
  const fileName = req.params.filename
  const mimeType = 'image/jpeg'
  const file = path.join(currentFolder, fileName)
  const s = fs.createReadStream(file)

  s.on('open', () => {
    res.set('Content-Type', mimeType)
    s.pipe(res)
  })
  s.on('error', () => {
    res.set('Content-Type', 'text/plain')
    res.status(404).end('Not found')
  })
})

// Serve the files on port 3000.
app.listen(3000, () => {
  console.log('Example app listening on port 3000!\n')
})
