const HtmlWebpackPlugin = require("html-webpack-plugin");
// 代码混淆插件
module.exports = {
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index-prod.html'
        })
    ]

}
