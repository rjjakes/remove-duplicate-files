const fs = require('fs')
const path = require('path')
const recursive = require('recursive-readdir')
const fc = require('filecompare')

module.exports = () => {
// Check the arguments were passed.
  if (typeof process.argv[2] === 'undefined') {
    throw 'Working directory not defined.'
  }
  const workingDir = process.argv[2]
  if (!fs.existsSync(workingDir)) {
    throw `Working directory ${workingDir} does not exist.`
    process.exit(1)
  }

  if (typeof process.argv[3] === 'undefined') {
    throw 'Golden directory not defined.'
    process.exit(1)
  }
  const goldenDir = process.argv[3]
  if (!fs.existsSync(workingDir)) {
    throw `Golden directory ${goldenDir} does not exist.`
    process.exit(1)
  }

// Do it!
  recursive(workingDir, function (err, files) {
    // `files` is an array of file paths
    for (let file of files) {
      // Remove first item from the path.
      file = file.substring(file.indexOf('/') + 1)

      // Get filenames to compare.
      const workingFilename = path.join(workingDir, file)
      const goldenFilename = path.join(goldenDir, file)

      // If the file doesn't exist in the source, just ignore it.
      fs.exists(goldenFilename, (err) => {
        if (!err) {
          console.log(`SKIPPING. Found file ${workingFilename} in working directory that does not exist in the source.`)
        }
        else {
          fc(workingFilename, goldenFilename, (isEqual) => {
            if (!isEqual) {
              console.log(`UNIQUE. Found file ${workingFilename} has diverged from ${goldenFilename}.`)
            }
            else {
              fs.unlink(workingFilename, (err) => {
                console.log(`DUPLICATE. Found file ${workingFilename} is identical to ${goldenFilename}.`)
              })
            }
          })
        }
      })
    }
  })
}