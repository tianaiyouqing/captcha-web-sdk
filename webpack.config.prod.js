const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
// 代码混淆插件
module.exports = {
    externals: {
        jquery: 'jQuery'
    },
    output: {
        filename: "tac.min.js",
        path: path.resolve(__dirname, "./dist")
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index-prod.html'
        })
    ]

}
