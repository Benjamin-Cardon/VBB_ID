const path = require("path");

module.exports = {
  entry: {
    librarian: "./client/librarian.tsx",
    admin: "./client/admin.tsx",
    data: "./client/data.tsx"
  }
  ,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }, {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
    ],
  },
  mode: "development",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, "public"),
  },
};