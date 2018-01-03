module.exports = function (env) {
  var config = {
    entry: './src/client/index.ts',
    output: {
      path: __dirname + '/public',
      filename: 'client.js'
    },
    externals: {
      "tone": "Tone",
      "lodash": "_",
      "lz-string": "LZString",
      "gcc": "gcc",
      "locate-print": "lp"
    },
    resolve: {
      extensions: ['.ts', '.js'],
      modules: ['node_modules', 'web_modules']
    },
    devServer: {
      contentBase: 'public',
      proxy: {
        '/api/**': {
          target: 'http://localhost:3000'
        }
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /(node_modules|web_modules)/,
          loader: 'awesome-typescript-loader'
        }
      ]
    }
  };
  if (env == null || !env.build) {
    config.devtool = 'source-map';
  }
  return config;
}
