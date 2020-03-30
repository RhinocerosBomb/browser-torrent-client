const path = require('path')
const fs = require('fs')

const readFolder = directoryPath => {
  let files = []
  const filesRead = fs.readdirSync(directoryPath, { withFileTypes: true })
  filesRead.forEach(function(file) {
    const filePath = path.join(directoryPath, file.name)
    if (file.isDirectory()) {
      files = [...files, ...readFolder(filePath)]
    } else {
      const fileContents = fs.readFileSync(filePath).toString('hex')
      const dirPathEncoded = Buffer.from(directoryPath, 'utf-8').toString('hex')
      files.push(
        '0x' + dirPathEncoded + fileContents
      )
    }
  })

  return files
}

module.exports = readFolder;