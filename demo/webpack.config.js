require('dotenv').config()
const RemovePlugin = require('remove-files-webpack-plugin')
const GlorybookPlugin = require("./../index")

module.exports = {
    mode: 'development',
    node: {
        fs: 'empty'
    },
    plugins: [
        // new GlorybookPlugin({
        //     space: process.env.SPACE || 'your space id',
        //     accessToken: process.env.ACCESS_TOKEN || 'your access token',
        // }),
        new RemovePlugin({
            after: {
                include: ['dist'],
                log: false
            },
        }),
    ]
};
