const fs = require('fs')
const {
  addSlash
} = require('./utils')

const toKebabCase = str => str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()
const toCamelCase = str => str.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()).replace(/\s+/g, '')

// takes info of where to put the file,
// and a string: 'content' which is the file content
module.exports = function makeFile({
  path,
  dir,
  name,
  content,
  ext,
  camelCase,
  fullPathOutput,
  nestedOutput,
}) {
  const pathAndFilename = name.split('/')
  const formattedPath = camelCase ? pathAndFilename.map(toCamelCase) : pathAndFilename.map(toKebabCase)
  const pathArr = formattedPath.slice(0, -1).map(addSlash)

  const getFilename = () => addSlash(formattedPath.slice(-1).pop())
  const getFilenameIncludingSubPath = () => addSlash(formattedPath.join('-'))
  const getAbsolutePath = (deep) => deep ? [path, dir, ...pathArr].join('') : [path, dir].join('')
  const fileNameStr = fullPathOutput ? getFilenameIncludingSubPath() : getFilename()

  const getAbsolutePathIncludingFilename = (absFolderPath) => [absFolderPath, fileNameStr, ext].join('')

  const absPath = getAbsolutePath(nestedOutput)
  const absFilename = getAbsolutePathIncludingFilename(absPath)

  fs.mkdir(absPath, {
    recursive: true
  }, (err) => {
    fs.writeFile(absFilename, content, (err) => {
      if (err) {
        console.log(`GlorybookPlugin couldn't create the folder. This is probably due to the node version being <10.13. ${ err }`)
        return
      }

      console.log('\n', '\x1b[32m', `GlorybookPlugin: created file ${ absFilename }`)
    })
  })
}