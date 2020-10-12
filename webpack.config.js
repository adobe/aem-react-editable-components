/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'source-map';

console.log('Building for:', mode);

module.exports = {
  entry: './src/types.ts',
  mode,
  devtool,
  output: {
    globalObject: `(function(){ try{ return typeof self !== 'undefined';}catch(err){return false;}})() ? self : this`,
    path: path.resolve(__dirname, 'dist'),
    filename: 'aem-react-editable-components.js',
    library: 'aemReactEditableComponents',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.ts$|\.tsx$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'ts-loader'
        },
        enforce: 'post'
      }
    ]
  },
  externals: [
    nodeExternals({
        modulesFromFile: { exclude: [ 'dependencies' ] }
    })
  ],
  resolve: {
    extensions: [ '.ts', '.tsx' ]
  },
  plugins: [ new CleanWebpackPlugin() ]
};
