const path = require('path')
module.exports = {
  entry: path.join(__dirname, 'src/components', 'index.js'),
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    hot: true,
    historyApiFallback: true
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'build.js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader','css-loader'],
        include: [/src/, /node_modules/]
      }, {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      }, {
        test: /\.json$/,
        loader: 'json-loader',
        include: '/build/contracts/'
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        loader: 'url-loader?limit=100000' }
    ]
  }
}