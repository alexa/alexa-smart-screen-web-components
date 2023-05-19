/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const SRC = path.resolve(__dirname, 'src');
const DEST = path.resolve(__dirname, 'dist');

function getMainEntries(addWebComponentsJs) {
  let  mainEntries = ['./main.ts'];
  if(addWebComponentsJs){
    mainEntries.push('@webcomponents/webcomponentsjs/webcomponents-bundle');
  }
  return mainEntries;
}

module.exports = (env) => {
  const LOG_LEVEL = (['DEBUG', 'WARN', 'ERROR', 'INFO'].includes(env.LOG_LEVEL)) ? env.LOG_LEVEL : 'WARN';
  const DISABLE_WEBSOCKET_SSL = env.DISABLE_WEBSOCKET_SSL ? env.DISABLE_WEBSOCKET_SSL === 'true' : true;
  const ENABLE_BINDER_CLIENT = env.ENABLE_BINDER_CLIENT === 'true';
  const ENABLE_TRANSFORM_KEY_CODES = env.ENABLE_TRANSFORM_KEY_CODES === 'true';
  const ENABLE_LIVE_VIEW_CAMERA = env.ENABLE_LIVE_VIEW_CAMERA === 'true';
  const DEBUG_LIVE_VIEW_CAMERA_UI = env.DEBUG_LIVE_VIEW_CAMERA_UI === 'true';

  return { 
    context: SRC,
    entry: {
      main : getMainEntries(ENABLE_BINDER_CLIENT)
    },
    output: {
      clean: true,
      filename: '[name].bundle.js',
      path: DEST,
      publicPath : ''
    },
    resolve: {
      modules: [
        'node_modules',
      ],
      extensions: ['.ts', '.js', '.json', '.css'],
      symlinks: true,
    },
    plugins: [
      new HtmlWebPackPlugin({
        title: 'Alexa Smart Screen Sample App'
      }),
      new webpack.DefinePlugin({
        LOG_LEVEL: JSON.stringify(LOG_LEVEL),
        DISABLE_WEBSOCKET_SSL: JSON.stringify(DISABLE_WEBSOCKET_SSL),
        ENABLE_BINDER_CLIENT: JSON.stringify(ENABLE_BINDER_CLIENT),
        ENABLE_TRANSFORM_KEY_CODES: JSON.stringify(ENABLE_TRANSFORM_KEY_CODES),
        ENABLE_LIVE_VIEW_CAMERA: JSON.stringify(ENABLE_LIVE_VIEW_CAMERA),
        DEBUG_LIVE_VIEW_CAMERA_UI: JSON.stringify(DEBUG_LIVE_VIEW_CAMERA_UI)
      })
    ],
    module: {
      rules: [
        {
          test: /\.(tsx?)|(jsx?)$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              rootMode: 'upward',
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf|wav)$/,
          type: 'asset/resource'
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: true },
            },
          ],
        },
      ]
    },
  }
};
