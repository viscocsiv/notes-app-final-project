const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "src/app.js"),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
    assetModuleFilename: "assets/[name][ext][query]",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
      filename: "index.html",
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, "src/assets"),
          to: path.join(__dirname, "dist/assets"),
        },
      ],
    }),

    new FaviconsWebpackPlugin({
      logo: path.join(__dirname, "src/assets/images/notes-logo.png"),
      outputPath: "assets/favicons",
      inject: false,
      favicons: {
        appName: "Notes App",
        appShortName: "Notes",
        appDescription: "Notes application",
        developerName: "Your Name",
        developerURL: null,
        background: "#ffffff",
        theme_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        version: "1.0",
      },
    }),
  ],
  performance: {
    maxAssetSize: 200000, // Set the size limit to 200KB
    maxEntrypointSize: 400000, // Set the limit for entry points
    hints: "warning", // Change to 'error' to enforce limits
  },
};
