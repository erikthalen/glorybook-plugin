const util = require('util')
const { FILE_HEAD } = require('./constants')
const {
  MetaTag,
  asHTML,
  concatWithNewline
} = require('./utils')

// returns a single string containing one whole mdx file,
// including the storybook-related imports and meta tag
module.exports = function createMdxFile(head, {
  label,
  path,
  ...content
}) {
  const metaString = label ? label + '|' + path : path
  const metaTag = MetaTag(metaString)
  const tags = content.pageContent.map(asHTML)

  // head-block, <meta> and all page content tags converted into a single string
  const fileAsString = concatWithNewline(FILE_HEAD, head, metaTag, ...tags)

  // return page string and file name
  return {
    name: path,
    data: fileAsString
  }
}
