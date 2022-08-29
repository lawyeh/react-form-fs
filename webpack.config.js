// importing module called path, by default node has this built-in module, it allows us to manipulate and deal with current directory paths, 
// since each different system has their own unique path
const path = require('path');
// dev-dependency, it injects the bundled script into the desired html page
const HTMLWebpackPlugin = require('html-webpack-plugin');
/*
    "dev": "concurrently \"cross-env NODE_ENV=development webpack-dev-server --open --hot --progress --color \" \"cross-env nodemon ./server/server.js\"",
    
    -NODE_ENV will be a key and you assign it a value which will be part of the process.env object
    -Concurrently allows you to run multiple threads at the same time easily
    -"--" is injecting configs to webpack-dev-server
*/
module.exports = {
  // NOT something node has.  We as developers have this variable setup.  PROCESS IS AN OBJECT.  for ex. NPM RUN DEV
  // WEBPACK ONLY KNOWS TWO THINGS, DEVELOPMENT OR PRODUCTION for the mode!!!!
  mode: process.env.NODE_ENV,
  entry: './client/index.js',
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        // question mark indicates, include, js, or jsx, and the dollar sign is if you see the matching phrase at the end of paragraph or line
        test: /jsx?$/,
        // dont include node_modules folder
        exclude: /node_modules/,
        // loader when we have presets/plugsin etc and its a SINGLE LOADER
        loader: 'babel-loader',
        options: {
          // if you see any ES6 syntax OR if you see any react code, transform code into browser friendly code
          presets: ['@babel/env', '@babel/react'],
          // ******Plugins-tranform-runtime, converts javascript while running the code, this is for PERFORMANCE PURPOSES *******
          plugins: [
            '@babel/plugin-transform-runtime',
            //When we have async function, converts it to generated function, this is sometimes for compatibility
            '@babel/transform-async-to-generator',
          ],
        },
      },
      {
        test: /css$/,
        exclude: /node_modules/,
        //we use "use" because its multiple loaders, style-loader injects style into markup
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          //allows us to utilize/import these files into our javascript file, including images
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
    ],
  },

  //****ALLOWS US TO INJECT BUNDLED JAVASCRIPT INTO OUR HTML PAGE*****
  plugins: [new HTMLWebpackPlugin({ template: './client/index.html' })],

  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true,
    //automatically opens the browser upon running command
    open: true,
    //allows us to compress the bundled file further down
    compress: true,
    //maintains a longer connection, making any changes in our javascript file reflect quick because of this websocketserver
    webSocketServer: 'ws',
    //fallbacks to localhost, if you're route is not valid
    historyApiFallback: true,
    //if we have assets and other static files, images, etc, it will redirect to this path
    static: {
      directory: path.join(__dirname, 'build'),
      publicPath: '/',
    },
    // without this headers, the front end and backend cannot communicate(handshake), this allows for CORS policy
    headers: { 'Access-Control-Allow-Origin': '*' },

    // any request to http://localhost:8080/api/..... will be redirected to 'http://localhost:3000'
    // any request to http://localhost:8080/assets/..... will be redirected to 'http://localhost:3000'
    proxy: {
      '/api/**': {
        target: 'http://localhost:3000',
        secure: false,
      },
      '/assets/**': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
    //it checks everyfile that has been changed, it will re-run the server, in this case, it will watch the client folder
    watchFiles: ['client'],
  },
  // we dont have to state file extensions during import
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
