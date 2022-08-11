import path from 'path';
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import JsonMinimizerPlugin from 'json-minimizer-webpack-plugin';


export default {
    entry: "./build/front/index.js",
    mode: "production",
    // devtool: 'inline-source-map',
    output: {
        path: path.join(process.cwd(), "/dist"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                                modules: {
                                auto: true,
                                localIdentName: '[hash:base64]'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(vert|frag)$/i,
                type: 'asset/source'
            }
        ]
        },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/front/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: './src/front/assets',
                        to: 'assets'
                    }
                ]
            }    
        ),
    ],
    performance: {
        hints: false
    },
    resolve: {
        extensions: [ '.js' ],
        },
        optimization: {
            minimize: true,
            minimizer: [
                '...', 
                new CssMinimizerPlugin(),
                new JsonMinimizerPlugin()
            ],
    }
}
