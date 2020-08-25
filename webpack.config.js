var path = require('path');
var nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isEnvironmentTest = process.env.NODE_ENV === 'test';

module.exports = {
    entry: './src/aem-react-editable-components.ts',
    mode: 'development',
    devtool: 'source-map',
    output: {
        globalObject: `typeof self !== 'undefined' ? self : this`,
        path: path.resolve(__dirname, 'dist'),
        filename: 'aem-react-editable-components.js',
        library: 'cqReactEditableComponents',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.ts$|\.tsx$/,
                exclude: /(node_modules|dist)/,
                use: 'ts-loader',
                enforce: 'post',
            }
        ]
    },
    externals: [
        isEnvironmentTest ? '' : nodeExternals({
            modulesFromFile: {
                exclude: ['dependencies']
            }
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx']
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
};
