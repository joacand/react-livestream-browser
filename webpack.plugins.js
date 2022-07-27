const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');

module.exports = [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin(),
    new CspHtmlWebpackPlugin({
        'object-src': '\'none\'',
        'base-uri': '\'self\'',
        'script-src': ['\'unsafe-inline\'', '\'self\'', '\'unsafe-eval\''],
        'worker-src': ['\'self\'', 'blob:'],
        'img-src': ['*', '\'unsafe-inline\'', 'data:'],
    })
];
