const util = require('util')
const {
    RICH_TEXT,
    IMAGE,
    VIDEO
} = require('./constants')

const isRichText = block => (block.nodeType === 'document')
const isImage = block => (block && block.file && block.file.contentType && block.file.contentType.includes('image'))
const isVideo = block => (block.fields && block.fields.file && block.fields.file.contentType && block.fields.file.contentType.includes('video'))
const isReference = block => Array.isArray(block)
const isSingleReference = block => block.fields

const flatten = (a, b) => a.concat(b)

function asArray(obj) {
    return Object.entries(obj)
}

function richText(block) {
    return {
        name: RICH_TEXT,
        content: block
    }
}

function image(block) {
    return {
        name: IMAGE,
        content: {
            url: block.fields.file.url,
            alt: block.fields.description
        }
    }
}

function video(block) {
    return {
        name: VIDEO,
        content: {
            url: block.fields.file.url,
            type: block.fields.file.contentType
        }
    }
}

function reference(block) {
    return block.map(item => handleObject(item.fields)).reduce(flatten, [])
}

function singleReference(block) {
    return handleObject(block.fields)
}

function handleContent([name, content]) {
    return (
        isRichText(content) ?
        richText(content) :
        isImage(content.fields) ?
        image(content) :
        isVideo(content) ?
        video(content) :
        isReference(content) ?
        reference(content) :
        isSingleReference(content) ?
        singleReference(content) :
        content
    )
}


function handleObject(data) {
    //console.log(util.inspect(data, true, 99, true))
    const arr = !Array.isArray(data) ? asArray(data) : data
    
    return arr.map(handleContent).reduce(flatten, [])
}

function model({
    label,
    path,
    ...content
}) {
    return {
        label,
        path,
        pageContent: handleObject(content)
    }
}

module.exports = model
