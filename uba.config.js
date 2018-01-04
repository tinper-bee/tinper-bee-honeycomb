const path = require("path");
const React = require("react");
const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const glob = require('glob');
const entries = {};
const chunks = [];
const prodEntries = {};
const prodChunks = [];
const svrConfig = {
  host: "127.0.0.1",
  port: 3002
};

const proxyConfig = [{
  enable: false,//如果为true那么就是启用代理，mock会失效，为false的时候代理失效，mock生效
  router: "/",
  url: "http://123.103.9.206:7100",
  //url: "http://o2zmygn5.c87e2267-1001-4c70-bb2a-ab41f3b81aa3.app.yyuap.com",
  // url: "http://localhost:4000",
  options: {
    filter: function (req, res) {
      return (req.url.indexOf("webpack_hmr") > -1 ? false : true);
    }
  }
}];


const staticConfig = {
  folder: "src"
};

glob.sync('./src/pages/**/index.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/index.js')[0];
  entries[chunk] = [path, hotMiddlewareScript];
  chunks.push(chunk);
});
glob.sync('./src/pages/**/index.js').forEach(path => {
  const chunk = path.split('./src/pages/')[1].split('/index.js')[0];
  prodEntries[chunk] = [path, hotMiddlewareScript];
  prodChunks.push(chunk);
});

var devConfig = {
  devtool: '',
  entry: entries,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'assets/js/[name].js',
    publicPath: '/'
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "react-router-dom": "ReactRouterDOM",
    "fetch-jsonp": "fetchJsonp",
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,
      exclude: /(node_modules)/,
      include: path.resolve('src'),
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader','postcss-loader'],
        fallback: 'style-loader'
      })
    }, {
      test: /\.less$/,
      exclude: /(node_modules)/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader', 'postcss-loader', 'less-loader'],
        fallback: "style-loader",
      })
    }, {
      test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
      exclude: /favicon\.png$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'assets/images/[name].[hash:8].[ext]'
        }
      }]
    },
      {
        test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/fonts/[name].[hash:8].[ext]'
          }
        }]
      }]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'vendors',
      filename: 'assets/js/vendors.js',
      chunks: chunks,
      minChunks: chunks.length
    }),
    new ExtractTextPlugin({
      filename: 'assets/css/[name].css',
      allChunks: true
    }),
    new OpenBrowserPlugin({
      url: `http://${svrConfig.host}:${svrConfig.port}`
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    extensions: [
      '.js', 'jsx'
    ],
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      containers:path.resolve(__dirname, 'src/containers/'),
      honeyAssets: path.resolve(__dirname, 'src/assets/'),
      combs:path.resolve(__dirname, 'src/comb/'),
      mock:path.resolve(__dirname, 'mock/')
    }
  }
}

var prodConfig = {
  // devtool: 'cheap-source-map',
  devtool: 'cheap-module-source-map',
  entry: prodEntries,
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'assets/js/[name].js',
    publicPath: '/'
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "react-router-dom": "ReactRouterDOM",
    "fetch-jsonp": "fetchJsonp",
  },
  module: {
    rules: [{
      test: /\.js[x]?$/,
      exclude: /(node_modules)/,
      include: path.resolve('src'),
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader','postcss-loader'],
        fallback: 'style-loader'
      })
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        use: ['css-loader', 'postcss-loader', 'less-loader'],
        fallback: 'style-loader'
      })
    }, {
      test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
      exclude: /favicon\.png$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 7000,
          name: 'assets/images/[name].[hash:8].[ext]'
        }
      }]
    }, {
      test: /\.(eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'assets/fonts/[name].[hash:8].[ext]'
        }
      }]
    }]
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'vendors',
      filename: 'assets/js/vendors.js',
      chunks: prodChunks,
      minChunks: prodChunks.length
    }),
    new ExtractTextPlugin({
      filename: 'assets/css/[name].css',
      allChunks: true
    }),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  resolve: {
    extensions: [
      '.js', 'jsx'
    ],
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      containers:path.resolve(__dirname, 'src/containers/'),
      honeyAssets: path.resolve(__dirname, 'src/assets/'),
      combs:path.resolve(__dirname, 'src/comb/'),
      mock:path.resolve(__dirname, 'mock/')
    }
  }
}



glob.sync('./src/pages/**/index.html').forEach(paths => {
  const chunk = paths.split('./src/pages/')[1].split('/index.html')[0];

  const filename = chunk + '.html';
  let App = '';let reactString = '';


  const htmlConf = {
    filename: filename,
    template: paths,
    inject: 'body',
    hash: false,
    chunks: ['vendors', chunk]
  }

  devConfig.plugins.push(new HtmlWebpackPlugin(htmlConf));
});



glob.sync('./src/pages/**/index.html').forEach(paths => {
  const chunk = paths.split('./src/pages/')[1].split('/index.html')[0];
  const filename = chunk + '.html';
  let App = '';let reactString = '';


  const htmlConf = {
    filename: filename,
    template: paths,
    inject: 'body',
    hash: true,
    chunks: ['vendors', chunk]
  }
  prodConfig.plugins.push(new HtmlWebpackPlugin(htmlConf));
});

module.exports = {
  devConfig: devConfig,
  prodConfig: prodConfig,
  svrConfig: svrConfig,
  proxyConfig: proxyConfig,
  staticConfig: staticConfig
};
