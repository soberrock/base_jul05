const { spawn } = require('child_process');
const path = require('path')

function getFolderdata(folderPath) {
  return new Promise((resolve) => {
    const ls = spawn('ls', [], {
      cwd: folderPath,
    })

    ls.stdout.on('data', (data) => {
      const stringifiedData = '' + data // eslint-disable-line prefer-template
      const contents = stringifiedData.split(/[\r\n]+/)
      const pictures = contents.filter((item) => path.extname(item) === '.jpg')
      resolve(pictures)
    })

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    })
  })
}


// (async () => {
//   const fileData = await getFolderdata('/Volumes/WDrive/lech/Asian_Uncen/JapanHDV SiteRip 21.01.2016 - 30.04.2016/Screens')
//   const dataArr = fileData + '' // eslint-disable-line prefer-template
//   console.log(dataArr.split(/[\r\n]+/))
// })()

module.exports = getFolderdata
