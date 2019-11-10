const {
  RICH_TEXT,
  IMAGE,
  VIDEO,
} = require('./constants')
const {
  documentToHtmlString
} = require('@contentful/rich-text-html-renderer')

function asHTML(pageContent) {
  if (pageContent.name === RICH_TEXT) {
    return documentToHtmlString(pageContent.content)
  }
  if (pageContent.name === IMAGE) {
    return `<img src="${ pageContent.content.url }" alt="${ pageContent.content.alt }" />`
  }
  if (pageContent.name === VIDEO) {
    return `<video><source src="${ pageContent.content.url }" type="${ pageContent.content.type }" /></video>`
  }
}

function MetaTag(name) {
  return `<Meta title="${ name }" />`
}

function concatWithNewline(...content) {
  return content.reduce((acc, cur) => acc + cur + '\n\n', '')
}

function addSlash(string) {
  const slash = '/'

  if (string.charAt(0) != slash) {
    return slash + string
  }
  return string
}

const removeProperties = (...dyProps) => (fromObj) => dyProps.reduce((acc, cur) => {
  const {
    [cur]: _, ...rest
  } = acc
  return rest
}, fromObj)

module.exports = {
  asHTML,
  MetaTag,
  concatWithNewline,
  addSlash,
  removeProperties,
}
