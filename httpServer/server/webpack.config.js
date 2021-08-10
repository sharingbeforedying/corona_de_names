//webpack.config.js
const webpack = require('webpack');
const path    = require('path');


const commonConfig = {
  //common Configuration
  module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
      },
      { test: /\.html$/, use: "html-loader" },
      { test: /\.css$/, use: "css-loader" }
    ]
  },
  devtool: "#inline-source-map",
};

const jqueryConfig = Object.assign({}, commonConfig, {
  name: "jquery",

  entry: [
    path.resolve(__dirname, "../node_modules/jquery/dist/jquery.min.js"),
  ],
  output: {
     path: path.resolve(__dirname,"./dist"),
     filename: "jquery.bundle.js"
  },
  module: {
    rules: [
      // any other rules
      {
        // Exposes jQuery for use outside Webpack build
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        },{
          loader: 'expose-loader',
          options: '$'
        }]
      }
    ]
  },
  plugins: [
    // Provides jQuery for other JS bundled with Webpack
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],

});

const bootstrapConfig = Object.assign({}, commonConfig, {
  name: "bootstrap",

  // entry: require('angular'), //not working
  // entry: path.resolve(__dirname, "../node_modules/angular/angular"),

  entry: [
    path.resolve(__dirname, "../node_modules/popper.js/dist/popper.min.js"),
    path.resolve(__dirname, "../node_modules/bootstrap/dist/js/bootstrap.min.js"),
  ],

  output: {
     path: path.resolve(__dirname,"./dist"),
     filename: "bootstrap.bundle.js"
  },

});

const bootstrapCSSConfig = Object.assign({}, commonConfig, {
  name: "bootstrapCSS",

  // entry: require('angular'), //not working
  // entry: path.resolve(__dirname, "../node_modules/angular/angular"),

  entry: [
    path.resolve(__dirname, "../node_modules/bootstrap/dist/css/bootstrap.min.css"),
  ],

  output: {
     path: path.resolve(__dirname,"./dist"),
     filename: "bootstrap.bundle.css"
  },

});

const angularConfig = Object.assign({}, commonConfig, {
  name: "angular",

  entry: [
    //angular
    path.resolve(__dirname, "../node_modules/angular/angular.min.js"),

    //ui.bootstrap
    path.resolve(__dirname, "../node_modules/angular-animate/angular-animate.min.js"),
    path.resolve(__dirname, "../node_modules/angular-touch/angular-touch.min.js"),
    // path.resolve(__dirname, "../node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js"),
    // path.resolve(__dirname, "../node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js"),
    path.resolve(__dirname, "../node_modules/ui-bootstrap4/dist/ui-bootstrap-tpls.js"),


    //ui.router
    path.resolve(__dirname, "../node_modules/@uirouter/core/_bundles/ui-router-core.min.js"),
    path.resolve(__dirname, "../node_modules/@uirouter/angularjs/release/ui-router-angularjs.min.js"),
  ],

  output: {
     path: path.resolve(__dirname,"./dist"),
     filename: "angular.bundle.js"
  },

});

// const appConfig = Object.assign({}, commonConfig,{
//   name: "app",
//   entry: path.resolve(__dirname, "./app/app.js"),
//   output: {
//      path: path.resolve(__dirname,"./bin"),
//      filename: "app.bundle.js"
//   },
// });

// Return Array of Configurations
module.exports = [
  jqueryConfig,
  // bootstrapConfig,
  // bootstrapCSSConfig,
  angularConfig,

  //appConfig,
];
