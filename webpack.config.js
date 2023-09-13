const webpack = require('webpack')
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //抽离CSS为独立文件的插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 打包html，自动引入css和js文件
const {CleanWebpackPlugin} = require('clean-webpack-plugin') // 打包清理插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: "./src/index.js",
    output: {
        filename: "tac.js",
        path: path.resolve(__dirname, "./dist")
    },
    externals: {
        jquery: 'jQuery'

    },

    resolve: {
        alias: {
            "@": path.join(__dirname, "./src") // 这样@符号就表示项目根目录中src这一层路径
        }
    },
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                // use: ['style-loader', 'css-loader']
            },
            {
                test: /\.s[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        esModule: false,
                        name: '[name].[ext]',
                        outputPath: 'images'
                    }
                },
                type: 'javascript/auto'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    //  预设babel做怎样的兼容性处理
                    presets: ['@babel/preset-env']
                }
            }
        ]
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new MiniCssExtractPlugin({
            // 指定抽离的之后形成的文件名
            // filename: 'styles/[name]_[contenthash:8].css'
            filename: 'styles/tac.css'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './public/index.html'
        }),
        new CleanWebpackPlugin()
    ],
    devServer: {
        // 开发时可直接访问到 ./public 下的静态资源，这些资源在开发中不必打包
        port: 3000,
        static: "./dist"
    }

}
