const path = require('path');

module.exports = {
    mode: 'production',
    entry: './onload-list.ts',
    output: {
        filename: 'onload-list.js',
        path: path.resolve(__dirname, '../js'),
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
};