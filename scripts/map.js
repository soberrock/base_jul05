const fs = require('fs')
const path = require('path')
const makeId = require('./makeId')

const DIR = '/Users/gao/Tkex'

/* eslint-disable no-param-reassign */

const root = {
  name: 'Tkex',
  filepath: DIR,
  childNodes: [],
}

function mapDirectory(dir = root) {
  const contents = fs.readdirSync(dir.filepath)
  let jpgCount = 0
  let ownPicCount = 0
  dir.id = makeId()
  dir.label = dir.name
  dir.icon = 'folder-close'
  contents.forEach((item) => {
    const filepath = `${dir.filepath}/${item}`
    const isDir = fs.lstatSync(filepath).isDirectory()
    if (isDir) {
      const newDir = {
        name: item,
        filepath,
        childNodes: [],
      }
      const dirData = mapDirectory(newDir)
      if (dirData.jpgCount !== 0) {
        jpgCount += dirData.jpgCount
        dir.childNodes.push(dirData)
      }
    } else if (path.extname(item) === '.jpg') {
        jpgCount += 1
        ownPicCount += 1
      // dir.childNodes.push({ name: item, filepath })
    }
  })
  dir.ownPicCount = ownPicCount
  dir.jpgCount = jpgCount
  return dir
}

// fs.writeFileSync(`${__dirname}/data.json`, JSON.stringify(mapDirectory()))

module.exports = function mapDir() {
  const map = mapDirectory()
  fs.writeFileSync(`${__dirname}/data.json`, JSON.stringify(map))
}
