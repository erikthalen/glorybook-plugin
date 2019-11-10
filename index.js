const util = require('util')
const modelData = require('./lib/model-data')
const getContentfulPages = require('./lib/api')
const makeMdxString = require('./lib/make-mdx-string')
const makeFile = require('./lib/make-file')
const {
  addSlash,
  removeProperties
} = require('./lib/utils')
const backupData = require('./lib/backup-data')
const mockData = require('./demo/data/mock-data')

const USE_MOCK_DATA = false

module.exports = class GlorybookPlugin {
  constructor(options = {}) {
    const defaults = {
      srcFolder: '/src',
      subFolder: '/contentful',
     
      environment: 'master',
      contentTypeId: 'page',
      labelDefinedBy: 'label',
      pathDefinedBy: 'path',
      
      additionalHead: '',
      camelCase: false,
      fullPathOutput: false,
      nestedOutput: true,
    }

    Object.assign(this, defaults, options)
    this.srcFolder = addSlash(this.srcFolder)
    this.subFolder = addSlash(this.subFolder)
  }
  apply(compiler) {
    compiler.hooks.beforeRun.tap("GlorybookPlugin", async stats => {
      // path to your project's src folder
      const SRC_FOLDER = stats.context + this.srcFolder
      // unstructured data from contentful
      const contentfulData = USE_MOCK_DATA ? mockData : await getContentfulPages(this.space, this.accessToken, this.environment, this.contentTypeId)
      
      if (!USE_MOCK_DATA) {
        //backupData(stats.context + '/data/mock-data.js', JSON.stringify(contentfulData))
      }

      //console.log(util.inspect(contentfulData, true, 99, true))

      if(!contentfulData) return

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
