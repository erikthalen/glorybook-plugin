![Image of contentful-, webpack- and storybook logo](https://i.ibb.co/1LpNxmJ/image.jpg)
# Glorybook

A webpack plugin to use in conjunction with [@storybook/addons-docs](https://github.com/storybookjs/storybook/tree/master/addons/docs).  

Will take your contentful data and turn it into a markdown file that storybook can read.

## Install

```bash
npm i --save-dev glorybook
```

```bash
yarn add --dev glorybook
```

## Usage

The plugin will fetch data from the supplied contentful space, and output .mdx-files inside your webpack /src-folder.
By default the created files are put in a subfolder named `/contentful`.

*Be sure to not expose your space/access token in your public code*

**webpack.config.js**
```javascript
const GlorybookPlugin = require("glorybook");

module.exports = {
  plugins: [
    new GlorybookPlugin({
      space: 'contentful space id', // required
      accessToken: 'contentful access token' // required
    })
  ]
}
```

## Example

This setup in your contentful content model:  
![Screenshot of contentful UI](https://i.ibb.co/kMWqPhf/contentful-screen.jpg)

Will output this in storybook:  
![Screenshot of storybook UI](https://i.ibb.co/Myv1vRP/storybook-screen.jpg)

With a file structure like this:
```
📦src
 ┗ 📂contentful
   ┗ 📂parent
     ┗ 📂child-folder
       ┗ 📜nested-page.stories.mdx
```

**The plugin can currently handle**
- Rich text
- Images (single)
- Videos (single)
- Referenced content, including all of the above

## Options

| Name             | Type       | Default         | Description                                                                                                                    |
| ---------------- | ---------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `environment`    | `{String}` | `'master'`      | Defines what contentful environment you want to get data from.                                                                 |
| `srcFolder`      | `{String}` | `'/src'`        | Defines where your src-folder lives.                                                                                           |
| `subFolder`      | `{String}` | `'/contentful'` | Defines where the generated files will be put, inside the `srcFolder`                                                          |
| `contentTypeId`  | `{String}` | `'page'`        | The id of your contentful pages that you like to fetch                                                                         |
| `additionalHead` | `{String}` | `''`            | If you have more content you like to paste in the top of every file                                                            |
| `camelCase`      | `{Bool}`   | `false`         | If you want the generated files to be named in in camelCase. When `false`, they will be in kebab-case                          |
| `fullPathOutput` | `{Bool}`   | `false`         | When the page is nested, this will keep the full relative path in the filename. When `false`, only the last part will be kept. |
| `nestedOutput`   | `{Bool}`   | `true`          | If the files should be placed in folders just like in storyfull. `false` will place all files in the,un-nested , `subFolder`   |
| `labelDefinedBy` | `{String}` | `'label'`       | The id your contentful entry that defines label the file will be placed under                                                  |
| `pathDefinedBy`  | `{String}` | `'path'`        | The id your contentful entry that defines what path/filename the file will get                                                 |
  

---

## Dev-notes

The `/demo`-folder is used for previewing any test output during development of this plugin.  
This folder has a copy of storybook installed in order for us to run the plugin and have a real-world environment to sandbox in.  

For getting started with building on this project, run:
```bash
yarn inst
```
This will install all dependencies needed for both the plugin, and the demo environment.  

When any changes are made ...
```bash
yarn build
```
... will output files, applying the passed options specified in the `webpack.config.js`  

```bash
yarn demo
```
Can be run in order to build and startup the storybook inside `/demo`. This is currently used for testing. In a very WYSIWYG-fashion.
