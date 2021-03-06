const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
var ManifestPlugin = require('webpack-manifest-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const dev = process.env.NODE_ENV === "dev"


const dev = true

let cssLoaders = [
  	{
  		loader: 'css-loader',
  		options: {
  			importLoaders: 1,
  			minimize: !dev
  		}
  	}
]


if(!dev) {
	cssLoaders.push({
  		loader: 'postcss-loader',
  		options: {
  			plugins: (loader) => [
		      	require('autoprefixer')({
		      		browsers: ['last 2 versions', 'ie > 8']
		      	}),
		    ]
  		}
  	})
}


let config = {
	resolve: {
		alias: {
		  	'@': path.resolve('./assets/'),
		  	'@css': path.resolve('./assets/css/'),
		  	'@js': path.resolve('./assets/js/'),
		},
	},
	
	entry: {
		app: ['./assets/css/app.scss', './assets/js/app.js']
	},
	watch: dev,
	output: {
		path: path.resolve('./public/assets'),
		filename: dev ? '[name].js' : '[name].[chunkhash:8].js',
		publicPath: "/assets/"
	},
	devtool: dev ? "cheap-module-eval-source-map" : false,
	devServer: {
	  	contentBase: path.resolve("./public"),
	  	sockjsPrefix: '/assets'
	},
	module: {
		rules: [
			{
				enforce: "pre",
				test: /\.js$/,
	      		exclude: /(node_modules|bower_components)/,
	      		use: ['babel-loader']
			},
			{
				test: /\.js$/,
	      		exclude: /(node_modules|bower_components)/,
	      		use: ['babel-loader']
			},
			{
		        test: /\.css$/,
		        use: ExtractTextPlugin.extract({
		          	fallback: "style-loader",
		          	use: cssLoaders
		        })
	      	},
			{
		        test: /\.scss$/,
		        use: ExtractTextPlugin.extract({
		          	fallback: "style-loader",
		          	use: [
			        	...cssLoaders,
			        	'sass-loader'
			        ]
		        })
	      	},
	      	{
		        test: /\.(jpe?g|png|gif|svg)$/,
		        use: [
		          	{
			            loader: 'url-loader',
			            options: {
			              	limit: 8192,
			              	name: '[name].[hash:7].[ext]'
			            }
		          	},
		          	{
		          		loader: 'img-loader',
			            options: {
			            	enabled: !dev,
			            }
		          	}
		        ]
		    }
		]
	},
	plugins: [
		new ExtractTextPlugin({
			filename: dev ? '[name].css' : '[name].[contenthash:8].css',
			disable: dev
		}),
		
	]
}

let pathsToClean = ['dist']
let cleanOptions = {
  	root:     path.resolve('./'),
  	verbose:  true,
  	dry:      false
}

if(!dev) {
	config.plugins.push(new UglifyJsPlugin({
		sourceMap: false
	}))
	config.plugins.push(new ManifestPlugin())
	config.plugins.push(new CleanWebpackPlugin(pathsToClean, cleanOptions))
}

module.exports = config