const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: './src/index.js',
    context: process.cwd(),
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jcmonitor.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        // before  express 服务器
        before(router) {
            router.get('/success', (req, res) => {
                res.json({id:1});//200
            });
            
            router.post('/error', (req, res) => {
                res.sendStatus(500);//200
            });
        }, 
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'head'
        })
    ]

}