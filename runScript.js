const { spawn } = require('child_process');

function getFolderdata(folderPath) {
  return new Promise((resolve) => {
    const ls = spawn('ls', [], {
      cwd: folderPath,
    })

    ls.stdout.on('data', (data) => {
      const stringifiedData = '' + data // eslint-disable-line prefer-template
      resolve(stringifiedData.split(/[\r\n]+/))
    })

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    })

    // ls.on('close', (code) => {
    //   console.log(`child process exited with code ${code}`);
    // })
  })
}


// (async () => {
//   const fileData = await getFolderdata('/Volumes/WDrive/lech/Asian_Uncen/JapanHDV SiteRip 21.01.2016 - 30.04.2016/Screens')
//   const dataArr = fileData + '' // eslint-disable-line prefer-template
//   console.log(dataArr.split(/[\r\n]+/))
// })()

module.exports = getFolderdata
