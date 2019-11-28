require('dotenv').config()
const GlorybookPlugin = require("./../../index")

module.exports = async ({
    config,
    mode
}) => {
    config.plugins.push(
        new GlorybookPlugin({
            runtime: true,
            json: '',
        })
    )
    return config;
}