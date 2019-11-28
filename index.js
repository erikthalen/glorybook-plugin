const util = require('util')
const defaults = require('./lib/defaults')
const modelData = require('./lib/model-data')
const getContentfulPages = require('./lib/api')
const makeMdxString = require('./lib/make-mdx-string')
const makeFile = require('./lib/make-file')
const {
  addSlash,
  removeProperties
} = require('./lib/utils')

// Run in client -> no way of letting GlBook handle the fetching.
// 
// therefore:
// 
// 1. external server requests CF json data,
//    and declares it to global var/exported module.
// 2. GlBook listens for when data is available,
//    and runs "it's thing" then and only then. (on pageload in the client)
// 3. SB sees the "pages" and creates a menu with content.
//
// note: find a way to async get data into glbook
// note: can't use node/fs to create files. can addon-docs find pages another way?
// note: should glbook run on each page refresh, then how? (export itseft as a function into static-storybook?)
// note: order is important:
//         -> first get data
//         -> then run GlBook
//         -> last SB!


module.exports = class GlorybookPlugin {
  constructor(options = {}) {
    Object.assign(this, defaults, options)
    
    this.srcFolder = addSlash(this.srcFolder)
    this.subFolder = addSlash(this.subFolder)
  }
  apply(compiler) {
    compiler.hooks.beforeRun.tap("GlorybookPlugin", async stats => {
      // path to your project's src folder
      const SRC_FOLDER = stats.context + this.srcFolder

      // unstructured data from contentful
      const contentfulData = await getContentfulPages(this.space, this.accessToken, this.environment, this.contentTypeId)
      
      // if (!USE_MOCK_DATA) {
      //   backupData(stats.context + '/data/mock-data.js', JSON.stringify(contentfulData))
      // }

      //console.log(util.inspect(contentfulData, true, 99, true))

      if(!contentfulData) {
        console.log(`GlorybookPlugin didn't recieve any data, and will not run :/`)
        return
      }

      // filter the data a bit (f.ex. remove 'sys' data)
      const pages = contentfulData.items.map(page => page.fields)

      // sort out the data
      const modeledPages = pages.map((page) => {
        const label = page[this.labelDefinedBy]
        const path = page[this.pathDefinedBy]
        const content = removeProperties(this.labelDefinedBy, this.pathDefinedBy)(page)
        
        return modelData({
          label,
          path,
          ...content
        })
      })

      // each page ready to make a file out of
      const mdxObject = modeledPages.map(page => makeMdxString(this.additionalHead, page))

      // take each page-string and create a file from it
      mdxObject.forEach(page => makeFile({
        path: SRC_FOLDER,
        dir: this.subFolder,
        name: page.name,
        content: page.data,
        ext: '.stories.mdx',
        camelCase: this.camelCase,
        fullPathOutput: this.fullPathOutput,
        nestedOutput: this.nestedOutput
      }))
    })
  }
}
