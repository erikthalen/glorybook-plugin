const contentful = require('contentful')

// fetches data from contentful and returns all pages with correct ID
module.exports = getContentfulPages = (space, accessToken, environment, contentTypeId) => (
    contentful.createClient({
        space,
        environment,
        accessToken
    }).getEntries({
        'content_type': contentTypeId
    }).catch(err => {
        if (err.response.status === 400) {
            console.log("\x1b[41m%s\x1b[0m", `- GloryBookPlugin: Didn't find any pages. Error code: ${ err.response.status }`)
            console.log("\x1b[41m%s\x1b[0m", `- GloryBookPlugin: Check that the supplied 'contentTypeId' is the same as the contentful content type ID that you like to fetch.`)
        }
        else if (err.response.status === 401) {
            console.log("\x1b[41m%s\x1b[0m", `- GloryBookPlugin: Couldn't verify access to your space. Error code: ${ err.response.status }`)
            console.log("\x1b[41m%s\x1b[0m", `- GloryBookPlugin: Check that the supplied 'accessToken' is correct`)

        }
        else if (err.response.status === 404) {
            console.log("\x1b[41m%s\x1b[0m", `- GloryBookPlugin: Couldn't find space. Error code: ${ err.response.status }`)
            console.log("\x1b[41m%s\x1b[0m", `- GloryBookPlugin: Please check so the supplied 'space' is correct`)
        }
        else {
            console.log("\x1b[41m%s\x1b[0m", `- GloryBookPlugin. Error code: ${ err.response.status }`)
        }
    })
)
