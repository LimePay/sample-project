var path = require('path');
var outputFile = `with-module-lib.min.js`;

var config = {
    entry: path.join(__dirname, '/index.js'),
    output: {
        path: path.join(__dirname, '/'),
        filename: outputFile,
        library: 'LimePayASModule',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    optimization: {
        minimize: true
    }
};

module.exports = config;