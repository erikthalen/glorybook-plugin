const fs = require('fs')

module.exports = (name, content) => fs.writeFile(name, `module.exports = ${content}`, (err) => {
    if (err) throw err

    console.log('\x1b[32m', `Created a backup file! :)`)
})