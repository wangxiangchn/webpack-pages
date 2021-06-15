const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const routes  = require("./routes.js");

const getEntry = ()=>{
  let entryData = {};

  routes.forEach(item=> {
    entryData[item.name] = `./src/pages/${item.name}/index.js`;
  });

  return entryData;
};

const getHtmlWebpackPlugin = () => {
  const htmlWebpackPluginList = [];
  routes.forEach(item=> {
    const meta = item.meta || {};
    htmlWebpackPluginList.push(
      new HtmlWebpackPlugin({
        title: item.title || 'webpack-pages',
        meta:{
          keywords: meta.keywords ||  "webpack，react，github",
          description: meta.description || "这是一个webpack，react多页面架构"
        },
        chunks:[item.name], //引入的js
        template: "./template.html",
        filename : `${item.name}/index.html`, //html位置
        minify:{//压缩html
          collapseWhitespace: true,
          preserveLineBreaks: true
        },
      })
    )
  });
  return htmlWebpackPluginList;
}

module.exports = (env, argv) => ({
  entry: getEntry,
	output: {
		path: path.join(__dirname, "dist"),
    filename: "[name]/index.js",
	},
  module: {
    rules: [
      {
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader:"babel-loader",
					options:{
						presets: [
							"@babel/preset-env",
							"@babel/preset-react",
							{"plugins": ["@babel/plugin-proposal-class-properties"]}
						], 
					}
				},
      },
      {
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
				exclude: /node_modules/,
			},
      {
				test: /\.(less|css)$/,
				use: [
					argv.mode == "development" ? { loader: "style-loader"} :MiniCssExtractPlugin.loader,
					{ loader: "css-loader", options: { url: false, sourceMap: true, modules: true } },
					{ loader: "less-loader", options: { sourceMap: true } }
				],
				exclude: /node_modules/,
			},
			{
        test: /\.(png|jpg)$/,
				loader: 'url-loader',
				options: {
					limit: 1,
					name: (pathData)=>{
						const fileFolder = pathData.match(/src\/pages(\S*)images\//)[1];
						return `${fileFolder}/images/[name].[ext]`;
					}
			}
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...getHtmlWebpackPlugin(),
    new MiniCssExtractPlugin({
			filename: "[name]/[name].css",
		}),
  ],
  optimization: {
		minimizer: [//压缩js
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: false
			}),
			new OptimizeCSSAssetsPlugin({})
		],
		splitChunks: { //压缩css
			cacheGroups: {
				styles: {
					name: "styles",
					test: /\.css$/,
					chunks: "all",
					enforce: true
				}
			}
		}
	},
  devServer: {
		port: 8080,
		// open: true,
	},
})