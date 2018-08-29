var path = require('path');

var withCoverage = process.env.NODE_ENV === 'test';

module.exports = {
    entry: './index.js',
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'cq-react-editable-components.js',
        library: 'cqReactEditableComponents',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$|\.jsx$/,
                exclude: /(node_modules|dist)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["env", "react", "stage-2"]
                    }
                },
                enforce: 'post',
            }].concat(withCoverage ?
            {
                test: /\.js$|\.jsx$/,
                include: path.resolve(__dirname, 'src'),
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: {
                        esModules: true,
                        presets: ["env", "react", "stage-2"]
                    }
                },
                enforce: 'post'
            } : [])
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    }
};